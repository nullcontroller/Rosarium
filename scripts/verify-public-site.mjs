import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
const removed = [
  "project",
  "tools",
  "authoring",
  "foundations/wiki-overview",
  "foundations/design-system-overview",
];
for (const id of removed)
  assert(
    !fs.existsSync("dist/" + id + "/index.html"),
    "Unwanted public route " + id,
  );
let htmlCount = 0;
let repositoryLinks = 0;
for (const file of walk("dist").filter((p) => p.endsWith(".html") && !p.endsWith("google57af630fc0ce16af.html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  htmlCount++;
  for (const element of $("[href]").toArray()) {
    const href = $(element).attr("href");
    const allowedRepository =
      href === "https://github.com/nullcontroller/Rosarium" &&
      $(element).closest(".site-footer").length === 1;
    if (allowedRepository) repositoryLinks++;
    assert(
      allowedRepository ||
        !/github\.com|zenn\.dev|nullcontroller\.github\.io\/career-profile/i.test(
          href,
        ),
      file + " " + href,
    );
    for (const id of removed)
      assert(
        !href.startsWith("/Rosarium/" + id + "/"),
        file + " removed link " + href,
      );
  }
  assert.equal($("[data-pagefind-meta=source]").length, 0, file);
  assert.equal($("[data-source]").length, 0, file);
  assert(
    !$(".meta,.document-footer,.site-footer,.sidebar")
      .text()
      .match(/GitHub Wiki|Originally published|Repository-native|移行元/),
    file,
  );
  assert.equal($("header.masthead > .brand").length, 1, file);
  assert.equal($("header.masthead > .brand").text().trim(), "Rosarium", file);
  assert.equal(
    $("header.masthead > .brand").attr("href"),
    "/Rosarium/",
    file,
  );
  const canonical = $('link[rel="canonical"]').attr("href");
  assert(
    canonical?.startsWith(
      "https://nullcontroller.github.io/Rosarium/",
    ),
    file,
  );
  assert.equal($('meta[property="og:url"]').attr("content"), canonical, file);
  for (const selector of [
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:type"]',
    'meta[property="og:image"]',
    'meta[name="twitter:card"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]',
  ])
    assert($(selector).attr("content"), file + " " + selector);
  assert.equal(
    $('meta[name="twitter:card"]').attr("content"),
    "summary_large_image",
    file,
  );
}
assert.equal(
  repositoryLinks,
  htmlCount,
  "Every page must expose the Repository from the footer",
);
const homepage = load(fs.readFileSync("dist/index.html", "utf8"));
assert.equal(homepage("h1").text(), "Rosarium");
const career = load(fs.readFileSync("dist/career/index.html", "utf8"));
for (const text of [
  "Applied AI × DX × System Architecture",
  "What I Do",
  "考え方の実例",
  "AIを使う前に考えること",
  "What I Want to Build",
  "Explore",
  "生成AI / RAGによる顧客サポートDX",
])
  assert(career("main").text().includes(text), text);
for (const duplicate of [
  "2016–2021",
  "希望条件",
  "年収",
  "データサイエンス発展",
])
  assert(
    !career("main").text().includes(duplicate),
    `Career duplicate: ${duplicate}`,
  );
assert.equal(
  career("h2,h3").filter(
    (_, element) => career(element).text().trim() === "資格",
  ).length,
  0,
  "Career must not duplicate the qualification list",
);
assert(
  career('a[href^="https://www.linkedin.com/in/"]').length === 1,
  "LinkedIn CTAs",
);
const profile = load(fs.readFileSync("dist/career/profile/index.html", "utf8"));
assert.match(profile('meta[name="robots"]').attr("content") || "", /noindex/);
assert.equal(
  profile('meta[http-equiv="refresh"]').attr("content"),
  "0;url=/Rosarium/career/",
);
assert(
  !profile("main").text().includes("職務経歴"),
  "Retired profile must not duplicate career history",
);
const baseline = JSON.parse(
  fs.readFileSync("migration/personal-site-baseline.json", "utf8"),
);
console.log(
  "Public HTML audit: " +
    htmlCount +
    " pages; GitHub Repository available from every footer, external Career=0, Zenn=0; removed routes absent.",
);
console.log("Before integration: " + JSON.stringify(baseline));

// Career role separation and SEO: both real pages remain canonical, profile is compatibility only.
for (const [route, title] of [["career", "Career"], ["career/details", "Career Details — 経験と実践"]]) {
  const html = fs.readFileSync(`dist/${route}/index.html`, "utf8");
  const $ = load(html);
  const canonical = `https://nullcontroller.github.io/Rosarium/${route}/`;
  assert.equal($("h1").text(), title);
  assert.equal($('link[rel="canonical"]').attr("href"), canonical);
  assert.equal($('meta[property="og:url"]').attr("content"), canonical);
  assert.equal($('meta[property="og:type"]').attr("content"), "profile");
  const graph = JSON.parse($('script[type="application/ld+json"]').first().text())["@graph"];
  assert(graph.some(node => node["@type"] === "ProfilePage" && node.url === canonical));
  assert(graph.some(node => node["@type"] === "BreadcrumbList"));
  assert(!html.includes("ai-design-foundations"));
  assert(!$("main").text().includes("希望条件"));
}
const careerDetails = load(fs.readFileSync("dist/career/details/index.html", "utf8"));
for (const section of ["Experience Overview", "Selected Work", "Professional Profile"])
  assert(careerDetails("main").text().includes(section));
console.log("Verified Career entry, retained experience hub, private profile and canonical/OGP/JSON-LD separation.");
