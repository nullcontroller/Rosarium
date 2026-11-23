import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { designStudies, selectedDesignStudies } from "../src/data/design-studies.mjs";
import { isDraftPreview } from "../src/lib/draft-preview.mjs";
import { designStudyDiagrams } from "../src/data/design-study-diagrams.ts";

const entries = designStudies.map(study => {
  const source = fs.readFileSync(`src/content/${study.id}.md`, "utf8");
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return { ...study, data: YAML.parse(front[1]), body: source.slice(front[0].length) };
});
test("six independent design studies require explicit nonpublic draft selection", () => {
  assert.equal(entries.length, 6);
  assert.equal(new Set(entries.map(entry => entry.id)).size, 6);
  assert.equal(selectedDesignStudies().length, 0);
  assert.equal(selectedDesignStudies("essays/what-is-ai").length, 0);
  assert.deepEqual(selectedDesignStudies(entries[1].id).map(entry => entry.id), [entries[1].id]);
  for (const entry of entries) {
    assert.equal(entry.data.status, "draft");
    assert.equal(entry.data.public, false);
    assert.equal(entry.data.series, undefined);
    assert.equal(entry.data.published_at, undefined);
    assert.equal(isDraftPreview(entry), false);
    assert.equal(isDraftPreview(entry, entry.id), true);
  }
});
test("each study explains a concrete scenario before its verification plan", () => {
  for (const entry of entries) {
    assert((entry.body.match(/^## /gm) ?? []).length >= 6, entry.id);
    assert.match(entry.body, /仮想設計/);
    assert.match(entry.body, /実務経験をもとに、追加の条件を設定して検討した仮想設計ケーススタディです。/);
    assert.doesNotMatch(entry.body, /方式比較は記事として整理|元資料の設定|実際の改訂履歴ではありません|測定結果や達成率は置きません|実施記録ではありません/);
    if (entry.slug !== "inquiry-analysis") {
      assert(entry.body.includes("/cases/design-studies/"));
      assert(entry.body.includes("/cases/customer-support-ai-dx/"));
    }
    assert(!/^## .*補足/m.test(entry.body), entry.id);
    const example = entry.slug === "inquiry-analysis" ? "プリンタの接続設定" : entry.slug === "qualification-testing" ? "Q01" : entry.slug === "rag-security" ? "公開FAQ" : "文書A";
    assert(entry.body.includes(example), entry.id);
  }
});

test("concrete studies connect examples to six valid responsive SVG models", () => {
  const ids = Object.keys(designStudyDiagrams);
  assert.equal(ids.length, 6);
  for (const slug of ["metadata-batch", "data-migration"]) {
    const entry = entries.find(entry => entry.slug === slug);
    assert.equal((entry.body.match(/data-case-diagram=/g) ?? []).length, 2);
    assert(entry.body.indexOf("文書A") < entry.body.indexOf("## まとめ"));
    for (const token of ["文書A", "節A", "節B", "Printer-A", "第2版"]) assert(entry.body.includes(token), token);
    for (const match of entry.body.matchAll(/data-case-diagram="([^"]+)"/g)) assert(ids.includes(match[1]));
  }
  for (const model of Object.values(designStudyDiagrams)) {
    const nodes = new Set(model.nodes.map(node => node.id));
    assert.equal(nodes.size, model.nodes.length);
    assert.match(model.title, /仮想設計/);
    if (model.rows) assert.deepEqual(new Set(model.rows.flat()), nodes);
    for (const edge of model.edges) {
      assert(nodes.has(edge.from) && nodes.has(edge.to));
      for (const layout of Object.values(model.layouts ?? {})) assert(layout.edges[`${edge.from}:${edge.to}`]);
    }
    for (const layout of Object.values(model.layouts ?? {})) {
      assert.deepEqual(new Set(Object.keys(layout.nodes)), nodes);
      for (const node of Object.values(layout.nodes)) {
        assert(node.x >= 0 && node.y >= 0);
        assert(node.x + node.w <= layout.width && node.y + node.h <= layout.height);
      }
    }
  }
  assert(designStudyDiagrams["design-study-batch-state"].edges.some(edge => edge.from === "retry" && edge.to === "pending"));
  assert(designStudyDiagrams["design-study-batch-state"].nodes.find(node => node.id === "complete").description.includes("要確認"));
});
test("topic boundaries preserve safe retries, business review and version validity", () => {
  const body = slug => entries.find(entry => entry.slug === slug).body;
  assert.match(body("inquiry-analysis"), /専門判断の要否を別々に確認/);
  assert.match(body("metadata-batch"), /APIが再度呼ばれる可能性/);
  assert.match(body("metadata-batch"), /認証不備や広範なAPI障害/);
  assert.match(body("qualification-testing"), /必要な有人対応は失敗ではありません/);
  assert.match(body("data-migration"), /削除・失効/);
  assert.match(body("rag-security"), /顧客・権限単位の認可/);
  assert.match(body("document-lifecycle"), /修正不要の判定を確認して承認/);
});

test("inquiry classification and workload tables reconcile without turning assumptions into results", () => {
  const body = entries.find(entry => entry.slug === "inquiry-analysis").body;
  const number = value => Number(value.replaceAll(",", ""));
  const classification = [...body.matchAll(/^\| (定型|要判断|開発確認|保留|合計) \| ([\d,]+) \| ([+\-]?[\d,]+) \| ([\d,]+) \|$/gm)]
    .map(match => ({ name: match[1], before: number(match[2]), delta: number(match[3]), after: number(match[4]) }));
  assert.equal(classification.length, 5);
  for (const row of classification) assert.equal(row.before + row.delta, row.after, row.name);
  const total = classification.find(row => row.name === "合計");
  const rows = classification.filter(row => row.name !== "合計");
  assert.equal(rows.reduce((sum, row) => sum + row.before, 0), total.before);
  assert.equal(rows.reduce((sum, row) => sum + row.after, 0), total.after);
  assert.equal(total.before, 18000);
  const workload = [...body.matchAll(/^\| (定型|要判断|開発確認) \| ([\d,]+) \| (\d+)分 \| (\d+)時間 \|$/gm)]
    .map(match => ({ name: match[1], count: number(match[2]), minutes: Number(match[3]), hours: Number(match[4]) }));
  assert.equal(workload.length, 3);
  for (const row of workload) {
    assert.equal(row.count * row.minutes / 60, row.hours, row.name);
    assert.equal(row.count * 12, rows.find(annual => annual.name === row.name).after);
  }
  assert.equal(workload.reduce((sum, row) => sum + row.hours, 0), 400);
  assert(body.includes("336件") && body.includes("24件"));
  assert.match(body, /追加負担を考慮する前の必要量/);
  assert.match(body, /実質的な削減時間は100時間未満/);
  assert.match(body, /600件は定型750件の80％/);
});

test("test, security and revision scenarios state expected outcomes and preserve review boundaries", () => {
  const body = slug => entries.find(entry => entry.slug === slug).body;
  for (const id of ["Q01", "Q02", "Q03", "50人", "95％", "10秒"]) assert(body("qualification-testing").includes(id));
  const security = designStudyDiagrams["design-study-security-boundary"];
  assert(security.edges.some(edge => edge.from === "permission" && edge.to === "blocked"));
  assert(!security.edges.some(edge => edge.from === "blocked"));
  assert(security.nodes.find(node => node.id === "blocked").description.includes("社内報告書"));
  for (const value of ["公開FAQ", "社内報告書", "無線LANで印刷できない"]) assert(body("rag-security").includes(value));
  for (const value of ["文書A", "節B", "ファームウェア", "変更していない節", "未承認"]) assert(body("document-lifecycle").includes(value));
  assert(body("metadata-batch").includes("既存結果を使い、候補を追加せず再生成もしない"));
  assert(body("metadata-batch").includes("未承認へ戻したりしません"));
});

test("qualification testing preserves legacy destinations beside their corresponding sections", () => {
  const body = entries.find(entry => entry.slug === "qualification-testing").body;
  const destinations = {
    "設計課題": "## このケースで確認する3つの品質",
    "背景と制約": "## 3種類の問い合わせと期待する動作",
    "採用する設計方式": "## 自動回答・停止・有人引継ぎをどう確認するか",
    "設計上の選択肢": "## 自動テストとCSレビューの役割分担",
    "回答できた件数と止めるべき案件を止めた件数を分ける": "## 自動回答・停止・有人引継ぎをどう確認するか",
    "自動判定は追跡可能な項目へ限定する": "## 自動テストとCSレビューの役割分担",
    "性能は検索用データ量を確定してから確認する": "## 50人同時利用を想定した性能テスト",
    "設計から得られる知見": "## 設計判断のまとめ",
  };
  for (const [id, heading] of Object.entries(destinations)) {
    const anchor = `<a id="${id}" aria-hidden="true"></a>`;
    assert.equal(body.split(anchor).length - 1, 1, id);
    assert.equal(body.slice(body.indexOf(anchor)).match(/^## .+$/m)?.[0], heading, id);
  }
});


test("source-based scenarios retain review work and timing without inventing rollout results", () => {
  const body = slug => entries.find(entry => entry.slug === slug).body;
  for (const token of ["夜間", "翌朝", "DX部", "CS部", "500件", "950件以上"]) assert(body("qualification-testing").includes(token), token);
  for (const token of ["2か月", "切替直前", "事前利用"]) assert(body("data-migration").includes(token), token);
  const lifecycle = body("document-lifecycle");
  for (const token of ["500ページ", "節A", "節B", "再確認を求めません", "修正不要", "担当者へ確認依頼を通知", "未承認"]) assert(lifecycle.includes(token), token);
  assert(lifecycle.includes("変更された本文を確認しなくてよいこと"));
  assert(body("metadata-batch").includes("初回は手動、通常の差分更新は定期実行、緊急時は臨時起動"));
});


test("reader-facing examples use Japanese names while keeping diagram identities stable", () => {
  for (const slug of ["metadata-batch", "qualification-testing", "data-migration", "document-lifecycle"]) {
    const body = entries.find(entry => entry.slug === slug).body.replace(/<a id="[^"\n]+" aria-hidden="true"><\/a>/g, "");
    assert(!/manual-00\d|section-00\d|v[234]/.test(body), slug);
    for (const label of ["文書A", "節A", "節B"]) assert(body.includes(label), slug + label);
  }
  const inquiry = entries.find(entry => entry.slug === "inquiry-analysis").body;
  for (const phrase of ["内訳は設定", "保留ゼロを目的", "自動完結率80％を測定", "起点となる[実務Bookの業務課題]"]) assert(!inquiry.includes(phrase), phrase);
  const testing = entries.find(entry => entry.slug === "qualification-testing").body;
  assert(testing.includes("全要求の95％以上が10秒以内に正常完了"));
  assert(!testing.includes("N：要求総数"));
  const security = entries.find(entry => entry.slug === "rag-security").body.replace(/<a id="[^"\n]+" aria-hidden="true"><\/a>/g, "");
  assert.doesNotMatch(security, /faq-00\d|report-00\d|v[23]/);
  for (const model of Object.values(designStudyDiagrams)) {
    for (const value of [model.title, model.intro ?? "", model.description, ...model.nodes.flatMap(node => [node.label, node.description])]) {
      assert.doesNotMatch(value, /manual-00\d|section-00\d|faq-00\d|report-00\d|v[234]/);
    }
  }
});
