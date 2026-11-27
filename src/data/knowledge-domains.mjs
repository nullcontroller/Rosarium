/** Logical ownership and reading routes; content files and canonical URLs stay put.
 * AI/DX entry_points remain cross-domain discovery metadata, not ownership.
 */
/** @type {Record<string,string>} */
export const domainLabels = { ai: "AI・数理", dx: "DX", planning: "IT戦略・企画", "system-design": "システム設計", cases: "事例", career: "キャリア", reference: "参照資料" };
/** Shared descriptions of existing domains, not an additional classification.
 * @type {Record<string,{role:string,question:string,topics:string,boundary:string}>}
 */
export const domainResponsibilities = {
  planning: {
    role: "何を、なぜ、どこまでシステム化するかを決める。",
    question: "何を、なぜ、どこまで実現するのか。",
    topics: "経営・業務課題、価値発見、業務要求、システム化構想、投資・KPI・対象範囲、維持・刷新・統合・廃止の判断。",
    boundary: "目的と投資・範囲の判断を扱います。仕事の変革はDX、要求の実現方式はシステム設計で考えます。",
  },
  dx: {
    role: "デジタル技術による価値・業務・組織の変化。",
    question: "デジタル技術によって業務・組織・価値をどう変革するのか。",
    topics: "業務改革、ECRS、AI活用と知的協働、知識共有、教育、導入の定着・改善、組織設計と生産性。",
    boundary: "技術導入自体ではなく、仕事と組織に生じる変化を扱います。投資判断はIT戦略・企画、技術構成や品質の実現はシステム設計へ分けます。",
  },
  "system-design": {
    role: "要求を機能・品質・構成・処理・運用へ具体化する。",
    question: "要求をどのようなシステムとして実現するのか。",
    topics: "要件定義、アーキテクチャ、処理・データ・連携、性能・信頼性・セキュリティ、品質保証、移行・保守・運用。RAG・評価・HITLなどの応用設計も含みます。",
    boundary: "AIの使用を前提とせず、要求を実現する方式と品質を扱います。事業目的はIT戦略・企画、数学的・計算的原理はAI・数理と区別します。",
  },
  ai: {
    role: "AIを支える数学・生成原理・計算の基礎。",
    question: "AIはどのような数学的・計算的原理によって成立するのか。",
    topics: "確率・統計、分布、学習・推論の原理、モデルとアルゴリズム。条件付き確率・学習損失・生成と誤答・Attention・推論時計算を扱います。",
    boundary: "技術を支える原理を扱います。製品の操作や業務への適用はDX、RAGなどの応用システムの構成はシステム設計で考えます。",
  },
};
/** @type {Record<string,{primary:string,reason:string}>} */
export const domainAssignments = {
  "foundations/in-context-learning": { primary: "ai", reason: "文脈への条件付けと、限定した適応機構の数理的説明を扱う。" },
  "foundations/mixture-of-experts": { primary: "ai", reason: "条件付き計算の構造、負荷分散と通信費用の数理的関係を扱う。" },
  "foundations/state-space-sequence-models": { primary: "ai", reason: "状態更新による系列処理と、畳み込み・離散化の数学的条件を扱う。" },
  "foundations/mechanistic-interpretability": { primary: "ai", reason: "内部表現の近似と介入による因果的証拠の条件を数理的に読む。" },
  "foundations/transformer-computational-limits": { primary: "ai", reason: "計算資源の仮定とTransformerの理論的な計算能力を区別する。" },
  "foundations/neural-symbolic-proof": { primary: "ai", reason: "生成と証明検査の責務を分け、形式体系の保証と限界を読む。" },
  "foundations/diffusion-language-models": { primary: "ai", reason: "離散トークンの確率遷移と復元学習の数理的原理を扱う。" },
  "foundations/policy-gradient-learning": { primary: "ai", reason: "報酬と方策勾配の数学的原理を扱う。" },
  "foundations/preference-learning-dpo": { primary: "ai", reason: "選好確率とKL正則化の導出を扱う。" },
  "foundations/verifiable-reward-reasoning": { primary: "ai", reason: "検証報酬と方策更新の条件を扱う。" },
  "foundations/compute-optimal-scaling": { primary: "ai", reason: "経験的損失と制約付き資源配分を扱う。" },
  "foundations/speculative-decoding": { primary: "ai", reason: "受理棄却による分布保存と計算費用を扱う。" },
  "foundations/language-model-loss": { primary: "ai", reason: "承認済み第1段階の数理原理解説。原稿・表示のレビューを経て公開し、応用設計の責務と区別する。" },
  "foundations/attention-information-flow": { primary: "ai", reason: "承認済み第1段階の数理原理解説。原稿・表示のレビューを経て公開し、応用設計の責務と区別する。" },
  "foundations/test-time-compute-allocation": { primary: "ai", reason: "承認済み第1段階の数理原理解説。原稿・表示のレビューを経て公開し、応用設計の責務と区別する。" },
  "foundations/attention-efficiency": { primary: "ai", reason: "承認済み第1段階の数理原理解説。原稿・表示のレビューを経て公開し、応用設計の責務と区別する。" },

  "architecture/agents-tools-and-workflows": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "architecture/change-and-reevaluation": {
    "primary": "system-design",
    "reason": "モデル・検索・規則の変更を検知し、回帰評価と切戻しを設計する。"
  },
  "architecture/cost-latency-routing": {
    "primary": "system-design",
    "reason": "品質・費用・応答時間を満たす処理経路とモデル選択を設計する。"
  },
  "architecture/observability-and-slo": {
    "primary": "system-design",
    "reason": "工程別の監視、SLO、停止・復旧をシステムへ組み込む。"
  },
  "architecture/prompts-as-interfaces": {
    "primary": "system-design",
    "reason": "AI間の成果物、状態、版と受理条件をインターフェース契約として設計する。"
  },
  "architecture/reference-architecture": {
    "primary": "system-design",
    "reason": "生成モデルと検索・権限・検証・人間を構成要素へ分解する。"
  },
  "architecture/requirements-to-system-method": {
    "primary": "system-design",
    "reason": "業務要求を機能・非機能要件と方式選定へ具体化する。"
  },
  "architecture/security-threat-modeling": {
    "primary": "system-design",
    "reason": "情報・道具・実行の信頼境界と多層防御を設計する。"
  },
  "cases/understanding-systems-as-capability": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "essays/ai-adoption-success-and-value": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/ai-capability-and-organization": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/ai-career-market": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "essays/ai-case-sharing-and-judgment": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/ai-essence": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/ai-intellectual-collaboration": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/ai-investment-value-cost-evolution": {
    "primary": "planning",
    "reason": "基準となる既存手段、増分便益、総費用と撤退条件から投資を判断する。"
  },
  "essays/ai-operation-management-improvement": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/ai-roles-beyond-fde": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "essays/ai-use-and-operation": {
    "primary": "dx",
    "reason": "個人の操作と継続的な業務運用の能力差を考える。統合候補の判断は別途保留。"
  },
  "essays/ai-verification-cost-and-learning": {
    "primary": "dx",
    "reason": "操作・運用・改善、知的協働、知識共有、総工数、事業価値と組織設計を考える連載としてDXに一体で掲載。"
  },
  "essays/dx-and-value": {
    "primary": "dx",
    "reason": "DX学習を起点に価値の捉え方を考察する。品質監査の退役候補は実行せず維持。"
  },
  "essays/from-ai-efficiency-to-value": {
    "primary": "dx",
    "reason": "余力の再配分、権限と成果指標を変えて作業短縮を業務成果へ結ぶ。"
  },
  "essays/it-strategy-and-not-building": {
    "primary": "planning",
    "reason": "ライフサイクル費用と価値から作成・維持・統合・廃止の対象を選ぶ。"
  },
  "essays/legacy-change-and-retirement": {
    "primary": "system-design",
    "reason": "依存削減、変更の局所化と段階移行による保守・終了の設計が中心。"
  },
  "essays/model-competition-and-ecosystems": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "essays/rethink-work-before-ai": {
    "primary": "dx",
    "reason": "ECRSで不要工程を問い、個別作業の高速化より業務全体を再設計する。"
  },
  "essays/trust-in-ai-generated-content": {
    "primary": "dx",
    "reason": "読者の確認負担と編集責任から、AI生成物の信頼と共有を考える。"
  },
  "essays/what-not-to-build-with-ai": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "evaluation-hitl/code-evaluation-acceptance": {
    "primary": "system-design",
    "reason": "コード候補を仕様・独立した期待値・影響と権限に照らして採用する仕組みを設計する。"
  },
  "evaluation-hitl/customer-support-qa-poc": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "evaluation-hitl/datasets-and-regression": {
    "primary": "system-design",
    "reason": "正常・境界・危険ケースと版管理を回帰評価へ接続する。"
  },
  "evaluation-hitl/human-review-capability": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "evaluation-hitl/qa-evaluation": {
    "primary": "system-design",
    "reason": "検索・生成・回答停止・移管の品質と合格条件を分けて設計する。"
  },
  "evaluation-hitl/responsibility-and-hitl": {
    "primary": "system-design",
    "reason": "候補・検証・承認・実行の状態と責任・権限の境界を設計する。"
  },
  "foundations/ai-business-design/asking-versus-delegating": {
    "primary": "system-design",
    "reason": "AI・人間・既存システムの責任・情報・受理条件を設計するBookとして一体性を維持。業務効率・教育の章はDXからも参照する。"
  },
  "foundations/ai-business-design/delegation-and-responsibility": {
    "primary": "system-design",
    "reason": "AI・人間・既存システムの責任・情報・受理条件を設計するBookとして一体性を維持。業務効率・教育の章はDXからも参照する。"
  },
  "foundations/ai-business-design/evaluating-business-efficiency": {
    "primary": "system-design",
    "reason": "AI・人間・既存システムの責任・情報・受理条件を設計するBookとして一体性を維持。業務効率・教育の章はDXからも参照する。"
  },
  "foundations/ai-business-design/explainable-delegation": {
    "primary": "system-design",
    "reason": "AI・人間・既存システムの責任・情報・受理条件を設計するBookとして一体性を維持。業務効率・教育の章はDXからも参照する。"
  },
  "foundations/ai-business-design/human-judgment-capability": {
    "primary": "system-design",
    "reason": "AI・人間・既存システムの責任・情報・受理条件を設計するBookとして一体性を維持。業務効率・教育の章はDXからも参照する。"
  },
  "foundations/ai-business-design": {
    "primary": "system-design",
    "reason": "AI・人間・既存システムの責任・情報・受理条件を設計するBookとして一体性を維持。業務効率・教育の章はDXからも参照する。"
  },
  "foundations/answer-scope": {
    "primary": "system-design",
    "reason": "回答可能性と生成を分離し、根拠・適用条件・停止を実装する。"
  },
  "foundations/applicability-and-delegation": {
    "primary": "system-design",
    "reason": "情報・検証・権限・復旧の条件から実行の委任範囲を設計する。"
  },
  "foundations/conditional-probability": {
    "primary": "ai",
    "reason": "自己回帰分解と条件付き出力分布から生成原理を説明する。"
  },
  "foundations/generation-and-acceptance": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "foundations/guardrail-models": {
    "primary": "system-design",
    "reason": "数式を補助に、生成誘導・形式制約・検証・実行認可の四層を設計する。"
  },
  "foundations/hallucination-mechanisms": {
    "primary": "ai",
    "reason": "尤度と事実性の違い、観測情報の不足から誤答の発生原理を説明する。"
  },
  "foundations/layered-hallucination-controls": {
    "primary": "system-design",
    "reason": "生成から検出・採用・実行までの誤答流出を多層で制御する。"
  },
  "foundations/llm-as-probabilistic-model": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "foundations/temperature-design": {
    "primary": "ai",
    "reason": "Softmax、確率比、エントロピーとTemperatureの関係を説明する。"
  },
  "knowledge-context/context-before-model-performance": {
    "primary": "system-design",
    "reason": "実務の情報アクセス差を起点に、必要な根拠と確認経路の構成を考える。"
  },
  "knowledge-context/human-and-ai-documentation": {
    "primary": "system-design",
    "reason": "知識の正本を一つに保ち、人向け表示とAIアクセス層の同期を設計する。"
  },
  "knowledge-context/instruction-knowledge-evidence": {
    "primary": "system-design",
    "reason": "指示・継続知識・取得根拠を更新と障害分析の責務に分離する。"
  },
  "knowledge-context/prompt-failure-modes": {
    "primary": "system-design",
    "reason": "入力・制約・権限・検証の失敗を切り分け、回帰評価可能な部品として改善する。"
  },
  "knowledge-context/prompt-structure": {
    "primary": "system-design",
    "reason": "Task・入力・根拠・停止条件・出力契約を後工程とのインターフェースとして設計する。"
  },
  "knowledge-context/qa-behavior-constraints": {
    "primary": "system-design",
    "reason": "回答・停止・移管の規則とモデル判定・実行強制を分離する。"
  },
  "knowledge-context/qa-operations": {
    "primary": "system-design",
    "reason": "知識・検索・モデル・権限の版、監視と障害対応を設計する。"
  },
  "practices/adoption-governance": {
    "primary": "dx",
    "reason": "担当・記録・判断経路を整え、業務への定着と改善を扱う。"
  },
  "practices/ai-adoption-and-effective-use": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "practices/ai-education-principles": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "practices/education-and-capability": {
    "primary": "dx",
    "reason": "製品固有の操作と持続する判断能力を分け、組織の教育を設計する。"
  },
  "practices/transferring-ai-practices": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "practices/transferring-practices": {
    "primary": "dx",
    "reason": "異なる業務へ展開する際の成立条件、判断知識の共有と再評価を扱う。"
  },
  "software-engineering/ai-design-assistance": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "software-engineering/ai-driven-development": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "software-engineering/ai-technical-investigation-design": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "software-engineering/code-generation-and-work-design": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "software-engineering/code-generation-boundaries": {
    "primary": "ai",
    "reason": "旧・退役記事として現状を保全。現役の専門領域へ移行せず、品質監査の処遇判断を待つ。"
  },
  "software-engineering/code-generation-models": {
    "primary": "system-design",
    "reason": "学習原理の紹介を含むが、中心は検索・道具・状態・権限・検証を持つ製品構成の分解。"
  },
  "software-engineering/code-maintenance-context": {
    "primary": "system-design",
    "reason": "既存成果物を根拠とし、影響分析・局所変更・独立検証を成立させる条件を整理する。"
  },
  "software-engineering/development-workflow": {
    "primary": "system-design",
    "reason": "開発工程を成果物契約、検証ゲート、反映権限と復旧経路で接続する。"
  },
  "software-engineering/engineering-judgment-in-ai-code-review": {
    "primary": "cases",
    "reason": "著者自身のプラグイン調査で、解放順序と初期化の整合を確認した担当経験を扱う。"
  },
  "software-engineering/multi-ai-orchestration": {
    "primary": "system-design",
    "reason": "必要な情報環境、道具、権限を分離し、状態と成果物を接続する実現方式を設計する。"
  }
};
export const primaryDomain = entry => {
  if (entry.data.section === "cases" || entry.data.layer === "case") return "cases";
  if (entry.data.layer === "career") return "career";
  if (entry.data.layer === "reference") return "reference";
  const assignment = domainAssignments[entry.id];
  if (!assignment) throw new Error(`主分類が未定義です: ${entry.id}`);
  return assignment.primary;
};
export const planningGroups = [
  {
    "id": "reading",
    "title": "業務課題とシステム化範囲",
    "summary": "仕事の必要性と価値を問い、作る・作らないを選ぶ。",
    "ids": [
      "essays/it-strategy-and-not-building"
    ]
  },
  {
    "id": "investment",
    "title": "投資と成果を判断する",
    "summary": "AIを題材に、総コスト・評価基準・得られる価値の関係を読む。",
    "ids": [
      "essays/ai-investment-value-cost-evolution"
    ]
  }
];
export const systemDesignGroups = [
  {
    "id": "requirements",
    "title": "要求・方式・ライフサイクル",
    "summary": "要求と制約から方式を選び、AIを使わない選択も検討する。稼働後の監視・SLO、変更時の再評価・切り戻し、縮小・終了まで設計する。",
    "ids": [
      "architecture/requirements-to-system-method",
      "essays/legacy-change-and-retirement",
      "foundations/applicability-and-delegation",
      "foundations/ai-business-design"
    ]
  },
  {
    "id": "architecture",
    "title": "アーキテクチャと実行制御",
    "summary": "候補生成・検証・人間の承認・既存システムの実行を分離する。単一AIで足りるかを確認し、既知の制御はプログラムへ、必要な探索をAIへ分担する。",
    "ids": [
      "architecture/change-and-reevaluation",
      "architecture/cost-latency-routing",
      "architecture/observability-and-slo",
      "architecture/prompts-as-interfaces",
      "architecture/reference-architecture",
      "architecture/security-threat-modeling"
    ]
  },
  {
    "id": "knowledge-context",
    "title": "データ・ナレッジとコンテキスト",
    "summary": "指示・継続して使う知識・今回の根拠を分け、対象・版・権限に合う情報を渡す。文書の取得単位、入力の組立て、行動規則と失敗の診断を設計する。",
    "ids": [
      "knowledge-context/context-before-model-performance",
      "knowledge-context/human-and-ai-documentation",
      "knowledge-context/instruction-knowledge-evidence",
      "knowledge-context/prompt-failure-modes",
      "knowledge-context/prompt-structure",
      "knowledge-context/qa-behavior-constraints",
      "knowledge-context/qa-operations"
    ]
  },
  {
    "id": "quality",
    "title": "品質・評価・人間への引継ぎ",
    "summary": "候補の採用・承認・停止の責任を定め、人間が判断できない場合の引継ぎを設計する。回答・コードの検証、採用基準、回帰テスト、人間レビューを分ける。",
    "ids": [
      "evaluation-hitl/code-evaluation-acceptance",
      "evaluation-hitl/datasets-and-regression",
      "evaluation-hitl/qa-evaluation",
      "evaluation-hitl/responsibility-and-hitl",
      "foundations/answer-scope",
      "foundations/guardrail-models",
      "foundations/layered-hallucination-controls"
    ]
  },
  {
    "id": "development",
    "title": "ソフトウェア開発・保守",
    "summary": "変更の適用判断から、必要情報と検証条件、工程と責務の分担へ進む。調査・変更・テスト・反映を、検証可能な保守工程としてつなぐ。",
    "ids": [
      "software-engineering/code-generation-models",
      "software-engineering/code-maintenance-context",
      "software-engineering/development-workflow",
      "software-engineering/multi-ai-orchestration"
    ]
  }
];
/** Discovery uses one primary owner; contextual evidence links are handled separately. */
export const domainReferences = entry => [primaryDomain(entry)];
export const sameDomainRelatedEntries = (entry, candidates) => candidates.filter(candidate =>
  candidate.id !== entry.id && primaryDomain(candidate) === primaryDomain(entry) &&
  candidate.data.public !== false && ["published", "stable"].includes(candidate.data.status) &&
  (candidate.data.lifecycle ?? "active") === "active");
/** @template {{id:string,data:any}} T @param {string} domain @param {T[]} entries @returns {T[]} */
export const domainEntries = (domain, entries) => entries.filter(entry =>
  primaryDomain(entry) === domain && (entry.data.lifecycle ?? "active") === "active" &&
  entry.data.public !== false && ["published", "stable"].includes(entry.data.status) &&
  (!entry.data.series || entry.data.order === 0));
export const domainReferenceIds = domain => (domain === 'planning' ? planningGroups : domain === 'system-design' ? systemDesignGroups : []).flatMap(group => group.ids);
