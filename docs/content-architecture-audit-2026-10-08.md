# Rosarium 全公開コンテンツ監査・統合結果（2026-10-08）

公開98ファイルの本文を確認した。非公開2ファイルは対象外。Bookの章を含む。技術の新旧ではなく、問い、重複、実務根拠、権限・検証・責任・運用の設計として評価した。新規記事・物理削除はない。

## 判断件数

- KEEP: 61
- REWRITE: 9
- MERGE: 9
- RETIRE: 4
- OBSOLETE: 15
- DELETE: 0

MERGE 9件には先行して実施済みのコード生成関連3件を含む。今回追加の統合は6件。REWRITEには先行する保守コンテキスト改訂を含む。既存RETIRED 4件は維持。旧Case要約1件を詳細Bookへ統合したためOBSOLETEは15件となる。公開コンテンツの現LifecycleはACTIVE 70／OBSOLETE 15／RETIRED 13。

## 統合判断と残した独自情報

- practices/ai-education-principles → practices/education-and-capability
- practices/transferring-ai-practices → practices/transferring-practices
- essays/what-not-to-build-with-ai → essays/it-strategy-and-not-building
- architecture/agents-tools-and-workflows → software-engineering/multi-ai-orchestration
- foundations/generation-and-acceptance → evaluation-hitl/responsibility-and-hitl
- cases/understanding-systems-as-capability → cases/system-understanding
- software-engineering/ai-driven-development → software-engineering/development-workflow
- software-engineering/code-generation-boundaries → software-engineering/development-workflow
- software-engineering/code-generation-and-work-design → software-engineering/development-workflow

教育は質問表・QA・コード理解の経験、横展開は約1時間の共有経験と情報・影響の違い、Agent構成はストレージ整理と同期運用、採用設計は質問表の未確認値、非構築判断は生成候補増加と維持負担を統合先に残した。旧Case要約の調査成果と知識再利用は詳細Bookに既存の説明があり、同じ経験を再掲しない。統合元の本文と公開日は保存した。

## 中心となる知識構造

責任（Book第1章）→業務全体の効率（第2章）→業務固有の情報（第3章）→委任・停止条件（第4章／適用判断）→人間の判断能力（第5章）→運用・教育・横展開。開発はdevelopment-workflow、配置はmulti-ai-orchestration、保守情報はcode-maintenance-context、採用評価はcode-evaluation-acceptanceがそれぞれ異なる問いを扱う。原因分析ai-use-and-operationは実務総論と分離する。

数学・ガードレール・QA評価はモデル性能の古い上限ではなく、制御・測定・検索・強制の問いを持つため残した。式は仮定と保証範囲を示す説明モデルとして扱い、ROI実績へ読み替えない。特定企業の終了方針への推測を、機能と実装の分離・引き継ぎ条件の説明へ改訂した。

## 履歴・URL・入口

同日1entryを維持し、Garden Notesは記事22件改訂・9件統合、Case1件改訂の件数通知。詳細は中央の個別履歴で表示する。既存URLは既存方式（meta refresh＋JavaScript＋通常リンク）で統合先へ移動する。通常入口と本文リンクは統合先を直接参照する。歴史的な旧本文は変更しない。

## 再監査候補

3〜6か月後：code-generation-models、context-before-model-performance、multi-ai-orchestration、cost-latency-routing、security-threat-modeling、ai-use-and-operation。製品構成、接続権限、経路選択、組織変化の仮説は再確認する。今後の変化を予測した廃止は行わない。

## 全ページの判断

| Path | Title | Current Role | Decision | Reason | Canonical / Merge Target | Required Action |
|---|---|---|---|---|---|---|
| architecture/agents-tools-and-workflows | 「AIエージェントを0から作る時代」は本当に来るのか？ | 自宅PCのストレージ整理を題材に、AIによる判断・ルール設計と既存ツールによる実行を分けて考える。MCPを試した経験から、エージェントの価値を接続先と責務の設計に見いだす。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | software-engineering/multi-ai-orchestration | 統合済み・退役保存・互換redirect |
| architecture/change-and-reevaluation | AIシステムの変更・再評価設計 | AIシステムを変更したとき、どこを確認し直し、問題があればどう元へ戻すかを考えます。モデル・指示・知識・権限をVersion Bundleで管理し、再評価とリリースの条件を整理します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | architecture/change-and-reevaluation | 現在の公開範囲を維持 |
| architecture/cost-latency-routing | AIコスト・Latency・モデルルーティング設計 | 回答の速さやモデルの価格だけでなく、やり直しと人間の確認を含めて処理方法を選びます。品質・待ち時間（Latency）・リスクから、使うモデルや処理経路を評価します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | architecture/cost-latency-routing | 現在の公開範囲を維持 |
| architecture/observability-and-slo | AIシステムのオブザーバビリティとSLO設計 | 質問から検索・生成・検証・承認・実行までを記録し、誤回答の原因を追跡できる運用を考える。技術指標と品質指標を分け、SLOと異常時の対応を設計する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | architecture/observability-and-slo | 現在の公開範囲を維持 |
| architecture/prompts-as-interfaces | AI間インターフェースとしてのプロンプト | 複数のAIへ仕事を渡すとき、成果物・根拠・状態を取り違えずに引き継ぐ方法を考えます。プロンプトを受け渡しの契約として捉え、情報の型・意味・権限を検証します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | architecture/prompts-as-interfaces | 現在の公開範囲を維持 |
| architecture/reference-architecture | AI業務システムの参照アーキテクチャ | AIの答えをそのまま業務処理に使わず、確認・承認・実行を分ける全体構成を示します。必要情報（Context）の準備から監視までをつなぎ、誤生成が業務へ届く経路を制御します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | architecture/reference-architecture | 現在の公開範囲を維持 |
| architecture/security-threat-modeling | 生成AIセキュリティと脅威モデリング | AIが読む情報、使える権限、呼び出すツール、出力先を境界ごとに整理する。Prompt Injectionなどの脅威を想定し、影響の限定・検出・停止・復旧を設計する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | architecture/security-threat-modeling | 現在の公開範囲を維持 |
| career/overview | Career | 業務課題を整理し、AI・人間・既存システムの役割を決め、運用できる仕組みへ落とし込みます。企画から導入後の評価・改善・終了までを、一続きの設計対象として扱います。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | career/overview | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/continuous-improvement | 08. 導入後にどう育てるか | 誤回答や人への引き継ぎが起きた理由を調べ、次の改善へ戻す仕組みを設計します。知識不足・検索失敗・画面での離脱を分け、Knowledge・Retrieval・UI・業務のどこを直すか判断します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/continuous-improvement | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/customer-experience | 06. 顧客体験をどう変えたか | 利用者に製品分類や専門用語を理解させず、自然な言葉と段階的な追加質問で解決へ導くUX / UIを整理する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/customer-experience | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/design-principles | 09. この事例から得た設計原則 | 問い合わせ対応の設計から、他の業務でも使える判断原則を整理します。価値を起点に、AIと人の責任、回答根拠、停止条件、HITL、評価・改善をどう組み合わせるか考えます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/design-principles | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/executive-summary | 00. このケーススタディについて | 問い合わせ対応の何が問題で、AIと人の仕事をどう分ける設計なのかを短くまとめます。扱う設計範囲と、確認できる事実・設計条件・試算の区別をExecutive Summaryとして示します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/executive-summary | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/human-handoff | 07. AIから人間へどう引き継ぐか | 会話履歴、機種、環境、エラー、確認済み事項、検索結果、参照文書を失わず、AIから人間へ対応を継続する設計を示す。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/human-handoff | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/knowledge-design | 04. RAG / Knowledgeをどう設計したか | 検索で見つかった文書でも、顧客への回答根拠として使えるとは限りません。製品・機種・版数・公開可否を確認し、RAGが参照してよいKnowledgeの範囲を設計します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/knowledge-design | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/poc-evaluation | 03. PoCで「使えるか」をどう判断したか | AIが一度答えられたことと、問い合わせ業務で使えることは異なります。試験導入（PoC）で検索・対話・回答を分け、根拠の適合性と人へ渡す判断から採用可否を見ます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/poc-evaluation | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/responsibility-boundary | 02. 何をAIに任せ、何を人間に残したか | 問い合わせの性質を分け、自然言語処理と根拠検索はAIへ、専門判断と例外対応は人間へ残す責任境界を整理する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/responsibility-boundary | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/stopping-conditions | 05. AIをどこで止めるか | 根拠がない、機種が分からない、専門判断が必要なときには、AIの回答を止めます。高影響な操作や非公開情報も停止条件として整理し、人へ引き継ぐFail Safeを設計します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/stopping-conditions | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx/why-ai | 01. なぜAIを導入したのか | 検索高速化では変わらない全件有人の業務構造を捉え、顧客の自己解決と専門対応への集中という価値からAI適用を考える。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx/why-ai | 現在の公開範囲を維持 |
| cases/customer-support-ai-dx | 生成AI / RAGによる顧客サポートDX | 顧客が自分で解決できる問い合わせと、人の専門判断が必要な問い合わせを分け、対応の流れを設計する事例です。RAGによる根拠検索から、人への引き継ぎ、評価・改善までを扱います。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/customer-support-ai-dx | 現在の公開範囲を維持 |
| cases/specification-debt-review | 3万ページの仕様書をAIで横断レビューする | 分割されたMarkdown仕様書をPythonで統合し、GitHub Copilotで横断レビューした実務事例です。現在のコードを正本に仕様書を照合し、コードだけでは決まらない部分を人間が判断して、最終修正を行いました。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/specification-debt-review | 現在の公開範囲を維持 |
| cases/system-understanding/connecting-ui-and-internals | 第7章 UI操作と内部処理を結び付け、操作結果を追えるようにする | 内部構造の知識をUI操作と結び付け、操作・実行処理・結果の対応を整理する。利用者が機能へ到達し、操作結果を理解できる状態へ知識をつなぐ。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/connecting-ui-and-internals | 現在の公開範囲を維持 |
| cases/system-understanding/human-and-ai-knowledge | 第6章 人が読む仕様とAIが使うKnowledgeを分ける | 人がシステムの全体像を理解する図と、AIが必要な根拠を探す資料を分けます。図とMarkdownを使い、文脈を残しながら、RAGが取得する情報の範囲を整理します。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/human-and-ai-knowledge | 現在の公開範囲を維持 |
| cases/system-understanding/project-structure | 第3章 調査の起点を作るため、ファイルとクラスの役割を整理する | フォルダ・ファイル・クラスの役割をMarkdownで整理し、調査のための地図を作る。AIが構造の仮説を出し、人間がコードで検証する初動の進め方を示す。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/project-structure | 現在の公開範囲を維持 |
| cases/system-understanding/qa-case-study-revisited | 第12章 QAで暗号処理を調査し、人間の変更判断へつなぐ | セキュリティ要件の強化に際し、QAチャットで既存方式と処理位置を調べ、変更の検討につなげた事例。AIの調査支援と、人間による組織条件・将来影響の判断を分けて振り返る。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/qa-case-study-revisited | 現在の公開範囲を維持 |
| cases/system-understanding/qa-case-study | 第2章 対象システムの変更を妨げる構造と知識の不足を整理する | 対象となる約3万行のC#業務アプリケーションの状況を整理する。不要コード・連携責務・処理フロー・設計意図が分かりにくい問題から、仕様と知識を復元する必要性を示す。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/qa-case-study | 現在の公開範囲を維持 |
| cases/system-understanding/qa-evaluation | 第9章 正しさ・出典・回答拒否から、QAの利用可否を評価する | 構築したQAを、正しさ・出典・一貫性・耐誘導性などの観点で評価する。誤情報、粒度、根拠不足、推測による回答を見つけ、改善対象を明確にする。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/qa-evaluation | 現在の公開範囲を維持 |
| cases/system-understanding/qa-operations | 第11章 仕様変更に追従できるKnowledge更新フローを作る | 仕様や運用環境の変化に合わせ、RAG・人間向け資料・UI操作手順を更新する方法を整理する。古い情報による誤案内を防ぎ、継続的に正しい状態を維持する運用を考える。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/qa-operations | 現在の公開範囲を維持 |
| cases/system-understanding/rag-implementation | 第8章 復元したKnowledgeを、根拠を確認できるQAへつなぐ | 質問に関係する根拠を探し、実務で確認できる回答へつなぐ仕組みを整えます。RAGの検索範囲・知識の粒度・画面操作との対応を調整し、AIの生成と人間の検証を分担します。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/rag-implementation | 現在の公開範囲を維持 |
| cases/system-understanding/rag-improvement | 第10章 評価結果をKnowledgeと回答範囲の改善へ戻す | 評価で見つかった誤情報・根拠不足・粒度の不統一・不完全データを修正する。Knowledgeの改善と再評価を繰り返し、回答の一貫性と信頼性を高める過程を示す。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/rag-improvement | 現在の公開範囲を維持 |
| cases/system-understanding/recovering-code-structure | 第4章 コードから仕様と依存関係を復元する | ソースコードからクラス・ファイルの役割と連携を読み解き、仕様と構造を整理する。実行フローや不要コードも確認し、人間が理解して変更できる基盤を作る。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/recovering-code-structure | 現在の公開範囲を維持 |
| cases/system-understanding/system-understanding-problems | 第1章 仕様を答えられない状態から、復元すべき情報を決める | UI中心の古い仕様書では問い合わせに答えられなかった背景を示す。廃止できないシステムを使い続けるため、コード・実動作・既存知識から現行仕様を再構成する出発点を説明する。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/system-understanding-problems | 現在の公開範囲を維持 |
| cases/system-understanding/visualizing-process-flows | 第5章 処理の流れを復元し、変更影響を追えるようにする | クラスやモジュールの構造に加え、順序・分岐・呼出し関係を図で可視化する。代表的なフローを抽出し、動きと変更影響を人間が把握できる状態にする。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding/visualizing-process-flows | 現在の公開範囲を維持 |
| cases/system-understanding | 理解しにくいレガシーシステムを、変更判断できる状態へ変える | GPT-4のみを利用していた当時のAI環境下で、レガシーシステムの仕様を復元した参考事例です。コード・UI・実動作を照合し、人とAIが仕様確認や変更判断に使える形へ整理しました。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | cases/system-understanding | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/code-generation-and-unit-tests | 第6章　全体像を共有しながら、コード生成と単体テストを進める | 承認済み仕様を基に、GitHub Copilotへ処理全体の構造や関数間の関係、必要なUI情報を共有した。関数だけを切り出すと、入力の前提や後続処理への影響が抜けやすい。ただし、情報を渡したことをもってAIが全体を完全に理解したと | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/code-generation-and-unit-tests | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/cryptography-and-failure-modes | 第1章 暗号方式の変更で見直すべき異常系を特定する | CRA対応をきっかけに、長年使ってきた暗号方式をCNG・DPAPIへ変更することになった。既存の方式はMD5を内部で用いていたが、変更の対象はAPIの呼び替えだけではない。新しいAPIでは失敗を返すため、保存・読出し・復号の各段階 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/cryptography-and-failure-modes | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/implementation-design | 第3章 コード探索と人間の確認で、変更箇所と実現方法を絞る | 処理を止める条件と責務を決めた後、GitHub Copilotで関連コードを探索した。文字列の一致だけではなく、暗号化・復号、レジストリの保存・読出し、値の利用先という意味から、呼出し関係と変更影響の候補を調べた。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/implementation-design | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/results-and-reflections | 第7章　内製化の成果と、保守業務へAIを広げられた条件を振り返る | 今回の変更では、異常条件と停止位置、再インストールの案内、OS側の問題との責務分界を整理し、正常系への変更を限定した。コード上の事実、処理構造、Excel仕様書を合わせ、承認済み仕様に基づく修正と単体テストまで実施した。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/results-and-reflections | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/reviewable-specifications | 第4章　分散した検討結果を、レビュー可能な仕様書へ集約する | 設計方針、GPTとの検討、コード調査、人間が確認した事実は、別々の場所にあった。実装前に、現行仕様と変更後仕様、異常条件、処理内容、影響範囲を同じ基準でレビューできるようにする必要があった。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/reviewable-specifications | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/sharing-current-specifications | 第5章　確認した現行仕様をAI間で渡し、仕様書へ反映する | Excel仕様書のレビューで現行仕様の認識違いが見つかった。Microsoft 365 Copilotへ各行を説明し直すだけでは、処理の前後関係まで伝えるやり取りが増える。そこで、コードを参照できるGitHub Copilotで必 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/sharing-current-specifications | 現在の公開範囲を維持 |
| cases/three-ai-maintenance/structuring-failure-handling | 第2章　異常系の構造を整理し、設計方針を確定する | 異常系を網羅しようとすれば、再試行や自動修復を含む多くの実装が考えられる。しかし、今回の目的は既存ソフトウェアの暗号方式変更であり、正常系を全面的に作り直すことではなかった。発生頻度、工数、安全性、変更範囲、保守性、アプリケーショ | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance/structuring-failure-handling | 現在の公開範囲を維持 |
| cases/three-ai-maintenance | 複数AIを使い分けるレガシー保守 | 仕様・コード・過去背景を参照できるAIを使い分け、調査から実装までをつないだ保守事例です。成果物の受け渡しごとに人間が前提を確認し、AIを使える業務範囲を広げました。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | cases/three-ai-maintenance | 現在の公開範囲を維持 |
| cases/understanding-systems-as-capability | 理解できないシステムは、コストである | 問い合わせのたびに再調査していた既存システムを、仕様・UI・処理関係から理解可能な状態へ整えた経験を紹介する。刷新の前に、調査結果を再利用できる知識へ変える意義を考える。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | cases/system-understanding | 統合済み・退役保存・互換redirect |
| essays/ai-career-market | 採用される側から見たAI人材の転職概況 | 採用される側の視点から、AIの経験年数だけでは伝わらない専門性を考察する。RAG・評価・システム統合などの役割と、設計判断や責任範囲を外部へ示す必要性を論じる。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | essays/ai-career-market | 現在の公開範囲を維持 |
| essays/ai-roles-beyond-fde | AI人材はFDEだけではない――これから進む専門職の細分化 | AIを実際の仕事へ組み込むには、モデルの操作だけでなく、設計・実装・評価を担う専門性が必要です。FDEを起点に、Architecture・Engineering・Evaluationなどの責任が分かれていく見通しを考察します。 | OBSOLETE | A/C：当時の環境・実務記録として保存し、現在の推奨から区別する。 | essays/ai-roles-beyond-fde | 現在の公開範囲を維持 |
| essays/ai-use-and-operation | AIは誰でも使えるようになったのに、なぜ業務で使いこなせる人は少ないのか | AIへ質問し生成する敷居が下がっても、業務へ組み込み続ける能力は自動的には広がりません。技術と組織の変化の速度差、良い出力が技能の差を隠す仕組み、運用能力を共有する難しさから、その原因を考えます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | essays/ai-use-and-operation | 現在の公開範囲を維持 |
| essays/dx-and-value | DXを学んで、「価値」という言葉が気になるようになった | DXを学ぶ中で出会った「価値」という視点が、AI・RAG・エージェントを見る順序をどう変えたか。技術導入ではなく、誰の仕事や判断をどう変えるかからAIを考える。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | essays/dx-and-value | 現在の公開範囲を維持 |
| essays/it-strategy-and-not-building | IT戦略では「何を作らないか」も設計する | システムを新しく作る前に、保守・変更・移行・廃止までの負担を考えます。既存の仕組みを使う選択も含め、作るものと作らないものを判断します。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | essays/it-strategy-and-not-building | 改訂済み・更新履歴反映 |
| essays/legacy-change-and-retirement | レガシーシステムは、変えやすくしながら終わらせる | 廃止予定でも変更要求が続く既存システムを、どう保守しながら終わらせるか考えます。依存や変更箇所を減らし、役割を段階的に移す判断を整理します。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | essays/legacy-change-and-retirement | 改訂済み・更新履歴反映 |
| essays/model-competition-and-ecosystems | AIはどこへ進化しているのか — モデル競争の裏にある「構造」と「エコシステム」 | AIの競争を、文脈を蓄積する仕組みと構造を生成する能力という二つの観点から考察する。企業の固定分類ではなく、利用権限・評価・運用を含め、情報を価値へつなぐ条件を問う。 | RETIRE | D/E：既存の役割終了判断と保存範囲を維持する。 | essays/model-competition-and-ecosystems | 現在の公開範囲を維持 |
| essays/rethink-work-before-ai | AI化する前に、業務そのものを疑う | AIへ任せる前に、その仕事をなくす・まとめる・変える・単純化できないか考えます。業務改善の手順（ECRS）を踏まえ、残る仕事を人間・既存ソフトウェア・AIのどれへ任せるか判断します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | essays/rethink-work-before-ai | 現在の公開範囲を維持 |
| essays/trust-in-ai-generated-content | AI生成コンテンツは、なぜ信頼されにくいのか | 業務でAI生成文を使う経験から、文章の信頼を生成主体ではなく理解・検証・レビュー・確定の工程で考える。根拠へ戻り、採用可否を判断する人間の役割を整理する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | essays/trust-in-ai-generated-content | 現在の公開範囲を維持 |
| essays/what-not-to-build-with-ai | AIで作れる時代に、何を作らないか | AIによって作る費用が下がるほど、作る前の選択と、残す・変える・統合する・終える判断が重要になる。生成量ではなく、価値とライフサイクルから作らないものを決める。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | essays/it-strategy-and-not-building | 統合済み・退役保存・互換redirect |
| evaluation-hitl/code-evaluation-acceptance | コード生成AIの評価と採用設計 | AIが書いたコードを、安全に採用できる変更かどうか確認する工程を設計します。コンパイラ・テスト・静的解析・人間のレビューを組み合わせ、未確認の変更を本番へ流しません。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | evaluation-hitl/code-evaluation-acceptance | 現在の公開範囲を維持 |
| evaluation-hitl/datasets-and-regression | AI評価データセットと回帰評価設計 | 通常・曖昧・情報不足・拒否すべき入力と期待動作を評価データセットに記録する。システム全体の版管理、回帰比較、AI採点の確認、本番の失敗を評価へ戻す運用を扱う。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | evaluation-hitl/datasets-and-regression | 現在の公開範囲を維持 |
| evaluation-hitl/human-review-capability | AI時代において「レビューできる人」が価値を持つ理由 | AIの出力に対して、根拠を確認し、採否を判断し、責任を持てる人の役割を論じる。単にAIを操作することと、組織で安全に使える状態を作ることを区別する。 | RETIRE | D/E：既存の役割終了判断と保存範囲を維持する。 | evaluation-hitl/human-review-capability | 現在の公開範囲を維持 |
| evaluation-hitl/qa-evaluation | QAチャット評価設計思想 | AIの回答が正しいかだけでなく、根拠の提示、回答を控える判断、人への引き継ぎも評価します。検索から業務効果までを分けて測り、QAの改善箇所を見つけます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | evaluation-hitl/qa-evaluation | 現在の公開範囲を維持 |
| evaluation-hitl/responsibility-and-hitl | AI出力の責任境界とHITL | AIが答えや作業案を出した後、誰が確認し、採用し、実行を承認するかを決めます。人への引き継ぎ条件・根拠・記録まで含めてHuman in the Loopを設計します。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | evaluation-hitl/responsibility-and-hitl | 改訂済み・更新履歴反映 |
| foundations/ai-business-design/asking-versus-delegating | 第3章　AIに聞くことと、AIに仕事を任せることは違う | 資格学習でAIへ聞くことと、組織固有の仕事を任せることの違いを、必要な知識から考える。必要な情報をAIへ届け、不足する場合は人間へ戻す設計を扱う。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/ai-business-design/asking-versus-delegating | 現在の公開範囲を維持 |
| foundations/ai-business-design/delegation-and-responsibility | 第1章　AIに仕事を任せても、責任は消えない | AIへ作業を移しても残る、判断・承認・例外処理・監査・最終責任を整理する。AI・人間・既存システムを一つの系として、責任が途切れない業務を設計する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/ai-business-design/delegation-and-responsibility | 現在の公開範囲を維持 |
| foundations/ai-business-design/evaluating-business-efficiency | 第2章　AI導入は効率化とは限らない | 要件をAIで文章化した後、理解・説明・合意形成が不足して手戻りになった経験から、業務全体の効率を考えます。レビューしやすさ、確認コスト、総工数と経過時間を区別した評価、改善後の業務の流れを扱います。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/ai-business-design/evaluating-business-efficiency | 現在の公開範囲を維持 |
| foundations/ai-business-design/explainable-delegation | 第4章　AIに任せない条件を、先に決める | AI出力を業務で採用する人間が、採用理由と誤りへの対応を説明できる範囲に委任を限定する。説明できない場合の役割縮小、停止・エスカレーション条件を扱う。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/ai-business-design/explainable-delegation | 現在の公開範囲を維持 |
| foundations/ai-business-design/human-judgment-capability | 第5章　AI時代、人間には「判断する力」が求められる | AIが定型作業を担った後に残る難しい判断を、人間が根拠・影響・権限をもって行うための能力を整理する。Human in the Loopと教育をAI導入の一部として扱う。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/ai-business-design/human-judgment-capability | 現在の公開範囲を維持 |
| foundations/ai-business-design | 『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』 | AIへ仕事を任せても、人間の判断や責任は残ります。必要な情報、確認の手間、例外対応を含めて、AI・人間・既存システムの仕事をどう分けるか考える連載です。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/ai-business-design | 現在の公開範囲を維持 |
| foundations/answer-scope | なぜ回答範囲を制限した方がよいのか | AIが答えてよい質問と、人へ渡すべき質問の範囲を決めます。対象・版・根拠・入力条件を明示し、回答・拒否・引き継ぎの品質を継続して測ります。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/answer-scope | 現在の公開範囲を維持 |
| foundations/applicability-and-delegation | AI適用可否と委任レベルの設計 | 生み出したい価値と業務変化から、AI・人間・既存システムの役割を逆算する。誤りの影響や検証可能性を踏まえ、AIを使わない選択も含む最小の委任範囲を決める。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/applicability-and-delegation | 現在の公開範囲を維持 |
| foundations/conditional-probability | 生成AIの条件付き確率モデル基礎 | 同じAIでも、渡す情報や指示が変わると答えが変わります。その仕組みを条件付き確率から整理し、回答のばらつきと、RAG・ガードレール・評価で制御できる範囲を考えます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/conditional-probability | 現在の公開範囲を維持 |
| foundations/generation-and-acceptance | AIは自動化できる。しかし、その出力を確定値として扱ってはいけない | AIが質問表へ自動入力した値が、確認済みの値と同じように扱われた事例を考える。候補・根拠・人間の確認・明示的な確定を分離し、判断を追跡できる入力工程を提案する。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | evaluation-hitl/responsibility-and-hitl | 統合済み・退役保存・互換redirect |
| foundations/glossary | Reference索引 | 用語、数式、評価指標、責任状態を目的別に整理したReferenceへの索引。既存URLから現在の参照資料へ進むための入口。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/glossary | 現在の公開範囲を維持 |
| foundations/guardrail-models | ガードレールの数学的説明 | AIへ「してはいけない」と伝えることと、システムが実際に止めることは異なります。指示による誘導、生成時の制約、検証、実行認可を分け、Guardrailの限界を説明します。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | foundations/guardrail-models | 改訂済み・更新履歴反映 |
| foundations/hallucination-mechanisms | ハルシネーションの発生原理 | もっともらしい出力が必要な根拠に支えられない状態を、ハルシネーションとして整理する。知識不足・検索失敗・根拠の誤読・未検証の採用など、発生要因を分けて考える。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/hallucination-mechanisms | 現在の公開範囲を維持 |
| foundations/layered-hallucination-controls | ハルシネーションの多層制御設計 | 誤答の生成、見逃し、採用・実行を分け、業務への流出リスクを多層で制御する。根拠取得・検証・回答拒否・人への移管・実行権限を組み合わせた設計を示す。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/layered-hallucination-controls | 現在の公開範囲を維持 |
| foundations/llm-as-probabilistic-model | LLMを確率モデルとして設計するという立場 | LLMを次トークンの確率モデルとして捉え、出力の揺らぎと制約を整理する。プロンプトやRAGを小技ではなく、不確実性を前提とした出力分布の設計として考える。 | RETIRE | D/E：既存の役割終了判断と保存範囲を維持する。 | foundations/llm-as-probabilistic-model | 現在の公開範囲を維持 |
| foundations/temperature-design | Temperature設計指針 | AIの答えの出方を変える設定は、正しさを保証する設定ではありません。Temperatureが生成の確率分布へ与える影響を説明し、用途に合う値を評価と実験で選びます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | foundations/temperature-design | 現在の公開範囲を維持 |
| knowledge-context/context-before-model-performance | AIを使い分ける基準は、モデル性能よりコンテキストではないか | 複数AIを実務で使った経験から、モデル性能とともに情報へアクセスできる条件を重視する。必要なContextを特定し、適切なAIへ渡し、役割を分担させる考え方を整理する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | knowledge-context/context-before-model-performance | 現在の公開範囲を維持 |
| knowledge-context/human-and-ai-documentation | 人向け資料とAI向け資料の分離設計 | 人が全体を理解する資料と、AIが根拠を検索する資料は、読み方が異なります。知識の正本は一つに保ち、版・条件・例外を共有しながら、表示と取得単位を分けて設計します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | knowledge-context/human-and-ai-documentation | 現在の公開範囲を維持 |
| knowledge-context/instruction-knowledge-evidence | Instruction・Knowledge・Evidenceの責務分離 | AIへの作業指示、継続して参照する知識、今回の回答を支える根拠を分けます。Instruction・Knowledge・Evidenceの役割を明確にし、更新や失敗原因の確認を個別に行える構成を考えます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | knowledge-context/instruction-knowledge-evidence | 現在の公開範囲を維持 |
| knowledge-context/prompt-failure-modes | プロンプト設計の失敗モード | 指示を長くしても、必要な情報が足りなかったり、指示同士が矛盾していたりすればAIは失敗します。Context不足・情報の混在・検証基準の欠如を分けて、直すべき箇所を判断します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | knowledge-context/prompt-failure-modes | 現在の公開範囲を維持 |
| knowledge-context/prompt-structure | プロンプト設計の基本構造 | AIへ何を頼み、何を根拠にし、どの形で返してほしいかを分けて伝えます。Role・Task・Contextなどからプロンプトを構成し、権限や承認はシステム側の制御と区別します。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | knowledge-context/prompt-structure | 改訂済み・更新履歴反映 |
| knowledge-context/qa-behavior-constraints | QA行動制約Knowledge | 問い合わせに何を答え、何を開示せず、どこで人へ渡すかを決めます。対応規則をKnowledgeとして管理し、指示に書くだけでなく、実行時の検証・認可で業務への流出を防ぎます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | knowledge-context/qa-behavior-constraints | 現在の公開範囲を維持 |
| knowledge-context/qa-operations | QAチャット運用思想 | 問い合わせAIを、回答して終わる道具ではなく、知識を確認・更新し続ける仕組みとして設計します。検索・回答・拒否・人への引き継ぎ・記録を、QAとKnowledgeの運用としてつなぎます。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | knowledge-context/qa-operations | 現在の公開範囲を維持 |
| practices/adoption-governance | AI導入を業務へ定着させる | AIツールを配るだけでなく、日々の仕事で使い続けられる条件を考えます。人が確認する場面、失敗時の対応、運用結果を改善へ戻す方法を整理します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | practices/adoption-governance | 現在の公開範囲を維持 |
| practices/ai-adoption-and-effective-use | AIは使われている。でも使いこなされていない | AIを業務で使いこなすとは、利用量を増やすことではなく、適用可否・情報・委任範囲・検証・責任・権限を設計できることです。運用の評価から改善・縮小・統合・終了まで判断する実務上の条件を整理します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | practices/ai-adoption-and-effective-use | 現在の公開範囲を維持 |
| practices/ai-education-principles | 生成AI教育はなぜ難しいのか ― 変わらない原則と変わり続ける実践を分けて設計する | AIの操作を覚えるだけでなく、答えを確認し、使うか止めるか判断する力を育てます。責任境界・HITLの原則とツール別の実践を分け、業務の品質と工数から教育を見直します。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | practices/education-and-capability | 統合済み・退役保存・互換redirect |
| practices/education-and-capability | AI教育を原則と実践に分ける | 変化しにくい設計原則、更新の速い製品知識、業務固有の判断を分ける。AIの出力を評価し、使うか、戻すか、止めるかを判断できる人間の能力までAI導入の一部として設計する。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | practices/education-and-capability | 改訂済み・更新履歴反映 |
| practices/transferring-ai-practices | 全員の業務が違うのに、AI活用事例をそのまま横展開できるのか | 成功事例のコピーではなく、目的・情報・品質条件を分解して自分の業務へ適用する横展開を考える。社内共有の経験から、AI活用を組み立てる前提知識と判断構造の重要性を述べる。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | practices/transferring-practices | 統合済み・退役保存・互換redirect |
| practices/transferring-practices | AI活用を別の業務へ横展開する | 成功事例をそのまま複製せず、目的、情報、判断、リスク、評価へ分解し、別の業務へ移せる要素を見極める。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | practices/transferring-practices | 改訂済み・更新履歴反映 |
| reference/evaluation-metrics | 評価指標リファレンス | 検索や回答、人への引き継ぎがうまく働いているかを、何で測るか確認する資料です。Retrieval・安全性・運用品質・レビュー負荷の指標を、対象集合や閾値と合わせて定義します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | reference/evaluation-metrics | 現在の公開範囲を維持 |
| reference/glossary | 基本用語集 | Rosariumで使う基本用語を、モデル・情報・工程・責任の観点から定義する。用語を製品名や流行語ではなく、設計上の役割として確認するための参照資料。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | reference/glossary | 現在の公開範囲を維持 |
| reference/mathematical-reference | 数式・記号リファレンス | AIの出力の揺らぎや失敗リスクを考えるときに使う数式をまとめています。条件付き確率・Temperature・RAG・期待損失について、数学上の定義と設計用の簡略モデルを区別します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | reference/mathematical-reference | 現在の公開範囲を維持 |
| reference/responsibility-state-model | 責任境界・状態モデル | AIの能力・権限・説明責任を分離し、生成から実行・監視までの成果物状態を定義する。候補生成を承認や確定処理と混同しないための安定した参照モデル。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | reference/responsibility-state-model | 現在の公開範囲を維持 |
| software-engineering/ai-design-assistance | 設計支援AIは消えない。コード生成の次に残る領域 | コード生成と設計判断の性質の違いから、設計支援AIの役割を考察する。実装時間の短縮に加え、選択肢や責務を整理して人間の意思決定を支援する価値を論じる。 | RETIRE | D/E：既存の役割終了判断と保存範囲を維持する。 | software-engineering/ai-design-assistance | 現在の公開範囲を維持 |
| software-engineering/ai-driven-development | 私が考えるAI駆動開発 ― AI・人間・成果物をどうつなぐか | 要件整理・既存仕様調査・設計・仕様化・実装・テストを一つのAI活用工程として考える。3つのAIを役割分担させた経験と、成果物を通じた受け渡しを紹介する。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | software-engineering/development-workflow | 統合済み・退役保存・互換redirect |
| software-engineering/code-generation-and-work-design | コード生成AIはなぜ業務を変えないのか — 設計支援として使うべき理由 | コード生成の高速化だけでは残る、業務の設計・責務分割・運用上の判断を考察する。AIを設計の理解・維持・改善に使い、意思決定の負担を減らす視点を示す。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | software-engineering/development-workflow | 統合済み・退役保存・互換redirect |
| software-engineering/code-generation-boundaries | コード生成を使うべき場所 | AIにコードを書かせる前に、変更の影響を確認できるか、失敗時に戻せるかを考えます。必要なContext・テスト・人間レビューの費用を整理し、安全に採用できた変更で評価します。 | MERGE | E：独自の経験・例を既存の説明へ集約し、同じ問いの重複を減らす。 | software-engineering/development-workflow | 統合済み・退役保存・互換redirect |
| software-engineering/code-generation-models | コード生成AIの正体 | コード生成AIは、文章を出すモデルだけで成り立つわけではありません。必要情報（Context）、編集ツール、権限、テストを分け、生成から採用までの仕組みと失敗箇所を説明します。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | software-engineering/code-generation-models | 現在の公開範囲を維持 |
| software-engineering/code-maintenance-context | なぜAIは新規コードよりコード保守に強いのか | 既存コード・テスト・差分が、AIの生成条件と検証根拠になる理由を整理する。保守が常に容易とはせず、依存関係や検索コストを踏まえて調査・局所変更・検証へ分解する。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | software-engineering/code-maintenance-context | 改訂済み・更新履歴反映 |
| software-engineering/development-workflow | AIを開発工程に組み込む | AIが受け取る入力、出力成果物、根拠、検証、停止条件、承認者を開発工程として定義する。検証済みの成果物だけを次へ渡すための契約・Gate・記録・手動経路を整理する。 | KEEP | H：独立した問い・実務根拠・説明責務があり、能力上限を固定する記事ではない。 | software-engineering/development-workflow | 現在の公開範囲を維持 |
| software-engineering/multi-ai-orchestration | 複数AIの役割分担と工程設計 | 複数のAIを使うとき、誰に何を渡し、どの成果物を確認して次へ進むかを決めます。Task・Context・Tool・権限を役割ごとに整理し、工程全体の品質と費用を管理します。 | REWRITE | G/E：独自の問いを維持し、具体例・条件を集約して固定分業や制作事情を避ける。 | software-engineering/multi-ai-orchestration | 改訂済み・更新履歴反映 |

## 古さ・重複を優先して評価した10件

| 記事 | 古さ・重複の種類 | 最終判断 |
|---|---|---|
| code-generation-boundaries | D/E：場所の分類より変更委任の設計へ集約 | MERGE |
| code-generation-and-work-design | E：生成と設計の分離を別記事で繰り返す | MERGE |
| ai-driven-development | E：原則は工程設計、実務は保守Caseに存在 | MERGE |
| agents-tools-and-workflows | B/E：個人の同期構成をAgent全般へ広げる必要はない | MERGE |
| ai-education-principles | E：教育ガイドと同じ問い | MERGE |
| transferring-ai-practices | E：横展開ガイドと同じ問い | MERGE |
| what-not-to-build-with-ai | E：IT戦略の非構築判断と同じ問い | MERGE |
| generation-and-acceptance | E：候補値と確定値の状態管理はHITLに存在 | MERGE |
| understanding-systems-as-capability | E：同じ旧Caseの詳細Bookが存在 | MERGE |
| legacy-change-and-retirement | C/G：特定企業の終了判断への推測 | REWRITE |

## 最終検証

- npm run check：140ファイル、エラー・警告0。公開98ファイル・非公開2ファイルを確認。
- npm test：48件成功、失敗0。Garden Notesの最終件数を確認。
- npm run build：成功。141 HTML／7,417 local links、リンク・anchor切れなし。
- Lifecycle：元スナップショット・公開日・保存範囲・通常入口除外を検証。新しい6件はHEADの本文・公開日・source metadataと完全一致を別途確認。
- SEO：109 sitemap URLs、indexable orphanなし。canonical・redirect・feed・robots確認。Pagefindは89ページ。
- Accessibility・performance・GA4・更新日・TOCの既存検証成功。
- ブラウザー：10ページ×4 viewport×2 theme＝80条件。1920×1080、1440×900、375×812、430×932。横はみ出しなし。Lightの測定対象テキストの最小contrast 4.51。
- 追加6redirect×JavaScript有効／無効＝12条件成功。
- CSS・レイアウト・色・Home構造は変更していない。実機での端末固有の操作や、外部ホスティングの配備完了は今回のブラウザー検証とは別。
