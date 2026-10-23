// Real Next BFF + local upstream. Hold responses to inspect the intermediate UI,
// including synchronous duplicate clicks before React renders disabled buttons.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
const output = process.env.QA_OUTPUT ?? ".qa-favorite-actions";
await mkdir(output, { recursive: true });
const base = "http://127.0.0.1:3006", upstream = "http://127.0.0.1:4012";
const processes = [], results = [];
let browser;
function start(args) {
  const child = spawn(process.execPath, args, { env: { ...process.env,
    NEXT_PUBLIC_CODEIT_API_URL: upstream, NEXT_PUBLIC_API_MOCKING: "disabled", NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local" }, stdio: ["ignore", "pipe", "pipe"] });
  const log = createWriteStream(path.join(output, `server-${processes.length}.log`));
  child.stdout.pipe(log); child.stderr.pipe(log); processes.push(child);
}
async function until(predicate) {
  for (let i = 0; i < 150; i++) { if (await predicate()) return; await new Promise(r => setTimeout(r, 100)); }
  throw Error("Condition timed out");
}
const ready = url => until(async () => { try { await fetch(url); return true; } catch { return false; } });
const record = name => { results.push(name); console.log(`PASS ${name}`); };
async function open(list, width = 1440) {
  await fetch(`${upstream}/__qa/reset`);
  const context = await browser.newContext({ viewport: { width, height: 1000 } });
  await context.addCookies([{ name: "accessToken", value: "qa-token", url: base, httpOnly: true }]);
  const page = await context.newPage();
  await page.goto(`${base}/mypage/${list === "joined" ? "meetings" : "created-meetings"}`);
  await page.getByRole("article").nth(1).waitFor();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("article").nth(3).waitFor();
  await page.waitForLoadState("networkidle");
  const held = [], requests = [];
  await page.route(`**/api/mypage/${list}-meetings/*/favorite`, route => { requests.push(route.request()); held.push(route); });
  return { context, page, held, requests, cards: page.getByRole("article") };
}
const heart = card => card.locator("fieldset button");
const field = card => card.locator("fieldset");
const click = button => button.evaluate(b => { b.click(); b.click(); });
async function succeed(route) { await route.fulfill({ response: await route.fetch() }); }
async function unchangedAppearance(card, before) {
  const after = await card.locator("fieldset").evaluate(f => ({ field: getComputedStyle(f).opacity, button: getComputedStyle(f.querySelector("button")).opacity }));
  assert.deepEqual(after, before);
  assert.equal(await heart(card).isEnabled(), true);
  assert.equal(await field(card).getAttribute("aria-busy"), "false");
}
try {
  start(["tests/mypage-shell/fixture-server.mjs"]); await ready(`${upstream}/__qa/state`);
  start(["node_modules/next/dist/bin/next", "dev", "--webpack", "--port", "3006", "--hostname", "127.0.0.1"]);
  await ready(`${base}/api/auth/me`);
  browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--disable-features=Vulkan"] });
  for (const list of ["joined", "created"]) {
    let { context, page, cards, held, requests } = await open(list);
    const before = await field(cards.nth(1)).evaluate(f => ({ field: getComputedStyle(f).opacity, button: getComputedStyle(f.querySelector("button")).opacity }));
    await click(heart(cards.nth(0))); await until(() => held.length === 1);
    await field(cards.nth(0)).and(page.locator('[aria-busy="true"]')).waitFor();
    await page.waitForTimeout(250); // Allow CSS opacity transitions to settle.
    await unchangedAppearance(cards.nth(1), before);
    await unchangedAppearance(cards.nth(2), before);
    if (list === "joined") {
      assert.equal(await cards.nth(0).getByRole("button", { name: "예약 취소하기" }).isDisabled(), true);
      // Programmatic clicks also cannot bypass the synchronous cancellation guard.
      await cards.nth(0).getByRole("button", { name: "예약 취소하기" }).evaluate(b => b.click());
      assert.equal(await page.getByRole("dialog").count(), 0);
    }
    await page.screenshot({ path: path.join(output, `${list}-one-pending.png`), fullPage: true });
    await click(heart(cards.nth(1))); await until(() => held.length === 2);
    assert.equal(await field(cards.nth(1)).getAttribute("aria-busy"), "true");
    await succeed(held[1]);
    await cards.nth(1).getByRole("button", { name: "좋아요 취소", exact: true }).waitFor();
    assert.equal(await field(cards.nth(0)).getAttribute("aria-busy"), "true");
    await succeed(held[0]);
    await cards.nth(0).getByRole("button", { name: "좋아요 취소", exact: true }).waitFor();
    assert.equal(requests.length, 2);
    assert.equal(await heart(cards.nth(0)).isEnabled(), true);
    await heart(cards.nth(0)).click(); await until(() => held.length === 3);
    assert.equal(requests[2].method(), "DELETE"); await succeed(held[2]);
    await cards.nth(0).getByRole("button", { name: "좋아요", exact: true }).waitFor();
    record(`${list}: other cards keep opacity and clicks; duplicate prevented; reverse-order concurrent success; unlike`);
    await context.close();

    ({ context, page, cards, held } = await open(list));
    let queries = 0;
    page.on("request", r => { if (new URL(r.url()).pathname === `/api/mypage/${list}-meetings`) queries++; });
    await click(heart(cards.nth(0))); await click(heart(cards.nth(1)));
    await until(() => held.length === 2);
    await held[0].fulfill({ status: 409, json: { message: "찜 변경 테스트 오류" } });
    await page.getByRole("dialog").filter({ hasText: "찜 변경 테스트 오류" }).waitFor();
    assert.equal(queries, 0);
    assert.equal(await field(cards.nth(1)).getAttribute("aria-busy"), "true");
    await succeed(held[1]); await until(() => queries > 0);
    await page.waitForLoadState("networkidle");
    assert.equal(await cards.nth(0).getByRole("button", { name: "좋아요", exact: true }).count(), 1);
    assert.equal(await cards.nth(1).getByRole("button", { name: "좋아요 취소", exact: true }).count(), 1);
    await page.getByRole("dialog").getByRole("button", { name: "확인", exact: true }).click();
    await heart(cards.nth(0)).click(); await until(() => held.length === 3); await succeed(held[2]);
    await cards.nth(0).getByRole("button", { name: "좋아요 취소", exact: true }).waitFor();
    record(`${list}: failure waits for another card; reconciliation preserves success; failed card can retry`);
    await context.close();

    ({ context, page, cards, held } = await open(list));
    let oldListResponse, oldListRoute;
    await page.route(`**/api/mypage/${list}-meetings?*`, async route => {
      oldListResponse = await route.fetch(); oldListRoute = route;
    });
    await heart(cards.nth(0)).click(); await until(() => held.length === 1);
    await held[0].fulfill({ status: 409, json: { message: "목록 재조회 테스트 오류" } });
    await until(() => Boolean(oldListRoute));
    await page.getByRole("dialog").getByRole("button", { name: "확인", exact: true }).click();
    await heart(cards.nth(1)).click(); await until(() => held.length === 2);
    await succeed(held[1]);
    await cards.nth(1).getByRole("button", { name: "좋아요 취소", exact: true }).waitFor();
    // This GET was captured before the second favorite request succeeded.
    await oldListRoute.fulfill({ response: oldListResponse }).catch(() => {});
    await page.waitForTimeout(250);
    assert.equal(await cards.nth(1).getByRole("button", { name: "좋아요 취소", exact: true }).count(), 1);
    record(`${list}: delayed stale reconciliation response cannot overwrite a newer favorite`);
    await context.close();
  }
  let { context, page, cards, requests } = await open("joined");
  let cancellation;
  await page.route("**/api/mypage/joined-meetings/1", route => { cancellation = route; });
  await cards.nth(0).getByRole("button", { name: "예약 취소하기" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "예약 취소하기" }).evaluate(b => { b.click(); b.click(); });
  await until(() => Boolean(cancellation));
  for (let i = 0; i < 4; i++) {
    assert.equal(await heart(cards.nth(i)).isDisabled(), true);
    assert.equal(await field(cards.nth(i)).getAttribute("aria-busy"), "false");
    await heart(cards.nth(i)).evaluate(b => b.click());
  }
  assert.equal(requests.length, 0);
  await cancellation.fulfill({ status: 409, json: { message: "예약 취소 테스트 오류" } });
  await page.getByRole("dialog").filter({ hasText: "예약 취소 테스트 오류" }).waitFor();
  assert.equal(await cards.count(), 4); assert.equal(await heart(cards.nth(0)).isEnabled(), true);
  await page.getByRole("dialog").getByRole("button", { name: "확인", exact: true }).click();
  cancellation = null;
  await cards.nth(0).getByRole("button", { name: "예약 취소하기" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "예약 취소하기" }).click();
  await until(() => Boolean(cancellation)); await succeed(cancellation);
  await until(async () => await cards.count() === 3);
  assert.equal(await heart(cards.nth(0)).isEnabled(), true);
  record("joined: cancellation blocks favorites without marking them busy; failure unlocks; retry removes only canceled meeting");
  await context.close();
  for (const width of [375, 744]) {
    ({ context, page, cards } = await open("joined", width));
    await heart(cards.nth(0)).click();
    await field(cards.nth(0)).and(page.locator('[aria-busy="true"]')).waitFor();
    assert.equal(await heart(cards.nth(1)).isEnabled(), true);
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width);
    await page.screenshot({ path: path.join(output, `joined-pending-${width}.png`), fullPage: true });
    record(`joined ${width}px: isolated pending and no horizontal overflow`);
    await context.close();
  }
} finally {
  await browser?.close(); for (const child of processes.reverse()) child.kill("SIGTERM");
  await writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2));
}
