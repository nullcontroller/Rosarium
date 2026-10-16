import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { load } from "cheerio";
import directive from "remark-directive";
import { semanticDirectives } from "../src/lib/markdown.mjs";

test("Career emphasis renders without literal Markdown delimiters", async () => {
  const source = await readFile(new URL("../src/content/career/overview.md", import.meta.url), "utf8");
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const processor = await createMarkdownProcessor({ remarkPlugins: [directive, semanticDirectives] });
  const { code } = await processor.render(body);
  const $ = load(code);
  assert.equal($("strong").filter((_, node) => $(node).text() === "技術専門職").length, 1);
  assert.match(code, /<strong>技術専門職<\/strong>（Individual Contributor）/);
  assert.equal($.text().includes("**"), false);
  assert.equal($("strong a[href*='linkedin.com']").length, 1);
});
