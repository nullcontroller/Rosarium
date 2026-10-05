import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const rows = [];
for (const file of walk("dist").filter((file) => file.endsWith(".html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  if (!$("main").length) continue; // Verification token, not a reading page.
  const body = $("main").clone();
  body.find("details.book-toc-mobile,nav,aside,[hidden],[aria-hidden='true'],[data-toc-exclude]").remove();
  const majorCount = body.find("h2").length;
  const hasToc = $("#page-toc-tab").length > 0;
  const hasReference = $("#reference-sidebar-tab").length > 0;
  const hasRail = $("#right-sidebar").length > 0;
  const policy = $("main").attr("data-toc-policy");
  const reason = $("main").attr("data-toc-reason");
  const mobileTargets = $("main [data-page-heading-toc] a").map((_, node) => $(node).attr("href")).get();
  const desktopTargets = $("#page-toc-panel [data-page-heading-toc] a").map((_, node) => $(node).attr("href")).get();
  assert.deepEqual(mobileTargets, desktopTargets, `Mobile/Desktop headings: ${file}`);
  if (policy !== "never" && majorCount >= 2) assert(hasToc, `Multiple major headings without contents: ${file}`);
  if (policy !== "never" && body.find("h3").length >= 2 && body.text().replace(/\s/g, "").length >= 1000) assert(hasToc, `Long sections without contents: ${file}`);
  if (policy === "never") assert(!hasToc && !hasRail, `Explicit exclusion: ${file}`);
  assert.equal(hasRail, hasToc || hasReference, `Empty rail: ${file}`);
  if (hasToc) assert($("#page-toc-panel a").length > 0, `Empty contents tab: ${file}`);
  if (hasReference) assert($("[data-reference-document]").length > 0, `Empty reference tab: ${file}`);
  assert.equal($(".right-sidebar-collapse,.right-sidebar-reopen").length, 0, `Duplicate toggle UI: ${file}`);
  assert.equal($("[data-right-sidebar-toggle]").length, hasRail ? 1 : 0, `Single edge toggle: ${file}`);
  if (hasRail) assert.equal($("[data-right-sidebar-toggle]").attr("aria-controls"), "right-sidebar");
  for (const href of desktopTargets) {
    const id = decodeURIComponent(href.slice(1));
    const target = $("[id]").filter((_, node) => $(node).attr("id") === id);
    assert.equal(target.length, 1, `Unique anchor ${id}: ${file}`);
    assert(!target.is("h4,h5,h6"), `Too-deep contents: ${file}`);
  }
  for (const card of body.find("[data-history-id]").toArray()) {
    assert(desktopTargets.includes("#" + $(card).attr("id")), `Missing archive entry: ${file}`);
  }
  const route = "/" + path.relative("dist", file).replaceAll("\\", "/").replace(/index\.html$/, "");
  rows.push({route,title:$("main h1").first().text().trim(),indexable:!($('meta[name="robots"]').attr("content")??'').includes('noindex'),toc:hasToc,reference:hasReference,reason,majorCount,items:$("#page-toc-panel a").length,words:body.text().replace(/\s/g,'').length});
}
rows.sort((a,b)=>a.route.localeCompare(b.route));
const yes = (value) => value ? "あり" : "なし";
const reasons = {"multiple-h2":"主要見出しが複数", "multiple-list-entries":"一覧の移動単位が複数", "explicit-index":"アーカイブ個別項目", "long-page-sections":"長文の複数h3セクション", "short-page":"短いページまたは移動見出し不足", "explicit-exclusion":"入口・Reference・検索・404・互換リダイレクト"};
const report = ["# 共通目次と右補助パネルの全ページ監査", "", "`npm run build`の最終監査で全HTMLルートを検査。公開URLにはnoindexのアーカイブ・互換ルートも含め、検索エンジン向け公開と区別する。", "", `対象 ${rows.length}ページ。目次あり ${rows.filter(r=>r.toc).length}、なし ${rows.filter(r=>!r.toc).length}。Referenceあり ${rows.filter(r=>r.reference).length}、なし ${rows.filter(r=>!r.reference).length}。`, "", "共通ルール：描画済み本文のh2/h3から生成し、h2が2件以上で表示。一覧の移動単位が複数ある場合、本文1000文字以上でh3が複数ある構造、Book章構造も対象。Home、Reference本体、検索、404、互換リダイレクトは明示除外。既存IDとmetadata由来の一覧アンカーを保持。", "", "| URL | ページ | indexable | 目次 | Reference | 項目数 | 判定 |", "|---|---|---|---|---|---:|---|", ...rows.map(r=>`| ${r.route} | ${r.title.replaceAll('|','／')} | ${yes(r.indexable)} | ${yes(r.toc)} | ${yes(r.reference)} | ${r.items} | ${r.toc && r.reason==='short-page' ? 'Book章構造' : reasons[r.reason]??r.reason} |`), ""];
fs.writeFileSync("docs/toc-audit.md",report.join("\n"));
if (process.env.ROSARIUM_TOC_AUDIT_JSON) fs.writeFileSync(process.env.ROSARIUM_TOC_AUDIT_JSON,JSON.stringify(rows,null,2));
console.log(`TOC audit: ${rows.length} pages; contents=${rows.filter(r=>r.toc).length}; reference=${rows.filter(r=>r.reference).length}; unique anchors, matching mobile data, single toggle, no empty tabs.`);
console.log("No-TOC reading candidates:",JSON.stringify(rows.filter(r=>!r.toc&&r.reason!=='explicit-exclusion'&&r.words>1500)));
