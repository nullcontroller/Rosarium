import test from "node:test";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { splitRelatedContent, relatedTargets, caseEvidenceLinks } from "../src/lib/related-content.mjs";

test("curated evidence links are bidirectional, bounded and do not repeat body links", () => {
  const studies = [{ book: "cases/a", design: ["foundations/p"] }, { book: "cases/b", design: ["foundations/p"] }, { book: "cases/c", design: ["foundations/p"] }];
  const active = new Set(["foundations/p", "cases/a", "cases/b", "cases/c"]);
  const origin = "https://rosarium-tech.com/foundations/p/";
  assert.deepEqual(caseEvidenceLinks("foundations/p", "", origin, studies, active), ["cases/a", "cases/b"]);
  assert.deepEqual(caseEvidenceLinks("cases/a", "", origin, studies, active), ["foundations/p"]);
  assert.deepEqual(caseEvidenceLinks("foundations/p", '<a href="/cases/a/">根拠</a>', origin, studies, active), ["cases/b", "cases/c"]);
  active.delete("cases/b");
  assert.deepEqual(caseEvidenceLinks("foundations/p", '<a href="/Rosarium/cases/a/">根拠</a>', origin, studies, active), ["cases/c"]);
  assert.deepEqual(caseEvidenceLinks("foundations/unrelated", "", origin, studies, active), []);
});

test("explicit recommendations are excluded while later body and inline references remain", () => {
  const source = '<p>本文<a href="/reference/">用語</a></p><h2 id="related">Related Design Principles</h2><ul><li><a href="/ai-design/">原則</a></li></ul><h2 id="later">次の本題</h2><p>後半本文</p>';
  const result = splitRelatedContent(source);
  assert(result.body.includes("後半本文"));
  assert(result.body.includes("用語"));
  assert(!result.body.includes("Related Design"));
  assert(result.related.includes("関連する設計原則"));
  assert(result.related.includes('id="related"'));
  assert.deepEqual([...relatedTargets(result.related, "https://rosarium-tech.com/cases/book/")], ["https://rosarium-tech.com/ai-design/"]);
  const before = load(source)("a").map((_, node) => node.attribs.href).get().sort();
  const after = load(result.body + result.related)("a").map((_, node) => node.attribs.href).get().sort();
  assert.deepEqual(after, before);
});
test("ordinary related-word headings are not extracted and headings keep their boundary", () => {
  const source = '<h3>GitHub Copilotで関連コードを探索する</h3><p>本題</p><h3>Related Design</h3><p><a href="/dx/">DX</a></p><h3>評価</h3><p>最後の本題</p>';
  const result = splitRelatedContent(source);
  assert(result.body.includes("関連コード"));
  assert(result.body.includes("最後の本題"));
  assert(result.related.includes("関連する設計"));
  assert(!result.related.includes("最後の本題"));
});

