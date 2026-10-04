import { recentGrowth } from "../src/data/recent-growth.ts";
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
const formatDateJa = (value) => {
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
};
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
      $(".document-header .content-last-updated time").attr("datetime"),
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
assert.equal(career('a[href="/Rosarium/career/details/"]').length, 0);
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
assert.equal(details('meta[http-equiv="refresh"]').attr("content"), "0;url=/Rosarium/career/");
assert(details('a[href="/Rosarium/career/"]').length);
assert(career('a[href^="https://www.linkedin.com/in/"]').length === 1);
assert.equal(career('a[href="/Rosarium/career/profile/"]').length, 0);
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
    "/Rosarium/",
    `${html}: base-aware brand link`,
  );
  assert.equal(
    brand.find(".brand-author,.brand-domain,.icon").length,
    0,
    `${html}: brand must not contain profile or decorative content`,
  );
  assert.equal(
    brand.find('img.brand-mark[src="/Rosarium/favicon.svg"]').length,
    1,
    `${html}: shared brand mark`,
  );
}
assert.equal(top(".home-introduction a").length, 1);
assert.equal(top('.home-introduction a[href="/Rosarium/about/"]').length, 1);
assert(top(".home-site-description").text().includes("AIを主軸に"));
assert(
  top(".home-site-description").text().includes("DX・システム設計"),
);
assert(!top("main").text().includes("Applied AI / System Architecture"));
assert(top(".home-site-description").text().includes("実践例・設計判断"));
assert.deepEqual(
  top(".sidebar nav a .nav-copy > span")
    .map((_, e) => top(e).text())
    .get(),
  ["庭", "AI", "DX", "実践事例", "Reference"],
);
assert.deepEqual(
  top(".header-primary a")
    .map((_, e) => top(e).text().trim())
    .get(),
  ["庭", "AI", "DX", "事例"],
);
assert.equal(top('.header-primary a[href="/Rosarium/cases/"]').length, 1);
assert.equal(top('.header-primary a[href="/Rosarium/career/"]').length, 0);
assert.equal(top('.home-career a[href="/Rosarium/career/"]').length, 1);
assert.equal(top(".header-actions a").length, 0);
assert.equal(top("#global-search-input").length, 1);
assert.equal(top(".global-search-toggle").length, 1);
assert(!top(".sidebar summary").text().includes("設計体系"));
for (const secondary of ["詳細職務経歴", "Books", "連載", "Essays"])
  assert(
    !top(".sidebar nav a .nav-copy > span").text().includes(secondary),
    secondary,
  );
assert.equal(top(".sidebar .icon").length, 5);
assert.equal(
  new Set(
    top(".sidebar .icon")
      .map((_, e) => top(e).attr("class"))
      .get(),
  ).size,
  5,
);
assert.equal(top('.sidebar a[href="/Rosarium/career/"]').length, 0);
assert.equal(top('.sidebar a[href="/Rosarium/updates/"]').length, 0);
assert.deepEqual(
  top(".sidebar .nav-children a .nav-copy > span")
    .map((_, e) => top(e).text())
    .get(),
  [],
);
assert.equal(top(".sidebar .nav-children .icon").length, 0);
assert.equal(top(".sidebar").length, 1);
assert.equal(career(".sidebar,.toc").length, 0);
assert.equal(career(".global-search").length, 1);
assert.equal(career(".header-primary").length, 1);
assert.equal(career("#theme").length, 1);
assert.deepEqual(
  career(".header-primary a")
    .map((_, e) => career(e).text().trim())
    .get(),
  ["庭", "AI", "DX", "事例"],
);
assert(career('a[href="/Rosarium/ai/"]').length);
assert(career('a[href="/Rosarium/dx/"]').length);
assert(career('a[href="/Rosarium/cases/"]').length);
const primaryIds = ($) =>
  $("[data-primary-index] [data-content-id]")
    .map((_, e) => $(e).attr("data-content-id"))
    .get();
const design = page("ai-design");
assert.deepEqual(
  new Set(primaryIds(design)),
  new Set(
    [...entries].filter(([, d]) => d.layer === "ai-design").map(([id]) => id),
  ),
);
for (const id of primaryIds(design))
  assert.notEqual(entries.get(id).source?.type, "zenn");
assert.deepEqual(
  design(".design-flow li")
    .map((_, e) => design(e).text().trim())
    .get(),
  [
    "価値",
    "実現したい業務変化",
    "業務・システム設計",
    "AI・人間・既存システムの役割分担",
    "必要なAI技術",
    "安全性・責任境界",
    "評価・改善",
    "運用・再設計",
  ],
);
assert.deepEqual(
  design(".design-area-list .eyebrow")
    .map((_, e) => design(e).text().trim())
    .get(),
  ["700", "800", "900", "1000", "1100", "1200"],
);
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
  for (const id of primaryIds($)) {
    assert.equal(entries.get(id).layer, "ai-design");
    assert.equal(entries.get(id).design_topic, topic);
  }
  assert.equal($("[data-related-publications]").length, 0);
}
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
  [
    "ai-mathematics",
    "ai-mathematics",
    [
      "foundations/guardrail-models",
      "foundations/layered-hallucination-controls",
    ],
  ],
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
    .filter(([, data]) => data.layer === layer && data.section !== "cases" && data.public !== false)
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
assert.equal(pubs("#ai-themes-heading").text(), "AIを考える5つのテーマ");
const aiSections = pubs('[data-domain-theme="ai"]');
assert.equal(aiSections.length, 5);
assert.deepEqual(aiSections.find(".dx-theme-introduction h2").map((_, el) => pubs(el).text()).get(),
  ["AI設計", "AIの性質・理論", "Knowledge / Context", "評価・人による確認", "実践・開発"]);
const aiFeatured = pubs("[data-ai-featured]").map((_, el) => pubs(el).attr("data-ai-featured")).get();
assert.equal(aiFeatured.length, 5);
assert.equal(new Set(aiFeatured).size, 5);
for (const element of aiSections.toArray()) {
  const theme = pubs(element);
  assert.equal(theme.find(".dx-theme-questions li").length, 3);
  assert.equal(theme.find("[data-ai-featured]").length, 1);
  assert.equal(theme.find(".dx-theme-introduction p").length, 2);
}
assert.equal(pubs(".secondary-reading").length, 0);
assert.equal(pubs('main a[href^="/Rosarium/cases/"]').length, 0);
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
assert.equal(dx('main a[href^="/Rosarium/cases/"]').length, 0);
assert.equal(dx('main a[href="/Rosarium/ai/"]').length, 0);
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
    dx(`a[href="/Rosarium/dx/${category}/"]`).length,
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
assert(dx('a[href="/Rosarium/essays/dx-and-value/"]').length);
assert.equal(dx('main a[href="/Rosarium/cases/customer-support-ai-dx/"]').length, 0);
assert(!dx('a[href="/Rosarium/foundations/conditional-probability/"]').length);
const dxEssay = page("essays/dx-and-value");
assert.equal(dxEssay('[data-related-content] a[href="/Rosarium/cases/customer-support-ai-dx/"]').length, 0);
assert(dxEssay('[data-related-content] a').length <= 4);
for (const [id, expected] of [
  ["foundations/ai-business-design", ["公開：2026年2月"]],
  ["cases/three-ai-maintenance", ["公開：2026年7月"]],
  ["cases/system-understanding", ["状態：公開", "公開：2026年2月"]],
  ["cases/customer-support-ai-dx", ["公開：2026-09-28"]],
  ["cases/customer-support-ai-dx", ["公開：2026-09-28"]],
]) {
  for (const route of [id.startsWith("cases/") ? "cases" : "series"]) {
    const $ = page(route);
    const metadata = $('[data-content-id="' + id + '"] .publication-date')
      .text()
      .replace(/\s+/g, " ")
      .trim();
    for (const value of expected)
      assert(metadata.includes(value), `${route}: ${id} must display ${value}`);
  }
}
const cases = page("cases");
assert.deepEqual(
  cases("[data-series-index]").map((_, element) => cases(element).attr("data-series-index")).get(),
  ["cases/three-ai-maintenance", "cases/customer-support-ai-dx", "cases/system-understanding"],
);
assert.equal(cases(".case-reference-note span").text().trim(), "OBSOLETE");
assert.equal(cases("#active-cases .case-study-index").length, 2);
assert.equal(cases("#obsolete-cases .case-study-index").length, 1);
assert.equal(cases("#active-cases > h2").text(), "主要事例");
assert.equal(cases("#obsolete-cases > h2").text(), "旧事例");
assert.equal(cases('#obsolete-cases [data-series-index="cases/system-understanding"]').length, 1);
assert(cases(".case-reference-note").text().includes("旧AI環境を前提とした参考事例"));
assert(!cases("main a").text().includes("→"));
assert(page("cases/system-understanding")(".case-position-note").text().includes("現在の推奨構成ではありません"));
assert.equal(
  cases(".header-primary a[aria-current=page]").text().trim(),
  "事例",
);
assert.equal(cases(".case-study-index").length, 3);
assert.equal(cases("main img").length, 0);
assert.equal(cases(".book-list-entry-text").length, 3);
for (const id of [
  "cases/system-understanding",
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
    ["課題", "設計", "結果"],
  );
}
assert.equal(
  cases('[data-content-id="cases/system-understanding"] .publication-topics')
    .text()
    .trim(),
  "自然言語サービス・RAG・Knowledge / AI × Software Engineering / Case・実務",
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
  "0;url=/Rosarium/career/",
);
assert.equal(
  careerProfile('link[rel="canonical"]').attr("href"),
  "https://nullcontroller.github.io/Rosarium/career/",
);
assert(careerProfile('a[href="/Rosarium/career/"]').length);
console.log(
  "Verified reading gateway, layer separation and existing URLs without related publications.",
);

// Phase 4: journal order, preserved summaries, reading route and secondary archives.
assert.equal(design("[data-related-publications]").length, 0);
const mathematics = page("ai-mathematics");
assert.equal(mathematics("[data-mathematics-reading]").length, 0);
for (const id of ["foundations/conditional-probability", "foundations/temperature-design", "foundations/hallucination-mechanisms", "software-engineering/code-generation-models"]) {
  assert(primaryIds(mathematics).includes(id), `${id}: actual theory index remains`);
  assert.equal(page(id)(".pagination").length, 0, `${id}: standalone article has no recommended sequence`);
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
  "cases/three-ai-maintenance",
  "cases/customer-support-ai-dx",
  "cases/system-understanding",
];
for (const route of ["cases", "books"]) {
  const $ = page(route);
  assert.deepEqual(
    $("[data-series-index]")
      .map((_, e) => $(e).attr("data-series-index"))
      .get(),
    expectedBooks,
  );
  assert.equal($("[data-series-index] details, [data-series-index] summary").length, 0);
  assert(!$("[data-series-index]").text().includes("概要・全体構成を読む"));
  assert.equal($("[data-series-index] .content-title").length, 3);
}
assert.equal(
  page("series")('[data-series-index="foundations/ai-business-design"]').length,
  1,
);
const overview = page("overview");
assert.match(overview("meta[name=robots]").attr("content") || "", /noindex/);
assert.equal(
  overview("meta[http-equiv=refresh]").attr("content"),
  "0;url=/Rosarium/ai/",
);
assert(overview('a[href="/Rosarium/ai/"]').length);
const articlesCompatibility = page("articles");
assert.match(
  articlesCompatibility("meta[name=robots]").attr("content") || "",
  /noindex/,
);
assert.equal(
  articlesCompatibility("meta[http-equiv=refresh]").attr("content"),
  "0;url=/Rosarium/ai/",
);
assert(articlesCompatibility('a[href="/Rosarium/ai/"]').length);
console.log(
  "Verified overview compatibility redirect, three case books, independent series and simplified navigation.",
);

assert(top("#recent-growth-heading").length);
assert.equal(top(".growth-scrollbox").length, 0);
assert.equal(top(".home-primary-panels > section").length, 2);
assert.equal(top('a[href="/Rosarium/about/"]').text().trim(), "Rosariumとは？");
assert.equal(top("#about-rosarium").length, 0);
assert.equal(top('a[href="/Rosarium/garden-notes/"]').text().trim(), "Garden Notes");
const gardenNotes = page("garden-notes");
assert.equal(gardenNotes("[data-growth-entry]").length, recentGrowth.length);
assert.equal(gardenNotes("#notes-2026-10").length, 1);
assert.equal(gardenNotes("#notes-2026-09").length, 1);
for (const entry of recentGrowth) {
  const row = gardenNotes(`[data-growth-entry]:has(time[datetime="${entry.date}"])`);
  assert.equal(row.length, 1);
  assert.deepEqual(row.find(".growth-changes > li").toArray().map(li => gardenNotes(li).text()), entry.changes);
  assert.equal(row.find("a").length, 0);
}

assert.equal(top(".growth-list [data-growth-entry]").length, 1);
assert.equal(top('[data-growth-entry] time[datetime="2026-10-04"]').length, 1);
assert.equal(new Set(recentGrowth.map(entry => entry.date)).size, recentGrowth.length);
assert.equal(recentGrowth.find(entry => entry.date === "2026-10-03").changes.length, 4);
assert(recentGrowth.every(entry => !entry.changes.some(change => /表示・導線を整理|UI.?UXを改善/.test(change))));
const growthDates = new Set();
for (const element of top("[data-growth-entry]").toArray()) {
  const entry = top(element);
  assert.equal(entry.find("time").length, 1);
  const date = entry.find("time").attr("datetime");
  assert(!growthDates.has(date), `Duplicate Recent Growth date: ${date}`);
  growthDates.add(date);
  assert.equal(entry.find("p.content-summary").length, 0);
  assert.equal(entry.find("a").length, 0, `${date}: plain text only`);
  assert(!entry.text().includes("→"), `${date}: no navigation arrows`);
  const changes = entry.find(".growth-changes > li");
  assert(changes.length > 0, `${date}: changes are required`);
  for (const change of changes.toArray()) {
    assert(top(change).text().trim());
    assert(
      !/[／/]/.test(top(change).text()),
      `${date}: no slash-joined changes`,
    );
  }
}
assert.equal(
  top("[data-growth-entry]").first().find(".growth-changes > li").length,
  4,
);
assert.equal(
  top(".growth-list [data-growth-entry]").first().find(".content-title").text(),
  "主要事例とCareerを更新",
);
assert.equal(top('a[href="/Rosarium/updates/"]').length, 0);
const updates = page("updates");
assert.match(updates("meta[name=robots]").attr("content") || "", /noindex/);
assert.equal(
  updates("meta[http-equiv=refresh]").attr("content"),
  "0;url=/Rosarium/",
);
assert(updates('a[href="/Rosarium/"]').length);
assert.equal(updates(".growth-list [data-content-id]").length, 0);
assert(
  !fs.readFileSync("dist/feed.xml", "utf8").includes("Rosarium 公開"),
  "Curated Recent Growth must remain separate from the content RSS feed",
);
for (const route of ["ai-mathematics", "practices"]) {
  const $ = page(route);
  assert.equal($(".page-status").length, 0, `${route}: no terminal status`);
  assert.equal(
    $(".status-note").length,
    0,
    `${route}: no terminal status note`,
  );
  assert.equal(
    $(".site-last-updated time").attr("datetime"),
    "2026-10-04",
    `${route}: last updated`,
  );
}
for (const route of ["career", "ai", "reference"])
  assert(
    page(route)("main .icon").length,
    route + " must use the icon language",
  );
for (const route of ["ai-design", "ai-mathematics", "practices", "cases"]) {
  const $ = page(route);
  assert.equal(
    $(
      ".page-heading > .icon,.section-visual,.document-list .icon,.book-list-entry .icon",
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
  assert(
    !$.root().text().includes("\u66f4\u65b0\u4e2d"),
    `${html}: deprecated status remains`,
  );
}
for (const [id, expected] of [
  ["foundations/ai-business-design", ["公開：2026年2月"]],
  ["cases/three-ai-maintenance", ["公開：2026年7月"]],
  ["cases/system-understanding", ["状態：公開", "公開：2026年2月"]],
]) {
  const $ = page(id);
  const text = $.root().text().replace(/\s+/g, " ");
  for (const value of expected) assert(text.includes(value), `${id}: ${value}`);
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
assert.equal(customerSupportBook(".book-toc > ol > li").length, 11);
assert.equal(customerSupportBook(".book-toc-mobile > ol > li").length, 11);
assert.equal(customerSupportBook(".book-toc .content-entry").length, 0);
assert.equal(
  customerSupportBook(".series-position-inline").text(),
  "現在位置：全体構成・全9章",
);
assert.equal(
  page("cases/customer-support-ai-dx/poc-evaluation")(
    ".series-position-inline",
  ).text(),
  "現在位置：第3章・全9章",
);
assert.equal(
  page("cases/customer-support-ai-dx/poc-evaluation")(
    '.book-toc a[aria-current="page"]',
  ).text(),
  "03. PoCで「使えるか」をどう判断したか",
);
assert(
  customerSupportBook("main")
    .text()
    .includes("公開実績として確認できない数値は成果として断定しません"),
);
assert.equal(
  page("cases/customer-support-ai-dx/design-principles")(".series-position-inline").text(),
  "現在位置：第9章・全9章",
);
assert.equal(customerSupportBook('a[href*="outcomes-and-evidence"]').length, 0);
assert.equal(page("career")('main a[href*="/cases/"]').length, 0);
console.log("Verified recent growth and exact Book publication presentation.");

for (const route of ["ai-design", "ai-mathematics", "practices", "cases"]) {
  const $ = page(route);
  assert.equal($(".theme-toc,.theme-toc-mobile").length, 0, `${route}: no duplicated recommendations`);
  if (route === "practices") {
    const categories = $("main [data-practice-category]");
    assert.equal(categories.length, 5);
    assert.deepEqual(categories.map((_, node) => $(node).children("h2").text()).get(), [
      "導入・教育・定着", "Prompt・Knowledge運用", "開発・保守", "評価・Human Review", "組織・キャリア",
    ]);
    categories.each((_, category) => {
      const links = $(category).find(".content-title a").map((_, e) => $(e).attr("href")).get();
      assert(links.length, "Actual Practice index remains");
      assert.equal(new Set(links).size, links.length);
    });
    assert(!$("main").text().includes("業務・開発プロセスへの組込み"));
  } else if (route === "cases") {
    assert.equal($("[data-series-index]").length, 3);
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
    "2026-10-04",
    id,
  );
  assert.equal(
    article('link[rel="canonical"]').attr("href"),
    `https://nullcontroller.github.io/Rosarium/${id}/`,
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
    'a[href="/Rosarium/essays/it-strategy-and-not-building/"]',
  ).length,
);
assert(
  page("dx/business-transformation")(
    'a[href="/Rosarium/essays/rethink-work-before-ai/"]',
  ).length,
);
assert(
  page("dx/system-transformation")(
    'a[href="/Rosarium/essays/legacy-change-and-retirement/"]',
  ).length,
);
assert(
  page("practices")('a[href="/Rosarium/practices/transferring-ai-practices/"]')
    .length,
);
console.log(
  "Verified imported essay discovery, canonical routes, search bodies and feeds; transfer article retains its existing route.",
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
  assert(!$("main a[href]").toArray().some((node) => /→\s*$/.test($(node).text().trim())), `${file}: no arrow CTA`);
}
console.log(
  "Verified absence of automatic related sections and next-reading headings.",
);

// The Book body uses the enhanced SVG; the same raster remains the list thumbnail.
const supportDiagram = page("cases/customer-support-ai-dx");
assert.equal(supportDiagram("[data-support-dx]").length, 1);
assert.equal(supportDiagram("[data-detail]").length, 8);
assert.equal(supportDiagram("[data-support-dx] svg").length, 2);
for (const svg of supportDiagram("[data-support-dx] svg").toArray()) {
  assert.equal(supportDiagram(svg).find("[data-node]").length, 8);
  assert(supportDiagram(svg).find("title").text());
  assert(supportDiagram(svg).find("desc").text().includes("根拠不足"));
}
assert.equal(supportDiagram('article img[src$="customer-support-ai-dx-overview.jpg"]').length, 0);
assert(page("books")('img[src$="customer-support-ai-dx-overview.jpg"]').length > 0);
assert(supportDiagram("#support-detail-decision").text().includes("AI自身の自信だけでは決めません"));
for (const route of ["cases/system-understanding", "cases/three-ai-maintenance", "career"]) {
  assert.equal(page(route)("[data-support-dx]").length, 0);
}
console.log("Verified support DX SVG, static explanation targets and preserved Book thumbnail.");

const compactDiagram = supportDiagram(".diagram-mobile");
assert.equal(compactDiagram.find(".feedback-path").length, 0, "No edge-spanning Mobile feedback loop");
for (const label of compactDiagram.find(".node-label").toArray()) {
  assert(/[ぁ-んァ-ヶ一-龯]/.test(supportDiagram(label).text()), "Main diagram labels explain their role in Japanese");
}
assert(compactDiagram.find('[data-node="feedback"]').text().includes("次回の検索・回答へ反映"));
assert.equal(supportDiagram(".diagram-desktop [data-node]").length, 8);

for (const id of ["cases/system-understanding", "cases/three-ai-maintenance", "cases/customer-support-ai-dx"]) {
  const $ = page(id);
  assert.equal($('[data-related-content] a[href="/Rosarium/career/"]').length, 0);
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

const supportTitles = customerSupportBook(".book-toc a").map((_, node) => customerSupportBook(node).text().trim()).get();
assert.deepEqual(supportTitles.slice(2).map((title) => title.slice(0, 2)), ["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
assert(customerSupportBook(".book-toc-mobile summary").text().includes("全9章"));
assert.equal(page("cases/customer-support-ai-dx/executive-summary")(".series-position-inline").text(), "現在位置：導入・全9章");
const lastSupportChapter = page("cases/customer-support-ai-dx/design-principles");
assert(!lastSupportChapter(".pagination").text().includes("次のページ"));
assert(lastSupportChapter('.pagination a[href="/Rosarium/cases/customer-support-ai-dx/continuous-improvement/"]').length);

// Portfolio explanation diagrams are static first and keep meaningful reading exits.
for (const id of ["system-understanding", "three-ai-maintenance"]) {
 const $ = page("cases/" + id);
 assert.equal($("[data-case-flow]").length, 1);
 assert.equal($("[data-case-flow] svg").length, 2);
 assert($("[data-case-flow] title").text());
 assert($("[data-case-flow] desc").text());
 for(const link of $("[data-case-flow] [data-node]").toArray()) assert($( $(link).attr("href") ).length);
}
for (const slug of ["why-ai", "responsibility-boundary", "poc-evaluation", "knowledge-design", "stopping-conditions", "human-handoff", "continuous-improvement", "executive-summary"]) {
 const $ = page("cases/customer-support-ai-dx/" + slug);
 assert.equal($("[data-case-flow]").length, 1);
 for(const link of $("[data-case-flow] [data-node]").toArray()) assert($( $(link).attr("href") ).length);
}
assert.equal(page("about")('meta[http-equiv="refresh"]').length, 0);
assert(!page("about")('meta[name="robots"]').attr("content")?.includes("noindex"));
console.log("Verified Portfolio SVG explanations, compact Home and indexable About page.");

// Knowledge gateways and reading exits do not recommend Case content.
for (const [id, data] of entries) {
  if (data.section !== "cases" && !id.startsWith("career/") && data.public !== false) {
    assert.equal(page(id)('[data-related-content] a[href*="/cases/"]').length, 0, id);
    assert.equal(page(id)('main .prose a[href*="/cases/"]').length, 0, `${id}: no Case navigation in knowledge prose`);
  }
}
for (const route of ["ai", "ai-design", "practices", "dx", ...["value-design", "business-transformation", "selection-retirement", "system-transformation", "continuous-value"].map((id) => "dx/" + id)]) {
  const $ = page(route);
  assert.equal($('main a[href^="/Rosarium/cases/"]').length, 0, route);
  assert.equal($('main [data-content-id^="cases/"]').length, 0, route);
}
assert.equal(page("about")('main h2').filter((_, node) => page("about")(node).text() === "次に読む").length, 0);
assert.equal(page("about")('main a[href="/Rosarium/"]').text(), "庭に戻る");
assert(page("")('.home-career p br').length, "Career introduction has an explicit sentence break");
