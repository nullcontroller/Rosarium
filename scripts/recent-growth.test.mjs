import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { contentHistory } from "../src/data/content-history.ts";
import { recentGrowth, growthChangeText, growthChangeTargets, growthPublishedTargets, growthSummary, validateRecentGrowth, validateRecordedRevisionDates } from "../src/data/recent-growth.ts";
const entry = changes => ({ date: "2026-10-06", type: "integrated", title: "Integration", changes, category: "Rosarium" });
test("recorded revisions reject stale dates and unpublished targets", () => {
  const records = [entry([{ action: "revised", text: "revision", contentIds: ["cases/example"] }])];
  const content = data => new Map([["cases/example", data]]);
  assert.throws(() => validateRecordedRevisionDates(records, content({ last_updated: "2026-10-05" })));
  assert.throws(() => validateRecordedRevisionDates(records, new Map()));
  for (const visibility of [{ public: false }, { status: "draft" }]) {
    assert.throws(() => validateRecordedRevisionDates(records, content({ last_updated: "2026-10-06", ...visibility })));
  }
  validateRecordedRevisionDates(records, content({ last_updated: "2026-11-24", public: true }));
  validateRecordedRevisionDates([entry(["Shared UI only"])], new Map());
});

test("article history uses canonical last_updated before legacy updated_at", () => {
  const events = contentHistory("cases/example", { published_at: "2026-09-28", last_updated: "2026-11-24", updated_at: "2026-10-19", update_note: "Revision" });
  assert.equal(events[0].date, "2026-09-28");
  assert.equal(events.at(-1).date, "2026-11-24");
});
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

test("November renovation records public changes without announcing review-only drafts", () => {
  const item = recentGrowth.find(item => item.date === "2026-11-24");
  assert.equal(item.date, "2026-11-24");
  assert.equal(recentGrowth.filter(entry => entry.date === item.date).length, 1);
  assert.equal(item.type, "revised");
  assert.deepEqual(growthPublishedTargets(item), []);
  assert.deepEqual(growthSummary(item, () => false), item.summaryChanges);
  assert.equal(item.summaryChanges.length, 3);
  assert.equal(item.changes.flatMap(growthChangeTargets).length, 13);
  const links = item.relatedLinks.map(link => link.path);
  assert.deepEqual(links, ["cases/customer-support-ai-dx", "ai", "dx", "planning", "cases", "career", "start-here", "about"]);
  assert.doesNotMatch(JSON.stringify(item), /design-studies|what-is-ai|cognitive-surrender|認知的降伏|AIは何者/);
  assert(recentGrowth.every((entry, i) => i === 0 || recentGrowth[i - 1].date > entry.date));
  for (const path of ["https://example.com", "../cases", "cases/../secret", "/cases", "cases/design.md"]) {
    assert.throws(() => validateRecentGrowth([{ ...entry([]), relatedLinks: [{ path, title: "Page" }] }]));
  }
  assert.throws(() => validateRecentGrowth([{ ...entry([]), relatedLinks: [{ path: "ai", title: "AI" }, { path: "ai", title: "Again" }] }]));
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
  assert.equal(new Set(item.changes.flatMap(growthChangeTargets)).size, item.changes.flatMap(growthChangeTargets).length);
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

test("PoC publication history is preserved when its body is kept in the two Book PoC chapters", () => {
  const day = recentGrowth.find(item => item.date === "2026-10-18");
  const id = "evaluation-hitl/customer-support-qa-poc";
  assert.deepEqual(growthPublishedTargets(day), [id]);
  assert.equal(day.changes.flatMap(growthChangeTargets).filter(target => target === id).length, 1);
  const source = fs.readFileSync(`src/content/${id}.md`, "utf8");
  const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert.equal(data.kind, "guide");
  assert.equal(data.publication_format, "article");
  assert.equal(data.series, undefined);
  assert.equal(data.lifecycle, "retired");
  assert(!/^## |^\|/m.test(source));
  assert(contentHistory(id, data).some(event => event.type === "integrated"));
  assert.equal(contentHistory(id, data).filter(event => event.type === "published").length, 1);
});

test("public histories focus on PoC failures and improvements", () => {
  const id = "cases/customer-support-ai-dx/poc-evaluation";
  const items = recentGrowth.flatMap(entry => entry.changes).filter(change => growthChangeTargets(change).includes(id));
  assert(items.some(change => growthChangeText(change).includes("初回PoCの目標未達・誤自動回答")));
  for (const change of items) assert(!/三つの処理経路|テスター・業務専門家|合格条件|独立した500件/.test(growthChangeText(change)));
  const day = recentGrowth.find(entry => entry.date === "2026-10-18");
  assert(day.summaryChanges.some(text => text.includes("PoCによる方式改善")));
});

test("multiple topics preserve the single daily record and reject invalid topic links", () => {
  const day = recentGrowth.find(item => item.date === "2026-11-25");
  assert.equal(day.topics.length, 5);
  assert.equal(growthPublishedTargets(day).length, 14);
  for (const topics of [[{title:"",summary:"summary"}], [{title:"title",summary:"summary",links:[{path:"https://example.com",title:"external"}]}], [day.topics[0], day.topics[0]]]) assert.throws(() => validateRecentGrowth([{...entry([]), topics}]));
});

test("topic destinations are optional and category updates can link both affected categories", () => {
  validateRecentGrowth([{...entry([]),topics:[{title:"Shared UI",summary:"Display improved"}]}]);
  const topics=recentGrowth.find(item=>item.date==="2026-11-25").topics;
  assert.equal(topics.find(topic=>topic.title==="サイト全体の読みやすさを改善").links,undefined);
  assert.deepEqual(topics.flatMap(topic=>(topic.links??[]).map(link=>link.path)),["essays/ai-essence","cases/design-studies","planning","system-design","career"]);
  assert.throws(()=>validateRecentGrowth([{...entry([]),topics:[{title:"title",summary:"summary",links:[{path:"ai",title:"AI"},{path:"ai",title:"AI"}]}]}]));
});
