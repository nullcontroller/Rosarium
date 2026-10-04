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
// Reader-facing explanations; overview and chapter diagrams serve different reading questions.
export const caseDiagrams: Record<string, CaseDiagramModel> = {
  "legacy-process-structure": {
    title: "開始条件の違いと、共通する処理を分ける",
    description:
      "ユースケースごとに、前処理・共通処理・出力と条件分岐を追います。特定機能の実コードを示す図ではなく、復元した関係の確認方法です。",
    nodes: [
      {
        id: "start",
        label: "起動方法・開始条件",
        kind: "human",
        description: "利用するユースケースの開始条件を確認します。",
      },
      {
        id: "before",
        label: "条件ごとの前処理",
        kind: "system",
        description: "起動方法によって異なる処理を分離します。",
      },
      {
        id: "core",
        label: "共通のコア処理",
        kind: "system",
        description: "共通処理の呼出し順序と入出力を調べます。",
      },
      {
        id: "branch",
        label: "分岐・例外の確認",
        kind: "decision",
        description:
          "コードと実動作を照合し、条件・例外・呼出し先を確認します。",
      },
      {
        id: "output",
        label: "出力と変更影響",
        kind: "knowledge",
        description: "出力処理を切り分け、変更がどの処理に及ぶかを追います。",
      },
    ],
    rows: [["start"], ["before"], ["core"], ["branch"], ["output"]],
    edges: [
      { from: "start", to: "before", label: "" },
      { from: "before", to: "core", label: "" },
      { from: "core", to: "branch", label: "" },
      { from: "branch", to: "output", label: "" },
    ],
  },
  "maintenance-password-flow": {
    title: "保存と利用では、値の状態が変わる",
    description: "暗号化して保存し、利用時に読み出して復号します。",
    nodes: [
      {
        id: "input",
        label: "平文パスワード",
        kind: "system",
        description: "保存する資格情報を入力します。",
      },
      {
        id: "encrypt",
        label: "暗号化",
        kind: "system",
        description: "平文を暗号化します。",
      },
      {
        id: "store",
        label: "レジストリへ保存",
        kind: "knowledge",
        description: "暗号化した値を保存します。",
      },
      {
        id: "start",
        label: "利用処理の開始",
        kind: "system",
        description: "パスワードを必要とする処理を開始します。",
      },
      {
        id: "read",
        label: "レジストリから読出し",
        kind: "knowledge",
        description: "暗号化した値を取得します。",
      },
      {
        id: "decrypt",
        label: "復号して利用",
        kind: "system",
        description:
          "復号した平文を利用します。失敗時の扱いは次の図で確認します。",
      },
    ],
    rows: [
      ["input", "start"],
      ["encrypt", "read"],
      ["store", "decrypt"],
    ],
    edges: [
      {
        from: "input",
        to: "encrypt",
        label: "",
      },
      {
        from: "encrypt",
        to: "store",
        label: "",
      },
      {
        from: "start",
        to: "read",
        label: "",
      },
      {
        from: "read",
        to: "decrypt",
        label: "",
      },
    ],
  },
  "maintenance-error-points": {
    title: "失敗した値を、外部処理へ流さない",
    description: "各段階のエラーと後続への影響を確認します。",
    nodes: [
      {
        id: "plain",
        label: "平文パスワード",
        kind: "system",
        description: "保存する値が処理の起点です。",
      },
      {
        id: "encrypt",
        label: "暗号化",
        kind: "system",
        description: "暗号化APIのエラーを確認します。",
      },
      {
        id: "store",
        label: "保存",
        kind: "knowledge",
        description: "レジストリへの保存失敗を確認します。",
      },
      {
        id: "read",
        label: "読出し",
        kind: "knowledge",
        description: "値の欠落・破損・読出し失敗を確認します。",
      },
      {
        id: "decrypt",
        label: "復号",
        kind: "system",
        description: "復号APIのエラーを確認します。",
      },
      {
        id: "use",
        label: "外部処理で利用",
        kind: "system",
        description:
          "不正な値が利用されれば誤課金等へつながるリスクがあります。発生実績ではありません。",
      },
    ],
    rows: [["plain"], ["encrypt", "store"], ["read", "decrypt"], ["use"]],
    edges: [
      {
        from: "plain",
        to: "encrypt",
        label: "",
      },
      {
        from: "encrypt",
        to: "store",
        label: "",
      },
      {
        from: "store",
        to: "read",
        label: "",
      },
      {
        from: "read",
        to: "decrypt",
        label: "",
      },
      {
        from: "decrypt",
        to: "use",
        label: "",
      },
    ],
  },
  "maintenance-data-criticality": {
    title: "保存場所が同じでも、影響で扱いを分ける",
    description: "資格情報とUI設定では復旧の条件が異なります。",
    nodes: [
      {
        id: "registry",
        label: "レジストリ情報",
        kind: "knowledge",
        description: "保存場所だけでは重要度を決められません。",
      },
      {
        id: "password",
        label: "暗号化パスワード",
        kind: "knowledge",
        description: "外部システム連携に使う重要度の高い値です。",
      },
      {
        id: "ui",
        label: "UIの表示位置",
        kind: "system",
        description: "業務処理への影響が小さい値です。",
      },
      {
        id: "stop",
        label: "異常時は処理停止",
        kind: "decision",
        description: "不正な資格情報で後続処理へ進ませません。",
      },
      {
        id: "reset",
        label: "初期値へ復帰可能",
        kind: "feedback",
        description: "UI表示位置は初期値への復帰を選べる場合があります。",
      },
    ],
    rows: [["registry"], ["password", "ui"], ["stop", "reset"]],
    edges: [
      {
        from: "registry",
        to: "password",
        label: "重要度：高",
      },
      {
        from: "registry",
        to: "ui",
        label: "重要度：低",
      },
      {
        from: "password",
        to: "stop",
        label: "",
      },
      {
        from: "ui",
        to: "reset",
        label: "",
      },
    ],
  },
  "maintenance-call-timings": {
    title: "呼出し箇所だけでなく、利用するタイミングを見る",
    description: "起動・機能実行・設定変更を区別して調べます。",
    nodes: [
      {
        id: "startup",
        label: "起動・特定機能の実行",
        kind: "system",
        description: "起動時と特定機能の実行時に値の読出しを確認します。",
      },
      {
        id: "setting",
        label: "設定変更",
        kind: "human",
        description: "値の変更では暗号化して保存します。",
      },
      {
        id: "read",
        label: "レジストリ読出し",
        kind: "knowledge",
        description: "外部連携までの呼出し経路を追います。",
      },
      {
        id: "encrypt",
        label: "暗号化・保存",
        kind: "system",
        description: "設定変更時のAPIとレジストリ保存を確認します。",
      },
      {
        id: "decrypt",
        label: "復号",
        kind: "system",
        description: "読出した値を復号します。",
      },
      {
        id: "external",
        label: "外部システム連携",
        kind: "system",
        description:
          "読出しから直接連携する経路と、復号を経る経路を確認します。",
      },
    ],
    rows: [
      ["startup", "setting"],
      ["read", "encrypt"],
      ["decrypt"],
      ["external"],
    ],
    edges: [
      {
        from: "startup",
        to: "read",
        label: "",
      },
      {
        from: "setting",
        to: "encrypt",
        label: "",
      },
      {
        from: "read",
        to: "decrypt",
        label: "",
      },
      {
        from: "read",
        to: "external",
        label: "利用先を確認",
      },
      {
        from: "decrypt",
        to: "external",
        label: "",
      },
    ],
  },
  "maintenance-policy-choice": {
    title: "安全性と保守の制約から、方針を決める",
    description: "AIは比較材料を整理し、採否と承認は人間が担います。",
    nodes: [
      {
        id: "premise",
        label: "人間が前提を設定",
        kind: "human",
        description:
          "発生頻度・工数・正常系への影響・安全性・責務範囲を定めます。",
      },
      {
        id: "options",
        label: "GPTで選択肢を整理",
        kind: "ai",
        description: "復旧方法や停止条件の論点を整理します。",
      },
      {
        id: "compare",
        label: "安全性・工数・保守性を比較",
        kind: "decision",
        description: "必要な処理と増やさない処理を比較します。",
      },
      {
        id: "choice",
        label: "人間が方針を決定",
        kind: "human",
        description: "AIの回答をそのまま確定事項にしません。",
      },
      {
        id: "approve",
        label: "上司レビュー・組織承認",
        kind: "decision",
        description: "上司に方針を確認し、組織の設計方針として扱います。",
      },
    ],
    rows: [["premise"], ["options"], ["compare"], ["choice"], ["approve"]],
    edges: [
      {
        from: "premise",
        to: "options",
        label: "",
      },
      {
        from: "options",
        to: "compare",
        label: "",
      },
      {
        from: "compare",
        to: "choice",
        label: "",
      },
      {
        from: "choice",
        to: "approve",
        label: "",
      },
    ],
  },
  "maintenance-code-investigation": {
    title: "方針を、最小限の変更箇所へ落とす",
    description: "コード候補と実運用の条件を照合します。",
    nodes: [
      {
        id: "policy",
        label: "確認した設計方針",
        kind: "knowledge",
        description: "安全に止める条件と責務を起点にします。",
      },
      {
        id: "search",
        label: "コードを意味から探索",
        kind: "ai",
        description:
          "GitHub Copilotが関連コード、呼出し関係、変更影響の候補を提示します。",
      },
      {
        id: "check",
        label: "人間がコード・運用を確認",
        kind: "human",
        description: "前後の処理と実際の利用条件を照合します。",
      },
      {
        id: "scope",
        label: "真の課題と見かけを区別",
        kind: "decision",
        description: "AIの指摘をすべて改修対象にしません。",
      },
      {
        id: "implement",
        label: "最小変更の方法を確定",
        kind: "system",
        description: "確認した必要箇所へエラー処理を追加します。",
      },
    ],
    rows: [["policy"], ["search"], ["check"], ["scope"], ["implement"]],
    edges: [
      {
        from: "policy",
        to: "search",
        label: "",
      },
      {
        from: "search",
        to: "check",
        label: "",
      },
      {
        from: "check",
        to: "scope",
        label: "",
      },
      {
        from: "scope",
        to: "implement",
        label: "",
      },
    ],
  },
  "maintenance-change-scope": {
    title: "AIの指摘を、改修対象にするか確かめる",
    description: "前後処理と運用条件から影響を判断します。",
    nodes: [
      {
        id: "candidate",
        label: "コード上の指摘",
        kind: "ai",
        description:
          "設計上の粗さは調査候補であり、実運用の問題とは限りません。",
      },
      {
        id: "check",
        label: "人間が前提と運用を確認",
        kind: "human",
        description: "到達条件、前後の処理、値の用途、実行順序を調べます。",
      },
      {
        id: "problem",
        label: "実運用で問題あり",
        kind: "decision",
        description: "今回の変更に関係する影響がある場合です。",
      },
      {
        id: "safe",
        label: "実運用では問題なし",
        kind: "decision",
        description: "前段の処理や運用条件によって問題にならない場合です。",
      },
      {
        id: "include",
        label: "改修対象に含める",
        kind: "system",
        description: "必要な対応を行います。",
      },
      {
        id: "exclude",
        label: "改修対象から外す",
        kind: "system",
        description: "関係のない修正へ広げません。",
      },
    ],
    rows: [
      ["candidate"],
      ["check"],
      ["problem", "safe"],
      ["include", "exclude"],
    ],
    edges: [
      {
        from: "candidate",
        to: "check",
        label: "",
      },
      {
        from: "check",
        to: "problem",
        label: "",
      },
      {
        from: "check",
        to: "safe",
        label: "",
      },
      {
        from: "problem",
        to: "include",
        label: "",
      },
      {
        from: "safe",
        to: "exclude",
        label: "",
      },
    ],
  },
  "maintenance-specification-review": {
    title: "分散した情報を、仕様書でレビューする",
    description: "前提・判断・コード上の事実を合わせます。",
    nodes: [
      {
        id: "inputs",
        label: "前提・方針・コード調査",
        kind: "knowledge",
        description:
          "保守の前提、GPTとの対話、承認済み方針、Copilotのコード調査、人間が確認した実装事実、採用方法を集約します。",
      },
      {
        id: "document",
        label: "M365 Copilotで文書化",
        kind: "ai",
        description: "確認した材料をExcelへ整理します。",
      },
      {
        id: "excel",
        label: "現行・変更後のExcel仕様",
        kind: "knowledge",
        description:
          "正常系・異常系、エラー条件、処理内容、影響範囲、判断理由、試験範囲・観点を管理します。",
      },
      {
        id: "review",
        label: "人間が整合をレビュー",
        kind: "human",
        description: "コードと承認した方針へ照合し、過不足を確認します。",
      },
    ],
    rows: [["inputs"], ["document"], ["excel"], ["review"]],
    edges: [
      {
        from: "inputs",
        to: "document",
        label: "",
      },
      {
        from: "document",
        to: "excel",
        label: "",
      },
      {
        from: "excel",
        to: "review",
        label: "",
      },
    ],
  },
  "maintenance-reviewed-handoff": {
    title: "確認した仕様を、次のAIへ渡す",
    description: "コード・処理構造・Excelを、人間レビューの境界でつなぎます。",
    nodes: [
      {
        id: "code",
        label: "コードから現行仕様を抽出",
        kind: "ai",
        description:
          "GitHub Copilotでコードを参照し、構造を伝える情報を整理します。",
      },
      {
        id: "structure",
        label: "GPTで処理構造を表現",
        kind: "ai",
        description:
          "呼出し、分岐、入出力、エラー後の停止位置を構造として表します。",
      },
      {
        id: "verify",
        label: "人間が実コードと照合",
        kind: "human",
        description:
          "情報を渡す前にもプロンプトを確認し、生成した構造の誤りを必要に応じて修正します。",
      },
      {
        id: "excel",
        label: "確認済み仕様をExcelへ",
        kind: "ai",
        description:
          "Microsoft 365 Copilotへ確認した情報を渡し、仕様書へ反映します。",
      },
      {
        id: "review",
        label: "人間が再レビュー",
        kind: "human",
        description: "コード・構造・方針との整合を確認します。",
      },
      {
        id: "approve",
        label: "審議・仕様承認",
        kind: "decision",
        description: "サブ審議を経て承認済み仕様を実装の前提にします。",
      },
    ],
    rows: [
      ["code"],
      ["structure"],
      ["verify"],
      ["excel"],
      ["review", "approve"],
    ],
    edges: [
      {
        from: "code",
        to: "structure",
        label: "情報を確認",
      },
      {
        from: "structure",
        to: "verify",
        label: "",
      },
      {
        from: "verify",
        to: "excel",
        label: "必要なら修正",
      },
      {
        from: "excel",
        to: "review",
        label: "",
      },
      {
        from: "review",
        to: "approve",
        label: "",
      },
    ],
  },
  "maintenance-implementation-cycle": {
    title: "関数ごとに、生成・レビュー・試験を進める",
    description: "問題があれば修正案を見直し、再確認してから次へ進みます。",
    nodes: [
      {
        id: "whole",
        label: "処理全体の構造を共有",
        kind: "knowledge",
        description: "関数間の関係とUI情報を先に共有します。",
      },
      {
        id: "function",
        label: "対象関数・エラー条件を確認",
        kind: "human",
        description: "対象関数の役割と追加する条件を定めます。",
      },
      {
        id: "generate",
        label: "最小限の修正案を生成",
        kind: "ai",
        description: "GitHub Copilotが承認済み仕様からコードを生成します。",
      },
      {
        id: "review",
        label: "人間レビュー・単体テスト",
        kind: "human",
        description: "ビルドと試験で、コードと期待結果を確認します。",
      },
      {
        id: "retry",
        label: "問題あり：修正・再試験",
        kind: "feedback",
        description:
          "修正案の見直し、再生成、レビュー、ビルド・単体テストを繰り返します。",
      },
      {
        id: "next",
        label: "問題なし：次の関数へ",
        kind: "system",
        description: "対象関数が残れば同じ確認を続け、残らなければ終了します。",
      },
    ],
    rows: [
      ["whole"],
      ["function"],
      ["generate"],
      ["review"],
      ["retry", "next"],
    ],
    edges: [
      {
        from: "whole",
        to: "function",
        label: "",
      },
      {
        from: "function",
        to: "generate",
        label: "",
      },
      {
        from: "generate",
        to: "review",
        label: "",
      },
      {
        from: "review",
        to: "retry",
        label: "問題あり",
      },
      {
        from: "review",
        to: "next",
        label: "問題なし",
      },
    ],
  },
  "maintenance-delivery-flow": {
    title: "保守の調査から実装までを、人間の責任でつなぐ",
    description: "仕様の認識違いがあればコードへ戻り、承認後に実装します。",
    nodes: [
      {
        id: "premise",
        label: "前提設定・論点整理",
        kind: "human",
        description:
          "人間が前提を設定し、GPTの要件整理を上司レビューで確認します。",
      },
      {
        id: "investigate",
        label: "コード探索・実現方法",
        kind: "ai",
        description:
          "GitHub Copilotで調査し、M365 CopilotでExcel仕様書へ集約します。",
      },
      {
        id: "review",
        label: "人間が仕様をレビュー",
        kind: "human",
        description: "誤認がなければ審議へ、誤認があれば確認し直します。",
      },
      {
        id: "correct",
        label: "認識違いをコードへ照合",
        kind: "decision",
        description:
          "GPTで論点整理、GitHub CopilotとGPTで現行仕様を構造化、人間が照合し、M365 CopilotでExcelへ反映して再レビューします。",
      },
      {
        id: "approve",
        label: "審議・承認済み仕様",
        kind: "decision",
        description: "組織の承認を実装の前提にします。",
      },
      {
        id: "implement",
        label: "コード生成・レビュー・試験",
        kind: "system",
        description:
          "GitHub Copilotで生成し、人間がレビュー・単体テストを行います。",
      },
    ],
    rows: [
      ["premise"],
      ["investigate"],
      ["review"],
      ["correct", "approve"],
      ["implement"],
    ],
    edges: [
      {
        from: "premise",
        to: "investigate",
        label: "",
      },
      {
        from: "investigate",
        to: "review",
        label: "",
      },
      {
        from: "review",
        to: "correct",
        label: "認識違いあり",
      },
      {
        from: "review",
        to: "approve",
        label: "認識違いなし",
      },
      {
        from: "correct",
        to: "approve",
        label: "再レビュー後",
      },
      {
        from: "approve",
        to: "implement",
        label: "",
      },
    ],
  },
  "legacy-ui-internals": {
    title: "UIから処理と結果をつないで調べる",
    description: "操作、呼出し、内部処理、結果の関係を復元します。",
    nodes: [
      {
        id: "ui",
        label: "UI操作・表示",
        kind: "human",
        description: "操作と表示から、利用者が何を確認するかを把握します。",
      },
      {
        id: "call",
        label: "呼出し関係",
        kind: "system",
        description: "イベントや関数の呼出しをコードで追います。",
      },
      {
        id: "process",
        label: "内部処理・分岐",
        kind: "system",
        description: "処理順序や条件を確認し、AIの説明と実コードを照合します。",
      },
      {
        id: "result",
        label: "実動作・表示結果",
        kind: "decision",
        description: "実際のソフトウェアの動作と合うかを人間が確認します。",
      },
    ],
    rows: [["ui"], ["call"], ["process"], ["result"]],
    edges: [
      {
        from: "ui",
        to: "call",
        label: "",
      },
      {
        from: "call",
        to: "process",
        label: "",
      },
      {
        from: "process",
        to: "result",
        label: "",
      },
    ],
  },
  "legacy-information-views": {
    title: "同じ確認済み仕様を、用途に合う表現へ",
    description: "人が俯瞰する情報と、AIが検索する情報を分けます。",
    nodes: [
      {
        id: "facts",
        label: "確認した現行仕様",
        kind: "knowledge",
        description:
          "コード・UI・実動作・資料・担当者知識を照合した情報が共通の土台です。",
      },
      {
        id: "human",
        label: "人向けの構造・フロー",
        kind: "human",
        description:
          "処理の流れや関係性を俯瞰し、ノードを選んで役割を確認できます。",
      },
      {
        id: "ai",
        label: "AI向けの文書Knowledge",
        kind: "knowledge",
        description:
          "根拠を意味単位で検索できるように、文章と構造化テキストを整理します。",
      },
      {
        id: "judge",
        label: "人間の変更判断",
        kind: "decision",
        description: "背景や制約を参照し、現在の状況から採否を決めます。",
      },
      {
        id: "qa",
        label: "根拠を探すQA / RAG",
        kind: "ai",
        description:
          "知識を検索して判断材料を返します。最終決定を自動化しません。",
      },
    ],
    rows: [["facts"], ["human", "ai"], ["judge", "qa"]],
    edges: [
      {
        from: "facts",
        to: "human",
        label: "俯瞰",
      },
      {
        from: "facts",
        to: "ai",
        label: "検索",
      },
      {
        from: "human",
        to: "judge",
        label: "",
      },
      {
        from: "ai",
        to: "qa",
        label: "",
      },
    ],
  },
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
        label: "知識・検索・UI・処理を改善",
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
        label: "知識・根拠",
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
        label: "コード・UI・実動作を調査",
        kind: "ai",
        description:
          "当時使用したGPTで仕様や構造の抽出を支援します。既存文書・担当者知識も含め、コード位置・処理・関係を人間が照合し、AIの説明を確定した仕様として扱いません。",
      },
      {
        id: "restore",
        label: "仕様・構造を復元し確認",
        kind: "decision",
        description:
          "コードから処理・分岐・入出力・依存関係を抽出し、図で可視化します。AI生成と人間が確認した事実を区別します。",
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
        label: "設計情報：仕様を検討",
        kind: "ai",
        description:
          "GPTで制約条件・要件案・異常系の選択肢を整理し、処理構造の図で動的構造を補います。方針の採否は人間が決めます。",
      },
      {
        id: "code",
        label: "コード情報：影響を調査",
        kind: "ai",
        description:
          "GitHub Copilotで関連コードを調べ、実現方法を具体化し、承認済み仕様に基づく関数単位のコード修正と単体テストを支援します。",
      },
      {
        id: "docs",
        label: "過去資料：背景を確認",
        kind: "ai",
        description:
          "Microsoft 365 CopilotでOffice文書・過去資料・メール等の背景を確認し、検討結果をExcel仕様書へ集約します。人間が確認して次工程へ渡します。",
      },
      {
        id: "artifacts",
        label: "仕様案・コード調査・文書",
        kind: "knowledge",
        description:
          "自然言語、コード、処理構造の図、Excelを工程に応じて使い分けます。AIの出力は確定事項ではなく、確認する成果物として受け渡します。",
      },
      {
        id: "review",
        label: "確認・修正して次のAIへ",
        kind: "decision",
        description:
          "人間が前提・要件・コードとの整合を確認し、必要なら修正してから次のAIへ渡します。自動連携せず、誤った前提の連鎖を防ぎます。最終的には組織の審議・承認を経て仕様を確定します。",
      },
      {
        id: "implement",
        label: "最終判断・実装確認",
        kind: "human",
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
