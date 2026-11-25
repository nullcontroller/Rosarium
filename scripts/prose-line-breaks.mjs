import { unified } from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import math from "remark-math";
import directive from "remark-directive";
const parser = unified().use(parse).use(gfm).use(math).use(directive);

// A series contents list pairs a linked title with its subtitle; this is metadata,
// not a sentence-by-sentence paragraph layout. Quotes and formatted blocks retain lines.
function protectedBreak(node, parents) {
  if (parents.some(parent => ["blockquote", "table", "tableCell", "code", "inlineCode", "math", "inlineMath"].includes(parent.type))) return true;
  const paragraph = parents.at(-1);
  return parents.some(parent => parent.type === "listItem") && paragraph?.type === "paragraph" &&
    paragraph.children.length === 3 && paragraph.children[0].type === "link" &&
    paragraph.children[1] === node && paragraph.children[2].type === "text";
}
export function proseLineBreaks(source) {
  const tree = parser.parse(source), unnecessary = [], retained = [];
  function visit(node, parents = []) {
    if (node.type === "break") (protectedBreak(node, parents) ? retained : unnecessary).push({
      start: node.position.start.offset, end: node.position.end.offset, line: node.position.start.line,
      reason: protectedBreak(node, parents) ? "quote/table/formatted text or title-subtitle metadata" : "ordinary paragraph",
    });
    for (const child of node.children ?? []) visit(child, [...parents, node]);
  }
  visit(tree);
  return { unnecessary, retained };
}
export function naturalProseLines(source) {
  const { unnecessary } = proseLineBreaks(source);
  for (const range of unnecessary.toReversed()) source = source.slice(0, range.start) + "\n" + source.slice(range.end);
  return source;
}
