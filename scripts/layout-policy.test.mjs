import test from "node:test";
import assert from "node:assert/strict";
import { pageEntityType, readingSections, rightSidebarPolicy } from "../src/lib/layout-policy.mjs";
test("sidebar policy preserves chapter TOC, empty tabs and disabled-page behavior", () => {
  for (const showRightSidebar of [false, true]) for (const showReference of [false, true]) {
    for (const headingCount of [0, 1, 3]) for (const chapterCount of [0, 2]) {
      const hasPageToc = chapterCount > 0 || headingCount > 0;
      assert.deepEqual(rightSidebarPolicy({showRightSidebar, showReference, headingCount, chapterCount}), {
        hasPageToc, referenceSidebar: showRightSidebar && (hasPageToc || showReference),
      });
    }
  }
});
test("SEO page types retain article/profile precedence and legacy collection aliases", () => {
  for (const section of [undefined, "", "ai", "dx/value-design", "books", "series", "career", "retired"]) {
    assert.equal(pageEntityType({ogType:"article",section}),"TechArticle");
    assert.equal(pageEntityType({ogType:"profile",section}),"ProfilePage");
  }
  for (const section of ["ai", "dx/value-design", "books", "series", "reference"]) assert.equal(pageEntityType({ogType:"website",section}),"CollectionPage");
  for (const section of [undefined, "", "career", "retired"]) assert.equal(pageEntityType({ogType:"website",section}),"WebPage");
  assert.equal(readingSections.has("series"),true);
  assert.equal(readingSections.has("cases"),false);
});

test("archive grouping preserves category order, item order and input ownership", async () => {
  const { groupArchiveEntries } = await import("../src/lib/archive.ts");
  const entry = (id, data) => ({ id, data: { entry_points: [], ...data } });
  const entries = [entry("essay", { section: "essays" }), entry("case", { kind: "case" }), entry("ai-2", { layer: "ai-design" }), entry("dx", { primaryCategory: "value-design" }), entry("ai-1", { entry_points: ["ai"] }), entry("other", {})];
  const original = structuredClone(entries);
  const groups = groupArchiveEntries(entries);
  assert.deepEqual(groups.map(group => [group.category, group.entries.map(item => item.id)]), [["AI", ["ai-2", "ai-1"]], ["DX", ["dx"]], ["実践事例", ["case"]], ["考察", ["essay"]], ["その他", ["other"]]]);
  assert.deepEqual(entries, original);
  assert.equal(groups[0].entries[0], entries[2]);
  assert.deepEqual(groupArchiveEntries([]), []);
});
