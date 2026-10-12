export type CaseNodeKind =
  "human" | "ai" | "knowledge" | "system" | "decision" | "feedback";
export interface SupportExplanation {
  format: "flow" | "comparison" | "table" | "decision";
  panels?: { title: string; nodeIds: string[]; outcomes?: { condition: string; result: string }[]; branches?: { from: string; condition: string; nodeIds: string[] }[] }[];
  columns?: string[];
  records?: string[][];
  checks?: { question: string; yes: string; no: string }[];
  outcomes?: { condition: string; result: string }[];
  note: string;
  scope: string;
}
export interface CaseDiagramModel {
  explanation?: SupportExplanation;
  title: string;
  intro?: string;
  description: string;
  nodes: {
    id: string;
    label: string;
    mobileLabel?: string;
    kind: CaseNodeKind;
    description: string;
  }[];
  layouts?: Record<
    "mobile" | "desktop",
    {
      width: number;
      height: number;
      nodes: Record<string, { x: number; y: number; w: number; h: number }>;
      edges: Record<string, { path: string; x?: number; y?: number }>;
    }
  >;
  rows?: string[][];
  edges?: {
    from: string;
    to: string;
    label: string;
    mobileLabel?: string;
    dashed?: boolean;
  }[];
  groups?: { title: string; ids: string[] }[];
  messages?: { from: string; to: string; label: string; dashed: boolean }[];
}
// Reader-facing explanations; overview and chapter diagrams serve different reading questions.
export const caseDiagrams: Record<string, CaseDiagramModel> = {
  "maintenance-documentation-debt": {
    "title": "AIは候補を提示し、人間が変更を判断する",
    "intro": "今回は現在のコードを正本として仕様書を照合しました。コードだけでは決まらない部分は人間が判断し、最終修正も人間が行います。",
    "description": "Pythonで統合したMarkdown仕様書・現在のコード・関連情報をCopilotが横断調査します。人間が問題候補とコードを確認し、コードで決まる部分は実装に合わせます。意図や方針などコードだけでは決まらない部分は人間が判断し、変更前後を確認して最終修正します。",
    "nodes": [
        {
            "id": "docs",
            "label": "仕様書群",
            "kind": "knowledge",
            "description": "分割されたMarkdown仕様書をPythonで1ファイルへ統合し、横断比較できるコンテキストを整えました。誤字・古い説明・コマンド例の誤り・矛盾を調査しました。"
        },
        {
            "id": "code",
            "label": "現在のコード",
            "kind": "system",
            "description": "今回の照合では現在のコードを正本としました。コードで確認できる挙動を基準に仕様書を修正し、意図や方針などコードだけでは決まらない部分は人間が判断しました。"
        },
        {
            "id": "context",
            "label": "関連情報",
            "kind": "knowledge",
            "description": "関連仕様や設計上の意味を確認するための情報です。コードだけでは決まらない内容を人間が判断する際に参照します。"
        },
        {
            "id": "investigate",
            "label": "AIによる横断調査",
            "kind": "ai",
            "description": "GitHub Copilotで仕様書全体を横断レビューし、現在のコードと照合しました。問題候補・根拠・修正候補を提示し、最終仕様は決定しません。"
        },
        {
            "id": "issue",
            "label": "問題候補",
            "kind": "ai",
            "description": "誤字・古い説明・コマンド例の誤り・矛盾などの問題候補です。人間が検出結果とコードを確認します。"
        },
        {
            "id": "evidence",
            "label": "関連根拠",
            "kind": "knowledge",
            "description": "関連仕様・現在の実装など、指摘の根拠を提示します。人間が妥当性を確認します。"
        },
        {
            "id": "proposal",
            "label": "修正候補",
            "kind": "ai",
            "description": "AIが提示する修正案です。そのまま反映せず、人間がコードとの整合と記述の妥当性を確認します。"
        },
        {
            "id": "validation",
            "label": "人間による確認",
            "kind": "human",
            "description": "AIの検出結果と現在のコードを確認し、実装で決まる部分と人間の判断が必要な部分を分けます。"
        },
        {
            "id": "compare",
            "label": "変更前・変更後の比較",
            "kind": "human",
            "description": "修正前後を比較し、現在のコードの挙動を正しく説明しているか、他仕様との矛盾が残らないかを確認します。"
        },
        {
            "id": "change",
            "label": "変更する",
            "kind": "decision",
            "description": "根拠と変更前後を確認し、人間が修正を採用する判断です。"
        },
        {
            "id": "retain",
            "label": "現状維持",
            "kind": "decision",
            "description": "人間の確認で変更が不要と判断した場合に、AIの提案を採用しない経路です。対象外環境の古い説明を残すという意味ではありません。"
        },
        {
            "id": "research",
            "label": "追加調査",
            "kind": "decision",
            "description": "根拠が足りない場合は決定を保留して調査へ戻す経路です。この図は判断の構造を示し、実施件数を示すものではありません。"
        },
        {
            "id": "decision",
            "label": "人間の仕様判断",
            "kind": "human",
            "description": "コードで決まる部分はその挙動を基準にし、意図・業務上の判断・将来方針などコードだけでは決まらない部分は人間が最終判断します。"
        },
        {
            "id": "reflect",
            "label": "人間が仕様書へ反映",
            "kind": "human",
            "description": "人間自身が、採用した内容を仕様書へ修正・反映しました。現状維持では記述を変更せず、追加調査では決定を保留します。自動反映は採用しませんでした。"
        }
    ],
    "edges": [
        {
            "to": "investigate",
            "label": "",
            "dashed": false,
            "from": "docs"
        },
        {
            "to": "investigate",
            "label": "",
            "dashed": false,
            "from": "code"
        },
        {
            "to": "investigate",
            "label": "",
            "dashed": false,
            "from": "context"
        },
        {
            "to": "issue",
            "label": "",
            "dashed": false,
            "from": "investigate"
        },
        {
            "to": "evidence",
            "label": "",
            "dashed": false,
            "from": "investigate"
        },
        {
            "to": "proposal",
            "label": "",
            "dashed": false,
            "from": "investigate"
        },
        {
            "to": "validation",
            "label": "",
            "dashed": false,
            "from": "issue"
        },
        {
            "to": "validation",
            "label": "",
            "dashed": false,
            "from": "evidence"
        },
        {
            "to": "validation",
            "label": "",
            "dashed": false,
            "from": "proposal"
        },
        {
            "to": "compare",
            "label": "",
            "dashed": false,
            "from": "validation"
        },
        {
            "to": "change",
            "label": "",
            "dashed": false,
            "from": "compare"
        },
        {
            "to": "retain",
            "label": "",
            "dashed": false,
            "from": "compare"
        },
        {
            "to": "research",
            "label": "",
            "dashed": false,
            "from": "compare"
        },
        {
            "to": "decision",
            "label": "",
            "dashed": false,
            "from": "change"
        },
        {
            "to": "decision",
            "label": "",
            "dashed": false,
            "from": "retain"
        },
        {
            "to": "investigate",
            "label": "",
            "dashed": true,
            "from": "research"
        },
        {
            "to": "reflect",
            "label": "",
            "dashed": false,
            "from": "decision"
        }
    ],
    "layouts": {
        "mobile": {
            "width": 320,
            "height": 1320,
            "nodes": {
                "docs": {
                    "x": 12,
                    "y": 20,
                    "w": 132,
                    "h": 88
                },
                "code": {
                    "x": 176,
                    "y": 20,
                    "w": 132,
                    "h": 88
                },
                "context": {
                    "x": 94,
                    "y": 130,
                    "w": 132,
                    "h": 88
                },
                "investigate": {
                    "x": 94,
                    "y": 250,
                    "w": 132,
                    "h": 88
                },
                "issue": {
                    "x": 12,
                    "y": 370,
                    "w": 132,
                    "h": 88
                },
                "evidence": {
                    "x": 176,
                    "y": 370,
                    "w": 132,
                    "h": 88
                },
                "proposal": {
                    "x": 94,
                    "y": 480,
                    "w": 132,
                    "h": 88
                },
                "validation": {
                    "x": 94,
                    "y": 610,
                    "w": 132,
                    "h": 88
                },
                "compare": {
                    "x": 94,
                    "y": 730,
                    "w": 132,
                    "h": 88
                },
                "change": {
                    "x": 12,
                    "y": 860,
                    "w": 132,
                    "h": 88
                },
                "retain": {
                    "x": 176,
                    "y": 860,
                    "w": 132,
                    "h": 88
                },
                "research": {
                    "x": 94,
                    "y": 970,
                    "w": 132,
                    "h": 88
                },
                "decision": {
                    "x": 94,
                    "y": 1090,
                    "w": 132,
                    "h": 88
                },
                "reflect": {
                    "x": 94,
                    "y": 1210,
                    "w": 132,
                    "h": 88
                }
            },
            "edges": {
                "docs:investigate": {
                    "path": "M78.0 108H78V236H160.0V250"
                },
                "code:investigate": {
                    "path": "M242.0 108H242V236H160.0V250"
                },
                "context:investigate": {
                    "path": "M160.0 218V236H160.0V250"
                },
                "investigate:issue": {
                    "path": "M160.0 338V356H78.0V370"
                },
                "investigate:evidence": {
                    "path": "M160.0 338V356H242.0V370"
                },
                "investigate:proposal": {
                    "path": "M160.0 338V466H160.0V480"
                },
                "issue:validation": {
                    "path": "M78.0 458H78V596H160.0V610"
                },
                "evidence:validation": {
                    "path": "M242.0 458H242V596H160.0V610"
                },
                "proposal:validation": {
                    "path": "M160.0 568V596H160.0V610"
                },
                "validation:compare": {
                    "path": "M160.0 698V716H160.0V730"
                },
                "compare:change": {
                    "path": "M160.0 818V846H78.0V860"
                },
                "compare:retain": {
                    "path": "M160.0 818V846H242.0V860"
                },
                "compare:research": {
                    "path": "M160.0 818H6V956H160.0V970"
                },
                "change:decision": {
                    "path": "M78.0 948H78V1076H160.0V1090"
                },
                "retain:decision": {
                    "path": "M242.0 948H242V1076H160.0V1090"
                },
                "research:investigate": {
                    "path": "M226 1014.0H318V294.0H226"
                },
                "decision:reflect": {
                    "path": "M160.0 1178V1196H160.0V1210"
                }
            }
        },
        "desktop": {
            "width": 926,
            "height": 652,
            "nodes": {
                "docs": {
                    "x": 18,
                    "y": 20,
                    "w": 140,
                    "h": 82
                },
                "code": {
                    "x": 18,
                    "y": 120,
                    "w": 140,
                    "h": 82
                },
                "context": {
                    "x": 18,
                    "y": 220,
                    "w": 140,
                    "h": 82
                },
                "investigate": {
                    "x": 198,
                    "y": 120,
                    "w": 140,
                    "h": 82
                },
                "issue": {
                    "x": 378,
                    "y": 20,
                    "w": 140,
                    "h": 82
                },
                "evidence": {
                    "x": 378,
                    "y": 120,
                    "w": 140,
                    "h": 82
                },
                "proposal": {
                    "x": 378,
                    "y": 220,
                    "w": 140,
                    "h": 82
                },
                "validation": {
                    "x": 558,
                    "y": 120,
                    "w": 140,
                    "h": 82
                },
                "compare": {
                    "x": 738,
                    "y": 120,
                    "w": 140,
                    "h": 82
                },
                "change": {
                    "x": 738,
                    "y": 350,
                    "w": 140,
                    "h": 82
                },
                "retain": {
                    "x": 738,
                    "y": 450,
                    "w": 140,
                    "h": 82
                },
                "research": {
                    "x": 738,
                    "y": 550,
                    "w": 140,
                    "h": 82
                },
                "decision": {
                    "x": 378,
                    "y": 400,
                    "w": 140,
                    "h": 82
                },
                "reflect": {
                    "x": 18,
                    "y": 400,
                    "w": 140,
                    "h": 82
                }
            },
            "edges": {
                "docs:investigate": {
                    "path": "M158 61.0H178.0V161.0H198"
                },
                "code:investigate": {
                    "path": "M158 161.0H178.0V161.0H198"
                },
                "context:investigate": {
                    "path": "M158 261.0H178.0V161.0H198"
                },
                "investigate:issue": {
                    "path": "M338 161.0H358.0V61.0H378"
                },
                "investigate:evidence": {
                    "path": "M338 161.0H358.0V161.0H378"
                },
                "investigate:proposal": {
                    "path": "M338 161.0H358.0V261.0H378"
                },
                "issue:validation": {
                    "path": "M518 61.0H538.0V161.0H558"
                },
                "evidence:validation": {
                    "path": "M518 161.0H538.0V161.0H558"
                },
                "proposal:validation": {
                    "path": "M518 261.0H538.0V161.0H558"
                },
                "validation:compare": {
                    "path": "M698 161.0H718.0V161.0H738"
                },
                "compare:change": {
                    "path": "M808.0 202V320H898V391.0H878"
                },
                "compare:retain": {
                    "path": "M808.0 202V320H718V491.0H738"
                },
                "compare:research": {
                    "path": "M808.0 202V320H910V591.0H878"
                },
                "change:decision": {
                    "path": "M738 391.0H628.0V441.0H518"
                },
                "retain:decision": {
                    "path": "M738 491.0H628.0V441.0H518"
                },
                "research:investigate": {
                    "path": "M878 591.0H902V8H268V120"
                },
                "decision:reflect": {
                    "path": "M378 441.0H268.0V441.0H158"
                }
            }
        }
    }
},
  "legacy-process-structure": {
    title: "開始条件の違いと、共通する処理を分ける",
    description:
      "ユースケースごとに、前処理・共通処理・出力と条件分岐を追います。特定機能の実コードを示す図ではなく、復元した関係の確認方法です。",
    nodes: [
      {
        id: "start",
        label: "起動方法・開始条件",
        kind: "human",
        description:
          "利用する機能や起動方法ごとに、処理が始まる条件を確認しました。一つの巨大な図へまとめず、利用場面ごとに流れを分ける起点にしました。",
      },
      {
        id: "before",
        label: "条件ごとの前処理",
        kind: "system",
        description:
          "起動方法によって異なる前処理を、共通処理から切り分けました。同じ処理に入る前の違いを残し、開始条件によって動作が変わる箇所を追えるようにしました。",
      },
      {
        id: "core",
        label: "共通のコア処理",
        kind: "system",
        description:
          "共通して呼ばれる処理の順序と、渡される値・返される値をコードから調べました。個々のクラスの説明を、実際に動く順序へつなぐためです。",
      },
      {
        id: "branch",
        label: "分岐・例外の確認",
        kind: "decision",
        description:
          "条件によって変わる呼出し先や例外処理を確認しました。コードから復元した流れを人が確認し、通常の順序だけでは見えない変更影響も調べられる形にしました。",
      },
      {
        id: "output",
        label: "出力と変更影響",
        kind: "knowledge",
        description:
          "前処理・共通処理から出力までを分け、どの変更がどの結果へ影響するかを追えるようにしました。その場限りの説明ではなく、後の仕様変更に合わせて更新する情報として残しました。",
      },
    ],
    rows: [["start"], ["before"], ["core"], ["branch"], ["output"]],
    edges: [
      {
        from: "start",
        to: "before",
        label: "",
      },
      {
        from: "before",
        to: "core",
        label: "",
      },
      {
        from: "core",
        to: "branch",
        label: "",
      },
      {
        from: "branch",
        to: "output",
        label: "",
      },
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
        description:
          "設定したパスワードは、保存前には平文の状態です。暗号方式の変更ではAPIだけでなく、この値が保存・利用されるまでの流れを調べ、失敗後の影響を確認しました。",
      },
      {
        id: "encrypt",
        label: "暗号化",
        kind: "system",
        description:
          "平文を暗号化してから保存します。新しい暗号化APIは失敗を返すため、戻り値を確認し、不正な状態で後続へ進ませない処理を検討しました。",
      },
      {
        id: "store",
        label: "保存",
        kind: "knowledge",
        description:
          "暗号化した値をレジストリへ保存します。暗号化の成功と保存の成功を分けて考え、保存失敗や後の値の欠落・破損も調査対象にしました。",
      },
      {
        id: "read",
        label: "読出し",
        kind: "knowledge",
        description:
          "利用時は、保存した暗号化済みの値を読み出します。起動時だけでなく特定機能や外部連携の前にも呼ばれるため、読出し位置と値の利用先をコードで確認しました。",
      },
      {
        id: "decrypt",
        label: "復号",
        kind: "system",
        description:
          "読み出した暗号化済みの値を復号します。失敗した値を平文パスワードとして使わないよう、APIの戻り値と後続処理の停止位置を検討しました。",
      },
      {
        id: "use",
        label: "外部処理で利用",
        kind: "system",
        description:
          "復号した値を必要とする外部処理へ渡します。不正な値を使えば誤った処理や課金につながるリスクがあるため、安全に利用できない場合は停止する方針にしました。これは事故の発生実績を示すものではありません。",
      },
    ],
    rows: [["input"], ["encrypt"], ["store"], ["read"], ["decrypt"], ["use"]],
    edges: [
      {
        to: "encrypt",
        label: "",
        from: "input",
      },
      {
        to: "store",
        label: "",
        from: "encrypt",
      },
      {
        to: "read",
        label: "",
        from: "store",
      },
      {
        to: "decrypt",
        label: "",
        from: "read",
      },
      {
        to: "use",
        label: "",
        from: "decrypt",
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
        description:
          "保存するパスワードを起点に、暗号化・保存・読出し・復号・利用を追いました。どの時点で値が不正になったかによって後続の影響が異なるため、失敗を一括で扱いませんでした。",
      },
      {
        id: "encrypt",
        label: "暗号化",
        kind: "system",
        description:
          "暗号化APIが失敗を返す条件を確認しました。正常な保存処理を大きく変えるのではなく、失敗した結果を保存や後続処理へ渡さないことを検討しました。",
      },
      {
        id: "store",
        label: "保存",
        kind: "knowledge",
        description:
          "暗号化済みの値を保存できない場合を確認しました。暗号化処理そのものの失敗と区別し、どこで異常を検出するかを整理しました。",
      },
      {
        id: "read",
        label: "読出し",
        kind: "knowledge",
        description:
          "保存値の欠落・破損・読出し失敗を区別しました。保存場所だけで対応を決めず、読み出した値がその後どこで使われるかまで調べました。",
      },
      {
        id: "decrypt",
        label: "復号",
        kind: "system",
        description:
          "復号APIの失敗と、その後の値の扱いを確認しました。正常性を確かめられない場合は、外部処理へ進ませない停止位置を検討しました。",
      },
      {
        id: "use",
        label: "外部処理で利用",
        kind: "system",
        description:
          "不正な値が外部連携で使われると、誤った処理や課金へつながるリスクがあります。実際に発生した事故の記録ではなく、変更前に後続への影響を検討したものです。",
      },
    ],
    rows: [["plain"], ["encrypt"], ["store"], ["read"], ["decrypt"], ["use"]],
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
        description:
          "レジストリには資格情報とUIの設定など、用途の異なる値があります。同じ保存場所でも影響は同じではないため、値が使われる先を基準に対応を分けました。",
      },
      {
        id: "password",
        label: "暗号化パスワード",
        kind: "knowledge",
        description:
          "暗号化パスワードは外部システムとの連携に使います。不正な値を推測で補って進めることはできないため、安全性を優先して停止・復旧方法を検討しました。",
      },
      {
        id: "ui",
        label: "UIの表示位置",
        kind: "system",
        description:
          "UIの表示位置は、資格情報とは業務への影響が異なります。低影響の値では初期値へ戻せる場合があることを踏まえ、一律の復旧処理にはしませんでした。",
      },
      {
        id: "stop",
        label: "異常時は処理停止",
        kind: "decision",
        description:
          "資格情報の正常性を確認できない場合は処理を止めます。利用者には再インストールを案内し、OSやユーザープロファイルまでアプリケーションで修復する範囲には広げませんでした。",
      },
      {
        id: "reset",
        label: "初期値へ復帰可能",
        kind: "feedback",
        description:
          "UIの表示位置は初期値へ戻す選択ができる場合があります。同じ対応を資格情報へ適用せず、用途と影響を見て復旧の条件を判断しました。",
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
        label: "起動・機能実行",
        kind: "system",
        description:
          "起動時だけでなく、特定機能の実行や外部連携の前にも値が読み出されます。APIの呼出し箇所と、その後の処理まで調べて異常を検出する位置を確認しました。",
      },
      {
        id: "setting",
        label: "設定変更",
        kind: "human",
        description:
          "設定変更時には、変更した値を暗号化して保存します。利用時の読出し・復号とは呼出しの目的が異なるため、両者の経路を区別して調べました。",
      },
      {
        id: "read",
        label: "読出し",
        kind: "knowledge",
        description:
          "利用する値をレジストリから読み出す処理を確認しました。値がない場合や読出し失敗を含め、復号と外部連携へどう渡るかを追いました。",
      },
      {
        id: "encrypt",
        label: "暗号化・保存",
        kind: "system",
        description:
          "設定変更に伴う暗号化APIとレジストリへの保存を確認しました。正常処理を維持しながら、失敗を検出して危険な後続処理を止める位置を検討しました。",
      },
      {
        id: "decrypt",
        label: "復号",
        kind: "system",
        description:
          "読み出した暗号化済みの値を復号する処理です。失敗した値を利用しないよう、戻り値と外部連携までの処理を照合しました。",
      },
      {
        id: "external",
        label: "外部連携",
        kind: "system",
        description:
          "復号した値が外部処理で使われるまでを確認しました。コードの呼出し箇所だけでなく値の用途を追い、誤った値で進ませない停止条件へつなげました。",
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
        label: "人が前提を決める",
        kind: "human",
        description:
          "発生頻度、工数、安全性、正常動作への影響、保守性、アプリケーションの責務を前提として整理しました。暗号方式の変更が目的であり、正常処理の全面刷新には広げない基準を先に置きました。",
      },
      {
        id: "options",
        label: "選択肢を整理",
        kind: "ai",
        description:
          "GPTで異常時の復旧方法や停止条件の選択肢を検討しました。コードの影響や過去背景は別のAIが参照できる情報も確認し、一つの回答だけでは仕様を決めませんでした。",
      },
      {
        id: "compare",
        label: "安全性・工数を比較",
        kind: "decision",
        description:
          "個別の自動修復を増やす案と、安全に停止させる案を比較しました。低頻度の異常に対して修復処理を増やすと、検証・保守の対象も増えることを考慮しました。",
      },
      {
        id: "choice",
        label: "人が方針を決める",
        kind: "human",
        description:
          "人が安全性・工数・保守性を比較し、不正な資格情報で処理を進めない方針を選びました。AIは比較材料を整理する役割であり、採否をAIの回答へ委ねませんでした。",
      },
      {
        id: "approve",
        label: "上司・組織が確認",
        kind: "decision",
        description:
          "上司のレビューを受け、組織の設計方針として確認しました。その方針を前提に、正常動作を維持しながら必要な停止処理をコードのどこへ入れるか調べました。",
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
        label: "決めた方針",
        kind: "knowledge",
        description:
          "安全に止める条件と、アプリケーションが担う範囲を確認した方針です。調査対象を暗号方式の変更に絞り、OS側の修復や関係のない改修へ広げない基準にしました。",
      },
      {
        id: "search",
        label: "コード探索",
        kind: "ai",
        description:
          "GitHub Copilotで暗号化・復号、保存・読出し、値の利用先を意味から探索しました。文字列の一致だけでなく、呼出し関係と変更影響の候補を調べました。",
      },
      {
        id: "check",
        label: "人が確認",
        kind: "human",
        description:
          "AIが挙げた箇所について、前後の処理、到達条件、実行順序、値の用途を人が確認しました。コード上で問題に見えても実運用で影響するとは限らないため、候補のまま採用しませんでした。",
      },
      {
        id: "scope",
        label: "変更対象を絞る",
        kind: "decision",
        description:
          "前段の処理や運用条件で問題を回避できている箇所と、今回対応すべき箇所を区別しました。AIの指摘を全部取り込まず、目的に関係する影響があるかで絞りました。",
      },
      {
        id: "implement",
        label: "修正方法を決める",
        kind: "system",
        description:
          "APIの戻り値を確認し、必要な位置で後続処理を停止する方法を具体化しました。正常系への変更は最小限にし、利用者への復旧案内と責務分界を先に確認した方針へ合わせました。",
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
        label: "AIの指摘",
        kind: "ai",
        description:
          "AIの指摘は、関連コードと変更影響の調査候補として扱いました。設計上の粗さがあっても実際の問題とは限らないため、そのまま改修対象にはしませんでした。",
      },
      {
        id: "check",
        label: "人が条件を確認",
        kind: "human",
        description:
          "到達条件、前後の処理、値の用途、実行順序、運用条件を人が調べました。今回の変更によって実際に影響が生じるかを判断するための確認です。",
      },
      {
        id: "problem",
        label: "問題あり",
        kind: "decision",
        description:
          "今回の変更に関係する影響が、実運用で生じると確認した場合です。必要なエラー処理や停止条件を、改修対象に含める判断へつなぎました。",
      },
      {
        id: "safe",
        label: "問題なし",
        kind: "decision",
        description:
          "前段の処理や運用条件によって、実際には問題にならない場合です。コードの見た目だけで問題と決めず、今回の修正範囲から外す判断につなぎました。",
      },
      {
        id: "include",
        label: "改修する",
        kind: "system",
        description:
          "確認した必要箇所へ対応を追加しました。正常系を維持し、不正な値で進ませないことを基準に、変更範囲を限定しました。",
      },
      {
        id: "exclude",
        label: "対象から外す",
        kind: "system",
        description:
          "今回の目的に関係しない整理や改修は対象から外しました。AIが改善案を提示できることと、この変更で採用すべきことを分けました。",
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
        label: "問題あり",
      },
      {
        from: "check",
        to: "safe",
        label: "問題なし",
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
        label: "確認した調査結果",
        kind: "knowledge",
        description:
          "保守の前提、GPTとの検討、承認した方針、コード調査、人が確認した事実を集めました。別々の場所にある情報を、同じ項目でレビューできる形にするためです。",
      },
      {
        id: "document",
        label: "文書に整理",
        kind: "ai",
        description:
          "Microsoft 365 Copilotへ確認した材料と採用する実現方法を渡し、Excel仕様書へ集約しました。AIに整形させても、その表が正しい仕様であるとは扱いませんでした。",
      },
      {
        id: "excel",
        label: "Excel仕様書",
        kind: "knowledge",
        description:
          "現行・変更後の正常系と異常系、停止条件、変更範囲、判断理由、試験観点を整理しました。処理順序や読出し・復号のタイミングも確認できる形にし、認識の違いを見つける材料にしました。",
      },
      {
        id: "review",
        label: "人がレビュー",
        kind: "human",
        description:
          "コード上の事実、設計方針、承認した内容との整合を人が確認しました。認識違いがあれば表の一行だけを直すのではなく、現行コードと処理全体へ戻って確認しました。",
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
        label: "コード調査",
        kind: "ai",
        description:
          "Excel仕様書の認識違いを確認するため、GitHub Copilotで現行コードの情報を取り出しました。次のAIへ渡すプロンプトも人が確認し、未確認の回答を自動で連結しませんでした。",
      },
      {
        id: "structure",
        label: "処理を図に整理",
        kind: "ai",
        description:
          "GPTで呼出し順序、分岐、入出力、エラー後の停止位置を処理構造として整理しました。表の各行を全体のどこへ位置付けるか、確認できるようにするためです。",
      },
      {
        id: "verify",
        label: "人がコードと照合",
        kind: "human",
        description:
          "生成した処理構造を人が実コードと照合し、誤りがあれば修正しました。コードを参照できないAIの説明を、コード上の事実として確定しないための確認です。",
      },
      {
        id: "excel",
        label: "Excelへ反映",
        kind: "ai",
        description:
          "確認した処理構造をMicrosoft 365 Copilotへ渡し、Excel仕様書へ反映しました。読出し・復号のタイミング、分岐、停止位置、外部連携の条件を修正しました。",
      },
      {
        id: "review",
        label: "人が再確認",
        kind: "human",
        description:
          "修正後の仕様書を、コード・処理構造・設計方針と再度照合しました。AI間で形式を変えることと、人が仕様の正しさを確認することを分けました。",
      },
      {
        id: "approve",
        label: "組織で仕様承認",
        kind: "decision",
        description:
          "仕様書を組織のサブ審議へ提出し、承認を受けました。AIの出力を組織の決定と混同せず、レビュー・承認を経た仕様を実装と単体テストの前提にしました。",
      },
    ],
    rows: [
      ["code"],
      ["structure"],
      ["verify"],
      ["excel"],
      ["review"],
      ["approve"],
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
        label: "全体像を共有",
        kind: "knowledge",
        description:
          "承認済み仕様と、処理全体の構造・関数間の関係・必要なUI情報をGitHub Copilotへ共有しました。関数だけを切り出すと入力の前提や後続への影響が抜けやすいためです。",
      },
      {
        id: "function",
        label: "対象関数を確認",
        kind: "human",
        description:
          "対象関数の役割と追加するエラー条件を確認しました。正常動作を維持し、関係のない名前変更や依存関係の変更へ広げない基準を置きました。",
      },
      {
        id: "generate",
        label: "修正案を生成",
        kind: "ai",
        description:
          "GitHub Copilotで関数単位の修正案を生成しました。承認済み仕様を前提に必要な異常系対応へ絞り、生成できたことだけで採用を決めませんでした。",
      },
      {
        id: "review",
        label: "レビュー・試験",
        kind: "human",
        description:
          "人がコードをレビューし、ビルドと単体テストで確認しました。APIの成功・失敗、レジストリ値がない場合、既存の正常動作を見て、期待結果も仕様から人が確かめました。",
      },
      {
        id: "retry",
        label: "修正・再試験",
        kind: "feedback",
        description:
          "問題があれば修正案を見直し、再生成したコードもレビュー・ビルド・単体テストで確認しました。修正後の確認を省略せず、既存動作への影響と修正範囲を確かめました。",
      },
      {
        id: "next",
        label: "次の関数へ",
        kind: "system",
        description:
          "確認した関数から次の対象関数へ進めました。対象が残っていれば同じ確認を繰り返し、生成したコードの採否と期待結果の判断は人に残しました。",
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
      {
        from: "retry",
        to: "generate",
        label: "再生成",
        dashed: true,
      },
    ],
  },
  "maintenance-delivery-flow": {
    title: "保守の調査から実装までを、人間の責任でつなぐ",
    description:
      "主フローは前提設定、コード探索、人間の仕様レビュー、認識差分の確認、実装・試験の順に左から右へ進みます。差分があれば仕様レビューへ戻り、差分がなければ実装へ進みます。下段は判断・実装時に参照する情報です。",
    nodes: [
      {
        id: "premise",
        label: "前提設定・論点整理",
        mobileLabel: "1前提",
        kind: "human",
        description:
          "人が正常系への影響、安全性、工数、保守性、責務の範囲を前提として整理しました。GPTで選択肢や論点を検討し、コードや過去資料も必要に応じて確認しました。",
      },
      {
        id: "investigate",
        label: "コード探索・実現案整理",
        mobileLabel: "2探索",
        kind: "ai",
        description:
          "GitHub Copilotで関連コードと呼出し関係、変更影響の候補を調べました。人が前後の処理や運用条件を照合し、今回必要な変更箇所と実現方法を絞りました。",
      },
      {
        id: "review",
        label: "人間が仕様レビュー",
        mobileLabel: "3レビュー",
        kind: "human",
        description:
          "コード上の事実、処理構造、Excel仕様書の整合を人がレビューしました。表が整っていることだけで正しいとは扱わず、承認した方針と正常動作への影響を確認しました。",
      },
      {
        id: "correct",
        label: "認識差分を確認",
        mobileLabel: "4差分",
        kind: "decision",
        description:
          "コード・処理構造・仕様書の認識差分を確認しました。差分があれば調査と文書反映をやり直し、人の仕様レビューへ戻しました。差分がなければ承認済み仕様を前提に実装へ進みました。",
      },
      {
        id: "implement",
        label: "コード生成・レビュー・試験",
        mobileLabel: "5実装",
        kind: "system",
        description:
          "GitHub Copilotで関数単位の修正案を生成し、人がレビュー・ビルド・単体テストを行いました。正常動作と変更範囲を確認し、問題があれば修正と再確認を行いました。",
      },
      {
        id: "approve",
        label: "審議・承認済み仕様",
        mobileLabel: "審議・承認済み仕様",
        kind: "knowledge",
        description:
          "組織の審議・承認を経た仕様を、レビューと実装の前提として参照しました。AI間で情報を整理・受け渡す工程とは別に、組織として仕様を確定する工程を置きました。",
      },
      {
        id: "existing",
        label: "既存システム・工程",
        mobileLabel: "既存システム・工程",
        kind: "knowledge",
        description:
          "既存動作と処理全体、関数間の関係を実装時の確認材料にしました。関数単体の生成に閉じず、入力の前提と後続処理への影響も人が確認しました。",
      },
    ],
    rows: [
      ["premise"],
      ["investigate"],
      ["review"],
      ["correct"],
      ["implement"],
    ],
    groups: [
      {
        title: "工程",
        ids: ["premise", "investigate", "review", "implement"],
      },
      {
        title: "判断",
        ids: ["correct"],
      },
      {
        title: "参照情報",
        ids: ["approve", "existing"],
      },
    ],
    edges: [
      {
        from: "premise",
        to: "investigate",
        label: "",
        dashed: false,
      },
      {
        from: "investigate",
        to: "review",
        label: "",
        dashed: false,
      },
      {
        from: "review",
        to: "correct",
        label: "",
        dashed: false,
      },
      {
        from: "correct",
        to: "implement",
        label: "差分なし",
        mobileLabel: "なし",
        dashed: false,
      },
      {
        from: "correct",
        to: "review",
        label: "差分あり",
        dashed: false,
      },
      {
        from: "review",
        to: "approve",
        label: "参照",
        dashed: true,
      },
      {
        from: "correct",
        to: "approve",
        label: "参照",
        dashed: true,
      },
      {
        from: "implement",
        to: "existing",
        label: "補助",
        dashed: true,
      },
    ],
    layouts: {
      desktop: {
        width: 1064,
        height: 398,
        nodes: {
          premise: {
            x: 16,
            y: 104,
            w: 152,
            h: 112,
          },
          investigate: {
            x: 236,
            y: 104,
            w: 152,
            h: 112,
          },
          review: {
            x: 456,
            y: 104,
            w: 152,
            h: 112,
          },
          correct: {
            x: 676,
            y: 104,
            w: 152,
            h: 112,
          },
          implement: {
            x: 896,
            y: 104,
            w: 152,
            h: 112,
          },
          approve: {
            x: 456,
            y: 290,
            w: 372,
            h: 88,
          },
          existing: {
            x: 896,
            y: 290,
            w: 152,
            h: 88,
          },
        },
        edges: {
          "premise:investigate": {
            path: "M168 160.0H236",
            x: 202,
            y: 148,
          },
          "investigate:review": {
            path: "M388 160.0H456",
            x: 422,
            y: 148,
          },
          "review:correct": {
            path: "M608 160.0H676",
            x: 642,
            y: 148,
          },
          "correct:implement": {
            path: "M828 160.0H896",
            x: 862,
            y: 148,
          },
          "correct:review": {
            path: "M752 104V52Q752 40 740 40H544Q532 40 532 52V104",
            x: 642,
            y: 30,
          },
          "review:approve": {
            path: "M532 216V264H520V290",
            x: 506,
            y: 252,
          },
          "correct:approve": {
            path: "M752 216V290",
            x: 776,
            y: 258,
          },
          "implement:existing": {
            path: "M972 216V290",
            x: 998,
            y: 258,
          },
        },
      },
      mobile: {
        width: 320,
        height: 354,
        nodes: {
          premise: {
            x: 8,
            y: 80,
            w: 48,
            h: 106,
          },
          investigate: {
            x: 72,
            y: 80,
            w: 48,
            h: 106,
          },
          review: {
            x: 136,
            y: 80,
            w: 48,
            h: 106,
          },
          correct: {
            x: 200,
            y: 80,
            w: 48,
            h: 106,
          },
          implement: {
            x: 264,
            y: 80,
            w: 48,
            h: 106,
          },
          approve: {
            x: 8,
            y: 250,
            w: 144,
            h: 88,
          },
          existing: {
            x: 168,
            y: 250,
            w: 144,
            h: 88,
          },
        },
        edges: {
          "premise:investigate": {
            path: "M56 133.0H72",
            x: 64,
            y: 121,
          },
          "investigate:review": {
            path: "M120 133.0H136",
            x: 128,
            y: 121,
          },
          "review:correct": {
            path: "M184 133.0H200",
            x: 192,
            y: 121,
          },
          "correct:implement": {
            path: "M248 133.0H264",
            x: 256,
            y: 124,
          },
          "correct:review": {
            path: "M224 80V36Q224 28 216 28H168Q160 28 160 36V80",
            x: 192,
            y: 16,
          },
          "review:approve": {
            path: "M160 186V212H80V250",
            x: 82,
            y: 205,
          },
          "correct:approve": {
            path: "M224 186V228H136V250",
            x: 164,
            y: 224,
          },
          "implement:existing": {
            path: "M288 186V236H240V250",
            x: 285,
            y: 231,
          },
        },
      },
    },
  },
  "legacy-ui-internals": {
    title: "UIから処理と結果をつないで調べる",
    description: "操作、呼出し、内部処理、結果の関係を復元します。",
    nodes: [
      {
        id: "ui",
        label: "UI操作",
        kind: "human",
        description:
          "利用者が画面で行う操作と、表示される内容を確認しました。内部のクラス名だけでは利用者の質問に答えにくいため、画面から見た動作を調査の起点にしました。",
      },
      {
        id: "call",
        label: "呼出し",
        kind: "system",
        description:
          "画面操作から、どのイベント・関数・クラスへ処理が渡るかをコードで追いました。UIと内部処理を結び付け、操作に関する質問から必要な仕様へ到達できるようにしました。",
      },
      {
        id: "process",
        label: "内部処理",
        kind: "system",
        description:
          "呼び出された先の処理順序と条件分岐を確認しました。UI中心の仕様書では不足していた内部ルールを実装から復元し、操作と結果の対応へつなぎました。",
      },
      {
        id: "result",
        label: "実動作",
        kind: "decision",
        description:
          "コードから読み取った内容を実際のソフトウェアの動作と照合しました。AIの説明をそのまま確定せず、人が確認した操作・処理・結果の対応をKnowledgeへ組み込みました。",
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
          "コード、UI、実動作、既存資料、担当者の知識を照合した情報を起点にしました。古い仕様書やAIの推測だけを、そのまま現行仕様として扱わないためです。",
      },
      {
        id: "human",
        label: "人向けの図",
        kind: "human",
        description:
          "人が全体像を理解できるよう、処理の流れと関係を図に整理しました。仕様確認や保守時に、順序と影響範囲を俯瞰するために使いました。",
      },
      {
        id: "ai",
        label: "AI向けの文書",
        kind: "knowledge",
        description:
          "AIが質問に必要な情報を検索できるよう、条件・例外・詳細をMarkdown中心に整理しました。人向けの図とは用途を分けますが、別々の仕様を作るのではなく同じ確認済み情報を使いました。",
      },
      {
        id: "judge",
        label: "人の変更判断",
        kind: "decision",
        description:
          "背景や制約、現在の状況を踏まえ、変更するか・どの方針を採るかは人が判断しました。AIには判断材料を探させ、最終決定を自動化しない責任分担を維持しました。",
      },
      {
        id: "qa",
        label: "QAで情報を探す",
        kind: "ai",
        description:
          "質問に関係する確認済みKnowledgeを検索し、回答の根拠へ戻れるようにしました。AIの回答だけで確定せず、仕様確認・QA・継続保守で調査結果を再利用するための構成です。",
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
  "support-overview": {
    "title": "顧客の問い合わせから、回答または有人対応へ",
    "description": "顧客の入力を、追加質問・検索・根拠付き回答へ渡し、回答できない条件では担当者へ移す機能のつながりを示します。",
    "nodes": [
      {
        "id": "customer",
        "label": "顧客が問い合わせる",
        "kind": "human",
        "description": "顧客はWebのQA画面から、困っている内容を自然な言葉で入力します。"
      },
      {
        "id": "questions",
        "label": "生成AIが不足情報を質問する",
        "kind": "ai",
        "description": "問い合わせだけでは不明な機種・環境・エラーを追加質問し、顧客の回答を集めます。"
      },
      {
        "id": "target",
        "label": "QAシステムが対象機種を特定する",
        "kind": "system",
        "description": "得られた条件を保持し、機種が特定できない場合は自動回答を続けません。"
      },
      {
        "id": "search",
        "label": "検索機能が適合する文書を取得する",
        "kind": "knowledge",
        "description": "機種メタデータで文書を絞り込み、その範囲でベクトル検索します。"
      },
      {
        "id": "answer",
        "label": "生成AIが根拠から回答案を作る",
        "kind": "ai",
        "description": "取得文書を参照するRAGで、根拠に基づく回答案を生成します。"
      },
      {
        "id": "decision",
        "label": "QAシステムが回答可能か判定する",
        "kind": "decision",
        "description": "必要情報・回答根拠・専門判断の要否を確認し、顧客へ返すか有人対応へ進むかを決めます。"
      }
    ],
    "explanation": {
      "format": "flow",
      "panels": [
        {
          "title": "問い合わせから回答判定まで",
          "nodeIds": [
            "customer",
            "questions",
            "target",
            "search",
            "answer",
            "decision"
          ],
          "outcomes": [
            {
              "condition": "回答条件を満たす",
              "result": "QAシステムが顧客へ回答する"
            },
            {
              "condition": "根拠不足・原因未特定・専門判断が必要",
              "result": "サポート担当者へ引き継ぐ"
            }
          ]
        }
      ],
      "note": "検索対象の制御は回答生成の前に行います。生成AIの自信だけでは回答を確定しません。",
      "scope": "業務要求に対応する機能の構成と、処理のつながりを示します。"
    }
  },
  "support-executive-summary": {
    "title": "変更前と改善後：人間の対応をどこまでシステムへ移すか",
    "description": "変更前と改善後を独立した流れとして比較します。上下の矢印は各方式の処理順序であり、変更前から改善後へ処理が流れる意味ではありません。",
    "nodes": [
      {
        "id": "before-customer",
        "label": "顧客が問い合わせる",
        "kind": "human",
        "description": "担当者へ問い合わせを伝えます。"
      },
      {
        "id": "before-questions",
        "label": "担当者が不足情報を聞き取る",
        "kind": "human",
        "description": "顧客の回答に応じて次の質問を選びます。"
      },
      {
        "id": "before-search",
        "label": "担当者が資料を検索する",
        "kind": "human",
        "description": "仕様書・FAQ・障害情報を探します。"
      },
      {
        "id": "before-judge",
        "label": "担当者が根拠と原因を判断する",
        "kind": "human",
        "description": "対象機種に適合する文書か確認し、原因を絞ります。"
      },
      {
        "id": "before-answer",
        "label": "担当者が回答する",
        "kind": "human",
        "description": "根拠と調査結果から顧客への案内を作ります。"
      },
      {
        "id": "after-customer",
        "label": "顧客が問い合わせる",
        "kind": "human",
        "description": "顧客向けWeb QAへ自然な言葉で入力します。"
      },
      {
        "id": "after-questions",
        "label": "QAシステムが追加質問する",
        "kind": "ai",
        "description": "生成AIが不足情報を質問し、回答条件を具体化します。"
      },
      {
        "id": "after-search",
        "label": "QAシステムが根拠文書を検索する",
        "kind": "knowledge",
        "description": "機種で文書を絞り、その範囲で関連する根拠を検索します。"
      },
      {
        "id": "after-judge",
        "label": "QAシステムが回答可能か判定する",
        "kind": "decision",
        "description": "根拠に基づく回答を作れるか、専門判断を要するか確認します。"
      },
      {
        "id": "after-answer",
        "label": "システムが回答する",
        "kind": "system",
        "description": "適合する根拠に沿った回答を顧客へ提示します。"
      },
      {
        "id": "after-handoff",
        "label": "担当者が調査結果を引き継ぐ",
        "kind": "human",
        "description": "確認済み情報、検索した文書、未解決事項を受け取ります。"
      },
      {
        "id": "after-investigate",
        "label": "担当者が調査を続ける",
        "kind": "human",
        "description": "不足する確認と専門的な調査・判断を行います。"
      },
      {
        "id": "after-human-answer",
        "label": "担当者が回答する",
        "kind": "human",
        "description": "専門調査の結果を踏まえて顧客へ案内します。"
      }
    ],
    "explanation": {
      "format": "comparison",
      "panels": [
        {
          "title": "変更前：すべて担当者が対応",
          "nodeIds": [
            "before-customer",
            "before-questions",
            "before-search",
            "before-judge",
            "before-answer"
          ]
        },
        {
          "title": "改善後：回答と専門対応を分ける",
          "nodeIds": [
            "after-customer",
            "after-questions",
            "after-search",
            "after-judge"
          ],
          "branches": [
            {
              "from": "after-judge",
              "condition": "回答可能",
              "nodeIds": [
                "after-answer"
              ]
            },
            {
              "from": "after-judge",
              "condition": "根拠不足・専門判断が必要",
              "nodeIds": [
                "after-handoff",
                "after-investigate",
                "after-human-answer"
              ]
            }
          ]
        }
      ],
      "note": "判定から伸びる二つの矢印は、回答可能なら自動回答、根拠不足・原因未特定・専門判断が必要なら調査結果を引き継いだ有人対応へ進むことを示します。",
      "scope": "従来の有人対応と、顧客の自己解決を支援する設計方式の違いを示します。"
    }
  },
  "support-why-ai": {
    "title": "業務要求から必要機能を導き、技術方式を選ぶ",
    "description": "顧客の自己解決と専門対応への集中という与えられた要求を、必要機能・採用方式・採用理由へ対応付けます。",
    "nodes": [],
    "explanation": {
      "format": "table",
      "columns": [
        "必要な機能",
        "採用する方式",
        "採用理由"
      ],
      "records": [
        [
          "不足情報の聞き取り",
          "生成AIによる追加質問",
          "顧客の回答に応じて質問を変え、検索に必要な条件を集める。"
        ],
        [
          "回答根拠の取得",
          "既存文書のベクトル検索",
          "分散した仕様書・FAQ・障害情報から、問い合わせに関連する情報を探す。"
        ],
        [
          "対象条件の制御",
          "メタデータによる絞込み",
          "対象機種が異なる文書を、意味検索の前に除外する。"
        ],
        [
          "根拠に基づく回答",
          "検索結果を参照する回答生成（RAG）",
          "社内の製品情報を根拠として与え、生成AIの内部知識だけに依存しない。"
        ],
        [
          "専門判断と例外対応",
          "サポート担当者への引継ぎ",
          "自動回答できない問い合わせでも、専門的な調査と判断を続ける。"
        ]
      ],
      "note": "技術は機能要件を実現する手段です。生成AIは対話と文章生成、検索は文書取得、メタデータは検索範囲の制御を担います。",
      "scope": "業務要件から実現方式を選ぶ設計上の整理です。比較対象と採用理由は本文で説明します。"
    }
  },
  "support-responsibility-boundary": {
    "title": "AI・QAシステム、人間、既存システムの役割分担",
    "description": "処理順序ではなく、三者が担う機能と確定してはいけない境界を示します。",
    "nodes": [],
    "explanation": {
      "format": "table",
      "columns": [
        "担当主体",
        "担う処理",
        "責任の境界"
      ],
      "records": [
        [
          "AI・QAシステム",
          "不足情報の収集、対象条件の確認、関連文書の検索、根拠に基づく回答案の生成。",
          "根拠不足や専門判断が必要な場合は回答を止め、担当者へ引き継ぐ。"
        ],
        [
          "サポート担当者",
          "専門判断、個別調査、影響が大きい操作の判断、例外への対応。",
          "元の問い合わせと確認済み情報を確認し、調査と顧客への案内を引き受ける。"
        ],
        [
          "既存システム・知識基盤",
          "製品仕様・FAQ・障害情報の保持、適用条件と公開範囲の管理、必要な業務状態と権限の管理。",
          "事実・制約・権限を管理する。生成AIの推測で状態更新や実行結果を確定しない。"
        ]
      ],
      "note": "AIにすべてを委任する方式でも、すべての回答を人間が承認する方式でもありません。問い合わせの条件で担当範囲を分けます。",
      "scope": "機種制御と専門判断への引継ぎを基本とし、公開範囲・業務状態・権限の詳細は追加の設計条件として扱います。"
    }
  },
  "support-poc-evaluation": {
    "title": "別機種の誤検索を見つけ、検索方式を修正する",
    "description": "検証結果から問題の所在を分析し、回答生成の前提となる検索対象制御を変更する判断を示します。",
    "nodes": [
      {
        "id": "test",
        "label": "開発担当者と業務担当者が検証する",
        "kind": "feedback",
        "description": "追加質問・取得文書・根拠との整合・顧客への提示可否を、評価表の項目に沿って確認します。"
      },
      {
        "id": "failure",
        "label": "別機種の文書を使う問題を発見する",
        "kind": "feedback",
        "description": "回答は自然でも、対象機種と異なる文書を根拠にしているケースを区別します。"
      },
      {
        "id": "cause",
        "label": "設計側が検索の原因を分析する",
        "kind": "decision",
        "description": "意味的な類似性だけでは、対象機種に適合する文書を保証できないと判断します。"
      },
      {
        "id": "control",
        "label": "対象機種による検索対象制御を追加する",
        "kind": "system",
        "description": "文書に機種メタデータを付け、一致する文書へ絞ってから検索する方式へ変更します。"
      },
      {
        "id": "retest",
        "label": "同じ評価条件で再検証する",
        "kind": "feedback",
        "description": "誤検索の改善と、以前は回答できた問い合わせへの影響を確認します。"
      },
      {
        "id": "accept",
        "label": "設計側と業務側が方式の採否を判断する",
        "kind": "decision",
        "description": "成功条件と許容できない失敗に照らし、採用・追加修正・棄却を決めます。"
      }
    ],
    "explanation": {
      "format": "flow",
      "panels": [
        {
          "title": "検証結果を方式改善へ戻す",
          "nodeIds": [
            "test",
            "failure",
            "cause",
            "control",
            "retest",
            "accept"
          ]
        }
      ],
      "note": "修正対象は検索構成です。モデル変更やプロンプト修正だけで解決したという説明にはしません。",
      "scope": "検索対象の誤りを防ぐ設計と、方式の評価・改善に必要な条件を示します。"
    }
  },
  "support-poc-checks": {
    "title": "何を検証し、誰が判定するか",
    "description": "最終回答の正答率だけへ集約せず、機能ごとに確認方法と判断主体を分けます。",
    "nodes": [],
    "explanation": {
      "format": "table",
      "columns": [
        "評価項目",
        "確認すること",
        "判断主体・方法"
      ],
      "records": [
        [
          "追加質問による情報収集",
          "機種・環境・症状など、検索と停止判定に必要な情報が得られるか。",
          "期待項目の取得は開発担当者や自動テストで確認。質問の有効性は業務担当者が判断する。"
        ],
        [
          "根拠文書の検索",
          "対象機種に適合する文書が取得され、別機種の文書が除外されるか。",
          "対象機種と文書メタデータの一致を開発担当者やテストで確認する。"
        ],
        [
          "根拠と回答の整合",
          "回答に根拠外の主張や、対象に適用できない手順がないか。",
          "根拠の参照を確認し、内容の妥当性はサポート担当者が判断する。"
        ],
        [
          "顧客への提示品質",
          "無修正で顧客へ示せる内容と表現か。",
          "サポート担当者が業務上の受入基準に沿って判断する。"
        ],
        [
          "有人引継ぎ",
          "回答できない場合に停止し、確認済み情報を渡して対応を再開できるか。",
          "停止と項目保持はテストで確認。調査を続けられるかは担当者が確認する。"
        ]
      ],
      "note": "一致を機械的に確かめられる項目と、業務の専門判断が必要な項目を分けます。全件を一律に人手判定する方式ではありません。",
      "scope": "検索・対話・回答・有人引継ぎの各段階で何を確認するか示します。"
    }
  },
  "support-handoff-information": {
    "title": "担当者へ何を渡し、どこから対応を再開するか",
    "description": "担当者が問い合わせを最初から聞き直さず、未解決の確認と調査から再開するための情報を示します。",
    "nodes": [],
    "explanation": {
      "format": "table",
      "columns": [
        "渡す情報",
        "保持する内容",
        "担当者が再開する判断"
      ],
      "records": [
        [
          "問い合わせ内容",
          "顧客が最初に伝えた症状・依頼と、元の会話履歴。",
          "要約だけに依存せず、依頼の意図と確認の経緯を確認する。"
        ],
        [
          "追加質問の結果",
          "顧客の回答で確認した機種・版・接続方法・OSなどの環境、エラー表示。",
          "対象条件と、何を質問して得た情報かを確認する。"
        ],
        [
          "確認済み事項",
          "顧客から得られた事実、確認結果、実施済みの対処。",
          "同じ質問や操作を繰り返さず、次の確認へ進む。"
        ],
        [
          "AIの調査結果",
          "調べた内容、検索条件、特定できた事項とその根拠。",
          "どこまで調べたかを確認し、未確認の推測と区別する。"
        ],
        [
          "参照文書",
          "検索した仕様書・FAQ・障害情報。取得候補と採用・除外の理由。",
          "文書の対象適合性と根拠を確認する。候補の取得だけで事実と確定しない。"
        ],
        [
          "未解決事項",
          "原因を特定できなかった内容、未確認の条件、解消していない症状。",
          "追加調査・専門判断を行う起点を選ぶ。"
        ],
        [
          "引継ぎ理由",
          "根拠不足、原因未特定、専門判断の必要性など、自動回答を止めた理由。",
          "停止した地点から調査を再開する。"
        ]
      ],
      "note": "確認済みの事実、検索で得た候補、未確認情報を区別して保持します。AIの推測や要約を確認済みの事実へ置き換えません。",
      "scope": "引継ぎに必要な項目と、担当者が対応を再開するための情報を整理します。"
    }
  },
  "support-stopping-conditions": {
    "title": "三つの条件を満たす場合だけ自動回答する",
    "description": "各条件の「はい」は次の確認へ進むことを示し、「いいえ」は自動回答を中止して有人対応へ移ることを示します。",
    "nodes": [],
    "explanation": {
      "format": "decision",
      "checks": [
        {
          "question": "必要な情報がそろっていますか？",
          "yes": "回答根拠を確認する。",
          "no": "確認した情報と未確認項目を保持し、担当者へ引き継ぐ。"
        },
        {
          "question": "適切な回答根拠がありますか？",
          "yes": "専門判断の要否を確認する。",
          "no": "検索条件と根拠不足の理由を保持し、担当者へ引き継ぐ。"
        },
        {
          "question": "専門判断なしで回答できますか？",
          "yes": "根拠に沿う回答だけを顧客へ提示する。",
          "no": "回答案を確定せず、専門判断が必要な理由を担当者へ渡す。"
        }
      ],
      "outcomes": [
        {
          "condition": "すべて「はい」",
          "result": "QAシステムが自動回答する"
        },
        {
          "condition": "一つでも「いいえ」",
          "result": "必要情報を保持してサポート担当者へ引き継ぐ"
        }
      ],
      "note": "AI自身の自信だけでは決めません。追加質問をしても条件を解消できなければ、推測で回答を続けません。",
      "scope": "根拠不足・原因未特定・専門判断を基本の停止条件とします。高影響・公開可否・矛盾も追加の設計条件です。"
    }
  },
  "support-knowledge-design": {
    "title": "対象機種で絞り込んでから、根拠文書を検索する",
    "description": "回答生成へ渡してよい文書の範囲を、意味検索より先に決める依存関係を示します。",
    "nodes": [
      {
        "id": "target",
        "label": "QAシステムが対象機種を特定する",
        "kind": "system",
        "description": "顧客の問い合わせと追加質問への回答から機種を確認します。未特定なら推測で検索範囲を決めません。"
      },
      {
        "id": "filter",
        "label": "検索機能が一致する文書へ絞り込む",
        "kind": "knowledge",
        "description": "文書の機種メタデータと照合し、対象機種に適合する文書だけを検索対象にします。"
      },
      {
        "id": "retrieve",
        "label": "対象文書から関連情報を検索する",
        "kind": "knowledge",
        "description": "制限した範囲の中でベクトル検索し、問い合わせに関連する根拠文書を取得します。"
      },
      {
        "id": "evidence",
        "label": "生成AIが取得文書を回答根拠にする",
        "kind": "ai",
        "description": "取得文書を参照するRAGで回答案を生成します。適合する根拠がなければ回答せず、人へ引き継ぎます。"
      }
    ],
    "explanation": {
      "format": "flow",
      "panels": [
        {
          "title": "対象条件から回答根拠まで",
          "nodeIds": [
            "target",
            "filter",
            "retrieve",
            "evidence"
          ]
        }
      ],
      "note": "意味的に似ている文書でも、別機種の情報は適切な回答根拠とは限りません。類似度のしきい値を上げることと、属性で対象を制限することは別の手段です。",
      "scope": "対象機種による検索対象制御を中心に、版数・公開可否・有効期間の制限も導入時の設計対象として扱います。"
    }
  },
  "support-human-handoff": {
    "title": "AIの一次調査を引き継ぎ、担当者が専門調査から回答まで続ける",
    "description": "担当主体の交代と、引き継ぐ情報の流れを示します。矢印は情報を受け渡して次の対応へ進む意味です。",
    "nodes": [
      {
        "id": "input",
        "label": "顧客が問い合わせと回答を入力する",
        "kind": "human",
        "description": "元の質問、症状、追加質問への回答を受け付けます。"
      },
      {
        "id": "collect",
        "label": "QAシステムが情報収集・一次調査を行う",
        "kind": "system",
        "description": "追加質問の回答と検索結果を保持します。確認済みの事実、根拠文書の候補、未確認情報を区別します。"
      },
      {
        "id": "stop",
        "label": "QAシステムが自動回答を中止する",
        "kind": "decision",
        "description": "根拠不足・原因未特定・専門判断などの停止理由を記録し、推測による回答を止めます。"
      },
      {
        "id": "transfer",
        "label": "QAシステムが調査結果を引き継ぐ",
        "kind": "system",
        "description": "問い合わせ、追加質問の結果、調査内容、参照文書、未解決事項、引継ぎ理由を渡します。"
      },
      {
        "id": "resume",
        "label": "担当者が未解決事項から専門調査を続ける",
        "kind": "human",
        "description": "顧客情報と参照文書を確認し、未解決の条件への追加調査と専門判断を行います。"
      },
      {
        "id": "reply",
        "label": "サポート担当者が顧客へ回答する",
        "kind": "human",
        "description": "引継ぎ情報と専門調査の結果を踏まえ、顧客へ回答します。"
      }
    ],
    "explanation": {
      "format": "flow",
      "panels": [
        {
          "title": "顧客の入力から、一次調査の引継ぎ・専門調査・回答へ",
          "nodeIds": [
            "input",
            "collect",
            "stop",
            "transfer",
            "resume",
            "reply"
          ]
        }
      ],
      "note": "担当者はAIの回答を承認するだけではなく、一次調査の続きを引き受けます。同じ質問や文書検索のやり直しを減らす設計です。",
      "scope": "有人引継ぎで必要な情報と、担当者が対応を再開できる状態を整理した設計案です。"
    }
  },
  "support-continuous-improvement": {
    "title": "利用結果から原因を分け、再評価して改善を反映する",
    "description": "記録から原因を分析し、知識・検索・処理方式のどこを直すか人間が判断する改善サイクルを示します。",
    "nodes": [
      {
        "id": "design",
        "label": "設計側が方式と判断条件を定める",
        "kind": "system",
        "description": "業務担当者と回答可能な範囲、停止条件、評価基準を確認します。"
      },
      {
        "id": "use",
        "label": "顧客と担当者がシステムを利用する",
        "kind": "human",
        "description": "自己解決と専門対応の両方の結果を確認できるようにします。"
      },
      {
        "id": "record",
        "label": "システムが利用結果と失敗を記録する",
        "kind": "system",
        "description": "問い合わせ条件、根拠、停止理由、有人対応の結果を分けて記録します。"
      },
      {
        "id": "analyse",
        "label": "設計側と業務側が原因を分析する",
        "kind": "decision",
        "description": "知識不足、機種属性、検索条件、対話、回答生成、業務分担のどこに問題があるか判断します。"
      },
      {
        "id": "improve",
        "label": "担当領域ごとに知識・検索・方式を改善する",
        "kind": "system",
        "description": "文書管理側は知識と適用条件、設計・開発側は検索や処理、業務側は専門対応と適用範囲を見直します。"
      },
      {
        "id": "reevaluate",
        "label": "設計側と業務側が再評価して反映する",
        "kind": "feedback",
        "description": "同じ条件で安全性と回帰を確認し、受入基準を通過した変更だけを利用へ戻します。"
      }
    ],
    "explanation": {
      "format": "flow",
      "panels": [
        {
          "title": "改善判断から再評価まで",
          "nodeIds": [
            "design",
            "use",
            "record",
            "analyse",
            "improve",
            "reevaluate"
          ]
        }
      ],
      "note": "改善後は先頭の設計・判断条件へ戻ります。データを自動収集しても、変更の採否と適用範囲は設計側・業務側が判断します。",
      "scope": "検索・回答の品質を観測し、改善・再評価へつなぐ運用設計を示します。"
    }
  },
  "system-understanding": {
    title: "理解しにくいシステムを、変更判断に使える知識へ",
    description:
      "コード・UI・処理関係を調べ、復元した仕様を人間が確認し、人向け資料とAI向けKnowledgeへ分けて再利用します。",
    nodes: [
      {
        id: "legacy",
        label: "現行仕様が分からない",
        kind: "system",
        description:
          "約20年前に開発された多機能なシステムで、長年の利用者がおり単純には廃止できませんでした。仕様書はUI説明中心で古く、問い合わせのたびに実機確認が必要でした。知識が長期担当者へ偏る状態を、仕様情報の不足として捉えました。",
      },
      {
        id: "investigate",
        label: "コード・動作を調査",
        kind: "ai",
        description:
          "ソースコードを起点に、UI、実動作、既存文書、担当者の知識を組み合わせて調べました。GPTにはコードの説明や構造の仮説を出させ、人が実コードと実行結果を照合しました。AIのもっともらしい説明を、そのまま仕様として確定しませんでした。",
      },
      {
        id: "restore",
        label: "現行仕様を復元",
        kind: "decision",
        description:
          "処理・分岐・入出力・依存関係をコードから復元し、現行の動作として確認しました。全面刷新を先に進めるのではなく、廃止できないシステムを理解・変更判断できる状態へ戻すことを優先しました。",
      },
      {
        id: "human",
        label: "人向けの図",
        kind: "human",
        description:
          "処理フローや要素間の関係を、人が俯瞰できる図と説明へ整理しました。文章だけでは組み立てにくい全体像を見える形にし、仕様確認や変更影響の調査に使いました。",
      },
      {
        id: "knowledge",
        label: "AI向けの文書",
        kind: "knowledge",
        description:
          "確認した仕様の条件・例外・詳細を、検索しやすい文書中心のKnowledgeへ整理しました。人向けの図と表現は分けますが、情報の土台は同じです。利用者の操作に関する質問からも関連情報を探せる構成にしました。",
      },
      {
        id: "reuse",
        label: "QA・変更判断へ",
        kind: "feedback",
        description:
          "調査結果を一回限りにせず、仕様確認・QA・継続保守へ再利用しました。AIは関連情報や判断材料を提供しますが、変更の採否は人が現在の状況を踏まえて決めます。理解を蓄積し、次の変更判断に使える状態を目指しました。",
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
    title: "人が判断し、AIが調査を手伝う流れ",
    intro: "どこでAIを使い、どこで人が判断するかを示しています。",
    description:
      "人が調べることを決め、AIを使って仕様・コード・過去の資料を調べます。調査した内容をまとめ、人が確認して直し、最後は人が決めて実装を進めます。",
    nodes: [
      {
        id: "human",
        label: "調べることを決める",
        kind: "human",
        description:
          "人が問い合わせや変更の課題を整理し、何を調べるか決めました。コード・仕様の検討・過去背景など、必要な情報へどのAIがアクセスできるかを基準に使い分けました。",
      },
      {
        id: "spec",
        label: "仕様を調べる",
        kind: "ai",
        description:
          "GPTで制約、要件、異常時の選択肢を整理しました。仕様の検討では他のAIから得たコード上の事実や過去背景も必要に応じて合わせ、一つのAIの回答だけで方針を決めませんでした。",
      },
      {
        id: "code",
        label: "コードを調べる",
        kind: "ai",
        description:
          "GitHub Copilotで関連コード、呼出し関係、変更影響を調べました。AIが挙げた候補は人が実際の処理と運用条件を確認し、今回の変更へ含めるかを判断しました。",
      },
      {
        id: "docs",
        label: "過去資料を調べる",
        kind: "ai",
        description:
          "Microsoft 365 Copilotで過去資料やOffice文書・メールの背景を確認しました。コードだけでは分からない経緯を補い、検討結果をExcel仕様書へ集約する際にも利用しました。",
      },
      {
        id: "artifacts",
        label: "調査結果をまとめる",
        kind: "knowledge",
        description:
          "仕様の検討、コード調査、過去背景を組み合わせ、レビューできる形へ整理しました。複数AIの結果を人が確認して次へ渡し、誤った前提がそのまま連鎖しないようにしました。",
      },
      {
        id: "review",
        label: "人が確認して直す",
        kind: "human",
        description:
          "人がコード・処理構造・仕様書の整合を確認し、必要なら修正しました。AIの回答が食い違った場合は、その問いに必要な情報を参照できるAIの材料を重視し、採否は人が決めました。",
      },
      {
        id: "implement",
        label: "人が決めて進める",
        kind: "human",
        description:
          "人のレビューと組織の承認を経た仕様を基に、実装・確認・単体テストを進めました。AIへ判断責任を移さず、コード調査だけでなく仕様検討や過去背景の確認まで支援範囲を広げました。",
      },
    ],
    groups: [
      {
        title: "人",
        ids: ["human"],
      },
      {
        title: "AIが手伝う",
        ids: ["spec", "code", "docs"],
      },
      {
        title: "まとめ",
        ids: ["artifacts"],
      },
      {
        title: "人が確認",
        ids: ["review"],
      },
      {
        title: "人が最終判断",
        ids: ["implement"],
      },
    ],
    edges: [
      {
        to: "spec",
        label: "",
        from: "human",
      },
      {
        to: "code",
        label: "",
        from: "human",
      },
      {
        to: "docs",
        label: "",
        from: "human",
      },
      {
        to: "artifacts",
        label: "",
        from: "spec",
      },
      {
        to: "artifacts",
        label: "",
        from: "code",
      },
      {
        to: "artifacts",
        label: "",
        from: "docs",
      },
      {
        to: "review",
        label: "",
        from: "artifacts",
      },
      {
        to: "implement",
        label: "",
        from: "review",
      },
    ],
    layouts: {
      desktop: {
        width: 1080,
        height: 452,
        nodes: {
          human: {
            x: 12,
            y: 172,
            w: 176,
            h: 108,
          },
          spec: {
            x: 232,
            y: 12,
            w: 176,
            h: 108,
          },
          code: {
            x: 232,
            y: 172,
            w: 176,
            h: 108,
          },
          docs: {
            x: 232,
            y: 332,
            w: 176,
            h: 108,
          },
          artifacts: {
            x: 452,
            y: 172,
            w: 176,
            h: 108,
          },
          review: {
            x: 672,
            y: 172,
            w: 176,
            h: 108,
          },
          implement: {
            x: 892,
            y: 172,
            w: 176,
            h: 108,
          },
        },
        edges: {
          "human:spec": {
            path: "M188 226.0H210.0V66.0H232",
          },
          "human:code": {
            path: "M188 226.0H210.0V226.0H232",
          },
          "human:docs": {
            path: "M188 226.0H210.0V386.0H232",
          },
          "spec:artifacts": {
            path: "M408 66.0H430.0V226.0H452",
          },
          "code:artifacts": {
            path: "M408 226.0H430.0V226.0H452",
          },
          "docs:artifacts": {
            path: "M408 386.0H430.0V226.0H452",
          },
          "artifacts:review": {
            path: "M628 226.0H650.0V226.0H672",
          },
          "review:implement": {
            path: "M848 226.0H870.0V226.0H892",
          },
        },
      },
      mobile: {
        width: 320,
        height: 638,
        nodes: {
          human: {
            x: 30,
            y: 8,
            w: 260,
            h: 92,
          },
          artifacts: {
            x: 30,
            y: 282,
            w: 260,
            h: 92,
          },
          review: {
            x: 30,
            y: 408,
            w: 260,
            h: 92,
          },
          implement: {
            x: 30,
            y: 534,
            w: 260,
            h: 92,
          },
          spec: {
            x: 8,
            y: 146,
            w: 96,
            h: 94,
          },
          code: {
            x: 112,
            y: 146,
            w: 96,
            h: 94,
          },
          docs: {
            x: 216,
            y: 146,
            w: 96,
            h: 94,
          },
        },
        edges: {
          "human:spec": {
            path: "M160.0 100V123.0H56.0V146",
          },
          "human:code": {
            path: "M160.0 100V123.0H160.0V146",
          },
          "human:docs": {
            path: "M160.0 100V123.0H264.0V146",
          },
          "spec:artifacts": {
            path: "M56.0 240V261.0H160.0V282",
          },
          "code:artifacts": {
            path: "M160.0 240V261.0H160.0V282",
          },
          "docs:artifacts": {
            path: "M264.0 240V261.0H160.0V282",
          },
          "artifacts:review": {
            path: "M160.0 374V391.0H160.0V408",
          },
          "review:implement": {
            path: "M160.0 500V517.0H160.0V534",
          },
        },
      },
    },
  },
};
