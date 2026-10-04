import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { load } from "cheerio";
import { runAnalytics } from "./analytics-runtime.mjs";

const source = fs.readFileSync("src/components/GoogleAnalytics.astro", "utf8");
const script = load(source)("script[data-analytics-init]").text();

test("ordinary production readers initialize GA4 immediately, including mobile and CUBOT devices", () => {
  for (const userAgent of ["Mozilla/5.0 Chrome/140.0 Safari/537.36", "Mozilla/5.0 Firefox/142.0", "Mozilla/5.0 (iPhone) Version/18.0 Mobile Safari/604.1", "Mozilla/5.0 (Linux; Android 14; CUBOT KingKong) Chrome/140.0 Safari/537.36"]) {
    const result = runAnalytics(script, { navigator: { userAgent } });
    assert.equal(result.loaders.length, 1);
    assert.equal(result.loaders[0].async, true);
    assert.equal(new URL(result.loaders[0].src).searchParams.get("id"), "G-W5ZR0NKWGB");
    assert.equal(result.events[1][0], "config");
    assert.equal(result.events[1][1], "G-W5ZR0NKWGB");
  }
});

test("obvious automated clients do not load or initialize analytics", () => {
  for (const navigator of [{ webdriver: true }, ...["bot", "crawler", "spider", "HeadlessChrome/140.0", "Lighthouse", "PageSpeed", "Googlebot/2.1", "ExampleCrawler/1.0", "LinkPreview/1.0"].map((userAgent) => ({ userAgent }))]) {
    const result = runAnalytics(script, { navigator });
    assert.equal(result.loaders.length, 0);
    assert.equal(result.events.length, 0);
    assert.equal(result.initialized, false);
  }
});

test("local builds and preview deployments never send production analytics", () => {
  for (const location of [{ hostname: "localhost" }, { hostname: "127.0.0.1" }, { hostname: "[::1]" }, { hostname: "preview.example.com" }, { protocol: "http:" }, { pathname: "/another-repository/" }]) {
    const result = runAnalytics(script, { location });
    assert.equal(result.loaders.length, 0);
    assert.equal(result.events.length, 0);
  }
  assert(source.includes("import.meta.env.PROD"), "Astro dev must omit the initialization script");
});
