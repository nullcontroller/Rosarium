import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {load} from "cheerio";
import {domainLabels,domainResponsibilities} from "../src/data/knowledge-domains.mjs";
const root=process.argv[2]||"dist";
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const $=load(fs.readFileSync(path.join(root,"sitemap/index.html"),"utf8"));
const guide=$("[data-architecture-guide]");assert.equal(guide.length,1);
const expected=["/planning/","/dx/","/system-design/","/ai/","/cases/","/","/career/","/garden-notes/","/retired/"];
const links=guide.find("a[href]").toArray();
assert.deepEqual(links.map(el=>$(el).attr("href")),expected,"Only the nine category/site entry links belong in the guide");
assert.equal(guide.find("details,button,[data-sitemap-content],[data-reader-sitemap],[data-sitemap-expand],[data-sitemap-collapse]").length,0,"Article listing controls must not return");
assert(!/\d+記事/.test(guide.text()),"No article counts");
for(const domain of ["planning","dx","system-design","ai"]){
 const section=guide.find(`[data-domain="${domain}"]`);assert.equal(section.length,1,domain);
 assert.equal(section.find("h3 a").text(),domainLabels[domain]);
 assert.equal(section.find(".domain-question").text(),domainResponsibilities[domain].question);
 assert.deepEqual(section.find("dd").map((_,el)=>$(el).text()).get(),["role","topics","boundary"].map(key=>domainResponsibilities[domain][key]));
 assert(guide.find("figure").text().includes(domainLabels[domain]));
}
assert.equal(guide.find("figure[aria-labelledby=relationship-caption]").length,1);
assert.equal(guide.find("#relationship-caption").length,1);
assert(guide.find(".relationship-pair").text().includes("相互に整合"));
assert(guide.find(".relationship-feedback").text().includes("構想"));
assert(guide.find("#cross-domain-cases").parent().text().includes("仮想"));
for(const el of links){const href=$(el).attr("href");const target=path.join(root,href,"index.html");assert(fs.existsSync(target),href);const page=load(fs.readFileSync(target,"utf8"));assert.equal(page('meta[http-equiv="refresh"]').length,0,href);assert.equal(new URL(page('link[rel="canonical"]').attr('href')).pathname,href);}
assert.deepEqual($(".breadcrumb [data-breadcrumb-item]").map((_,el)=>$(el).text()).get(),["庭","サイトマップ"]);
for(const file of walk(root).filter(f=>f.endsWith(".html"))){
 const page=load(fs.readFileSync(file,"utf8"));if(!page("main").length)continue;
 assert.equal(page('header .header-actions > a[href="/sitemap/"]').length,1,file);
 assert.equal(page('footer a[href="/sitemap/"]').length,1,file);
 assert.equal(page('.header-primary a[href="/sitemap/"]').length,0,file);
 const dom=page('header *').toArray();
 assert(dom.indexOf(page('.global-search-toggle')[0])<dom.indexOf(page('.mobile-navigation > summary')[0]),`${file}: search must precede menu in DOM`);
}
console.log("Architecture guide: four shared domain responsibilities, diagram and nine entry links verified; no article list, counts or listing controls. Shared header/footer and mobile DOM order retained.");
