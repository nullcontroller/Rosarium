import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
const root = process.argv[2] || "dist";
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const report=[];
for(const file of walk(root).filter(f=>f.endsWith(".html"))) {
  const $=load(fs.readFileSync(file,"utf8"));
  if(!$("main").length) continue; // Machine verification tokens have no page UI.
  const relative=path.relative(root,file).replaceAll("\\","/");
  const graph=$("script[type='application/ld+json']").toArray().flatMap(el=>JSON.parse($(el).text())["@graph"]||[]);
  const schema=graph.filter(item=>item["@type"]==="BreadcrumbList");
  if(relative === "index.html") { assert.equal($("nav.breadcrumb").length,0); assert.equal(schema.length,0); continue; }
  const nav=$("nav.breadcrumb"); assert.equal(nav.length,1,file);
  assert.equal(nav.attr("aria-label"),"パンくず",file);
  const items=nav.find("[data-breadcrumb-item]");
  assert.equal(items.first().text(),"庭",file);
  assert.equal(items.first().attr("href"),"/",file);
  assert.equal(nav.find("[aria-current=page]").length,1,file);
  assert.equal(items.last().attr("aria-current"),"page",file);
  assert(!items.last().is("a"),file);
  assert.equal(items.last().text(),$("h1").first().text().trim(),file);
  assert.equal(nav.find("a").length,items.length-1,file);
  assert.equal(schema.length,1,file);
  assert.deepEqual(schema[0].itemListElement.map(i=>i.name),items.map((_,el)=>$(el).text()).get(),file);
  nav.find("a").each((i,el)=>{
    const href=$(el).attr("href"); const target=path.join(root,decodeURIComponent(href),"index.html");
    assert(fs.existsSync(target),`${file}: missing parent ${href}`);
    assert.equal(new URL(schema[0].itemListElement[i].item).pathname,href,file);
    assert.equal(schema[0].itemListElement[i].position,i+1,file);
  });
  const html=$.html();assert(html.indexOf('class="breadcrumb')<html.indexOf('<h1'),file);
  report.push({file:relative,trail:items.map((_,el)=>$(el).text()).get(),parents:nav.find("a").map((_,el)=>$(el).attr("href")).get()});
}
const out=process.env.ROSARIUM_BREADCRUMB_REPORT;
if(out)fs.writeFileSync(out,JSON.stringify(report,null,2));
console.log(`Verified ${report.length} non-Home HTML pages: one breadcrumb, real parent links, unlinked current page, heading order and matching BreadcrumbList.`);
