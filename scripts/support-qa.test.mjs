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

  for (const text of ["QAシステムを設計", "72％ → 98％", "94％ → 100％", "月400時間から280時間"])
    assert(overview.includes(text), text);
  assert(introduction.includes("企画部門から業務改善の提案を受け"));
  assert(introduction.includes("実現に向けた見込みが立ちました"));
  assert(read("knowledge-design").includes("回答許可判定"));
  assert(poc.includes("基本動作を確認できたため、QAシステムの本格開発へ進むことにしました"));
  assert(knowledge.includes("機種特定 → 検索対象制限 → ベクトル検索 → 根拠文書取得 → RAG"));
  assert(!overview.includes("SAとして"));
});

test("support QA labels scenario evaluation separately from production achievements", () => {
  const base = path.join(root, "customer-support-ai-dx");
  const chapters = fs.readdirSync(base).filter((entry) => entry.endsWith(".md"));
  const contents = [read(""), ...chapters.map((file) => read(file.slice(0, -3))), readDetail()].join("\n");
  assert(!/原典|原点|母艦|論述資料|補足設計|R[1-7]-[1-2]|\.md\b/.test(contents));
  assert(read("").includes("本事例は設計・検証シナリオです"));
  assert(readImprovement().includes("公開用の設計・検証シナリオ"));
  assert(readImprovement().includes("文書検索の適合率は72％から98％へ"));
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
  .map(line => line.split("|").slice(1, -1).map(cell => cell.replaceAll("**", "").replace(/<[^>]+>/g, "").trim()));
const number = text => Number(text.replaceAll(",", "").match(/[\d.]+/)[0]);

test("support case consistently starts from manual work and a newly developed customer QA", () => {
  assert(read("why-ai").includes("専用の問い合わせ支援システムはなく"));
  assert(read("").includes("QAシステムを設計"));
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
  assert.match(chapter, /^title: 04\. 第1回PoC：フィージビリティ確認$/m);
  for (const value of ["新規開発に先立ち", "少数の問い合わせ例", "逆質問", "ベクトル検索", "RAG", "基本動作を確認"])
    assert(chapter.includes(value), value);
  assert(read("continuous-improvement").includes("引継ぎ後の対応工数"));
  assert(read("continuous-improvement").includes("重複質問"));
});

test("chapter 11 connects scenario achievements to three pre-production checks", () => {
 const chapter=read("continuous-improvement");
 const body=chapter.split("---").slice(2).join("---");
 assert.match(chapter,/^title: 11\. 本番適用に向けて残る課題$/m);
 assert.match(chapter,/^order: 11$/m);
 assert.deepEqual([...body.matchAll(/^## (.+)$/gm)].map(match=>match[1]),["実際の業務効果","回答品質の維持","運用負荷"]);
 for(const value of["文書検索の適合率98％","有人振り分け率100％","280時間／月","月720件の自己解決を前提","本番運用の実績はまだなく","条件付き試算"]) assert(body.includes(value),value);
 assert(body.includes("[第12章：この事例から得た設計原則](/cases/customer-support-ai-dx/design-principles/)"));
 assert(!/^\||data-case-diagram|失敗を分類|運用を設計しました/m.test(body));
 assert(body.length<650);
 assert.equal(caseDiagrams["support-continuous-improvement"],undefined);
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
  assert(first.includes("少数の問い合わせ例"));
  assert(first.includes("少数の問い合わせ例を用いた簡単な動作確認"));
  assert(!/250|％|%|分／件|削減工数|工数削減|280時間|再検証|誤検索|誤自動回答/.test(first));
  assert(second.includes("第1回PoCで3機能の基本動作を確認した後"));
  const data = tableRows(second).filter(row => ["定型問い合わせ", "専門判断が必要", "回答根拠不足", "合計"].includes(row[0]));
  assert.deepEqual(data.map(row => row.slice(0, 2)), [["定型問い合わせ", "250"], ["専門判断が必要", "200"], ["回答根拠不足", "50"], ["合計", "500"]]);
  assert.equal(data.slice(0, 3).reduce((sum, row) => sum + Number(row[1]), 0), 500);
  assert(second.includes("検索対象の制御と回答許可判定の両方に課題"));
  assert(!/目標を達成|100時間|300時間|再実施した結果/.test(second));
  const improved = readImprovement();
  for (const phrase of ["文書検索の適合率は72％から98％へ", "データセット・実行環境の同一性", "全問い合わせの正答率、引継ぎ情報の受渡し成功率"]) assert(improved.includes(phrase),phrase);
  for (const text of [second, improved]) assert(!/1,000件|180／250|240／250|480／500|24件.*0件/.test(text));

});

test("first PoC verifies exactly three functions in body, diagram and Book overview", () => {
  const chapter = read("poc-evaluation");
  const diagram = caseDiagrams["support-poc-checks"];
  const records = diagram.explanation.records;
  assert.equal(diagram.explanation.format, "table");
  assert.deepEqual(records.map(row => row[0]), ["逆質問", "ベクトル検索", "RAGによる回答生成"]);
  assert.equal(records.length, 3);
  assert(chapter.includes("確認した3機能"));
  assert(chapter.includes("簡単な動作確認"));
  const prohibited = /有人引継ぎ|有人対応|回答許可|専門判断|根拠不足|停止判定|メタデータ|適格性制御|自動回答可能率/;
  for (const source of [chapter, JSON.stringify(diagram)]) assert(!prohibited.test(source));
  assert(readDetail().includes("引継ぎに成功したことは別の評価"));
});
 
test("business projections separate retrieval accuracy from monthly self-resolution assumptions", () => {
 const improved=readImprovement();
 for(const text of ["750件／月", "720件／月", "96％", "PoCで観測した成功率ではありません", "125時間／月 × 0.96", "400時間／月 − 120時間／月", "280時間／月", "本番実測ではありません"]) assert(improved.includes(text), text);
 assert.equal(750*10/60,125);assert.equal(125*.96,120);assert.equal(750*.96,720);assert.equal(720*10/60,120);assert.equal(400-720*10/60,280);
 assert(improved.includes("文書検索の適合率98％から導出した値でもありません"));
 assert(!/連続して成功する割合は96％|連続成功率96％|250|180件|240件/.test(improved));

});

test("Book exposes two PoCs without claiming unmeasured production outcomes", () => {
  const overview = read("");
  for (const text of ["月720件を顧客自身で解決できると想定", "月400時間から280時間", "設計・検証シナリオ", "本番運用の実績ではありません"]) assert(overview.includes(text),text);
  assert(!/180件|240件/.test(overview));
  const names = fs.readdirSync(path.join(root, "customer-support-ai-dx")).filter(file => file.endsWith(".md"));
  const ordered = names.map(file => ({file, text:read(file.slice(0,-3))})).sort((a,b)=>Number(a.text.match(/^order: (\d+)/m)[1])-Number(b.text.match(/^order: (\d+)/m)[1]));
  assert.deepEqual(ordered.map(x=>Number(x.text.match(/^title: (\d+)/m)[1])), Array.from({length:12},(_,i)=>i+1));
  assert.deepEqual(ordered.map(x=>Number(x.text.match(/^order: (\d+)/m)[1])), Array.from({length:12},(_,i)=>i+1));
  assert.equal(ordered[3].file, "poc-evaluation.md");
  assert.deepEqual(ordered.map(x=>x.file), [
    "executive-summary.md", "why-ai.md", "responsibility-boundary.md", "poc-evaluation.md",
    "human-handoff.md", "customer-experience.md", "poc-effect-evaluation.md",
    "knowledge-design.md", "stopping-conditions.md", "poc-metadata-improvement.md", "continuous-improvement.md", "design-principles.md",
  ]);
});

test("PoC details remain inside the Book and the old independent URL targets chapter 10", () => {
  const first=read("poc-evaluation"),second=readDetail();
  const old=fs.readFileSync(`src/content/${oldDetailId}.md`, "utf8");
  assert.match(second, /^title: 07\. 第2回PoC：開発したQAシステムの評価$/m);
  assert.match(second, /^series: customer-support-ai-dx$/m);
  assert.match(second, /^order: 7$/m);
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


test("design chapters distinguish the final design from discovery and improvements in chapters 07 through 10", () => {
  const knowledge = read("knowledge-design");
  const boundary = read("responsibility-boundary");
  assert(knowledge.includes("初期状態と変更内容は設計・検証シナリオ上の設定"));
  assert(boundary.includes("評価後の検索対象制御・停止条件の強化を反映した最終的な責任分担"));
  assert(boundary.includes("初期方式ではその判定が十分に機能しませんでした"));
  assert(boundary.includes("[第07章](/cases/customer-support-ai-dx/poc-effect-evaluation/)"));
  assert(knowledge.includes("[第10章](/cases/customer-support-ai-dx/poc-metadata-improvement/)"));
  assert(readDetail().includes("初期方式を評価"));
  assert(read("knowledge-design").includes("対象機種・利用環境・対応版数"));
  assert(read("poc-effect-evaluation").includes("第05〜06章の引継ぎ・顧客体験"));
});


test("initial PoC evaluation diagram stops at problem discovery", () => {
 const diagram = caseDiagrams["support-poc-evaluation"];
 assert.deepEqual(diagram.nodes.map(node => node.id), ["test", "failure", "cause", "decision"]);
 assert(!/目標を達成|同じ500件|再検証する/.test(JSON.stringify(diagram)));
 assert(!/<span[^>]*><\/span>/.test(readDetail()+readImprovement()));
});

test("all published Books use chapter one as the first displayed chapter", () => {
 const groups=new Map();
 for(const file of fs.readdirSync('src/content',{recursive:true}).filter(x=>x.endsWith('.md'))){
  const text=fs.readFileSync(path.join('src/content',file),'utf8');
  const series=text.match(/^series: (.+)$/m)?.[1], order=Number(text.match(/^order: (\d+)$/m)?.[1]);
  if(!series || !(order>0)) continue;
  const title=text.match(/^title: (.+)$/m)[1];
  const n=Number(title.match(/^(?:["']?)(?:第)?(\d+)(?:章|\.)/)?.[1]);
  assert(Number.isInteger(n)&&n>0,file);
  assert.match(title,/^\d{2}\. /,file);
  if(!groups.has(series))groups.set(series,[]);groups.get(series).push(n);
 }
 assert(groups.size>=4);
 for(const [series,nums]of groups)assert.deepEqual(nums.sort((a,b)=>a-b),Array.from({length:nums.length},(_,i)=>i+1),series);
 const rows=tableRows(readDetail());
 assert.deepEqual(["逆質問の適合率","文書検索の適合率","回答生成の適合率"].map(x=>rows.find(r=>r[0]===x)?.[1]),["98％","72％","98％"]);
 assert(readDetail().includes("必要な品質に未達"));assert(!readDetail().includes("280時間"));
});


test("specialist routing has its own scenario requirement and improvement", () => {
 const before=tableRows(readDetail()).find(row=>row[0]==="専門判断案件の適切な有人振り分け率");
 assert.deepEqual(before,["専門判断案件の適切な有人振り分け率","94％","要件100％に未達"]);
 const after=tableRows(readImprovement()).find(row=>row[0]==="専門判断案件の適切な有人振り分け率");
 assert.deepEqual(after.slice(0,3),["専門判断案件の適切な有人振り分け率","94％","100％"]);
 assert(!readDetail().includes("94％から100％"));
 assert(readImprovement().includes("公開用の設計・検証シナリオ"));
 assert(readImprovement().includes("引継ぎ情報の受渡し成功率"));
 assert(!/400件|24件|12件|200件中/.test(readImprovement()));
});


test("monthly workload equations retain dimensions and distinguish the target from the outlook", () => {
 const before=read("why-ai");
 for(const expression of ["750件／月 × 10分／件", "600件／月 × 10分／件", "150件／月 × 70分／件", "125時間／月 ＋ 100時間／月 ＋ 175時間／月", "24,000分／月 ÷ 1,500件／月", "400時間／月 − 100時間／月"]) assert(before.includes(expression),expression);
 assert.equal(750*10+600*10+150*70,24000);
 assert.equal(24000/1500,16);assert.equal(24000/60,400);
 assert.equal(600*10/60,100);assert.equal(400-100,300);
 assert.equal(720/750,.96);assert.equal(720*10/60,120);assert.equal(400-120,280);
 assert(!/125＋100＋175|400−100|500件中.*96％/.test(before+readImprovement()));
});

test("Book entrance follows the author supplied background-to-outlook introduction", () => {
 const body=read("").split("---").slice(2).join("---");
 const headings=[...body.matchAll(/^## (.+)$/gm)].map(match=>match[1]);
 assert.deepEqual(headings,["業務背景","解決すべき課題","設計と問題発見","改善結果","業務効果の見込み"]);
 assert(body.replace(/\s/g,"").length<700);
 assert.equal((body.match(/本事例は設計・検証シナリオです/g)||[]).length,1);
 assert(!/^\||data-support-dx|×|÷|＝|<span/m.test(body));
 assert.equal((body.match(/^- /gm)||[]).length,2);
 assert(body.includes("月720件を顧客自身で解決できると想定"));
 assert(body.includes("業務効果は条件付きの試算"));
 assert(read("responsibility-boundary").includes("data-support-dx-diagram"));
});

test("first PoC is a small functional tryout without an invented sample count or outcomes", () => {
 const chapter=read("poc-evaluation");
 const body=chapter.split("---").slice(2).join("---");
 const diagram=JSON.stringify(caseDiagrams["support-poc-checks"]);
 assert(body.includes("少数の問い合わせ例を用いた簡単な動作確認"));
 assert(body.includes("基本動作を確認できたため、QAシステムの本格開発へ進むことにしました"));
 assert(!/\d+(?:件|％|%|日間|週間|か月)|実証|成功率|適合率|品質保証|有人引継ぎ|安全性/.test(body+diagram));
 assert(!/過去の問い合わせ500件|実現見込み/.test(chapter+diagram));
 assert(body.length<350);
 assert(readDetail().includes("| 定型問い合わせ | 250 |"));
 assert(readDetail().includes("| 専門判断が必要 | 200 |"));
 assert(readDetail().includes("| 回答根拠不足 | 50 |"));
});

test("only unmet initial evaluation values and judgments receive color emphasis", () => {
 const source=readDetail();
 const marked=[...source.matchAll(/<span class="evaluation-unmet">([^<]+)<\/span>/g)].map(match=>match[1]);
 assert.deepEqual(marked,["72％","必要な品質に未達","94％","要件100％に未達"]);
 const rows=source.split(/\r?\n/).filter(line=>line.includes("| 逆質問の適合率 |")||line.includes("| 回答生成の適合率 |"));
 assert.equal(rows.length,2);
 for(const row of rows)assert(!row.includes("evaluation-unmet"));
});

test("chronology separates initial handoff from post-evaluation search and stop improvements",()=>{
 const first=read("poc-evaluation"),initial=readDetail(),knowledge=read("knowledge-design"),stop=read("stopping-conditions"),after=readImprovement();
 assert.match(first,/^title: 04\. 第1回PoC：フィージビリティ確認$/m);
 assert(initial.includes("初期システムにも")&&initial.includes("十分に振り分けられていません"));
 assert(knowledge.includes("第07章の評価で見つかった別機種文書の誤検索"));
 assert(stop.includes("有人振り分け率が94％")&&stop.includes("要件100％"));
 for(const phrase of ["自動回答の可否","回答の適用条件","専門判断の必要性","回答許可と停止条件を強化"])assert(stop.includes(phrase),phrase);
 assert(after.includes("[第08章](/cases/customer-support-ai-dx/knowledge-design/)"));
 assert(after.includes("[第09章](/cases/customer-support-ai-dx/stopping-conditions/)"));
 for(const chapter of [knowledge,stop]) assert(!/72％から98％|94％から100％|280時間/.test(chapter));
});
