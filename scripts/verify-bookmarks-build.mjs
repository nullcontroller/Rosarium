import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
import YAML from "yaml";
import {
  buildBookmarkCatalog,
  isBookmarkable,
} from "../src/lib/bookmark-catalog.mjs";
const root = process.argv[2] ?? "dist";
const sourceFiles = fs
  .readdirSync("src/content", { recursive: true })
  .filter(
    (f) => f.endsWith(".md") && !f.replaceAll("\\", "/").startsWith("career/"),
  );
const entries = sourceFiles.map((f) => ({
  collection: "pages",
  id: f.replaceAll("\\", "/").replace(/\.md$/, ""),
  data: YAML.parse(
    fs
      .readFileSync(path.join("src/content", f), "utf8")
      .match(/^---\r?\n([\s\S]*?)\r?\n---/)[1],
  ),
}));
const actual = JSON.parse(fs.readFileSync(`${root}/bookmarks.json`, "utf8"));
const normalize = (value) =>
  JSON.parse(
    JSON.stringify({
      ...value,
      records: [...value.records].sort((a, b) => a.id.localeCompare(b.id)),
    }),
  );
assert.deepEqual(normalize(actual), normalize(buildBookmarkCatalog(entries)));
let eligible = 0,
  excluded = 0;
for (const entry of entries) {
  const file = `${root}/${entry.id}/index.html`;
  if (!fs.existsSync(file)) continue;
  const $ = load(fs.readFileSync(file, "utf8"));
  const toggle = $("[data-bookmark-toggle]");
  if (isBookmarkable(entry)) {
    assert.equal(toggle.length, 1, entry.id);
    assert.equal(toggle.attr("data-bookmark-id"), entry.id);
    assert.equal(toggle.attr("data-bookmark-collection"), "pages");
    eligible++;
  } else {
    assert.equal(toggle.length, 0, entry.id);
    excluded++;
  }
}
for (const route of ["", "career", "ai", "retired"]) {
  const $ = load(
    fs.readFileSync(`${root}/${route ? route + "/" : ""}index.html`, "utf8"),
  );
  assert.equal($("[data-bookmark-toggle]").length, 0, route);
  assert.equal($("#bookmark-panel").length, 1, route);
  assert.equal($("[data-bookmarks-open]").length, 2, route);
  assert.equal(
    $("#bookmark-panel").attr("aria-labelledby"),
    "bookmark-panel-title",
  );
}
for (const entry of entries.filter(
  (e) => e.data.public === false || e.data.status === "draft",
)) {
  assert(!JSON.stringify(actual).includes(entry.id));
  assert(!JSON.stringify(actual).includes(entry.data.title));
}
console.log(
  `Bookmark build audit: ${eligible} dynamic eligible article buttons; ${excluded} historical/compatibility exclusions; ${actual.records.length} public resolution records; catalogue matches Collections, private IDs/titles absent, header/panel and Career boundaries verified.`,
);
