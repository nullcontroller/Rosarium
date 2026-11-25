import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
test("Home keeps the site introduction and routes professional detail to Career",()=>{
  const home=fs.readFileSync("src/pages/index.astro","utf8");
  assert(!home.includes("立林裕太朗は、"));
  for(const term of ["作者のキャリア","専門性・実務経験・今後の方向性","事例を見る","実務事例・発展ケーススタディ"]) assert(home.includes(term));
  assert(home.includes("PoCの回答正答率を72％から96％へ改善"));
  const career=fs.readFileSync("src/content/career/overview.md","utf8");
  for(const id of ["customer-support-ai-dx","specification-debt-review","three-ai-maintenance","ai-technical-investigation"]) assert(career.includes(`/cases/${id}/`));
  assert(career.includes("担当チームが修正・効果検証を実施しました"));
  const metadata=YAML.parse(career.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert.equal(metadata.published_at,"2026-09-23"); assert.equal(metadata.last_updated,"2026-11-26");
});
