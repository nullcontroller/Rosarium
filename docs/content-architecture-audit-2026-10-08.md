# Rosarium 2026-10-08 全体監査・一次判定

## 範囲と確度

対象は公開コンテンツ98ファイル（Bookの章を含む）。非公開2ファイルは件数から除外。全ファイルの本文を機械走査し、タイトル・要約・見出し・Lifecycle・固定能力表現を棚卸しした。重点領域の本文と既存監査を照合して高確度の改訂を実施した。**全98ファイルの全文精読は完了していない。KEEPには一次判定を含み、全記事の前提検証完了を意味しない。**

既存資料：content-modernization-report.md、ai-use-and-operation-audit-2026-10-07.md、ai-workflow-content-audit-2026-10-08.md、code-change-delegation-audit-2026-10-08.md。以前の件数と判断は当時の記録として扱い、今回の実在ファイルを優先する。

## 実装前の判断

- コード生成2記事の統合済み判断を維持。development-workflowが変更委任・検証・権限・復旧の説明を所有する。
- コード生成AIの正体はモデルと製品構成、保守コンテキストは既存成果物の情報価値、複数AIは配置と受渡しの問いを持つ。名称だけで退役しない。
- Agentの個人実践は実績を保持。AI駆動開発の記事は、全文比較で原則がdevelopment-workflow、実務が3 AI保守Caseと重複すると確認したため統合する。
- 教育・横展開の旧候補は保留。今回の優先対象から外し、変更しない。
- Caseの当時の道具・役割は実務事実。現行能力へ置換しない。

## 件数

- KEEP: 71
- REWRITE: 2
- MERGE: 5
- RETIRE: 4
- OBSOLETE: 16
- DELETE: 0

MERGE5件のうち3件は統合済み、教育・横展開の2件は保留候補。REWRITE2件は改訂済み。RETIRE4件・OBSOLETE16件は既存状態の維持。今回ai-driven-developmentをactiveからretiredへ変更し、本文・公開日を保存した。物理削除0件。KEEP71件は一次判定を含む。優先対象の全文判断はcode-agent-workflow-priority-audit-2026-10-08.mdを参照。

## 中心にする説明先

| 問い | 説明先 |
|---|---|
| AIへ任せるべきか、どこまでか | foundations/applicability-and-delegation |
| コード変更をどう工程へ接続するか | software-engineering/development-workflow |
| モデル・道具・状態・権限の構成はどう違うか | software-engineering/code-generation-models |
| 既存成果物が調査・検証を助ける条件は何か | software-engineering/code-maintenance-context |
| 単一／複数Agentへどう配置し引き継ぐか | software-engineering/multi-ai-orchestration |
| 受け渡しの契約は何か | architecture/prompts-as-interfaces |
| 候補を既存システムへどう安全に接続するか | architecture/reference-architecture |
| 権限と脅威をどう制御するか | architecture/security-threat-modeling |
| 何を根拠に採用・承認するか | evaluation-hitl/responsibility-and-hitl、code-evaluation-acceptance |
| 業務全体は効率化したか | foundations/ai-business-design/evaluating-business-efficiency |
| 変更後をどう再評価するか | architecture/change-and-reevaluation |
| 続ける・縮める・終える条件は何か | practices/adoption-governance、Lifecycle入口 |

能力の上限で工程を固定せず、価値・参照情報・権限・検証・停止・復旧・責任・運用結果で委任範囲を選ぶ。すべてに人間レビューを置くことも、Agentだから自動反映することも既定値にしない。

## 優先して見直す10対象

| 対象 | 弱さの種類・理由 | 今回の扱い |
|---|---|---|
| ai-design-assistance | B/D/E：実装は正解一意、設計は最後まで人間という対立 | 既存RETIRED維持 |
| code-generation-and-work-design | D/E：コード生成と設計支援の対立 | 既存統合維持 |
| code-generation-boundaries | B/D/E：工程名で適用場所を固定 | 既存統合維持 |
| agents-tools-and-workflows | B/C/G：個人の同期構成をAgent全般へ一般化 | 今回改訂 |
| ai-driven-development | E：工程原則はdevelopment-workflow、実務は3 AI保守Caseと重複 | 統合・RETIRED・互換redirect |
| code-maintenance-context | B/G：適用表を能力上限として読める | 今回改訂。性能優位の限定は維持 |
| ai-education-principles | E：原則／実践の分離をガイドと重複説明 | 保留、変更なし |
| transferring-ai-practices | E：横展開の条件分解をガイドと重複説明 | 保留、変更なし。共有経験は保持対象 |
| model-competition-and-ecosystems | A/C/F：企業類型・競争構造を固定 | 既存RETIRED維持 |
| ai-roles-beyond-fde | C/F：職名・市場予測の変化が速い | 既存OBSOLETE維持 |

## 入口・互換URL・履歴

AI DesignのAgent入口とSoftware Engineeringのガイド構造は維持。読み順・実践導線・出版物一覧から統合済みai-driven-developmentを外し、実務経験は既存の3 AI保守Caseへ案内する。Careerは変更しない。

redirect：software-engineering/ai-driven-development/、software-engineering/code-generation-boundaries/、software-engineering/code-generation-and-work-design/ → software-engineering/development-workflow/。過去のpractices/ai-generation-and-work-completion/ → foundations/ai-business-design/evaluating-business-efficiency/も維持。保存された旧本文は改訂しない。

2026-10-08のai-driven-development履歴を統合へ変更。同日同記事の重複記録は追加しない。Garden Notesは集計のみ（記事18件改訂・3件統合、Case1件改訂）。既存の記事更新履歴データを共用。移入元のスナップショットは保存し、実質改訂の本文チェックサム・前版記録を更新。

## 3〜6か月後の再監査

優先：code-generation-models（製品の公開仕様）、code-maintenance-context（検証環境・適用例）、multi-ai-orchestration（単一Agentとの比較）、context-before-model-performance（情報接続の条件）、cost-latency-routing（費用・待ち時間・経路）、security-threat-modeling（攻撃面・権限）、ai-use-and-operation（組織変化の仮説）。数値・機能を最新モデル名へ置換するのではなく、境界と評価条件を確認する。

## 記事別の一次判定

| Path | Title | Current Role | Decision | Reason | Canonical / Merge Target | Required Action |
|---|---|---|---|---|---|---|
| src/content/architecture/agents-tools-and-workflows.md | 「AIエージェントを0から作る時代」は本当に来るのか？ | 自宅PCのストレージ整理を題材に、AIによる判断・ルール設計と既存ツールによる実行を分けて考える。MCPを試した経験から、エージェントの価値を接続先と責務の設計に見いだす。 | REWRITE | B/G：実務で選んだ構成や適用例を、固定的な能力上限・分業と区別する。 | architecture/agents-tools-and-workflows | 本文を最小改訂。履歴へ反映。 |
| src/content/architecture/change-and-reevaluation.md | AIシステムの変更・再評価設計 | AIシステムを変更したとき、どこを確認し直し、問題があればどう元へ戻すかを考えます。モデル・指示・知識・権限をVersion Bundleで管理し、再評価とリリースの条件を整理します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | architecture/change-and-reevaluation | 維持（一次判断）。 |
| src/content/architecture/cost-latency-routing.md | AIコスト・Latency・モデルルーティング設計 | 回答の速さやモデルの価格だけでなく、やり直しと人間の確認を含めて処理方法を選びます。品質・待ち時間（Latency）・リスクから、使うモデルや処理経路を評価します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | architecture/cost-latency-routing | 維持（一次判断）。 |
| src/content/architecture/observability-and-slo.md | AIシステムのオブザーバビリティとSLO設計 | 質問から検索・生成・検証・承認・実行までを記録し、誤回答の原因を追跡できる運用を考える。技術指標と品質指標を分け、SLOと異常時の対応を設計する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | architecture/observability-and-slo | 維持（一次判断）。 |
| src/content/architecture/prompts-as-interfaces.md | AI間インターフェースとしてのプロンプト | 複数のAIへ仕事を渡すとき、成果物・根拠・状態を取り違えずに引き継ぐ方法を考えます。プロンプトを受け渡しの契約として捉え、情報の型・意味・権限を検証します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | architecture/prompts-as-interfaces | 維持（一次判断）。 |
| src/content/architecture/reference-architecture.md | AI業務システムの参照アーキテクチャ | AIの答えをそのまま業務処理に使わず、確認・承認・実行を分ける全体構成を示します。必要情報（Context）の準備から監視までをつなぎ、誤生成が業務へ届く経路を制御します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | architecture/reference-architecture | 維持（一次判断）。 |
| src/content/architecture/security-threat-modeling.md | 生成AIセキュリティと脅威モデリング | AIが読む情報、使える権限、呼び出すツール、出力先を境界ごとに整理する。Prompt Injectionなどの脅威を想定し、影響の限定・検出・停止・復旧を設計する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | architecture/security-threat-modeling | 維持（一次判断）。 |
| src/content/career/overview.md | Career | 業務課題を整理し、AI・人間・既存システムの役割を決め、運用できる仕組みへ落とし込みます。企画から導入後の評価・改善・終了までを、一続きの設計対象として扱います。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | career/overview | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/continuous-improvement.md | 08. 導入後にどう育てるか | 誤回答や人への引き継ぎが起きた理由を調べ、次の改善へ戻す仕組みを設計します。知識不足・検索失敗・画面での離脱を分け、Knowledge・Retrieval・UI・業務のどこを直すか判断します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/continuous-improvement | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/customer-experience.md | 06. 顧客体験をどう変えたか | 利用者に製品分類や専門用語を理解させず、自然な言葉と段階的な追加質問で解決へ導くUX / UIを整理する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/customer-experience | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/design-principles.md | 09. この事例から得た設計原則 | 問い合わせ対応の設計から、他の業務でも使える判断原則を整理します。価値を起点に、AIと人の責任、回答根拠、停止条件、HITL、評価・改善をどう組み合わせるか考えます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/design-principles | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/executive-summary.md | 00. このケーススタディについて | 問い合わせ対応の何が問題で、AIと人の仕事をどう分ける設計なのかを短くまとめます。扱う設計範囲と、確認できる事実・設計条件・試算の区別をExecutive Summaryとして示します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/executive-summary | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/human-handoff.md | 07. AIから人間へどう引き継ぐか | 会話履歴、機種、環境、エラー、確認済み事項、検索結果、参照文書を失わず、AIから人間へ対応を継続する設計を示す。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/human-handoff | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/knowledge-design.md | 04. RAG / Knowledgeをどう設計したか | 検索で見つかった文書でも、顧客への回答根拠として使えるとは限りません。製品・機種・版数・公開可否を確認し、RAGが参照してよいKnowledgeの範囲を設計します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/knowledge-design | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/poc-evaluation.md | 03. PoCで「使えるか」をどう判断したか | AIが一度答えられたことと、問い合わせ業務で使えることは異なります。試験導入（PoC）で検索・対話・回答を分け、根拠の適合性と人へ渡す判断から採用可否を見ます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/poc-evaluation | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/responsibility-boundary.md | 02. 何をAIに任せ、何を人間に残したか | 問い合わせの性質を分け、自然言語処理と根拠検索はAIへ、専門判断と例外対応は人間へ残す責任境界を整理する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/responsibility-boundary | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/stopping-conditions.md | 05. AIをどこで止めるか | 根拠がない、機種が分からない、専門判断が必要なときには、AIの回答を止めます。高影響な操作や非公開情報も停止条件として整理し、人へ引き継ぐFail Safeを設計します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/stopping-conditions | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx/why-ai.md | 01. なぜAIを導入したのか | 検索高速化では変わらない全件有人の業務構造を捉え、顧客の自己解決と専門対応への集中という価値からAI適用を考える。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx/why-ai | 維持（一次判断）。 |
| src/content/cases/customer-support-ai-dx.md | 生成AI / RAGによる顧客サポートDX | 顧客が自分で解決できる問い合わせと、人の専門判断が必要な問い合わせを分け、対応の流れを設計する事例です。RAGによる根拠検索から、人への引き継ぎ、評価・改善までを扱います。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/customer-support-ai-dx | 維持（一次判断）。 |
| src/content/cases/specification-debt-review.md | 3万ページの仕様書をAIで横断レビューする | 分割されたMarkdown仕様書をPythonで統合し、GitHub Copilotで横断レビューした実務事例です。現在のコードを正本に仕様書を照合し、コードだけでは決まらない部分を人間が判断して、最終修正を行いました。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/specification-debt-review | 維持（一次判断）。 |
| src/content/cases/system-understanding/connecting-ui-and-internals.md | 第7章 UI操作と内部処理を結び付け、操作結果を追えるようにする | 内部構造の知識をUI操作と結び付け、操作・実行処理・結果の対応を整理する。利用者が機能へ到達し、操作結果を理解できる状態へ知識をつなぐ。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/connecting-ui-and-internals | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/human-and-ai-knowledge.md | 第6章 人が読む仕様とAIが使うKnowledgeを分ける | 人がシステムの全体像を理解する図と、AIが必要な根拠を探す資料を分けます。図とMarkdownを使い、文脈を残しながら、RAGが取得する情報の範囲を整理します。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/human-and-ai-knowledge | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/project-structure.md | 第3章 調査の起点を作るため、ファイルとクラスの役割を整理する | フォルダ・ファイル・クラスの役割をMarkdownで整理し、調査のための地図を作る。AIが構造の仮説を出し、人間がコードで検証する初動の進め方を示す。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/project-structure | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/qa-case-study-revisited.md | 第12章 QAで暗号処理を調査し、人間の変更判断へつなぐ | セキュリティ要件の強化に際し、QAチャットで既存方式と処理位置を調べ、変更の検討につなげた事例。AIの調査支援と、人間による組織条件・将来影響の判断を分けて振り返る。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/qa-case-study-revisited | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/qa-case-study.md | 第2章 対象システムの変更を妨げる構造と知識の不足を整理する | 対象となる約3万行のC#業務アプリケーションの状況を整理する。不要コード・連携責務・処理フロー・設計意図が分かりにくい問題から、仕様と知識を復元する必要性を示す。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/qa-case-study | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/qa-evaluation.md | 第9章 正しさ・出典・回答拒否から、QAの利用可否を評価する | 構築したQAを、正しさ・出典・一貫性・耐誘導性などの観点で評価する。誤情報、粒度、根拠不足、推測による回答を見つけ、改善対象を明確にする。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/qa-evaluation | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/qa-operations.md | 第11章 仕様変更に追従できるKnowledge更新フローを作る | 仕様や運用環境の変化に合わせ、RAG・人間向け資料・UI操作手順を更新する方法を整理する。古い情報による誤案内を防ぎ、継続的に正しい状態を維持する運用を考える。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/qa-operations | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/rag-implementation.md | 第8章 復元したKnowledgeを、根拠を確認できるQAへつなぐ | 質問に関係する根拠を探し、実務で確認できる回答へつなぐ仕組みを整えます。RAGの検索範囲・知識の粒度・画面操作との対応を調整し、AIの生成と人間の検証を分担します。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/rag-implementation | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/rag-improvement.md | 第10章 評価結果をKnowledgeと回答範囲の改善へ戻す | 評価で見つかった誤情報・根拠不足・粒度の不統一・不完全データを修正する。Knowledgeの改善と再評価を繰り返し、回答の一貫性と信頼性を高める過程を示す。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/rag-improvement | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/recovering-code-structure.md | 第4章 コードから仕様と依存関係を復元する | ソースコードからクラス・ファイルの役割と連携を読み解き、仕様と構造を整理する。実行フローや不要コードも確認し、人間が理解して変更できる基盤を作る。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/recovering-code-structure | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/system-understanding-problems.md | 第1章 仕様を答えられない状態から、復元すべき情報を決める | UI中心の古い仕様書では問い合わせに答えられなかった背景を示す。廃止できないシステムを使い続けるため、コード・実動作・既存知識から現行仕様を再構成する出発点を説明する。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/system-understanding-problems | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding/visualizing-process-flows.md | 第5章 処理の流れを復元し、変更影響を追えるようにする | クラスやモジュールの構造に加え、順序・分岐・呼出し関係を図で可視化する。代表的なフローを抽出し、動きと変更影響を人間が把握できる状態にする。 | OBSOLETE | 旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。 | cases/system-understanding/visualizing-process-flows | 既存の保存・公開範囲を維持。 |
| src/content/cases/system-understanding.md | 理解しにくいレガシーシステムを、変更判断できる状態へ変える | GPT-4のみを利用していた当時のAI環境下で、レガシーシステムの仕様を復元した参考事例です。コード・UI・実動作を照合し、人とAIが仕様確認や変更判断に使える形へ整理しました。 | OBSOLETE | 当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在はGitHub Copilotで実装関係を追えるため、当時の仕様復元手順を現在の推奨構成とはせず、制約下での設計判断を残しています。 | cases/system-understanding | 既存の保存・公開範囲を維持。 |
| src/content/cases/three-ai-maintenance/code-generation-and-unit-tests.md | 第6章　全体像を共有しながら、コード生成と単体テストを進める | 承認済み仕様を基に、GitHub Copilotへ処理全体の構造や関数間の関係、必要なUI情報を共有した。関数だけを切り出すと、入力の前提や後続処理への影響が抜けやすい。ただし、情報を渡したことをもってAIが全体を完全に理解したと | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/code-generation-and-unit-tests | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance/cryptography-and-failure-modes.md | 第1章 暗号方式の変更で見直すべき異常系を特定する | CRA対応をきっかけに、長年使ってきた暗号方式をCNG・DPAPIへ変更することになった。既存の方式はMD5を内部で用いていたが、変更の対象はAPIの呼び替えだけではない。新しいAPIでは失敗を返すため、保存・読出し・復号の各段階 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/cryptography-and-failure-modes | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance/implementation-design.md | 第3章 コード探索と人間の確認で、変更箇所と実現方法を絞る | 処理を止める条件と責務を決めた後、GitHub Copilotで関連コードを探索した。文字列の一致だけではなく、暗号化・復号、レジストリの保存・読出し、値の利用先という意味から、呼出し関係と変更影響の候補を調べた。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/implementation-design | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance/results-and-reflections.md | 第7章　内製化の成果と、保守業務へAIを広げられた条件を振り返る | 今回の変更では、異常条件と停止位置、再インストールの案内、OS側の問題との責務分界を整理し、正常系への変更を限定した。コード上の事実、処理構造、Excel仕様書を合わせ、承認済み仕様に基づく修正と単体テストまで実施した。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/results-and-reflections | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance/reviewable-specifications.md | 第4章　分散した検討結果を、レビュー可能な仕様書へ集約する | 設計方針、GPTとの検討、コード調査、人間が確認した事実は、別々の場所にあった。実装前に、現行仕様と変更後仕様、異常条件、処理内容、影響範囲を同じ基準でレビューできるようにする必要があった。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/reviewable-specifications | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance/sharing-current-specifications.md | 第5章　確認した現行仕様をAI間で渡し、仕様書へ反映する | Excel仕様書のレビューで現行仕様の認識違いが見つかった。Microsoft 365 Copilotへ各行を説明し直すだけでは、処理の前後関係まで伝えるやり取りが増える。そこで、コードを参照できるGitHub Copilotで必 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/sharing-current-specifications | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance/structuring-failure-handling.md | 第2章　異常系の構造を整理し、設計方針を確定する | 異常系を網羅しようとすれば、再試行や自動修復を含む多くの実装が考えられる。しかし、今回の目的は既存ソフトウェアの暗号方式変更であり、正常系を全面的に作り直すことではなかった。発生頻度、工数、安全性、変更範囲、保守性、アプリケーショ | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance/structuring-failure-handling | 維持（一次判断）。 |
| src/content/cases/three-ai-maintenance.md | 複数AIを使い分けるレガシー保守 | 仕様・コード・過去背景を参照できるAIを使い分け、調査から実装までをつないだ保守事例です。成果物の受け渡しごとに人間が前提を確認し、AIを使える業務範囲を広げました。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | cases/three-ai-maintenance | 維持（一次判断）。 |
| src/content/cases/understanding-systems-as-capability.md | 理解できないシステムは、コストである | 問い合わせのたびに再調査していた既存システムを、仕様・UI・処理関係から理解可能な状態へ整えた経験を紹介する。刷新の前に、調査結果を再利用できる知識へ変える意義を考える。 | OBSOLETE | 旧AI環境下で行った仕様復元とRAGへの再利用を紹介する記事です。現在はGitHub Copilotがコードベースを参照できるため、ここで述べた理解の手順を現在の推奨構成としては扱いません。人による確認と判断は引き続き必要です。 | cases/understanding-systems-as-capability | 既存の保存・公開範囲を維持。 |
| src/content/essays/ai-career-market.md | 採用される側から見たAI人材の転職概況 | 採用される側の視点から、AIの経験年数だけでは伝わらない専門性を考察する。RAG・評価・システム統合などの役割と、設計判断や責任範囲を外部へ示す必要性を論じる。 | OBSOLETE | 2026年8月時点の転職市場や職種の見え方を、採用される側から記した記事です。市場の状況は変わるため、現在の求人動向や職種選択の推奨としては扱いません。 | essays/ai-career-market | 既存の保存・公開範囲を維持。 |
| src/content/essays/ai-roles-beyond-fde.md | AI人材はFDEだけではない――これから進む専門職の細分化 | AIを実際の仕事へ組み込むには、モデルの操作だけでなく、設計・実装・評価を担う専門性が必要です。FDEを起点に、Architecture・Engineering・Evaluationなどの責任が分かれていく見通しを考察します。 | OBSOLETE | 公開当時のFDEという職名とAI人材の役割分化を論じた記事です。職名や各社の責任範囲は変化するため、現在の職種分類としてではなく、当時の考察として扱います。 | essays/ai-roles-beyond-fde | 既存の保存・公開範囲を維持。 |
| src/content/essays/ai-use-and-operation.md | AIは誰でも使えるようになったのに、なぜ業務で使いこなせる人は少ないのか | AIへ質問し生成する敷居が下がっても、業務へ組み込み続ける能力は自動的には広がりません。技術と組織の変化の速度差、良い出力が技能の差を隠す仕組み、運用能力を共有する難しさから、その原因を考えます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/ai-use-and-operation | 維持（一次判断）。 |
| src/content/essays/dx-and-value.md | DXを学んで、「価値」という言葉が気になるようになった | DXを学ぶ中で出会った「価値」という視点が、AI・RAG・エージェントを見る順序をどう変えたか。技術導入ではなく、誰の仕事や判断をどう変えるかからAIを考える。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/dx-and-value | 維持（一次判断）。 |
| src/content/essays/it-strategy-and-not-building.md | IT戦略では「何を作らないか」も設計する | システムを新しく作る前に、保守・変更・移行・廃止までの負担を考えます。既存の仕組みを使う選択も含め、作るものと作らないものを判断します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/it-strategy-and-not-building | 維持（一次判断）。 |
| src/content/essays/legacy-change-and-retirement.md | レガシーシステムは、変えやすくしながら終わらせる | 廃止予定でも変更要求が続く既存システムを、どう保守しながら終わらせるか考えます。依存や変更箇所を減らし、役割を段階的に移す判断を整理します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/legacy-change-and-retirement | 維持（一次判断）。 |
| src/content/essays/model-competition-and-ecosystems.md | AIはどこへ進化しているのか — モデル競争の裏にある「構造」と「エコシステム」 | AIの競争を、文脈を蓄積する仕組みと構造を生成する能力という二つの観点から考察する。企業の固定分類ではなく、利用権限・評価・運用を含め、情報を価値へつなぐ条件を問う。 | RETIRE | AI企業をエコシステムと生成能力で二分する当時の説明です。現在の使い分けを判断する際には、モデル性能に加えてContextや利用条件を確認してください。 | essays/model-competition-and-ecosystems | 既存の保存・公開範囲を維持。 |
| src/content/essays/rethink-work-before-ai.md | AI化する前に、業務そのものを疑う | AIへ任せる前に、その仕事をなくす・まとめる・変える・単純化できないか考えます。業務改善の手順（ECRS）を踏まえ、残る仕事を人間・既存ソフトウェア・AIのどれへ任せるか判断します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/rethink-work-before-ai | 維持（一次判断）。 |
| src/content/essays/trust-in-ai-generated-content.md | AI生成コンテンツは、なぜ信頼されにくいのか | 業務でAI生成文を使う経験から、文章の信頼を生成主体ではなく理解・検証・レビュー・確定の工程で考える。根拠へ戻り、採用可否を判断する人間の役割を整理する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/trust-in-ai-generated-content | 維持（一次判断）。 |
| src/content/essays/what-not-to-build-with-ai.md | AIで作れる時代に、何を作らないか | AIによって作る費用が下がるほど、作る前の選択と、残す・変える・統合する・終える判断が重要になる。生成量ではなく、価値とライフサイクルから作らないものを決める。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | essays/what-not-to-build-with-ai | 維持（一次判断）。 |
| src/content/evaluation-hitl/code-evaluation-acceptance.md | コード生成AIの評価と採用設計 | AIが書いたコードを、安全に採用できる変更かどうか確認する工程を設計します。コンパイラ・テスト・静的解析・人間のレビューを組み合わせ、未確認の変更を本番へ流しません。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | evaluation-hitl/code-evaluation-acceptance | 維持（一次判断）。 |
| src/content/evaluation-hitl/datasets-and-regression.md | AI評価データセットと回帰評価設計 | 通常・曖昧・情報不足・拒否すべき入力と期待動作を評価データセットに記録する。システム全体の版管理、回帰比較、AI採点の確認、本番の失敗を評価へ戻す運用を扱う。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | evaluation-hitl/datasets-and-regression | 維持（一次判断）。 |
| src/content/evaluation-hitl/human-review-capability.md | AI時代において「レビューできる人」が価値を持つ理由 | AIの出力に対して、根拠を確認し、採否を判断し、責任を持てる人の役割を論じる。単にAIを操作することと、組織で安全に使える状態を作ることを区別する。 | RETIRE | この内容は現在の推奨ではありません。人によるレビューについては「AI出力の責任境界とHITL」で、採用・承認・実行の責任を確認できます。 | evaluation-hitl/responsibility-and-hitl | 既存の保存・公開範囲を維持。 |
| src/content/evaluation-hitl/qa-evaluation.md | QAチャット評価設計思想 | AIの回答が正しいかだけでなく、根拠の提示、回答を控える判断、人への引き継ぎも評価します。検索から業務効果までを分けて測り、QAの改善箇所を見つけます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | evaluation-hitl/qa-evaluation | 維持（一次判断）。 |
| src/content/evaluation-hitl/responsibility-and-hitl.md | AI出力の責任境界とHITL | AIが答えや作業案を出した後、誰が確認し、採用し、実行を承認するかを決めます。人への引き継ぎ条件・根拠・記録まで含めてHuman in the Loopを設計します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | evaluation-hitl/responsibility-and-hitl | 維持（一次判断）。 |
| src/content/foundations/ai-business-design/asking-versus-delegating.md | 第3章　AIに聞くことと、AIに仕事を任せることは違う | 資格学習でAIへ聞くことと、組織固有の仕事を任せることの違いを、必要な知識から考える。必要な情報をAIへ届け、不足する場合は人間へ戻す設計を扱う。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/ai-business-design/asking-versus-delegating | 維持（一次判断）。 |
| src/content/foundations/ai-business-design/delegation-and-responsibility.md | 第1章　AIに仕事を任せても、責任は消えない | AIへ作業を移しても残る、判断・承認・例外処理・監査・最終責任を整理する。AI・人間・既存システムを一つの系として、責任が途切れない業務を設計する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/ai-business-design/delegation-and-responsibility | 維持（一次判断）。 |
| src/content/foundations/ai-business-design/evaluating-business-efficiency.md | 第2章　AI導入は効率化とは限らない | 要件をAIで文章化した後、理解・説明・合意形成が不足して手戻りになった経験から、業務全体の効率を考えます。レビューしやすさ、確認コスト、総工数と経過時間を区別した評価、改善後の業務の流れを扱います。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/ai-business-design/evaluating-business-efficiency | 維持（一次判断）。 |
| src/content/foundations/ai-business-design/explainable-delegation.md | 第4章　AIに任せない条件を、先に決める | AI出力を業務で採用する人間が、採用理由と誤りへの対応を説明できる範囲に委任を限定する。説明できない場合の役割縮小、停止・エスカレーション条件を扱う。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/ai-business-design/explainable-delegation | 維持（一次判断）。 |
| src/content/foundations/ai-business-design/human-judgment-capability.md | 第5章　AI時代、人間には「判断する力」が求められる | AIが定型作業を担った後に残る難しい判断を、人間が根拠・影響・権限をもって行うための能力を整理する。Human in the Loopと教育をAI導入の一部として扱う。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/ai-business-design/human-judgment-capability | 維持（一次判断）。 |
| src/content/foundations/ai-business-design.md | 『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』 | AIへ仕事を任せても、人間の判断や責任は残ります。必要な情報、確認の手間、例外対応を含めて、AI・人間・既存システムの仕事をどう分けるか考える連載です。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/ai-business-design | 維持（一次判断）。 |
| src/content/foundations/answer-scope.md | なぜ回答範囲を制限した方がよいのか | AIが答えてよい質問と、人へ渡すべき質問の範囲を決めます。対象・版・根拠・入力条件を明示し、回答・拒否・引き継ぎの品質を継続して測ります。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/answer-scope | 維持（一次判断）。 |
| src/content/foundations/applicability-and-delegation.md | AI適用可否と委任レベルの設計 | 生み出したい価値と業務変化から、AI・人間・既存システムの役割を逆算する。誤りの影響や検証可能性を踏まえ、AIを使わない選択も含む最小の委任範囲を決める。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/applicability-and-delegation | 維持（一次判断）。 |
| src/content/foundations/conditional-probability.md | 生成AIの条件付き確率モデル基礎 | 同じAIでも、渡す情報や指示が変わると答えが変わります。その仕組みを条件付き確率から整理し、回答のばらつきと、RAG・ガードレール・評価で制御できる範囲を考えます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/conditional-probability | 維持（一次判断）。 |
| src/content/foundations/generation-and-acceptance.md | AIは自動化できる。しかし、その出力を確定値として扱ってはいけない | AIが質問表へ自動入力した値が、確認済みの値と同じように扱われた事例を考える。候補・根拠・人間の確認・明示的な確定を分離し、判断を追跡できる入力工程を提案する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/generation-and-acceptance | 維持（一次判断）。 |
| src/content/foundations/glossary.md | Reference索引 | 用語、数式、評価指標、責任状態を目的別に整理したReferenceへの索引。既存URLから現在の参照資料へ進むための入口。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/glossary | 維持（一次判断）。 |
| src/content/foundations/guardrail-models.md | ガードレールの数学的説明 | AIへ「してはいけない」と伝えることと、システムが実際に止めることは異なります。指示による誘導、生成時の制約、検証、実行認可を分け、Guardrailの限界を説明します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/guardrail-models | 維持（一次判断）。 |
| src/content/foundations/hallucination-mechanisms.md | ハルシネーションの発生原理 | もっともらしい出力が必要な根拠に支えられない状態を、ハルシネーションとして整理する。知識不足・検索失敗・根拠の誤読・未検証の採用など、発生要因を分けて考える。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/hallucination-mechanisms | 維持（一次判断）。 |
| src/content/foundations/layered-hallucination-controls.md | ハルシネーションの多層制御設計 | 誤答の生成、見逃し、採用・実行を分け、業務への流出リスクを多層で制御する。根拠取得・検証・回答拒否・人への移管・実行権限を組み合わせた設計を示す。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/layered-hallucination-controls | 維持（一次判断）。 |
| src/content/foundations/llm-as-probabilistic-model.md | LLMを確率モデルとして設計するという立場 | LLMを次トークンの確率モデルとして捉え、出力の揺らぎと制約を整理する。プロンプトやRAGを小技ではなく、不確実性を前提とした出力分布の設計として考える。 | RETIRE | LLMを数学的・確率的な対象として扱う過去の考察です。現在の生成の仕組みと設計上の注意点は、AI理論の各テーマで確認できます。 | foundations/conditional-probability | 既存の保存・公開範囲を維持。 |
| src/content/foundations/temperature-design.md | Temperature設計指針 | AIの答えの出方を変える設定は、正しさを保証する設定ではありません。Temperatureが生成の確率分布へ与える影響を説明し、用途に合う値を評価と実験で選びます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | foundations/temperature-design | 維持（一次判断）。 |
| src/content/knowledge-context/context-before-model-performance.md | AIを使い分ける基準は、モデル性能よりコンテキストではないか | 複数AIを実務で使った経験から、モデル性能とともに情報へアクセスできる条件を重視する。必要なContextを特定し、適切なAIへ渡し、役割を分担させる考え方を整理する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/context-before-model-performance | 維持（一次判断）。 |
| src/content/knowledge-context/human-and-ai-documentation.md | 人向け資料とAI向け資料の分離設計 | 人が全体を理解する資料と、AIが根拠を検索する資料は、読み方が異なります。知識の正本は一つに保ち、版・条件・例外を共有しながら、表示と取得単位を分けて設計します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/human-and-ai-documentation | 維持（一次判断）。 |
| src/content/knowledge-context/instruction-knowledge-evidence.md | Instruction・Knowledge・Evidenceの責務分離 | AIへの作業指示、継続して参照する知識、今回の回答を支える根拠を分けます。Instruction・Knowledge・Evidenceの役割を明確にし、更新や失敗原因の確認を個別に行える構成を考えます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/instruction-knowledge-evidence | 維持（一次判断）。 |
| src/content/knowledge-context/prompt-failure-modes.md | プロンプト設計の失敗モード | 指示を長くしても、必要な情報が足りなかったり、指示同士が矛盾していたりすればAIは失敗します。Context不足・情報の混在・検証基準の欠如を分けて、直すべき箇所を判断します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/prompt-failure-modes | 維持（一次判断）。 |
| src/content/knowledge-context/prompt-structure.md | プロンプト設計の基本構造 | AIへ何を頼み、何を根拠にし、どの形で返してほしいかを分けて伝えます。Role・Task・Contextなどからプロンプトを構成し、権限や承認はシステム側の制御と区別します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/prompt-structure | 維持（一次判断）。 |
| src/content/knowledge-context/qa-behavior-constraints.md | QA行動制約Knowledge | 問い合わせに何を答え、何を開示せず、どこで人へ渡すかを決めます。対応規則をKnowledgeとして管理し、指示に書くだけでなく、実行時の検証・認可で業務への流出を防ぎます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/qa-behavior-constraints | 維持（一次判断）。 |
| src/content/knowledge-context/qa-operations.md | QAチャット運用思想 | 問い合わせAIを、回答して終わる道具ではなく、知識を確認・更新し続ける仕組みとして設計します。検索・回答・拒否・人への引き継ぎ・記録を、QAとKnowledgeの運用としてつなぎます。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | knowledge-context/qa-operations | 維持（一次判断）。 |
| src/content/practices/adoption-governance.md | AI導入を業務へ定着させる | AIツールを配るだけでなく、日々の仕事で使い続けられる条件を考えます。人が確認する場面、失敗時の対応、運用結果を改善へ戻す方法を整理します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | practices/adoption-governance | 維持（一次判断）。 |
| src/content/practices/ai-adoption-and-effective-use.md | AIは使われている。でも使いこなされていない | AIを業務で使いこなすとは、利用量を増やすことではなく、適用可否・情報・委任範囲・検証・責任・権限を設計できることです。運用の評価から改善・縮小・統合・終了まで判断する実務上の条件を整理します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | practices/ai-adoption-and-effective-use | 維持（一次判断）。 |
| src/content/practices/ai-education-principles.md | 生成AI教育はなぜ難しいのか ― 変わらない原則と変わり続ける実践を分けて設計する | AIの操作を覚えるだけでなく、答えを確認し、使うか止めるか判断する力を育てます。責任境界・HITLの原則とツール別の実践を分け、業務の品質と工数から教育を見直します。 | MERGE | E：原則・実践の分離／横展開の条件分解が短い実務ガイドと重複。独自の体験・例を保持できるか追加確認してから統合する。 | practices/education-and-capability | 候補のみ。今回のLifecycle・URL・本文変更なし。 |
| src/content/practices/education-and-capability.md | AI教育を原則と実践に分ける | 変化しにくい設計原則、更新の速い製品知識、業務固有の判断を分ける。AIの出力を評価し、使うか、戻すか、止めるかを判断できる人間の能力までAI導入の一部として設計する。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | practices/education-and-capability | 維持（一次判断）。 |
| src/content/practices/transferring-ai-practices.md | 全員の業務が違うのに、AI活用事例をそのまま横展開できるのか | 成功事例のコピーではなく、目的・情報・品質条件を分解して自分の業務へ適用する横展開を考える。社内共有の経験から、AI活用を組み立てる前提知識と判断構造の重要性を述べる。 | MERGE | E：原則・実践の分離／横展開の条件分解が短い実務ガイドと重複。独自の体験・例を保持できるか追加確認してから統合する。 | practices/transferring-practices | 候補のみ。今回のLifecycle・URL・本文変更なし。 |
| src/content/practices/transferring-practices.md | AI活用を別の業務へ横展開する | 成功事例をそのまま複製せず、目的、情報、判断、リスク、評価へ分解し、別の業務へ移せる要素を見極める。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | practices/transferring-practices | 維持（一次判断）。 |
| src/content/reference/evaluation-metrics.md | 評価指標リファレンス | 検索や回答、人への引き継ぎがうまく働いているかを、何で測るか確認する資料です。Retrieval・安全性・運用品質・レビュー負荷の指標を、対象集合や閾値と合わせて定義します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | reference/evaluation-metrics | 維持（一次判断）。 |
| src/content/reference/glossary.md | 基本用語集 | Rosariumで使う基本用語を、モデル・情報・工程・責任の観点から定義する。用語を製品名や流行語ではなく、設計上の役割として確認するための参照資料。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | reference/glossary | 維持（一次判断）。 |
| src/content/reference/mathematical-reference.md | 数式・記号リファレンス | AIの出力の揺らぎや失敗リスクを考えるときに使う数式をまとめています。条件付き確率・Temperature・RAG・期待損失について、数学上の定義と設計用の簡略モデルを区別します。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | reference/mathematical-reference | 維持（一次判断）。 |
| src/content/reference/responsibility-state-model.md | 責任境界・状態モデル | AIの能力・権限・説明責任を分離し、生成から実行・監視までの成果物状態を定義する。候補生成を承認や確定処理と混同しないための安定した参照モデル。 | KEEP | H：問い・設計責務の一次確認では廃止根拠なし。全文再評価が済んでいないページを含むため暫定。 | reference/responsibility-state-model | 維持（一次判断）。 |
| src/content/software-engineering/ai-design-assistance.md | 設計支援AIは消えない。コード生成の次に残る領域 | コード生成と設計判断の性質の違いから、設計支援AIの役割を考察する。実装時間の短縮に加え、選択肢や責務を整理して人間の意思決定を支援する価値を論じる。 | RETIRE | この内容は現在の推奨ではありません。設計から実装・検証までの委任については「AIを開発工程に組み込む」で、検証・反映権限・復旧の観点から確認できます。 | software-engineering/development-workflow | 既存の保存・公開範囲を維持。 |
| src/content/software-engineering/ai-driven-development.md | 私が考えるAI駆動開発 ― AI・人間・成果物をどうつなぐか | 要件整理・既存仕様調査・設計・仕様化・実装・テストを一つのAI活用工程として考える。3つのAIを役割分担させた経験と、成果物を通じた受け渡しを紹介する。 | MERGE | E：工程原則・実務経験とも既存説明先へ集約できる。全文比較済み。 | software-engineering/development-workflow + cases/three-ai-maintenance | 本文保存、RETIRED、互換redirect。 |
| src/content/software-engineering/code-generation-and-work-design.md | コード生成AIはなぜ業務を変えないのか — 設計支援として使うべき理由 | コード生成の高速化だけでは残る、業務の設計・責務分割・運用上の判断を考察する。AIを設計の理解・維持・改善に使い、意思決定の負担を減らす視点を示す。 | MERGE | D/E：コード生成の場所・設計との対立より、変更委任の工程設計へ統合する。 | software-engineering/development-workflow | 統合済み。本文保存・既存redirect維持。 |
| src/content/software-engineering/code-generation-boundaries.md | コード生成を使うべき場所 | AIにコードを書かせる前に、変更の影響を確認できるか、失敗時に戻せるかを考えます。必要なContext・テスト・人間レビューの費用を整理し、安全に採用できた変更で評価します。 | MERGE | D/E：コード生成の場所・設計との対立より、変更委任の工程設計へ統合する。 | software-engineering/development-workflow | 統合済み。本文保存・既存redirect維持。 |
| src/content/software-engineering/code-generation-models.md | コード生成AIの正体 | コード生成AIは、文章を出すモデルだけで成り立つわけではありません。必要情報（Context）、編集ツール、権限、テストを分け、生成から採用までの仕組みと失敗箇所を説明します。 | KEEP | H：全文確認済み。構成・工程・受け渡しにそれぞれ独立した問いがあり、固定的な能力境界ではない。 | software-engineering/code-generation-models | 維持。今回の本文変更なし。 |
| src/content/software-engineering/code-maintenance-context.md | なぜAIは新規コードよりコード保守に強いのか | 既存コード・テスト・差分が、AIの生成条件と検証根拠になる理由を整理する。保守が常に容易とはせず、依存関係や検索コストを踏まえて調査・局所変更・検証へ分解する。 | REWRITE | B/G：実務で選んだ構成や適用例を、固定的な能力上限・分業と区別する。 | software-engineering/code-maintenance-context | 本文を最小改訂。履歴へ反映。 |
| src/content/software-engineering/development-workflow.md | AIを開発工程に組み込む | AIが受け取る入力、出力成果物、根拠、検証、停止条件、承認者を開発工程として定義する。検証済みの成果物だけを次へ渡すための契約・Gate・記録・手動経路を整理する。 | KEEP | H：全文確認済み。構成・工程・受け渡しにそれぞれ独立した問いがあり、固定的な能力境界ではない。 | software-engineering/development-workflow | 維持。工程ページへ実務Caseの導線を補強。 |
| src/content/software-engineering/multi-ai-orchestration.md | 複数AIの役割分担と工程設計 | 複数のAIを使うとき、誰に何を渡し、どの成果物を確認して次へ進むかを決めます。Task・Context・Tool・権限を役割ごとに整理し、工程全体の品質と費用を管理します。 | KEEP | H：全文確認済み。構成・工程・受け渡しにそれぞれ独立した問いがあり、固定的な能力境界ではない。 | software-engineering/multi-ai-orchestration | 維持。今回の本文変更なし。 |

## 残作業

全公開本文の全文精読、数式・外部製品仕様の逐条確認、全入口の操作確認は未完了。暫定KEEPを確定扱いしない。教育・横展開の統合は独自例を吸収した後に判断する。今回の検証結果は下記へ追記する。
## 今回の検証結果

- npm run check：133ファイル、errors / warnings / hints 各0。コンテンツ・provenance・公開範囲検証成功。
- npm test：48件すべて成功。
- npm run build：成功。141 HTML、7,535内部リンク・アセット（anchor/base pathを含む）、198コンテンツリンクの検証成功。
- Navigation：116公開ページ、最大4ステップ、孤立0。SEO：95 TechArticles、116 sitemap URL、indexable orphan 0。
- Lifecycle：旧本文・移入元snapshot・公開日保持、既存redirect・noindex・通常一覧除外・検索filter整合。新しい退役は行っていない。
- Garden Notesと記事履歴の集計テスト成功。同日対象の重複なし。
- 表示：変更3記事、AI、DX、Software Engineering入口を1920×1080 / 1440×900 / 375×812 / 430×932、Dark / Lightで計48表示。スクリーンショットを保存し、横overflow 0。測定対象文字のLight最小contrast 4.51。
- GA4、日付、TOC、Reference、アクセシビリティ、性能予算の既存検証成功。
- 上記は実装と公開導線の検証であり、全本文の学術的・技術的前提を逐条検証したことを意味しない。
