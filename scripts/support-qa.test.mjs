import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "src/content/cases";
const read = (name) => fs.readFileSync(`${root}/customer-support-ai-dx${name ? `/${name}` : ""}.md`, "utf8");
const detailId = "evaluation-hitl/customer-support-qa-poc";
const readDetail = () => fs.readFileSync(`src/content/${detailId}.md`, "utf8");

test("support QA presents the proposal, system architecture decisions and feasibility outlook", () => {
  const overview = read("");
  const introduction = read("executive-summary");
  const poc = read("poc-evaluation");
  const knowledge = read("knowledge-design");

  for (const text of ["企画部門から提案された", "システムアーキテクトとして", "システム方式上の実現の見込みが立ちました"])
    assert(overview.includes(text), text);
  assert(introduction.includes("企画部門から業務改善の提案を受け"));
  assert(introduction.includes("実現に向けた見込みが立ちました"));
  assert(poc.includes("検索対象の適格性と、自動回答の許可は別々に制御"));
  assert(poc.includes("本格開発へ進める方式かを判断"));
  assert(knowledge.includes("機種特定 → 検索対象制限 → ベクトル検索 → 根拠文書取得 → RAG"));
  assert(!overview.includes("SAとして"));
});

test("support QA labels scenario evaluation separately from production achievements", () => {
  const base = path.join(root, "customer-support-ai-dx");
  const chapters = fs.readdirSync(base).filter((entry) => entry.endsWith(".md"));
  const contents = [read(""), ...chapters.map((file) => read(file.slice(0, -3))), readDetail()].join("\n");
  assert(!/原典|原点|母艦|論述資料|補足設計|R[1-7]-[1-2]|\.md\b/.test(contents));
  assert(read("").includes("設計を検討する検証シナリオ"));
  assert(readDetail().includes("新しく設計した検証シナリオ上の仮定値"));
  assert(readDetail().includes("PoCの観測結果や本番の実測値ではありません"));
  assert(readDetail().includes("過去のPoCデータの再集計や、新たに観測した結果ではありません"));
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

test("human handoff retains collected facts and continued specialist investigation", () => {
  const handoff = read("human-handoff");
  for (const value of ["一次調査", "調査結果", "未解決事項から", "顧客へ回答する", "AIの推測を事実として扱わない"])
    assert(handoff.includes(value), value);
});

const tableRows = text => text.split(/\r?\n/).filter(line => line.startsWith("|"))
  .map(line => line.split("|").slice(1, -1).map(cell => cell.replaceAll("**", "").trim()));
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

test("Book and PoC exclude the removed qualification plan", () => {
  const files = fs.readdirSync(path.join(root, "customer-support-ai-dx")).filter(file => file.endsWith(".md"));
  const sources = [read(""), ...files.map(file => read(file.slice(0, -3))), readDetail()];
  for (const source of sources) {
    assert(!/システムの適格性確認|テスター|自動照合|経路1・2|経路3|適切な有人引継ぎ100％|support-validation-stages/.test(source));
  }
  assert(!fs.existsSync("src/content/evaluation-hitl/customer-support-qa-qualification-test.md"));
  for (const source of sources) assert(!/適格性確認|qualification-test|ほぼ同数|自動実行/.test(source));
  const chapter = read("poc-evaluation");
  assert.match(chapter, /^title: 03\. PoCによる方式の検証$/m);
  for (const value of ["本格開発前にPoCを行い", "類似する別機種", "専門判断が必要", "別々に制御", "再検証", "本格開発へ進める方式かを判断"])
    assert(chapter.includes(value), value);
  assert(read("continuous-improvement").includes("引継ぎ後の対応工数"));
  assert(read("continuous-improvement").includes("重複質問"));
});

test("operation changes pair each problem with a specific action and acceptance condition", () => {
  const operation = read("continuous-improvement");
  const rows = tableRows(operation.split("| 問題が起きた箇所 |")[1]);
  const changes = rows.filter(row => !row.every(cell => /^-+$/.test(cell)));
  assert.equal(changes.length, 6);
  for (const row of changes) {
    assert.equal(row.length, 3);
    assert(row.every(cell => cell.length > 10), row.join(" | "));
  }
  assert(changes.at(-1)[1].includes("CS部") && changes.at(-1)[1].includes("設計・開発側"));
  assert(changes.at(-1)[2].includes("自動回答を許可した問い合わせだけ"));
  assert(changes.at(-1)[2].includes("調査結果を担当者へ引き継げる"));
  assert(!/Failureの所在|Retrieval不良|Generation逸脱|Packet|Ranking|Chunk/.test(operation));
});

test("stop reasons explain retained facts rather than presenting implementation codes", () => {
  const stop = read("stopping-conditions");
  const rows = tableRows(stop.split("| 段階 |")[1]).filter(row => !row.every(cell => /^-+$/.test(cell)));
  assert.equal(rows.length, 6);
  for (const row of rows) assert(row.length === 3 && row.every(cell => cell.length > 2));
  assert.deepEqual(rows.map(row => row[0]), ["問い合わせ内容の確認", "参照資料の検索", "回答根拠の確認", "自動回答の可否判定", "専門判断の必要性確認", "回答内容の確認"]);
  assert(!/target_unresolved|evidence_missing|evidence_conflict|human_judgment_required|unsupported_claim/.test(stop));
  assert(stop.includes("AIの自己評価と、検索結果の類似度は異なる情報"));
  assert(stop.includes("スコアの高さだけでは、回答の正しさや自動回答の許可を保証できません"));
  assert(stop.includes("機種・環境・版数と、回答項目の許可・適用条件"));
  assert(stop.includes("CS部が専門調査と判断を引き継ぎます"));
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

test("PoC uses one dataset and keeps assumptions separate from observed results", () => {
  const poc = readDetail();
  const rows = tableRows(poc);
  const dataset = rows.filter(row => ["定型問い合わせ", "有人対応案件", "合計"].includes(row[0]));
  assert.deepEqual(dataset.map(row => row.slice(0, 2)), [["定型問い合わせ", "250"], ["有人対応案件", "250"], ["合計", "500"]]);
  const number = value => Number(value.replace(/[^0-9]/g, ""));
  assert.equal(dataset.slice(0, 2).reduce((sum, row) => sum + number(row[1]), 0), number(dataset[2][1]));
  assert(poc.includes("専門判断200件・回答根拠不足50件"));
  assert.equal(200 / 500, .4);
  assert.equal(50 / 500, .1);
  assert.deepEqual(rows.find(row => row[0] === "修正なしで顧客へ提示できる自動回答").slice(1), ["180／250件", "240／250件"]);
  assert(poc.includes("新しく設計した検証シナリオ上の仮定値"));
  assert(poc.includes("過去のPoCデータの再集計や、新たに観測した結果ではありません"));
  assert.equal(180 / 250 * 100, 72);
  assert.equal(240 / 250 * 100, 96);
  assert.equal(250 * .8, 200);
  assert(poc.includes("有人案件の誤自動回答件数と引継ぎ成功件数は未設定"));
  assert(poc.includes("誤自動回答0件と、引継ぎ成功250件は同義ではありません"));
  for (const metric of ["有人案件の誤自動回答", "有人案件の引継ぎ成功"]) {
    assert(rows.find(row => row[0] === metric)[1].includes("有人250件"));
  }
  assert(poc.includes("工程別の数値は今回未設定"));
  assert(poc.includes("工程別の適合率と、問い合わせ単位"));
  assert.equal(750 * (240 / 250), 720);
  assert.equal(720 * 10 / 60, 120);
  assert.equal(400 - 120, 280);
  assert(poc.includes("改善後280時間／月の試算"));
  assert(poc.includes("改善後240／250件という仮定を月間構成へ適用した試算"));
  assert(poc.includes("追加負荷を含む総工数も未確認"));
  const current = [poc, read(""), read("poc-evaluation")].join("\n");
  assert(!/1,000件|定型500件|480[／÷]500|24／400|0／400|400件のうち24件|72％ → 98％/.test(current));
});

test("design outcomes remain visible without promoting assumed values to results", () => {
  const overview = read("");
  for (const value of ["**検索対象の適格性と、自動回答の許可を分離**", "共通500件", "定型250件中240件を自動回答可能と仮定", "**月400時間から280時間相当へ削減する試算**"])
    assert(overview.includes(value), value);
  assert(overview.includes("共通500件の評価結果は未確定"));
  const names = fs.readdirSync(path.join(root, "customer-support-ai-dx")).filter(file => file.endsWith(".md"));
  for (const name of names) assert(/\*\*[^\n]+\*\*/.test(read(name.slice(0, -3)).split("---").slice(2).join("---")), name);
});

test("PoC detail remains a complementary article outside the ten-chapter Case", () => {
  const chapter = read("poc-evaluation");
  const article = readDetail();
  assert(chapter.includes(`](/${detailId}/)`));
  assert(article.includes("](/cases/customer-support-ai-dx/)"));
  assert(article.includes("](/cases/customer-support-ai-dx/poc-evaluation/)"));
  assert.match(article, /^publication_format: article$/m);
  assert.match(article, /^kind: guide$/m);
  assert.match(article, /^section: evaluation-hitl$/m);
  assert(!/^series:|^series_title:/m.test(article));
  assert(!/^kind: case$/m.test(article));
  assert(!/^\|.*(?:72％|96％|480／500|0／400|280時間)/m.test(chapter));
  for (const id of ["support-poc-checks", "support-poc-evaluation"]) {
    assert(article.includes(`data-case-diagram="${id}"`));
    assert(!chapter.includes(`data-case-diagram="${id}"`));
  }
  assert(!chapter.includes('data-case-diagram="support-validation-stages"'));
  assert(chapter.length < article.length);
});

test("PoC leads with the shared dataset and separates routing from answer quality", () => {
  const source = readDetail();
  const lead = source.split("## PoCの目的と検証仮説")[0];
  for (const value of ["250", "500", "180／250件", "240／250件", "仮定値", "誤自動回答件数と引継ぎ成功件数は未設定"])
    assert(lead.includes(value), value);
  assert(source.includes("検索できることと、回答してよいことを分離"));
  assert(source.includes("有人案件の停止・引継ぎも確認してから"));
});
