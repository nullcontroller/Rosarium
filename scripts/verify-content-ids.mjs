/** ID checks use Git history, not a second hand-maintained content registry. */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
export const ID_ADOPTION_BASE = "6601fae08297128671aa214d1ef46a29b1ec040f";
const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
export const identityForFile = (file) =>
  file.startsWith("src/content/career/")
    ? {
        collection: "career",
        id: file.slice("src/content/career/".length).replace(/\.md$/, ""),
      }
    : {
        collection: "pages",
        id: file.replace(/^src\/content\//, "").replace(/\.md$/, ""),
      };
const key = (e) => JSON.stringify([e.collection, e.id]);
const data = (raw) =>
  YAML.parse(raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "");
export function identityViolations(
  entries,
  protectedEntries = [],
  reserved = [],
) {
  const errors = [],
    seen = new Set(),
    folded = new Set(),
    reservedSet = new Set(reserved.map(key));
  for (const entry of entries) {
    const k = key(entry),
      fold = JSON.stringify([entry.collection, entry.id.toLowerCase()]);
    if (seen.has(k)) errors.push(`ID重複: ${k}`);
    if (folded.has(fold) && !seen.has(k)) errors.push(`大小文字衝突: ${k}`);
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(
        entry.id,
      )
    )
      errors.push(`ID命名規約違反: ${k}`);
    if (reservedSet.has(k)) errors.push(`廃止IDの再利用: ${k}`);
    seen.add(k);
    folded.add(fold);
  }
  for (const entry of protectedEntries)
    if (!seen.has(key(entry)))
      errors.push(`公開済みIDの変更・削除: ${key(entry)}`);
  return errors;
}
export function verifyContentIds() {
  git("cat-file", "-e", ID_ADOPTION_BASE + "^{commit}");
  const files = git(
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "--",
    "src/content",
  )
    .trim()
    .split(/\r?\n/)
    .filter((file) => file.endsWith(".md") && fs.existsSync(file));
  const current = files.map((file) => {
    const d = data(fs.readFileSync(file, "utf8"));
    if (Object.hasOwn(d, "id") || Object.hasOwn(d, "content_id"))
      throw new Error(`未承認のID metadata: ${file}`);
    return { ...identityForFile(file), file };
  });
  const protectedEntries = new Map(),
    reserved = new Map();
  const baseline = git(
    "ls-tree",
    "-r",
    "--name-only",
    ID_ADOPTION_BASE,
    "--",
    "src/content",
  )
    .trim()
    .split(/\r?\n/)
    .filter((file) => file.endsWith(".md"));
  const remember = (commit, file) => {
    const d = data(git("show", `${commit}:${file}`));
    if (d && d.public !== false && d.status !== "draft") {
      const identity = identityForFile(file);
      protectedEntries.set(key(identity), identity);
    }
  };
  for (const file of baseline) remember(ID_ADOPTION_BASE, file);
  for (const line of git(
    "log",
    "HEAD",
    "--format=",
    "--name-status",
    "--diff-filter=D",
    "--no-renames",
    "--",
    "src/content",
  ).split(/\r?\n/))
    if (line.startsWith("D\t") && line.endsWith(".md")) {
      const identity = identityForFile(line.slice(2));
      reserved.set(key(identity), identity);
    }
  let commit = "";
  for (const line of git(
    "log",
    "--reverse",
    "--format=COMMIT %H",
    "--name-status",
    "--no-renames",
    `${ID_ADOPTION_BASE}..HEAD`,
    "--",
    "src/content",
  ).split(/\r?\n/)) {
    if (line.startsWith("COMMIT ")) {
      commit = line.slice(7);
      continue;
    }
    if (/^[AM]\t.*\.md$/.test(line)) remember(commit, line.slice(2));
  }
  const errors = identityViolations(
    current,
    [...protectedEntries.values()],
    [...reserved.values()],
  );
  const config = fs.readFileSync("src/content.config.ts", "utf8"),
    old = git("show", ID_ADOPTION_BASE + ":src/content.config.ts");
  const generation = (s) =>
    s
      .match(
        /generateId:\s*\(\{\s*entry\s*\}\)\s*=>\s*entry\.replace\(\/\\\.md\$\/,\s*["']{2}\)/,
      )?.[0]
      .replace(/\s/g, "");
  if (!generation(config) || generation(config) !== generation(old))
    errors.push(
      "loaderのID生成規則が変更されています。ID影響の別途レビューが必要です。",
    );
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    `Content ID guard: ${current.length} current identities; ${protectedEntries.size} ever-public identities protected; ${reserved.size} historical deleted identities reserved; no duplicate, rename or reuse.`,
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
)
  verifyContentIds();
