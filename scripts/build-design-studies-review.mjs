import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import YAML from "yaml";
import { designStudies } from "../src/data/design-studies.mjs";

for (const study of designStudies) {
  const source = fs.readFileSync(`src/content/${study.id}.md`, "utf8");
  const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert(data.public === false && data.status === "draft", `Not a private draft: ${study.id}`);
}
assert(fs.existsSync("dist/pagefind/pagefind.js"), "Run npm run build first");
const result = spawnSync(process.execPath, [
  "node_modules/astro/bin/astro.mjs", "build", "--outDir", "./dist-design-review",
], {
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1", ROSARIUM_DRAFT_PREVIEW: designStudies.map(study => study.id).join(",") },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
// Reuse public-only search; do not index the review articles or touch dist-review.
fs.cpSync("dist/pagefind", "dist-design-review/pagefind", { recursive: true });
const verification = spawnSync(process.execPath, ["scripts/verify-design-studies-build.mjs"], { stdio: "inherit" });
if (verification.error) throw verification.error;
process.exit(verification.status ?? 1);
