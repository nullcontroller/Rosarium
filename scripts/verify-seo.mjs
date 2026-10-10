import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
const htmlFiles = walk("dist").filter((name) => name.endsWith(".html") && !name.endsWith("google57af630fc0ce16af.html"));
const titles = new Map();
const canonicals = new Map();
const descriptions = new Map();
let articleCount = 0;
const indexable = [];
const verificationFile = "google57af630fc0ce16af.html";
assert.deepEqual(
  fs.readFileSync(path.join("dist", verificationFile)),
  fs.readFileSync(path.join("public", verificationFile)),
  "Google ownership verification file must be copied unchanged",
);

for (const file of htmlFiles) {
  const $ = load(fs.readFileSync(file, "utf8"));
  const title = $("title").text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim();
  const canonical = $('link[rel="canonical"]').attr("href");
  const robots = $('meta[name="robots"]').attr("content");
  assert.ok(title, `Missing title: ${file}`);
  assert.ok(description, `Missing description: ${file}`);
  assert.ok(
    canonical?.startsWith(
      "https://rosarium-tech.com/",
    ),
    `Invalid canonical: ${file}`,
  );
  assert.ok(robots, `Missing robots metadata: ${file}`);
  const verification = $('meta[name="google-site-verification"]');
  assert(verification.length <= 1, `Duplicate Google verification tag: ${file}`);

  assert(!fs.readFileSync(file, "utf8").includes("/ai-design-foundations/"), `Old runtime base path: ${file}`);
  assert.equal(
    $('meta[property="og:url"]').attr("content"),
    canonical,
    `OG URL mismatch: ${file}`,
  );
  for (const selector of [
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:type"]',
    'meta[property="og:image"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]',
  ])
    assert.ok($(selector).attr("content"), `Missing ${selector}: ${file}`);

  assert.ok(
    !titles.has(title),
    `Duplicate title: ${title} (${file}, ${titles.get(title)})`,
  );
  titles.set(title, file);
  descriptions.set(description, [
    ...(descriptions.get(description) || []),
    file,
  ]);
  if (!robots.includes("noindex")) {
    assert.ok(
      !canonicals.has(canonical),
      `Duplicate canonical: ${canonical} (${file}, ${canonicals.get(canonical)})`,
    );
    canonicals.set(canonical, file);
    indexable.push(canonical);
  }

  const scripts = $('script[type="application/ld+json"]');
  assert.equal(scripts.length, 1, `Expected one JSON-LD graph: ${file}`);
  const graph = JSON.parse(scripts.text());
  assert.equal(
    graph["@context"],
    "https://schema.org",
    `Invalid JSON-LD context: ${file}`,
  );
  assert.ok(
    graph["@graph"].some(
      (item) => item["@type"] === "WebSite" && item.name === "Rosarium",
    ),
    `Rosarium WebSite JSON-LD missing: ${file}`,
  );
  const page = graph["@graph"].find(
    (item) => item["@id"] === `${canonical}#webpage`,
  );
  assert.ok(page, `Page JSON-LD missing: ${file}`);
  const lastUpdated = $('meta[name="last-updated"]').attr("content");
  assert.match(lastUpdated ?? "", /^\d{4}-\d{2}-\d{2}$/, `Missing last_updated: ${file}`);
  assert.equal(page.dateModified, lastUpdated, `dateModified mismatch: ${file}`);
  if (page["@type"] === "TechArticle") {
    articleCount++;
    assert.ok(page.headline, `TechArticle headline missing: ${file}`);
    assert.ok(
      graph["@graph"].some((item) => item["@type"] === "BreadcrumbList"),
      `Article breadcrumb JSON-LD missing: ${file}`,
    );
  }
}

for (const route of ["index.html", "ai/index.html", "dx/index.html", "cases/index.html", "career/index.html"]) {
  const $ = load(fs.readFileSync(path.join("dist", route), "utf8"));
  assert(!$('meta[name="robots"]').attr("content")?.includes("noindex"), `Main page is noindex: ${route}`);
}
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
);
for (const canonical of indexable)
  assert.ok(
    sitemapUrls.has(canonical),
    `Indexable canonical missing from sitemap: ${canonical}`,
  );
for (const route of ["search/", "overview/", "books/", "series/", "404.html"])
  assert.ok(
    !sitemap.includes(`/${route}`),
    `Sitemap contains noindex route: ${route}`,
  );
assert.ok(sitemap.startsWith('<?xml version="1.0"'), "Invalid sitemap XML");

const search = load(fs.readFileSync("dist/search/index.html", "utf8"));
const about = load(fs.readFileSync("dist/about/index.html", "utf8"));
const overview = load(fs.readFileSync("dist/overview/index.html", "utf8"));
const notFound = load(fs.readFileSync("dist/404.html", "utf8"));
assert.match(search('meta[name="robots"]').attr("content") || "", /noindex/);
assert(!about('meta[name="robots"]').attr("content")?.includes("noindex"));
assert.equal(about('link[rel="canonical"]').attr("href"), "https://rosarium-tech.com/about/");
assert.equal(about('meta[http-equiv="refresh"]').length, 0);
assert.match(overview('meta[name="robots"]').attr("content") || "", /noindex/);
assert.match(notFound('meta[name="robots"]').attr("content") || "", /noindex/);

const robotsFile = fs.readFileSync("dist/robots.txt", "utf8");
assert.match(robotsFile, /User-agent: \*/);
assert.match(robotsFile, /Allow: \//);
assert.match(
  robotsFile,
  /Sitemap: https:\/\/rosarium-tech\.com\/sitemap\.xml/,
);

for (const name of ["feed.xml", "rss.xml"]) {
  const rss = fs.readFileSync(`dist/${name}`, "utf8");
  assert.ok(rss.includes('<rss version="2.0"'), `Invalid RSS: ${name}`);
  assert.ok((rss.match(/<item>/g) ?? []).length >= 10, `RSS count: ${name}`);
  assert.ok(
    rss.includes("<dc:creator>立林 裕太朗</dc:creator>"),
    `RSS author: ${name}`,
  );
  assert.ok(rss.includes("<category>"), `RSS categories: ${name}`);
}
const jsonFeed = JSON.parse(fs.readFileSync("dist/feed.json", "utf8"));
assert.equal(jsonFeed.version, "https://jsonfeed.org/version/1.1");
assert.ok(jsonFeed.items.length >= 10, "JSON Feed count");
assert.equal(jsonFeed.authors[0].name, "立林 裕太朗");

assert.match(
  fs.readFileSync("dist/opensearch.xml", "utf8"),
  /\?search=1&amp;q=\{searchTerms\}/,
);
assert.match(fs.readFileSync("dist/llms.txt", "utf8"), /^# Rosarium/m);

const repeatedDescriptions = [...descriptions.values()].filter(
  (files) => files.length > 1,
);
const incoming = new Map(indexable.map((canonical) => [canonical, 0]));
for (const file of htmlFiles) {
  const $ = load(fs.readFileSync(file, "utf8"));
  const source = $('link[rel="canonical"]').attr("href");
  for (const element of $("a[href]").toArray()) {
    const href = $(element).attr("href");
    if (!href || !source) continue;
    const target = new URL(href, source);
    const canonicalTarget = target.origin + target.pathname;
    if (incoming.has(canonicalTarget))
      incoming.set(canonicalTarget, incoming.get(canonicalTarget) + 1);
  }
}
const orphans = [...incoming].filter(([, count]) => count === 0);
assert.deepEqual(
  orphans,
  [],
  `Indexable orphan pages: ${orphans.map(([pageUrl]) => pageUrl).join(", ")}`,
);
console.log(
  `SEO audit: ${htmlFiles.length} HTML pages, ${articleCount} TechArticles, ${sitemapUrls.size} sitemap URLs, no indexable orphans, RSS/JSON Feed/robots/OpenSearch/llms.txt verified. ${repeatedDescriptions.length} shared description group(s) retained where context is equivalent.`,
);

// Retired catalogs keep their URLs as noindex redirects to authoritative entrances.
for (const [route, destination] of [["practices/ai-education-principles","practices/education-and-capability"], ["practices/transferring-ai-practices","practices/transferring-practices"], ["essays/what-not-to-build-with-ai","essays/it-strategy-and-not-building"], ["architecture/agents-tools-and-workflows","software-engineering/multi-ai-orchestration"], ["foundations/generation-and-acceptance","evaluation-hitl/responsibility-and-hitl"], ["cases/understanding-systems-as-capability","cases/system-understanding"], ["software-engineering/ai-driven-development", "software-engineering/development-workflow"], ["software-engineering/code-generation-and-work-design", "software-engineering/development-workflow"], ["software-engineering/code-generation-boundaries", "software-engineering/development-workflow"], ["books", "cases"], ["series", "dx/business-transformation"], ["practices/ai-generation-and-work-completion", "foundations/ai-business-design/evaluating-business-efficiency"]]) {
  const $ = load(fs.readFileSync("dist/" + route + "/index.html", "utf8"));
  const target = "/" + destination + "/";
  assert.match($('meta[name="robots"]').attr("content") || "", /noindex/);
  assert.equal($('link[rel="canonical"]').attr("href"), "https://rosarium-tech.com" + target);
  assert.equal($('meta[http-equiv="refresh"]').attr("content"), "0;url=" + target);
  assert.equal($("main a[href]").first().attr("href"), target);
  assert.equal($("[data-series-index]").length, 0);
  assert.ok($("script").text().includes("location.replace(destination)"));
}

const home = load(fs.readFileSync("dist/index.html", "utf8"));
assert.equal(home("title").text(), "Rosarium | 立林 裕太朗");
const homeDescription = home('meta[name="description"]').attr("content");
assert(homeDescription.includes("立林裕太朗個人の技術サイト"));
assert(homeDescription.includes("システム企画・業務要件"));
for (const [selector, expected] of [
  ['meta[property="og:title"]', home("title").text()],
  ['meta[name="twitter:title"]', home("title").text()],
  ['meta[property="og:description"]', homeDescription],
  ['meta[name="twitter:description"]', homeDescription],
]) assert.equal(home(selector).attr("content"), expected);
const graph = JSON.parse(home('script[type="application/ld+json"]').first().text())["@graph"];
const people = graph.filter(entity => entity["@type"] === "Person");
const websites = graph.filter(entity => entity["@type"] === "WebSite");
assert.equal(people.length, 1);
assert.equal(websites.length, 1);
assert.equal(websites[0].author["@id"], people[0]["@id"]);
assert.equal(websites[0].publisher["@id"], people[0]["@id"]);
assert.equal(websites[0].name, "Rosarium");
assert.equal(websites[0].url, "https://rosarium-tech.com/");
assert.equal(people[0].name.replace(/\s/g, ""), "立林裕太朗");
assert.equal(people[0].url, "https://rosarium-tech.com/career/");
console.log("Verified Home brand identity, social metadata and single author relationship.");
