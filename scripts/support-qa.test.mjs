import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { caseDiagrams } from "../src/data/case-diagrams.ts";

const root = "src/content/cases";
const read = (name) => fs.readFileSync(`${root}/customer-support-ai-dx${name ? `/${name}` : ""}.md`, "utf8");
const detailId = "cases/customer-support-ai-dx/poc-effect-evaluation";
const readImprovement = () => read("poc-metadata-improvement");
const oldDetailId = "evaluation-hitl/customer-support-qa-poc";
const readDetail = () => fs.readFileSync(`src/content/${detailId}.md`, "utf8");

test("support QA presents the proposal, system architecture decisions and feasibility outlook", () => {
  const overview = read("");
  const introduction = read("executive-summary");
  const poc = read("poc-evaluation");
  const knowledge = read("knowledge-design");

  for (const text of ["企画部門から提案された", "システムアーキテクトとして", "業務適用に向けた方式の妥当性を確認しました"])
    assert(overview.includes(text), text);
  assert(introduction.includes("企画部門から業務改善の提案を受け"));
  assert(introduction.includes("実現に向けた見込みが立ちました"));
  assert(readImprovement().includes("検索対象制御と回答許可判定を分離"));
  assert(poc.includes("技術的な実現可能性の見込みが立ち"));
  assert(knowledge.includes("機種特定 → 検索対象制限 → ベクトル検索 → 根拠文書取得 → RAG"));
  assert(!overview.includes("SAとして"));
});

test("support QA labels scenario evaluation separately from production achievements", () => {
  const base = path.join(root, "customer-support-ai-dx");
  const chapters = fs.readdirSync(base).filter((entry) => entry.endsWith(".md"));
  const contents = [read(""), ...chapters.map((file) => read(file.slice(0, -3))), readDetail()].join("\n");
  assert(!/原典|原点|母艦|論述資料|補足設計|R[1-7]-[1-2]|\.md\b/.test(contents));
  assert(read("").includes("設計を検討する検証シナリオ"));
  assert(readImprovement().includes("検証シナリオ内の評価であり、本番運用の実測ではありません"));
  assert(readImprovement().includes("80％以上を適切に自動回答する目標を達成"));
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
  assert.equal(files.length, 12);
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
  for (const value of ["新規開発に先立ち", "過去の問い合わせ500件", "逆質問", "ベクトル検索", "RAG", "技術的な実現可能性の見込み"])
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
  assert(first.includes("過去の問い合わせ500件でこの3機能を確認した結果"));
  assert(!/250|％|%|分／件|削減工数|工数削減|280時間|再検証|誤検索|誤自動回答/.test(first));
  assert(second.includes("第1回PoCの500件と同一の問い合わせを使ったかは確認できていません"));
  const data = tableRows(second).filter(row => ["定型問い合わせ", "専門判断が必要", "回答根拠不足", "合計"].includes(row[0]));
  assert.deepEqual(data.map(row => row.slice(0, 2)), [["定型問い合わせ", "250"], ["専門判断が必要", "200"], ["回答根拠不足", "50"], ["合計", "500"]]);
  assert.equal(data.slice(0, 3).reduce((sum, row) => sum + Number(row[1]), 0), 500);
  assert(second.includes("検索対象の適格性と自動回答の許可を制御する必要"));
  assert(!/目標を達成|100時間|300時間|再実施した結果/.test(second));
  const improved = readImprovement();
  for (const phrase of ["80％以上を適切に自動回答する目標を達成", "データセットと実行環境の同一性", "有人引継ぎの成功率まで達成したという意味ではありません"]) assert(improved.includes(phrase),phrase);
  for (const text of [second, improved]) assert(!/1,000件|72％|96％|94％|180／250|240／250|480／500|24件.*0件/.test(text));

});

test("first PoC verifies exactly three functions in body, diagram and Book overview", () => {
  const chapter = read("poc-evaluation");
  const diagram = caseDiagrams["support-poc-checks"];
  const records = diagram.explanation.records;
  assert.equal(diagram.explanation.format, "table");
  assert.deepEqual(records.map(row => row[0]), ["逆質問", "ベクトル検索", "RAGによる回答生成"]);
  assert.equal(records.length, 3);
  assert(chapter.includes("回答生成の3機能"));
  assert(chapter.includes("第1回PoCは業務効果や安全性を評価したものではありません"));
  const firstRow = tableRows(read("")).find(row => row[0] === "第1回PoC");
  assert(firstRow[1].includes("過去の問い合わせ500件"));
  assert.equal(firstRow[2], "逆質問・ベクトル検索・RAGによる回答生成の技術的な実現可能性を確認する");
  const prohibited = /有人引継ぎ|有人対応|回答許可|専門判断|根拠不足|停止判定|メタデータ|適格性制御|自動回答可能率/;
  for (const source of [chapter, JSON.stringify(diagram), firstRow.join(" ")]) assert(!prohibited.test(source));
  assert(readDetail().includes("引継ぎに成功したことは別の評価"));
});
 
test("business projections use monthly 750 inquiries and the 600-resolution target", () => {
  const second = readImprovement();
  const business = second.split("## 9.5 ")[1].replace(/<span[^>]*><\/span>/g, "");
  assert(!/250|72％|96％|280時間|180|240|750件 × r/.test(business));
  for (const phrase of ["月間問い合わせは1,500件", "定型750件・専門判断600件・回答根拠不足150件", "600件以上", "100時間相当", "試算", "本番で達成した実測値ではありません", "追加負荷"])
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
  for (const text of ["**検索対象の適格性と、自動回答の許可を分離**", "**第1回PoC：**", "**第2回PoC：**", "自動回答目標の達成は検証シナリオ内の評価", "00〜11の12章構成"])
    assert(overview.includes(text), text);
  assert(!/96％|280時間|180件|240件/.test(overview));
  const names = fs.readdirSync(path.join(root, "customer-support-ai-dx")).filter(file => file.endsWith(".md"));
  const ordered = names.map(file => ({file, text:read(file.slice(0,-3))})).sort((a,b)=>Number(a.text.match(/^order: (\d+)/m)[1])-Number(b.text.match(/^order: (\d+)/m)[1]));
  assert.deepEqual(ordered.map(x=>Number(x.text.match(/^title: (\d+)/m)[1])), Array.from({length:12},(_,i)=>i));
  assert.deepEqual(ordered.map(x=>Number(x.text.match(/^order: (\d+)/m)[1])), Array.from({length:12},(_,i)=>i+1));
  assert.equal(ordered[3].file, "poc-evaluation.md");
  assert.deepEqual(ordered.map(x=>x.file), [
    "executive-summary.md", "why-ai.md", "responsibility-boundary.md", "poc-evaluation.md",
    "knowledge-design.md", "stopping-conditions.md", "human-handoff.md", "customer-experience.md",
    "poc-effect-evaluation.md", "poc-metadata-improvement.md", "continuous-improvement.md", "design-principles.md",
  ]);
});

test("PoC details remain inside the Book and the old independent URL targets chapter 09", () => {
  const first=read("poc-evaluation"),second=readDetail();
  const old=fs.readFileSync(`src/content/${oldDetailId}.md`, "utf8");
  assert.match(second, /^title: 08\. 第2回PoC：開発したQAシステムの効果確認$/m);
  assert.match(second, /^series: customer-support-ai-dx$/m);
  assert.match(second, /^order: 9$/m);
  assert(first.includes('data-case-diagram="support-poc-checks"'));
  assert(!first.includes('data-case-diagram="support-poc-evaluation"'));
  assert(second.includes('data-case-diagram="support-poc-evaluation"'));
  for(const source of[first,second])assert(!source.includes("/evaluation-hitl/customer-support-qa-poc/"));
  assert.match(old,/^lifecycle: retired$/m);
  assert(!/^## |^\|/m.test(old));
  const redirect=fs.readFileSync("src/pages/evaluation-hitl/customer-support-qa-poc.astro","utf8");
  assert(redirect.includes('url("cases/customer-support-ai-dx/poc-metadata-improvement")'));
  assert(redirect.includes("legacyPocFragments") && redirect.includes("location.replace"));
  assert(redirect.includes("canonical={canonical}")&&redirect.includes("noindex"));
});


test("design chapters explain the final design while chapters 08 and 09 separate discovery and improvement", () => {
  const knowledge = read("knowledge-design");
  const boundary = read("responsibility-boundary");
  assert(knowledge.includes("本章から第07章までは、評価後の改善を反映した最終設計"));
  assert(boundary.includes("評価後の見直しを反映した最終的な責任分担"));
  assert(!/初期方式では|当初のベクトル検索/.test(knowledge + boundary));
  for (const source of [knowledge, boundary]) assert(source.includes("[第08章](/cases/customer-support-ai-dx/poc-effect-evaluation/)"));
  assert(readDetail().includes("初期方式の問題"));
  assert(readImprovement().includes("メタデータと回答許可判定の変更"));
  assert(read("").includes("第04〜07章の参照資料・停止条件・有人引継ぎ・顧客体験"));
});


test("initial PoC evaluation diagram stops at problem discovery", () => {
 const diagram = caseDiagrams["support-poc-evaluation"];
 assert.deepEqual(diagram.nodes.map(node => node.id), ["test", "failure", "cause", "decision"]);
 assert(!/目標を達成|同じ500件|再検証する/.test(JSON.stringify(diagram)));
 assert(!/<span[^>]*><\/span>/.test(readDetail()+readImprovement()));
});
