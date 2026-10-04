import test from "node:test";
import assert from "node:assert/strict";
import { activeEntry, publicEntry, publishedEntry } from "../src/lib/site.ts";
import { parseSearchLifecycles, lifecycleSearchOptions } from "../src/lib/search-lifecycle.ts";

test("search lifecycle defaults, URL state and OR filters preserve explicit retirement opt-in", () => {
  assert.deepEqual(parseSearchLifecycles(null), ["active", "obsolete"]);
  assert.deepEqual(parseSearchLifecycles(""), []);
  assert.deepEqual(parseSearchLifecycles("retired,invalid,retired"), ["retired"]);
  for (const selected of [["active"], ["obsolete"], ["retired"], ["active", "obsolete"], ["active", "obsolete", "retired"]]) {
    assert.deepEqual(lifecycleSearchOptions(selected), { filters: { lifecycle: { any: selected } } });
  }
});

test("retired records remain routable but are excluded from normal discovery", () => {
  for (const lifecycle of ["active", "obsolete", "retired"]) {
    const entry = { data: { status: "archived", public: true, lifecycle } };
    assert.equal(publishedEntry(entry), true);
    assert.equal(publicEntry(entry), lifecycle !== "retired");
  }
});
test("lifecycle never makes drafts or explicitly private content public", () => {
  for (const lifecycle of ["active", "obsolete", "retired"]) {
    for (const data of [{ status: "draft", public: true, lifecycle }, { status: "published", public: false, lifecycle }]) {
      assert.equal(publishedEntry({ data }), false);
      assert.equal(publicEntry({ data }), false);
    }
  }
  assert.equal(publicEntry({ data: { status: "published" } }), true);
});


test("ordinary indexes show only active metadata while history URLs remain published", () => {
  for (const lifecycle of ["active", "obsolete", "retired"]) {
    const entry = { data: { status: "published", public: true, lifecycle } };
    assert.equal(activeEntry(entry), lifecycle === "active");
    assert.equal(publishedEntry(entry), true);
  }
});


test("archive categories follow metadata rather than titles and omit individual book chapters", async () => {
  const { getArchiveCategory, isArchiveEntry } = await import("../src/lib/archive.ts");
  const entry = (data) => ({ data: { title: "DX AI Case", entry_points: [], lifecycle: "obsolete", ...data } });
  assert.equal(getArchiveCategory(entry({ section: "cases", primaryCategory: "system-transformation" })), "実践事例");
  assert.equal(getArchiveCategory(entry({ section: "essays", entry_points: ["ai"] })), "考察");
  assert.equal(getArchiveCategory(entry({ primaryCategory: "value-design" })), "DX");
  assert.equal(getArchiveCategory(entry({ layer: "ai-design" })), "AI");
  assert.equal(getArchiveCategory(entry({})), "その他");
  assert.equal(isArchiveEntry(entry({ lifecycle: "active" })), false);
  assert.equal(isArchiveEntry(entry({ lifecycle: "retired" })), true);
  assert.equal(isArchiveEntry(entry({ source: { chapter_slug: "chapter" } })), false);
});
