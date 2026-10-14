// End-to-end checks through the real Next BFF with a controlled local upstream.
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import http from "node:http";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const output = path.resolve(process.env.QA_OUTPUT || ".qa-my-meetings");
await mkdir(output, { recursive: true });
const processes = [];
const start = (args, env = {}) => {
  const child = spawn(process.execPath, args, {
    env: { ...process.env, ...env },
    stdio: ["pipe", "pipe", "pipe"],
  });
  const log = createWriteStream(
    path.join(output, `server-${processes.length}.log`),
  );
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  processes.push(child);
  return child;
};
const base = "http://127.0.0.1:3002";
const upstream = "http://127.0.0.1:4010";
async function ready(url) {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`Server did not start: ${url}`);
}
let browser, staticServer;
const results = [];
const record = (name) => {
  results.push(name);
  console.log(`PASS ${name}`);
};
async function pageFor(
  mode = "success",
  viewport = { width: 375, height: 812 },
) {
  await fetch(`${upstream}/__qa/reset?mode=${mode}`);
  const context = await browser.newContext({ viewport });
  await context.addCookies([
    { name: "accessToken", value: "qa-token", url: base, httpOnly: true },
  ]);
  const page = await context.newPage();
  await page.goto(`${base}/mypage/meetings`);
  return { page, context };
}
try {
  start(["tests/my-meetings/fixture-server.mjs"]);
  await ready(`${upstream}/__qa/state`);
  if (process.argv.includes("--build")) {
    const child = start(["node_modules/next/dist/bin/next", "build"], {
      NEXT_PUBLIC_CODEIT_API_URL: upstream,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local",
    });
    const code = await new Promise((r) => child.on("exit", r));
    assert.equal(code, 0, "Next build with local fixture must pass");
    record("Next production build with local upstream fixture");
  } else {
    start(
      [
        "node_modules/next/dist/bin/next",
        "dev",
        "--port",
        "3002",
        "--hostname",
        "127.0.0.1",
      ],
      {
        NEXT_PUBLIC_CODEIT_API_URL: upstream,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: "qa-local",
      },
    );
    await ready(`${base}/api/mypage/joined-meetings`);
    browser = await chromium.launch({
      executablePath: process.env.QA_CHROMIUM_EXECUTABLE || undefined,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      headless: true,
    });
    assert.equal(
      (await fetch(`${base}/api/mypage/joined-meetings`)).status,
      401,
    );
    assert.equal(
      (
        await fetch(`${base}/api/mypage/joined-meetings/1`, {
          method: "DELETE",
        })
      ).status,
      401,
    );
    record("Unauthenticated GET and DELETE return 401");
    for (const method of ["POST", "DELETE"]) {
      assert.equal(
        (
          await fetch(`${base}/api/mypage/joined-meetings/1/favorite`, {
            method,
          })
        ).status,
        401,
      );
      assert.equal(
        (
          await fetch(`${base}/api/mypage/joined-meetings/0/favorite`, {
            method,
          })
        ).status,
        400,
      );
    }
    record("Favorite BFF enforces authentication and valid meeting IDs");
    for (const size of ["0", "101", "x"])
      assert.equal(
        (await fetch(`${base}/api/mypage/joined-meetings?size=${size}`)).status,
        400,
      );
    assert.equal(
      (
        await fetch(`${base}/api/mypage/joined-meetings/0`, {
          method: "DELETE",
        })
      ).status,
      400,
    );
    record("Invalid page sizes and meeting IDs return 400");
    let { page, context } = await pageFor();
    await page.getByRole("button", { name: "예약 취소하기" }).waitFor();
    assert.equal(await page.getByRole("article").count(), 2);
    await page.getByRole("button", { name: "더 보기" }).click();
    await page.getByRole("article").nth(3).waitFor();
    assert.equal(
      await page.getByRole("button", { name: "예약 취소하기" }).count(),
      1,
    );
    const state = await (await fetch(`${upstream}/__qa/state`)).json();
    assert(state.requests.some((r) => r.path.includes("cursor=next")));
    assert(
      state.requests
        .filter((r) => r.path.startsWith("/meetings/joined"))
        .every((r) => r.authenticated),
    );
    record(
      "Authenticated list, cursor pagination and host/completed/canceled permissions",
    );
    assert.equal(
      await page
        .getByRole("link", { name: "리뷰 작성하기" })
        .getAttribute("href"),
      "/mypage/reviews",
    );
    record("Completed unreviewed meeting links to existing review screen");
    const like = page
      .getByRole("button", { name: "좋아요", exact: true })
      .first();
    await like.click();
    await page.locator('fieldset[aria-busy="true"]').first().waitFor();
    assert(await like.isDisabled());
    await page
      .getByRole("button", { name: "좋아요 취소", exact: true })
      .waitFor();
    await page.reload();
    await page
      .getByRole("button", { name: "좋아요 취소", exact: true })
      .click();
    await page
      .getByRole("button", { name: "좋아요 취소", exact: true })
      .waitFor({ state: "detached" });
    const favoriteRequests = (
      await (await fetch(`${upstream}/__qa/state`)).json()
    ).requests.filter((r) => r.path.endsWith("/favorites"));
    assert.deepEqual(
      favoriteRequests.map((r) => r.method),
      ["POST", "DELETE"],
    );
    assert(favoriteRequests.every((r) => r.authenticated));
    record(
      "Favorite add/removal persists across reload with authenticated requests and pending lock",
    );
    page.once("dialog", (d) => d.dismiss());
    await page.getByRole("button", { name: "예약 취소하기" }).click();
    assert.equal(
      (await (await fetch(`${upstream}/__qa/state`)).json()).deleted.length,
      0,
    );
    record("Cancel confirmation dismissal does not send DELETE");
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "예약 취소하기" }).click();
    await page.getByRole("button", { name: "처리 중..." }).waitFor();
    assert(await page.getByRole("button", { name: "처리 중..." }).isDisabled());
    await page
      .getByRole("link", { name: "작은 독서 습관 만들기" })
      .waitFor({ state: "detached" });
    assert.equal(
      (await (await fetch(`${upstream}/__qa/state`)).json()).requests.filter(
        (r) => r.method === "DELETE" && r.path.endsWith("/join"),
      ).length,
      1,
    );
    record("204 cancellation, pending disabled state and list refetch");
    await context.close();
    ({ page, context } = await pageFor("cancel-error"));
    await page.getByRole("button", { name: "예약 취소하기" }).waitFor();
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "예약 취소하기" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "예약 취소 테스트 오류" })
      .waitFor();
    assert.equal(await page.getByRole("article").count(), 2);
    record("Cancellation failure retains list and shows upstream message");
    await context.close();
    ({ page, context } = await pageFor("refetch-error"));
    await page.getByRole("button", { name: "예약 취소하기" }).waitFor();
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "예약 취소하기" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "예약은 취소되었지만" })
      .waitFor({ timeout: 20000 });
    assert.equal(
      await page.getByRole("link", { name: "작은 독서 습관 만들기" }).count(),
      0,
    );
    record("Successful cancellation remains removed if refetch fails");
    await context.close();
    ({ page, context } = await pageFor("next-error"));
    await page.getByRole("button", { name: "더 보기" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "추가 목록" })
      .waitFor({ timeout: 20000 });
    assert.equal(await page.getByRole("article").count(), 2);
    record("Next-page failure retains existing list and offers retry");
    await context.close();
    ({ page, context } = await pageFor("empty"));
    await page.getByText("아직 신청한 모임이 없어요").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator('section[aria-labelledby="my-meetings-title"]')
      .screenshot({ path: path.join(output, "empty-state.png") });
    record("Empty state");
    await context.close();
    ({ page, context } = await pageFor("favorite-error"));
    await page
      .getByRole("button", { name: "좋아요", exact: true })
      .first()
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "찜 변경 테스트 오류" })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "좋아요 취소", exact: true })
        .count(),
      0,
    );
    record("Favorite failure retains server state and shows error");
    await context.close();
    ({ page, context } = await pageFor("reviewed"));
    await page.getByRole("article").nth(1).waitFor();
    assert.equal(
      await page.getByRole("link", { name: "리뷰 작성하기" }).count(),
      0,
    );
    record("Already reviewed meetings do not offer review action");
    await context.close();
    ({ page, context } = await pageFor("success"));
    await page.getByRole("link", { name: "리뷰 작성하기" }).click();
    await page.waitForURL((url) => url.pathname === "/mypage/reviews");
    await page.getByRole("button", { name: "리뷰 작성하기" }).first().waitFor();
    record(
      "Review action navigates to the existing review UI without submitting a review",
    );
    await fetch(`${upstream}/__qa/reset?mode=empty-delayed`);
    await page.getByRole("link", { name: "나의 모임", exact: true }).click();
    await page.waitForURL((url) => url.pathname === "/mypage/meetings");
    assert.equal(await page.getByRole("article").count(), 0);
    await page.getByText("아직 신청한 모임이 없어요").waitFor();
    record(
      "Returning through client navigation refetches private list without previous cached meetings",
    );
    await context.close();
    ({ page, context } = await pageFor("list-error"));
    await page
      .getByRole("button", { name: "다시 시도" })
      .waitFor({ timeout: 20000 });
    await fetch(`${upstream}/__qa/reset`);
    await page.getByRole("button", { name: "다시 시도" }).click();
    await page.getByRole("button", { name: "예약 취소하기" }).waitFor();
    record("Initial query failure and successful retry");
    await context.close();
    for (const [label, width, height] of [
      ["desktop", 1920, 1080],
      ["tablet", 744, 1133],
      ["mobile", 375, 812],
    ]) {
      ({ page, context } = await pageFor("success", { width, height }));
      await page.getByRole("button", { name: "예약 취소하기" }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: path.join(output, `page-${label}.png`),
        fullPage: true,
      });
      const geometry = await page.evaluate(() => ({
        viewport: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      assert(geometry.scrollWidth <= width, `${label} must not overflow`);
      record(`${label} actual page capture without horizontal overflow`);
      await context.close();
    }
    if (process.env.QA_STORYBOOK_DIR) {
      const root = path.resolve(process.env.QA_STORYBOOK_DIR);
      staticServer = http.createServer(async (req, res) => {
        try {
          const pathname = new URL(req.url, "http://localhost").pathname;
          const file = path.join(
            root,
            pathname === "/" ? "index.html" : pathname,
          );
          const data = await readFile(file);
          res.setHeader(
            "Content-Type",
            {
              ".js": "text/javascript",
              ".css": "text/css",
              ".html": "text/html",
              ".json": "application/json",
              ".svg": "image/svg+xml",
            }[path.extname(file)] || "application/octet-stream",
          );
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end();
        }
      });
      await new Promise((r) => staticServer.listen(6007, "127.0.0.1", r));
      const entries = JSON.parse(
        await readFile(path.join(root, "index.json"), "utf8"),
      ).entries;
      const stories = Object.values(entries).filter((e) => e.type === "story");
      for (const entry of stories) {
        const p = await browser.newPage({
          viewport: {
            width:
              entry.name === "Small"
                ? 375
                : entry.name === "Medium"
                  ? 744
                  : 1920,
            height: 1080,
          },
        });
        const errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(
          `http://127.0.0.1:6007/iframe.html?id=${entry.id}&viewMode=story`,
        );
        await p.locator("#storybook-root").waitFor();
        await p.waitForTimeout(500);
        assert.equal(errors.length, 0, `${entry.id}: ${errors.join(";")}`);
        assert(!(await p.getByText("Oops! Something went wrong").count()));
        if (
          entry.title === "UI/DetailCard" &&
          ["Large", "Medium", "Small"].includes(entry.name)
        ) {
          await p.getByRole("article").waitFor();
          await p.evaluate(() => document.fonts.ready);
          const box = await p.getByRole("article").boundingBox();
          assert.equal(
            box.width,
            { Large: 958, Medium: 696, Small: 343 }[entry.name],
          );
          assert.equal(box.height, entry.name === "Small" ? 390 : 236);
          await p.getByRole("article").screenshot({
            path: path.join(output, `card-${entry.name.toLowerCase()}.png`),
          });
          record(
            `Storybook ${entry.name} card render: ${JSON.stringify(await p.getByRole("article").boundingBox())}`,
          );
        }
        if (entry.title === "UI/DetailCard" && entry.name === "Completed") {
          await p.getByRole("link", { name: "리뷰 작성하기" }).waitFor();
          await p.evaluate(() => document.fonts.ready);
          await p
            .getByRole("article")
            .screenshot({ path: path.join(output, "card-completed.png") });
        }
        if (
          entry.title === "UI/DetailCard" &&
          ["NarrowColumn", "ParentPadding"].includes(
            entry.name.replaceAll(" ", ""),
          )
        ) {
          await p.getByRole("article").waitFor();
          await p.evaluate(() => document.fonts.ready);
          const article = p.getByRole("article");
          const image = article.locator("div").first();
          const box = await article.boundingBox();
          const imageBox = await image.boundingBox();
          assert.equal(box.width, 343);
          assert.equal(box.height, 390);
          assert.equal(imageBox.x, box.x);
          assert.equal(imageBox.width, 343);
          assert.equal(imageBox.height, 156);
          await article.screenshot({
            path: path.join(output, `card-${entry.name.toLowerCase()}.png`),
          });
          record(
            `Desktop viewport with ${entry.name}: narrow card follows parent width without duplicate gutters`,
          );
        }
        await p.close();
      }
      record(`All ${stories.length} PR stories rendered without page errors`);
    }
  }
} finally {
  if (browser) await browser.close();
  if (staticServer) staticServer.close();
  for (const child of processes) child.kill("SIGTERM");
  await writeFile(
    path.join(output, "results.json"),
    JSON.stringify(results, null, 2),
  );
}
