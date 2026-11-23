import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { designStudies, selectedDesignStudies } from "../src/data/design-studies.mjs";
import { isDraftPreview } from "../src/lib/draft-preview.mjs";

const entries = designStudies.map(study => {
  const source = fs.readFileSync(`src/content/${study.id}.md`, "utf8");
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return { ...study, data: YAML.parse(front[1]), body: source.slice(front[0].length) };
});
test("six independent design studies require explicit nonpublic draft selection", () => {
  assert.equal(entries.length, 6);
  assert.equal(new Set(entries.map(entry => entry.id)).size, 6);
  assert.equal(selectedDesignStudies().length, 0);
  assert.equal(selectedDesignStudies("essays/what-is-ai").length, 0);
  assert.deepEqual(selectedDesignStudies(entries[1].id).map(entry => entry.id), [entries[1].id]);
  for (const entry of entries) {
    assert.equal(entry.data.status, "draft");
    assert.equal(entry.data.public, false);
    assert.equal(entry.data.series, undefined);
    assert.equal(entry.data.published_at, undefined);
    assert.equal(isDraftPreview(entry), false);
    assert.equal(isDraftPreview(entry, entry.id), true);
  }
});
test("each study states assumptions, alternatives, three decisions and an evaluation plan", () => {
  const sections = ["設計課題", "背景と制約", "設計上の選択肢", "採用する設計方式", "重要な設計判断", "評価・確認方法", "設計から得られる知見"];
  for (const entry of entries) {
    for (const section of sections) assert(entry.body.includes(`## ${section}`), `${entry.id}: ${section}`);
    assert((entry.body.match(/^### /gm) ?? []).length >= 3, entry.id);
    assert.match(entry.body, /仮想設計/);
    assert.match(entry.body, /方式比較は記事として整理/);
    assert(entry.body.includes("/cases/design-studies/"));
    assert(entry.body.includes("/cases/customer-support-ai-dx/"));
  }
});
test("topic boundaries preserve safe retries, business review and version validity", () => {
  const body = slug => entries.find(entry => entry.slug === slug).body;
  assert.match(body("inquiry-analysis"), /保留ゼロを目的に分類を強制しません/);
  assert.match(body("metadata-batch"), /APIが再度呼ばれる可能性/);
  assert.match(body("metadata-batch"), /認証不備や広範なAPI障害/);
  assert.match(body("qualification-testing"), /必要な有人対応は失敗ではありません/);
  assert.match(body("data-migration"), /削除・失効/);
  assert.match(body("rag-security"), /顧客・権限単位の認可/);
  assert.match(body("document-lifecycle"), /修正不要と判定しても/);
});
