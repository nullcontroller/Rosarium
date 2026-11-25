import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
const manuscript=()=>fs.readFileSync("src/content/cases/specification-debt-review.md","utf8");
const table=[
 "| 比較項目 | 個別ファイル提供 | Pythonによる統合 | リポジトリ参照 |",
 "| 情報提供方法 | ファイルを個別に渡す | 単一文書を渡す | リポジトリ内の文書を参照させる |",
 "| 準備上の課題 | ファイル数が多いと手間が掛かる | 統合処理が必要 | リポジトリへの配置が必要 |",
 "| 文書構造 | ファイル単位 | 単一の長大な文書 | ファイル単位を維持 |",
 "| 採否 | 不採用 | 不採用 | 採用 |",
 "| 判断理由 | 情報提供の負担 | 文書の長大化 | ファイル構造を維持した参照 |",
];

test("reference selection precedes actual review and preserves the author's three-way comparison",()=>{
 const text=manuscript();
 for(const row of table)assert(text.includes(row),row);
 assert(text.indexOf("### 課題――多数")<text.indexOf("### 仮説・方式検討"));
 assert(text.indexOf("### 仮説・方式検討")<text.indexOf("### 判断――リポジトリ参照"));
 assert(text.indexOf("### 判断――リポジトリ参照")<text.indexOf("### 実施事項――"));
 assert(text.indexOf("### 実施事項――")<text.indexOf("## ドキュメントの負債が見つかった"));
 assert(text.includes("次表は方式選定時の検討内容であり、実測による性能比較ではない"));
});

test("the selected method is consistent in prose, the interactive diagram and Career",()=>{
 const text=manuscript(),diagram=fs.readFileSync("src/data/case-diagrams.ts","utf8"),career=fs.readFileSync("src/content/career/overview.md","utf8");
 for(const source of [text,diagram,career])assert(!/Pythonで統合し|Pythonで1ファイルへ統合し|統合した仕様書/.test(source));
 assert(text.includes("Pythonによる統合は文書の長大化を理由に、今回のレビュー方式としては採用しなかった"));
 assert(diagram.includes("リポジトリ内のMarkdown仕様書・現在のコード・関連情報"));
 assert(career.includes("仕様書と現行コードの横断照合及び修正判断"));
});

test("observed counts and duration remain distinct from unmeasured superiority and coverage",()=>{
 const text=manuscript(),data=YAML.parse(text.split("---")[1]);
 assert.equal(data.published_at,"2026-10-07");
 assert.equal(data.last_updated,"2026-11-26");
 assert.equal(data.layer,"case");
 for(const phrase of ["約30,000文字・68ページ", "Markdownは68ファイル", "約40件は修正件数ではなく", "一連のレビューと修正を約3時間で完了した", "三方式の比較実験は実施していない", "全ファイルを漏れなくレビューできることは同義ではない", "工数上の優位性は定量的に評価しない", "最終修正は人間が行う"])assert(text.includes(phrase),phrase);
 assert(text.includes("Rosariumの公開リポジトリではない"));
});

test("three numbered figures have both themes, conceptual labels and reserved dimensions",()=>{
 const text=manuscript();assert.equal((text.match(/<figcaption>/g)||[]).length,3);
 for(const n of [1,2,3])assert(text.includes(`id="spec-reference-figure-${n}"`));
 for(const slug of ["comparison","architecture","decision"])for(const theme of ["light","dark"]){
  const svg=fs.readFileSync(`public/diagrams/spec-reference/${slug}-${theme}.svg`,"utf8");
  assert(svg.includes('<title id="title">')&&svg.includes('<desc id="desc">'));
  assert(!/<script|foreignObject/.test(svg));
  assert(text.includes(`/diagrams/spec-reference/${slug}-${theme}.svg`));
 }
 for(const image of text.match(/<img[^>]*>/g)||[])assert(/width="480" height="[1-9]\d*"/.test(image));
});


test("the review workflow is a static accessible diagram and retains human decisions",()=>{
 const text=manuscript(),component=fs.readFileSync("src/components/SpecificationReviewFlow.astro","utf8");
 assert(text.includes('<div data-specification-workflow></div>'));
 assert(!/```[^\n]*\nWord仕様書/.test(text));
 for(const phrase of ['<svg','<title','<desc','aria-labelledby','AI｜調査・候補の提示','人間｜確認・判断・最終修正','配色']) {if(phrase!=='配色')assert(component.includes(phrase));}
 assert(component.includes('[data-theme="dark"]'));assert(!component.includes('<script'));
});
