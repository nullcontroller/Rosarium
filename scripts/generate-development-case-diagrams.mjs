/** Code-native SVG originals. No app screens, private data, or measured performance. */
import fs from "node:fs";
const output = "public/diagrams/ai-development-management";
fs.mkdirSync(output, { recursive: true });
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
for (const theme of ["light", "dark"]) {
  const dark = theme === "dark";
  const colors = dark ? { bg: "#122426", text: "#e1eceb", muted: "#b4cbc7", ai: "#244743", line: "#94bfb6", human: "#20333d", review: "#39372c" }
    : { bg: "#f7faf9", text: "#17383b", muted: "#46645e", ai: "#e0eee9", line: "#416e62", human: "#edf1f6", review: "#f6edda" };
  const text = (x, y, value, size = 20, weight = 400) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="${colors.text}">${escape(value)}</text>`;
  const box = (y, height, title, lines, role = "ai") => `<rect x="30" y="${y}" width="380" height="${height}" rx="${role === "human" ? 18 : 8}" fill="${colors[role]}" stroke="${colors.line}" stroke-width="${role === "ai" ? 3 : 2}" ${role === "human" ? 'stroke-dasharray="7 5"' : ""}/>${text(220, y + 31, title, 23, 700)}${lines.map((line, i) => text(220, y + 61 + i * 27, line, 20)).join("")}`;
  const arrow = (y1, y2, label = "") => `<path d="M220 ${y1}V${y2}" fill="none" stroke="${colors.line}" stroke-width="2" marker-end="url(#arrow)"/>${label ? text(220, (y1 + y2) / 2 + 5, label, 18) : ""}`;
  const path = d => `<path d="${d}" fill="none" stroke="${colors.line}" stroke-width="2" marker-end="url(#arrow)"/>`;
  const save = (name, height, title, body) => fs.writeFileSync(`${output}/${name}-${theme}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 ${height}" width="440" height="${height}" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">開発プロセスを説明する概念図。実測値や自律的な通信の実装を表さない。</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${colors.line}"/></marker></defs><rect width="440" height="${height}" rx="12" fill="${colors.bg}"/><g font-family="system-ui, sans-serif">${text(220, 29, title, 21, 700)}${body}</g></svg>\n`);
  save("responsibility", 1150, "成果物で分ける二つのレビュー経路",
    box(50, 106, "人間：目的と制約", ["目的設定・制約条件", "重要な意思決定"], "human") +
    arrow(156, 198) +
    box(198, 106, "ChatGPT：開発管理", ["要求整理・設計・改善方針", "Codexへの作業指示を作成"]) +
    arrow(304, 350) +
    box(350, 106, "Codex：実装と検証", ["実装・テスト・修正", "二つの成果物を用意"]) +
    path("M220 456V477H16V758H30") + path("M16 576H30") +
    text(220, 492, "成果物を役割に合わせて分ける", 18) +
    box(510, 132, "レビューZIP → ChatGPT", ["実装結果・検証資料を確認", "要求・設計・実装・品質を評価", "検証結果から修正点を整理"]) +
    box(692, 132, "ステージング → 人間", ["実際のシステムを操作", "要求・操作性・実用性を確認", "改善が必要かを判断"], "human") +
    path("M410 576H428V920H410") + path("M410 758H418V960H410") +
    box(885, 110, "改善判断・修正指示", ["ChatGPT：両者の結果を整理", "修正指示をCodexへ戻す"], "review") +
    path("M30 940H8V403H30") +
    arrow(995, 1040) +
    box(1040, 86, "人間：最終承認", ["最終責任は人間が保持"], "human"));
  save("cycle", 1330, "実利用・二つのレビュー・再検証",
    box(50, 78, "実利用", ["アプリを使う"], "human") + arrow(128, 164) +
    box(164, 78, "課題発見", ["問題点・改善点を見つける"], "human") + arrow(242, 278) +
    box(278, 78, "要求整理", ["ChatGPT：変更する内容を整理"]) + arrow(356, 392) +
    box(392, 78, "実装指示", ["ChatGPT：作業指示を作成"]) + arrow(470, 506) +
    box(506, 106, "Codex：実装・テスト", ["レビューZIPに結果をまとめる", "ステージングへ反映"]) +
    path("M220 612V638H18V873H30") + path("M18 723H30") +
    box(670, 106, "レビューZIP → ChatGPT", ["要求・設計・実装・品質", "検証結果を確認"]) +
    box(820, 106, "ステージング → 人間", ["実操作で要求充足を確認", "操作性・実用上の改善を評価"], "human") +
    path("M410 723H428V1015H410") + path("M410 873H418V1050H410") +
    box(980, 106, "改善判断・修正指示", ["双方のレビュー結果を反映", "必要に応じてCodexへ差し戻す"], "review") +
    path("M30 1033H12V559H30") +
    arrow(1086, 1140) +
    box(1140, 78, "人間：最終承認", ["要求に照らして受入れを判断"], "human") +
    path("M30 1179H6V89H30") +
    text(220, 1258, "修正は再実装・再検証へ戻す", 18) +
    text(220, 1286, "要求変更は要求整理へ戻す", 18) +
    text(220, 1314, "承認後は実利用へ戻り、再び改善", 18));
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
