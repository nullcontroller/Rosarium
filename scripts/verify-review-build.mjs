import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
const ids = ["essays/what-is-ai", "essays/cognitive-surrender"];
for (const id of ids) {
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

console.log("Verified both nonpublic drafts: ordinary build exclusion, noindex, search exclusion, related links and unchanged discovery.");
