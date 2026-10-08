import test from "node:test";
import assert from "node:assert/strict";
import { contentHistory } from "../src/data/content-history.ts";
import { recentGrowth, growthSummary } from "../src/data/recent-growth.ts";
import { inRecentWindow, japanToday } from "../src/lib/history-window.ts";

test("publication starts history and preserves original date precision", () => {
  const id = "foundations/ai-business-design/evaluating-business-efficiency";
  const events = contentHistory(id, { source: { publication_month: "2026-08" } });
  assert.deepEqual(events[0], { date: "2026-08", type: "published", text: undefined });
  assert.equal(events[1].date, "2026-10-08");
  assert.equal(events[1].type, "revised");
  assert(events[1].text.includes("実務経験"));
  assert.equal(contentHistory("example/article", { published_at: "2026-08-22 10:28" })[0].date, "2026-08-22");
  assert.equal(contentHistory("example/article", {})[0].date, "2026-09-23");
  assert.equal(contentHistory("career/overview", { layer: "career" })[0].date, null, "Career content remains unchanged");
  assert.equal(contentHistory("example/article", { source: { published_at: "2026-06-10" } })[0].date, "2026-06-10");
});

test("new publication is not duplicated as a revision; revisions stay chronological", () => {
  const events = contentHistory("cases/specification-debt-review", { published_at: "2026-10-07" });
  assert.equal(events.length, 2);
  assert.equal(events[0].type, "published");
  assert.equal(events[1].date, "2026-10-08");
  assert.equal(events[1].type, "revised");
  assert(events[1].text.includes("人間が最終修正"));
  assert.deepEqual(contentHistory("practices/ai-adoption-and-effective-use", {}).map(event => event.date), ["2026-09-23", "2026-10-07", "2026-10-08"]);
});

test("aggregate counts separate publication, revision and Case without titles", () => {
  assert.deepEqual(growthSummary(recentGrowth.find(entry => entry.date === "2026-10-08"), id => id === "cases/specification-debt-review"), ["AI設計に関する記事を16件改訂", "AI設計に関するCaseを1件改訂"]);
  assert.deepEqual(growthSummary(recentGrowth.find(entry => entry.date === "2026-10-07"), id => id === "cases/specification-debt-review"), ["Caseを1件新規公開", "記事を1件新規公開", "記事を1件改訂"]);
  assert.equal(growthSummary(recentGrowth.find(entry => entry.date === "2026-10-03"), () => false).length, 1);
});

test("update_note is preserved in the dated revision without duplicating an event", () => {
  const id = "foundations/applicability-and-delegation";
  const data = { updated_at: "2026-10-08", update_note: "価値・Riskに加え、検証・修正・復旧の負担を含む委任判断を追加" };
  const events = contentHistory(id, data);
  assert.equal(events.filter(event => event.date === "2026-10-08").length, 1);
  assert(events.at(-1).text.includes(data.update_note));
  assert.equal(contentHistory("example/article", data).at(-1).type, "revised");
  const long = contentHistory("practices/adoption-governance", { updated_at: "2026-10-09", update_note: "追加の実質改訂" });
  assert.equal(long.length, 4);
  assert.equal(long[0].type, "published");
});

test("Home includes today through day 29, excluding future, old and month-only dates", () => {
  assert(inRecentWindow("2026-09-09", "2026-10-08"));
  assert(inRecentWindow("2026-10-08", "2026-10-08"));
  assert(!inRecentWindow("2026-09-08", "2026-10-08"));
  assert(!inRecentWindow("2026-10-09", "2026-10-08"));
  assert(!inRecentWindow("2026-09", "2026-10-08"));
  assert(inRecentWindow("2024-02-29", "2024-03-29"));
  assert.equal(japanToday(new Date("2026-10-07T15:00:00Z")), "2026-10-08");
});
