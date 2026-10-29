import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
const root = "src/content/cases/ai-technical-investigation/";
const read = slug => fs.readFileSync(root + slug + ".md", "utf8");
const slugs = ["background", "initial-investigation", "shared-library-investigation", "crash-resolution", "memory-leak-investigation"];
test("technical investigation is five ordered chapters with the old conclusion retired", () => {
 const entries = fs.readdirSync(root).filter(p => p.endsWith(".md")).map(p => YAML.parse(fs.readFileSync(root + p, "utf8").split("---")[1]));
 const chapters = entries.filter(e => e.series === "ai-technical-investigation").sort((a,b) => a.order-b.order);
 assert.equal(chapters.length, 5);
 assert.deepEqual(chapters.map(e => e.order), [1,2,3,4,5]);
 chapters.forEach((e,i) => assert(e.title.startsWith(String(i+1).padStart(2,"0") + ". ")));
 assert.equal(entries.find(e => e.lifecycle === "retired").series, undefined);
});
test("work-sharing and verification principles are grounded in the actual investigation", () => {
 const initial = read(slugs[1]), shared = read(slugs[2]), resolved = read(slugs[3]), leak = read(slugs[4]);
 assert(initial.indexOf("元の調査情報を追加した") < initial.indexOf("横断調査を選んだ"));
 for (const phrase of ["私は該当コードを読み", "修正は実施されたが、対象のクラッシュは解消しなかった"]) assert(initial.includes(phrase));
 for (const phrase of ["新しい対話", "不正なポインタ状態", "因果関係までは確定できなかった", "参考情報として提示した"]) assert(shared.includes(phrase));
 assert(resolved.includes("担当チームの調査により"));
 assert(resolved.includes("第03章で修正されたものとは別のメモリリークが残っている"));
 assert(leak.indexOf("関連するやり取りをまとめてCopilotへ渡した") < leak.indexOf("私自身が関連コードを調べた"));
 assert(leak.includes("両版のコード比較を依頼した"));
 assert(leak.includes("差分があるだけで原因と決めず"));
 assert(leak.includes("担当チームでも問題箇所が確認され、修正が行われた"));
 assert(leak.includes("自分でもコードを比較して確認できた"));
 assert(leak.trim().endsWith("その根拠を引き継ぎ、担当チームによる修正・改善検証につなげた。"));
 for (const text of [initial,shared,resolved,leak]) assert(!text.includes("情報量、機密性、利用できるコンテキスト"));
});

test("investigation diagrams show observed paths without visible captions or hypothetical branches", () => {
 for (const slug of ["background", "initial-investigation", "memory-leak-investigation"]) {
  const text = read(slug);
  assert(!text.includes("<figcaption"));
  assert(!text.includes("aria-labelledby="));
  assert(text.includes('aria-label="'));
  assert(text.includes('alt="'));
 }
 for (const kind of ["crash-flow", "leak-flow"]) for (const theme of ["light", "dark"]) {
  const svg = fs.readFileSync("public/diagrams/static/software-engineering--ai-technical-investigation-design-" + kind + "-" + theme + ".svg", "utf8");
  assert(svg.includes('<title id="title">') && svg.includes('<desc id="desc">'));
  assert(!/alternative|decision|stroke-dasharray|未該当|はい|いいえ/.test(svg));
  const nodes = (svg.match(/class="node/g) || []).length;
  const edges = (svg.match(/class="line"/g) || []).length;
  assert.equal(edges, nodes - 1);
 }
});

test("version comparison uses the affected and previous versions without certifying the previous version", () => {
 const paths = ["src/content/cases/ai-technical-investigation.md", ...slugs.map(slug => root + slug + ".md")];
 const forbidden = /問題の有無が異なる|問題が確認されなかった版|問題が確認されない版|正常な旧版|正常版|異常版/;
 for (const path of paths) {
  const text = fs.readFileSync(path, "utf8").replace(/id="[^"]*"/g, "");
  assert(!forbidden.test(text), path);
 }
 const leak = read("memory-leak-investigation");
 assert(leak.includes("問題がある版と前回版"));
 assert(leak.includes("差分があるだけで原因と決めず"));
 const background = read("background");
 assert(background.includes("人間が調査するときに持っている前提条件"));
 assert(background.includes("Copilotが人間と同じ理解に到達したことは別"));
 for (const name of fs.readdirSync("public/diagrams/static").filter(n => n.startsWith("software-engineering--ai-technical-investigation-design-") && /leak-flow|roles/.test(n))) {
  const svg = fs.readFileSync("public/diagrams/static/" + name, "utf8").replace(/&#x([0-9a-f]+);/gi, (_, v) => String.fromCodePoint(parseInt(v, 16)));
  assert(!forbidden.test(svg), name);
  assert(svg.includes("問題がある版と前回版") || svg.includes("問題がある版と</tspan><tspan"), name);
 }
});

test("reader-facing prose omits approval workflow while preserving the confirmed initial bug", () => {
 const rootText = fs.readFileSync("src/content/cases/ai-technical-investigation.md", "utf8");
 const texts = [rootText, ...slugs.map(read)];
 for (const text of texts) assert(!/社内原資料との照合|会社の公開許可|公開承認済み/.test(text));
 const initial = read("initial-investigation");
 assert(initial.includes("実際に存在する実装上のバグと判断した"));
 assert(initial.includes("修正は実施されたが、対象のクラッシュは解消しなかった"));
 assert(initial.includes("実在するバグの発見・修正と、当初のクラッシュの解決は別の成果"));
 assert(read("crash-resolution").includes("担当チームの調査により"));
 assert(read("crash-resolution").includes("第02章の同期制御の不備と、第03章で発見されたメモリリーク"));
});

test("shared-library leak is confirmed later and was not the crash cause", () => {
 const shared = read("shared-library-investigation"), resolved = read("crash-resolution"), later = read("memory-leak-investigation");
 assert(shared.indexOf("発見時点では") < shared.indexOf("その後、Copilotが指摘した問題"));
 assert(shared.includes("実在するメモリリークのバグとして確認され、修正された"));
 assert(shared.includes("そのバグは当初のクラッシュの原因ではなかった"));
 assert(resolved.includes("外部ライブラリの更新に伴う実装上の互換性の問題が、クラッシュの原因として特定された"));
 assert(resolved.includes("いずれも当初のクラッシュの直接原因ではなかった"));
 assert(!later.includes("同一の問題かは確認できていない"));
 for (const slug of slugs) assert(!read(slug).includes("F" + "DAL"));
});

test("limited review labels the overall crash flow and keeps only the roles diagram in chapter 05", () => {
 const initial = read("initial-investigation"), resolved = read("crash-resolution"), leak = read("memory-leak-investigation");
 assert(initial.indexOf("第02〜04章にわたるクラッシュ調査全体の経過") < initial.indexOf("<figure"));
 assert(resolved.includes("第03章で修正されたものとは別のメモリリークが残っている"));
 assert(!leak.includes("同一の問題かは確認できていない"));
 assert(YAML.parse(leak.split("---")[1]).title.includes("修正候補を絞り込む"));
 assert.equal((leak.match(/<figure/g) || []).length, 1);
 assert(leak.includes('id="investigation-roles-caption"'));
 assert(leak.includes('id="investigation-leak-flow-caption"'));
 assert(!leak.includes('src="/diagrams/static/software-engineering--ai-technical-investigation-design-leak-flow-'));
 for (const theme of ["light", "dark"]) assert(fs.existsSync("public/diagrams/static/software-engineering--ai-technical-investigation-design-leak-flow-" + theme + ".svg"));
});

test("the introduction and chapter handoff identify two distinct memory leaks", () => {
 const introduction = fs.readFileSync("src/content/cases/ai-technical-investigation.md", "utf8");
 assert(introduction.includes("調査過程で発見された2件のメモリリーク"));
 assert(read("crash-resolution").includes("第03章で修正されたものとは別のメモリリークが残っている"));
 assert(read("memory-leak-investigation").includes("担当チームでは、もう1件のメモリリークについて調査が続いていた"));
 for(const text of [introduction, ...slugs.map(read)]) assert(!/同一性は未確認|同一の問題かは確認できていない/.test(text));
 const initialBody = read("initial-investigation").split("---").slice(2).join("---");
 assert(!initialBody.includes("メモリリーク"));
 assert(read("shared-library-investigation").includes("実在するメモリリークのバグとして確認され、修正された"));
 assert(read("shared-library-investigation").includes("そのバグは当初のクラッシュの原因ではなかった"));
});
