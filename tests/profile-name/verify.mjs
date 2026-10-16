import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const output = process.env.QA_OUTPUT ?? "/tmp/profile-name-qa";
await mkdir(output, { recursive: true });
const children = [], results = [];
const base = "http://127.0.0.1:3005", upstream = "http://127.0.0.1:4013";
function start(args, env = {}) {
  const child = spawn(process.execPath, args, { env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  const log = createWriteStream(path.join(output, `server-${children.length}.log`)); child.stdout.pipe(log); child.stderr.pipe(log); children.push(child);
}
async function ready(url) {
  for (let i = 0; i < 100; i++) { try { await fetch(url); return; } catch { await new Promise((resolve) => setTimeout(resolve, 300)); } }
  throw new Error(`Server not ready: ${url}`);
}
const record = (name) => { results.push(name); console.log(`PASS ${name}`); };
const state = async () => (await fetch(`${upstream}/__qa/state`)).json();
const mode = (value) => fetch(`${upstream}/__qa/mode?value=${value}`);
let browser;
try {
  start(["tests/profile-name/fixture-server.mjs"]); await ready(`${upstream}/__qa/state`);
  start(["node_modules/next/dist/bin/next", "dev", "--webpack", "--port", "3005", "--hostname", "127.0.0.1"], {
    NEXT_PUBLIC_CODEIT_API_URL: upstream, NEXT_PUBLIC_API_MOCKING: "disabled", NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local",
  }); await ready(`${base}/api/auth/me`);
  browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined, headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--disable-features=Vulkan"] });
  const open = async (width = 1920, refresh = false) => {
    await fetch(`${upstream}/__qa/reset`);
    const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 1080 } });
    await context.addCookies([{ name: "accessToken", value: "qa-token", url: base, httpOnly: true }, ...(refresh ? [{ name: "refreshToken", value: "qa-refresh", url: base, httpOnly: true }] : [])]);
    const page = await context.newPage(); await page.goto(`${base}/mypage`);
    try {
      await page.locator('section[aria-label="내 프로필"]').getByText("기존 이름", { exact: true }).waitFor({ timeout: 15000 });
    } catch (error) {
      await page.screenshot({ path: path.join(output, "failure.png"), fullPage: true });
      console.log(await page.locator('section[aria-label="내 프로필"]').evaluate((el) => { const rows = []; for (let p = el; p; p = p.parentElement) rows.push({ tag: p.tagName, hidden: p.hidden, style: getComputedStyle(p).display, rect: p.getBoundingClientRect().toJSON() }); return rows; }));
      throw error;
    }
    await page.getByRole("button", { name: "프로필 수정", exact: true }).click();
    return { context, page, dialog: page.getByRole("dialog"), input: page.getByLabel("이름", { exact: true }) };
  };
  let { context, page, dialog, input } = await open();
  assert.equal(await dialog.locator('input[type="file"]').isDisabled(), true);
  await dialog.getByRole("button", { name: "수정하기", exact: true }).click(); await dialog.waitFor({ state: "detached" });
  assert.equal((await state()).patches.length, 0); record("Unchanged name closes without PATCH; connected editor disables image upload"); await context.close();

  ({ context, page, dialog, input } = await open());
  await input.fill("   "); assert(await dialog.getByRole("button", { name: "수정하기", exact: true }).isDisabled());
  assert.equal(await input.getAttribute("maxlength"), "20");
  await input.fill("  새 이름  "); await mode("delay");
  await dialog.getByRole("button", { name: "수정하기", exact: true }).dblclick();
  assert(await input.isDisabled()); assert(await dialog.getByRole("button", { name: "취소", exact: true }).isDisabled());
  await page.keyboard.press("Escape"); assert(await dialog.isVisible());
  await dialog.waitFor({ state: "detached" });
  assert.equal((await state()).patches.length, 1); assert.deepEqual((await state()).patches[0].body, { name: "새 이름" });
  await page.locator('section[aria-label="내 프로필"]').getByText("새 이름", { exact: true }).waitFor();
  await page.getByText("새 이름님", { exact: true }).waitFor();
  await page.reload(); await page.locator('section[aria-label="내 프로필"]').getByText("새 이름", { exact: true }).waitFor();
  record("Whitespace and length validation; pending spinner/lock; one name-only PATCH; profile/GNB/reload sync"); await context.close();

  ({ context, page, dialog, input } = await open(375));
  await mode("error"); await input.fill("실패 후 재시도"); await dialog.getByRole("button", { name: "수정하기", exact: true }).click();
  await dialog.getByRole("alert").waitFor(); assert.equal(await input.inputValue(), "실패 후 재시도");
  assert(await dialog.isVisible()); assert.equal((await state()).user.name, "기존 이름");
  await page.addStyleTag({ content: "nextjs-portal { display: none; }" });
  await page.screenshot({ path: path.join(output, "profile-save-error-mobile.png"), fullPage: true });
  await mode("success"); await dialog.getByRole("button", { name: "수정하기", exact: true }).click(); await dialog.waitFor({ state: "detached" });
  assert.equal((await state()).patches.length, 2); record("Failed save retains input/modal and old cache; explicit retry succeeds"); await context.close();

  ({ context, page, dialog, input } = await open());
  await mode("unauthorized"); await input.fill("만료 후 이름"); await dialog.getByRole("button", { name: "수정하기", exact: true }).click();
  await dialog.getByRole("alert").filter({ hasText: "다시 로그인" }).waitFor(); assert.equal(await input.inputValue(), "만료 후 이름");
  record("401 retains input and explains re-login without automatic mutation retry"); await context.close();

  ({ context, page, dialog, input } = await open(1920, true));
  await mode("refresh"); await input.fill("갱신 후 이름"); await dialog.getByRole("button", { name: "수정하기", exact: true }).click();
  await dialog.waitFor({ state: "detached" }); assert.equal((await state()).refreshes, 1);
  assert.equal((await state()).patches.length, 2); assert.equal((await state()).patches[1].authorization, "Bearer qa-refreshed");
  assert((await context.cookies()).some((cookie) => cookie.name === "accessToken" && cookie.value === "qa-refreshed"));
  record("Existing refresh helper renews cookie and retries authenticated PATCH once"); await context.close();

  ({ context, page, dialog, input } = await open());
  for (const data of [{ name: "" }, { name: "a".repeat(21) }, { name: "valid", image: "https://example.invalid/a" }]) {
    const response = await context.request.patch(`${base}/api/mypage/profile`, { data }); assert.equal(response.status(), 400);
  }
  assert.equal((await state()).patches.length, 0);
  const anonymous = await browser.newContext();
  assert.equal((await anonymous.request.patch(`${base}/api/mypage/profile`, { data: { name: "이름" } })).status(), 401);
  await anonymous.close(); record("Route rejects invalid names/extra fields and unauthenticated writes"); await context.close();

  ({ context, page, dialog, input } = await open());
  await page.route("**/api/mypage/profile", (route) => route.abort("failed"), { times: 1 });
  await input.fill("연결 실패 이름"); await dialog.getByRole("button", { name: "수정하기", exact: true }).click();
  await dialog.getByRole("alert").filter({ hasText: "연결이 불안정" }).waitFor();
  assert.equal(await input.inputValue(), "연결 실패 이름"); assert.equal((await state()).patches.length, 0);
  await dialog.getByRole("button", { name: "수정하기", exact: true }).click(); await dialog.waitFor({ state: "detached" });
  record("Network failure retains input and allows explicit retry without duplicate writes"); await context.close();

  for (const width of [1920, 744, 375]) {
    ({ context, page, dialog, input } = await open(width));
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width);
    await page.evaluate(() => document.fonts.ready); await page.addStyleTag({ content: "nextjs-portal { display: none; }" });
    await page.screenshot({ path: path.join(output, `profile-name-${width}.png`), fullPage: true });
    if (width === 375) {
      await mode("delay"); await input.fill("저장 중 이름"); await dialog.getByRole("button", { name: "수정하기", exact: true }).click();
      await dialog.locator('button[aria-busy="true"] svg').waitFor();
      await page.screenshot({ path: path.join(output, "profile-save-loading-mobile.png"), fullPage: true });
      await dialog.waitFor({ state: "detached" });
    }
    record(`${width}px editor layout and screenshot`); await context.close();
  }
} finally {
  await browser?.close(); for (const child of children.reverse()) child.kill("SIGTERM");
  await writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2));
}
