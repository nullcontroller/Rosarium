import { spawnSync } from "node:child_process";
import { readReviewTargets } from "./review-targets.mjs";
const result = spawnSync(process.execPath, ["node_modules/astro/bin/astro.mjs", "preview", "--host", "127.0.0.1", "--port", "4325", "--allowed-hosts", "nullcontroller.tail8bbb3b.ts.net", "--ignore-lock"], {
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1", ROSARIUM_DRAFT_PREVIEW: readReviewTargets().join(",") },
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
