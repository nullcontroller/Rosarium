import test from "node:test";
import assert from "node:assert/strict";
import { groupPersonalCases } from "../src/data/personal-case-groups.mjs";

test("unpublished group member does not add an empty group or reveal its title", () => {
  const existing = { id: "cases/ai-development-management" };
  assert.deepEqual(groupPersonalCases([existing]), { groups: [], independent: [existing] });
});
test("visible members form one ordered group without duplicate or chapter entries", () => {
  const existing = { id: "cases/ai-development-management" };
  const book = { id: "cases/asset-management-app-a-architecture" };
  const other = { id: "cases/future-personal" };
  const result = groupPersonalCases([book, other, existing]);
  assert.equal(result.groups.length, 1);
  assert.deepEqual(result.groups[0].entries, [existing, book]);
  assert.deepEqual(result.independent, [other]);
});
