/** Logical ownership and reading routes; content files and canonical URLs stay put.
 * AI/DX entry_points remain cross-domain discovery metadata, not ownership.
 */
/** @type {Record<string,string>} */
export const domainLabels = { ai: "AI", dx: "DX", planning: "IT戦略・企画", "system-design": "システム設計", cases: "事例", career: "キャリア", reference: "参照資料" };
/** @type {Record<string,{primary:string,reason:string}>} */
export const domainAssignments = {
  "architecture/requirements-to-system-method": { primary: "system-design", reason: "業務要求を機能・非機能要件と方式の採否へ具体化する一般的な設計方法が中心。AIは方式候補の一つ。" },
  "essays/legacy-change-and-retirement": { primary: "system-design", reason: "依存関係の削減、変更の局所化と段階移行による保守・終焉の設計が中心。" },
  "essays/it-strategy-and-not-building": { primary: "planning", reason: "ライフサイクル費用と限られた資源から、作る・維持する・統合する・廃止する対象を選ぶ。" },
  "essays/rethink-work-before-ai": { primary: "planning", reason: "ECRSで業務の必要性を問い、システム化・AI化より前に対象範囲と手段を選ぶ。" },
  "essays/ai-investment-value-cost-evolution": { primary: "planning", reason: "AIを題材に、増分便益・総コスト・比較期間・撤退条件から投資の採否を判断することが中心。" },
  "essays/from-ai-efficiency-to-value": { primary: "dx", reason: "AIの操作や評価技術ではなく、余力の再配分、権限、業務負荷と成果指標を変え、業務・組織の価値へつなぐことが中心。" },
};
export const primaryDomain = entry => {
  if (entry.data.section === "cases" || entry.data.layer === "case") return "cases";
  if (entry.data.layer === "career") return "career";
  if (entry.data.layer === "reference") return "reference";
  return domainAssignments[entry.id]?.primary ?? (entry.data.entry_points?.length === 1 && entry.data.entry_points[0] === "dx" ? "dx" : "ai");
};
export const planningGroups = [
  { id: "reading", title: "業務課題とシステム化範囲", summary: "仕事の必要性と価値を問い、作る・作らないを選ぶ。", ids: ["essays/rethink-work-before-ai", "essays/it-strategy-and-not-building", "essays/dx-and-value"] },
  { id: "investment", title: "投資と成果を判断する", summary: "AIを題材に、総コスト・評価基準・得られる価値の関係を読む。", ids: ["essays/ai-investment-value-cost-evolution", "essays/ai-adoption-success-and-value", "essays/from-ai-efficiency-to-value"] },
  { id: "redesign", title: "業務・組織と既存システムを見直す", summary: "AIを前提とした組織の考察と、既存システムの変更・移行をつなぐ。", ids: ["essays/ai-capability-and-organization", "essays/legacy-change-and-retirement"] },
];
export const systemDesignGroups = [
  { id: "requirements", title: "要求・方式・ライフサイクル", summary: "AIの採用を前提にせず、要求から方式を選び、変更・移行・終了まで考える。", ids: ["architecture/requirements-to-system-method", "essays/legacy-change-and-retirement"] },
  { id: "ai-application", title: "AIを含むシステムへの応用", summary: "AI固有の不確実性を扱う設計はAI領域に残し、必要な場面で参照する。", ids: ["architecture/reference-architecture", "architecture/security-threat-modeling", "architecture/observability-and-slo", "evaluation-hitl/code-evaluation-acceptance", "knowledge-context/qa-operations"] },
];
export const systemDesignScope = [
  ["要件定義", "業務要求を機能要件・非機能要件・受入条件へ具体化する"],
  ["システム・ソフトウェアアーキテクチャ", "責務、構成要素、依存関係と実現方式を決める"],
  ["技術方式の選定", "要求と制約に対応する選択肢を比較し、採用・不採用の理由を残す"],
  ["処理方式・データ設計", "処理順序、状態、データの正本と整合性を設計する"],
  ["インターフェース・外部連携", "入出力の契約、権限、障害時の責任分担を決める"],
  ["性能・信頼性・セキュリティ", "応答、可用性、保護の条件を方式と確認方法へ落とす"],
  ["品質・テスト設計", "期待動作、異常系、回帰と合格条件を定める"],
  ["データ移行", "事前移行、差分、切替、切戻しと照合を計画する"],
  ["保守性・運用設計", "監視、変更、復旧とレガシーシステムの改善を扱う"],
];
/** Per-domain relevance is separate from Case ownership and experience claims. */
export const relatedCaseDefinitions = [
  { id: "cases/customer-support-ai-dx", domains: {
    ai: "RAGの検索対象制御、回答可否、評価と有人引継ぎを読む。",
    dx: "全件有人の問い合わせ業務から、顧客の自己解決と専門対応を分ける設計を読む。業務効果は未測定。",
    planning: "企画部門から受けた業務要求・目標を、著者がシステム要件と対象範囲へ具体化した過程を読む。",
    "system-design": "要件定義、機能分担、RAG管理基盤の方式・データ管理と品質評価を読む。",
  } },
  { id: "cases/specification-debt-review", domains: {
    ai: "AIの横断調査と、人間による根拠確認・修正判断の分担を読む。",
    "system-design": "長期保守された仕様と現行コードを照合し、整合性を確認する方法を読む。",
  } },
  { id: "cases/three-ai-maintenance", domains: {
    ai: "複数AIの調査・資料整理・実装支援を、人間の仕様判断へつなぐ工程を読む。",
    "system-design": "暗号処理の変更、異常系、復旧と既存機能への影響を整理する判断を読む。",
  } },
  { id: "cases/ai-technical-investigation", domains: {
    "system-design": "クラッシュ・メモリリークの仮説を調べ、根拠付きの修正候補を担当チームへ渡す過程を読む。",
  } },
];
export const relatedCasesForDomain = (domain, entries) => relatedCaseDefinitions.flatMap(definition => {
  const entry = entries.find(entry => entry.id === definition.id);
  const relevance = definition.domains[domain];
  return relevance && entry && entry.data.section === "cases" && entry.data.public !== false &&
    ["published", "stable"].includes(entry.data.status) && (entry.data.lifecycle ?? "active") === "active"
    ? [{ entry, relevance }] : [];
});
export const domainReferenceIds = domain => [...new Set([
  ...(domain === "planning" ? planningGroups : domain === "system-design" ? systemDesignGroups : []).flatMap(group => group.ids),
  ...relatedCaseDefinitions.filter(definition => definition.domains[domain]).map(definition => definition.id),
])];
export const domainReferences = entry => [...new Set([
  ...(entry.data.entry_points ?? ["ai"]),
  ...["ai", "dx", "planning", "system-design"].filter(domain => domainReferenceIds(domain).includes(entry.id)),
])];
