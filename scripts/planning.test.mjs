import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { isPlanningKnowledge, planningPublishedAt } from "../src/lib/planning.ts";
import { contentHistory } from "../src/data/content-history.ts";
const entry = (tags, extra = {}) => ({ data: { tags, kind: "essay", section: "essays", ...extra } });
test("planning reader purpose derives existing knowledge tags and excludes Case experience", () => {
  for (const tag of ["IT戦略", "システム企画", "ECRS"]) assert(isPlanningKnowledge(entry([tag])));
  assert(!isPlanningKnowledge(entry(["DX", "PoC", "KPI"])));
  assert(!isPlanningKnowledge(entry(["システム企画"], { kind: "case" })));
  assert(!isPlanningKnowledge(entry(["IT戦略"], { section: "cases" })));
});
test("planning references preserve existing classification; support QA records the SA boundary", () => {
  for (const id of ["essays/it-strategy-and-not-building", "essays/rethink-work-before-ai"]) {
    const text = fs.readFileSync(`src/content/${id}.md`, "utf8");
    const data = YAML.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    assert(isPlanningKnowledge({ data }));
    assert.equal(data.section, "essays");
    assert.equal(data.layer, "publication");
  }
  const text = fs.readFileSync("src/content/cases/customer-support-ai-dx.md", "utf8");
  assert(text.includes("企画部門から"));
  assert(text.includes("著者自身が企画した事例ではありません"));
  assert(text.includes("月400時間から300時間以下"));
  assert(text.includes("750件のうち600件以上"));
  assert.equal(contentHistory("cases/customer-support-ai-dx", {}).at(-1).date, "2026-10-10");
});

test("planning publication and Career aspirations retain distinct histories", () => {
  assert.equal(contentHistory("planning", { published_at: planningPublishedAt })[0].date, "2026-10-10");
  const text = fs.readFileSync("src/content/career/overview.md", "utf8");
  const data = YAML.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const events = contentHistory("career/overview", data);
  assert.equal(events[0].date, "2026-09-23");
  assert.equal(events.at(-1).date, "2026-10-10");
  assert(events.at(-1).text.includes("今後深めたい"));
  const direction = text.split("## 今後深めたい領域")[1].split("\n## ")[0];
  assert(direction.includes("System Planning / Value Discovery / Business Requirementsを、今後深めたい専門領域として位置付けています"));
  assert(direction.includes("関わりたいと考えています"));
  assert(!/未経験|実績がない|Caseがない|実務Caseはありません|十分な経験がない/.test(text));
});
