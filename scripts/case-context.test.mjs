import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { caseContext, independentCases } from "../src/lib/case-context.mjs";
import { buildBookmarkCatalog, isBookmarkable } from "../src/lib/bookmark-catalog.mjs";
import { primaryDomain } from "../src/data/knowledge-domains.mjs";
import { isDraftPreview } from "../src/lib/draft-preview.mjs";
const fixture = (id, extra = {}) => ({ collection: "pages", id, data: { section: "cases", kind: "case", lifecycle: "active", status: "published", public: true, title: id, ...extra } });
const registry = [{ book: "cases/business" }];
test("case context uses explicit metadata and the existing business registry", () => {
  assert.equal(caseContext(fixture("cases/business"), registry), "business");
  assert.equal(caseContext(fixture("cases/business/chapter"), registry), "business");
  assert.equal(caseContext(fixture("cases/another", { case_context: "personal" }), registry), "personal");
  assert.equal(caseContext(fixture("cases/unknown"), registry), undefined);
  assert.equal(caseContext(fixture("essays/other", { section: "essays", case_context: "personal" }), registry), undefined);
});
test("new personal cases are found without names, and chapters are not duplicated", () => {
  const entries = [fixture("cases/second", { case_context: "personal", order: 2 }), fixture("cases/first", { case_context: "personal", order: 1 }), fixture("cases/book", { case_context: "personal", series: "personal", order: 0 }), fixture("cases/book/chapter", { case_context: "personal", series: "personal", order: 1 }), fixture("cases/business")];
  assert.deepEqual(independentCases(entries, "personal", registry).map(e => e.id), ["cases/book", "cases/first", "cases/second"]);
  assert.deepEqual(independentCases(entries, "business", registry), []);
});
const raw = fs.readFileSync("src/content/cases/ai-development-management.md", "utf8");
const article = { collection: "pages", id: "cases/ai-development-management", data: YAML.parse(raw.match(/^---\n([\s\S]*?)\n---/)[1]) };
const draft = { ...article, data: { ...article.data, public: false, status: "draft", published_at: null } };
test("a private draft fixture requires exact review selection and stays out of the public catalogue", () => {
  assert.equal(draft.data.public, false);
  assert.equal(draft.data.status, "draft");
  assert.equal(draft.data.published_at, null);
  assert.equal(isDraftPreview(draft, ""), false);
  assert.equal(isDraftPreview(draft, draft.id), true);
  assert.equal(isBookmarkable(draft), false);
  assert.equal(buildBookmarkCatalog([draft]).records.length, 0);
});
test("the approved published personal case resolves its existing ID through the bookmark catalogue", () => {
  const published = article;
  assert.equal(published.data.public, true);
  assert.equal(published.data.status, "published");
  assert.equal(primaryDomain(published), "cases");
  assert.equal(isBookmarkable(published), true);
  const record = buildBookmarkCatalog([published]).records.find(e => e.id === draft.id);
  assert.equal(record.url, `/${draft.id}/`);
  assert.equal(record.category, "cases");
  assert.equal(record.canAdd, true);
  assert.equal(record.title, draft.data.title);
});
