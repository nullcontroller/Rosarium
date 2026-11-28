import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { load } from "cheerio";
import { designStudies } from "../src/data/design-studies.mjs";

const root = process.argv[2] || "dist";

const read = (base, id) => load(fs.readFileSync(path.join(base, id, "index.html"), "utf8"));
const hub = read(root, "cases/customer-support-ai-dx");
assert.equal(hub("[data-design-studies-list] a").length,6);
assert.match(read(root,"cases/design-studies")('meta[name="robots"]').attr("content"),/noindex/);
for (const study of designStudies) {
  assert(fs.existsSync(`dist/${study.id}/index.html`), `Published study missing: ${study.id}`);
  assert(hub(`main a[href='/${study.id}/']`).length, `Missing hub link: ${study.id}`);
  assert(hub(`[data-design-studies-list] a[href="/${study.id}/"]`).length, study.id);
  const $ = read(root, study.id);
  assert.equal($("h1").length, 1, study.id);
  const expectedCrumbs=["/", "/cases/", "/cases/customer-support-ai-dx/"];
  assert.equal($("nav.breadcrumb").length, 1, study.id);
  assert.deepEqual($("nav.breadcrumb a").toArray().map(node=>$(node).attr("href")),expectedCrumbs,study.id);
  assert.equal($("nav.breadcrumb [aria-current=page]").text(),$("h1").text(),study.id);
  const structured=$("script[type='application/ld+json']").toArray().flatMap(node=>{const value=JSON.parse($(node).text());return value["@graph"]??[value];}).find(value=>value["@type"]==="BreadcrumbList");
  assert(structured,study.id);
  assert.deepEqual(structured.itemListElement.map(item=>new URL(item.item).pathname),[...expectedCrumbs,"/"+study.id+"/"],study.id);
  assert.deepEqual(structured.itemListElement.map(item=>item.name),$("nav.breadcrumb [data-breadcrumb-item]").toArray().map(node=>$(node).text()),study.id);
  assert.equal($(".document-header [data-design-area]").text(), study.area, study.id);
  assert.match($(".document-header .meta").text(), /仮想設計/, study.id);
  for (const key of ["category", "layer", "tags"]) assert.equal($(`[data-pagefind-meta="${key}"][hidden]`).length, 1, study.id);
  assert.equal($('[data-pagefind-meta="content_kind"]').text(), "仮想設計", study.id);
  const renderedIds = $("[id]").toArray().map(node => $(node).attr("id"));
  assert.equal(new Set(renderedIds).size, renderedIds.length, `Duplicate page IDs: ${study.id}`);
  assert.equal($('meta[name="robots"]').attr("content"), "index, follow", study.id);
  assert.equal($("main[data-pagefind-ignore]").length, 0, study.id);
  assert($(".prose").text().includes("仮想設計"), study.id);
  assert(!/manual-00\d|section-00\d|faq-00\d|report-00\d|\bv[234]\b/.test($(".prose").text()), `Old reader-facing identifier: ${study.id}`);
  assert(!$(".prose h2").toArray().some(node => $(node).text().includes("補足")), `Standalone supplement: ${study.id}`);
  for (const a of $(".prose a[href^='#']").toArray()) {
    assert(renderedIds.includes(decodeURIComponent($(a).attr("href").slice(1))), `Broken fragment: ${study.id}`);
  }
  if (["metadata-batch", "data-migration"].includes(study.slug)) {
    assert.equal($(".prose figure.case-diagram").length, 2, study.id);
    assert.equal($(".prose figure.case-diagram svg").length, 4, study.id);
    const allIds = $("[id]").toArray().map(node => $(node).attr("id"));
    const legacyHeadings = study.slug === "metadata-batch"
      ? ["設計課題", "背景と制約", "設計上の選択肢", "採用する設計方式", "一時的な障害と業務上の判定不能を分ける", "再試行しても登録が増殖しない単位を決める", "正常対象を進めつつ全体異常は抑制する", "設計から得られる知見"]
      : ["設計課題", "背景と制約", "設計上の選択肢", "採用する設計方式", "レビューを切替当日の作業から外す", "データ照合と検索検証を分ける", "有人引継ぎを現場の受入れへ含める", "差分には削除と権限の変更も含める", "設計から得られる知見"];
    for (const heading of legacyHeadings) assert(allIds.includes(heading), `Legacy fragment lost: ${heading}`);
    assert.equal(new Set(allIds).size, allIds.length, `Duplicate IDs: ${study.id}`);
    for (const svg of $(".prose figure.case-diagram svg").toArray()) {
      assert($(svg).find("title").text(), `Missing SVG title: ${study.id}`);
      assert($(svg).find("desc").text(), `Missing SVG description: ${study.id}`);
      for (const ref of ($(svg).attr("aria-labelledby") || "").split(/\s+/)) assert(allIds.includes(ref));
    }
    for (const a of $(".prose a[href^='#']").toArray()) {
      assert(allIds.includes(decodeURIComponent($(a).attr("href").slice(1))), `Missing diagram detail: ${study.id}`);
    }
  }
  const legacyBySlug = {
  "inquiry-analysis": [
    "設計課題",
    "背景と制約",
    "設計上の選択肢",
    "採用する設計方式",
    "重要な設計判断",
    "曖昧な履歴を現場の判断で具体化する",
    "根拠の存在と自動化の許可を分ける",
    "件数ではなく工数と追加負担から効果を見積もる",
    "評価確認方法",
    "設計から得られる知見"
  ],
  "qualification-testing": [
    "設計課題",
    "背景と制約",
    "設計上の選択肢",
    "採用する設計方式",
    "重要な設計判断",
    "回答できた件数と止めるべき案件を止めた件数を分ける",
    "自動判定は追跡可能な項目へ限定する",
    "性能は検索用データ量を確定してから確認する",
    "評価確認方法",
    "設計から得られる知見"
  ],
  "rag-security": [
    "設計課題",
    "背景と制約",
    "設計上の選択肢",
    "採用する設計方式",
    "重要な設計判断",
    "承認を文書名ではなく内容の版へ結び付ける",
    "検索結果を生成aiの指示として信頼しない",
    "公開取消しを新規登録と同じ重要度で扱う",
    "評価確認方法",
    "設計から得られる知見"
  ],
  "document-lifecycle": [
    "設計課題",
    "背景と制約",
    "設計上の選択肢",
    "採用する設計方式",
    "重要な設計判断",
    "変更文字列だけでなく適用条件の影響を見る",
    "修正不要も確認対象にする",
    "本文と属性を組として有効化する",
    "旧版を残すことと最新として使うことを分ける",
    "評価確認方法",
    "設計から得られる知見"
  ]
};
  if (Object.hasOwn(legacyBySlug, study.slug)) {
    const ids = new Set($("[id]").toArray().map(node => $(node).attr("id")));
    for (const heading of legacyBySlug[study.slug]) assert(ids.has(heading), "Legacy heading lost: " + heading);
  }
  if (["rag-security", "document-lifecycle"].includes(study.slug)) {
    assert.equal($(".prose figure.case-diagram").length, 1);
    assert.equal($(".prose figure.case-diagram svg").length, 2);
    for (const svg of $(".prose figure.case-diagram svg").toArray()) {
      assert($(svg).find("title").text() && $(svg).find("desc").text());
    }
  }
  for (const a of $(".prose a[href^='/']").toArray()) {
    const target = new URL($(a).attr("href"), "https://rosarium-tech.com");
    const id = decodeURIComponent(target.pathname);
    assert(fs.existsSync(path.join(root, id, "index.html")), `Broken link: ${target.pathname}`);
    if (target.hash) {
      const dest = read(root, id);
      assert(dest("[id]").toArray().some(el => dest(el).attr("id") === decodeURIComponent(target.hash.slice(1))));
    }
  }
  for (const chapter of study.chapters) {
    const chapterId = `cases/customer-support-ai-dx/${chapter}`;
    assert(read(root, chapterId)(`a[href='/${study.id}/']`).length, `Missing contextual link: ${study.id}`);
    assert(read("dist", chapterId)(`a[href='/${study.id}/']`).length > 0);
  }
  // Home intentionally shows only the latest three dates; older publications stay in full history.
  for (const file of ["sitemap.xml", "rss.xml", "feed.json", "garden-notes/index.html"]) {
    assert(fs.readFileSync(`dist/${file}`, "utf8").includes(`/${study.id}/`), `Published discovery missing: ${file}`);
  }
}
assert(fs.existsSync("dist/cases/design-studies/index.html"));
assert(read("dist", "cases")('a[href="/cases/customer-support-ai-dx/"]').length > 0, "Cases reaches the public study index");
const book = read(root, "cases/customer-support-ai-dx");
assert.equal(book('[data-design-studies-list][data-design-studies-source="cases/customer-support-ai-dx"]').length,1);
assert.equal(read("dist", "cases/customer-support-ai-dx")('[data-design-studies-list]').length,1);
console.log("Verified six published virtual studies, public hub/context links, indexing, breadcrumbs and responsive diagrams.");

const fragments = fs.readdirSync("dist/pagefind/fragment").map(file => {
  const text = gunzipSync(fs.readFileSync(`dist/pagefind/fragment/${file}`)).toString("utf8");
  return JSON.parse(text.slice(text.indexOf("{")));
});
for (const id of designStudies.map(study => study.id)) {
  assert(fragments.some(fragment => fragment.url === `/${id}/`), `Search missing: ${id}`);
  for (const file of ["sitemap.xml", "rss.xml", "feed.json"]) assert(fs.readFileSync(`dist/${file}`, "utf8").includes(`/${id}/`), `Publication missing: ${file} ${id}`);
}
