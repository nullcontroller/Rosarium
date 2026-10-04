export type CaseNodeKind =
  "human" | "ai" | "knowledge" | "system" | "decision" | "feedback";
export interface CaseDiagramModel {
  title: string;
  description: string;
  nodes: {
    id: string;
    label: string;
    kind: CaseNodeKind;
    description: string;
  }[];
  rows?: string[][];
  edges?: { from: string; to: string; label: string; dashed?: boolean }[];
  groups?: { title: string; ids: string[] }[];
  messages?: { from: string; to: string; label: string; dashed: boolean }[];
}
// Reader-facing explanations; imported artifacts remain evidence in the chapters.
export const caseDiagrams: Record<string, CaseDiagramModel> = {
  "support-continuous-improvement": {
    title: "利用結果を次の設計へ戻す",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "D",
        label: "Design",
        kind: "system",
        description: "Design。次の工程：Use。",
      },
      {
        id: "U",
        label: "Use",
        kind: "system",
        description: "Use。次の工程：Observe。",
      },
      {
        id: "O",
        label: "Observe",
        kind: "feedback",
        description: "Observe。次の工程：Evaluate。",
      },
      {
        id: "E",
        label: "Evaluate",
        kind: "feedback",
        description: "Evaluate。次の工程：Find Failure。",
      },
      {
        id: "F",
        label: "Find Failure",
        kind: "system",
        description:
          "Find Failure。次の工程：Knowledge / Retrieval / UI / Processを改善。",
      },
      {
        id: "I",
        label: "Knowledge / Retrieval / UI / Processを改善",
        kind: "knowledge",
        description:
          "Knowledge / Retrieval / UI / Processを改善。次の工程：Design。",
      },
    ],
    edges: [
      {
        from: "D",
        to: "U",
        label: "",
        dashed: false,
      },
      {
        from: "U",
        to: "O",
        label: "",
        dashed: false,
      },
      {
        from: "O",
        to: "E",
        label: "",
        dashed: false,
      },
      {
        from: "E",
        to: "F",
        label: "",
        dashed: false,
      },
      {
        from: "F",
        to: "I",
        label: "",
        dashed: false,
      },
      {
        from: "I",
        to: "D",
        label: "",
        dashed: false,
      },
    ],
    rows: [["D"], ["U"], ["O"], ["E"], ["F"], ["I"]],
    groups: [],
  },
  "support-executive-summary": {
    title: "全件有人から、自己解決と専門対応を分ける",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "B1",
        label: "顧客",
        kind: "system",
        description: "顧客。次の工程：サポート担当者。",
      },
      {
        id: "B2",
        label: "サポート担当者",
        kind: "human",
        description: "サポート担当者。次の工程：追加質問。",
      },
      {
        id: "B3",
        label: "追加質問",
        kind: "system",
        description: "追加質問。次の工程：複数資料を検索。",
      },
      {
        id: "B4",
        label: "複数資料を検索",
        kind: "knowledge",
        description: "複数資料を検索。次の工程：原因判断。",
      },
      {
        id: "B5",
        label: "原因判断",
        kind: "system",
        description: "原因判断。次の工程：回答。",
      },
      {
        id: "B6",
        label: "回答",
        kind: "system",
        description: "回答。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "A1",
        label: "顧客",
        kind: "system",
        description: "顧客。次の工程：AIとの対話。",
      },
      {
        id: "A2",
        label: "AIとの対話",
        kind: "ai",
        description: "AIとの対話。次の工程：RAG / Knowledge。",
      },
      {
        id: "A3",
        label: "RAG / Knowledge",
        kind: "knowledge",
        description: "RAG / Knowledge。次の工程：根拠と判断条件。",
      },
      {
        id: "A4",
        label: "根拠と判断条件",
        kind: "decision",
        description:
          "根拠と判断条件。次の工程：回答可能：自己解決／専門判断が必要：情報を保ったまま人間へ。",
      },
      {
        id: "A5",
        label: "自己解決",
        kind: "system",
        description: "自己解決。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "A6",
        label: "情報を保ったまま人間へ",
        kind: "human",
        description:
          "情報を保ったまま人間へ。この工程の位置と前後のつながりを確認します。",
      },
    ],
    edges: [
      {
        from: "B1",
        to: "B2",
        label: "",
        dashed: false,
      },
      {
        from: "B2",
        to: "B3",
        label: "",
        dashed: false,
      },
      {
        from: "B3",
        to: "B4",
        label: "",
        dashed: false,
      },
      {
        from: "B4",
        to: "B5",
        label: "",
        dashed: false,
      },
      {
        from: "B5",
        to: "B6",
        label: "",
        dashed: false,
      },
      {
        from: "A1",
        to: "A2",
        label: "",
        dashed: false,
      },
      {
        from: "A2",
        to: "A3",
        label: "",
        dashed: false,
      },
      {
        from: "A3",
        to: "A4",
        label: "",
        dashed: false,
      },
      {
        from: "A4",
        to: "A5",
        label: "回答可能",
        dashed: false,
      },
      {
        from: "A4",
        to: "A6",
        label: "専門判断が必要",
        dashed: false,
      },
    ],
    rows: [
      ["B1", "A1"],
      ["B2", "A2"],
      ["B3", "A3"],
      ["B4", "A4"],
      ["B5", "A5", "A6"],
      ["B6"],
    ],
    groups: [
      {
        title: "Before",
        ids: ["B1", "B2", "B3", "B4", "B5", "B6"],
      },
      {
        title: "After",
        ids: ["A1", "A2", "A3", "A4", "A5", "A6"],
      },
    ],
  },
  "support-human-handoff": {
    title: "確認済み情報を保って人へ引き継ぐ",
    description:
      "顧客・AI・Knowledge・担当者の間で受け渡す情報を、元の順序で示します。",
    nodes: [
      {
        id: "C",
        label: "顧客",
        kind: "system",
        description: "顧客が担当する工程を時系列で確認します。",
      },
      {
        id: "A",
        label: "AI / QA",
        kind: "ai",
        description: "AI / QAが担当する工程を時系列で確認します。",
      },
      {
        id: "K",
        label: "Knowledge",
        kind: "knowledge",
        description: "Knowledgeが担当する工程を時系列で確認します。",
      },
      {
        id: "H",
        label: "サポート担当者",
        kind: "human",
        description: "サポート担当者が担当する工程を時系列で確認します。",
      },
    ],
    messages: [
      {
        from: "C",
        to: "A",
        label: "自然な言葉で問い合わせ",
        dashed: false,
      },
      {
        from: "A",
        to: "C",
        label: "不足情報を一つずつ確認",
        dashed: false,
      },
      {
        from: "A",
        to: "K",
        label: "機種・版・公開範囲を付けて検索",
        dashed: false,
      },
      {
        from: "K",
        to: "A",
        label: "根拠候補",
        dashed: true,
      },
      {
        from: "A",
        to: "A",
        label: "停止条件を判定",
        dashed: false,
      },
      {
        from: "A",
        to: "H",
        label: "確認済み情報・根拠・停止理由",
        dashed: true,
      },
      {
        from: "A",
        to: "C",
        label: "確認内容を担当者へ引継ぎ済みと表示",
        dashed: true,
      },
      {
        from: "H",
        to: "C",
        label: "続きから専門対応",
        dashed: false,
      },
    ],
  },
  "support-knowledge-design": {
    title: "回答に使える根拠を絞る",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "Q",
        label: "問い合わせと対話で得たContext",
        kind: "system",
        description:
          "問い合わせと対話で得たContext。次の工程：対象機種で絞る。",
      },
      {
        id: "F1",
        label: "対象機種で絞る",
        kind: "system",
        description: "対象機種で絞る。次の工程：有効な版で絞る。",
      },
      {
        id: "F2",
        label: "有効な版で絞る",
        kind: "system",
        description: "有効な版で絞る。次の工程：顧客へ公開可能な情報へ絞る。",
      },
      {
        id: "F3",
        label: "顧客へ公開可能な情報へ絞る",
        kind: "system",
        description:
          "顧客へ公開可能な情報へ絞る。次の工程：意味検索 / キーワード検索。",
      },
      {
        id: "S",
        label: "意味検索 / キーワード検索",
        kind: "knowledge",
        description:
          "意味検索 / キーワード検索。次の工程：回答根拠として十分か。",
      },
      {
        id: "V",
        label: "回答根拠として十分か",
        kind: "decision",
        description:
          "回答根拠として十分か。次の工程：Yes：生成AIへGrounding Contextを渡す／No：人間へ引き継ぐ。",
      },
      {
        id: "G",
        label: "生成AIへGrounding Contextを渡す",
        kind: "ai",
        description:
          "生成AIへGrounding Contextを渡す。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H",
        label: "人間へ引き継ぐ",
        kind: "human",
        description:
          "人間へ引き継ぐ。この工程の位置と前後のつながりを確認します。",
      },
    ],
    edges: [
      {
        from: "Q",
        to: "F1",
        label: "",
        dashed: false,
      },
      {
        from: "F1",
        to: "F2",
        label: "",
        dashed: false,
      },
      {
        from: "F2",
        to: "F3",
        label: "",
        dashed: false,
      },
      {
        from: "F3",
        to: "S",
        label: "",
        dashed: false,
      },
      {
        from: "S",
        to: "V",
        label: "",
        dashed: false,
      },
      {
        from: "V",
        to: "G",
        label: "Yes",
        dashed: false,
      },
      {
        from: "V",
        to: "H",
        label: "No",
        dashed: false,
      },
    ],
    rows: [["Q"], ["F1"], ["F2"], ["F3"], ["S"], ["V"], ["G", "H"]],
    groups: [],
  },
  "support-poc-evaluation": {
    title: "検索・対話・回答・業務受入を分けて評価する",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "I",
        label: "問い合わせ",
        kind: "system",
        description: "問い合わせ。次の工程：Retrieval Evaluation。",
      },
      {
        id: "RE",
        label: "Retrieval Evaluation",
        kind: "system",
        description:
          "Retrieval Evaluation。次の工程：Dialogue / Context Evaluation／対象・版・公開範囲に適合した根拠か。",
      },
      {
        id: "DE",
        label: "Dialogue / Context Evaluation",
        kind: "system",
        description:
          "Dialogue / Context Evaluation。次の工程：Generation Evaluation／不足情報を確認できるか。",
      },
      {
        id: "AE",
        label: "Generation Evaluation",
        kind: "system",
        description:
          "Generation Evaluation。次の工程：Business Acceptance／根拠から逸脱せず提示可能か。",
      },
      {
        id: "BA",
        label: "Business Acceptance",
        kind: "system",
        description:
          "Business Acceptance。次の工程：自己解決と人間への移行が業務として成立するか。",
      },
      {
        id: "RQ",
        label: "対象・版・公開範囲に適合した根拠か",
        kind: "knowledge",
        description:
          "対象・版・公開範囲に適合した根拠か。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "DQ",
        label: "不足情報を確認できるか",
        kind: "system",
        description:
          "不足情報を確認できるか。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "AQ",
        label: "根拠から逸脱せず提示可能か",
        kind: "knowledge",
        description:
          "根拠から逸脱せず提示可能か。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "BQ",
        label: "自己解決と人間への移行が業務として成立するか",
        kind: "human",
        description:
          "自己解決と人間への移行が業務として成立するか。この工程の位置と前後のつながりを確認します。",
      },
    ],
    edges: [
      {
        from: "I",
        to: "RE",
        label: "",
        dashed: false,
      },
      {
        from: "RE",
        to: "DE",
        label: "",
        dashed: false,
      },
      {
        from: "DE",
        to: "AE",
        label: "",
        dashed: false,
      },
      {
        from: "AE",
        to: "BA",
        label: "",
        dashed: false,
      },
      {
        from: "RE",
        to: "RQ",
        label: "",
        dashed: true,
      },
      {
        from: "DE",
        to: "DQ",
        label: "",
        dashed: true,
      },
      {
        from: "AE",
        to: "AQ",
        label: "",
        dashed: true,
      },
      {
        from: "BA",
        to: "BQ",
        label: "",
        dashed: true,
      },
    ],
    rows: [["I"], ["RE", "RQ"], ["DE", "DQ"], ["AE", "AQ"], ["BA", "BQ"]],
    groups: [],
  },
  "support-responsibility-boundary": {
    title: "AIと人間の回答責任を分ける",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "Q",
        label: "問い合わせ",
        kind: "system",
        description: "問い合わせ。次の工程：AI。",
      },
      {
        id: "A",
        label: "AI",
        kind: "ai",
        description: "AI。次の工程：既存システム / Knowledge。",
      },
      {
        id: "K",
        label: "既存システム / Knowledge",
        kind: "knowledge",
        description: "既存システム / Knowledge。次の工程：回答条件を満たすか。",
      },
      {
        id: "J",
        label: "回答条件を満たすか",
        kind: "decision",
        description:
          "回答条件を満たすか。次の工程：満たす：根拠に基づく回答／満たさない：人間へ引継ぎ。",
      },
      {
        id: "R",
        label: "根拠に基づく回答",
        kind: "knowledge",
        description:
          "根拠に基づく回答。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H",
        label: "人間へ引継ぎ",
        kind: "human",
        description:
          "人間へ引継ぎ。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "A1",
        label: "自然な表現の理解",
        kind: "system",
        description:
          "自然な表現の理解。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "A2",
        label: "不足情報の追加質問",
        kind: "system",
        description:
          "不足情報の追加質問。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "A3",
        label: "Knowledge検索",
        kind: "knowledge",
        description:
          "Knowledge検索。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "A4",
        label: "根拠に沿った回答案",
        kind: "knowledge",
        description:
          "根拠に沿った回答案。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H1",
        label: "専門判断",
        kind: "system",
        description: "専門判断。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H2",
        label: "個別調査",
        kind: "system",
        description: "個別調査。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H3",
        label: "影響の大きい判断",
        kind: "system",
        description:
          "影響の大きい判断。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H4",
        label: "例外対応",
        kind: "system",
        description: "例外対応。この工程の位置と前後のつながりを確認します。",
      },
    ],
    edges: [
      {
        from: "Q",
        to: "A",
        label: "",
        dashed: false,
      },
      {
        from: "A",
        to: "K",
        label: "",
        dashed: false,
      },
      {
        from: "K",
        to: "J",
        label: "",
        dashed: false,
      },
      {
        from: "J",
        to: "R",
        label: "満たす",
        dashed: false,
      },
      {
        from: "J",
        to: "H",
        label: "満たさない",
        dashed: false,
      },
    ],
    rows: [
      ["Q"],
      ["A"],
      ["K"],
      ["J"],
      ["R", "H"],
      ["A1", "H1"],
      ["A2", "H2"],
      ["A3", "H3"],
      ["A4", "H4"],
    ],
    groups: [
      {
        title: "AIの役割",
        ids: ["A1", "A2", "A3", "A4"],
      },
      {
        title: "人間の役割",
        ids: ["H1", "H2", "H3", "H4"],
      },
    ],
  },
  "support-stopping-conditions": {
    title: "回答を止め、人へ移す条件",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "start",
        label: "開始",
        kind: "system",
        description: "開始。次の工程：問い合わせ受付：Collecting。",
      },
      {
        id: "Collecting",
        label: "Collecting",
        kind: "decision",
        description:
          "Collecting。次の工程：必要情報がそろう：Retrieving／情報を特定できない：Human。",
      },
      {
        id: "Retrieving",
        label: "Retrieving",
        kind: "decision",
        description:
          "Retrieving。次の工程：適合する公開可能な根拠：Answering／根拠不足 / 矛盾 / 非公開：Human。",
      },
      {
        id: "Human",
        label: "Human",
        kind: "human",
        description: "Human。次の工程：終了。",
      },
      {
        id: "Answering",
        label: "Answering",
        kind: "decision",
        description:
          "Answering。次の工程：低リスクで回答可能：Completed／専門判断 / 高影響：Human。",
      },
      {
        id: "Completed",
        label: "Completed",
        kind: "system",
        description: "Completed。次の工程：終了。",
      },
      {
        id: "end",
        label: "終了",
        kind: "system",
        description: "終了。この工程の位置と前後のつながりを確認します。",
      },
    ],
    edges: [
      {
        from: "start",
        to: "Collecting",
        label: "問い合わせ受付",
      },
      {
        from: "Collecting",
        to: "Retrieving",
        label: "必要情報がそろう",
      },
      {
        from: "Collecting",
        to: "Human",
        label: "情報を特定できない",
      },
      {
        from: "Retrieving",
        to: "Answering",
        label: "適合する公開可能な根拠",
      },
      {
        from: "Retrieving",
        to: "Human",
        label: "根拠不足 / 矛盾 / 非公開",
      },
      {
        from: "Answering",
        to: "Completed",
        label: "低リスクで回答可能",
      },
      {
        from: "Answering",
        to: "Human",
        label: "専門判断 / 高影響",
      },
      {
        from: "Human",
        to: "end",
        label: "",
      },
      {
        from: "Completed",
        to: "end",
        label: "",
      },
    ],
    rows: [
      ["start"],
      ["Collecting"],
      ["Retrieving"],
      ["Answering", "Human"],
      ["Completed"],
      ["end"],
    ],
    groups: [],
  },
  "support-why-ai": {
    title: "業務価値から適用手段を選ぶ",
    description:
      "本文の工程・分岐・役割を示します。ノードを選ぶと前後の関係を確認できます。",
    nodes: [
      {
        id: "V",
        label: "顧客と担当者へ届けたい価値",
        kind: "human",
        description:
          "顧客と担当者へ届けたい価値。次の工程：変えたい業務プロセス。",
      },
      {
        id: "P",
        label: "変えたい業務プロセス",
        kind: "system",
        description:
          "変えたい業務プロセス。次の工程：AI・人間・既存システムの役割。",
      },
      {
        id: "R",
        label: "AI・人間・既存システムの役割",
        kind: "human",
        description:
          "AI・人間・既存システムの役割。次の工程：必要な能力は何か。",
      },
      {
        id: "T",
        label: "必要な能力は何か",
        kind: "decision",
        description:
          "必要な能力は何か。次の工程：自然な表現を解釈：生成AI／根拠を探す：RAG／確定的に処理できる：ルール / 既存システム／専門判断が必要：人間。",
      },
      {
        id: "L",
        label: "生成AI",
        kind: "ai",
        description: "生成AI。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "G",
        label: "RAG",
        kind: "knowledge",
        description: "RAG。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "S",
        label: "ルール / 既存システム",
        kind: "system",
        description:
          "ルール / 既存システム。この工程の位置と前後のつながりを確認します。",
      },
      {
        id: "H",
        label: "人間",
        kind: "human",
        description: "人間。この工程の位置と前後のつながりを確認します。",
      },
    ],
    edges: [
      {
        from: "V",
        to: "P",
        label: "",
        dashed: false,
      },
      {
        from: "P",
        to: "R",
        label: "",
        dashed: false,
      },
      {
        from: "R",
        to: "T",
        label: "",
        dashed: false,
      },
      {
        from: "T",
        to: "L",
        label: "自然な表現を解釈",
        dashed: false,
      },
      {
        from: "T",
        to: "G",
        label: "根拠を探す",
        dashed: false,
      },
      {
        from: "T",
        to: "S",
        label: "確定的に処理できる",
        dashed: false,
      },
      {
        from: "T",
        to: "H",
        label: "専門判断が必要",
        dashed: false,
      },
    ],
    rows: [["V"], ["P"], ["R"], ["T"], ["L", "G"], ["S", "H"]],
    groups: [],
  },
  "system-understanding": {
    title: "理解しにくいシステムを、変更判断に使える知識へ",
    description:
      "コード・UI・処理関係を調べ、復元した仕様を人間が確認し、人向け資料とAI向けKnowledgeへ分けて再利用します。",
    nodes: [
      {
        id: "legacy",
        label: "理解しにくい既存システム",
        kind: "system",
        description:
          "UI中心の古い仕様書だけでは内部仕様を説明できず、現行動作の確認や担当者の知識に依存する状態が出発点です。",
      },
      {
        id: "investigate",
        label: "コード・UI・処理を調査",
        kind: "ai",
        description:
          "当時使用したGPTで仕様や構造の抽出を支援します。コード位置・処理・関係を人間が照合し、AIの説明を確定した仕様として扱いません。",
      },
      {
        id: "restore",
        label: "仕様・構造を復元し確認",
        kind: "decision",
        description:
          "コードから処理・分岐・入出力・依存関係を抽出し、PlantUMLで可視化します。AI生成と人間が確認した事実を区別します。",
      },
      {
        id: "human",
        label: "人が読む設計情報",
        kind: "human",
        description:
          "構造や処理を俯瞰できる説明と図を使い、人が仕様・変更影響を確認できる状態へ整えます。",
      },
      {
        id: "knowledge",
        label: "AIが使うKnowledge",
        kind: "knowledge",
        description:
          "確認済みの仕様を検索・参照できる構造へ整理します。人が読む図とAIが利用する情報の役割を分けます。",
      },
      {
        id: "reuse",
        label: "変更判断・QA・保守へ再利用",
        kind: "feedback",
        description:
          "一回限りの調査資料にせず、仕様確認やQA、継続的な保守で再利用します。変更の採否や組織への影響は人間が判断します。",
      },
    ],
    rows: [
      ["legacy"],
      ["investigate"],
      ["restore"],
      ["human", "knowledge"],
      ["reuse"],
    ],
    edges: [
      {
        from: "legacy",
        to: "investigate",
        label: "",
      },
      {
        from: "investigate",
        to: "restore",
        label: "人が照合",
      },
      {
        from: "restore",
        to: "human",
        label: "可視化",
      },
      {
        from: "restore",
        to: "knowledge",
        label: "構造化",
      },
      {
        from: "human",
        to: "reuse",
        label: "判断材料",
      },
      {
        from: "knowledge",
        to: "reuse",
        label: "検索・参照",
      },
    ],
  },
  "three-ai-maintenance": {
    title: "人が判断を担い、調査・実装・文書化を分担する",
    description:
      "問いに必要なContextでAIを選び、人間が成果物を確認して次工程へ渡します。役割は固定ではなく、AI間の会話を自動連結した事例でもありません。",
    nodes: [
      {
        id: "human",
        label: "問いと必要Contextを判断",
        kind: "human",
        description:
          "人間が制約・要件・安全性の判断基準を定め、問いに必要なコード・設計・過去背景のContextに応じてAIを選びます。",
      },
      {
        id: "spec",
        label: "仕様・設計案を整理",
        kind: "ai",
        description:
          "GPTで制約条件・要件案・異常系の選択肢を整理し、PlantUMLで動的構造を補います。方針の採否は人間が決めます。",
      },
      {
        id: "code",
        label: "コード探索・実装支援",
        kind: "ai",
        description:
          "GitHub Copilotで関連コードを調べ、実現方法を具体化し、承認済み仕様に基づく関数単位のコード修正と単体テストを支援します。",
      },
      {
        id: "docs",
        label: "文書・成果物を整理",
        kind: "ai",
        description:
          "Microsoft 365 CopilotでOffice文書・過去資料・メール等の背景を確認し、検討結果をExcel仕様書へ集約します。人間が確認して次工程へ渡します。",
      },
      {
        id: "artifacts",
        label: "仕様案・コード調査・文書",
        kind: "knowledge",
        description:
          "自然言語、コード、PlantUML、Excelを工程に応じて使い分けます。AIの出力は確定事項ではなく、確認する成果物として受け渡します。",
      },
      {
        id: "review",
        label: "人間がレビュー・審議",
        kind: "decision",
        description:
          "人間が要件・リスクと成果物を確認し、組織の審議・承認を経て仕様を確定します。図は責任分担の概要であり、工程の自動並列実行を意味しません。",
      },
      {
        id: "implement",
        label: "実装判断・単体テスト",
        kind: "system",
        description:
          "承認済み仕様を基に関数単位で実装と単体テストを進めます。変更範囲と既存動作を人間が確認し、AIへ判断責任を移しません。",
      },
    ],
    rows: [
      ["human"],
      ["spec", "code", "docs"],
      ["artifacts"],
      ["review"],
      ["implement"],
    ],
    edges: [
      {
        from: "human",
        to: "spec",
        label: "",
      },
      {
        from: "human",
        to: "code",
        label: "",
      },
      {
        from: "human",
        to: "docs",
        label: "",
      },
      {
        from: "spec",
        to: "artifacts",
        label: "",
      },
      {
        from: "code",
        to: "artifacts",
        label: "",
      },
      {
        from: "docs",
        to: "artifacts",
        label: "",
      },
      {
        from: "artifacts",
        to: "review",
        label: "確認",
      },
      {
        from: "review",
        to: "implement",
        label: "承認済み仕様",
      },
    ],
  },
};
