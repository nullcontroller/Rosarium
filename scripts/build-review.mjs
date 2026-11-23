import fs from "node:fs";
import { spawnSync } from "node:child_process";
import YAML from "yaml";
const ids = process.argv.slice(2);
if (!ids.length) throw new Error("Usage: node scripts/build-review.mjs essays/draft-id [...]");
for (const id of ids) {
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/.test(id)) throw new Error("Invalid content ID");
  const source = fs.readFileSync(`src/content/${id}.md`, "utf8").replace(/^\uFEFF/, "");
  const data = YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  if (data.status !== "draft" || data.public !== false) throw new Error("Only nonpublic drafts may be selected: " + id);
}
if (!fs.existsSync("dist/pagefind/pagefind.js")) throw new Error("Run npm run build first: review search reuses the production-only index.");
const env = { ...process.env, ROSARIUM_DRAFT_PREVIEW: ids.join(",") };
const result = spawnSync(process.execPath, ["node_modules/astro/bin/astro.mjs", "build"], { env, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Never index review HTML: reuse only the normal build's public search bundle.
fs.cpSync("dist/pagefind", "dist-review/pagefind", { recursive: true });
