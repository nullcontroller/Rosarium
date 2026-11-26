import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import YAML from "yaml";
import { load } from "cheerio";
import { primaryDomain, domainLabels, domainAssignments } from "../src/data/knowledge-domains.mjs";
import { designStudies } from "../src/data/design-studies.mjs";

const root = process.argv[2] || "dist";
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(item => item.isDirectory() ? walk(path.join(dir,item.name)) : [path.join(dir,item.name)]);
const entries = walk("src/content").filter(file => file.endsWith(".md")).map(file => ({
  id:path.relative("src/content",file).replaceAll("\\","/").replace(/\.md$/,""),
  data:YAML.parse(fs.readFileSync(file,"utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]),
}));
const cache = new Map();
const page = route => { if(!cache.has(route))cache.set(route,load(fs.readFileSync(path.join(root,route,"index.html"),"utf8"))); return cache.get(route); };
const links = route => page(route)("main a[href]").not(".breadcrumb a, .growth-entry a").map((_,el)=>page(route)(el).attr("href")?.split("#")[0]).get();
const report = [];
for(const entry of entries) {
  const owner = primaryDomain(entry);
  assert(domainLabels[owner],entry.id);
  const current = (entry.data.lifecycle ?? "active") === "active" && entry.data.public !== false && ["published","stable"].includes(entry.data.status);
  if(current && !["career","reference"].includes(owner)) {
    const direct = links(owner).includes(`/${entry.id}/`);
    const cover = entry.data.series && entries.find(other=>other.data.series===entry.data.series && other.data.order===0);
    const viaStudyHub = designStudies.some(study => study.id === entry.id) && links(owner).includes('/cases/design-studies/') && links('cases/design-studies').includes(`/${entry.id}/`);
    const viaMathHub = owner === "ai" && entry.data.ai_theme === "ai-mathematics" && links(owner).includes("/ai-mathematics/") && links("ai-mathematics").includes(`/${entry.id}/`);
    assert(direct || viaStudyHub || viaMathHub || (cover && links(owner).includes(`/${cover.id}/`) && links(cover.id).includes(`/${entry.id}/`)),entry.id+": unreachable from primary domain");
    const $ = page(entry.id);
    assert.equal($('[data-pagefind-meta="category"]').text(),domainLabels[owner],entry.id+": search owner");
    for(const selector of [".header-primary-group > a[aria-current=page]", "#mobile-navigation-links > a[aria-current=page]"]) assert.equal($(selector).attr("href"),`/${owner}/`,entry.id+": active navigation");
    assert($(".breadcrumb a").toArray().some(el=>$(el).attr("href")===`/${owner}/`),entry.id+": breadcrumb owner");
  }
  report.push({id:entry.id,title:entry.data.title,owner,lifecycle:entry.data.lifecycle??"active",public:entry.data.public!==false,current,reason:domainAssignments[entry.id]?.reason ?? (owner==="cases" ? "事例の正本と担当・仮想設計の区別を維持" : owner==="career" ? "著者の専門性と将来の志向" : "参照定義として既存の独立した階層を維持")});
}
const ai = report.filter(row=>row.current && row.owner==="ai").map(row=>row.id).sort();
assert.deepEqual(ai,["foundations/attention-efficiency","foundations/attention-information-flow","foundations/conditional-probability","foundations/hallucination-mechanisms","foundations/language-model-loss","foundations/temperature-design","foundations/test-time-compute-allocation","foundations/policy-gradient-learning","foundations/preference-learning-dpo","foundations/verifiable-reward-reasoning","foundations/compute-optimal-scaling","foundations/speculative-decoding","foundations/in-context-learning","foundations/mixture-of-experts","foundations/state-space-sequence-models","foundations/diffusion-language-models"].sort());
for(const row of report.filter(row=>row.id==="essays/ai-essence" || ["ai-operation-management-improvement","ai-intellectual-collaboration","ai-case-sharing-and-judgment","ai-verification-cost-and-learning","ai-adoption-success-and-value","ai-capability-and-organization"].some(slug=>row.id===`essays/${slug}`))) assert.equal(row.owner,"dx");
for(const id of ["essays/what-is-ai","essays/cognitive-surrender"]) assert(!fs.existsSync(path.join(root,id,"index.html")));
if(process.env.ROSARIUM_DOMAIN_REPORT) fs.writeFileSync(process.env.ROSARIUM_DOMAIN_REPORT,JSON.stringify(report,null,2));
console.log(`Domain audit: ${report.length} manuscripts; all active public articles reachable from their primary domains; ${ai.length} AI foundations; series ownership, search and breadcrumbs agree.`);
