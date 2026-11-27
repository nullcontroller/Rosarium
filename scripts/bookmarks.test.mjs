import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import {
  LIMITS,
  parseBookmarks,
  bookmarkForRecord,
  identityKey,
  resolveBookmark,
} from "../src/lib/bookmarks.mjs";
import {
  buildBookmarkCatalog,
  isBookmarkable,
} from "../src/lib/bookmark-catalog.mjs";
import { identityViolations, identityForFile } from "./verify-content-ids.mjs";
const item = (id = "foundations/conditional-probability", extra = {}) => ({
  collection: "pages",
  id,
  addedAt: "2026-11-27T00:00:00Z",
  ...extra,
});
const documentFor = (items) => ({ schemaVersion: 1, site: "rosarium", items });
const text = (items) => JSON.stringify(documentFor(items));
const entry = (
  id = "foundations/conditional-probability",
  data = {},
  collection = "pages",
) => ({
  id,
  collection,
  data: {
    title: "現在のタイトル",
    section: "foundations",
    layer: "ai-mathematics",
    status: "published",
    public: true,
    lifecycle: "active",
    ...data,
  },
});
test("new eligibility is state-driven and excludes private, historical, Career and compatibility indexes", () => {
  assert(isBookmarkable(entry()));
  for (const data of [
    { public: false },
    { status: "draft" },
    { status: "archived" },
    { lifecycle: "retired" },
    { lifecycle: "obsolete" },
  ])
    assert(!isBookmarkable(entry(undefined, data)));
  assert(!isBookmarkable(entry("overview", { layer: "career" }, "career")));
  assert(
    !isBookmarkable(
      entry("cases/design-studies", { section: "cases", layer: "case" }),
    ),
  );
});
test("production catalogue dynamically covers every eligible collection item and omits private data", () => {
  const files = fs
    .readdirSync("src/content", { recursive: true })
    .filter(
      (f) =>
        f.endsWith(".md") && !f.replaceAll("\\", "/").startsWith("career/"),
    );
  const entries = files.map((file) => ({
    collection: "pages",
    id: file.replaceAll("\\", "/").replace(/\.md$/, ""),
    data: YAML.parse(
      fs
        .readFileSync("src/content/" + file, "utf8")
        .match(/^---\r?\n([\s\S]*?)\r?\n---/)[1],
    ),
  }));
  const c = buildBookmarkCatalog(entries);
  const expected = entries
    .filter((entry) => isBookmarkable(entry))
    .map((e) => e.id)
    .sort();
  assert.deepEqual(
    c.records
      .filter((r) => r.canAdd)
      .map((r) => r.id)
      .sort(),
    expected,
  );
  assert.equal(new Set(c.records.map(identityKey)).size, c.records.length);
  for (const e of entries.filter(
    (e) => e.data.public === false || e.data.status === "draft",
  ))
    assert(!JSON.stringify(c).includes(e.id));
});
test("catalogue distinguishes registered successors, readable retired items, index consolidation and missing items", () => {
  const originals = [
    entry(),
    entry("foundations/llm-as-probabilistic-model", { lifecycle: "retired" }),
    entry("cases/design-studies", { section: "cases", layer: "case" }),
    entry("cases/customer-support-ai-dx", { section: "cases", layer: "case" }),
  ];
  const c = buildBookmarkCatalog(originals);
  assert.equal(
    resolveBookmark(item("foundations/llm-as-probabilistic-model"), c).state,
    "退役記事",
  );
  assert.equal(resolveBookmark(item("cases/design-studies"), c).url, null);
  assert.equal(
    resolveBookmark(
      item("cases/customer-support-ai-dx/continuous-improvement"),
      c,
    ).url,
    null,
  );
  const target = entry("software-engineering/development-workflow", {
    section: "software-engineering",
    layer: "ai-design",
  });
  const integrated = buildBookmarkCatalog([target]);
  const saved = item("software-engineering/code-generation-boundaries");
  assert.equal(
    resolveBookmark(saved, integrated).url,
    "/software-engineering/development-workflow/",
  );
  assert.equal(saved.id, "software-engineering/code-generation-boundaries");
  assert.equal(
    resolveBookmark(item("unknown/article"), c).state,
    "現在利用できない",
  );
});
test("title and category are resolved fresh without rewriting stored identity", () => {
  const saved = item(undefined, { titleSnapshot: "以前のタイトル" }),
    c = buildBookmarkCatalog([entry()]);
  c.records[0].title = "改題後";
  c.records[0].category = "dx";
  c.records[0].categoryLabel = "DX";
  const before = JSON.stringify(saved);
  const resolved = resolveBookmark(saved, c);
  assert.equal(resolved.title, "改題後");
  assert.equal(resolved.categoryLabel, "DX");
  assert.equal(JSON.stringify(saved), before);
});
test("Book cover and chapters remain distinct saved keys", () => {
  assert.notEqual(
    identityKey(item("cases/customer-support-ai-dx")),
    identityKey(item("cases/customer-support-ai-dx/why-ai")),
  );
  assert.notEqual(
    identityKey(item("overview")),
    identityKey(item("overview", { collection: "career" })),
  );
});
test("stored JSON preserves unresolved records and collapses only identical qualified IDs", () => {
  const parsed = parseBookmarks(
    text([
      item("unknown/one"),
      item("unknown/one"),
      item("unknown/one", { collection: "career" }),
    ]),
  );
  assert.equal(parsed.items.length, 2);
  assert.equal(parsed.items[0].id, "unknown/one");
});
test("malformed JSON, unknown schema/site, wrong types and extra keys are rejected", () => {
  for (const value of [
    "{",
    "null",
    "[]",
    JSON.stringify({ ...documentFor([]), schemaVersion: 2 }),
    JSON.stringify({ ...documentFor([]), site: "other" }),
    JSON.stringify({ ...documentFor([]), items: {} }),
    JSON.stringify({ ...documentFor([]), extra: 1 }),
    text([{ ...item(), id: 42 }]),
    text([{ ...item(), collection: "bad/namespace" }]),
    text([{ ...item(), id: "../outside" }]),
    text([{ ...item(), addedAt: "2026-02-31T00:00:00Z" }]),
  ])
    assert.throws(() => parseBookmarks(value));
});
test("stored JSON size, item count and string length are bounded before writes", () => {
  assert.throws(() => parseBookmarks(" ".repeat(LIMITS.bytes + 1)));
  assert.throws(() =>
    parseBookmarks(
      text(Array.from({ length: LIMITS.items + 1 }, () => item())),
    ),
  );
  assert.throws(() => parseBookmarks(text([item("x".repeat(LIMITS.id + 1))])));
  assert.throws(() =>
    parseBookmarks(
      text([item(undefined, { titleSnapshot: "x".repeat(LIMITS.title + 1) })]),
    ),
  );
});
test("unsafe or external URLs are rejected, snapshot HTML stays inert text", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "https://evil.example/a",
    "https://rosarium-tech.com.evil.example/a",
    "https://user:pass@rosarium-tech.com/a",
  ])
    assert.throws(() =>
      parseBookmarks(text([item(undefined, { urlSnapshot: url })])),
    );
  const parsed = parseBookmarks(
    text([
      item("unknown/html", { titleSnapshot: "<img src=x onerror=alert(1)>" }),
    ]),
  );
  assert.equal(resolveBookmark(parsed.items[0], { records: [] }).url, null);
});
test("new record keeps collection identity and validates snapshots before persistence", () => {
  const r = buildBookmarkCatalog([entry()]).records[0];
  const saved = bookmarkForRecord(r);
  assert.equal(saved.id, r.id);
  assert.equal(saved.collection, "pages");
  assert.throws(() => bookmarkForRecord({ ...r, canAdd: false }));
  assert.throws(() => bookmarkForRecord({ ...r, id: "../invalid" }));
});

test("ID guard rejects duplicate, case collision, published rename and retired ID reuse", () => {
  const old = { collection: "pages", id: "foundations/old" };
  assert(identityViolations([old, old]).some((s) => s.includes("重複")));
  assert(
    identityViolations([old, { ...old, id: "Foundations/old" }]).some((s) =>
      s.includes("衝突"),
    ),
  );
  assert(
    identityViolations([{ ...old, id: "foundations/new" }], [old]).some((s) =>
      s.includes("変更"),
    ),
  );
  assert(
    identityViolations([old], [], [old]).some((s) => s.includes("再利用")),
  );
  assert.deepEqual(identityViolations([old], [old]), []);
  assert.deepEqual(identityForFile("src/content/career/overview.md"), {
    collection: "career",
    id: "overview",
  });
});
