import fs from "node:fs";
import { spawnSync } from "node:child_process";
import YAML from "yaml";
import { readReviewTargets, reviewTargetsPath } from "./review-targets.mjs";
const ids = readReviewTargets(process.argv.slice(2));
for (const id of ids) {
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/.test(id)) throw new Error("Invalid content ID");
  const source = fs.readFileSync(`src/content/${id}.md`, "utf8").replace(/^\uFEFF/, "");
  const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  if (!((data.status === "draft" && data.public === false) || (["published", "stable"].includes(data.status) && data.public !== false))) throw new Error("Invalid review target state: " + id);
}
if (!fs.existsSync("dist/pagefind/pagefind.js")) throw new Error("Run npm run build first: review search reuses the production-only index.");
const env = { ...process.env, ROSARIUM_DRAFT_PREVIEW: ids.join(",") };
const result = spawnSync(process.execPath, ["node_modules/astro/bin/astro.mjs", "build"], { env, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Review uses the same registered legacy URLs as an ordinary build.
const compatibility = spawnSync(process.execPath, ["scripts/generate-compatibility.mjs", "dist-review"], { stdio: "inherit" });
if (compatibility.error) throw compatibility.error;
if (compatibility.status !== 0) process.exit(compatibility.status ?? 1);

// Never index review HTML: reuse only the normal build's public search bundle.
fs.cpSync("dist/pagefind", "dist-review/pagefind", { recursive: true });
const verification = spawnSync(process.execPath, ["scripts/verify-review-targets.mjs", ...ids], { stdio: "inherit" });
if (verification.error) throw verification.error;
if (verification.status !== 0) process.exit(verification.status ?? 1);
fs.writeFileSync(reviewTargetsPath, JSON.stringify(ids, null, 2) + "\n");
console.log(`Review targets retained: ${ids.length} selected targets (published targets use normal visibility)`);
