import test from "node:test";
import assert from "node:assert/strict";
import { caseDiagrams } from "../src/data/case-diagrams.ts";

const support = Object.entries(caseDiagrams).filter(([id]) => id.startsWith("support-"));
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
  assert.equal(support.length, 11);
  for (const [id, model] of support) {
    assert(model.title && model.description && model.explanation.note && model.explanation.scope, id);
    assert(!model.edges?.length && !model.messages?.length, `${id}: no overloaded SVG edges`);
    const text = [model.title, model.description, ...model.nodes.flatMap(n => [n.label, n.description]), ...model.explanation.records?.flat() ?? []].join(" ");
    assert(!/Before|After|Collecting|Retrieving|Answering|Find Failure|Business Acceptance|次の工程：/.test(text), id);
    assert(!/72[%％]|96[%％]|720件/.test(text), `${id}: no essay numbers presented as diagram outcomes`);
    const ids = new Set(model.nodes.map(node => node.id));
    assert.equal(ids.size, model.nodes.length);
    for (const panel of model.explanation.panels ?? []) {
      assert(panel.nodeIds.every(nodeId => ids.has(nodeId)), id);
    }
  }
});
