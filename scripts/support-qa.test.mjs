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

test("support QA labels scenario evaluation separately from production achievements", () => {
  const base = path.join(root, "customer-support-ai-dx");
  const chapters = fs.readdirSync(base).filter((entry) => entry.endsWith(".md"));
  const contents = [read(""), ...chapters.map((file) => read(file.slice(0, -3)))].join("\n");
  assert(!/原典|原点|母艦|論述資料|補足設計|R[1-7]-[1-2]|\.md\b/.test(contents));
  assert(read("").includes("設計を検討する検証シナリオ"));
  assert(read("poc-evaluation").includes("本人が実業務で測定した成果や、本番運用の自己解決率としては扱いません"));
  assert(read("poc-evaluation").includes("検証シナリオの再検証結果"));
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

const tableRows = text => text.split(/\r?\n/).filter(line => line.startsWith("|"))
  .map(line => line.split("|").slice(1, -1).map(cell => cell.trim()));
const number = text => Number(text.replaceAll(",", "").match(/[\d.]+/)[0]);

test("support case consistently starts from manual work and a newly developed customer QA", () => {
  assert(read("").includes("専用の問い合わせ支援システムがない業務"));
  assert(read("").includes("顧客向けQAシステムを新規開発"));
  assert(read("why-ai").includes("専用の問い合わせ支援システムはなく"));
  const files = fs.readdirSync(path.join(root, "customer-support-ai-dx")).filter(file => file.endsWith(".md"));
  assert.equal(files.length, 10);
  for (const source of [read(""), ...files.map(file => read(file.slice(0, -3)))]) {
    const text = source.replace(/<[^>]*>/g, "");
    assert(!/既存システム|旧システム|リプレース|データ移行|Web支援システムで|必要なAPI・状態参照/.test(text));
  }
  assert(read("knowledge-design").includes("資料の保管方式や管理製品は特定しません"));
});

test("qualification test design fixes inputs, automates objective checks and separates acceptance", () => {
  const plan = read("poc-evaluation").split("## システム適格性確認テスト：")[1];
  for (const term of ["入力データ", "Knowledge", "メタデータ", "モデル・指示文", "期待結果・実行記録", "自動照合", "自動回答80％以上", "適切な有人引継ぎ100％", "経路1・2", "経路3", "顧客提示可能", "実施結果・合格結果は確認できない"]) assert(plan.includes(term), term);
  assert(plan.includes("PoCで96％が得られた記述を、そのまま適格性確認テストの合格結果へ転用しません"));
  assert(read("poc-evaluation").includes("自動回答可能率」という別の評価記述"));
  assert(read("continuous-improvement").includes("引継ぎ後の対応工数"));
  assert(read("continuous-improvement").includes("重複質問"));
});

test("scenario inquiry categories reconcile annual volume, monthly workload and the target", () => {
  const rows = tableRows(read("why-ai"));
  const categories = ["定型回答可能", "専門判断が必要", "回答根拠が不足"].map(label => rows.find(row => row[0] === label));
  assert.deepEqual(categories.map(row => row.slice(1, 6).map(number)), [
    [50, 9000, 750, 10, 125], [40, 7200, 600, 10, 100], [10, 1800, 150, 70, 175],
  ]);
  assert.equal(categories.reduce((sum, row) => sum + number(row[2]), 0), 18000);
  assert.equal(categories.reduce((sum, row) => sum + number(row[3]), 0), 1500);
  for (const row of categories) assert.equal(number(row[3]) * number(row[4]) / 60, number(row[5]));
  assert.equal(1500 * 16 / 60, 400);
  assert.equal(750 * 10 / 60, 125);
  assert.equal(600 * 10 / 60, 100);
  assert(read("why-ai").includes("文書が存在することだけでは、自動回答の資格になりません"));
});

test("PoC samples, stage results and projections retain their distinct denominators", () => {
  const poc = read("poc-evaluation");
  const rows = tableRows(poc);
  assert(poc.includes("1,000件") && poc.includes("定型回答可能500件、専門判断が必要400件、回答根拠不足100件"));
  assert.equal(500 + 400 + 100, 1000);
  assert.equal(rows.find(row => row[0] === "追加質問の適合率")[1], "98％");
  assert.equal(rows.find(row => row[0] === "回答生成の適合率")[1], "98％");
  assert.deepEqual(rows.filter(row => row[0] === "文書検索の適合率").map(row => row[1]), ["72％", "72％ → 98％"]);
  assert.deepEqual(rows.find(row => row[0] === "定型500件の一連処理の自動回答可能率").slice(1), ["72％", "96％"]);
  assert(poc.includes("同一指標の測定系列へまとめません"));
  assert(poc.includes("検証シナリオの評価として保持"));
  assert.equal(rows.find(row => row[0] === "定型問い合わせの自動回答")[1], "480／500件");
  assert.equal(rows.find(row => row[0] === "専門判断が必要な問い合わせの誤自動回答")[1], "0／400件");
  assert(poc.includes("400件のうち24件"));
  assert.equal(480 / 500 * 100, 96);
  assert.equal(750 * 0.96, 720);
  assert.equal(720 * 10 / 60, 120);
  assert.equal(400 - 120, 280);
  assert(poc.includes("改善後280時間／月の試算"));
  assert(poc.includes("将来の全問い合わせで誤回答が起こらない保証ではありません"));
  assert(poc.includes("Precision@k等の指標へ読み替えず"));
  assert(poc.includes("追加負荷を含む総工数も未確認"));
  assert(poc.includes("独立した適格性確認テスト計画"));
});
