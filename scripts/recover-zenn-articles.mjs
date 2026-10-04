// Owner-authorized recovery. Existing active bodies are never overwritten.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import YAML from "yaml";
const source = process.argv[2];
if (!source) throw Error("Usage: node scripts/recover-zenn-articles.mjs EXTRACTED_ZENN_ROOT");
const manifest = YAML.parse(fs.readFileSync("migration/zenn-migration-manifest.yaml", "utf8"));
const sha = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const parse = (buffer) => {
  const text = buffer.toString("utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw Error("Missing frontmatter");
  return { data: YAML.parse(match[1]), body: text.slice(match[0].length) };
};
const reasons = {
  "a1ac10c371e230": ["retired", "LLMを数学的・確率的な対象として扱う立場は、現在のAI理論トップに統合されています。この内容は独立した記事としての役割を終えています。"],
  "4f6be09295656b": ["obsolete", "2026年8月時点の転職市場や職種の見え方を、採用される側から記した記事です。市場の状況は変わるため、現在の求人動向や職種選択の推奨としては扱いません。"],
  "5bbc6c7f86194f": ["obsolete", "公開当時のFDEという職名とAI人材の役割分化を論じた記事です。職名や各社の責任範囲は変化するため、現在の職種分類としてではなく、当時の考察として扱います。"],
  "f5c1a1276d2191": ["obsolete", "旧AI環境下で行った仕様復元とRAGへの再利用を紹介する記事です。現在はGitHub Copilotがコードベースを参照できるため、ここで述べた理解の手順を現在の推奨構成としては扱いません。人による確認と判断は引き続き必要です。"],
  "6c399a260e0535": ["retired", "設計支援とコード生成を分ける論点は、現在の「コード生成AIはなぜ業務を変えないのか」へ統合されています。この内容は独立した記事としての役割を終えています。"],
  "5b8a6a1c413e10": ["retired", "AI企業をエコシステムと生成能力で二分する当時の説明は、現在のContextを基準にした使い分けの考察へ役割を統合しています。この内容は独立した記事としての役割を終えています。"],
  "7f7cb55c4ebcaa": ["retired", "人によるレビューの価値は、現在の責任境界とHITLの設計に統合されています。この内容は独立した記事としての役割を終えています。"],
};
const records = [];
const baseline = "ea3258c";
if (execFileSync("git", ["rev-parse", "--short=7", "HEAD"], { encoding: "utf8" }).trim() !== baseline)
  throw Error("One-time recovery: do not rerun over later edited content");
for (const item of manifest.entries.filter((entry) => entry.source_type === "article")) {
  const raw = fs.readFileSync(path.join(source, item.source_file));
  const original = parse(raw);
  const file = item.destination_file;
  const before = execFileSync("git", ["show", `${baseline}:${file}`], { encoding: "utf8" }).replace(/\r\n/g, "\n");
  const existing = parse(Buffer.from(before));
  const [lifecycle, reason] = reasons[item.original_slug] ?? ["active", "独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。"];
  const snapshot = `migration/zenn-recovery-2026-10-05/articles/${item.original_slug}.md`;
  fs.mkdirSync(path.dirname(snapshot), { recursive: true });
  fs.writeFileSync(snapshot, raw);
  existing.data.lifecycle = lifecycle;
  if (lifecycle !== "active") {
    existing.data.lifecycle_reason = reason;
    existing.data.last_updated = "2026-10-05";
  }
  if (lifecycle === "retired") {
    existing.data.public = true;
    existing.data.status = "archived";
  }
  // Preserve original publication timestamps, including unknown dates.
  existing.data.published_at = original.data.published_at ?? null;
  let body = existing.body;
  if (lifecycle === "retired") {
    body = original.body;
    // One document h1 is supplied by the layout; only its duplicate is removed.
    body = body.replace(/^\s*# [^\n]+\n/, "\n");
    for (const asset of manifest.assets.filter((asset) => asset.downloaded && !asset.retired))
      body = body.replaceAll(asset.original_url, asset.destination);
    body = body.replace(/!\[\]\(/g, `![${original.data.title}の図](`);
  }
  let frontmatter = before.match(/^---\n([\s\S]*?)\n---\n/)[1];
  frontmatter = frontmatter.replace(/^(status:.*)$/m, `$1\nlifecycle: ${lifecycle}`);
  if (lifecycle !== "active") {
    frontmatter = frontmatter.replace(/^last_updated:.*$/m, 'last_updated: "2026-10-05"');
    frontmatter += `\nlifecycle_reason: ${JSON.stringify(reason)}`;
  }
  if (lifecycle === "retired") frontmatter = frontmatter.replace(/^public: false$/m, "public: true").replace(/^status:.*$/m, "status: archived");
  if (String(existing.data.published_at ?? "") !== String(original.data.published_at ?? ""))
    throw Error(`Publication date mismatch requires review: ${file}`);
  fs.writeFileSync(file, `---\n${frontmatter}\n---\n${body}`);
  let live;
  try {
    const response = await fetch(item.original_url, { signal: AbortSignal.timeout(10000) });
    live = { checked_at: new Date().toISOString(), http_status: response.status, final_url: response.url,
      public: response.ok && response.url.replace(/\/$/, "") === item.original_url ? true : response.status === 404 ? false : null };
    await response.body?.cancel();
  } catch (error) { live = { public: null, reason: error.message }; }
  records.push({ title: original.data.title, original_slug: item.original_slug,
    original_published_at: original.data.published_at ?? null, source_published: original.data.published,
    zenn_live: live, existed_in_rosarium: true, lifecycle: lifecycle.toUpperCase(), reason,
    destination: file.replace(/^src\/content\//, "").replace(/\.md$/, ""),
    restored_from: "current file", source_file: item.source_file, source_snapshot: snapshot,
    source_sha256: sha(raw), destination_body_sha256: sha(body),
    restoration: lifecycle === "retired" ? "Original body restored; previous redirect replaced at the same URL" : "Existing Rosarium body retained; exact original snapshot saved" });
}
const git = (...args) => execFileSync("git", ["-c", `safe.directory=${path.resolve(source).replaceAll("\\", "/")}`, "-C", source, ...args], { encoding: "utf8" });
const removed = git("log", "HEAD", "--diff-filter=D", "--format=", "--name-only", "--", "articles").trim().split(/\r?\n/).filter(Boolean);
if (removed.some((name) => name !== "articles/test.md")) throw Error("New deleted article requires manual review");
const test = git("show", "16a96ad^:articles/test.md");
records.push({ title: parse(Buffer.from(test)).data.title, original_slug: "test", original_published_at: null,
  source_published: false, zenn_live: { public: null, reason: "Unpublished integration test; live probe unnecessary" },
  existed_in_rosarium: false, lifecycle: "DELETE", reason: "GitHub/Zenn連携と図表示を確認する非公開テスト記事。実記事ではないため移行しない。",
  destination: null, restored_from: "deleted commit", deletion_commit: "16a96add8d5b5c52933a2782de8ea22f7e02e4cf",
  restoration_commit: "6d2d706676862b2c4d9a463317d24726a4b5e95f", source_sha256: sha(test), recovered: true });
const report = { date: "2026-10-05", source_head: git("rev-parse", "HEAD").trim(),
  total_articles: records.length, current_articles: 16, deleted_articles: [...new Set(removed)].length,
  unrecoverable: [], entries: records };
fs.writeFileSync("migration/zenn-recovery-2026-10-05.json", JSON.stringify(report, null, 2) + "\n");
console.log(records.map((r) => `${r.original_slug}: ${r.lifecycle} / Zenn=${r.zenn_live.http_status ?? "unknown"}`).join("\n"));
