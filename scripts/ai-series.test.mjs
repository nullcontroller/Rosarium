import test from "node:test";
import assert from "node:assert/strict";
import { aiSerialGroups } from "../src/lib/ai.ts";
const item=(id, data={})=>({id,data:{public:true,status:"published",lifecycle:"active",entry_points:["ai"],...data}});
test("AI shows public series covers once and counts only published chapters",()=>{
  const cover=item("essays/example",{publication_format:"series",series:"example",order:0});
  const result=aiSerialGroups([cover,item("essays/one",{series:"example",order:1}),item("essays/draft",{series:"example",order:2,status:"draft",public:false})]);
  assert.equal(result.length,1);assert.equal(result[0].entry.id,cover.id);assert.equal(result[0].chapterCount,1);
});
test("draft, retired and other-domain covers stay out of the AI series list",()=>{
  const data={publication_format:"series",series:"example",order:0};
  assert.deepEqual(aiSerialGroups([item("essays/draft",{...data,status:"draft",public:false}),item("essays/old",{...data,lifecycle:"retired"}),item("essays/dx",{...data,entry_points:["dx"]})]),[]);
});
