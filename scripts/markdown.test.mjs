import test from "node:test";
import assert from "node:assert/strict";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import directive from "remark-directive";
import {
  semanticDirectives,
  localUrls,
  labels,
} from "../src/lib/markdown.mjs";
test("seven semantic directives preserve body and escape attributes", async () => {
  const p = await createMarkdownProcessor({
    remarkPlugins: [directive, semanticDirectives],
  });
  for (const kind of Object.keys(labels)) {
    const { code } = await p.render(
      `:::${kind}{title="設計判断"}\n- AI：候補\n- 人間：判断\n:::\n`,
    );
    assert.match(code, new RegExp('data-kind="' + kind + '"'));
    assert.match(code, /<li>人間：判断<\/li>/);
  }
});
test("unsupported directive is rejected", async () => {
  const p = await createMarkdownProcessor({
    remarkPlugins: [directive, semanticDirectives],
  });
  await assert.rejects(() => p.render(":::unknown\ntext\n:::"));
});
test("Static SVG and base-path links survive Markdown processing", async () => {
  const p = await createMarkdownProcessor({
    rehypePlugins: [localUrls],
  });
  const { code } = await p.render(
    "[読書](/foundations/)\n\n<figure class=\"diagram-static\"><img src=\"/Rosarium/diagrams/static/example.svg\" alt=\"流れ\" /></figure>\n\n| A | B |\n|---|---|\n| C | D |",
  );
  assert.match(code, /href="\/Rosarium\/foundations\/"/);
  assert.match(code, /class="diagram-static"/);
  assert.match(code, /src="\/Rosarium\/diagrams\/static\/example.svg"/);
  assert.match(code, /<table>/);
});
