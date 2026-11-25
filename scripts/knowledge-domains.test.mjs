import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { primaryDomain, domainAssignments, planningGroups, systemDesignGroups, relatedCasesForDomain } from "../src/data/knowledge-domains.mjs";
import { buildBreadcrumbs } from "../src/lib/breadcrumbs.mjs";
const entry = id => ({id,data:YAML.parse(fs.readFileSync(`src/content/${id}.md`,"utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1])});
test("general design is distinct from AI applications and Cases keep their owner",()=>{
  for(const id of ["architecture/requirements-to-system-method","essays/legacy-change-and-retirement"])assert.equal(primaryDomain(entry(id)),"system-design");
  for(const id of ["architecture/reference-architecture","architecture/security-threat-modeling","evaluation-hitl/qa-evaluation"])assert.equal(primaryDomain(entry(id)),"ai");
  for(const id of ["cases/customer-support-ai-dx","cases/design-studies/data-migration"])assert.equal(primaryDomain(entry(id)),"cases");
  assert.equal(primaryDomain(entry("essays/it-strategy-and-not-building")),"planning");
  assert.equal(primaryDomain(entry("essays/ai-investment-value-cost-evolution")),"planning");
  assert.equal(primaryDomain(entry("essays/from-ai-efficiency-to-value")),"dx");
});
test("one Case is referenced across domains without becoming domain knowledge",()=>{
  const support=entry("cases/customer-support-ai-dx");
  for(const domain of ["ai","dx","planning","system-design"]){
    const result=relatedCasesForDomain(domain,[support]);assert.equal(result.length,1);assert.equal(result[0].entry.id,support.id);assert.equal(primaryDomain(result[0].entry),"cases");
  }
  assert.match(relatedCasesForDomain("planning",[support])[0].relevance,/企画部門から受けた/);
});
test("related Cases never revive private, draft, obsolete or unregistered manuscripts",()=>{
  const support=entry("cases/customer-support-ai-dx");
  for(const data of [{public:false},{status:"draft"},{lifecycle:"obsolete"},{lifecycle:"retired"},{section:"essays"}])assert.deepEqual(relatedCasesForDomain("planning",[{...support,data:{...support.data,...data}}]),[]);
  assert.deepEqual(relatedCasesForDomain("planning",[entry("cases/design-studies/inquiry-analysis")]),[]);
  assert.deepEqual(relatedCasesForDomain("unknown",[support]),[]);
});
test("curated reading routes use unique existing public active originals",()=>{
  for(const groups of [planningGroups,systemDesignGroups]){
    const ids=groups.flatMap(group=>group.ids);assert.equal(new Set(ids).size,ids.length);
    for(const id of ids){const e=entry(id);assert.notEqual(e.data.public,false);assert(["published","stable"].includes(e.data.status));assert.equal(e.data.lifecycle??"active","active");}
  }
  for(const id of Object.keys(domainAssignments))assert(entry(id).data.summary);
});
test("general design breadcrumbs do not manufacture an AI intermediate parent",()=>{
  const e=entry("architecture/requirements-to-system-method");
  const trail=buildBreadcrumbs({pathname:`/${e.id}/`,title:e.data.title,entries:[e],labels:{"system-design":"システム設計"},primaryPath:primaryDomain,archiveGroup:()=>undefined,designStudyIds:[]});
  assert.deepEqual(trail.map(item=>item.path),["","system-design",e.id]);
});
