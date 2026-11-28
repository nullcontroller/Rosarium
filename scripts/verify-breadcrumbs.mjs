import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { caseIntegrationPlans } from "../src/data/case-integrations.mjs";
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
// A breadcrumb parent must offer a real category path, not merely an incoming
// search result, Garden Notes item, or a backlink through the breadcrumb itself.
const documents=new Map(walk(root).filter(file=>file.endsWith("index.html")).map(file=>[
  "/"+path.relative(root,file).replaceAll("\\","/").replace(/index.html$/,""),load(fs.readFileSync(file,"utf8"))
]));
const categoryPaths=[{route:"/",result:"root-no-parent"}];
const links=route=>{
  const $=documents.get(route);if(!$)return [];
  return $(route==="/"?"main a, header a, .sidebar a":"main a").not(".breadcrumb a, .growth-entry a")
    .toArray().map(el=>$(el).attr("href")?.split("#")[0]).filter(href=>href?.startsWith("/")&&documents.has(href));
};
for(const entry of report){
  const route="/"+entry.file.replace(/index.html$/,"");const $=documents.get(route);
  if(!$){categoryPaths.push({route,result:"error-page-no-parent"});continue;}
  if($("meta[http-equiv=refresh]").length){categoryPaths.push({route,result:"compatibility-redirect"});continue;}
  const parent=entry.parents.at(-1);let found;
  if(links(parent).includes(route)) found=[parent,route];
  else for(const index of links(parent)){
    const target=documents.get(index);
    if(index==="/"||index==="/garden-notes/"||index==="/search/"||target("[data-pagefind-body]").length)continue;
    if(links(index).includes(route)){found=[parent,index,route];break;}
  }
  if(!found && $("meta[name=robots]").attr("content")?.includes("noindex") && !$("[data-pagefind-body]").length && !route.startsWith("/cases/design-studies")){
    categoryPaths.push({route,parent,result:"auxiliary-noindex-index",reason:"Legacy/nonprimary index; its current entry is linked from the page"});continue;
  }
  if(!found && root === "dist-review" && $("[data-integration-preview]").length) {
    // The retained source is deliberately absent from the current-case list in a
    // staged integration. Verify its actual successor path instead of inventing
    // an incoming category link or permitting this exception in production.
    const plan = caseIntegrationPlans.find(plan => route === `/${plan.sourceId}/`);
    assert(plan, `${route}: unregistered integration preview`);
    const successor = `/${plan.successorId}/`, book = `/${plan.bookId}/`;
    assert.equal($("[data-integration-preview] a").attr("href"), successor, route);
    assert(documents.has(successor) && documents.has(book), route);
    assert(links(parent).includes(book), `${route}: replacement Book missing from category`);
    assert(links(book).includes(successor), `${route}: successor missing from Book`);
    categoryPaths.push({route,parent,result:"retained-integration-source-review-only",successorPath:[parent,book,successor],reason:"Original URL retained for review, intentionally omitted from the current-case list"});
    continue;
  }
  assert(found,`${route}: no category path from breadcrumb parent ${parent}`);
  categoryPaths.push({route,parent,path:found,result:found.length===2?"direct":"via-category-index"});
}
fs.writeFileSync(path.join(root,"category-path-audit.json"),JSON.stringify(categoryPaths,null,2));
console.log(`Category path audit: ${categoryPaths.length} pages; category links exclude search, Garden Notes and breadcrumbs.`);
const out=process.env.ROSARIUM_BREADCRUMB_REPORT;
if(out)fs.writeFileSync(out,JSON.stringify(report,null,2));
console.log(`Verified ${report.length} non-Home HTML pages: one breadcrumb, real parent links, unlinked current page, heading order and matching BreadcrumbList.`);
