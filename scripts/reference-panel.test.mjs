import assert from "node:assert/strict";
import test from "node:test";
import { referenceEntries, referenceSearchText } from "../src/lib/reference.ts";

test("reference index and panel use canonical collection entries in source order", () => {
  const entries = [
    { id: "reference/math", data: { layer: "reference", order: 20 } },
    { id: "reference/terms", data: { layer: "reference", order: 10 } },
    { id: "foundations/glossary", data: { layer: "reference", order: 0 } },
    { id: "essay", data: { layer: "publication", order: 0 } },
  ];
  assert.deepEqual(referenceEntries(entries).map((entry) => entry.id), ["reference/terms", "reference/math"]);
});
test("Japanese queries match existing English reference terminology", () => {
  assert.equal(referenceSearchText("コンテキスト"), referenceSearchText("Context"));
  assert.equal(referenceSearchText("ナレッジ"), referenceSearchText("Knowledge"));
  assert.equal(referenceSearchText("ＲＡＧ"), referenceSearchText("RAG"));
});
