import { compatibilityUrls, compatibilityDestination } from "../src/data/compatibility-urls.mjs";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
export { compatibilityDestination } from "../src/data/compatibility-urls.mjs";

const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function generateCompatibility(directory) {
  const sources = new Set(compatibilityUrls.map(record => record.from));
  for (const record of compatibilityUrls) {
    const targets = [record.to, ...Object.values(record.fragments)];
    for (const value of targets) {
      const target = new URL(value, 'https://rosarium-tech.com');
      if (sources.has(target.pathname)) throw new Error(`Compatibility chain: ${record.from} -> ${value}`);
      const file = resolve(directory, '.'+target.pathname, 'index.html');
      const html = await readFile(file,'utf8');
      if (target.hash && !html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) throw new Error(`Missing destination fragment: ${value}`);
    }
    const target = escape(record.to), canonical=escape('https://rosarium-tech.com'+new URL(record.to,'https://rosarium-tech.com').pathname);
    const data=JSON.stringify(record).replace(/</g,'\\u003c');
    const html=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>移転先のご案内 | Rosarium</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0;url=${target}"></head><body><h1>移転先のご案内</h1><p><a href="${target}">統合先・移転先へ</a></p><script>const record=${data};location.replace((${compatibilityDestination.toString()})(record,new URL(location.href)));</script></body></html>`;
    const folder=resolve(directory,'.'+record.from);await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'index.html'),html);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await generateCompatibility(process.argv[2] || 'dist');
