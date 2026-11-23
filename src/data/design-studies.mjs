/** Explicit design studies, separate from the real-work Case evidence registry. */
export const designStudies = [
  { slug: "inquiry-analysis", area: "業務要件", question: "どの問い合わせを自動化すべきか。", decision: "保留案件を現場の判断条件で分類し、件数・工数と追加負担から効果を見積もる。", chapters: ["why-ai"] },
  { slug: "metadata-batch", area: "バッチ処理・データ管理", question: "大量の文書を、品質を保って登録するには。", decision: "生成と承認を分け、失敗した処理だけを重複なく再実行する。", chapters: ["knowledge-design"] },
  { slug: "qualification-testing", area: "システムテスト・性能", question: "回答・停止・有人対応をどう検証するか。", decision: "属性・経路の自動照合と業務レビューを分担し、データ量確定後に性能を測る。", chapters: ["poc-metadata-improvement"] },
  { slug: "data-migration", area: "移行・業務受入れ", question: "構造を変えながら既存業務を継続するには。", decision: "事前移行へ品質確認と現場の受入れを組み込み、最終差分を確認して切り替える。", chapters: ["human-handoff"] },
  { slug: "rag-security", area: "セキュリティ・認可", question: "社内向け情報を顧客向けAIへ渡さないためには。", decision: "公開承認済みの版だけを連携し、検索属性とは別に取得権限と失効を管理する。", chapters: ["stopping-conditions"] },
  { slug: "document-lifecycle", area: "保守・版管理", question: "改訂時の確認負担と品質をどう両立するか。", decision: "差分と影響範囲をレビューし、本文と属性を整合した版として有効化する。", chapters: ["stopping-conditions"] },
].map(study => ({ ...study, id: `cases/design-studies/${study.slug}` }));

export function selectedDesignStudies(selectedIds = "") {
  const selected = new Set(selectedIds.split(",").map(id => id.trim()).filter(Boolean));
  return designStudies.filter(study => selected.has(study.id));
}
