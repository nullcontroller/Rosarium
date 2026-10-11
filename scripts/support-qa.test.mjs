import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (name) => fs.readFileSync(`src/content/cases/customer-support-ai-dx${name ? `/${name}` : ""}.md`, "utf8");

test("support QA ties source evaluation to a retrieval change without claiming production outcomes", () => {
  const poc = read("poc-evaluation");
  for (const text of ["500件", "72％", "80％", "96％", "約720件", "推計", "実際の自己解決件数ではありません", "本人の実測済みの導入成果とは扱いません"])
    assert(poc.includes(text), text);
  assert(poc.indexOf("原因分析") < poc.indexOf("設計変更"));
  assert(poc.includes("一致する文書に検索対象を制限"));
  const knowledge = read("knowledge-design");
  assert(knowledge.includes("機種特定 → 検索対象制限 → ベクトル検索 → 根拠文書取得 → RAG"));
  assert(knowledge.includes("補足設計"));
});

test("support QA and Career retain requirement ownership and architect responsibilities", () => {
  const overview = read("");
  assert(overview.includes("著者自身が企画した事例ではありません"));
  assert(overview.includes("システムアーキテクトとして"));
  assert(!overview.includes("SAとして"));
  const career = fs.readFileSync("src/content/career/overview.md", "utf8");
  const support = career.split(':::case{title="顧客サポート')[1].split("\n:::")[0];
  assert(support.includes("企画部門から与えられた"));
  assert(support.includes("システムアーキテクトとして"));
  assert(!/72％|96％|720件/.test(support));
});
