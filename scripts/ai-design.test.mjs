import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import YAML from "yaml";
import { aiDesignAreas, aiDesignTopicGuides, orderedDesignEntries } from "../src/lib/ai-design.ts";

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const entries = walk("src/content").filter(file => file.endsWith(".md")).map(file => {
  const source = fs.readFileSync(file, "utf8");
  return { id: path.relative("src/content", file).replaceAll("\\", "/").replace(/\.md$/, ""), data: YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]) };
});
const active = (entry) => entry && entry.data.public !== false && entry.data.status === "published" && (!entry.data.lifecycle || entry.data.lifecycle === "active");

test("design map targets existing active explanations or existing collections", () => {
  assert.equal(new Set(aiDesignAreas.map(area => area.id)).size, aiDesignAreas.length);
  assert.equal(new Set(aiDesignAreas.map(area => area.path)).size, aiDesignAreas.length);
  for (const area of aiDesignAreas) {
    if (area.path.startsWith("ai-design/")) {
      assert(aiDesignTopicGuides[area.path.slice("ai-design/".length)], area.path);
    } else assert(active(entries.find(entry => entry.id === area.path)), area.path);
  }
});

test("category reading guides cover each active design article exactly once", () => {
  const covered = [];
  for (const [topic, guide] of Object.entries(aiDesignTopicGuides)) {
    const selected = orderedDesignEntries(entries.filter(active).reverse(), topic);
    assert.deepEqual(selected.map(entry => entry.id), [...guide.readingOrder], topic);
    covered.push(...guide.readingOrder);
    if (guide.next.path.startsWith("ai-design/")) assert(aiDesignTopicGuides[guide.next.path.slice("ai-design/".length)]);
    else assert(active(entries.find(entry => entry.id === guide.next.path)), guide.next.path);
  }
  assert.equal(new Set(covered).size, covered.length);
  assert.deepEqual(new Set(covered), new Set(entries.filter(entry => active(entry) && entry.data.layer === "ai-design").map(entry => entry.id)));
});

test("a missing or misclassified guide target fails instead of disappearing", () => {
  const id = "architecture/reference-architecture";
  assert.throws(() => orderedDesignEntries(entries.filter(entry => entry.id !== id), "architecture"), /missing or outside its category/);
  assert.throws(() => orderedDesignEntries(entries.map(entry => entry.id === id ? { ...entry, data: { ...entry.data, design_topic: "applicability" } } : entry), "architecture"), /missing or outside its category/);
});
