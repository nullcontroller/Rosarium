import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import YAML from "yaml";
import { load } from "cheerio";
import { publicEntry, publishedEntry } from "../src/lib/site.ts";
const report = JSON.parse(fs.readFileSync("migration/zenn-recovery-2026-10-05.json", "utf8"));
const digest = (raw) => crypto.createHash("sha256").update(raw).digest("hex");
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
const feeds = ["feed.xml", "feed.json", "rss.xml"].map((name) => fs.readFileSync(`dist/${name}`, "utf8"));
const counts = {};
for (const record of report.entries) {
  counts[record.lifecycle] = (counts[record.lifecycle] ?? 0) + 1;
  if (record.lifecycle === "DELETE") { assert.equal(record.original_slug, "test"); assert.equal(record.recovered, true); continue; }
  assert.equal(digest(fs.readFileSync(record.source_snapshot)), record.source_sha256);
  const raw = fs.readFileSync(`src/content/${record.destination}.md`, "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const data = YAML.parse(match[1]);
  assert.equal(digest(raw.slice(match[0].length)), record.destination_body_sha256, `Recovered body changed: ${record.destination}`);
  assert.equal(data.lifecycle, record.lifecycle.toLowerCase());
  assert.equal(data.published_at ?? null, record.original_published_at);
  assert.equal(publishedEntry({ data }), true);
  const html = fs.readFileSync(`dist/${record.destination}/index.html`, "utf8");
  const $ = load(html);
  const canonical = `https://nullcontroller.github.io/Rosarium/${record.destination}/`;
  assert.equal($("h1").text(), data.title);
  assert.equal($('link[rel="canonical"]').attr("href"), canonical);
  const note = $(".content-lifecycle-note");
  if (record.lifecycle === "ACTIVE") assert.equal(note.length, 0);
  else {
    assert.equal(note.length, 1);
    assert(note.text().includes(record.reason));
    assert.equal(note.attr("data-lifecycle"), data.lifecycle);
  }
  if (record.lifecycle === "RETIRED") {
    assert.equal(publicEntry({ data }), false);
    assert.match($('meta[name="robots"]').attr("content"), /noindex/);
    assert.equal($("[data-pagefind-body]").length, 0);
    assert.equal($("article[data-pagefind-ignore]").length, 1);
    assert.equal($('meta[http-equiv="refresh"]').length, 0);
    assert(!sitemap.includes(canonical));
    for (const feed of feeds) assert(!feed.includes(canonical));
    for (const route of ["", "ai", "dx", "practices", "essays", "books"]) {
      const index = load(fs.readFileSync(`dist/${route ? route + "/" : ""}index.html`, "utf8"));
      assert.equal(index(`[data-content-id="${record.destination}"]`).length, 0);
    }
  } else {
    assert(sitemap.includes(canonical));
    assert(!$('meta[name="robots"]').attr("content").includes("noindex"));
    assert.equal($("[data-pagefind-body]").length, 1);
  }
}
assert.deepEqual(counts, { ACTIVE: 9, OBSOLETE: 3, RETIRED: 4, DELETE: 1 });
assert.equal(report.unrecoverable.length, 0);
console.log("Lifecycle audit: 16 original snapshots, publication dates, stable URLs; ACTIVE=9, OBSOLETE=3, RETIRED=4; one deleted test excluded. Retired content is readable, noindex, absent from search/discovery/sitemap/feed.");
