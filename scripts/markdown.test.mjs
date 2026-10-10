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
    "[読書](/foundations/)\n\n<figure class=\"diagram-static\"><img src=\"/diagrams/static/example.svg\" alt=\"流れ\" /></figure>\n\n| A | B |\n|---|---|\n| C | D |",
  );
  assert.match(code, /href="\/foundations\/"/);
  assert.match(code, /class="diagram-static"/);
  assert.match(code, /src="\/diagrams\/static\/example.svg"/);
  assert.match(code, /<table>/);
});

test("root deployment normalizes legacy local paths without altering external repositories", async () => {
  const p = await createMarkdownProcessor({ rehypePlugins: [localUrls] });
  const { code } = await p.render('[現在](/about/) [旧](/Rosarium/ai/) [旧正本](https://nullcontroller.github.io/Rosarium/dx/) [資料](https://github.com/nullcontroller/Rosarium/wiki)');
  assert.match(code, /href="\/about\/"/);
  assert.match(code, /href="\/ai\/"/);
  assert.match(code, /href="https:\/\/rosarium-tech\.com\/dx\/"/);
  assert.match(code, /href="https:\/\/github\.com\/nullcontroller\/Rosarium\/wiki"/);
});
