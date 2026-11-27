import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { Script } from "node:vm";

// Generated routes are an eligibility list, not a precache list.
export function pwaBuild() {
  return { name: "rosarium-pwa", hooks: { "astro:build:done": async ({ dir }) => {
    const root = fileURLToPath(dir);
    const review = Boolean(process.env.ROSARIUM_DRAFT_PREVIEW);
    if (review) await fs.writeFile(path.join(root, "robots.txt"), "User-agent: *\nDisallow: /\n");
    const paths = [];
    const hash = createHash("sha256");
    async function walk(folder) {
      for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) { await walk(file); continue; }
        const relative = path.relative(root, file).replaceAll("\\", "/");
        const bytes = await fs.readFile(file);
        hash.update(relative).update(bytes);
        if (!relative.endsWith(".html")) continue;
        const html = bytes.toString();
        // Review builds may contain explicitly selected private drafts: only
        // ordinary-build public routes are eligible for offline caching there.
        const publicHtml = review
          ? await fs.readFile(path.join("dist", relative), "utf8").catch(() => "")
          : html;
        if (!/<html\b/i.test(publicHtml) || /name="robots"[^>]*content="[^"]*noindex/i.test(publicHtml)) continue;
        paths.push("/" + relative.replace(/index\.html$/, ""));
      }
    }
    await walk(root);
    const template = await fs.readFile("src/pwa/worker.js", "utf8");
    hash.update(template);
    const config = { review, version: hash.digest("hex").slice(0, 16), paths };
    const worker = template.replace('/* PWA_CONFIG */ { review: false, version: "development", paths: [] }', JSON.stringify(config));
    new Script(worker); // Fail the build on an invalid generated worker.
    await fs.writeFile(path.join(root, "sw.js"), worker);
  } } };
}
