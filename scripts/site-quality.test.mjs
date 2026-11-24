import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
test("recruiter entry preserves the site introduction and adds supported skills",()=>{
  const home=fs.readFileSync("src/pages/index.astro","utf8");
  for(const term of ["ソフトウェア開発・保守","既存システムの調査・問題解決","要件定義・システム設計","AIの業務適用"]) assert(home.includes(term));
  assert(home.includes("PoCの回答正答率を72％から96％へ改善"));
  const career=fs.readFileSync("src/content/career/overview.md","utf8");
  for(const id of ["customer-support-ai-dx","specification-debt-review","three-ai-maintenance","ai-technical-investigation"]) assert(career.includes(`/cases/${id}/`));
  assert(career.includes("最終的な効果検証は担当チームが行いました"));
  const metadata=YAML.parse(career.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert.equal(metadata.published_at,"2026-09-23"); assert.equal(metadata.last_updated,"2026-11-24");
});
