import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {caseDiagrams} from '../src/data/case-diagrams.ts';
import YAML from 'yaml';
const root='src/content/cases/customer-support-ai-dx';
const read=(name='')=>fs.readFileSync(`${root}${name?'/'+name:''}.md`,'utf8');
const body=name=>read(name).split('---').slice(2).join('---');
const rows=text=>text.split(/\r?\n/).filter(x=>x.startsWith('|')).map(x=>x.split('|').slice(1,-1).map(c=>c.replaceAll('**','').replace(/<[^>]+>/g,'').trim()));
const names=['executive-summary','why-ai','responsibility-boundary','poc-evaluation','human-handoff','customer-experience','poc-effect-evaluation','knowledge-design','stopping-conditions','poc-metadata-improvement','design-principles'];

test('support Book preserves eleven ordered routes and publication metadata',()=>{
 assert.deepEqual(fs.readdirSync(root).filter(x=>x.endsWith('.md')).sort(),names.map(x=>x+'.md').sort());
 names.forEach((name,i)=>{const fm=YAML.parse(read(name).split('---')[1]);assert.equal(fm.order,i+1);assert.equal(fm.series,'customer-support-ai-dx');assert(fm.title.startsWith(String(i+1).padStart(2,'0')+'. '));assert.equal(fm.status,'published');assert.equal(fm.last_updated,'2026-10-19');});
});
test('real work, PoC findings and unverified production outcomes are distinct',()=>{
 const overview=read();assert(overview.includes('実際に携わった'));assert(overview.includes('72％'));assert(overview.includes('96％'));assert(overview.includes('24パーセントポイント'));assert(overview.includes('本番での回答品質と業務削減効果は確認していません'));
 for(const name of ['',...names])assert(!/架空の企業|仮想設計ケーススタディ|検索適合率98％|文書検索の適合率72％ → 98％/.test(read(name)),name);
});
test('first PoC evaluates the unfiltered method and reports retrieval 72 percent',()=>{
 const first=body('poc-evaluation');assert(first.includes('回答正答率は72％'));assert(first.includes('検索対象の絞込みを導入していません'));assert(!/96％|成功率|品質保証/.test(first));
 assert.deepEqual(caseDiagrams['support-poc-checks'].explanation.records.map(r=>r[0]),['逆質問','ベクトル検索','RAGによる回答生成']);
 assert(read('poc-effect-evaluation').includes('同じ第1回PoC'));assert(!/フィージビリティ確認とは区別|先行する技術確認/.test(read('poc-effect-evaluation')));
});

test('initial retrieval finding does not inherit an estimated sample denominator',()=>{
 const initial=read('poc-effect-evaluation');assert(initial.includes('回答正答率は72％'));assert(!/07\.4|500件|250件|200件|50件|98％|94％/.test(initial));assert(!/96％|280時間/.test(initial));
 assert(initial.includes('RAG管理システムを新規設計・構築'));assert(initial.includes('意味的な関連性'));assert(initial.includes('業務上の適合性'));
});
test('architecture separates the original system, RAG management and customer QA',()=>{
 const s=read('knowledge-design');for(const phrase of ['既存の製品情報システム','新規RAG管理システム','顧客向けQAシステム','取込み','節分割','検索用データ','原本との同期に必要な負担'])assert(s.includes(phrase),phrase);
 assert(s.includes('レビューし、必要に応じて修正して承認'));assert(!/実装範囲は未確認|PoC利用済みとするものではありません/.test(s));
 assert(s.includes('data-case-diagram="support-rag-management"'));assert(s.includes('data-case-diagram="support-knowledge-design"'));
});
test('candidate generation, approval and revision remain design boundaries',()=>{
 const s=read('stopping-conditions');for(const p of ['文書単位と節単位','メタデータ候補','人間の承認後','本文とメタデータの版をそろえる','未承認、条件不明、競合する許可は自動回答不可','data-case-diagram="support-metadata-review"'])assert(s.includes(p),p);
 assert(s.includes('必要に応じて修正・承認'));assert(!/実装・検証済みとする記録|個別の実装範囲が未確認/.test(s));
});
test('retrieval eligibility and answer permission retain independent checks and human continuation',()=>{
 const s=read('stopping-conditions');for(const p of ['判定A','判定B','専門判断の必要性','自動回答の可否','回答の適用条件','data-support-dx-diagram','CS部へ振り分け','スコアの高さだけでは、回答の正しさや自動回答の許可を保証できません'])assert(s.includes(p),p);
 const steps=rows(s).filter(r=>['問い合わせ内容の確認','参照資料の検索','回答根拠の確認','自動回答の可否判定','専門判断の必要性確認','回答内容の確認'].includes(r[0]));assert.equal(steps.length,6);
});
test('both PoCs use answer correctness rather than retrieval precision',()=>{
 const s=read('poc-metadata-improvement');const row=rows(s).find(r=>r[0]==='回答正答率');assert.deepEqual(row,['回答正答率','72％','96％','24パーセントポイント']);assert.equal(96-72,24);
 assert(s.includes('第2回PoCの回答正答率は72％から96％へ改善'));assert(s.includes('検索文書だけの適合率とは区別'));
 assert(read('poc-effect-evaluation').includes('第1回PoCの回答正答率'));
});

test('remaining four percent means conservative escalation, not wrong customer answers',()=>{
 const s=read('poc-metadata-improvement');for(const p of ['残る4％','本来自動回答できる問い合わせ','誤った回答を顧客へ提示したケースではありません','有人判断が必要な問い合わせを適切に有人対応へ回した処理は、失敗には含めません','目標を達成したため、追加改善は行いませんでした'])assert(s.includes(p),p);
 assert(!/100件中72件|96件成功/.test(s));
});

test('specialist routing estimates are not promoted alongside measured retrieval',()=>{
 const s=read('poc-metadata-improvement');assert(s.includes('94％から100％'));assert(s.includes('別指標の見積もり'));assert(s.includes('別指標の見積もり'));assert(s.includes('引継ぎ情報の受渡し成功率'));assert(!rows(s).some(r=>r[0]==='専門判断案件の適切な有人振り分け率'));
});
test('self-resolution and workload projection remain separate from retrieval percent',()=>{
 const s=read('poc-metadata-improvement');for(const p of ['750件／月','720件／月','PoCの回答正答率96％とは別の試算前提','実測の自己解決率ではなく','125時間／月 × 0.96','400時間／月 − 120時間／月','280時間／月','増加工数は含まず','本番での回答品質と業務削減効果は確認していません'])assert(s.includes(p),p);
 assert.equal(720/750,.96);assert.equal(720*10/60,120);assert.equal(400-120,280);
});
test('baseline workload reconciles measured categories without changing business targets',()=>{
 const r=rows(read('why-ai'));const labels=['定型回答可能','専門判断が必要','回答根拠が不足'];const nums=labels.map(x=>r.find(y=>y[0]===x).slice(1,6).map(x=>Number(x.replaceAll(',','').match(/[\d.]+/)[0])));
 assert.deepEqual(nums,[[50,9000,750,10,125],[40,7200,600,10,100],[10,1800,150,70,175]]);assert.equal(nums.reduce((s,r)=>s+r[4],0),400);assert.equal(1500*16/60,400);assert.equal(400-600*10/60,300);
});
test('handoff preserves structured facts, sources and continuation of specialist work',()=>{
 const s=read('human-handoff');for(const p of ['機種ID','文書ID','未解決事項から','AIの推測を事実として扱わない','回答候補を正式な案内に使ってよいか判断','受付先で問い合わせID'])assert(s.includes(p),p);
});
test('initial chapters do not anticipate metadata implementation or measured outcomes',()=>{
 for(const n of names.slice(0,6).filter(n=>n!=='poc-evaluation')){const text=body(n);assert(!/判定A|判定B|72％|94％|98％|100％/.test(text),n);}
 assert(read('responsibility-boundary').includes('初期システムの判定不足'));
});
test('final chapter concludes PoC goal achievement without a production-readiness list',()=>{
 const s=read('design-principles');for(const p of ['意味の近さと適用条件','データ管理基盤','回答許可','第2回PoCで設定した目標を達成しました'])assert(s.includes(p),p);
 assert(!s.includes('## 11.5'));assert(!s.includes('| 課題 |'));
});

test('legacy routes and chapter anchors remain available after the reorganization',()=>{
 const s=read('poc-metadata-improvement');for(const p of ['102-poc再実施で検索品質と有人振り分けの目標を達成する','103-月750件への適用から業務改善の見込みを判断する'])assert(s.includes(`id="${p}"`),p);
 assert(!fs.existsSync(root+'/continuous-improvement.md'));const redirect=fs.readFileSync('src/pages/cases/customer-support-ai-dx/continuous-improvement.astro','utf8');assert(redirect.includes('poc-metadata-improvement'));assert(redirect.includes('noindex'));
});
test('real work in other Case and Career is not reclassified',()=>{
 const career=fs.readFileSync('src/content/career/overview.md','utf8');const support=career.split(':::case{title="顧客サポート')[1].split('\n:::')[0];assert(support.includes('システムアーキテクトとして'));assert(support.includes('区分：実務事例'));assert(support.includes('回答正答率が72％から96％へ改善'));assert(support.includes('本番運用での業務効果は測定していません'));assert(!/検証シナリオ|720件/.test(support));
});
test('metadata diagrams separate candidate generation, human corrections and approval',()=>{
 const s=JSON.stringify([caseDiagrams['support-rag-management'],caseDiagrams['support-metadata-review']]);
 for(const p of ['レビュー','修正','承認','生成AI','原文'])assert(s.includes(p),p);
 assert(!/実装範囲は未確認|実装完了を示す図ではありません/.test(s));
});

test('two PoCs follow initial retrieval, RAG management construction and improved retrieval',()=>{
 assert.match(read('poc-evaluation'),/^title: 04\. 第1回PoC：初期方式の評価$/m);
 assert.match(read('poc-effect-evaluation'),/^title: 07\. 第1回PoCの課題分析$/m);
 assert.match(read('poc-metadata-improvement'),/^title: 10\. 第2回PoC：改善方式の評価$/m);
 for(const n of ['',...names])assert(!/第1回PoCでのフィージビリティ|先行するフィージビリティ確認|先行する技術確認/.test(read(n)),n);
 assert(read('poc-metadata-improvement').includes('| 評価項目 | 第1回PoC | 第2回PoC |'));
 assert(read('executive-summary').includes('第2回PoCでの評価へ進みました'));
});

test('removed editorial notes and deleted chapter sections do not return',()=>{
 const ids=['poc-effect-evaluation','knowledge-design','stopping-conditions','poc-metadata-improvement','design-principles'];
 for(const id of ids){const s=read(id);assert(!/候補自動生成と承認ワークフローの実装範囲は未確認|実装・検証済みとする記録|個別の実装範囲が未確認/.test(s),id);}
 assert(!body('poc-effect-evaluation').includes('## 07.4'));assert(!body('design-principles').includes('## 11.5'));
 for(const id of ['',...names])assert(!/検索適合率(?:は)?(?:72|96)％|文書検索(?:の)?適合率(?:は)?(?:72|96)％/.test(read(id)),id);
});
