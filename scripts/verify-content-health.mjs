import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import YAML from "yaml";

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
for (const file of files) {
  const { data, body } = parse(file);
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
  canonicalPractices.length >= 4,
  "Practices needs adoption, education, transfer and development workflow",
);
assert.equal(aiOnly.length, 54, "AI-only content includes four restored retired records");
assert.equal(
  dxOnly.length,
  1,
  "Legacy lifecycle essay has a DX entry point; AI case links remain discovery paths",
);
assert.equal(aiAndDx.length, 38, "AI + DX discovery content count changed");
assert.equal(files.length, 101, "All audited content must remain traceable");

console.log(
  `Verified content health: ${files.length} audited Markdown pages, ${publicEntries.length} public pages, ${canonicalReferences.length} canonical references, ${canonicalPractices.length} canonical practices; entry points AI-only=${aiOnly.length}, DX-only=${dxOnly.length}, AI+DX=${aiAndDx.length}.`,
);
