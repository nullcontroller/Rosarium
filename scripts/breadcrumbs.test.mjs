import test from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbs, breadcrumbTitle } from "../src/lib/breadcrumbs.mjs";
const labels = {ai:"AI", cases:"実践事例", "cases/design-studies":"発展ケーススタディ", "ai-design":"AI設計", "ai-design/evaluation":"評価", dx:"DX", retired:"旧記事・退役記事", "retired/retired":"退役記事"};
const entries = [{id:"essays/series",data:{title:"連載",series:"series",order:0,layer:"publication"}},{id:"essays/chapter",data:{title:"第1回",series:"series",order:1,layer:"publication"}},{id:"cases/book",data:{title:"Book",series:"book",order:0,section:"cases"}},{id:"cases/book/chapter",data:{title:"章",series:"book",order:1,section:"cases"}}];
const resolve = (pathname, extra={}) => buildBreadcrumbs({pathname,title:"現在ページ",entries,labels,primaryPath:e=>e.data.section === "cases" ? "cases":"ai",archiveGroup:()=>undefined,designStudyIds:["cases/design-studies/example"],...extra});
test("Home has no breadcrumb; static pages have reader-facing current names",()=>{
  assert.deepEqual(resolve("/"),[]);
  assert.deepEqual(resolve("/ai/").map(c=>c.name),["庭","現在ページ"]);
  assert.equal(breadcrumbTitle('<h1>記事の題名</h1>', 'SEO用タイトル'),"記事の題名");
});
test("Book, essay series and design studies use real parent pages",()=>{
  for(const [route,expected] of [["/essays/chapter/",["","ai","essays/series","essays/chapter"]],["/cases/book/chapter/",["","cases","cases/book","cases/book/chapter"]],["/cases/design-studies/example/",["","cases","cases/design-studies","cases/design-studies/example"]]]) assert.deepEqual(resolve(route).map(c=>c.path),expected);
});
test("Private/unselected covers are not invented; archive routes use existing groups",()=>{
  assert(!resolve("/essays/chapter/",{entries:[entries[1]]}).some(c=>c.path==="essays/series"));
  assert.deepEqual(resolve("/essays/chapter/",{archiveGroup:()=>"retired"}).map(c=>c.path),["","retired","retired/retired","essays/series","essays/chapter"]);
  assert.deepEqual(resolve("/ai-design/evaluation/").map(c=>c.path),["","ai","ai-design","ai-design/evaluation"]);
});
