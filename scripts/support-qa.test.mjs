import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "src/content/cases";
const read = (name) => fs.readFileSync(`${root}/customer-support-ai-dx${name ? `/${name}` : ""}.md`, "utf8");

test("support QA presents the proposal, system architecture decisions and feasibility outlook", () => {
  const overview = read("");
  const introduction = read("executive-summary");
  const poc = read("poc-evaluation");
  const knowledge = read("knowledge-design");

  for (const text of ["企画部門から提案された", "システムアーキテクトとして", "システム方式上の実現の見込みが立ちました"])
    assert(overview.includes(text), text);
  assert(introduction.includes("企画部門から業務改善の提案を受け"));
  assert(introduction.includes("実現に向けた見込みが立ちました"));
  assert(poc.includes("対象機種メタデータで検索対象を制御"));
  assert(poc.includes("検証する事項"));
  assert(knowledge.includes("機種特定 → 検索対象制限 → ベクトル検索 → 根拠文書取得 → RAG"));
  assert(!overview.includes("SAとして"));
});

test("support QA is written for portfolio readers without manuscript references or unverified PoC figures", () => {
  const base = path.join(root, "customer-support-ai-dx");
  const chapters = fs.readdirSync(base).filter((entry) => entry.endsWith(".md"));
  const contents = [read(""), ...chapters.map((file) => read(file.slice(0, -3)))].join("\n");
  assert(!/原典|原点|母艦|論述資料|補足設計|R[1-7]-[1-2]|\.md\b/.test(contents));
  assert(!/過去の定型問い合わせ500件|72％|96％|720件/.test(contents));
  assert(!/本番導入済み|実測で達成|導入成果を達成/.test(contents));
});

test("Career retains the architect role and an appropriately qualified outlook", () => {
  const career = fs.readFileSync("src/content/career/overview.md", "utf8");
  const support = career.split(':::case{title="顧客サポート')[1].split("\n:::")[0];
  assert(support.includes("企画部門からの業務改善提案"));
  assert(support.includes("システムアーキテクトとして"));
  assert(support.includes("実現に向けたシステム方式の見込みが立ちました"));
  assert(!/72％|96％|720件|原典|論述資料/.test(support));
});

test("qualification plan covers three processing paths and separates tester checks from expert judgments", () => {
  const poc = read("poc-evaluation");
  const plan = poc.split("## システム適格性確認テスト：")[1];
  assert(plan);
  for (const text of ["追加質問なしで自動回答する", "追加質問を行ってから自動回答する", "自動回答せず、サポート担当者へ引き継ぐ",
    "500件は計画上のテストケース条件", "ほぼ同数", "件数の少ない経路", "期待結果", "テスター", "経験豊富なサポート担当者",
    "完全一致では品質を判定できません", "専門知識が必要な項目だけ", "未解決事項", "引継ぎ理由"])
    assert(plan.includes(text), text);
  assert(!/500件.*(?:実施した|完了した|達成した)/.test(plan));
  assert(plan.includes("方式の成立性と、構築するシステムの適格性"));
  const handoff = read("human-handoff");
  for (const text of ["一次調査", "調査結果", "未解決事項から", "顧客へ回答する", "AIの推測を事実として扱わない"])
    assert(handoff.includes(text), text);
});
