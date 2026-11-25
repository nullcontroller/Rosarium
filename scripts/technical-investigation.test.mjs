import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
const root='src/content/cases/ai-technical-investigation/';
const slugs=['background','investigation-scope','investigation-input','initial-investigation','shared-library-investigation','crash-resolution','memory-leak-investigation','findings-and-evaluation','reusable-method'];
const read=slug=>fs.readFileSync(root+slug+'.md','utf8');
const parse=text=>({data:YAML.parse(text.split('---')[1]),body:text.split('---').slice(2).join('---')});
test('one existing Case has nine ordered chapters and preserves old publication dates and retired URLs',()=>{
 const chapters=slugs.map(slug=>parse(read(slug)).data);
 assert.deepEqual(chapters.map(e=>e.order),[1,2,3,4,5,6,7,8,9]);
 chapters.forEach((e,i)=>{assert(e.title.startsWith(String(i+1).padStart(2,'0')+'. '));assert.equal(e.series,'ai-technical-investigation');assert.equal(e.last_updated,'2026-11-26');});
 for(const slug of ['background','initial-investigation','shared-library-investigation','crash-resolution','memory-leak-investigation'])assert.equal(parse(read(slug)).data.published_at,'2026-10-29');
 assert.equal(parse(read('investigation-principles')).data.lifecycle,'retired');
});
test('the author effort and comparison limit are explicit at the opening and in the listing summary',()=>{
 const overview=parse(fs.readFileSync('src/content/cases/ai-technical-investigation.md','utf8'));
 assert.equal(overview.data.published_at,'2026-10-29');
 for(const phrase of ['私の稼働工数：2人日','最終成果：残存メモリリークの解消','工数削減効果は不明（比較データなし）'])assert(overview.data.summary.includes(phrase));
 const opening=overview.body.split('## このBook')[0];
 for(const phrase of ['## 本事例の成果と評価範囲','私自身の稼働工数2人日','比較データはなく、工数削減効果は不明','関係担当者を含めた総工数でもない'])assert(opening.includes(phrase));
 const sources=[overview.body,...slugs.map(read),fs.readFileSync('src/content/career/overview.md','utf8')].join('\n');
 assert(!sources.includes('2日間'));assert(!/16人時|削減率[：:]?\s*\d+/.test(sources));
 for(const slug of ['memory-leak-investigation','findings-and-evaluation','reusable-method'])assert(read(slug).includes('2人日'));
});

test('input hypothesis and changes to the requested work remain distinct',()=>{
 const scope=read('investigation-scope'),input=read('investigation-input');
 assert(scope.includes('調査を誤った方向へ誘導'));
 assert(input.includes('入力不足が原因だったと証明したわけではない'));
 assert(input.indexOf('スクリーンショットで追加')<input.indexOf('横断的に探索する依頼へ切り替え'));
 assert(input.includes('何を判断材料として渡すかと、AIに何を実行させるかの両方'));
});
test('lock ownership, separate memory leaks, and the original crash are not equated',()=>{
 const initial=read('initial-investigation'),shared=read('shared-library-investigation'),resolved=read('crash-resolution');
 for(const phrase of ['異常終了の経路にはロックの所有権を解放する処理','正常終了の経路ではその処理を行わないまま','修正は実施されたが、対象のクラッシュは解消しなかった','メモリリークの確認とは区別'])assert(initial.includes(phrase));
 for(const phrase of ['その後、Copilotが指摘した問題','実在するメモリリークのバグとして確認され、修正された','そのバグは、今回のクラッシュの直接原因としては確認されなかった'])assert(shared.includes(phrase));
 assert(resolved.includes('その後の原因特定や修正作業へ直接参加していない'));
 assert(resolved.includes('第5章で修正されたものとは別のメモリリーク'));
});
test('the later leak retains rejected candidates, direct code verification, and responsible repair',()=>{
 const leak=read('memory-leak-investigation');
 assert(leak.indexOf('関連するやり取りをまとめてCopilotへ渡した')<leak.indexOf('私自身が関連コードを調べた'));
 for(const phrase of ['両版のコード比較を依頼した','一つ目については残る課題に関係する可能性が薄い','差分があるだけで原因と決めず','私が直接変更する権限を持たないコード','担当チームでも問題箇所が確認され、修正が行われた','二重解放や解放後使用などの特定の障害機序へ断定しない'])assert(leak.includes(phrase));
});
test('diagrams are accessible, captioned, dual-theme and honest about the timing boundary',()=>{
 const sources=slugs.map(read).join('\n');
 assert.equal((sources.match(/<figure /g)||[]).length,14);
 assert.equal((sources.match(/<figcaption>/g)||[]).length,14);
 for(const img of sources.match(/<img[^>]*>/g)||[])assert(/width="480" height="[1-9]\d*"/.test(img),'Reserve intrinsic image space before lazy loading');
 for(const slug of ['architecture','scope','input','lock-paths','handoff','separate-problems','leak-investigation','timeline','method','swimlanes','variable-management','scope-comparison','version-diff','instruction-model'])for(const theme of ['light','dark']){
  const svg=fs.readFileSync(`public/diagrams/investigation/${slug}-${theme}.svg`,'utf8');
  assert(svg.includes('<title id="title">')&&svg.includes('<desc id="desc">'));
  assert(!/<script|foreignObject/.test(svg));assert(sources.includes(`/diagrams/investigation/${slug}-${theme}.svg`));
 }
 const timeline=fs.readFileSync('public/diagrams/investigation/timeline-light.svg','utf8');
 for(const phrase of ['第1段階｜私の初期調査と引継ぎ','各作業の時刻・日別配分は未確定','長さは時間に比例しない'])assert(timeline.includes(phrase));
 assert(!/1日目|2日目|16人時|2日間/.test(timeline));
 for(const phrase of ['私自身の稼働工数：2人日','関係担当者の修正・検証工数は含まない','一案は残る課題との関係が薄い','Bを修正してもクラッシュ残存'])assert(timeline.includes(phrase));
});
test('public text is anonymous and future improvements are separated from experience',()=>{
 for(const slug of slugs)assert(!/F(?:DAL)|Exo(?:dus)|CE(?:xd|xInit)|fxSNMP|[A-Z]:\\|image-179315|0x[0-9a-f]{6}/i.test(parse(read(slug)).body),slug);
 const text=slugs.map(read).join('\n');assert(!/\.(?:cpp|h)\b|```(?:cpp|c\+\+)/.test(text));
 assert(read('reusable-method').includes('今後の改善提案――実施済みの成果とは分ける'));
});

test('the author hands off for about two weeks and the reported crash fix belongs to the responsible parties',()=>{
 const overview=fs.readFileSync('src/content/cases/ai-technical-investigation.md','utf8'),crash=read('crash-resolution'),leak=read('memory-leak-investigation'),method=read('reusable-method');
 for(const phrase of ['約2週間','追加調査や修正作業に関与しなかった','Cの担当者及び委託先'])assert(overview.includes(phrase)&&crash.includes(phrase));
 for(const phrase of ['変数の管理方式及びメモリ解放処理の変更','既存カスタマイズ実装との不整合','ローカル変数'])assert(crash.includes(phrase));
 for(const phrase of ['今回の現象が発生しないOSSの版','OSS更新との関連性も考慮','正常版は今回の現象が発生しない比較条件'])assert(leak.includes(phrase));
 for(const phrase of ['生成AIへの指示とは単に命令文を書くことではなく','文脈を共有していないAI','正常条件と異常条件','コード、ログ、テスト結果','AIへ任せる作業と、人間が担う判断'])assert(method.includes(phrase));
});

test('unconfirmed direct causality is not presented as complete rejection of involvement',()=>{
 const shared=read('shared-library-investigation'),crash=read('crash-resolution'),evaluation=read('findings-and-evaluation');
 for(const text of [shared,crash,evaluation]){assert(text.includes('今回のクラッシュの直接原因としては確認されなかった'));assert(!/直接原因ではなかった|クラッシュの原因ではなかった/.test(text));}
 assert(crash.includes('先行不具合の関与を完全に棄却したとは扱わない'));
});

test('release metadata preserves original publication dates and dates new chapters on 26 November',()=>{
 for(const slug of ['investigation-scope','investigation-input','findings-and-evaluation','reusable-method'])assert.equal(parse(read(slug)).data.published_at,'2026-11-26');
});
