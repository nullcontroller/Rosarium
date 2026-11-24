import test from "node:test";
import assert from "node:assert/strict";
import { mergeReviewTargets, readReviewTargets } from "./review-targets.mjs";
test("adding a review retains previous targets and removes duplicates", () => {
  assert.deepEqual(mergeReviewTargets(["essays/first", "essays/second"], ["essays/new", "essays/first"]), ["essays/first", "essays/second", "essays/new"]);
  assert.deepEqual(mergeReviewTargets(["essays/first"]), ["essays/first"]);
  assert.throws(() => mergeReviewTargets(["../secret"]));
});
test("shared staging profile retains all requested review groups", () => {
  const ids = readReviewTargets();
  assert.equal(ids.filter(id => id.startsWith("cases/design-studies/")).length, 6);
  assert(!ids.includes("essays/ai-essence"), "Published series is available through the normal build, not the draft allowlist");
  assert(!ids.includes("essays/cognitive-surrender"));
  assert(!ids.includes("essays/what-is-ai"));
});
