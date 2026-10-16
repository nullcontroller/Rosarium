import test from "node:test";
import assert from "node:assert/strict";
import { recentGrowth, growthChangeText, growthChangeTargets, growthPublishedTargets, validateRecentGrowth } from "../src/data/recent-growth.ts";
const entry = changes => ({ date: "2026-10-06", type: "integrated", title: "Integration", changes, category: "Rosarium" });
test("plain history stays compatible and today's seven substantive revisions are linked once", () => {
  assert.equal(growthChangeText("UI adjustment"), "UI adjustment");
  assert.deepEqual(growthChangeTargets("UI adjustment"), []);
  const today = recentGrowth.find(item => item.date === "2026-10-06");
  const ids = today.changes.flatMap(growthChangeTargets);
  assert.equal(ids.length, 7);
  assert.equal(new Set(ids).size, 7);
  validateRecentGrowth(recentGrowth);
});
test("history rejects duplicate dates or content links across change items", () => {
  assert.throws(() => validateRecentGrowth([entry([]), entry([])]));
  assert.throws(() => validateRecentGrowth([entry([{ text: "first", contentIds: ["cases/example"] }, { text: "again", contentIds: ["cases/example"] }])]));
});
test("content links cannot become external URLs or parent traversal paths", () => {
  for (const id of ["https://example.com", "../cases/example", "/cases/example", "cases/../example"]) {
    assert.throws(() => validateRecentGrowth([entry([{ text: "revision", contentIds: [id] }])]));
  }
});

test("Garden Notes links newly published content without a per-date flag", () => {
  assert.deepEqual(growthPublishedTargets(recentGrowth.find(item => item.date === "2026-10-16")), [
    "software-engineering/engineering-judgment-in-ai-code-review",
    "essays/from-ai-efficiency-to-value",
  ]);
  assert.deepEqual(growthPublishedTargets(recentGrowth.find(item => item.date === "2026-10-12")), [
    "architecture/requirements-to-system-method",
  ]);
  assert.deepEqual(growthPublishedTargets(entry([
    { action: "revised", text: "revised", contentIds: ["essays/old"] },
    { action: "published", text: "new", contentIds: ["essays/new"] },
    "UI only",
  ])), ["essays/new"]);
});
