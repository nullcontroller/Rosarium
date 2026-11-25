/** Logical ownership and reading routes; content files and canonical URLs stay put.
 * AI/DX entry_points remain cross-domain discovery metadata, not ownership.
 */
/** @type {Record<string,string>} */
export const domainLabels = { ai: "AI", dx: "DX", planning: "IT戦略・企画", "system-design": "システム設計", cases: "実践事例", career: "キャリア", reference: "参照資料" };
/** @type {Record<string,{primary:string,reason:string}>} */
export const domainAssignments = {
  "architecture/requirements-to-system-method": { primary: "system-design", reason: "業務要求を機能・非機能要件と方式の採否へ具体化する一般的な設計方法が中心。AIは方式候補の一つ。" },
  "essays/legacy-change-and-retirement": { primary: "system-design", reason: "依存関係の削減、変更の局所化と段階移行による保守・終焉の設計が中心。" },
  "essays/it-strategy-and-not-building": { primary: "planning", reason: "ライフサイクル費用と限られた資源から、作る・維持する・統合する・廃止する対象を選ぶ。" },
  "essays/rethink-work-before-ai": { primary: "planning", reason: "ECRSで業務の必要性を問い、システム化・AI化より前に対象範囲と手段を選ぶ。" },
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
  { id: "case-design", title: "実務事例から設計判断を読む", summary: "実践事例に置いた正本へ進み、担当範囲・制約・判断・確認結果を確かめる。", ids: ["cases/customer-support-ai-dx", "cases/three-ai-maintenance", "cases/specification-debt-review", "cases/ai-technical-investigation"] },
  { id: "ai-application", title: "AIを含むシステムへの応用", summary: "AI固有の不確実性を扱う設計はAI領域に残し、必要な場面で参照する。", ids: ["architecture/reference-architecture", "architecture/security-threat-modeling", "architecture/observability-and-slo", "evaluation-hitl/code-evaluation-acceptance", "knowledge-context/qa-operations"] },
];
export const systemDesignScope = [
  ["要件定義", "業務要求を機能要件・非機能要件・受入条件へ具体化する"],
  ["システム・ソフトウェアアーキテクチャ", "責務、構成要素、依存関係と実現方式を決める"],
  ["処理方式・データ設計", "処理順序、状態、データの正本と整合性を設計する"],
  ["インターフェース・外部連携", "入出力の契約、権限、障害時の責任分担を決める"],
  ["性能・信頼性・セキュリティ", "応答、可用性、保護の条件を方式と確認方法へ落とす"],
  ["品質・テスト設計", "期待動作、異常系、回帰と合格条件を定める"],
  ["データ移行", "事前移行、差分、切替、切戻しと照合を計画する"],
  ["保守性・運用設計", "監視、変更、復旧とレガシーシステムの改善を扱う"],
];
export const domainReferenceIds = domain => [...new Set((domain === "planning" ? planningGroups : systemDesignGroups).flatMap(group => group.ids))];
export const domainReferences = entry => [...new Set([
  ...(entry.data.entry_points ?? ["ai"]),
  ...["planning", "system-design"].filter(domain => domainReferenceIds(domain).includes(entry.id)),
])];
