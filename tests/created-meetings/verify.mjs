import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const output = process.env.QA_OUTPUT ?? "/tmp/created-meetings-qa";
await mkdir(output, { recursive: true });
const processes = [], results = [];
const base = "http://127.0.0.1:3003", upstream = "http://127.0.0.1:4011";
const launch = (args, env = {}) => {
  const child = spawn(process.execPath, args, { env: { ...process.env, ...env }, stdio: ["pipe", "pipe", "pipe"] });
  const log = createWriteStream(path.join(output, `server-${processes.length}.log`));
  child.stdout.pipe(log); child.stderr.pipe(log); processes.push(child); return child;
};
const ready = async (url) => {
  for (let i = 0; i < 100; i++) { try { await fetch(url); return; } catch { await new Promise((r) => setTimeout(r, 300)); } }
  throw new Error(`Server did not start: ${url}`);
};
const state = async () => (await fetch(`${upstream}/__qa/state`)).json();
const reset = (mode) => fetch(`${upstream}/__qa/reset?mode=${mode}`);
const record = (name) => { results.push(name); console.log(`PASS ${name}`); };
let browser;
try {
  launch(["tests/created-meetings/fixture-server.mjs"]); await ready(`${upstream}/__qa/state`);
  launch(["node_modules/next/dist/bin/next", "dev", "--webpack", "--port", "3003", "--hostname", "127.0.0.1"], {
    NEXT_PUBLIC_CODEIT_API_URL: upstream, NEXT_PUBLIC_API_MOCKING: "disabled", NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local",
  });
  await ready(`${base}/api/mypage/created-meetings`);
  assert.equal((await fetch(`${base}/api/mypage/created-meetings`)).status, 401);
  for (const size of ["0", "51", "x", "1.5"]) assert.equal((await fetch(`${base}/api/mypage/created-meetings?size=${size}`)).status, 400);
  await reset("success");
  let response = await fetch(`${base}/api/mypage/created-meetings?type=joined&createdBy=99&size=10`, { headers: { Cookie: "accessToken=qa-token" } });
  assert.equal(response.status, 200);
  let request = (await state()).requests.find((r) => r.path.startsWith("/users/me/meetings"));
  const forwarded = new URL(request.path, upstream);
  assert.equal(forwarded.searchParams.get("type"), "created");
  assert.equal(forwarded.searchParams.get("createdBy"), null);
  assert.equal(forwarded.searchParams.get("sortBy"), "createdAt");
  await reset("success");
  response = await fetch(`${base}/api/mypage/created-meetings`, { headers: { Cookie: "accessToken=expired; refreshToken=qa-refresh" } });
  assert.equal(response.status, 200);
  assert(response.headers.get("set-cookie").includes("HttpOnly"));
  assert.equal((await state()).requests.filter((r) => r.path === "/auth/refresh").length, 1);
  record("Authentication, token refresh, size validation and server-enforced created filter");
  browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--disable-features=Vulkan"], headless: true });
  const open = async (mode = "success", viewport = { width: 375, height: 400 }) => {
    await reset(mode); const context = await browser.newContext({ viewport });
    await context.addCookies([{ name: "accessToken", value: "qa-token", url: base, httpOnly: true }]);
    const page = await context.newPage(); await page.goto(`${base}/mypage/created-meetings`);
    return { page, context };
  };
  let { page, context } = await open();
  await page.getByRole("article").nth(1).waitFor();
  assert.equal(await page.getByRole("article").count(), 2);
  assert.equal(await page.getByRole("button", { name: "예약 취소하기" }).count(), 0);
  assert.equal(await page.getByRole("link", { name: "리뷰 작성하기" }).count(), 0);
  for (const expected of [4, 6]) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("article").nth(expected - 1).waitFor();
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(800);
  for (const cursor of ["2", "4"]) assert.equal((await state()).requests.filter((r) => new URL(r.path, upstream).searchParams.get("cursor") === cursor).length, 1);
  const terminalRequests = (await state()).requests.length;
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  assert.equal((await state()).requests.length, terminalRequests);
  assert.equal(await page.getByRole("button", { name: "더 보기", exact: true }).count(), 0);
  const favorite = page.getByRole("article").nth(4).getByRole("button", { name: "좋아요", exact: true });
  await favorite.dblclick({ force: true });
  await page.getByRole("article").nth(4).getByRole("button", { name: "좋아요 취소", exact: true }).waitFor();
  assert.equal((await state()).requests.filter((r) => r.path.endsWith("/favorites")).length, 1);
  assert.equal(await page.getByRole("article").count(), 6);
  await page.getByRole("article").nth(4).getByRole("button", { name: "좋아요 취소", exact: true }).click();
  await page.getByRole("article").nth(4).getByRole("button", { name: "좋아요", exact: true }).waitFor();
  assert.deepEqual((await state()).requests.filter((r) => r.path.endsWith("/favorites")).map((r) => r.method), ["POST", "DELETE"]);
  record("Three-page infinite scroll, terminal stop, no extra actions and favorite updates on later pages");
  await context.close();
  ({ page, context } = await open("next-error"));
  await page.getByRole("article").nth(1).waitFor();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("button", { name: "추가 목록 다시 시도" }).waitFor({ timeout: 20000 });
  assert.equal(await page.getByRole("article").count(), 2);
  const attempts = (await state()).requests.length; await page.waitForTimeout(1500);
  assert.equal((await state()).requests.length, attempts);
  await fetch(`${upstream}/__qa/recover`); await page.getByRole("button", { name: "추가 목록 다시 시도" }).click();
  await page.getByRole("article").nth(3).waitFor(); record("Additional-page failure preserves data, stops automatic retries and recovers manually");
  await context.close();
  ({ page, context } = await open("favorite-error"));
  await page.getByRole("article").first().getByRole("button", { name: "좋아요", exact: true }).click();
  await page.getByRole("dialog").filter({ hasText: "찜 변경 테스트 오류" }).waitFor();
  assert.equal(await page.getByRole("article").first().getByRole("button", { name: "좋아요", exact: true }).count(), 1);
  record("Favorite failure keeps prior state and uses existing alert"); await context.close();
  ({ page, context } = await open("list-error"));
  await page.getByRole("button", { name: "다시 시도", exact: true }).waitFor({ timeout: 20000 });
  await fetch(`${upstream}/__qa/recover`); await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await page.getByRole("article").first().waitFor(); record("Initial query error and retry"); await context.close();
  ({ page, context } = await open("empty"));
  await page.getByText("아직 만든 모임이 없어요").waitFor();
  await page.screenshot({ path: path.join(output, "created-empty-mobile.png"), fullPage: true });
  record("Empty created list"); await context.close();
  for (const [label, width, height] of [["desktop", 1920, 1080], ["tablet", 744, 1133], ["mobile", 375, 812]]) {
    ({ page, context } = await open("success", { width, height }));
    await page.getByRole("article").first().waitFor(); await page.evaluate(() => document.fonts.ready);
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width);
    await page.screenshot({ path: path.join(output, `created-${label}.png`), fullPage: true });
    record(`${label}: no horizontal overflow and actual page capture`); await context.close();
  }
  ({ page, context } = await open());
  await page.getByRole("article").first().waitFor();
  await page.getByRole("link", { name: "나의 리뷰", exact: true }).first().click();
  await page.waitForURL((url) => url.pathname === "/mypage/reviews");
  await reset("empty");
  await page.getByRole("link", { name: "내가 만든 모임", exact: true }).click();
  await page.getByText("아직 만든 모임이 없어요").waitFor();
  assert.equal(await page.getByRole("article").count(), 0);
  record("Private list is rechecked after leaving and returning"); await context.close();
} finally {
  await browser?.close(); for (const child of processes.reverse()) child.kill("SIGTERM");
  await writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2));
}
