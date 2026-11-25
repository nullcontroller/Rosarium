import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import YAML from "yaml";
const hook = registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !path.extname(specifier)) return nextResolve(specifier + ".ts", context);
  return nextResolve(specifier, context);
} });
const { contentType, contentDisplayCategory, caseStudies } = await import("../src/lib/navigation.ts");
const { contentUseCaseIds } = await import("../src/lib/use-cases.ts");
hook.deregister();
const entry = (id, data = {}) => ({ id, data: { kind: "guide", layer: "publication", section: "foundations", tags: [], ...data } });
test("explicit case registries distinguish real work from design studies without inferring from kind", () => {
  for (const study of caseStudies) {
    assert.equal(contentType(entry(study.book)), "実務事例");
    assert.equal(contentType(entry(study.book + "/chapter")), "実務事例");
  }
  assert.equal(contentType(entry("cases/design-studies/qualification-testing", { kind: "case" })), "仮想設計");
  assert.equal(contentType(entry("cases/not-confirmed", { kind: "case", section: "cases" })), "事例");
  assert.equal(contentType(entry("cases/customer-support-ai-dx-other", { kind: "case" })), "事例");
});
test("subject labels are independent of DX placement and distinguish essays", () => {
  assert.equal(contentDisplayCategory(entry("evaluation-hitl/qa-evaluation", { layer: "ai-design", design_topic: "evaluation-hitl", primaryCategory: "continuous-value" })), "システム設計");
  assert.equal(contentDisplayCategory(entry("essay", { kind: "essay", primaryCategory: "value-design" })), "論考");
  assert.equal(contentDisplayCategory(entry("cases/design-studies/qualification-testing", { primaryCategory: "continuous-value" })), "仮想設計");
});
test("canonical AI tag spellings retain reader-purpose extraction", () => {
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  for (const file of walk("src/content").filter(file => file.endsWith(".md"))) {
    const source = fs.readFileSync(file, "utf8");
    const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    assert(!data.tags?.some(tag => ["生成ai", "ai活用"].includes(tag)), file);
    const id = path.relative("src/content", file).replaceAll("\\", "/").replace(/\.md$/, "");
    const before = entry(id, { ...data, tags: (data.tags ?? []).map(tag => tag === "生成AI" ? "生成ai" : tag === "AI活用" ? "ai活用" : tag) });
    assert.deepEqual(contentUseCaseIds(entry(id, data)), contentUseCaseIds(before), file);
  }
});
