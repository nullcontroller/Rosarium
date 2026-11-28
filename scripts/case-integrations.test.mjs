import test from "node:test";
import assert from "node:assert/strict";
import { caseIntegrationPlans, integratedPersonalCases, integrationPreview } from "../src/data/case-integrations.mjs";
import { compatibilityDestination, compatibilityUrls } from "../src/data/compatibility-urls.mjs";
import { buildBookmarkCatalog } from "../src/lib/bookmark-catalog.mjs";
const plan = caseIntegrationPlans[0];
const entry = (id, extra = {}) => ({ collection: "pages", id, data: { title: id, status: "published", public: true, lifecycle: "active", section: "cases", kind: "case", case_context: "personal", ...extra } });

test("production keeps the source case until the replacement becomes visible", () => {
  const source = entry(plan.sourceId), other = entry("cases/another-personal");
  assert.deepEqual(integratedPersonalCases([source, other]), [source, other]);
  assert.equal(integrationPreview(plan.sourceId, new Set([plan.sourceId]), true), undefined);
  assert.deepEqual(compatibilityUrls.find(record => record.from === plan.compatibility.from), plan.compatibility);
});
test("review and future publication show a single integrated case without an intermediate group", () => {
  const source = entry(plan.sourceId), book = entry(plan.bookId), other = entry("cases/another-personal");
  assert.deepEqual(integratedPersonalCases([source, book, other]), [book, other]);
  const visible = new Set([plan.bookId, plan.successorId]);
  assert.equal(integrationPreview(plan.sourceId, visible, false), undefined);
  assert.equal(integrationPreview(plan.sourceId, visible, true), plan);
});
test("planned compatibility keeps query values and maps known and unknown fragments without chaining", () => {
  const known = Object.keys(plan.compatibility.fragments)[0];
  const result = compatibilityDestination(plan.compatibility, new URL(`https://rosarium-tech.com${plan.compatibility.from}?analytics=off&x=1&x=2#${encodeURIComponent(known)}`));
  assert.equal(result.searchParams.get("analytics"), "off");
  assert.deepEqual(result.searchParams.getAll("x"), ["1", "2"]);
  assert(result.pathname.endsWith("/requirements/"));
  const unknown = compatibilityDestination(plan.compatibility, new URL(`https://rosarium-tech.com${plan.compatibility.from}#unknown`));
  assert.equal(unknown.pathname, `/${plan.successorId}/`);
  assert.equal(decodeURIComponent(unknown.hash), "#開発管理を委任する目的");
  assert(!compatibilityUrls.some(record => record.from === result.pathname || record.from === unknown.pathname));
});
test("a publication fixture resolves a legacy saved ID through the existing successor catalogue", () => {
  const savedIdentity = { collection: "pages", id: plan.sourceId };
  const source = entry(plan.sourceId, { lifecycle: "retired" });
  const successor = entry(plan.successorId);
  const records = buildBookmarkCatalog([source, successor]).records;
  const record = records.find(r => r.collection === savedIdentity.collection && r.id === savedIdentity.id);
  assert.equal(record.resolution, "integrated");
  assert.equal(record.lifecycle, "retired");
  assert.equal(record.canAdd, false);
  assert.equal(record.successor.id, plan.successorId);
  assert.equal(savedIdentity.id, plan.sourceId);
  const current = buildBookmarkCatalog([entry(plan.sourceId)], []).records.find(r => r.id === plan.sourceId);
  assert.equal(current.resolution, "direct");
  assert.equal(current.canAdd, true);
});
