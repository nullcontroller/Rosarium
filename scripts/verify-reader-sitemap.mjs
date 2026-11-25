import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {load} from "cheerio";
import YAML from "yaml";
import { primaryDomain } from "../src/data/knowledge-domains.mjs";
import { designAreaFor } from "../src/data/design-studies.mjs";
const root=process.argv[2]||"dist";
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const $=load(fs.readFileSync(path.join(root,"sitemap/index.html"),"utf8"));
const links=$("[data-reader-sitemap] [data-sitemap-link]").toArray();
const routes=links.map(el=>$(el).attr("href"));
assert.equal(new Set(routes).size,routes.length,"Duplicate sitemap route");
const content=links.map(el=>$(el).attr("data-sitemap-content")).filter(Boolean);
const expected=[];
const records=new Map();
const privateRoutes=new Set();
for(const file of walk("src/content").filter(f=>f.endsWith(".md"))){
 const id=path.relative("src/content",file).replaceAll("\\","/").replace(/\.md$/,"");
 const data=YAML.parse(fs.readFileSync(file,"utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
 const route=id==="career/overview"?"career":id;
 if(data.public===false||data.status==="draft")privateRoutes.add(`/${route}/`);
 const target=path.join(root,route,"index.html");
 const html=fs.existsSync(target)?load(fs.readFileSync(target,"utf8")):null;
 const eligible=data.public!==false&&data.status!=="draft"&&html&&!html('meta[http-equiv="refresh"]').length;
 assert.equal(content.includes(id),Boolean(eligible),`Sitemap visibility mismatch: ${id}`);
 if(eligible){expected.push(id);records.set(id,data);}
}
assert.deepEqual([...content].sort(),expected.sort());
for(const el of links.filter(el=>$(el).attr("data-sitemap-content"))){
 const id=$(el).attr("data-sitemap-content"),data=records.get(id);
 const section=$(el).closest("section");
 const rootHref=section.find("h2 a").attr("href");
 const owner=["retired","obsolete"].includes(data.lifecycle)?"retired":primaryDomain({id,data});
 assert.equal(rootHref,owner==="reference"?"/":`/${owner}/`,`${id}: primary section`);
 if(data.series&&data.order!==0){const cover=[...records].find(([,d])=>d.series===data.series&&d.order===0);if(cover)assert($(el).parents("li").toArray().some(li=>$(li).attr("data-sitemap-node")===cover[0]),`${id}: missing series parent`);}
 const area=designAreaFor(id);if(area)assert.equal($(el).siblings(".design-area").text(),area,id);
}

for(const el of links){const href=$(el).attr("href");assert(fs.existsSync(path.join(root,decodeURIComponent(href),"index.html")),href);const target=load(fs.readFileSync(path.join(root,decodeURIComponent(href),"index.html"),"utf8"));assert.equal(target('meta[http-equiv="refresh"]').length,0,href);assert.equal(new URL(target('link[rel="canonical"]').attr('href')).pathname,href,href);}
const xml=load(fs.readFileSync(path.join(root,"sitemap.xml"),"utf8"),{xml:true});
for(const loc of xml("loc").toArray()){const route=new URL(xml(loc).text()).pathname;assert(routes.includes(route),`XML public route missing from HTML map: ${route}`);}
for(const section of $("[data-reader-sitemap] > section").toArray()){
 const own=$(section).find("[data-sitemap-content]").length;
 assert.equal(Number($(section).find("h2 small").first().text().replace(/[^0-9]/g,"")),own,"Category count mismatch");
}
assert.deepEqual($(".breadcrumb [data-breadcrumb-item]").map((_,el)=>$(el).text()).get(),["庭","サイトマップ"]);
console.log(`Reader sitemap: ${content.length} public content records, ${routes.length} unique routes; XML coverage, counts, visibility and canonical routes verified.`);

for(const file of walk(root).filter(f=>f.endsWith(".html"))){
 const page=load(fs.readFileSync(file,"utf8"));if(!page("main").length)continue;
 const route="/"+path.relative(root,file).replaceAll("\\","/").replace(/index.html$/,"");
 if(file.endsWith("index.html")&&!page('meta[http-equiv="refresh"]').length&&!privateRoutes.has(route))assert(routes.includes(route),`Generated page missing from HTML map: ${route}`);
 assert.equal(page('header .header-actions > a[href="/sitemap/"]').length,1,file);
 assert.equal(page('footer a[href="/sitemap/"]').length,1,file);
 assert.equal(page('.header-primary a[href="/sitemap/"]').length,0,file);
 const dom=page('header *').toArray();
 assert(dom.indexOf(page('.global-search-toggle')[0])<dom.indexOf(page('.mobile-navigation > summary')[0]),`${file}: search must precede menu in DOM`);
}
console.log("Shared header/footer sitemap access and mobile DOM order verified on every rendered page.");
