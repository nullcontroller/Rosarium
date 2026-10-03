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
for (const p of walk("dist").filter((p) => p.endsWith(".html"))) {
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
assert.equal(career(".career-focus-grid > section").length, 7);
assert.equal(career(".career-work").length, 3);
assert.equal(career('a[href="/Rosarium/career/details/"]').length, 1);
assert(career(".career-actions").text().includes("経験と実践の背景を見る"));
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
assert.equal(details(".career-work").length, 3);
assert(details("main").text().includes("Experience Overview"));
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
for (const html of walk("dist").filter((file) => file.endsWith(".html"))) {
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
assert.equal(
  top(".home-introduction .lead").text(),
  "学習と実務を通じて育て続ける「庭」",
);
assert(top(".home-site-description").text().includes("AIを仕事にどう組み込み"));
assert(
  top(".home-site-description").text().includes("DX、システム設計、業務設計"),
);
assert(!top("main").text().includes("Applied AI / System Architecture"));
assert(top(".home-introduction").text().includes("立林 裕太朗"));
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
assert(
  page("ai-design/applicability")(
    '[data-related-publications] [data-content-id="essays/dx-and-value"]',
  ).length,
);
assert(
  page("ai-design/lifecycle-operations")(
    '[data-related-publications] [data-content-id="essays/what-not-to-build-with-ai"]',
  ).length,
);
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
  assert($("[data-related-publications] .publication-entry").length);
}
for (const [id, d] of entries) {
  if (d.layer === "ai-design")
    assert(
      page(id)("[data-related-publications] .publication-entry").length,
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
      "cases/understanding-systems-as-capability",
    ],
  ],
]) {
  const $ = page(route);
  const ids = primaryIds($);
  const canonical = [...entries]
    .filter(([, data]) => data.layer === layer && data.public !== false)
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
  "AIに何を任せ、何を人間が判断するか。仕事へ組み込む方法を、設計・理論・実践・事例から考えます。",
);
assert.equal(pubs("#current-topics-heading").length, 0);
assert.equal(pubs("[data-publication]").length, 0);
assert.equal(pubs("[data-use-case-shortcut]").length, 0);
assert.equal(pubs("[data-content-id]").length, 0);
assert.deepEqual(
  pubs(".reading-area .reading-category")
    .map((_, e) => pubs(e).text().trim())
    .get(),
  ["AI設計", "AI理論", "実践知", "実践事例"],
);
assert.deepEqual(
  pubs(".reading-area .reading-question")
    .map((_, e) => pubs(e).text().replace("→", "").trim())
    .get(),
  [
    "AIを仕事やシステムにどう組み込む？",
    "生成AIはなぜそう振る舞う？",
    "AIを仕事や開発でどう使う？",
    "実際の課題にどう適用した？",
  ],
);
assert.equal(pubs(".reading-area > .icon").length, 0);
for (const [section, href] of [
  ["ai-design", "/Rosarium/ai-design/"],
  ["ai-mathematics", "/Rosarium/ai-mathematics/"],
  ["practices", "/Rosarium/practices/"],
  ["cases", "/Rosarium/cases/"],
]) {
  const area = pubs(`#${section}`);
  assert(area.find(`a[href="${href}"]`).length, section);
}
assert.deepEqual(
  pubs(".secondary-reading a")
    .map((_, element) => pubs(element).text().trim())
    .get(),
  ["はじめに読む →", "Booksを見る →", "考察を見る →"],
);
assert.equal(pubs('.secondary-reading a[href="/Rosarium/essays/"]').length, 1);
const dx = page("dx");
assert.equal(dx("h1").text(), "DX");
assert(
  dx(".page-heading .lead").text().includes("業務・サービス・システム・組織"),
);
assert.deepEqual(
  dx("main > section > h2")
    .map((_, element) => dx(element).text())
    .get(),
  ["DXを考える5つのテーマ", "AIとの接続"],
);
assert.deepEqual(
  dx(".dx-category > h3")
    .map((_, element) => dx(element).text().replace("→", "").trim())
    .get(),
  ["価値設計", "業務変革", "選択と廃止", "システム変革", "継続的価値創出"],
);
assert(dx("main").text().includes("有力な手段の一つ"));
assert(dx('.dx-ai-connection a[href="/Rosarium/ai/"]').length);
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
  assert(
    categoryPage('[aria-label="関連する入口"] a[href="/Rosarium/dx/"]').length,
  );
}
assert(dx('a[href="/Rosarium/essays/dx-and-value/"]').length);
assert(dx('a[href="/Rosarium/cases/customer-support-ai-dx/"]').length);
assert(!dx('a[href="/Rosarium/foundations/conditional-probability/"]').length);
const dxEssay = page("essays/dx-and-value");
assert.deepEqual(
  dxEssay(".content-entry-points a")
    .map((_, element) => dxEssay(element).text())
    .get(),
  ["AI", "DX"],
);
assert(dxEssay('.content-entry-points a[href="/Rosarium/ai/"]').length);
assert(dxEssay('.content-entry-points a[href="/Rosarium/dx/"]').length);
assert.deepEqual(
  dxEssay(".content-dx-topics a")
    .map((_, element) => dxEssay(element).text())
    .get(),
  ["価値設計"],
);
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
  "Verified reading gateway, layer separation, related publications and existing URLs.",
);

// Phase 4: journal order, preserved summaries, reading route and secondary archives.
assert.equal(design("[data-related-publications]").length, 0);
const mathematics = page("ai-mathematics");
assert.deepEqual(
  mathematics("[data-mathematics-reading] [data-content-id]")
    .map((_, e) => mathematics(e).attr("data-content-id"))
    .get(),
  [
    "foundations/conditional-probability",
    "foundations/temperature-design",
    "foundations/hallucination-mechanisms",
    "software-engineering/code-generation-models",
  ],
);
const reference = page("reference");
assert.equal(reference("[data-reference-archive]").length, 0);
assert.equal(reference(".site-implementation").length, 0);
assert(!reference("main").text().includes("Knowledge / Publishing as Code"));
assert.equal(
  reference('[data-content-id="foundations/wiki-overview"]').length,
  0,
);
const expectedBooks = [
  "cases/system-understanding",
  "cases/three-ai-maintenance",
  "cases/customer-support-ai-dx",
];
for (const route of ["cases", "books"]) {
  const $ = page(route);
  assert.deepEqual(
    $("[data-series-index]")
      .map((_, e) => $(e).attr("data-series-index"))
      .get(),
    expectedBooks,
  );
  assert.equal($("[data-series-index] details").length, 3);
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
assert.equal(top(".growth-scrollbox").length, 1);
assert.equal(top(".growth-scrollbox").attr("tabindex"), "0");
assert.equal(top(".growth-scrollbox").attr("role"), "region");
assert.equal(
  top(".growth-scrollbox").attr("aria-labelledby"),
  "recent-growth-heading",
);
assert.equal(top("main > section").length, 4);
assert.equal(top('a[href="#about-rosarium"]').text(), "Rosariumとは？ →");
assert.equal(top("#about-rosarium").length, 1);
assert.equal(top("#about-rosarium").text(), "Rosariumという名前について");
assert.equal(top(".growth-list [data-growth-entry]").length, 3);
assert.equal(top('[data-growth-entry] time[datetime="2026-10-04"]').length, 1);
assert.equal(top('[data-growth-entry] time[datetime="2026-10-03"]').closest("[data-growth-entry]").find(".growth-changes > li").length, 8);
const growthDates = new Set();
for (const element of top("[data-growth-entry]").toArray()) {
  const entry = top(element);
  assert.equal(entry.find("time").length, 1);
  const date = entry.find("time").attr("datetime");
  assert(!growthDates.has(date), `Duplicate Recent Growth date: ${date}`);
  growthDates.add(date);
  assert.equal(entry.find("p.content-summary").length, 0);
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
  7,
);
assert.equal(
  top(".growth-list [data-growth-entry]").first().find(".content-title").text(),
  "読書画面と更新履歴を整理",
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
for (const route of ["about", "search"]) {
  const $ = page(route);
  assert.match($("meta[name=robots]").attr("content") || "", /noindex/);
  assert.equal($("meta[http-equiv=refresh]").length, 1);
}
assert.equal(page("practices")("[data-related-publications]").length, 1);
for (const html of walk("dist").filter((file) => file.endsWith(".html"))) {
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
      "GPTにGitHub Copilotを組み合わせることで、より高い生産性を期待できる。",
    ),
);
assert(
  page("cases/three-ai-maintenance")("main")
    .text()
    .includes(
      "GPT、GitHub Copilot、Microsoft 365 Copilotを工程ごとに役割分担して利用した。",
    ),
);
const customerSupportBook = page("cases/customer-support-ai-dx");
assert.equal(customerSupportBook(".series").length, 0);
assert.equal(customerSupportBook(".book-toc > ol > li").length, 12);
assert.equal(customerSupportBook(".book-toc-mobile > ol > li").length, 12);
assert.equal(customerSupportBook(".book-toc .content-entry").length, 0);
assert.equal(
  customerSupportBook(".series-position-inline").text(),
  "現在位置：全体構成・全11章",
);
assert.equal(
  page("cases/customer-support-ai-dx/poc-evaluation")(
    ".series-position-inline",
  ).text(),
  "現在位置：第4章・全11章",
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
assert(
  page("cases/customer-support-ai-dx/outcomes-and-evidence")("main")
    .text()
    .includes("公開実績として未確認"),
);
assert(
  page("cases/customer-support-ai-dx/outcomes-and-evidence")("main")
    .text()
    .includes("公開実績のBefore / Afterではなく"),
);
assert(page("career")('a[href$="/cases/customer-support-ai-dx/"]').length);
console.log("Verified recent growth and exact Book publication presentation.");

for (const route of ["ai-design", "ai-mathematics", "practices", "cases"]) {
  const $ = page(route);
  const desktop = $(".theme-toc a")
    .map((_, e) => $(e).attr("href"))
    .get();
  const mobile = $(".theme-toc-mobile a")
    .map((_, e) => $(e).attr("href"))
    .get();
  assert(desktop.length, `${route}: desktop article index`);
  if (route === "practices") {
    const categories = $("main [data-practice-category]");
    const sidebarGroups = $(".theme-toc .theme-nav-groups > details");
    assert.equal(categories.length, 5);
    assert.equal(categories.length, sidebarGroups.length);
    categories.each((index, category) => {
      const group = sidebarGroups.eq(index);
      assert.equal(
        $(category).children("h2").text(),
        group
          .children("summary")
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim(),
      );
      const links = $(category)
        .find(".content-title a")
        .map((_, e) => $(e).attr("href"))
        .get();
      assert.deepEqual(
        links,
        group
          .find("a")
          .map((_, e) => $(e).attr("href"))
          .get(),
      );
      assert.equal(new Set(links).size, links.length);
    });
    assert.equal($(".theme-toc-mobile").length, 0);
    assert(!$("main").text().includes("業務・開発プロセスへの組込み"));
    continue;
  }
  assert.deepEqual(mobile, desktop, `${route}: mobile article index`);
  assert.equal($(".theme-toc > p").text(), "このテーマの記事");
  assert.match(
    $(".theme-toc-mobile > summary").text(),
    /^このテーマの記事（\d+）$/,
  );
  assert(
    $(".theme-toc .theme-nav-groups > details").length,
    `${route}: grouped desktop index`,
  );
  assert(
    $(".theme-toc-mobile .theme-nav-groups > details").length,
    `${route}: grouped mobile index`,
  );
}
console.log(
  "Verified category article indexes, Garden navigation and updates compatibility.",
);

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
    id === "essays/rethink-work-before-ai" ? "2026-10-04" : "2026-10-03",
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

// Related reading must follow the article and chapter pagination.
for (const file of walk("dist").filter((file) => file.endsWith(".html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  assert(!$("h1,h2,h3,h4").text().includes("Related Design"), file);
  const related = $("[data-related-content]");
  if (!related.length) continue;
  assert.equal(related.length, 1, file);
  assert.equal(
    $("article[data-pagefind-body] [data-related-content]").length,
    0,
    file,
  );
  const order = $("#main").html();
  assert(
    order.indexOf("data-related-content") > order.indexOf("data-pagefind-body"),
    file,
  );
  if ($(".pagination").length) {
    assert(
      order.indexOf("data-related-content") >
        order.indexOf('class="pagination"'),
      file,
    );
  }
  const links = related
    .find("a[href]")
    .map((_, element) => $(element).attr("href"))
    .get();
  assert.equal(
    new Set(links).size,
    links.length,
    `${file}: duplicate related links`,
  );
  assert(
    !$(
      "article[data-pagefind-body] .prose h2, article[data-pagefind-body] .prose h3",
    )
      .toArray()
      .some((element) =>
        /^(関連する入口|関連する設計原則|Explore|Related Design)$/.test(
          $(element).text(),
        ),
      ),
    file,
  );
}
console.log(
  "Verified Japanese related headings, post-body placement and unique related links.",
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
