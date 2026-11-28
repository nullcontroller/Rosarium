/** Code-native SVG originals. No app screens, private data, or measured performance. */
import fs from "node:fs";
const book = process.argv.includes("--book");
const reviewEnvironment = book ? "動作確認環境" : "ステージング";
const output = book ? "public/diagrams/asset-management-app-a-architecture" : "public/diagrams/ai-development-management";
fs.mkdirSync(output, { recursive: true });
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
for (const theme of ["light", "dark"]) {
  const dark = theme === "dark";
  const colors = dark ? { bg: "#122426", text: "#e1eceb", muted: "#b4cbc7", ai: "#244743", line: "#94bfb6", human: "#20333d", review: "#39372c" }
    : { bg: "#f7faf9", text: "#17383b", muted: "#46645e", ai: "#e0eee9", line: "#416e62", human: "#edf1f6", review: "#f6edda" };
  const text = (x, y, value, size = 20, weight = 400) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="${colors.text}">${escape(value)}</text>`;
  const box = (y, height, title, lines, role = "ai", fontSize = 20) => `<rect x="30" y="${y}" width="380" height="${height}" rx="${role === "human" ? 18 : 8}" fill="${colors[role]}" stroke="${colors.line}" stroke-width="${role === "ai" ? 3 : 2}" ${role === "human" ? 'stroke-dasharray="7 5"' : ""}/>${text(220, y + 31, title, 23, 700)}${lines.map((line, i) => text(220, y + 61 + i * 27, line, fontSize)).join("")}`;
  const arrow = (y1, y2, label = "") => `<path d="M220 ${y1}V${y2}" fill="none" stroke="${colors.line}" stroke-width="2" marker-end="url(#arrow)"/>${label ? text(220, (y1 + y2) / 2 + 5, label, 18) : ""}`;
  const path = d => `<path d="${d}" fill="none" stroke="${colors.line}" stroke-width="2" marker-end="url(#arrow)"/>`;
  const line = d => `<path d="${d}" fill="none" stroke="${colors.line}" stroke-width="2"/>`;
  const reviewColumn = (x, role, title, reviewer, artifact, details) => `<g data-review="${role}"><rect x="${x}" y="435" width="196" height="230" rx="${role === "human" ? 18 : 8}" fill="${colors[role]}" stroke="${colors.line}" stroke-width="${role === "ai" ? 3 : 2}" ${role === "human" ? 'stroke-dasharray="7 5"' : ""}/>${text(x + 98, 467, title, 22, 700)}${text(x + 98, 499, reviewer, 22)}${artifact.map((label, i) => text(x + 98, 538 + i * 28, label, 22)).join("")}${details.map((label, i) => text(x + 98, 605 + i * 30, label, 22)).join("")}</g>`;
  const save = (name, height, title, body) => {
    if (book && name === "bottleneck") return;
    fs.writeFileSync(`${output}/${book ? "development-" : ""}${name}-${theme}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 ${height}" width="440" height="${height}" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">開発プロセスを説明する概念図。実測値や自律的な通信の実装を表さない。</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${colors.line}"/></marker></defs><rect width="440" height="${height}" rx="12" fill="${colors.bg}"/><g font-family="system-ui, sans-serif">${text(220, 29, title, 21, 700)}${body}</g></svg>\n`);
  };
  save("responsibility", 630, "三者の責任と確認対象",
    box(55, 146, "人間", ["目的・制約・重要な意思決定", `${reviewEnvironment}で実操作・評価`, "最終承認と最終責任"], "human", 22) +
    box(235, 146, "ChatGPT", ["要求整理・設計・実装指示", "レビューZIPの確認・品質レビュー", "改善方針・修正指示"], "ai", 22) +
    box(415, 146, "Codex", ["実装・テスト・修正", `レビューZIP・${reviewEnvironment}を用意`, "リファクタリング"], "ai", 22) +
    text(220, 604, "最終承認と責任は人間に残す", 22));
  save("cycle", 1035, "開発サイクルと役割分担",
    box(55, 80, "課題発見・改善要求", ["人間"], "human", 22) + arrow(135, 165) +
    box(165, 90, "要求整理・実装指示", ["ChatGPT"], "ai", 22) + arrow(255, 285) +
    box(285, 90, "実装・テスト", ["Codex"], "ai", 22) +
    line("M220 375V400") + path("M220 400H114V435") + path("M220 400H326V435") +
    reviewColumn(16, "ai", "AIレビュー", "ChatGPT", ["レビューZIP"], ["設計・実装・品質", "検証結果の確認"]) +
    reviewColumn(228, "human", "人間レビュー", "人間", book ? ["動作確認", "環境"] : ["ステージング", "環境"], ["実操作・要求充足", "実用性の評価"]) +
    line("M114 665V695H220") + line("M326 665V695H220") + arrow(695, 725) +
    box(725, 90, "レビュー結果の統合", ["ChatGPT：改善判断・修正指示"], "review", 22) + arrow(815, 845) +
    box(845, 110, "人間の最終承認", ["承認後に本番反映・実利用"], "human", 22) +
    text(220, 1003, "修正が必要な場合は実装工程へ戻る", 22));
  save("bottleneck", 864, "判断をどこへ集めるか",
    text(220, 70, "比較：人間が全作業を管理", 22, 700) +
    box(91, 80, "人間：作業指示", ["次の作業を決めて指示"], "human") + arrow(171, 209) +
    box(209, 80, "AI：実装・テスト", ["実装が進んでも判断は残る"]) + arrow(289, 327) +
    box(327, 106, "人間：レビュー・修正判断", ["通常管理と重要判断が集中", "判断待ちが生じ得る"], "human") +
    text(220, 480, "今回：通常管理をAIへ委任", 22, 700) +
    box(500, 80, "人間：目的・制約・重要判断", ["委任範囲と承認条件を定める"], "human") + arrow(580, 618) +
    box(618, 106, "AI：通常の開発管理と実装", ["ChatGPT：要求・指示・レビュー", "Codex：実装・テスト・修正"]) + arrow(724, 762) +
    box(762, 80, "人間：最終承認", ["最終責任は人間が保持"], "human"));
}
