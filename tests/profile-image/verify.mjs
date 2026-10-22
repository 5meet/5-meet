// Real Next BFF, shared upload hook, and cropper; only upstream/S3 are controlled.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
const output = process.env.QA_OUTPUT ?? "/tmp/profile-image-qa";
await mkdir(output, { recursive: true });
const base = "http://127.0.0.1:3007", upstream = "http://127.0.0.1:4014";
const original = "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/users/original.jpg";
const children = [], results = [];
let browser;
function start(args, env = {}) {
  const child = spawn(process.execPath, args, { env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  const log = createWriteStream(path.join(output, `server-${children.length}.log`));
  child.stdout.pipe(log); child.stderr.pipe(log); children.push(child);
}
async function until(fn) {
  for (let i = 0; i < 200; i++) { if (await fn()) return; await new Promise(r => setTimeout(r, 100)); }
  throw Error("Condition timed out");
}
const ready = url => until(async () => { try { await fetch(url); return true; } catch { return false; } });
const state = async () => (await fetch(`${upstream}/__qa/state`)).json();
const mode = value => fetch(`${upstream}/__qa/mode?value=${value}`);
const record = name => { results.push(name); console.log(`PASS ${name}`); };
let imageBytes;
async function open(width = 1920, refresh = false) {
  await fetch(`${upstream}/__qa/reset`);
  const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 1080 } });
  await context.addCookies([{ name: "accessToken", value: "qa-token", url: base, httpOnly: true }, ...(refresh ? [{ name: "refreshToken", value: "qa-refresh", url: base, httpOnly: true }] : [])]);
  const page = await context.newPage(), puts = [], held = [];
  const control = { hold: false, fail: false };
  await page.route("https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/**", async route => {
    if (route.request().method() === "PUT") {
      puts.push({ headers: route.request().headers(), bytes: route.request().postDataBuffer() });
      if (control.hold) { held.push(route); return; }
      await route.fulfill({ status: control.fail ? 500 : 200, body: "", headers: { "Access-Control-Allow-Origin": "*" } });
    } else await route.fulfill({ contentType: "image/png", body: imageBytes });
  });
  await page.goto(`${base}/mypage`);
  if (process.env.QA_FONT_CSS) await page.addStyleTag({ content: await readFile(process.env.QA_FONT_CSS, "utf8") });
  const card = page.locator('section[aria-label="내 프로필"]');
  await card.getByText("기존 이름", { exact: true }).waitFor();
  await page.getByRole("button", { name: "프로필 수정", exact: true }).click();
  return { context, page, card, dialog: page.getByRole("dialog", { name: "프로필 수정하기" }), input: page.getByLabel("이름", { exact: true }), puts, held, control };
}
async function crop(page, { zoom = false } = {}) {
  await page.locator('input[type="file"]').setInputFiles({ name: "selected.png", mimeType: "image/png", buffer: imageBytes });
  const dialog = page.getByRole("dialog", { name: "프로필 이미지 조정" });
  const fab = page.getByRole("button", { name: "모임 만들기", exact: true });
  const box = await fab.boundingBox();
  assert.equal(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.closest('button[aria-label="모임 만들기"]') !== null, {x:box.x+box.width/2,y:box.y+box.height/2}), false);
  const apply = dialog.getByRole("button", { name: "적용", exact: true });
  await until(() => apply.isEnabled());
  if (zoom) { await dialog.getByLabel("이미지 확대 비율").fill("1.8"); }
  await apply.click(); await dialog.waitFor({ state: "detached" });
  assert((await page.getByRole("dialog").locator("img").getAttribute("src")).startsWith("blob:"));
}
const save = dialog => dialog.getByRole("button", { name: "수정하기", exact: true });
async function restored(page, image) {
  const card = page.locator('section[aria-label="내 프로필"]');
  await until(async () => await card.locator("img").getAttribute("src") === image);
  assert.equal(await card.locator("img").evaluate(img => img.complete && img.naturalWidth > 0), true);
}
try {
  start(["tests/profile-image/fixture-server.mjs"]); await ready(`${upstream}/__qa/state`);
  start(["node_modules/next/dist/bin/next", "dev", "--webpack", "--port", "3007", "--hostname", "127.0.0.1"], { NEXT_PUBLIC_CODEIT_API_URL: upstream, NEXT_PUBLIC_API_MOCKING: "disabled", NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local" });
  await ready(`${base}/api/auth/me`);
  browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined, args: ["--no-sandbox", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--disable-features=Vulkan"] });
  const generator = await browser.newPage();
  imageBytes = Buffer.from(await generator.evaluate(() => { const canvas = document.createElement("canvas"); canvas.width = 600; canvas.height = 400; const c = canvas.getContext("2d"); c.fillStyle = "#72caba"; c.fillRect(0,0,600,400); c.fillStyle = "#315a80"; c.fillRect(0,0,300,400); return canvas.toDataURL("image/png").split(",")[1]; }), "base64");
  await generator.close();
  let q;
  if (!process.env.QA_CAPTURE_ONLY) {
  q = await open();
  await crop(q.page, { zoom: true }); assert.equal((await state()).uploads.length, 0);
  await save(q.dialog).click(); await q.dialog.waitFor({ state: "detached" });
  let s = await state(); assert.equal(s.uploads.length, 1); assert.equal(s.uploads[0].body.folder, "users"); assert.equal(s.uploads[0].body.contentType, "image/jpeg"); assert.equal(q.puts.length, 1);
  assert.equal(q.puts[0].headers["content-type"], "image/jpeg"); assert.equal(q.puts[0].bytes.subarray(0,2).toString("hex"), "ffd8");
  assert.deepEqual(s.patches[0].body, { image: s.user.image });
  await restored(q.page, s.user.image);
  assert.deepEqual(await q.page.evaluate(async bytes => { const blob = new Blob([new Uint8Array(bytes)], {type:"image/jpeg"}); const bitmap = await createImageBitmap(blob); return [bitmap.width,bitmap.height]; }, [...q.puts[0].bytes]), [512,512]);
  await q.page.reload(); await q.page.getByRole("button", { name: "프로필 수정", exact: true }).waitFor(); await restored(q.page,s.user.image);
  record("Image-only save: actual crop/zoom creates 512px JPEG; users presign, PUT Content-Type/file, URL-only PATCH and reload persistence"); await q.context.close();

  q = await open(); await crop(q.page); await q.input.fill("  이름과 이미지  "); await save(q.dialog).click(); await q.dialog.waitFor({state:"detached"}); s=await state();
  assert.deepEqual(s.patches[0].body,{name:"이름과 이미지",image:s.user.image}); await q.card.getByText("이름과 이미지",{exact:true}).waitFor(); assert.equal(await q.page.getByText("이름과 이미지님",{exact:true}).count(),1);
  record("Name and image save together in one PATCH; profile and GNB name update"); await q.context.close();

  q=await open(); await crop(q.page); await q.dialog.getByRole("button",{name:"취소",exact:true}).click(); assert.equal((await state()).uploads.length,0); assert.equal((await state()).patches.length,0); await restored(q.page,original);
  await q.page.getByRole("button",{name:"프로필 수정",exact:true}).click(); assert.equal(await q.dialog.locator("img").getAttribute("src"),original);
  record("Cancel after crop performs no upload/PATCH; old image restored on reopen"); await q.context.close();

  q=await open(); await q.page.locator('input[type="file"]').setInputFiles({name:"selected.png",mimeType:"image/png",buffer:imageBytes}); await q.page.getByRole("dialog",{name:"프로필 이미지 조정"}).getByRole("button",{name:"취소",exact:true}).click(); assert.equal(await q.dialog.locator("img").getAttribute("src"),original);
  await q.page.locator('input[type="file"]').setInputFiles({name:"bad.txt",mimeType:"text/plain",buffer:Buffer.from("bad")}); await q.dialog.getByRole("alert").waitFor();
  await q.page.locator('input[type="file"]').setInputFiles({name:"empty.png",mimeType:"image/png",buffer:Buffer.alloc(0)}); await q.dialog.getByRole("alert").filter({hasText:"비어"}).waitFor();
  assert.equal((await state()).uploads.length,0); record("Crop cancel, unsupported type and empty file retain original without requests"); await q.context.close();

  for (const failure of ["presign", "storage", "profile", "network"]) {
    q=await open(); await crop(q.page); await q.input.fill("실패 입력 유지");
    if(failure==="presign")await mode("presign-error"); if(failure==="storage")q.control.fail=true; if(failure==="profile")await mode("error");
    if(failure==="network")await q.page.route("**/api/mypage/profile",route=>route.abort("failed"),{times:1});
    await save(q.dialog).click(); await q.dialog.getByRole("alert").waitFor(); assert.equal(await q.input.inputValue(),"실패 입력 유지"); assert((await q.dialog.locator("img").getAttribute("src")).startsWith("blob:")); await restored(q.page,original);
    const before=await state(); assert.equal(before.user.image,original); assert.equal(before.patches.length,failure==="profile"?1:0);
    await mode("success");q.control.fail=false;await save(q.dialog).click();await q.dialog.waitFor({state:"detached"});s=await state();
    assert.equal(s.uploads.length,["profile","network"].includes(failure)?1:2); assert.equal(q.puts.length,failure==="presign"?1:["profile","network"].includes(failure)?1:2); await restored(q.page,s.user.image);
    record(`${failure} failure keeps saved image, edited name and crop; retry succeeds${["profile","network"].includes(failure)?" without reupload":""}`);await q.context.close();
  }

  q=await open();await crop(q.page);await mode("error");await save(q.dialog).click();await q.dialog.getByRole("alert").waitFor();
  await crop(q.page);await mode("success");await save(q.dialog).click();await q.dialog.waitFor({state:"detached"});s=await state();assert.equal(s.uploads.length,2);assert.equal(q.puts.length,2);assert.equal(s.user.image,"https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/users/2.jpg");await restored(q.page,s.user.image);
  record("Selecting a different crop after PATCH failure uploads the new file instead of reusing old URL");await q.context.close();

  q=await open();await crop(q.page);q.control.hold=true;await save(q.dialog).evaluate(b=>{b.click();b.click()});await until(()=>q.held.length===1);
  assert.equal(await q.input.isDisabled(),true);assert.equal(await q.dialog.locator('input[type="file"]').isDisabled(),true);assert.equal(await q.dialog.getByRole("button",{name:"취소",exact:true}).isDisabled(),true);
  await q.page.keyboard.press("Escape");await q.dialog.locator('button[aria-label="프로필 수정 닫기"]').evaluate(b=>b.click());assert(await q.dialog.isVisible());assert.equal((await state()).uploads.length,1);assert.equal((await state()).patches.length,0);
  await q.held[0].fulfill({status:200,body:""});await q.dialog.waitFor({state:"detached"});assert.equal((await state()).patches.length,1);
  record("Held upload blocks repeat save, inputs, cancel, close and Escape until one PATCH completes");await q.context.close();

  q=await open();await q.page.clock.install();await crop(q.page);q.control.hold=true;await save(q.dialog).click();await until(()=>q.held.length===1);
  const accountA=(await state()).user;let accountB={...accountA,id:8,name:"다른 계정",email:"b@example.invalid"};let patchCalls=0;
  await q.page.route("**/api/proxy/users/me",route=>route.fulfill({json:accountB}));
  await q.page.route("**/api/mypage/profile",route=>{patchCalls++;accountB={...accountB,...route.request().postDataJSON()};return route.fulfill({json:accountB})});
  await q.page.clock.fastForward(61000);
  for(const value of ["hidden","visible"])await q.page.evaluate(visibility=>{Object.defineProperty(document,"visibilityState",{configurable:true,value:visibility});window.dispatchEvent(new Event("visibilitychange"))},value);
  await q.card.getByText("다른 계정",{exact:true}).waitFor();await q.page.getByRole("button",{name:"프로필 수정",exact:true}).click();await crop(q.page);await save(q.dialog).click();await until(()=>q.held.length===2);
  await q.held[0].fulfill({status:200,body:""});await q.page.waitForTimeout(150);assert.equal(patchCalls,0);assert(await q.dialog.isVisible());assert.equal(await q.input.isDisabled(),true);
  await q.held[1].fulfill({status:200,body:""});await q.dialog.waitFor({state:"detached"});assert.equal(patchCalls,1);await restored(q.page,accountB.image);await q.card.getByText("다른 계정",{exact:true}).waitFor();
  record("Account switch during upload blocks old account PATCH and keeps current account save independent");await q.context.close();

  q=await open(1920,true);await crop(q.page);await mode("presign-refresh");await save(q.dialog).click();await q.dialog.waitFor({state:"detached"});s=await state();assert.equal(s.refreshes,1);assert.equal(s.uploads.length,2);assert.equal(s.uploads[1].authorization,"Bearer qa-refreshed");assert.equal(q.puts.length,1);
  record("Presign authentication refresh reuses common BFF and retries once before PUT");await q.context.close();

  q=await open();await crop(q.page);await mode("presign-unauthorized");await save(q.dialog).click();await q.dialog.getByRole("alert").filter({hasText:"로그인"}).waitFor();assert.equal(q.puts.length,0);assert.equal((await state()).patches.length,0);await restored(q.page,original);
  record("Expired presign authentication retains old profile and offers login guidance");await q.context.close();

  q=await open();
  for(const data of [{},{image:"https://outside.example/avatar.jpg"},{image:"https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com.outside.example/avatar.jpg"},{image:"blob:x"},{image:"http://example.invalid/x"},{image:123},{image:null},{image:"https://example.invalid/x",companyName:"x"},{name:" ",image:"https://example.invalid/x"}])assert.equal((await q.context.request.patch(`${base}/api/mypage/profile`,{data})).status(),400);
  const anonymous=await browser.newContext();assert.equal((await anonymous.request.patch(`${base}/api/mypage/profile`,{data:{image:"https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/users/anonymous.jpg"}})).status(),401);await anonymous.close();assert.equal((await state()).patches.length,0);
  record("BFF rejects invalid image protocols/types, empty/unknown fields, invalid names and anonymous writes");await q.context.close();

  }
  for(const width of [1920,744,375]){q=await open(width);
    const fab=q.page.getByRole("button",{name:"모임 만들기",exact:true}),box=await fab.boundingBox();
    assert.equal(await q.page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('button[aria-label="모임 만들기"]')!==null,{x:box.x+box.width/2,y:box.y+box.height/2}),false);
    await crop(q.page);await q.page.addStyleTag({content:"nextjs-portal{display:none}"});assert((await q.page.evaluate(()=>document.documentElement.scrollWidth))<=width);await q.page.screenshot({path:path.join(output,`profile-image-preview-${width}.png`),fullPage:true});
    q.control.hold=true;await save(q.dialog).click();await until(()=>q.held.length===1);await q.page.screenshot({path:path.join(output,`profile-image-saving-${width}.png`),fullPage:true});await q.held[0].fulfill({status:200,body:""});await q.dialog.waitFor({state:"detached"});await restored(q.page,(await state()).user.image);await q.page.screenshot({path:path.join(output,`profile-image-saved-${width}.png`),fullPage:true});record(`${width}px preview, saving and saved layout without horizontal overflow`);await q.context.close();}
}finally{await browser?.close();for(const child of children.reverse())child.kill("SIGTERM");await writeFile(path.join(output,process.env.QA_CAPTURE_ONLY ? "capture-results.json" : "results.json"),JSON.stringify(results,null,2));}
