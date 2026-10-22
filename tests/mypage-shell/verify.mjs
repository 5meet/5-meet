import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const output = process.env.QA_OUTPUT ?? "/tmp/mypage-shell-qa";
await mkdir(output, { recursive: true });
const children = [], results = [];
const base = "http://127.0.0.1:3004", upstream = "http://127.0.0.1:4012";
const start = (args, env = {}) => {
  const child = spawn(process.execPath, args, { env: { ...process.env, ...env }, stdio: ["pipe", "pipe", "pipe"] });
  const log = createWriteStream(path.join(output, `server-${children.length}.log`));
  child.stdout.pipe(log); child.stderr.pipe(log); children.push(child);
};
async function ready(url) {
  for (let i = 0; i < 100; i++) { try { await fetch(url); return; } catch { await new Promise((r) => setTimeout(r, 300)); } }
  throw new Error(`Server not ready: ${url}`);
}
const record = (name) => { results.push(name); console.log(`PASS ${name}`); };
const state = async () => (await fetch(`${upstream}/__qa/state`)).json();
let browser;
try {
  start(["tests/mypage-shell/fixture-server.mjs"]); await ready(`${upstream}/__qa/state`);
  start(["node_modules/next/dist/bin/next", "dev", "--webpack", "--port", "3004", "--hostname", "127.0.0.1"], {
    NEXT_PUBLIC_CODEIT_API_URL: upstream, NEXT_PUBLIC_API_MOCKING: "disabled", NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local",
  });
  await ready(`${base}/api/auth/me`);
  browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined, headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--disable-features=Vulkan"] });
  const open = async (mode = "success", viewport = { width: 375, height: 812 }, signedIn = true) => {
    await fetch(`${upstream}/__qa/reset?mode=${mode}`);
    const context = await browser.newContext({ viewport });
    if (signedIn) await context.addCookies([{ name: "accessToken", value: "qa-token", url: base, httpOnly: true }]);
    const page = await context.newPage(); await page.goto(`${base}/mypage`);
    await page.waitForURL((url) => url.pathname === "/mypage/meetings");
    return { page, context };
  };
  let { page, context } = await open("delayed");
  await page.getByRole("status").filter({ hasText: "내 정보를" }).waitFor();
  assert.equal(await page.getByText("럽윈즈올", { exact: true }).count(), 0);
  await page.locator('section[aria-label="내 프로필"]').getByText("조회한 사용자", { exact: true }).waitFor();
  assert.equal(await page.getByText("layout@example.invalid", { exact: true }).count(), 1);
  assert((await page.locator('section[aria-label="내 프로필"] img').getAttribute("src")).includes("profile_female1"));
  record("Default path redirects, loading hides example data, real query fields and null-image fallback display");
  await page.locator('section[aria-label="내 프로필"]').evaluate((el) => el.setAttribute("data-qa-profile", "persisted"));
  const navigation = page.getByRole("navigation", { name: "마이페이지 메뉴" });
  for (const label of ["나의 리뷰", "내가 만든 모임", "나의 모임"]) {
    await navigation.getByRole("link", { name: label, exact: true }).click();
    await navigation.locator('a[aria-current="page"]').filter({ hasText: label }).waitFor();
    assert.equal(await page.locator('section[aria-label="내 프로필"]').getAttribute("data-qa-profile"), "persisted");
  }
  await page.getByRole("button", { name: "프로필 수정", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("dialog").getByRole("button", { name: "프로필 수정 닫기", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  record("Profile survives all tab transitions and existing edit dialog still opens/closes");
  await context.close();
  ({ page, context } = await open("user-error"));
  await page.getByRole("button", { name: "내 정보 다시 시도" }).waitFor();
  assert.equal(await page.locator('section[aria-label="내 프로필"]').count(), 0);
  await fetch(`${upstream}/__qa/user?mode=success`);
  await page.getByRole("button", { name: "내 정보 다시 시도" }).click();
  await page.locator('section[aria-label="내 프로필"]').waitFor();
  record("User query error hides profile and retry recovers using the existing query");
  await context.close();
  ({ page, context } = await open("signed-out"));
  await page.getByText("내 정보를 보려면 로그인해주세요.").waitFor();
  assert.equal(await page.locator('section[aria-label="내 프로필"]').count(), 0);
  assert.equal(await page.getByRole("link", { name: "로그인하기", exact: true }).getAttribute("href"), "/login");
  record("Expired authentication shows a login link without example or cached identity"); await context.close();
  context = await browser.newContext(); page = await context.newPage();
  await page.goto(`${base}/mypage`);
  assert.equal(new URL(page.url()).pathname, "/login");
  record("Existing protection redirects requests without authentication cookies to login"); await context.close();
  for (const [label, width, height] of [["desktop", 1920, 1080], ["tablet", 744, 1133], ["mobile", 375, 812], ["narrow", 320, 740]]) {
    ({ page, context } = await open("success", { width, height }));
    const profile = page.locator('section[aria-label="내 프로필"]');
    await profile.waitFor(); await page.evaluate(() => document.fonts.ready); await page.waitForLoadState("networkidle");
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width);
    const profileBox = await profile.boundingBox();
    const tabsBox = await page.getByRole("navigation", { name: "마이페이지 메뉴" }).boundingBox();
    const mainBox = await page.locator('h1').filter({ hasText: "마이페이지" }).locator('..').locator('> div').last().boundingBox();
    if (width >= 1024) {
      assert.equal(profileBox.width, 282); assert.equal(mainBox.width, 958);
      assert.equal(Math.round(mainBox.x - profileBox.x - profileBox.width), 40);
      assert(tabsBox.y < profileBox.y);
    } else {
      assert(tabsBox.y >= profileBox.y + profileBox.height);
      assert(Math.abs(tabsBox.x - profileBox.x) < 1);
      assert(Math.abs(tabsBox.width - profileBox.width) < 1);
    }
    await page.addStyleTag({ content: "nextjs-portal { display: none; }" });
    if (label !== "narrow") await page.screenshot({ path: path.join(output, `shell-${label}.png`), fullPage: true });
    record(`${label}: responsive layout geometry and no horizontal overflow`);
    if (process.env.QA_INTEGRATED === "1" && label === "mobile") {
      await page.getByRole("article").first().waitFor();
      await page.getByRole("button", { name: "좋아요", exact: true }).first().click();
      await page.getByRole("button", { name: "좋아요 취소", exact: true }).first().waitFor();
      await page.getByRole("button", { name: "예약 취소하기", exact: true }).first().click();
      await page.getByRole("dialog").getByRole("button", { name: "돌아가기", exact: true }).click();
      assert.equal((await state()).requests.filter((r) => r.method === "DELETE" && r.path.endsWith("/join")).length, 0);
      await page.getByRole("navigation", { name: "마이페이지 메뉴" }).getByRole("link", { name: "내가 만든 모임", exact: true }).click();
      await page.waitForURL((url) => url.pathname === "/mypage/created-meetings");
      await page.getByRole("button", { name: "예약 취소하기", exact: true }).waitFor({ state: "detached" });
      await page.getByRole("article").first().waitFor();
      assert.equal(await page.getByRole("button", { name: "예약 취소하기", exact: true }).count(), 0);
      record("Integrated PR101/109 list, favorite and cancel dialog behavior is retained");
    }
    await context.close();
  }
  ({ page, context } = await open("success", { width: 1920, height: 1080 }));
  await page.locator('section[aria-label="내 프로필"]').waitFor();
  await page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "모임 찾기", exact: true }).click();
  await page.waitForURL((url) => url.pathname === "/meetings/list");
  await fetch(`${upstream}/__qa/user?mode=delayed&name=${encodeURIComponent("새로 확인한 사용자")}`);
  await page.goBack({ waitUntil: "commit" });
  await page.getByRole("status").filter({ hasText: "내 정보를" }).waitFor();
  assert.equal(await page.locator('section[aria-label="내 프로필"]').isVisible(), false);
  await page.locator('section[aria-label="내 프로필"]').getByText("새로 확인한 사용자", { exact: true }).waitFor();
  record("Re-entering the private layout rechecks identity and hides old cached profile during validation");
  await context.close();
} finally {
  await browser?.close(); for (const child of children.reverse()) child.kill("SIGTERM");
  await writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2));
}
