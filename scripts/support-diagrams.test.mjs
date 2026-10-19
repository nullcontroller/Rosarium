import test from "node:test";
import assert from "node:assert/strict";
import { caseDiagrams } from "../src/data/case-diagrams.ts";

const support = Object.entries(caseDiagrams).filter(([id]) => id.startsWith("support-"));

test("overview separates search eligibility from item-level answer authorization", () => {
  const model = caseDiagrams["support-overview"];
  const search = model.nodes.find(node => node.id === "search");
  const decision = model.nodes.find(node => node.id === "decision");
  assert(search.description.includes("判定A"));
  for (const field of ["対象機種", "利用環境", "対応版数"]) assert(search.description.includes(field));
  assert(decision.description.includes("判定B"));
  for (const field of ["自動回答可否", "適用条件", "専門判断条件"]) assert(decision.description.includes(field));
  const order = model.explanation.panels[0].nodeIds;
  assert(order.indexOf("search") < order.indexOf("answer"));
  assert(order.indexOf("answer") < order.indexOf("decision"));
  const stop = caseDiagrams["support-stopping-conditions"].explanation.checks;
  assert(stop[1].question.includes("判定A"));
  assert(stop[2].question.includes("判定B") && stop[2].question.includes("許可"));
});
test("support explanations separate comparison, functional selection, responsibility and conditional stopping", () => {
  assert.equal(caseDiagrams["support-executive-summary"].explanation.format, "comparison");
  assert.equal(caseDiagrams["support-executive-summary"].explanation.panels.length, 2);
  assert.equal(caseDiagrams["support-why-ai"].explanation.format, "table");
  assert.equal(caseDiagrams["support-responsibility-boundary"].explanation.format, "table");
  const stopping = caseDiagrams["support-stopping-conditions"].explanation;
  assert.equal(stopping.checks.length, 3);
  for (const check of stopping.checks) {
    assert(check.yes && check.no);
    assert(/担当者/.test(check.no));
  }
  const search = caseDiagrams["support-knowledge-design"].explanation.panels[0].nodeIds;
  assert(search.indexOf("filter") < search.indexOf("retrieve"));
  assert(search.indexOf("retrieve") < search.indexOf("evidence"));
});

test("support explanations stay Japanese, static and distinguish design from public production results", () => {
  assert.equal(support.length, 10);
  for (const [id, model] of support) {
    assert(model.title && model.description && model.explanation.note && model.explanation.scope, id);
    assert(!model.edges?.length && !model.messages?.length, `${id}: no overloaded SVG edges`);
    const text = [model.title, model.description, ...model.nodes.flatMap(n => [n.label, n.description]), ...model.explanation.records?.flat() ?? []].join(" ");
    assert(!/Before|After|Collecting|Retrieving|Answering|Find Failure|Business Acceptance|次の工程：/.test(text), id);
    if (id === "support-poc-evaluation") {
      assert(text.includes("検索適合率72％") && text.includes("有人振り分け率94％"));
      assert(!/目標を達成|98[%％]|96[%％]|720件/.test(text));
    } else assert(!/72[%％]|96[%％]|720件/.test(text), `${id}: no unrelated evaluation values`);
    const ids = new Set(model.nodes.map(node => node.id));
    assert.equal(ids.size, model.nodes.length);
    for (const panel of model.explanation.panels ?? []) {
      assert(panel.nodeIds.every(nodeId => ids.has(nodeId)), id);
      for (const branch of panel.branches ?? []) {
        assert.equal(branch.from, panel.nodeIds.at(-1), `${id}: branch starts at the decision`);
        assert(branch.nodeIds.every(nodeId => ids.has(nodeId)), id);
      }
    }
  }
});

test("removed validation-stage comparison is no longer registered", () => {
  assert.equal(caseDiagrams["support-validation-stages"], undefined);
  assert(caseDiagrams["support-poc-checks"] && caseDiagrams["support-poc-evaluation"]);
});

test("comparison forks from one decision into automatic reply and continued human investigation", () => {
  const [before, after] = caseDiagrams["support-executive-summary"].explanation.panels;
  assert(!before.branches, "before and after must not share processing edges");
  assert.deepEqual(after.branches.map(branch => branch.from), ["after-judge", "after-judge"]);
  assert.deepEqual(after.branches.map(branch => branch.condition), ["回答可能", "自動回答できない・専門判断が必要"]);
  assert.deepEqual(after.branches.map(branch => branch.nodeIds), [
    ["after-answer"], ["after-handoff", "after-investigate", "after-human-answer"],
  ]);
  const handoff = caseDiagrams["support-human-handoff"].explanation.panels[0].nodeIds;
  assert(handoff.indexOf("transfer") < handoff.indexOf("resume"));
  assert(handoff.indexOf("resume") < handoff.indexOf("reply"));
});
