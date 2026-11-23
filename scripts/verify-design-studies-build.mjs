import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { designStudies } from "../src/data/design-studies.mjs";

const root = process.argv[2] || "dist-design-review";
assert.notEqual(path.resolve(root), path.resolve("dist-review"), "Do not overwrite the existing staging output");
const read = (base, id) => load(fs.readFileSync(path.join(base, id, "index.html"), "utf8"));
const hub = read(root, "cases/design-studies");
assert.equal(hub("h1").length, 1);
assert.equal(hub('meta[name="robots"]').attr("content"), "noindex, follow");
for (const study of designStudies) {
  assert(!fs.existsSync(`dist/${study.id}/index.html`), `Production leak: ${study.id}`);
  assert(hub(`main a[href='/${study.id}/']`).length, `Missing hub link: ${study.id}`);
  const $ = read(root, study.id);
  assert.equal($("h1").length, 1, study.id);
  assert.equal($('meta[name="robots"]').attr("content"), "noindex, follow", study.id);
  assert.equal($("main[data-pagefind-ignore]").length, 1, study.id);
  assert($(".prose").text().includes("仮想設計"), study.id);
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
    assert.equal(read("dist", chapterId)(`a[href='/${study.id}/']`).length, 0);
  }
  for (const file of ["sitemap.xml", "rss.xml", "feed.json", "index.html", "cases/index.html"]) {
    assert(!fs.readFileSync(`dist/${file}`, "utf8").includes(`/${study.id}/`), `Production discovery leak: ${file}`);
  }
}
assert(!fs.existsSync("dist/cases/design-studies/index.html"));
const book = read(root, "cases/customer-support-ai-dx");
assert(book("[data-design-studies-preview]").length);
assert.equal(read("dist", "cases/customer-support-ai-dx")("[data-design-studies-preview]").length, 0);
console.log("Verified six review-only articles, hub/context links, noindex/search exclusion and ordinary-build isolation.");
