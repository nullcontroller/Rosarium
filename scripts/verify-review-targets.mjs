import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import YAML from "yaml";
import { load } from "cheerio";
import { readReviewTargets } from "./review-targets.mjs";
const ids = readReviewTargets(process.argv.slice(2));
for (const id of ids) {
  const source = fs.readFileSync(`src/content/${id}.md`, "utf8");
  const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert.equal(data.status, "draft", id); assert.equal(data.public, false, id);
  assert(!fs.existsSync(`dist/${id}/index.html`), `Production leak: ${id}`);
  const $ = load(fs.readFileSync(`dist-review/${id}/index.html`, "utf8"));
  assert.equal($("h1").text(), data.title);
  assert.equal($('meta[name="robots"]').attr("content"), "noindex, follow", id);
  assert.equal($("main[data-pagefind-ignore]").length, 1, id);
  for(const el of $("main a[href^='/']").toArray()) {
    const target = new URL($(el).attr("href"), "https://rosarium-tech.com");
    const file = path.join("dist-review", decodeURIComponent(target.pathname), "index.html");
    assert(fs.existsSync(file), `Missing review destination: ${file}`);
    if(target.hash) {
      const dest = load(fs.readFileSync(file, "utf8"));
      assert(dest("[id]").toArray().some(el=>dest(el).attr("id")===decodeURIComponent(target.hash.slice(1))), target.href);
    }
  }
  for(const file of ["sitemap.xml", "rss.xml", "feed.json", "index.html"]) assert(!fs.readFileSync(`dist/${file}`, "utf8").includes(`/${id}/`), `Production discovery leak: ${id}`);
}
const hub = load(fs.readFileSync("dist-review/cases/design-studies/index.html", "utf8"));
assert.equal(hub('meta[name="robots"]').attr("content"), "noindex, follow");
for(const id of ids.filter(id=>id.startsWith("cases/design-studies/"))) assert(hub(`a[href='/${id}/']`).length>0,id);
const files = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
for(const file of files("dist/pagefind")) assert.deepEqual(fs.readFileSync(file),fs.readFileSync(file.replace(/^dist/,"dist-review")),file);
console.log(`Verified all ${ids.length} review drafts and design-study hub: noindex, links/anchors, production exclusion and identical public-only search.`);
