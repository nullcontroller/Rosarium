import { bookChapterLegacyFragments } from "../src/data/book-chapter-fragments.ts";
import { supportPocLegacyFragments } from "../src/data/support-poc-fragments.ts";
import { aiDesignTopicGuides } from "../src/lib/ai-design.ts";
import { formatDateJa, staticPageLastUpdated } from "../src/lib/site.ts";
import { recentGrowth, growthChangeText, growthPublishedTargets, growthSummary } from "../src/data/recent-growth.ts";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import YAML from "yaml";
import { load } from "cheerio";
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
const entries = new Map(
  walk("src/content")
    .filter((p) => p.endsWith(".md"))
    .map((p) => {
      const source = fs.readFileSync(p, "utf8");
      const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
      return [
        path
          .relative("src/content", p)
          .replaceAll("\\", "/")
          .replace(/\.md$/, ""),
        data,
      ];
    }),
);
let links = 0;
for (const p of walk("dist").filter((p) => p.endsWith(".html") && !p.endsWith("google57af630fc0ce16af.html"))) {
  const $ = load(fs.readFileSync(p, "utf8"));
  $("time").each((_, el) => {
    const node = $(el);
    assert(!/undefined|NaN/.test(node.text()), `${p}: date label is complete`);
    if (/^\d{4}-\d{2}$/.test(node.attr("datetime") ?? "")) {
      assert.equal(node.text(), formatDateJa(node.attr("datetime")), `${p}: month-only date does not invent a day`);
    }
  });
  $("[data-content-id]").each((_, el) => {
    const node = $(el),
      d = entries.get(node.attr("data-content-id"));
    assert(d, p);
    assert.equal(node.find(".content-summary").text(), d.summary, p);
    assert.equal(node.find(".content-title").text(), d.title, p);
    assert(node.find(".meta").text().trim(), p);
    if (node.is(".content-entry")) {
      assert.ok(
        node
          .find(".meta")
          .text()
          .includes(`最終更新：${formatDateJa(d.last_updated)}`),
        `${p}: ${node.attr("data-content-id")} last_updated`,
      );
    }
    links++;
  });
}
for (const [id, d] of entries) {
  if (d.status === "draft" || d.public === false) continue;
  const route = id === "career/overview" ? "career" : id;
  const $ = load(fs.readFileSync("dist/" + route + "/index.html", "utf8"));
  if ($("meta[http-equiv=refresh]").length) {
    assert.equal(d.lifecycle, "retired", id);
    assert.equal($("[data-pagefind-body]").length, 0, id + ": redirect must not enter search");
    continue;
  }
  assert.equal(
    $('[data-pagefind-meta="summary"]').text().trim(),
    d.summary,
    id,
  );
  for (const key of ["title", "category", "status"])
    assert(
      $('[data-pagefind-meta="' + key + '"]')
        .text()
        .trim(),
      id + " " + key,
    );
  if (!id.startsWith("career/")) {
    assert.equal(
      $('[data-pagefind-meta="last_updated"]').text().trim(),
      d.last_updated,
      `${id} search last_updated`,
    );
    assert.equal(
      $(".document-header .content-last-updated time, .book-introduction-metadata .content-last-updated time").attr("datetime"),
      d.last_updated,
      `${id} visible last_updated`,
    );
    assert.equal(
      $(".document-header .status").length,
      0,
      `${id} status badge removed`,
    );
  }
}
const career = load(fs.readFileSync("dist/career/index.html", "utf8"));
assert.equal(career("h1").text(), "Career");
assert.equal(career(".career-focus-grid > section").length, 0);
assert.equal(career(".career-case-links li").length, 0);
assert.equal(career('a[href="/career/details/"]').length, 0);
assert.equal(career(".content-related").length, 0);
for (const heading of [
  "Career Detail",
  "Career Summary",
  "Experience Overview",
]) {
  assert(
    !career("main h2, main h3")
      .toArray()
      .some((element) => career(element).text().includes(heading)),
  );
}
const details = load(fs.readFileSync("dist/career/details/index.html", "utf8"));
assert.equal(details(".career-case-links li").length, 0);
assert.equal(details('meta[http-equiv="refresh"]').attr("content"), "0;url=/career/");
assert(details('a[href="/career/"]').length);
assert(career('a[href^="https://www.linkedin.com/in/"]').length === 1);
assert.equal(career('a[href="/career/profile/"]').length, 0);
console.log(
  `Verified ${entries.size} summaries/search metadata, ${links} content links and Career gateway.`,
);

// Phase 3 information architecture invariants.
const page = (id) =>
  load(fs.readFileSync("dist/" + id + "/index.html", "utf8"));
const top = page("");
assert.equal(top("main h1").first().text(), "Rosarium");
for (const html of walk("dist").filter((file) => file.endsWith(".html") && !file.endsWith("google57af630fc0ce16af.html"))) {
  const $ = load(fs.readFileSync(html, "utf8"));
  const brand = $("header.masthead > a.brand");
  assert.equal(brand.length, 1, `${html}: shared header brand`);
  assert.equal(brand.text().trim(), "Rosarium", `${html}: brand text`);
  assert.equal(
    brand.attr("href"),
    "/",
    `${html}: base-aware brand link`,
  );
  assert.equal(
    brand.find(".brand-author,.brand-domain,.icon").length,
    0,
    `${html}: brand must not contain profile or decorative content`,
  );
  assert.equal(
    brand.find('img.brand-mark[src="/favicon.svg"]').length,
    1,
    `${html}: shared brand mark`,
  );
}
assert.equal(top(".entrance-hero-actions a").length, 3);
assert.equal(top('.entrance-hero-actions a[href="/about/"]').length, 1);
assert.equal(top('.entrance-hero-actions a[href="/cases/"]').length, 1);
assert(top(".entrance-hero > .lead").text().includes("個人技術サイト"));
assert(
  top(".entrance-hero > .lead").text().includes("AIの数学・基礎理論から、設計原則、業務への適用"),
);
assert(!top("main").text().includes("Applied AI / System Architecture"));
assert(!/2016|C#|\.NET|問い合わせDX|生成AI|RAG|検索対象制御|有人引継ぎ/.test(top(".entrance-hero").text()), "Hero introduces the site; Career owns the profile and the main Case owns technical details");
assert.deepEqual(
  top(".sidebar nav a .nav-copy > span")
    .map((_, e) => top(e).text())
    .get(),
  ["庭", "AI", "DX", "企画", "実践事例", "キャリア", "旧記事・退役記事"],
);
assert.deepEqual(
  top(".header-primary a")
    .map((_, e) => top(e).text().trim())
    .get(),
  ["庭", "AI", "DX", "企画", "事例", "キャリア", "旧・退役"],
);
assert.equal(top('.header-primary a[href="/cases/"]').length, 1);
assert.equal(top('.mobile-retired-link').attr("aria-label"), "旧記事・退役記事");
assert.equal(top('.header-primary a[href="/career/"]').length, 1);
assert.equal(top('.home-career-link a[href="/career/"]').length, 1);
assert.equal(top('section[aria-labelledby="featured-cases-heading"]').length, 0);
assert.equal(top('.home-garden-notes #recent-growth-heading').length, 1);
assert.equal(top('.home-garden-notes [data-growth-entry]').length, Math.min(3, recentGrowth.length));
assert.equal(top('main a[href="/garden-notes/"]').length, 1);
assert.equal(top(".header-actions a.reference-header-tool").length, 1);
assert.equal(top("#right-sidebar").length, 1);
assert(top("#right-sidebar").is("[hidden][data-initially-closed=true]"));
assert.equal(top("#page-toc-tab").length, 0);
assert.equal(top("#reference-sidebar-tab").length, 1);
assert.equal(top("#global-search-input").length, 1);
assert.equal(top(".global-search-toggle").length, 1);
assert(!top(".sidebar-label").text().includes("設計体系"));
assert.equal(top(".sidebar details").length, 0);
assert.deepEqual(top(".sidebar .nav-auxiliary .nav-copy > span").map((_, e) => top(e).text()).get(), ["旧記事・退役記事"]);
for (const secondary of ["詳細職務経歴", "Books", "連載", "Essays"])
  assert(
    !top(".sidebar nav a .nav-copy > span").text().includes(secondary),
    secondary,
  );
assert.equal(top(".sidebar .icon").length, 7);
assert.equal(
  new Set(
    top(".sidebar .icon")
      .map((_, e) => top(e).attr("class"))
      .get(),
  ).size,
  6,
);
assert.equal(top('.sidebar a[href="/career/"]').length, 1);
assert.equal(top('.sidebar a[href="/updates/"]').length, 0);
assert.deepEqual(
  top(".sidebar .nav-children a .nav-copy > span")
    .map((_, e) => top(e).text())
    .get(),
  [],
);
assert.equal(top(".sidebar .nav-children .icon").length, 0);
assert.equal(top(".sidebar").length, 1);
assert.equal(career(".sidebar").length, 0);
assert.equal(career("#page-toc-tab").length, 1);
assert.equal(career("details[data-page-heading-toc][open]").length, 0, "Career introduction must precede an expanded mobile TOC");
assert.equal(career("#reference-sidebar-tab").length, 0);
assert.equal(career(".global-search").length, 1);
assert.equal(career(".header-primary").length, 1);
assert.equal(career("#theme").length, 1);
assert.deepEqual(
  career(".header-primary a")
    .map((_, e) => career(e).text().trim())
    .get(),
  ["庭", "AI", "DX", "企画", "事例", "キャリア", "旧・退役"],
);
assert(career('a[href="/ai/"]').length);
assert(career('a[href="/dx/"]').length);
assert(career('a[href="/cases/"]').length);
const primaryIds = ($) =>
  $("[data-primary-index] [data-content-id]")
    .map((_, e) => $(e).attr("data-content-id"))
    .get();
const design = page("ai-design");
assert.deepEqual(
  new Set(primaryIds(design)),
  new Set(
    [...entries].filter(([, d]) => d.layer === "ai-design" && (!d.lifecycle || d.lifecycle === "active")).map(([id]) => id),
  ),
);
for (const id of primaryIds(design))
  assert.notEqual(entries.get(id).source?.type, "zenn");
assert.deepEqual(
  design(".design-flow li")
    .map((_, e) => design(e).text().trim())
    .get(),
  ["価値・適用判断", "責任・情報・評価", "構成・実行・権限", "運用・改善", "再評価・縮小・終了"],
);
const designAreaLinks = design(".design-area-list h3 a");
assert.equal(designAreaLinks.length, 10);
assert.equal(design(".design-area-list h3").length, designAreaLinks.length);
assert.deepEqual(designAreaLinks.map((_, e) => design(e).attr("href")).get(), [
  "foundations/applicability-and-delegation", "foundations/ai-business-design/evaluating-business-efficiency",
  "evaluation-hitl/responsibility-and-hitl", "ai-design/knowledge-context", "ai-design/evaluation-hitl",
  "architecture/reference-architecture", "software-engineering/multi-ai-orchestration",
  "architecture/security-threat-modeling", "practices/adoption-governance", "ai-design/lifecycle-operations",
].map(path => "/" + path + "/"));
assert.equal(new Set(designAreaLinks.map((_, e) => design(e).attr("href")).get()).size, 10);
assert(design("main").text().includes("番号は読む順の目安"));
assert.equal(top(".sidebar").text().includes("DX"), true);
assert.equal(page("ai-design/applicability")("[data-related-publications]").length, 0);
assert.equal(page("ai-design/lifecycle-operations")("[data-related-publications]").length, 0);
assert(
  page("foundations/applicability-and-delegation")("main")
    .text()
    .includes("価値から始める"),
);
for (const topic of [
  "applicability",
  "responsibility-control",
  "architecture",
  "knowledge-context",
  "evaluation-hitl",
  "software-engineering",
  "lifecycle-operations",
]) {
  const $ = page("ai-design/" + topic);
  assert(primaryIds($).length);
  assert.deepEqual(primaryIds($), [...aiDesignTopicGuides[topic].readingOrder], `${topic} reading order and complete coverage`);
  assert.equal($("[data-ai-design-guide]").text(), aiDesignTopicGuides[topic].question);
  assert.equal($("[data-ai-design-next] a").attr("href"), "/" + aiDesignTopicGuides[topic].next.path + "/");
  for (const id of primaryIds($)) {
    assert.equal(entries.get(id).layer, "ai-design");
    assert.equal(entries.get(id).design_topic, topic);
  }
  assert.equal($("[data-related-publications]").length, 0);
}
assert(page("ai-design/architecture")('a[href="/software-engineering/multi-ai-orchestration/"]').length, "Agent experience remains discoverable within the orchestration guide");
for (const [id, d] of entries) {
  if (d.layer === "ai-design")
    assert.equal(
      page(id)('[data-related-content] a[href*="/cases/"]').length, 0,
      id,
    );
}
for (const [route, layer] of [["reference", "reference"]]) {
  const $ = page(route);
  assert(primaryIds($).length);
  for (const id of primaryIds($)) assert.equal(entries.get(id).layer, layer);
}
for (const [route, layer, crossListed] of [
  ["ai-mathematics", "ai-mathematics", []],
  ["ai-theory", "ai-theory", []],
  [
    "practices",
    "practice",
    [
      "knowledge-context/prompt-structure",
    ],
  ],
]) {
  const $ = page(route);
  const ids = primaryIds($);
  const canonical = [...entries]
    .filter(([, data]) => data.layer === layer && data.section !== "cases" && data.public !== false && (!data.lifecycle || data.lifecycle === "active"))
    .map(([id]) => id);
  for (const id of canonical)
    assert(ids.includes(id), `${route} misses canonical ${id}`);
  for (const id of crossListed)
    assert(ids.includes(id), `${route} misses discovery path ${id}`);
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${route} has duplicate discovery entries`,
  );
}
const pubs = page("ai");
assert.equal(top("#use-case-heading,#current-growth-heading").length, 0);
assert.equal(pubs("h1").text(), "AI");
assert.equal(
  pubs(".page-heading .lead").text(),
  "AIを仕事やシステムへ組み込むために、人とAIの役割、知識と条件、評価、理論、実践を設計の視点から考えます。",
);
assert.equal(pubs("#current-topics-heading").length, 0);
assert.equal(pubs("[data-publication]").length, 0);
assert.equal(pubs("[data-use-case-shortcut]").length, 0);
assert.equal(pubs("[data-content-id]").length, 0);
assert.equal(pubs("#ai-themes-heading").text(), "AIを考える6つのテーマ");
const aiSections = pubs('[data-domain-theme="ai"]');
assert.equal(aiSections.length, 6);
assert.deepEqual(aiSections.find(".dx-theme-introduction h2").map((_, el) => pubs(el).text()).get(),
  ["AI設計", "AI理論", "数学", "ナレッジ / コンテキスト", "評価・ヒューマンレビュー", "実践・開発"]);
const aiFeatured = pubs("[data-ai-featured]").map((_, el) => pubs(el).attr("data-ai-featured")).get();
assert.equal(aiFeatured.length, 6);
assert.equal(new Set(aiFeatured).size, 6);
for (const element of aiSections.toArray()) {
  const theme = pubs(element);
  assert.equal(theme.find(".dx-theme-questions li").length, 3);
  assert.equal(theme.find("[data-ai-featured]").length, 1);
  assert.equal(theme.find(".dx-theme-introduction p").length, 2);
}
assert.equal(pubs(".secondary-reading").length, 0);
assert.equal(pubs('main a[href^="/cases/"]').length, 0);
const dx = page("dx");
assert.equal(dx("h1").text(), "DX");
assert(
  dx(".page-heading .lead").text().includes("業務・サービス・システムの変化"),
);
assert.deepEqual(
  dx("main > section > h2")
    .map((_, element) => dx(element).text())
    .get(),
  ["DXを考える5つのテーマ"],
);
assert.deepEqual(
  dx(".dx-category .dx-theme-introduction h2")
    .map((_, element) => dx(element).text().replace("→", "").trim())
    .get(),
  ["価値設計", "業務変革", "選択と廃止", "システム変革", "継続的価値創出"],
);
assert.equal(dx(".dx-ai-connection").length, 0);
assert.equal(dx('main a[href^="/cases/"]').length, 0);
assert.equal(dx('main a[href="/ai/"]').length, 0);
const dxFeaturedIds = dx("[data-dx-featured]").map((_, element) => dx(element).attr("data-dx-featured")).get();
assert.equal(new Set(dxFeaturedIds).size, dxFeaturedIds.length, "DX featured articles must appear once");
for (const category of [
  "value-design",
  "business-transformation",
  "selection-retirement",
  "system-transformation",
  "continuous-value",
]) {
  assert(
    dx(`a[href="/dx/${category}/"]`).length,
    `DX category link: ${category}`,
  );
  const categoryPage = page(`dx/${category}`);
  assert(categoryPage("h1").length, `DX category page: ${category}`);
  const theme = dx(`#${category}`);
  assert.equal(theme.find(".dx-theme-questions li").length, 3);
  assert(theme.find(".dx-theme-introduction p").text().length >= 70);
  const featured = theme.find("[data-dx-featured]");
  assert(featured.length >= 1 && featured.length <= 2);
  featured.each((_, element) => {
    const id = dx(element).attr("data-dx-featured");
    assert.equal(entries.get(id).primaryCategory, category);
    assert.equal(entries.get(id).featuredInCategory, true);
    assert.notEqual(entries.get(id).section, "cases");
    assert(dx(element).find("p").text().trim().length > 20);
  });
  for (const id of primaryIds(categoryPage)) assert.equal(entries.get(id).primaryCategory, category, `${id}: DX category pages use primary only`);
  assert.equal(categoryPage('[aria-label="関連する入口"]').length, 0);
}
assert(dx('a[href="/essays/dx-and-value/"]').length);
assert.equal(dx('main a[href="/cases/customer-support-ai-dx/"]').length, 0);
assert(!dx('a[href="/foundations/conditional-probability/"]').length);
const dxEssay = page("essays/dx-and-value");
assert.equal(dxEssay('[data-related-content] a[href="/cases/customer-support-ai-dx/"]').length, 0);
assert(dxEssay('[data-related-content] a').length <= 4);
const cases = page("cases");
assert.deepEqual(
  cases("[data-series-index]").map((_, element) => cases(element).attr("data-series-index")).get(),
  ["cases/customer-support-ai-dx", "cases/specification-debt-review", "cases/three-ai-maintenance", "cases/ai-technical-investigation"],
);
assert.equal(cases(".case-reference-note").length, 0);
assert.equal(cases("#active-cases .case-study-index").length, 4);
assert.equal(cases("#obsolete-cases").length, 0);
assert.equal(cases("#active-cases > h2").text(), "主要事例");
const caseHighlights = cases(".case-highlight-list > li");
assert.equal(caseHighlights.length, 4);
for (const id of ["specification-debt-review", "three-ai-maintenance", "customer-support-ai-dx"]) {
  assert.equal(cases(`.case-highlight-list a[href="#case-${id}"]`).length, 1);
  assert.equal(cases(`#case-${id}`).length, 1);
}
assert(caseHighlights.text().includes("実務実績"));
assert(caseHighlights.text().includes("設計事例"));
assert(caseHighlights.text().includes("自己解決と専門対応を両立する設計・検証シナリオ"));




assert(!cases("main a").text().includes("→"));
assert(page("cases/system-understanding")(".case-position-note").text().includes("現在の推奨構成ではありません"));
assert.equal(
  cases(".header-primary a[aria-current=page]").text().trim(),
  "事例",
);
assert.equal(cases("#page-toc-tab, #page-toc-panel, [data-page-heading-toc]").length, 0);
assert.equal(cases("main").attr("data-toc-policy"), "never");
assert.equal(cases('main a[href="/career/"]').length, 1);
assert.equal(cases('main a[href="/retired/obsolete-cases/"]').length, 1);
for (const id of ["specification-debt-review", "three-ai-maintenance", "customer-support-ai-dx"]) {
  assert.equal(cases(`#case-${id}`).length, 1, "Preserve case anchors");
}
assert.equal(cases(".case-study-index").length, 4);
assert.equal(cases("main img").length, 0);
assert.equal(cases(".book-list-entry-text").length, 4);
for (const id of [
  "cases/three-ai-maintenance",
  "cases/customer-support-ai-dx",
]) {
  const study = cases(`[data-series-index="${id}"]`);
  const descendants = study.find("*").toArray();
  assert(
    descendants.indexOf(study.find(".publication-entry").get(0)) <
      descendants.indexOf(study.find(".case-outcome").get(0)),
    `${id}: outcome must follow title, summary and metadata`,
  );
  assert.deepEqual(
    study
      .find(".case-outcome dt")
      .map((_, e) => cases(e).text())
      .get(),
    ["課題", "設計", id === "cases/customer-support-ai-dx" ? "設計の到達点" : "結果"],
  );
}
assert.equal(
  cases('[data-content-id="cases/system-understanding"] .publication-topics')
    .text()
    .trim(),
  "",
);
for (const id of [
  "career",
  "reference",
  "foundations",
  "architecture",
  "knowledge-context",
  "evaluation-hitl",
  "software-engineering",
  "practices",
  "cases",
  "essays",
  "books",
  "ai",
  "articles",
  "search",
  "about",
  "career/profile",
  "updates",
])
  assert(page(id)("h1").length, id);
const careerProfile = page("career/profile");
assert.match(
  careerProfile("meta[name=robots]").attr("content") || "",
  /noindex/,
);
assert.equal(
  careerProfile("meta[http-equiv=refresh]").attr("content"),
  "0;url=/career/",
);
assert.equal(
  careerProfile('link[rel="canonical"]').attr("href"),
  "https://rosarium-tech.com/career/",
);
assert(careerProfile('a[href="/career/"]').length);
console.log(
  "Verified reading gateway, layer separation and existing URLs without related publications.",
);

// Phase 4: journal order, preserved summaries, reading route and secondary archives.
assert.equal(design("[data-related-publications]").length, 0);
const mathematics = page("ai-mathematics");
assert.equal(mathematics("[data-mathematics-reading]").length, 0);
const theory = page("ai-theory");
for (const [route, title, ids] of [
  ["ai-mathematics", "数学", ["foundations/conditional-probability", "foundations/temperature-design"]],
  ["ai-theory", "AI理論", ["foundations/hallucination-mechanisms", "software-engineering/code-generation-models"]],
]) {
  const $ = page(route);
  assert.equal($("h1").text(), title);
  assert.deepEqual(primaryIds($).sort(), [...ids].sort(), route + ": canonical article membership");
  assert.equal($("[data-content-id]").length, ids.length, route + ": no duplicate registration");
  assert(pubs(`main a[href="/${route}/"]`).length);
  assert(page("start-here")(`main a[href="/${route}/"]`).length);
  for (const id of ids) {
    assert.equal(page(id)(".pagination").length, 0);
    assert(page(id)(`a[href="/${route}/"]`).length, id+": canonical breadcrumb");
    assert(page(id)(".katex").length > 0, id+": math rendering preserved");
  }
}
assert(mathematics('main a[href="/reference/mathematical-reference/"]').length);
assert(mathematics('main a[href="/ai-theory/"]').length);
assert(theory('main a[href="/ai-mathematics/"]').length);
for (const id of ["foundations/guardrail-models", "foundations/layered-hallucination-controls"]) {
 assert.equal(entries.get(id).layer, "ai-design");
 assert(!primaryIds(mathematics).includes(id));
 assert(!primaryIds(theory).includes(id));
 assert(primaryIds(design).includes(id));
}
const reference = page("reference");
assert.equal(reference("[data-reference-archive]").length, 0);
assert.equal(reference(".site-implementation").length, 0);
assert(!reference("main").text().includes("Knowledge / Publishing as Code"));
assert.equal(
  reference('[data-content-id="foundations/wiki-overview"]').length,
  0,
);
const expectedBooks = [
  "cases/customer-support-ai-dx",
  "cases/specification-debt-review",
  "cases/three-ai-maintenance",
  "cases/ai-technical-investigation",
];
for (const route of ["cases"]) {
  const $ = page(route);
  assert.deepEqual(
    $("[data-series-index]")
      .map((_, e) => $(e).attr("data-series-index"))
      .get(),
    expectedBooks,
  );
  assert.equal($("[data-series-index] details, [data-series-index] summary").length, 0);
  assert(!$("[data-series-index]").text().includes("概要・全体構成を読む"));
  assert.equal($("[data-series-index] .content-title").length, expectedBooks.length);
}
assert.equal(
  primaryIds(page("dx/business-transformation")).filter((id) => id === "foundations/ai-business-design").length,
  1,
);
const overview = page("overview");
assert.match(overview("meta[name=robots]").attr("content") || "", /noindex/);
assert.equal(
  overview("meta[http-equiv=refresh]").attr("content"),
  "0;url=/ai/",
);
assert(overview('a[href="/ai/"]').length);
const articlesCompatibility = page("articles");
assert.match(
  articlesCompatibility("meta[name=robots]").attr("content") || "",
  /noindex/,
);
assert.equal(
  articlesCompatibility("meta[http-equiv=refresh]").attr("content"),
  "0;url=/ai/",
);
assert(articlesCompatibility('a[href="/ai/"]').length);
console.log(
  "Verified overview compatibility redirect, four case books, independent series and simplified navigation.",
);

const growthContentChanges = entry => growthSummary(entry, id => {
  const data = entries.get(id);
  return data.kind === "case" || data.layer === "case" || data.section === "cases";
});
function assertGrowthChanges($, row, entry) {
  const ids = growthPublishedTargets(entry);
  const expectedLinks = ids.map(id => ({
    title: entries.get(id)?.title,
    href: `/${id === "career/overview" ? "career" : id}/`,
  }));
  assert.deepEqual(
    row.find(".growth-changes > li").map((_, item) => $(item).text()).get(),
    [...growthContentChanges(entry), ...expectedLinks.map(link => link.title)],
  );
  assert.deepEqual(
    row.find(".growth-changes a").map((_, item) => ({
      title: $(item).text(),
      href: $(item).attr("href"),
    })).get(),
    expectedLinks,
    "Garden Notes links appear for new publications, not ordinary revisions",
  );
}

for (const [id, data] of entries) {
  if (data.public === false || data.status === "draft") continue;
  // Career has a dedicated route; other public content uses the shared document route.
  const document = page(id === "career/overview" ? "career" : id);
  const history = document("[data-content-history]");
  assert.equal(history.length, 0, id + ": history belongs only in Garden Notes");
  assert.equal(document(".update-note").length, 0);
  if (document('meta[http-equiv="refresh"]').length) continue;
  const latest = document(".content-last-updated time, .site-last-updated time");
  assert.equal(latest.length, 1, id + ": exactly one current date");
  assert.equal(latest.attr("datetime"), data.last_updated, id);
  assert.equal(latest.text().trim(), formatDateJa(data.last_updated), id);
  assert.equal(document(".document-header .meta time, .book-introduction-metadata .meta time").length, id === "career/overview" ? 0 : 1);
  assert.equal(document('#page-toc-panel a').filter((_, item) => document(item).text().trim() === "更新履歴").length, 0);
}

assert.equal(top("#recent-growth-heading").length, 1);
assert.equal(top(".home-garden-notes .home-growth-history").length, 1);
assert.equal(top('main a[href="/cases/"]').length, 1, "Home should have just one case-study link");
assert.equal(top('.home-growth-toolbar a[href="/garden-notes/"]').length, 1);
assert.equal(top('main a[href="/garden-notes/"]').length, 1);
assert.equal(top(".home-garden-notes > .home-growth-toolbar").length, 1);
const noteToolbar = top(".home-garden-notes > .home-growth-toolbar").get(0);
const noteHistory = top(".home-garden-notes > .home-growth-history").get(0);
assert(noteToolbar && noteHistory && noteToolbar.parent === noteHistory.parent);
assert(top(".home-garden-notes > .home-growth-toolbar").index() < top(".home-garden-notes > .home-growth-history").index(),
  "Full history link should appear above the update scroll region");
assert.equal(top(".home-primary-panels").length, 0);
assert.equal(top(".header-secondary").length, 0);
assert.equal(top(".home-hero-layout > aside.home-main-case").length, 1);
assert.equal(top('a[href="/about/"]').text().trim(), "Rosariumとは？");
assert.equal(top("#about-rosarium").length, 0);
assert.equal(top(".header-actions .header-secondary").length, 0);
const gardenNotes = page("garden-notes");
assert.equal(gardenNotes(".header-secondary").length, 0);
assert.equal(gardenNotes('a[href="/"]').length > 0, true, "Garden Notes should still link back to the home page");
assert.equal(gardenNotes(".home-growth-history").length, 0);
assert.equal(gardenNotes('.garden-notes-history[role="region"][tabindex="0"][aria-label="Garden Notes 更新履歴"]').length, 1);
assert.equal(gardenNotes(".garden-notes-history [data-growth-entry]").length, recentGrowth.length);
assert.equal(top(".garden-notes-history").length, 0, "Home must not inherit the history scroll region");
assert.equal(gardenNotes("[data-growth-entry]").length, recentGrowth.length);
assert.equal(gardenNotes("#notes-2026-10").length, 1);
assert.equal(gardenNotes("#notes-2026-09").length, 1);
for (const entry of recentGrowth) {
  const row = gardenNotes(`[data-growth-entry]:has(time[datetime="${entry.date}"])`);
  assert.equal(row.length, 1);
  assertGrowthChanges(gardenNotes, row, entry);
}



assert.equal(new Set(recentGrowth.map(entry => entry.date)).size, recentGrowth.length);
assert.equal(recentGrowth.find(entry => entry.date === "2026-10-03").changes.length, 4);
assert(recentGrowth.every(entry => !entry.changes.some(change => /表示・導線を整理|UI.?UXを改善/.test(growthChangeText(change)))));
const growthDates = new Set();
for (const element of top("[data-growth-entry]").toArray()) {
  const entry = top(element);
  assert.equal(entry.find("time").length, 1);
  const date = entry.find("time").attr("datetime");
  assert(!growthDates.has(date), `Duplicate Recent Growth date: ${date}`);
  growthDates.add(date);
  assert.equal(entry.find("p.content-summary").length, 0);
  assertGrowthChanges(top, entry, recentGrowth.find(item => item.date === date));
  assert(!entry.text().includes("→"), `${date}: no navigation arrows`);
  const changes = entry.find(".growth-changes > li");
  assert(changes.length > 0, `${date}: changes are required`);
  for (const change of changes.toArray()) {
    assert(top(change).text().trim());
    assert(
      !/[／/]/.test(top(change).clone().find("a").remove().end().text()),
      `${date}: no slash-joined changes`,
    );
  }
}
assert.equal(top('a[href="/updates/"]').length, 0);
const updates = page("updates");
assert.match(updates("meta[name=robots]").attr("content") || "", /noindex/);
assert.equal(
  updates("meta[http-equiv=refresh]").attr("content"),
  "0;url=/",
);
assert(updates('a[href="/"]').length);
assert.equal(updates(".growth-list [data-content-id]").length, 0);
assert(
  !fs.readFileSync("dist/feed.xml", "utf8").includes("Rosarium 公開"),
  "Curated Recent Growth must remain separate from the content RSS feed",
);
for (const route of ["ai-mathematics", "ai-theory", "practices"]) {
  const $ = page(route);
  assert.equal($(".page-status").length, 0, `${route}: no terminal status`);
  assert.equal(
    $(".status-note").length,
    0,
    `${route}: no terminal status note`,
  );
  assert.equal(
    $(".site-last-updated time").attr("datetime"),
    staticPageLastUpdated[route],
    `${route}: last updated`,
  );
}
for (const route of ["career", "ai", "reference"])
  assert(
    page(route)("main .icon").length,
    route + " must use the icon language",
  );
for (const route of ["ai-design", "ai-mathematics", "ai-theory", "practices", "cases"]) {
  const $ = page(route);
  assert.equal(
    $(
      route === "cases"
        ? ".section-visual,.document-list .icon,.book-list-entry .icon"
        : ".page-heading > .icon,.section-visual,.document-list .icon,.book-list-entry .icon",
    ).length,
    0,
    route,
  );
}
for (const topic of [
  "applicability",
  "responsibility-control",
  "architecture",
  "knowledge-context",
  "evaluation-hitl",
  "software-engineering",
  "lifecycle-operations",
]) {
  const $ = page("ai-design/" + topic);
  assert.equal(
    $(
      ".page-heading > .icon,.section-visual,.document-list .icon,.related-publications .icon",
    ).length,
    0,
    topic,
  );
}
for (const id of [
  "reference/glossary",
  "reference/mathematical-reference",
  "reference/evaluation-metrics",
  "reference/responsibility-state-model",
])
  assert.equal(page(id)(".author-box").length, 0, id);
for (const route of ["search"]) {
  const $ = page(route);
  assert.match($("meta[name=robots]").attr("content") || "", /noindex/);
  assert.equal($("meta[http-equiv=refresh]").length, 1);
}
assert.equal(page("practices")("[data-related-publications]").length, 0);
for (const html of walk("dist").filter((file) => file.endsWith(".html") && !file.endsWith("google57af630fc0ce16af.html"))) {
  const $ = load(fs.readFileSync(html, "utf8"));
  assert(!$("main").text().includes("Related Publications"), html);
  assert.equal($("[data-content-history], .content-history, .update-note").length, 0, html + ": no per-page history");
  assert(!/元の公開日：|元の公開時期：/.test($("main").text()), html);
  assert(!/公開：|公開日：/.test($(".document-header .meta, .publication-date").text()), html);
  assert(
    !$.root().text().includes("\u66f4\u65b0\u4e2d"),
    `${html}: deprecated status remains`,
  );
}
assert(
  page("cases/system-understanding")("main")
    .text()
    .includes(
      "この実践で使用した生成AIはGPTであり、当時の作業ではGitHub Copilotを利用していない。",
    ),
);
assert(
  page("cases/system-understanding")("main")
    .text()
    .includes(
      "仕様書が存在することと、仕様が管理されていることは同じではなかった。",
    ),
);
assert(
  page("cases/three-ai-maintenance")("main")
    .text()
    .includes(
      "AIが案を作る工程と、組織として確定・実行する工程の間には、人間の確認を残した。",
    ),
);
const customerSupportBook = page("cases/customer-support-ai-dx");
assert.equal(customerSupportBook(".series").length, 0);
assert.equal(customerSupportBook(".book-toc .page-toc-panel > ol > li").length, 12);
assert.equal(customerSupportBook(".book-toc-mobile:not([data-page-heading-toc]) > ol > li").length, 12);
assert.equal(customerSupportBook(".book-toc .content-entry").length, 0);
assert.equal(
  customerSupportBook(".series-position-inline").text(),
  "現在位置：全体構成・全11章",
);
assert.equal(
  page("cases/customer-support-ai-dx/poc-evaluation")(
    ".series-position-inline",
  ).text(),
  "現在位置：第04章・全11章",
);
assert.equal(
  page("cases/customer-support-ai-dx/poc-evaluation")(
    '.book-toc a[aria-current="page"]',
  ).text(),
  "04. 第1回PoC：フィージビリティ確認",
);
assert(
  customerSupportBook("main")
    .text()
    .includes("72％ → 98％"),
);
assert.equal(
  page("cases/customer-support-ai-dx/design-principles")(".series-position-inline").text(),
  "現在位置：第11章・全11章",
);
assert.equal(customerSupportBook('a[href*="outcomes-and-evidence"]').length, 0);
for (const id of ["specification-debt-review", "three-ai-maintenance", "system-understanding", "customer-support-ai-dx"])
  assert.equal(page("career")(`main a[href="/cases/${id}/"]`).length, 1);
assert.equal(page("career")('[data-directive="case"]').length, 4);
assert.equal(page("career")('main a[href="https://github.com/nullcontroller/Rosarium"]').length, 1);
console.log("Verified Garden Notes history and single latest-update display without publication dates.");

for (const route of ["ai-design", "ai-mathematics", "ai-theory", "practices", "cases"]) {
  const $ = page(route);
  assert.equal($(".theme-toc,.theme-toc-mobile").length, 0, `${route}: no duplicated recommendations`);
  if (route === "practices") {
    const categories = $("main [data-practice-category]");
    assert.equal(categories.length, 4);
    assert.deepEqual(categories.map((_, node) => $(node).children("h2").text()).get(), [
      "導入・教育・定着", "プロンプト・ナレッジ運用", "開発・保守", "評価・ヒューマンレビュー",
    ]);
    categories.each((_, category) => {
      const links = $(category).find(".content-title a").map((_, e) => $(e).attr("href")).get();
      assert(links.length, "Actual Practice index remains");
      assert.equal(new Set(links).size, links.length);
    });
    assert(!$("main").text().includes("業務・開発プロセスへの組込み"));
  } else if (route === "cases") {
    assert.equal($("[data-series-index]").length, expectedBooks.length);
    assert(!$("body").text().includes("業務・システムの実践"));
  } else {
    assert(primaryIds($).length, `${route}: actual article index remains`);
  }
}
console.log("Verified actual category indexes without duplicated recommendation UI.");

// The imported essays have one canonical route and appear in all existing feeds.
for (const id of [
  "essays/it-strategy-and-not-building",
  "essays/rethink-work-before-ai",
  "essays/legacy-change-and-retirement",
]) {
  const article = page(id);
  assert.equal(article("h1").length, 1, id);
  assert.equal(
    article('meta[name="last-updated"]').attr("content"),
    entries.get(id).last_updated,
    id,
  );
  assert.equal(
    article('link[rel="canonical"]').attr("href"),
    `https://rosarium-tech.com/${id}/`,
    id,
  );
  assert.equal(
    article('main img[src^="http"]').length,
    0,
    `${id}: no hotlinked image`,
  );
  assert(article("[data-pagefind-body]").length, `${id}: searchable body`);
  for (const feed of ["rss.xml", "feed.json", "sitemap.xml"]) {
    assert(
      fs.readFileSync(`dist/${feed}`, "utf8").includes(`/${id}/`),
      `${id}: ${feed}`,
    );
  }
}
assert(
  page("dx/selection-retirement")(
    'a[href="/essays/it-strategy-and-not-building/"]',
  ).length,
);
assert(
  page("dx/business-transformation")(
    'a[href="/essays/rethink-work-before-ai/"]',
  ).length,
);
assert(
  page("dx/system-transformation")(
    'a[href="/essays/legacy-change-and-retirement/"]',
  ).length,
);
assert(
  page("practices")('a[href="/practices/transferring-practices/"]')
    .length,
);
console.log(
  "Verified imported essay discovery, canonical routes, search bodies and feeds; transfer guide retains the practical sharing experience.",
);

// No recommendations are reinserted after the article or chapter navigation.
for (const file of walk("dist").filter((file) => file.endsWith(".html") && !file.endsWith("google57af630fc0ce16af.html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  assert(!$("h1,h2,h3,h4").text().includes("Related Design"), file);
  const related = $("[data-related-content]");
  assert.equal(related.length, 0, `${file}: no automatic related reading`);
  assert.equal($("[data-related-publications],.theme-toc,.theme-toc-mobile").length, 0, file);
  assert(!$("h2,h3").toArray().some((node) => $(node).text().trim() === "次に読む"), file);
  assert(
    !$("article[data-pagefind-body] .prose h2, article[data-pagefind-body] .prose h3")
      .toArray()
      .some((node) => /^(関連する入口|関連する設計(?:原則|知識)?|関連する記事・設計|関連記事|関連テーマ|Next|Related|Explore)$/.test($(node).text().trim())),
    file,
  );
  assert(!$("main a[href]").toArray().some((node) => !$(node).closest(".home-main-case").length && /→\s*$/.test($(node).text().trim())), `${file}: no arrow CTA`);
}
console.log(
  "Verified absence of automatic related sections and next-reading headings.",
);

// Support QA is readable without interaction and keeps the existing cover and fragment targets.
const supportDiagram = page("cases/customer-support-ai-dx/stopping-conditions");
assert.equal(supportDiagram("[data-support-dx]").length, 1);
assert.equal(supportDiagram("[data-support-dx] svg, [data-support-dx] button, [data-support-dx] [hidden]").length, 0);
assert.equal(supportDiagram("[data-support-step]").length, 6);
for (const id of ["customer", "knowledge", "rag", "genai", "decision", "human", "response", "feedback"]) {
  assert.equal(supportDiagram(`#support-detail-${id}`).length, 1, "Keep overview fragment anchors");
}
assert(supportDiagram("#support-detail-decision").text().includes("回答可能か判定"));
assert(supportDiagram(".support-note").text().includes("自信だけでは"));
assert.equal(supportDiagram('article img[src$="customer-support-ai-dx-overview.jpg"]').length, 0);
assert(fs.existsSync("dist/assets/cases/customer-support-ai-dx-overview.jpg"), "Original Book cover asset remains available");
for (const route of ["cases/system-understanding", "cases/three-ai-maintenance", "career"]) {
  assert.equal(page(route)("[data-support-dx]").length, 0);
}
console.log("Verified support QA static explanation, preserved fragments and original Book thumbnail.");

for (const id of ["cases/system-understanding", "cases/three-ai-maintenance", "cases/customer-support-ai-dx"]) {
  const $ = page(id);
  assert.equal($('[data-related-content] a[href="/career/"]').length, 0);
}
for (const id of ["foundations/ai-business-design", "practices/transferring-practices", "knowledge-context/instruction-knowledge-evidence"]) {
  assert.equal(page(id)('[data-related-content] a[href*="/cases/"]').length, 0, `${id}: knowledge exits exclude Cases`);
}
for (const file of walk("dist").filter((file) => file.endsWith("index.html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  assert.equal($('.reading-exit-links').length, 0, `${file}: no reading exits`);
  if ($('.career-actions').length) assert($('.career-actions a').length <= 3, `${file}: compact profile paths`);
}
console.log("Verified quiet Case endings and preserved Practice discovery.");

const supportTitles = customerSupportBook(".book-toc .page-toc-panel > ol a").map((_, node) => customerSupportBook(node).text().trim()).get();
assert.deepEqual(supportTitles.slice(2).map((title) => title.slice(0, 2)), ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]);
assert(customerSupportBook(".book-toc-mobile summary").text().includes("全11章"));
assert.equal(page("cases/customer-support-ai-dx/executive-summary")(".series-position-inline").text(), "現在位置：第01章・全11章");
const lastSupportChapter = page("cases/customer-support-ai-dx/design-principles");
assert(!lastSupportChapter(".pagination").text().includes("次のページ"));
assert(lastSupportChapter('.pagination a[href="/cases/customer-support-ai-dx/poc-metadata-improvement/"]').length);

// Portfolio explanation diagrams are static first and keep meaningful reading exits.
for (const id of ["system-understanding", "three-ai-maintenance", "specification-debt-review"]) {
 const $ = page("cases/" + id);
 assert.equal($("[data-case-flow]").length, 1);
 assert.equal($("[data-case-flow] svg").length, 2);
 assert($("[data-case-flow] title").text());
 assert($("[data-case-flow] desc").text());
 for(const link of $("[data-case-flow] [data-node]").toArray()) assert($( $(link).attr("href") ).length);
}
for (const route of [
 ...["why-ai", "responsibility-boundary", "knowledge-design", "stopping-conditions", "human-handoff", "executive-summary"].map(slug => "cases/customer-support-ai-dx/" + slug),
 "cases/customer-support-ai-dx/poc-evaluation",
 "cases/customer-support-ai-dx/poc-effect-evaluation",
]) {
 const $ = page(route);
 assert($("[data-explanation-id]").length >= 1);
 assert.equal($("[data-explanation-id] svg, [data-explanation-id] [hidden], [data-explanation-id] button").length, 0);
 for (const figure of $("[data-explanation-id]").toArray()) {
   assert($(figure).find("figcaption").text());
   assert($(figure).find(".support-purpose").text());
   assert($(figure).find(".support-scope").text());
   assert(!/Before|After|Collecting|Retrieving|Answering|Find Failure|Business Acceptance/.test($(figure).text()));
 }
}
assert.equal(page("cases/customer-support-ai-dx/executive-summary")(".support-comparison > section").length, 2);
const comparison = page("cases/customer-support-ai-dx/executive-summary");
assert.equal(comparison(".support-comparison > section").first().find(".support-route").length, 0);
const routes = comparison('[data-flow-from="after-judge"]');
assert.equal(routes.length, 2);
assert.deepEqual(routes.map((_, node) => comparison(node).attr("data-flow-to")).get(), ["after-answer", "after-handoff"]);
assert.deepEqual(routes.map((_, node) => comparison(node).attr("data-flow-condition")).get(), ["回答可能", "自動回答できない・専門判断が必要"]);
assert.equal(routes.find(".support-branch-connector").length, 2);
assert.deepEqual(routes.last().find("[data-support-step]").map((_, node) => comparison(node).attr("data-support-step")).get(),
  ["after-handoff", "after-investigate", "after-human-answer"]);
assert.equal(page("cases/customer-support-ai-dx/why-ai")(".support-table tbody tr").length, 4);
assert.equal(page("cases/customer-support-ai-dx/responsibility-boundary")(".support-table tbody tr").length, 3);
assert.equal(page("cases/customer-support-ai-dx/stopping-conditions")(".support-checks > li").length, 3);
assert.equal(page("cases/customer-support-ai-dx/poc-evaluation")('[data-explanation-id="support-poc-checks"] tbody tr').length, 3);
assert.equal(page("cases/customer-support-ai-dx/human-handoff")('[data-explanation-id="support-handoff-information"] tbody tr').length, 7);
assert.equal(page("about")('meta[http-equiv="refresh"]').length, 0);
assert(!page("about")('meta[name="robots"]').attr("content")?.includes("noindex"));
console.log("Verified Portfolio SVG explanations, compact Home and indexable About page.");

// Knowledge gateways and reading exits do not recommend Case content.
for (const [id, data] of entries) {
  if (data.section !== "cases" && !id.startsWith("career/") && data.public !== false) {
    assert.equal(page(id)('[data-related-content] a[href*="/cases/"]').length, 0, id);
    // Inline citations remain valid; only automatically inserted recommendations are prohibited.
  }
}
for (const route of ["ai", "ai-design", "practices", "dx", ...["value-design", "business-transformation", "selection-retirement", "system-transformation", "continuous-value"].map((id) => "dx/" + id)]) {
  const $ = page(route);
  assert.equal($('main a[href^="/cases/"]').length, 0, route);
  assert.equal($('main [data-content-id^="cases/"]').length, 0, route);
}
assert.equal(page("about")('main h2').filter((_, node) => page("about")(node).text() === "次に読む").length, 0);
assert.equal(page("about")('main a[href="/"]').text(), "庭に戻る");
const homeHero = top('.home-hero-layout');
assert.equal(homeHero.find('.lead').first().text(), 'Rosariumは、AI・DX・システム設計に関する知識や実践事例を整理・公開する個人技術サイトです。');
assert.equal(homeHero.find('.lead').last().text(), 'AIの数学・基礎理論から、設計原則、業務への適用、実際の問題解決までを扱っています。');
assert.equal(homeHero.find('#home-main-case-heading').text(), '問い合わせDXの要件・方式設計');
assert.equal(homeHero.find('.home-main-case .eyebrow').text(), 'MAIN CASE / 代表設計事例');
assert(homeHero.find('.home-main-case').text().includes('検索対象制御・回答許可判定・有人引継ぎ・評価条件'));
assert(homeHero.find('.home-main-case .meta').text().includes('本番導入済みの実績ではありません'));
assert.equal(homeHero.find('.home-main-case a').attr('href'), '/cases/customer-support-ai-dx/');
assert.equal(homeHero.find('.home-main-case a').text().trim(), '問い合わせDXの設計事例を見る →');
assert.equal(homeHero.find('.home-career-link a').attr('href'), '/career/');
assert.equal(homeHero.find('.home-career-link a').text(), '作者のキャリア');
assert.equal(homeHero.find('.lead').length, 2);
assert.equal(homeHero.find('.home-career').length, 0);
assert.equal(homeHero.children().first().is('header.page-heading'), true);
assert.equal(homeHero.children().last().is('aside.home-main-case'), true);
assert(top('.home-hero-layout').index() < top('[aria-labelledby="home-cases-heading"]').index());

for (const [route, icon] of [["", "home"], ["ai", "articles"], ["dx", "overview"], ["cases", "cases"], ["retired", "archive"]]) {
  const $ = page(route);
  assert.equal($("main .hero .icon-page,main .page-heading > .icon-page").length, 1, route + ": one entrance icon");
  assert.equal($("main .icon-page.icon-" + icon).length, 1, route + ": canonical entrance icon");
  assert.equal($('.sidebar a[href="/' + (route ? route + '/' : '') + '"] .icon-' + icon).length, 1, route + ": Navigation icon agrees");
}

// New documentation review Case preserves a human decision boundary and static SVG paths.
const debtCase = page("cases/specification-debt-review");
const debtFigure = debtCase("#case-maintenance-documentation-debt");
for (const layout of ["mobile", "desktop"]) {
  const svg = debtFigure.find(`.case-layout-${layout}`);
  assert.equal(svg.find("[data-node]").length, 14);
  for (const id of ["change", "retain", "research", "decision"]) assert.equal(svg.find(`[data-node="${id}"]`).length, 1);
  assert.equal(svg.find(".case-edge-dashed").length, 1, "Additional investigation returns to evidence collection");
}
assert(debtCase('main').text().includes("約40件は修正件数ではなく"));
assert(debtCase('main').text().includes("現在のコードを正本として扱った"));
assert(debtCase('main').text().includes("Windows 2000に関する記述が残っており、不要な古い説明として削除した"));
assert(debtCase('main').text().includes("コードだけでは決まらない部分は人間が判断"));
assert(!debtCase('main').text().includes("正解そのものではありません"));
assert(debtCase('main').text().includes("一連のレビューと修正を約3時間で完了した"));
assert(debtCase('main').text().includes("削減率・短縮率・ROIは未評価"));
assert(!debtCase('main').text().includes("1日"));
assert(cases('[data-series-index="cases/specification-debt-review"]').text().includes("Case"));
console.log("Verified documentation debt Case metrics, limitations, human decisions and static SVG fallbacks.");
assert.equal(top('[aria-labelledby="home-cases-heading"] li').length, 3);
assert.equal(top('[aria-labelledby="home-cases-heading"] a[href="/cases/customer-support-ai-dx/"]').length, 1);
assert(top('[aria-labelledby="home-cases-heading"]').text().includes("設計事例"));
assert.equal(page("software-engineering/code-maintenance-context")('.prose a[href="/cases/specification-debt-review/"]').length, 1, "Authored Case evidence remains clickable");
assert(page("foundations/applicability-and-delegation")('main a[href="/cases/customer-support-ai-dx/"]').length, "Principle reaches its mapped Case");
assert(page("cases/customer-support-ai-dx")('main a[href="/foundations/applicability-and-delegation/"]').length, "Case returns to its principle");
for (const [id, data] of entries) {
  if (data.public === false || data.status === "draft") continue;
  const $ = page(id === "career/overview" ? "career" : id);
  const links = $('.case-knowledge-links a').map((_, node) => $(node).attr('href')).get();
  assert(links.length <= (data.section === "cases" ? 3 : 2), id);
  assert.equal(new Set(links).size, links.length, id);
  for (const href of links) assert.equal($(`.prose a[href="${href}"]`).length, 0, `${id}: no repeated evidence link`);
}
const judgmentPage = page("software-engineering/engineering-judgment-in-ai-code-review");
assert.equal(judgmentPage('.prose pre').length, 0, "The withdrawn invented shutdown examples must not return");
const judgmentText = judgmentPage('.prose').text();
for (const fact of ["プラグインについて、不具合調査の依頼を受けた", "AIを活用してソースコードを調査", "私自身がコードを読んで", "リソース解放の呼び出し順序", "初期化と終了処理が整合しているか", "問題箇所の特定につながった"]) assert(judgmentText.includes(fact), fact);
assert(!judgmentText.includes("作業処理が、終了時の残処理を保存先へ書き出す"));
assert.equal(judgmentPage("[data-content-history]").length, 0);
assert(gardenNotes('[data-growth-date="2026-10-18"]').text().includes("本人が確認した調査・判断の記録に整理"));
const practiceGateway = page("practices");
assert.equal(practiceGateway("#adoption-questions tbody tr").length, 7);
assert.equal(practiceGateway('main a[href="/practices/ai-adoption-and-effective-use/"]').length, 0);
assert.equal(practiceGateway('main a[href="/essays/trust-in-ai-generated-content/"]').length, 0);
assert(page("essays")('a[href="/essays/trust-in-ai-generated-content/"]').length);
assert(page("essays/trust-in-ai-generated-content")(".prose").text().trim());

// Explicit AI theme assignments add related links without replacing the reading entry point.
const aiRelatedPage = load(fs.readFileSync("dist/ai/index.html", "utf8"));
assert.equal(aiRelatedPage("[data-domain-theme=ai]").length, 6);
assert.equal(aiRelatedPage("[data-ai-practice-links]").length, 0);
for (const [id, data] of entries) {
  if (!data.ai_theme || data.public === false || data.status === "draft") continue;
  const related = aiRelatedPage(`#${data.ai_theme} [data-ai-related]`);
  // These two first publications must remain discoverable in their assigned themes.
  if (["software-engineering/engineering-judgment-in-ai-code-review", "essays/from-ai-efficiency-to-value"].includes(id)) {
    assert.equal(related.find(`a[href="/${id}/"]`).length, 1);
    assert.equal(related.find(`a[href="/${id}/"]`).text(), data.title);
  }
}
console.log("Verified AI article links inside existing themes without a standalone new-article section.");

// The same representative order is visible at all three reader entry points.
const representativeUrls = ["/cases/customer-support-ai-dx/", "/cases/specification-debt-review/", "/cases/three-ai-maintenance/"];
assert.deepEqual(top('[aria-labelledby="home-cases-heading"] a[href^="/cases/"]').map((_, el) => top(el).attr('href')).get(), [...representativeUrls, "/cases/ai-technical-investigation/"]);
assert.equal(cases('.case-highlight-list a').first().attr('href'), '#case-customer-support-ai-dx');
assert.equal(cases('[data-series-index]').first().attr('data-series-index'), 'cases/customer-support-ai-dx');
// Keep source block order visible even when semantic directive class naming changes.
const careerAllCaseUrls = page('career')('.prose a[href^="/cases/"]').map((_, el) => page('career')(el).attr('href')).get();
assert.deepEqual(careerAllCaseUrls.filter(href => representativeUrls.includes(href)).slice(0, 3), representativeUrls);
const supportOverview = page('cases/customer-support-ai-dx');
assert(supportOverview('.prose').text().includes('本事例は設計・検証シナリオです'));
assert.equal(supportOverview('header [data-content-history]').length, 0);
assert.equal(supportOverview('[data-content-history]').length, 0);
assert.equal(supportOverview('[data-support-dx]').length, 0);

const firstPoc = page('cases/customer-support-ai-dx/poc-evaluation');
const secondPoc = page('cases/customer-support-ai-dx/poc-effect-evaluation');
const improvedPoc = page('cases/customer-support-ai-dx/poc-metadata-improvement');
const oldPoc = page('evaluation-hitl/customer-support-qa-poc');
for(const text of ['構想した3機能が技術的に実現可能かを確認する','確認した3機能','技術的な実現可能性を確認しました。この結果を踏まえ、QAシステムの本格開発へ進みました']) assert(firstPoc('.prose').text().includes(text));
for(const text of ['定型問い合わせ','専門判断が必要','回答根拠不足']) assert(secondPoc('.prose').text().includes(text),text);
assert(!/\d+件|％|誤検索|誤自動回答|再検証/.test(firstPoc('.prose').text()));
assert(!/有人引継ぎ|回答許可|専門判断|メタデータ|停止判定/.test(firstPoc('.prose').text()));
assert.deepEqual(firstPoc('[data-explanation-id="support-poc-checks"] tbody th').map((_,el)=>firstPoc(el).text()).get(), ['逆質問','ベクトル検索','RAGによる回答生成']);

const secondBusiness = improvedPoc('.prose').text().split('10.3 月750件')[1];
assert(secondBusiness && !/250/.test(secondBusiness));
assert(secondBusiness.includes('400時間／月 − 120時間／月 ＝ 280時間／月'));
assert(!/250/.test(supportOverview('.prose').text()));
assert.equal(firstPoc('[data-explanation-id="support-poc-checks"]').length,1);
assert.equal(firstPoc('[data-explanation-id="support-poc-evaluation"]').length,0);
assert.equal(secondPoc('[data-explanation-id="support-poc-evaluation"]').length,1);
assert.equal(secondPoc('.book-toc').length,1);
assert.equal(secondPoc('.series-position-inline').text(),'現在位置：第07章・全11章');
const supportChapterSlugs = [
 'executive-summary', 'why-ai', 'responsibility-boundary', 'poc-evaluation',
 'human-handoff', 'customer-experience', 'poc-effect-evaluation',
 'knowledge-design', 'stopping-conditions', 'poc-metadata-improvement', 'design-principles',
];
for (const [index, slug] of supportChapterSlugs.entries()) {
 const $ = page('cases/customer-support-ai-dx/' + slug);
 const expected = [index > 0 ? '/cases/customer-support-ai-dx/' + supportChapterSlugs[index-1] + '/' : '/cases/customer-support-ai-dx/',
   ...(index < supportChapterSlugs.length-1 ? ['/cases/customer-support-ai-dx/' + supportChapterSlugs[index+1] + '/'] : [])];
 assert.deepEqual($('.pagination a').map((_,el)=>$(el).attr('href')).get(), expected, slug + ': previous/next order');
 const chapterLinks = $('.book-toc .page-toc-panel > ol a').map((_,el)=>$(el).attr('href')).get().slice(1);
 assert.deepEqual(chapterLinks, supportChapterSlugs.map(s=>'/cases/customer-support-ai-dx/'+s+'/'), slug + ': desktop chapter order');
 assert.equal($('.book-toc-mobile:not([data-page-heading-toc]) a[aria-current="page"]').attr('href'), '/cases/customer-support-ai-dx/'+slug+'/');
}

assert(oldPoc('meta[http-equiv="refresh"]').attr('content').endsWith('/cases/customer-support-ai-dx/poc-metadata-improvement/'));
assert(oldPoc('link[rel="canonical"]').attr('href').endsWith('/cases/customer-support-ai-dx/poc-metadata-improvement/'));
assert.equal(oldPoc('[data-pagefind-body], [data-explanation-id]').length,0);
assert(!fs.readFileSync('dist/sitemap.xml','utf8').includes('/evaluation-hitl/customer-support-qa-poc/'));
assert.equal(page('evaluation-hitl')('[data-content-id="evaluation-hitl/customer-support-qa-poc"]').length,0);
assert.equal(cases('.case-study-index').length,4);
const revisedSupportDiagram = supportDiagram('[data-support-dx]');
assert(revisedSupportDiagram.find('[data-support-step="search"]').text().includes('判定A'));
assert(revisedSupportDiagram.find('[data-support-step="decision"]').text().includes('判定B'));
for(const $ of [supportOverview,firstPoc,secondPoc,improvedPoc]){
 assert.equal($('.prose a[href="/evaluation-hitl/customer-support-qa-poc/"]').length,0);
 assert(!/180／250|240／250|1,000件/.test($('.prose').text()));
 assert.equal($('[data-explanation-id="support-validation-stages"]').length,0);
}
// Recruiter entrances lead with architecture while preserving confirmed work and scope.
for (const route of ['', 'career', 'cases']) {
  const $ = page(route);
  for (const value of ['約40件', '約7割', '当初想定']) assert($('main').text().includes(value), route+': '+value);
  assert($('main').text().includes('設計事例'), route);
}
const judgmentRoute = '/software-engineering/engineering-judgment-in-ai-code-review/';
assert.equal(page('')(`main a[href="${judgmentRoute}"]`).length, 0);
assert(page('career')(`main a[href="${judgmentRoute}"]`).length);
const careerIntro = page('career')('.prose').text().split('技術的バックグラウンド')[0];
for (const value of ['既存ソフトウェアの問題', '要件整理から実装・評価', '自分で行います']) assert(careerIntro.includes(value), value);
assert(!page('career')('.prose').text().includes('FDE'));
assert(page('career')('.prose').text().includes('設計事例（検証シナリオ）'));
for (const route of ['about', 'start-here']) {
 const $ = page(route);
 for (const target of ['career','cases']) assert($(`main a[href="/${target}/"]`).length, route+': '+target);
}
console.log('Verified recruiter reading routes, consistent evidence order and work/scenario distinctions.');

assert.equal(top('#featured-case-heading a').attr('href'), '/cases/customer-support-ai-dx/');
assert(top('.entrance-hero > .lead').text().includes('Rosariumは、AI・DX・システム設計に関する知識や実践事例を整理・公開する個人技術サイトです。'));
assert(top('[aria-labelledby="home-cases-heading"] h3').text().includes('設計を支える実務実績'));
assert.equal(top('[aria-labelledby="featured-case-heading"] p').length, 2);
assert(top('[aria-labelledby="featured-case-heading"]').text().includes('PoCでの方式改善'));

for (const [alias, destination] of Object.entries(supportPocLegacyFragments)) {
 const [route, fragment] = destination.split('#');
 assert.equal(page(route)(`[id="${fragment}"]`).length, 1, alias + ': legacy fragment destination');
}
assert(improvedPoc('.prose').text().includes('文書検索の適合率は72％から98％へ'));
assert(!secondPoc('.prose').text().includes('目標を達成'));

assert(improvedPoc(".prose").text().includes("125時間／月 × 0.96 ＝ 120時間／月"));
assert(improvedPoc(".prose").text().includes("文書検索の適合率98％とは別の試算前提"));

for(const [route, aliases] of Object.entries(bookChapterLegacyFragments)) {
 for(const [old,target]of Object.entries(aliases)){
  const [destination,fragment]=target.split("#");
  assert.equal(page(destination)(`[id="${fragment}"]`).length,1,route+": "+old);
 }
}
for(const file of walk("dist").filter(file=>file.endsWith(".html"))) {
 const $=load(fs.readFileSync(file,"utf8"));
 const position=$('.series-position-inline').text();
 if(position)assert(!/第[1-9]章/.test(position), file+': padded chapter position');
}

assert.equal(supportOverview('.prose table, .prose figure, .prose ol').length,0);
assert.equal(supportOverview('.prose ul li').length,2);
assert.equal(supportOverview('.prose > h2').length,5);
assert(supportOverview('.prose').text().replace(/\s/g,'').length<700);
assert.equal(supportOverview('.prose').text().match(/本事例は設計・検証シナリオです/g).length,1);

assert(supportOverview('.document-header [data-pagefind-meta="summary"]').is('[hidden]'));
assert.equal(supportOverview('[data-book-introduction]').next().attr('class'),'book-toc-mobile');
assert.equal(supportOverview('.book-introduction-metadata .meta').length,1);

for(const file of walk("dist").filter(file=>file.endsWith(".html"))) {
 const $=load(fs.readFileSync(file,"utf8"));
 if($('.series-position-inline').length)assert.match($('.series-position-inline').text(), /^現在位置：.+・全\d+章$/,file+': meaningful series position');
}

assert.equal(supportOverview('.book-toc-mobile[data-page-heading-toc]').length,0);

assert.deepEqual(secondPoc('.evaluation-unmet').map((_,node)=>secondPoc(node).text()).get(),["72％","必要な品質に未達","94％","要件100％に未達"]);
for(const row of secondPoc('.prose table').eq(1).find('tbody tr').toArray()) {
 const cells=secondPoc(row).find('td');
 if(cells.eq(1).text().trim()==='98％')assert.equal(secondPoc(row).find('.evaluation-unmet').length,0);
}

const removedChapter=page("cases/customer-support-ai-dx/continuous-improvement");
assert(removedChapter('meta[http-equiv="refresh"]').attr("content").endsWith("/cases/customer-support-ai-dx/poc-metadata-improvement/"));
assert(removedChapter('link[rel="canonical"]').attr("href").endsWith("/cases/customer-support-ai-dx/poc-metadata-improvement/"));
assert(removedChapter('meta[name="robots"]').attr("content").includes("noindex"));
assert.equal(removedChapter("[data-pagefind-body],.book-toc").length,0);
assert(!fs.readFileSync("dist/sitemap.xml","utf8").includes("/cases/customer-support-ai-dx/continuous-improvement/"));

for(const file of walk("dist").filter(file=>file.endsWith(".html"))) {
 const $=load(fs.readFileSync(file,"utf8"));
 assert.equal($('a[href="/cases/customer-support-ai-dx/continuous-improvement/"]').length,0,file+": removed chapter must not be linked");
}

for(const slug of ["executive-summary","why-ai","responsibility-boundary","poc-evaluation","human-handoff","customer-experience"]) {
 const $=page("cases/customer-support-ai-dx/"+slug);
 assert.equal($("[data-support-dx]").length,0,slug+": final controlled architecture belongs to chapter 09");
 assert(!/メタデータ|判定A|判定B|72％|94％|98％/.test($(".prose").text()),slug+": initial design must not anticipate post-PoC controls");
}

// A case book has one canonical chapter per page, with matching navigation and diagrams.
const investigationRoot = "cases/ai-technical-investigation";
const investigationChapters = ["background", "initial-investigation", "shared-library-investigation", "crash-resolution", "memory-leak-investigation"];
const investigationPages = [investigationRoot, ...investigationChapters.map(slug => investigationRoot + "/" + slug)];
for (const [index, route] of investigationPages.entries()) {
  const $ = page(route);
  assert.equal($(".prose figure.diagram").length, [0, 1, 1, 0, 0, 1][index]);
  if (index > 0) assert.match($("h1").first().text(), new RegExp("^" + String(index).padStart(2, "0") + "\\."));
  for (const target of investigationPages) {
    assert($(".book-toc a").toArray().some(e => $(e).attr("href") === "/" + target + "/"));
  }
  const expectedNeighbors = investigationPages.filter((_, i) => i === index - 1 || i === index + 1).map(id => "/" + id + "/");
  assert.deepEqual($(".pagination .content-title a").map((_, e) => $(e).attr("href")).get(), expectedNeighbors);
}
const movedInvestigation = page("software-engineering/ai-technical-investigation-design");
assert.match(movedInvestigation("meta[name=robots]").attr("content"), /noindex/);
assert.equal(movedInvestigation("meta[http-equiv=refresh]").attr("content"), "0;url=/" + investigationRoot + "/");
assert.equal(movedInvestigation(".prose figure").length, 0);

const retiredInvestigationChapter = page("cases/ai-technical-investigation/investigation-principles");
assert.match(retiredInvestigationChapter("meta[name=robots]").attr("content"), /noindex/);
assert.equal(retiredInvestigationChapter("meta[http-equiv=refresh]").attr("content"), "0;url=/cases/ai-technical-investigation/memory-leak-investigation/");
assert.equal(retiredInvestigationChapter(".prose figure, [data-pagefind-body]").length, 0);
assert(!fs.readFileSync("dist/sitemap.xml", "utf8").includes("/cases/ai-technical-investigation/investigation-principles/"));
for (const route of investigationPages) {
 const $ = page(route);
 assert.equal($(".book-toc a[href='/cases/ai-technical-investigation/investigation-principles/'], .book-toc-mobile a[href='/cases/ai-technical-investigation/investigation-principles/']").length, 0);
 assert($("main").text().includes("全5章"));
}
for (const route of ["software-engineering/ai-technical-investigation-design", "cases/ai-technical-investigation/investigation-principles"]) {
 const html = fs.readFileSync("dist/" + route + "/index.html", "utf8");
 const match = html.match(/const legacyTargets = (\{[\s\S]*?\});/);
 assert(match, "Legacy heading map must be retained: " + route);
 for (const target of Object.values(JSON.parse(match[1]))) {
  const [pathname, hash] = target.split("#");
  const $ = page(pathname.replace(/^\//, "").replace(/\/$/, ""));
  if (hash) assert($("[id]").toArray().some(e => $(e).attr("id") === decodeURIComponent(hash)), target);
 }
}

// Case navigation parity: preserve the existing components rather than adding duplicate exits.
const investigationHrefs = investigationPages.map(id => "/" + id + "/");
assert.equal(page("cases")('[data-series-index="cases/ai-technical-investigation"] .content-title a').attr("href"), investigationHrefs[0]);
const investigationInlineLinks = [
 ["initial-investigation", ["knowledge-context/instruction-knowledge-evidence", "knowledge-context/prompt-structure", "software-engineering/engineering-judgment-in-ai-code-review"]],
 ["shared-library-investigation", ["evaluation-hitl/responsibility-and-hitl"]],
 ["memory-leak-investigation", ["evaluation-hitl/code-evaluation-acceptance"]],
];
for (const [chapter, targets] of investigationInlineLinks) {
 const $ = page(investigationRoot + "/" + chapter);
 assert.deepEqual($(".prose a[href]").map((_, e) => $(e).attr("href")).get(), targets.map(id => "/" + id + "/"));
 for (const target of targets) {
  const targetPage = page(target);
  assert(targetPage("h1").text().trim());
  assert(!/noindex/.test(targetPage('meta[name="robots"]').attr("content") || ""));
 }
}
for (const [index, route] of investigationPages.entries()) {
 const $ = page(route);
 assert.equal($('.breadcrumb a[href="/cases/"]').length, 1);
 const mobile = $('.book-toc-mobile:not([data-page-heading-toc])');
 assert.equal(mobile.length, 1);
 assert.deepEqual(mobile.find("a").map((_, e) => $(e).attr("href")).get(), investigationHrefs);
 assert.equal(mobile.find('a[aria-current="page"]').attr("href"), investigationHrefs[index]);
 const desktop = $('.book-toc > .page-toc-panel > ol a');
 assert.deepEqual(desktop.map((_, e) => $(e).attr("href")).get(), investigationHrefs);
 const bodyLinks = new Set($(".prose a[href]").map((_, e) => $(e).attr("href")).get());
 for (const href of $('.case-knowledge-links a').map((_, e) => $(e).attr("href")).get()) assert(!bodyLinks.has(href));
}
assert.deepEqual(page(investigationRoot)('.case-knowledge-links a').map((_, e) => page(investigationRoot)(e).attr("href")).get(), ["/knowledge-context/instruction-knowledge-evidence/", "/evaluation-hitl/responsibility-and-hitl/"]);
for (const [route, parent] of [[investigationRoot + "/memory-leak-investigation", investigationRoot], ["cases/customer-support-ai-dx/design-principles", "cases/customer-support-ai-dx"]]) {
 const $ = page(route);
 assert($('.breadcrumb a[href="/cases/"]').length);
 assert($('.book-toc-mobile:not([data-page-heading-toc]) a').toArray().some(e => $(e).attr("href") === "/" + parent + "/"));
 assert.equal($(".pagination .content-title a").length, 1);
 assert(!$(".pagination").text().includes("次のページ"));
}
console.log("Verified technical investigation Case navigation parity, five inline references and nonduplicated Knowledge links.");

// The new Home Case reuses the existing list and history without duplicate registration.
const investigationHomeHref = "/cases/ai-technical-investigation/";
assert.equal(top('[aria-labelledby="home-cases-heading"] li a[href="'+investigationHomeHref+'"]').length, 1);
assert.equal(cases('[data-series-index="cases/ai-technical-investigation"]').length, 1);
for (const view of [top, gardenNotes]) {
 assert.equal(view('[data-growth-entry] a[href="'+investigationHomeHref+'"]').length, 1);
 assert.equal(view('[data-growth-date="2026-10-29"] a[href="'+investigationHomeHref+'"]').length, 1);
}

// AI investment essay uses existing publication, category and Garden Notes paths.
const investmentId = "essays/ai-investment-value-cost-evolution";
const investmentHref = "/" + investmentId + "/";
const investment = page(investmentId);
assert(investment('.prose').text().includes("ROIの厳密な財務定義ではなく"));
assert(investment('.prose').text().includes("標準環境に対して増える価値"));
for (const route of ["", "garden-notes", "essays", "dx/value-design"]) assert.equal(page(route)('main a[href="'+investmentHref+'"]').length,1,route);
for (const feed of ["rss.xml", "feed.json", "sitemap.xml"]) assert(fs.readFileSync("dist/"+feed,"utf8").includes(investmentHref),feed);
