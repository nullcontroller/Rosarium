import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import YAML from "yaml";
import { verifyRecoveredBody } from "./recovered-body.mjs";
import { getArchiveGroup, isCaseEntry, archiveLifecycles } from "../src/lib/archive.ts";
import { load } from "cheerio";
import { publicEntry, publishedEntry } from "../src/lib/site.ts";
const report = JSON.parse(fs.readFileSync("migration/zenn-recovery-2026-10-05.json", "utf8"));
const digest = (raw) => crypto.createHash("sha256").update(raw).digest("hex");
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
const feeds = ["feed.xml", "feed.json", "rss.xml"].map((name) => fs.readFileSync(`dist/${name}`, "utf8"));
const counts = {};
const archiveTop = load(fs.readFileSync("dist/retired/index.html", "utf8"));
const obsoleteIndex = load(fs.readFileSync("dist/retired/obsolete/index.html", "utf8"));
const obsoleteCasesIndex = load(fs.readFileSync("dist/retired/obsolete-cases/index.html", "utf8"));
const retiredIndex = load(fs.readFileSync("dist/retired/retired/index.html", "utf8"));
for (const [route, index] of [["retired", archiveTop], ["retired/obsolete", obsoleteIndex], ["retired/obsolete-cases", obsoleteCasesIndex], ["retired/retired", retiredIndex]]) {
  const canonical = `https://nullcontroller.github.io/Rosarium/${route}/`;
  assert.match(index('meta[name="robots"]').attr("content"), /noindex/);
  assert.equal(index('link[rel="canonical"]').attr("href"), canonical);
  assert.equal(index("[data-pagefind-body]").length, 0);
  assert.equal(index("main[data-pagefind-ignore]").length, 1);
  assert(!sitemap.includes(canonical));
  for (const feed of feeds) assert(!feed.includes(canonical));
}
assert.match(retiredIndex('meta[name="robots"]').attr("content"), /noindex/);
assert.equal(retiredIndex('link[rel="canonical"]').attr("href"), "https://nullcontroller.github.io/Rosarium/retired/retired/");
assert.equal(retiredIndex("[data-pagefind-body]").length, 0);
assert.equal(retiredIndex("main[data-pagefind-ignore]").length, 1);
assert(!sitemap.includes("https://nullcontroller.github.io/Rosarium/retired/retired/"));
for (const feed of feeds) assert(!feed.includes("https://nullcontroller.github.io/Rosarium/retired/retired/"));
const about = load(fs.readFileSync("dist/about/index.html", "utf8"));
assert.equal(about('main a[href="/Rosarium/retired/"]').length, 1);
const historical = fs.readdirSync("src/content", { recursive: true })
  .filter((file) => file.endsWith(".md"))
  .map((file) => ({ id: file.replaceAll("\\", "/").replace(/\.md$/, ""), data: YAML.parse(fs.readFileSync(`src/content/${file}`, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]) }))
  .filter((entry) => publishedEntry(entry) && !entry.data.source?.chapter_slug && ["obsolete", "retired"].includes(entry.data.lifecycle));
assert.equal(retiredIndex("[data-retired-id]").length, historical.filter((entry) => entry.data.lifecycle === "retired").length);
assert.equal(archiveTop("[data-history-id]").length, 0);
assert.equal(archiveTop("[data-archive-entrance]").length, 3);
assert.equal(retiredIndex("[data-history-id]").length + obsoleteIndex("[data-history-id]").length + obsoleteCasesIndex("[data-history-id]").length, historical.length);
for (const entry of historical) {
  const item = (entry.data.lifecycle === "obsolete" ? (isCaseEntry(entry) ? obsoleteCasesIndex : obsoleteIndex) : retiredIndex)(`[data-history-group="${entry.data.lifecycle}"] [data-history-id="${entry.id}"]`);
  assert.equal(item.length, 1);
  assert(item.closest("[data-archive-category]").length === 1);
  for (const route of ["cases", "books", "ai", "dx", "practices", "essays"]) {
    const index = load(fs.readFileSync(`dist/${route}/index.html`, "utf8"));
    assert.equal(index(`[data-content-id="${entry.id}"]`).length, 0);
  }
  assert(item.text().includes(entry.data.lifecycle_reason));
  assert.equal(item.find("time").last().attr("datetime"), entry.data.last_updated);
}
for (const group of archiveLifecycles) {
  assert.equal(archiveTop(`[data-archive-entrance="${group.id}"] small`).text(), `${historical.filter((entry) => getArchiveGroup(entry) === group.id).length}件`);
}
assert.equal(archiveTop('[data-archive-entrance="obsolete"] > span').text(), "OBSOLETE ARTICLE");
assert.equal(archiveTop('[data-archive-entrance="obsolete-cases"] > span').text(), "OBSOLETE CASE");
assert.equal(archiveTop('[data-archive-entrance="retired"] > span').text(), "RETIRED");
assert.equal(obsoleteIndex('[data-archive-category="実践事例"]').length, 0);
assert.equal(obsoleteCasesIndex('[data-history-id="cases/system-understanding"]').length, 1);
const nav = retiredIndex(".sidebar .nav-group").last();
assert.equal(retiredIndex('.sidebar a[href="/Rosarium/reference/"]').length, 0);
assert.equal(retiredIndex('.reference-edge-tab').length, 0);
assert.equal(retiredIndex('.reference-header-tool[href="/Rosarium/reference/"]').length, 0);
for (const [index, title] of [[obsoleteIndex, '旧記事'], [obsoleteCasesIndex, '旧事例'], [retiredIndex, '退役記事']]) {
  assert.equal(index('#page-toc-tab').text(), '目次');
  assert.equal(index('#reference-sidebar-tab, #reference-panel').length, 0);
  assert(index('#page-toc-panel a').length > 1, title);
  const desktopTargets = index('#page-toc-panel a').map((_, link) => index(link).attr('href')).get();
  assert.deepEqual(index('details[data-page-heading-toc] a').map((_, link) => index(link).attr('href')).get(), desktopTargets);
  for (const card of index('[data-history-id]').toArray()) {
    assert(desktopTargets.includes('#' + index(card).attr('id')));
  }
  for (const link of index('#page-toc-panel a').toArray()) {
    assert.equal(index(`[id="${index(link).attr('href').slice(1)}"]`).length, 1);
  }
}
assert.equal(retiredIndex('.sidebar [role="group"][aria-label="旧記事・退役記事"] a').attr("href"), "/Rosarium/retired/");
assert.deepEqual(nav.find(".nav-copy > span").map((_, element) => nav.find(element).text()).get(), ["旧記事・退役記事"]);
assert.equal(retiredIndex('.header-primary a.mobile-retired-link[href="/Rosarium/retired/"]').length, 1);
for (const record of report.entries) {
  counts[record.lifecycle] = (counts[record.lifecycle] ?? 0) + 1;
  if (record.lifecycle === "DELETE") { assert.equal(record.original_slug, "test"); assert.equal(record.recovered, true); continue; }
  assert.equal(digest(fs.readFileSync(record.source_snapshot)), record.source_sha256);
  const raw = fs.readFileSync(`src/content/${record.destination}.md`, "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const data = YAML.parse(match[1]);
  // Integration changes lifecycle metadata, not the immutable recovered body or appendix.
  verifyRecoveredBody(raw.slice(match[0].length), record, record.destination === "software-engineering/code-generation-and-work-design" ? record.local_appendix.date : data.last_updated);
  const lifecycle = record.destination === "software-engineering/code-generation-and-work-design" ? "RETIRED" : record.lifecycle;
  assert.equal(data.lifecycle, lifecycle.toLowerCase());
  assert.equal(data.published_at ?? null, record.original_published_at);
  assert.equal(publishedEntry({ data }), true);
  const html = fs.readFileSync(`dist/${record.destination}/index.html`, "utf8");
  const $ = load(html);
  const canonical = `https://nullcontroller.github.io/Rosarium/${record.destination}/`;
  if (record.destination !== "software-engineering/code-generation-and-work-design") assert.equal($("h1").text(), data.title);
  if (record.destination !== "software-engineering/code-generation-and-work-design") assert.equal($('link[rel="canonical"]').attr("href"), canonical);
  if (record.destination === "software-engineering/code-generation-and-work-design") {
    assert.match($('meta[name="robots"]').attr("content"), /noindex/);
    assert.equal($('meta[http-equiv="refresh"]').attr("content"), "0;url=/Rosarium/software-engineering/development-workflow/");
    assert.equal(retiredIndex('[data-retired-id="software-engineering/code-generation-and-work-design"]').length, 1);
    assert(!sitemap.includes(canonical));
    for (const feed of feeds) assert(!feed.includes(canonical));
    continue;
  }
  const note = $(".content-lifecycle-note");
  if (lifecycle === "ACTIVE") assert.equal(note.length, 0);
  else {
    assert.equal(note.length, 1);
    assert.ok(data.lifecycle_reason?.trim(), "Reader-facing lifecycle reason required");
    assert(note.text().includes(data.lifecycle_reason));
    assert.equal(note.attr("data-lifecycle"), data.lifecycle);
  }
  if (lifecycle === "RETIRED") {
    const item = retiredIndex(`[data-retired-id="${record.destination}"]`);
    assert.equal(item.length, 1);
    assert.equal(item.find("h3 a").attr("href"), `/Rosarium/${record.destination}/`);
    assert(item.text().includes(data.summary));
    assert(item.text().includes(data.lifecycle_reason));
    assert.equal(item.find("time").attr("datetime"), data.published_at.slice(0, 10));
    assert.equal(publicEntry({ data }), false);
    assert.match($('meta[name="robots"]').attr("content"), /noindex/);
    assert.equal($("[data-pagefind-body]").length, 1);
    assert.equal($("main[data-pagefind-ignore], article[data-pagefind-ignore]").length, 0);
    assert.equal($('[data-pagefind-filter="lifecycle[content]"]').attr("content"), "retired");
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
console.log("Lifecycle audit: original snapshots, publication dates and stable URLs preserved; retired articles internally searchable with lifecycle filters, noindex and absent from ordinary discovery/sitemap/feed.");
