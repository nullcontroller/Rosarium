import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { recentGrowth, growthPublishedTargets } from "../src/data/recent-growth.ts";
import { contentHistory } from "../src/data/content-history.ts";

const id = "evaluation-hitl/customer-support-qa-qualification-test";
const text = fs.readFileSync(`src/content/${id}.md`, "utf8");
const data = YAML.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
const body = text.split(/^---\s*$/m).slice(2).join("---");
const rows = body.split(/\r?\n/).filter(line => line.startsWith("|")).map(line => line.split("|").slice(1, -1).map(cell => cell.replaceAll("**", "").trim()));

test("qualification design is a complementary Article, not a Case or Book chapter", () => {
  assert.equal(data.section, "evaluation-hitl");
  assert.equal(data.layer, "publication");
  assert.equal(data.kind, "guide");
  assert.equal(data.publication_format, "article");
  assert.equal(data.series, undefined);
  assert(body.includes("同じ設計事例のテスト計画"));
  assert(body.includes("顧客向けQAを新規開発"));
  for (const route of ["cases/customer-support-ai-dx", "evaluation-hitl/customer-support-qa-poc", "cases/customer-support-ai-dx/responsibility-boundary"])
    assert(body.includes(`](/${route}/)`), route);
});

test("business classifications and processing paths remain distinct", () => {
  for (const label of ["定型回答可能", "専門判断が必要", "回答根拠不足"])
    assert(rows.some(row => row[0] === label));
  const paths = rows.filter(row => /^[1-3]\. /.test(row[0]));
  assert.deepEqual(paths.map(row => row[0]), ["1. 追加質問なしで自動回答", "2. 追加質問後に自動回答", "3. 自動回答せず有人引継ぎ"]);
  assert(paths[2][2].includes("停止") && paths[2][2].includes("未解決事項"));
  assert(body.includes("三つの処理経路をほぼ同数"));
  assert(body.includes("各経路の正確な内訳は確定していない"));
  assert(!/16[6-7]件/.test(body));
});

test("the independent 500-case plan specifies conditions, automated execution and discrepancy investigation", () => {
  assert(body.includes("テストの500件は、PoCの1,000件とは別の計画"));
  for (const field of ["入力データ", "参照資料", "検索対象のメタデータ", "回答項目のメタデータ", "モデル・指示文", "期待結果", "実行ログ"])
    assert(rows.some(row => row[0] === field), field);
  for (const action of ["一連の処理を自動実行", "ケースで定義した回答を入力", "期待結果と実行ログを自動照合", "不一致ケースを調査する", "要求・仕様とCS部の判断へ戻して確認", "従来の正常な経路も確認"])
    assert(body.includes(action), action);
  assert(body.includes("生成文が毎回完全に一致することは区別"));
});

test("expert content judgment is separate from automated checks and both contribute to acceptance", () => {
  for (const role of ["テスター", "経験豊富なCS部担当者"])
    assert(rows.some(row => row[0] === role));
  const criteria = rows.filter(row => row[2] === "自動回答80％以上" || row[2] === "適切な有人引継ぎ100％");
  assert.equal(criteria.length, 2);
  assert(criteria[0][1].includes("経路1・2") && criteria[0][1].includes("無修正で顧客提示可能"));
  assert(criteria[1][1].includes("専門判断・根拠不足") && criteria[1][1].includes("自動回答を停止"));
  assert(body.includes("80％の分母は500件全体ではなく"));
  assert(body.includes("PoCで得た96％を、そのままシステム適格性確認テストの合格結果へ転用しません"));
  assert(body.includes("500件の実施完了・合格実績や本番効果を示すものではありません"));
});

test("automatic checks explicitly cover retrieved documents, condition checks, final route and handoff", () => {
  const section = body.split("### 自動照合する事項")[1].split("### 不一致ケースを調査する")[0];
  const checks = section.split(/\r?\n/).filter(line => line.startsWith("|")).map(line => line.split("|").slice(1, -1).map(cell => cell.trim()));
  for (const [label, expected] of [
    ["検索対象と取得文書", ["機種・環境・版数", "事前定義"]],
    ["回答許可", ["自動回答可否", "適用条件", "専門判断条件"]],
    ["最終的な処理経路", ["自動回答・有人引継ぎ", "停止"]],
    ["引継ぎ情報", ["確認済み事項", "参照文書", "未確認事項", "停止理由"]],
  ]) {
    const row = checks.find(row => row[0] === label);
    assert(row, label);
    for (const value of expected) assert(row[1].includes(value), `${label}: ${value}`);
  }
});

test("the existing day's history records the complementary test article exactly once", () => {
  const day = recentGrowth.filter(entry => entry.date === "2026-10-18");
  assert.equal(day.length, 1);
  assert.equal(growthPublishedTargets(day[0]).filter(target => target === id).length, 1);
  assert.equal(contentHistory(id, data).filter(event => event.type === "published").length, 1);
});
