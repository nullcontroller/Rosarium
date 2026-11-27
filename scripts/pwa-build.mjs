import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { Script } from "node:vm";
import { load } from "cheerio";

// Generated routes are an eligibility list, not a precache list.
export function pwaBuild() {
  return { name: "rosarium-pwa", hooks: { "astro:build:done": async ({ dir }) => {
    const root = fileURLToPath(dir);
    const review = Boolean(process.env.ROSARIUM_DRAFT_PREVIEW);
    if (review) await fs.writeFile(path.join(root, "robots.txt"), "User-agent: *\nDisallow: /\n");
    const paths = [];
    const assets = new Set();
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
        const $ = load(publicHtml);
        $('[src], [href], [srcset]').each((_, element) => {
          const values = [$(element).attr('src'), $(element).attr('href'),
            ...($(element).attr('srcset') || '').split(',').map(value => value.trim().split(/\s+/)[0])];
          for (const value of values.filter(Boolean)) {
            const asset = new URL(value, 'https://rosarium-tech.com/' + relative);
            if (asset.origin === 'https://rosarium-tech.com' && !asset.search &&
              /^\/(?:assets|images|diagrams|icons|fonts)\//.test(asset.pathname)) assets.add(asset.pathname);
          }
        });
      }
    }
    await walk(root);
    const template = await fs.readFile("src/pwa/worker.js", "utf8");
    hash.update(template);
    const config = { review, version: hash.digest("hex").slice(0, 16), paths, assets: [...assets].sort() };
    const worker = template.replace('/* PWA_CONFIG */ { review: false, version: "development", paths: [] }', JSON.stringify(config));
    new Script(worker); // Fail the build on an invalid generated worker.
    await fs.writeFile(path.join(root, "sw.js"), worker);
  } } };
}
