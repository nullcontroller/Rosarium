import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { runAnalytics } from "./analytics-runtime.mjs";

const source = fs.readFileSync("src/components/GoogleAnalytics.astro", "utf8");
const measurementId = source.match(/const measurementId = "(G-[A-Z0-9]+)";/)?.[1];
assert(measurementId, "GA4 Measurement ID must have a single source");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const pages = walk("dist").filter((file) => file.endsWith(".html") && !file.endsWith("google57af630fc0ce16af.html"));
for (const file of pages) {
  const $ = load(fs.readFileSync(file, "utf8"));
  const loaders = $('script[src*="googletagmanager.com/gtag/js"]');
  assert.equal(loaders.length, 0, `${file}: no unconditional Google tag loader`);
  const initializers = $("script[data-analytics-init]");
  assert.equal(initializers.length, 1, `${file}: exactly one guarded initialization`);
  const script = initializers.text();
  const normal = runAnalytics(script);
  assert.equal(normal.loaders.length, 1, `${file}: production reader loads GA4`);
  assert.equal(normal.loaders[0].async, true);
  assert.equal(new URL(normal.loaders[0].src).searchParams.get("id"), measurementId);
  assert.equal(normal.events.length, 2, `${file}: one js and one config command`);
  assert.equal(normal.events[1][0], "config");
  assert.equal(normal.events[1][1], measurementId);
  for (const overrides of [{ navigator: { webdriver: true } }, { navigator: { userAgent: "Googlebot/2.1" } }, { location: { hostname: "localhost" } }]) {
    const excluded = runAnalytics(script, overrides);
    assert.equal(excluded.loaders.length, 0, `${file}: excluded clients do not load GA4`);
    assert.equal(excluded.events.length, 0, `${file}: excluded clients do not queue events`);
  }
}
console.log(`Analytics audit: ${pages.length} HTML pages, guarded production loader/config; automation and localhost excluded.`);
