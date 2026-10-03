import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

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
  assert.equal(loaders.length, 1, `${file}: exactly one Google tag loader`);
  assert.equal(new URL(loaders.attr("src")).searchParams.get("id"), measurementId);
  assert(loaders.is("[async]"), `${file}: async Google tag loader`);
  const configs = $("script:not([src])").toArray().filter((el) => /gtag\(['"]config['"]/.test($(el).text()));
  assert.equal(configs.length, 1, `${file}: exactly one GA4 config`);
  assert($(configs[0]).text().includes(measurementId), `${file}: matching GA4 config ID`);
}
console.log(`Analytics audit: ${pages.length} HTML pages, one loader and config per page.`);