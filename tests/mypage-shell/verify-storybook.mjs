import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const root = path.resolve(process.argv[2]);
const server = http.createServer(async (req, res) => {
  try {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, "http://localhost").pathname)}`);
    if (!file.startsWith(`${root}/`)) { res.writeHead(403); res.end(); return; }
    const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
    res.setHeader("Content-Type", types[path.extname(file)] ?? "application/octet-stream");
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((resolve) => server.listen(6009, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--disable-features=Vulkan"], headless: true });
  const entries = Object.values(JSON.parse(await readFile(path.join(root, "index.json"), "utf8")).entries).filter((entry) => entry.type === "story");
  for (const entry of entries) {
    const width = entry.name === "Mobile" ? 375 : entry.name === "Tablet" ? 744 : 1920;
    const page = await browser.newPage({ viewport: { width, height: 1080 } });
    const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:6009/iframe.html?id=${entry.id}&viewMode=story`);
    await page.locator("#storybook-root").waitFor({ state: "attached" }); await page.waitForTimeout(300);
    assert.equal(errors.length, 0, `${entry.id}: ${errors.join("; ")}`);
    assert.equal(await page.getByText("Oops! Something went wrong").count(), 0);
    if (entry.title === "Features/Mypage/MyPageShell") {
      assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width);
      if (entry.name === "Loading") await page.getByRole("status").waitFor();
      if (entry.name === "Error") await page.getByRole("button", { name: "내 정보 다시 시도" }).waitFor();
      if (entry.name === "Signed Out") await page.getByRole("link", { name: "로그인하기" }).waitFor();
      if (["Desktop", "Tablet", "Mobile"].includes(entry.name)) {
        await page.locator('section[aria-label="내 프로필"]').waitFor();
        const profile = await page.locator('section[aria-label="내 프로필"]').boundingBox();
        const tabs = await page.getByRole("navigation", { name: "마이페이지 메뉴" }).boundingBox();
        const body = await page.getByLabel("탭 본문").boundingBox();
        if (width >= 1024) { assert.equal(profile.width, 282); assert.equal(body.width, 958); assert(tabs.y < profile.y); }
        else { assert(tabs.y >= profile.y + profile.height); assert(Math.abs(profile.width - body.width) < 1); }
        console.log(`PASS shell ${entry.name} layout`);
      }
    }
    await page.close();
  }
  console.log(`PASS all ${entries.length} profile/tab/shell stories`);
} finally { await browser?.close(); await new Promise((resolve) => server.close(resolve)); }
