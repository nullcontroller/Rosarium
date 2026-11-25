import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import YAML from "yaml";
import { recentGrowth } from "../src/data/recent-growth.ts";
const ids=["essays/dx-and-value","essays/ai-use-and-operation","practices/transferring-practices"];
const baseline="647b89f2f020168e37dbd99179bcae2bb676f4e0";
const read=id=>fs.readFileSync(`src/content/${id}.md`,"utf8").replace(/\r\n/g,"\n");
const before=id=>execFileSync("git",["show",`${baseline}:src/content/${id}.md`],{encoding:"utf8"}).replace(/\r\n/g,"\n");
const data=t=>YAML.parse(t.split("---")[1]);
const body=t=>t.slice(t.indexOf("\n---",4)+4);
test("only the three approved lifecycle transitions occur and their original bodies remain",()=>{
 const files=execFileSync("git",["ls-tree","-r","--name-only",baseline,"src/content"],{encoding:"utf8"}).trim().split("\n").filter(f=>f.endsWith(".md")).map(f=>f.replace(/^src\/content\//,""));const changes=[];
 for(const f of files){const id=f.replaceAll("\\","/").replace(/\.md$/,"");if((data(read(id)).lifecycle??"active")!==(data(before(id)).lifecycle??"active"))changes.push(id);}
 assert.deepEqual(changes.sort(),[...ids].sort());
 for(const id of ids){assert.equal(body(read(id)),body(before(id)));assert.equal(data(read(id)).lifecycle,"retired");assert(data(read(id)).lifecycle_reason);assert.equal(data(read(id)).published_at,data(before(id)).published_at);}
});
test("unique knowledge is integrated into the existing argument rather than appended",()=>{
 const third=read("essays/ai-case-sharing-and-judgment"),sixth=read("essays/ai-capability-and-organization");
 for(const phrase of ["約1時間の社内共有会","情報環境","承認者、許容誤差","品質、時間、コスト、レビュー負荷、例外率","今後の評価方法としての提案"])assert(third.includes(phrase),phrase);
 for(const phrase of ["異なる周期","判断能力の不足を隠し","少数の担当者へ集中する可能性","仮説である","ECRS"])assert(sixth.includes(phrase),phrase);
 assert(third.indexOf("約1時間の社内共有会")<third.indexOf("## 1."));assert(sixth.indexOf("少数の担当者")<sixth.indexOf("## 5."));
 for(const id of ["essays/ai-case-sharing-and-judgment","essays/ai-capability-and-organization"]){assert.equal(data(read(id)).published_at,data(before(id)).published_at);assert.equal(data(read(id)).last_updated,"2026-11-26");}
});
test("old URLs use the existing noindex canonical redirect pattern and same-day history is additive",()=>{
 for(const id of ids.slice(1)){const t=fs.readFileSync(`src/pages/${id}.astro`,"utf8");for(const s of ["location.replace(destination)","http-equiv=\"refresh\"","canonical={canonical} noindex"])assert(t.includes(s));}
 const day=recentGrowth.find(e=>e.date==="2026-11-26");assert.equal(day.topics.length,5);assert(day.topics.some(t=>t.title==="既存論考の退役・統合による知識体系の整理"));
 for(const id of ids)assert(day.changes.some(c=>typeof c!=="string"&&c.contentIds.includes(id)));
});
