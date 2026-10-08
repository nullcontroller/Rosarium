import type { designTopics, Entry } from "./navigation";

/** Reading map, distinct from the metadata categories used by the full index. */
export const aiDesignAreas = [
  { id: "value-applicability", title: "価値・AI適用判断", summary: "誰にどんな価値を生むかから始め、AIを使わない選択も含めて、必要な最小の委任範囲を決めます。", path: "foundations/applicability-and-delegation", scope: "設計原則" },
  { id: "business-efficiency", title: "業務全体の効果", summary: "生成の速さだけでなく、確認・説明・手戻り・合意まで含めて、工数と完了までの時間を評価します。", path: "foundations/ai-business-design/evaluating-business-efficiency", scope: "業務設計" },
  { id: "responsibility-hitl", title: "責任境界・Human in the Loop", summary: "AIの候補を誰が確認・採用・承認するかを決め、人間が判断できない場合の停止と引き継ぎを設計します。", path: "evaluation-hitl/responsibility-and-hitl", scope: "設計ガイド" },
  { id: "knowledge-context", title: "Knowledge / Context設計", summary: "指示、継続して使う知識、今回の根拠を分け、対象・版・権限に合った情報をAIへ渡します。", path: "ai-design/knowledge-context", scope: "領域別の記事" },
  { id: "evaluation", title: "AI評価設計", summary: "回答やコードの検証、採用基準、回帰テスト、人間レビューを分け、品質と業務価値を評価します。", path: "ai-design/evaluation-hitl", scope: "領域別の記事" },
  { id: "architecture-integration", title: "AIアーキテクチャ・既存システム統合", summary: "AIによる候補生成、システムによる検証、人間の承認、既存システムの実行を分離し、一つの業務システムへつなぎます。", path: "architecture/reference-architecture", scope: "参照アーキテクチャ" },
  { id: "agent-workflow", title: "Agent / Tool / Workflow設計", summary: "単一AIで足りるかを判断し、必要な情報・道具・権限・状態を定義します。既知の制御はプログラムへ置き、動的な探索だけをAIへ任せます。", path: "software-engineering/multi-ai-orchestration", scope: "設計ガイド" },
  { id: "security-authority", title: "AIセキュリティ・権限制御", summary: "信用できない入力、情報漏えい、外部操作の脅威を境界ごとに確認し、最小権限と停止・復旧手段を設計します。", path: "architecture/security-threat-modeling", scope: "設計ガイド" },
  { id: "adoption-operation", title: "AI導入・定着・改善", summary: "担当者、例外対応、教育、業務成果を確認し、日々の運用結果を委任範囲と仕事の改善へ戻します。", path: "practices/adoption-governance", scope: "実務ガイド" },
  { id: "lifecycle", title: "監視・再評価・終了", summary: "品質・費用・異常を観測し、変更時に評価し直します。必要なら範囲縮小、統合、停止、終了を選び、仕事を引き継ぎます。", path: "ai-design/lifecycle-operations", scope: "領域別の記事" },
] as const;

type DesignTopic = (typeof designTopics)[number][0];
type TopicGuide = {
  question: string;
  readingOrder: readonly string[];
  next: { path: string; title: string; reason: string };
};

// Categories retain their URLs and membership; this order follows the questions
// answered by their articles rather than filesystem or publication order.
export const aiDesignTopicGuides = {
  applicability: {
    question: "どの業務でAIを使い、どこまで任せると価値が生まれるか。価値・リスク・検証可能性から、利用しない選択も含めて判断します。",
    readingOrder: ["foundations/applicability-and-delegation"],
    next: { path: "ai-design/responsibility-control", title: "責任境界・制御", reason: "任せる範囲を決めたら、採用・承認・停止の責任を定めます。" },
  },
  "responsibility-control": {
    question: "誰がAIの候補を採用し、何を根拠に止めるか。まず責任と承認を決め、次に誤答を業務へ流さない制御を具体化します。",
    readingOrder: ["evaluation-hitl/responsibility-and-hitl", "foundations/layered-hallucination-controls", "foundations/answer-scope", "foundations/guardrail-models"],
    next: { path: "ai-design/knowledge-context", title: "ナレッジ / コンテキスト", reason: "判断や検証に必要な情報を、取得・更新できる形へ整えます。" },
  },
  "knowledge-context": {
    question: "AIが何を根拠に答える状態を作るか。情報の責務分離から、文書の取得単位、入力の組み立て、行動規則、失敗の診断へ進みます。",
    readingOrder: ["knowledge-context/instruction-knowledge-evidence", "knowledge-context/human-and-ai-documentation", "knowledge-context/prompt-structure", "knowledge-context/qa-behavior-constraints", "knowledge-context/prompt-failure-modes"],
    next: { path: "ai-design/evaluation-hitl", title: "評価・ヒューマンレビュー", reason: "情報が存在するかだけでなく、取得・利用・採用が正しく行われたかを評価します。" },
  },
  "evaluation-hitl": {
    question: "何をもって採用可能と判断するか。共通の評価データを準備し、QA回答とコード変更それぞれの検証方法へ進みます。人間へ判断を戻す責任は、責任境界・制御で扱います。",
    readingOrder: ["evaluation-hitl/datasets-and-regression", "evaluation-hitl/qa-evaluation", "evaluation-hitl/code-evaluation-acceptance"],
    next: { path: "ai-design/architecture", title: "システムアーキテクチャ", reason: "生成・検証・承認・実行を、一つの業務システムの境界へ配置します。" },
  },
  architecture: {
    question: "AIの候補を、既存システムの確定処理へどうつなぐか。全体構成を起点に、受け渡し契約、脅威と権限、処理経路の選択を設計します。",
    readingOrder: ["architecture/reference-architecture", "architecture/prompts-as-interfaces", "architecture/security-threat-modeling", "architecture/cost-latency-routing"],
    next: { path: "ai-design/software-engineering", title: "ソフトウェア開発", reason: "構成と権限の境界を、調査・生成・検証の具体的な工程へ適用します。" },
  },
  "software-engineering": {
    question: "開発・保守のどの工程をAIへ任せるか。変更の適用判断、既存成果物を根拠にする条件、単一AIと複数AIの工程設計を順に確認します。",
    readingOrder: ["software-engineering/development-workflow", "software-engineering/code-maintenance-context", "software-engineering/multi-ai-orchestration"],
    next: { path: "ai-design/lifecycle-operations", title: "ライフサイクル・運用", reason: "採用した構成を監視し、変更・事故・終了まで継続して判断します。" },
  },
  "lifecycle-operations": {
    question: "稼働中に何を観測し、いつ見直すか。監視とSLO、変更時の再評価・切り戻し、QAで見つかった知識の不足を改善へ戻す方法を扱います。導入体制や教育とは分けて、稼働後の技術的な運用を確認します。",
    readingOrder: ["architecture/observability-and-slo", "architecture/change-and-reevaluation", "knowledge-context/qa-operations"],
    next: { path: "practices/adoption-governance", title: "AI導入を業務へ定着させる", reason: "観測した結果を、担当者・教育・委任範囲・利用継続の判断へ戻します。" },
  },
} as const satisfies Record<DesignTopic, TopicGuide>;

export const aiDesignTopicOrder = Object.keys(aiDesignTopicGuides) as DesignTopic[];

export function orderedDesignEntries(entries: Entry[], topic: DesignTopic) {
  const selected = entries.filter((entry) => entry.data.layer === "ai-design" && entry.data.design_topic === topic);
  const order: readonly string[] = aiDesignTopicGuides[topic].readingOrder;
  for (const id of order) {
    if (!selected.some((entry) => entry.id === id)) {
      throw new Error(`${topic}: reading guide target is missing or outside its category: ${id}`);
    }
  }
  const rank = (id: string) => order.includes(id) ? order.indexOf(id) : order.length;
  return selected.sort((a, b) => rank(a.id) - rank(b.id));
}
