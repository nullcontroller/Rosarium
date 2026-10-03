import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { parse } from "yaml";

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const dates = new Map();
for (const file of walk("src/content").filter((file) => file.endsWith(".md"))) {
  const text = fs.readFileSync(file, "utf8");
  const data = parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "");
  if (!data || data.public === false || data.status === "draft") continue;
  const route = file.replaceAll("\\", "/").replace(/^src\/content\//, "").replace(/\.md$/, "");
  dates.set(route === "career/overview" ? "career" : route, {date: data.last_updated, source: file});
}
const registry = fs.readFileSync("src/lib/site.ts", "utf8").match(/export const staticPageLastUpdated[\s\S]*?= \{([\s\S]*?)\n\};/)[1];
for (const [, quoted, bare, date] of registry.matchAll(/(?:"([^"]*)"|([a-z-]+)):\s*"(\d{4}-\d{2}-\d{2})"/g)) {
  const route = quoted ?? bare;
  if (!dates.has(route)) dates.set(route, {date, source: "src/lib/site.ts"});
}
const sitemap = load(fs.readFileSync("dist/sitemap.xml", "utf8"), {xmlMode: true});
const report = [];
for (const file of walk("dist").filter((file) => file.endsWith(".html"))) {
  const route = file.replaceAll("\\", "/").replace(/^dist\//, "").replace(/\/index\.html$/, "").replace(/^index\.html$/, "");
  const expected = dates.get(route);
  assert(expected, `No explicit content date source: ${route}`);
  const $ = load(fs.readFileSync(file, "utf8"));
  const date = $('meta[name="last-updated"]').attr("content");
  assert.equal(date, expected.date, `Date source mismatch: ${route}`);
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  const visible = $(".site-last-updated time, .document-header .content-last-updated time").first();
  if (visible.length) assert.equal(visible.attr("datetime"), date, `Visible date mismatch: ${route}`);
  const graph = JSON.parse($('script[type="application/ld+json"]').first().text())["@graph"];
  const entity = graph.find((item) => item["@id"]?.endsWith("#webpage"));
  assert.equal(entity.dateModified, date, `JSON-LD date mismatch: ${route}`);
  const loc = `https://nullcontroller.github.io/Rosarium/${route ? `${route}/` : ""}`;
  const url = sitemap("url").filter((_, node) => sitemap(node).find("loc").text() === loc);
  if (url.length) assert.equal(url.find("lastmod").text(), date, `Sitemap date mismatch: ${route}`);
  report.push({route, title: $("title").text(), last_updated: date, source: expected.source, visible: Boolean(visible.length)});
}
fs.writeFileSync("dist/last-updated-audit.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Last-updated audit: ${report.length} HTML pages, explicit dates and consistent visible/JSON-LD/sitemap values.`);