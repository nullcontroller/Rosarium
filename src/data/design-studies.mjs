/** Explicit design studies, separate from the real-work Case evidence registry. */
export const designStudies = [
  { slug: "inquiry-analysis", area: "業務分析・要求定義", question: "どの問い合わせを自動化すべきか。", decision: "保留360件をCSと読み直し、操作案内だけで済む質問を選んで削減時間を計算する。", chapters: ["why-ai"] },
  { slug: "metadata-batch", area: "バッチ処理設計", question: "10,000件のマニュアルを初回に登録し、翌日の改訂をどう取り込むか。", decision: "初回は全件、通常は変更分、失敗時は対象の節だけを処理し、承認後に検索へ反映する。", chapters: ["knowledge-design"] },
  { slug: "qualification-testing", area: "品質保証・テスト設計", question: "回答・停止・有人対応をどう検証するか。", decision: "夜間に500件を送り、翌朝DX部がログ、CS部が回答と引継ぎを確認する。", chapters: ["poc-metadata-improvement"] },
  { slug: "data-migration", area: "データ移行設計", question: "切替準備中にもマニュアルが改訂されるとき、どう移行するか。", decision: "2か月前に変換・レビュー・CSの試用を行い、切替直前に更新分を追加する。", chapters: ["human-handoff"] },
  { slug: "rag-security", area: "セキュリティ設計", question: "社内向け情報を顧客向けAIへ渡さないためには。", decision: "同じ障害のFAQと社内報告書を分け、公開を承認したFAQだけをAIへ渡す。", chapters: ["stopping-conditions"] },
  { slug: "document-lifecycle", area: "運用・保守設計", question: "マニュアルの一節だけを変えたとき、全ページを確認し直す必要があるか。", decision: "変わっていない節は再利用し、変更節の候補や修正不要の判定だけを確認して反映する。", chapters: ["stopping-conditions"] },
].map(study => ({ ...study, id: `cases/design-studies/${study.slug}` }));

export function selectedDesignStudies(selectedIds = "") {
  const selected = new Set(selectedIds.split(",").map(id => id.trim()).filter(Boolean));
  return designStudies.filter(study => selected.has(study.id));
}

export const designAreaFor = id => designStudies.find(study => study.id === id)?.area;
