import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { contentHistory } from "../src/data/content-history.ts";
import { recentGrowth, growthChangeText, growthChangeTargets, growthPublishedTargets, growthSummary, validateRecentGrowth } from "../src/data/recent-growth.ts";
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

test("October 18 highlights the design revision and reported investigation", () => {
  const rows = recentGrowth.filter(item => item.date === "2026-10-18");
  assert.equal(rows.length, 1);
  const item = rows[0];
  assert.equal(item.title, "顧客サポートDXを代表設計事例として整理");
  assert.equal(item.type, "revised");
  assert.deepEqual(growthSummary(item, id => id.startsWith("cases/")), item.summaryChanges);
  assert.equal(item.summaryChanges.length, 3);
  assert(item.summaryChanges[0].includes("顧客サポートDX"));
  assert(item.summaryChanges[1].includes("担当範囲・方式判断・到達点"));
  assert.equal(item.summaryChanges[2], "終了順序の記事を、本人が確認した調査・判断の記録に整理");
  assert.equal(item.changes[0].contentIds[0], "cases/customer-support-ai-dx");
  assert.equal(new Set(item.changes.flatMap(growthChangeTargets)).size, 3);
  for (const id of item.changes.flatMap(growthChangeTargets)) assert(fs.existsSync(`src/content/${id}.md`), id);
  validateRecentGrowth(recentGrowth);
});

test("the article revision appears once, independently of the daily title", () => {
  const id = "software-engineering/engineering-judgment-in-ai-code-review";
  const source = fs.readFileSync(`src/content/${id}.md`, "utf8");
  const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const events = contentHistory(id, data);
  assert.equal(events[0].date, "2026-10-16");
  const revisions = events.filter(event => event.date === "2026-10-18" && event.type === "revised");
  assert.equal(revisions.length, 1);
  assert.equal(revisions[0].text, "終了順序の記事を、本人が確認した調査・判断の記録に整理した");
  assert.equal(revisions[0].text.split(data.update_note).length - 1, 1);
});
