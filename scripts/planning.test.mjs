import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { isPlanningKnowledge, planningPublishedAt, planningQuestions } from "../src/lib/planning.ts";
import { contentHistory } from "../src/data/content-history.ts";
const entry = (tags, extra = {}) => ({ data: { tags, kind: "essay", section: "essays", ...extra } });
test("planning retains its entry and legacy anchor without the boundary explanation", () => {
  const planning = fs.readFileSync("src/pages/planning.astro", "utf8");
  assert(!planning.includes('aria-labelledby="handoff"'));
  assert(!planning.includes('slug: "handoff"'));
  assert(!planning.includes("IPAの区分"));
  assert(planning.includes('id="handoff" aria-hidden="true"'));
  assert(planning.includes('id="scope"'));
  assert(!planningQuestions.some(question => question.title === "要件定義への引渡し"));
  for (const file of ["src/content/career/overview.md", "src/content/cases/customer-support-ai-dx.md"]) {
    assert(!fs.readFileSync(file, "utf8").includes("/planning/#handoff"));
  }
});
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
  const introduction = fs.readFileSync("src/content/cases/customer-support-ai-dx/executive-summary.md", "utf8");
  const requirements = fs.readFileSync("src/content/cases/customer-support-ai-dx/why-ai.md", "utf8");
  assert(introduction.includes("企画部門から業務改善の提案を受け"));
  assert(introduction.includes("システムアーキテクトとして"));
  assert(requirements.includes("月400時間から300時間以下"));
  assert(requirements.includes("750件／月のうち600件／月以上"));
  assert(contentHistory("cases/customer-support-ai-dx", {}).some(event => event.date === "2026-10-12"));
  assert.equal(contentHistory("cases/customer-support-ai-dx", {}).at(-1).date, "2026-10-19");
});

test("planning publication and Career aspirations retain distinct histories", () => {
  assert.equal(contentHistory("planning", { published_at: planningPublishedAt })[0].date, "2026-10-10");
  const text = fs.readFileSync("src/content/career/overview.md", "utf8");
  const data = YAML.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const events = contentHistory("career/overview", data);
  assert.equal(events[0].date, "2026-09-23");
  assert(events.some(event => event.date === "2026-10-12"));
  assert.equal(events.at(-1).date, "2026-10-19");
  assert(events.some(event => event.text?.includes("今後深めたい")));
  const direction = text.split("## 今後広げたい判断領域")[1]?.split("\n## ")[0];
  assert(direction, "Career must have a forward-looking planning direction");
  assert.match(direction, /現在は.*業務要求/);
  assert.match(direction, /今後は.*システム企画・IT戦略/);
  assert.match(direction, /業務要求・業務目標・KPI/);
  assert.match(direction, /企画判断の実績を主張するものではありません/);
  assert(!/未経験|実績がない|Caseがない|実務Caseはありません|十分な経験がない/.test(text));
});
