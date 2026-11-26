import { primaryDomain, domainAssignments } from "../src/data/knowledge-domains.mjs";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import YAML from "yaml";
import { recentGrowth, validateRecordedRevisionDates } from "../src/data/recent-growth.ts";
import { checkWorkingRevisionDates } from "./revision-date-check.mjs";

const root = "src/content";
const report = fs.readFileSync("docs/content-modernization-report.md", "utf8");
const files = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name.endsWith(".md")) files.push(full.replaceAll("\\", "/"));
  }
};
walk(root);
checkWorkingRevisionDates(files);

const parse = (file) => {
  const text = fs
    .readFileSync(file, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `Missing front matter: ${file}`);
  return { data: YAML.parse(match[1]), body: text.slice(match[0].length) };
};

const titles = new Map();
const publicEntries = [];
const contentDates = new Map();
for (const file of files) {
  const { data, body } = parse(file);
  contentDates.set(file.replace(/^src\/content\//, "").replace(/\.md$/, ""), data);
  assert.ok(data.title?.trim(), `Missing title: ${file}`);
  assert.ok(data.summary?.trim(), `Missing summary: ${file}`);
  assert.notEqual(
    data.status,
    "evolving",
    `Deprecated evolving status: ${file}`,
  );
  assert.match(
    String(data.last_updated),
    /^\d{4}-\d{2}-\d{2}$/,
    `Invalid last_updated: ${file}`,
  );
  assert.ok(
    !/^last_updated:/m.test(body),
    `last_updated must remain in front matter: ${file}`,
  );
  if (data.updated_at != null)
    assert.match(
      String(data.updated_at),
      /^\d{4}-\d{2}-\d{2}/,
      `Invalid updated_at: ${file}`,
    );

  const duplicate = titles.get(data.title);
  assert.ok(
    !duplicate,
    `Duplicate title: ${data.title} (${duplicate}, ${file})`,
  );
  titles.set(data.title, file);
  assert.ok(report.includes(`\`${file}\``), `Audit decision missing: ${file}`);

  if (data.public !== false) {
    publicEntries.push({ file, data, body });
    const legacy = body.match(
      /このWiki|Wiki全体|公開Wiki|100[〜～-]600章|本アカウント|Zenn/,
    );
    assert.ok(
      data.lifecycle === "retired" || !legacy,
      `Legacy publication wording '${legacy?.[0]}' remains in ${file}`,
    );
  }
}

validateRecordedRevisionDates(recentGrowth, contentDates);

const canonicalReferences = publicEntries.filter(
  ({ file, data }) =>
    data.layer === "reference" && file.startsWith("src/content/reference/"),
);
const canonicalPractices = publicEntries.filter(
  ({ data }) => data.layer === "practice",
);
const entryPointEntries = publicEntries.filter(
  ({ file, data }) => !file.includes("/career/") && data.layer !== "reference",
);
const entryPointsOf = ({ data }) => data.entry_points ?? ["ai"];
const aiOnly = entryPointEntries.filter(({ data }) => {
  const entryPoints = data.entry_points ?? ["ai"];
  return entryPoints.length === 1 && entryPoints[0] === "ai";
});
const dxOnly = entryPointEntries.filter(({ data }) => {
  const entryPoints = data.entry_points ?? ["ai"];
  return entryPoints.length === 1 && entryPoints[0] === "dx";
});
const aiAndDx = entryPointEntries.filter(
  (entry) =>
    entryPointsOf(entry).includes("ai") && entryPointsOf(entry).includes("dx"),
);
for (const entry of aiAndDx)
  assert.ok(
    entry.data.primaryCategory,
    `DX topic missing: ${entry.file}`,
  );
for (const entry of publicEntries.filter((entry) => entryPointsOf(entry).includes("dx"))) {
  assert(entry.data.primaryCategory, `DX primary category missing: ${entry.file}`);
  const secondary = entry.data.secondaryCategories ?? [];
  assert.equal(new Set(secondary).size, secondary.length, `Duplicate secondary categories: ${entry.file}`);
  assert(!secondary.includes(entry.data.primaryCategory), `Primary repeated as secondary: ${entry.file}`);
  assert(!entry.data.dx_topic && !entry.data.dx_topics, `Legacy DX classification remains: ${entry.file}`);
}
for (const id of [
  "foundations/conditional-probability.md",
  "foundations/temperature-design.md",
  "knowledge-context/prompt-structure.md",
  "evaluation-hitl/datasets-and-regression.md",
  "architecture/agents-tools-and-workflows.md",
]) {
  const entry = entryPointEntries.find(({ file }) => file.endsWith(id));
  assert.ok(
    entry && !entryPointsOf(entry).includes("dx"),
    `Technical AI content must not be classified as DX: ${id}`,
  );
}
assert.ok(
  canonicalReferences.length >= 4,
  "Reference needs glossary, mathematics, metrics and responsibility state",
);
assert.ok(
  canonicalPractices.length >= 3,
  "Practices needs adoption, education and transfer; development workflow belongs to AI Design",
);
assert.ok(publicEntries.some(({ file, data }) => file.endsWith("software-engineering/development-workflow.md") && data.layer === "ai-design" && data.design_topic === "software-engineering"), "Development workflow must remain discoverable in AI Design");
assert.equal(aiOnly.length, 80, "Approved thirteen math publications join existing AI entries; investigation Book ownership remains cases");
assert.equal(
  dxOnly.length,
  1,
  "Legacy lifecycle essay has a DX entry point; AI case links remain discovery paths",
);
assert.equal(aiAndDx.length, 56, "AI + DX content retains both PoC chapters; the removed pre-production chapter is a redirect");
assert.equal(files.length, 145, "Audited content includes five phase-two and four phase-three approved release candidates; existing articles and lifecycle decisions remain unchanged");
for (const id of ["what-is-ai", "cognitive-surrender"]) {
  assert(!fs.existsSync(`${root}/essays/${id}.md`), `Rejected manuscript must stay removed: ${id}`);
}

console.log(
  `Verified content health: ${files.length} audited Markdown pages, ${publicEntries.length} public pages, ${canonicalReferences.length} canonical references, ${canonicalPractices.length} canonical practices; entry points AI-only=${aiOnly.length}, DX-only=${dxOnly.length}, AI+DX=${aiAndDx.length}.`,
);

// Main domains are separate from legacy entry_points and DX subthemes.
for(const file of files){
 const {data}=parse(file); const id=file.replace(/^src\/content\//, "").replace(/\.md$/, "");
 const owner=primaryDomain({id,data});
 assert(["ai","dx","planning","system-design","cases","career","reference"].includes(owner),id);
 if(domainAssignments[id])assert(domainAssignments[id].reason.length>15,id+": classification rationale");
 if(data.public!==false && data.status!=="draft" && (data.lifecycle??"active")==="active" && owner==="ai")assert(["foundations/conditional-probability","foundations/temperature-design","foundations/hallucination-mechanisms","foundations/language-model-loss","foundations/attention-information-flow","foundations/test-time-compute-allocation","foundations/attention-efficiency","foundations/policy-gradient-learning","foundations/preference-learning-dpo","foundations/verifiable-reward-reasoning","foundations/compute-optimal-scaling","foundations/speculative-decoding","foundations/in-context-learning","foundations/mixture-of-experts","foundations/state-space-sequence-models","foundations/diffusion-language-models"].includes(id),id+": core AI scope requires body review");
}
console.log("Verified explicit primary domains for all manuscripts; legacy metadata does not determine ownership.");
