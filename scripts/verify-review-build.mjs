import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
import YAML from "yaml";
import { readReviewTargets } from "./review-targets.mjs";
const ids = readReviewTargets();
for (const id of ids) {
  if (fs.existsSync(`dist/${id}/index.html`)) {
    const data = YAML.parse(fs.readFileSync(`src/content/${id}.md`, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    assert(["published", "stable"].includes(data.status) && data.public === true, `Nonpublic target in production: ${id}`);
    continue;
  }
  assert(!fs.existsSync(`dist/${id}/index.html`), "Draft leaked into ordinary build: " + id);
  const $ = load(fs.readFileSync(`dist-review/${id}/index.html`, "utf8"));
  assert.equal($("h1").length, 1, id);
  assert.equal($('meta[name="robots"]').attr("content"), "noindex, follow", id);
  assert.equal($("main[data-pagefind-ignore]").length, 1, id);
  assert($("[role=note]").text().includes("レビュー用初稿"), id);
  assert(!$('script[src*="googletagmanager"]').length, id);
  for (const a of $(".prose a[href^='/']").toArray()) {
    const target = new URL($(a).attr("href"), "https://rosarium-tech.com");
    const file = path.join("dist-review", decodeURIComponent(target.pathname), "index.html");
    assert(fs.existsSync(file), "Broken preview link: " + file);
    if (target.hash) {
      const dest = load(fs.readFileSync(file, "utf8"));
      assert(dest("[id]").toArray().some(el => dest(el).attr("id") === decodeURIComponent(target.hash.slice(1))));
    }
  }
  for (const root of ["dist", "dist-review"]) {
    for (const file of ["sitemap.xml", "rss.xml", "feed.json", "index.html", "essays/index.html", "garden-notes/index.html"]) {
      assert(!fs.readFileSync(`${root}/${file}`, "utf8").includes(`/${id}/`), `${root}/${file}: draft discovery leak`);
    }
  }
}


for (const file of fs.readdirSync("dist/pagefind")) {
 if (fs.statSync("dist/pagefind/" + file).isFile()) assert.deepEqual(fs.readFileSync("dist-review/pagefind/" + file), fs.readFileSync("dist/pagefind/" + file), "Review search differs: " + file);
}

assert(!fs.existsSync("dist-review/essays/what-is-ai/index.html"), "Removed review article must not be served");
assert(!fs.existsSync("dist-review/essays/cognitive-surrender/index.html"), "Rejected essay must not be served");
console.log("Verified both rejected essays are absent from staging and review search remains public-only.");
