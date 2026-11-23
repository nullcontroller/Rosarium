import assert from "node:assert/strict";
import test from "node:test";
import { isDraftPreview } from "../src/lib/draft-preview.mjs";
const draft = { id: "essays/what-is-ai", data: { status: "draft", public: false } };
test("draft previews require an explicit matching ID and nonpublic draft", () => {
  assert.equal(isDraftPreview(draft), false);
  assert.equal(isDraftPreview(draft, "essays/other"), false);
  assert.equal(isDraftPreview(draft, "essays/what-is-ai"), true);
  assert.equal(isDraftPreview(draft, "essays/cognitive-surrender, essays/what-is-ai"), true);
  assert.equal(isDraftPreview({ ...draft, data: {status: "draft", public: true} }, draft.id), false);
  assert.equal(isDraftPreview({ ...draft, data: {status: "published", public: false} }, draft.id), false);
});
