import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { primaryDomain, domainAssignments, planningGroups, systemDesignGroups, sameDomainRelatedEntries } from "../src/data/knowledge-domains.mjs";
import { buildBreadcrumbs } from "../src/lib/breadcrumbs.mjs";
const entry = id => ({id,data:YAML.parse(fs.readFileSync(`src/content/${id}.md`,"utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1])});
test("general design is distinct from AI applications and Cases keep their owner",()=>{
  for(const id of ["architecture/requirements-to-system-method","essays/legacy-change-and-retirement"])assert.equal(primaryDomain(entry(id)),"system-design");
  for(const id of ["architecture/reference-architecture","architecture/security-threat-modeling","evaluation-hitl/qa-evaluation"])assert.equal(primaryDomain(entry(id)),"system-design");
  for(const id of ["cases/customer-support-ai-dx","cases/design-studies/data-migration"])assert.equal(primaryDomain(entry(id)),"cases");
  assert.equal(primaryDomain(entry("essays/it-strategy-and-not-building")),"planning");
  assert.equal(primaryDomain(entry("essays/ai-investment-value-cost-evolution")),"planning");
  assert.equal(primaryDomain(entry("essays/from-ai-efficiency-to-value")),"dx");
});
test("domain-related cases never cross their primary category",()=>{
 const support=entry("cases/customer-support-ai-dx");
 for(const id of ["foundations/conditional-probability","essays/ai-capability-and-organization","architecture/reference-architecture","essays/it-strategy-and-not-building"])assert.deepEqual(sameDomainRelatedEntries(entry(id),[support]),[]);
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

test("unclassified manuscripts cannot silently become AI foundations",()=>{assert.throws(()=>primaryDomain({id:"unknown",data:{}}),/主分類が未定義/);});
