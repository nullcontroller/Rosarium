import test from "node:test";
import assert from "node:assert/strict";
import { publicEntry, publishedEntry } from "../src/lib/site.ts";

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
