import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { parse } from "yaml";
import { readReviewTargets } from "./review-targets.mjs";
import { gunzipSync } from "node:zlib";
import { recentGrowth } from "../src/data/recent-growth.ts";

const buildRoot = process.argv[2] || "dist";
const previewIds = new Set(buildRoot === "dist-review" ? readReviewTargets() : []);

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const dates = new Map();
for (const file of walk("src/pages").filter(file => file.endsWith(".astro"))) {
  assert(!/lastUpdated\s*=\s*"\d{4}-\d{2}-\d{2}"/.test(fs.readFileSync(file,"utf8")), `Duplicate page-specific date literal: ${file}`);
}
for (const file of walk("src/content").filter((file) => file.endsWith(".md"))) {
  const text = fs.readFileSync(file, "utf8");
  const data = parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "");
  const route = file.replaceAll("\\", "/").replace(/^src\/content\//, "").replace(/\.md$/, "");
  if (!data || ((data.public === false || data.status === "draft") && !previewIds.has(route))) continue;
  dates.set(route === "career/overview" ? "career" : route, {date: data.last_updated, publishedAt: data.published_at ?? undefined, series:data.series, order:data.order, source: file});
}
const registry = fs.readFileSync("src/lib/site.ts", "utf8").match(/export const staticPageLastUpdated[\s\S]*?= \{([\s\S]*?)\n\};/)[1];
for (const [, quoted, bare, date] of registry.matchAll(/(?:"([^"]*)"|([a-z-]+)):\s*"(\d{4}-\d{2}-\d{2})"/g)) {
  const route = quoted ?? bare;
  if (!dates.has(route)) dates.set(route, {date, source: "src/lib/site.ts"});
}
const sitemap = load(fs.readFileSync(`${buildRoot}/sitemap.xml`, "utf8"), {xmlMode: true});
const report = [];
for (const file of walk(buildRoot).filter((file) => file.endsWith(".html") && !file.endsWith("google57af630fc0ce16af.html"))) {
  const route = path.relative(buildRoot, file).replaceAll("\\", "/").replace(/\/index\.html$/, "").replace(/^index\.html$/, "");
  const expected = dates.get(route);
  assert(expected, `No explicit content date source: ${route}`);
  const $ = load(fs.readFileSync(file, "utf8"));
  if ($('meta[http-equiv="refresh"]').length) continue;
  const date = $('meta[name="last-updated"]').attr("content");
  if (route === "garden-notes") assert.equal(date, recentGrowth[0].date, "Garden Notes must include its latest public entry");
  assert.equal(date, expected.date, `Date source mismatch: ${route}`);
  assert.equal($('meta[property="article:modified_time"]').attr("content"), date, `SEO modified date: ${route}`);
  const searchDate = $('[data-pagefind-meta="last_updated"]');
  if (searchDate.length) assert.equal(searchDate.attr("content") ?? searchDate.text().trim(), date, `Search date mismatch: ${route}`);
  $(".content-entry[data-content-id]").each((_, node) => {
    const id = $(node).attr("data-content-id");
    const target = dates.get(id === "career/overview" ? "career" : id);
    assert(target, `Card date source missing: ${id}`);
    const [year, month, day] = target.date.split("-").map(Number);
    assert($(node).find(".content-entry-meta, .publication-date").text().includes(`${year}年${month}月${day}日`), `Card/navigation date mismatch: ${route} -> ${id}`);
    if (expected.source === "src/lib/site.ts") assert(date >= target.date, `Listing date predates a displayed article: ${route} -> ${id}`);
    if (expected.series && expected.order === 0 && expected.series === target.series)
      assert(date >= target.date, `Book/series cover date predates its chapter: ${route} -> ${id}`);
  });
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  const visible = $(".site-last-updated time, .document-header .content-last-updated time, .book-introduction-metadata .content-last-updated time").first();
  if (visible.length) assert.equal(visible.attr("datetime"), date, `Visible date mismatch: ${route}`);
  const graph = JSON.parse($('script[type="application/ld+json"]').first().text())["@graph"];
  const entity = graph.find((item) => item["@id"]?.endsWith("#webpage"));
  if (entity["@type"] === "ProfilePage") {
    assert(!Object.hasOwn(entity, "dateModified"), `Date-only profile metadata must not imply an exact update time: ${route}`);
  } else {
    assert.equal(entity.dateModified, date, `JSON-LD date mismatch: ${route}`);
  }
  const loc = `https://rosarium-tech.com/${route ? `${route}/` : ""}`;
  const url = sitemap("url").filter((_, node) => sitemap(node).find("loc").text() === loc);
  if (url.length) assert.equal(url.find("lastmod").text(), date, `Sitemap date mismatch: ${route}`);
  report.push({route, title: $("title").text(), last_updated: date, source: expected.source, visible: Boolean(visible.length)});
}
const feed = JSON.parse(fs.readFileSync(`${buildRoot}/feed.json`, "utf8"));
for (const file of fs.readdirSync(`${buildRoot}/pagefind/fragment`)) {
  const text = gunzipSync(fs.readFileSync(`${buildRoot}/pagefind/fragment/${file}`)).toString("utf8");
  const fragment = JSON.parse(text.slice(text.indexOf("{")));
  const route = decodeURIComponent(new URL(fragment.url, "https://rosarium-tech.com").pathname).replace(/^\/+|\/+$/g, "");
  assert.equal(fragment.meta.last_updated, dates.get(route)?.date, `Pagefind fragment date: ${route}`);
}
for (const item of feed.items) {
  const route = decodeURIComponent(new URL(item.url).pathname).replace(/^\/+|\/+$/g, "");
  assert.equal(item.date_modified, dates.get(route)?.date, `JSON Feed modified date: ${route}`);
  assert.equal(item.date_published, dates.get(route)?.publishedAt, `JSON Feed publication date: ${route}`);
}
for (const name of ["feed.xml", "rss.xml"]) {
  const rss = load(fs.readFileSync(`${buildRoot}/${name}`, "utf8"), {xmlMode:true});
  rss("item").each((_, node) => {
    const route = decodeURIComponent(new URL(rss(node).find("link").text()).pathname).replace(/^\/+|\/+$/g, "");
    const expected = dates.get(route)?.date;
    assert.equal(rss(node).find("atom\\:updated").text(), expected, `${name} updated: ${route}`);
    assert.equal(new Date(rss(node).find("pubDate").text()).toISOString().slice(0,10), expected, `${name} activity: ${route}`);
  });
}
fs.writeFileSync(`${buildRoot}/last-updated-audit.json`, JSON.stringify(report, null, 2) + "\n");
console.log(`Last-updated audit: ${report.length} HTML pages, explicit dates and consistent visible/JSON-LD/sitemap values.`);
