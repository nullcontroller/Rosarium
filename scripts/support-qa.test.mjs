import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "src/content/cases";
const read = (name) => fs.readFileSync(`${root}/customer-support-ai-dx${name ? `/${name}` : ""}.md`, "utf8");
const detailId = "cases/customer-support-ai-dx/poc-effect-evaluation";
const oldDetailId = "evaluation-hitl/customer-support-qa-poc";
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
  assert(readDetail().includes("検索対象の適格性と、回答許可を分離"));
  assert(poc.includes("構想したQAシステムは実現できる見込みが立ちました"));
  assert(knowledge.includes("機種特定 → 検索対象制限 → ベクトル検索 → 根拠文書取得 → RAG"));
  assert(!overview.includes("SAとして"));
});

test("support QA labels scenario evaluation separately from production achievements", () => {
  const base = path.join(root, "customer-support-ai-dx");
  const chapters = fs.readdirSync(base).filter((entry) => entry.endsWith(".md"));
  const contents = [read(""), ...chapters.map((file) => read(file.slice(0, -3))), readDetail()].join("\n");
  assert(!/原典|原点|母艦|論述資料|補足設計|R[1-7]-[1-2]|\.md\b/.test(contents));
  assert(read("").includes("設計を検討する検証シナリオ"));
  assert(readDetail().includes("評価結果"));
  assert(readDetail().includes("商用導入後の実測成果を示すものではありません"));
  assert(readDetail().includes("初期評価と改善後の成功件数・割合は未確定"));
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
  assert.equal(files.length, 11);
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
  assert.match(chapter, /^title: 03\. 第1回PoC：技術的実現可能性の確認$/m);
  for (const value of ["本格開発前に", "過去の問い合わせ500件", "追加質問", "RAG", "有人引継ぎ", "構想したQAシステムは実現できる見込み"])
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

test("two PoCs separate technical feasibility from developed-system effects", () => {
  const first = read("poc-evaluation").split("---").slice(2).join("---").replace(/<span[^>]*><\/span>/g, "");
  const second = readDetail();
  assert(first.includes("過去の問い合わせ500件"));
  assert(first.includes("500件の問い合わせを用いて技術的な実現可能性を検証し、構想したQAシステムは実現できる見込みが立ちました"));
  assert(!/250|％|%|分／件|削減工数|工数削減|280時間|再検証|誤検索|誤自動回答/.test(first));
  assert(second.includes("第1回PoCの500件と同一の問い合わせを用いたかは未確認"));
  assert(second.includes("第2回PoC内の作業であり、第3回PoCではありません"));
  const data = tableRows(second).filter(row => ["定型問い合わせ", "専門判断が必要", "回答根拠不足", "合計"].includes(row[0]));
  assert.deepEqual(data.map(row => row.slice(0, 2)), [["定型問い合わせ", "250"], ["専門判断が必要", "200"], ["回答根拠不足", "50"], ["合計", "500"]]);
  assert.equal(data.slice(0, 3).reduce((sum, row) => sum + Number(row[1]), 0), Number(data[3][1]));
  const results = tableRows(second).filter(row => ["定型の自動回答可能率", "専門判断案件の誤自動回答", "根拠不足案件の誤自動回答", "有人対応案件の引継ぎ成功"].includes(row[0]));
  assert.deepEqual(results.map(row => row[2]), ["未確定", "未確定", "未確定", "未確定"]);
  assert(second.includes("初期評価と同じ問い合わせ・入力条件・判定基準"));
  const visible = second.replace(/<span[^>]*><\/span>/g, "");
  assert(!/1,000件|定型500件|専門判断400件|根拠不足100件|72％|96％|94％|180／250|240／250|24件.*0件/.test(visible));
  assert(second.includes("回答許可を分離"));
  assert(second.includes("評価用サンプルの構成であり、月間問い合わせ数でも検証の成功件数でもありません"));
  assert(second.includes("月400時間から300時間相当への削減見込み"));
  assert.equal(600 * 10 / 60, 100);
  assert(second.includes("引継ぎ後の調査工数"));
});

test("business projections use monthly 750 inquiries and the 600-resolution target", () => {
  const second = readDetail();
  const business = second.split("## 4.6 ")[1].replace(/<span[^>]*><\/span>/g, "");
  assert(!/250|72％|96％|280時間|180|240|750件 × r/.test(business));
  for (const phrase of ["月間問い合わせは1,500件", "定型750件・専門判断600件・回答根拠不足150件", "600件以上", "100時間以上", "条件付き試算", "達成済みの結果ではありません", "追加負荷"])
    assert(business.includes(phrase), phrase);
  const rows = tableRows(business);
  assert.equal(rows.find(row => row[0] === "改善対象")[1], "定型問い合わせ750件／月");
  assert.equal(rows.find(row => row[0] === "自己解決の目標")[1], "750件のうち600件以上／月");
  assert.equal(rows.find(row => row[0] === "対応工数の削減")[1], "600件 × 10分 ÷ 60 ＝ 100時間／月");
  assert.equal(rows.find(row => row[0] === "改善後の対応工数")[1], "400時間 − 100時間 ＝ 300時間／月");
  assert.equal(600 / 750, .8);
  assert.equal(600 * 10 / 60, 100);
  assert.equal(400 - (600 * 10 / 60), 300);
  const lead = read("").split("## 代表設計事例の要点")[1].split('id="数値と設計事例の位置付け"')[0];
  assert(!/250|96％|280時間|180件|240件/.test(lead));
  assert(lead.includes("月750件の定型問い合わせのうち600件以上"));
});
 
test("Book exposes two PoCs without claiming unmeasured production outcomes", () => {
  const overview = read("");
  for (const text of ["**検索対象の適格性と、自動回答の許可を分離**", "**第1回PoC：**", "**第2回PoC：**", "第2回PoCの評価結果と業務工数への効果は未確定", "00〜10の11章構成"])
    assert(overview.includes(text), text);
  assert(!/96％|280時間|180件|240件/.test(overview));
  const names = fs.readdirSync(path.join(root, "customer-support-ai-dx")).filter(file => file.endsWith(".md"));
  const ordered = names.map(file => ({file, text:read(file.slice(0,-3))})).sort((a,b)=>Number(a.text.match(/^order: (\d+)/m)[1])-Number(b.text.match(/^order: (\d+)/m)[1]));
  assert.deepEqual(ordered.map(x=>Number(x.text.match(/^title: (\d+)/m)[1])), Array.from({length:11},(_,i)=>i));
  assert.deepEqual(ordered.map(x=>Number(x.text.match(/^order: (\d+)/m)[1])), Array.from({length:11},(_,i)=>i+1));
  assert.equal(ordered[3].file, "poc-evaluation.md");
  assert.equal(ordered[4].file, "poc-effect-evaluation.md");
});

test("PoC details remain inside the Book and the old independent URL targets chapter 04", () => {
  const first=read("poc-evaluation"),second=readDetail();
  const old=fs.readFileSync(`src/content/${oldDetailId}.md`, "utf8");
  assert.match(second, /^title: 04\. 第2回PoC：開発したQAシステムの効果確認$/m);
  assert.match(second, /^series: customer-support-ai-dx$/m);
  assert.match(second, /^order: 5$/m);
  assert(first.includes('data-case-diagram="support-poc-checks"'));
  assert(!first.includes('data-case-diagram="support-poc-evaluation"'));
  assert(second.includes('data-case-diagram="support-poc-evaluation"'));
  for(const source of[first,second])assert(!source.includes("/evaluation-hitl/customer-support-qa-poc/"));
  assert.match(old,/^lifecycle: retired$/m);
  assert(!/^## |^\|/m.test(old));
  const redirect=fs.readFileSync("src/pages/evaluation-hitl/customer-support-qa-poc.astro","utf8");
  assert(redirect.includes('url("cases/customer-support-ai-dx/poc-effect-evaluation")'));
  assert(redirect.includes("location.replace(destination + location.hash)"));
  assert(redirect.includes("canonical={canonical}")&&redirect.includes("noindex"));
});
