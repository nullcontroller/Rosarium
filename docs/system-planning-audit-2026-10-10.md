# システム企画領域の分類監査（2026-10-10）

## 判断

公開対象98件の本文・front matterを走査し、企画・要件定義／SA・DXの境界に関係する段落を確認した。物理配置・URL・layer・section・sourceは維持する。企画の知識2件を既存タグから導出し、Caseは対象外とする。実質本文改訂は顧客サポートQAの3ページに限定する。

既存情報モデル：layerは知識の役割、sectionはテーマ／URL、design_topicはAI設計論点、entry_pointsはAI／DXの既存接続、primaryCategoryはDX主テーマ。企画は読者目的として独立でき、専用schemaやcategoryを追加する必要はない。

- 企画：目的・業務目標・対象／対象外・投資を決める。
- 要件定義／SA：所与の業務要求からシステム要件と方式を決める。
- DX：業務・価値・組織の変化であり、企画と同義ではない。
- PoC：企画では実施・継続・費用判断、SAでは技術的成立性の検証設計。
- 顧客サポートQA：8→6名、400→300時間以下、750件中600件以上は企画側の与件。著者の企画実績・達成実績とはしない。

## 境界に関する個別判断

IT戦略記事は対象選定・投資・作らない判断、業務見直し記事はECRSによる業務変更と対象選定が中心のため企画入口へ接続する。DXと価値は価値変化の考察としてDXを維持。Legacyの変更・廃止は既存機能の維持・変更判断であり実務の企画実績へ転用しない。applicability-and-delegationはAI適用・委任範囲の設計であり、システム企画全体の正本とはしない。Careerの将来志向を企画Caseの証拠として使用しない。退役記事は通常の企画入口へ再掲しない。

## 全公開対象の対応

役割欄は既存metadataに基づく監査用の整理であり、新しいfront matterではない。見出し欄は本文の確認箇所。

| Path | Title | 役割 | Lifecycle | 判断 | 本文見出し（先頭2件） |
| --- | --- | --- | --- | --- | --- |
| architecture/agents-tools-and-workflows | 「AIエージェントを0から作る時代」は本当に来るのか？ | 既存の知識・考察・参照 | retired | 変更なし | ## きっかけは、自宅PCのHDD整理だった / ## 実際にAIがやっていたこと |
| architecture/change-and-reevaluation | AIシステムの変更・再評価設計 | AI要件・方式・責任の設計 | active | 変更なし | ## AIシステムの変更・再評価設計 |
| architecture/cost-latency-routing | AIコスト・Latency・モデルルーティング設計 | AI要件・方式・責任の設計 | active | 変更なし | ## AIコスト・Latency・モデルルーティング設計 |
| architecture/observability-and-slo | AIシステムのオブザーバビリティとSLO設計 | AI要件・方式・責任の設計 | active | 変更なし | ## AIシステムのオブザーバビリティとSLO設計 |
| architecture/prompts-as-interfaces | AI間インターフェースとしてのプロンプト | AI要件・方式・責任の設計 | active | 変更なし | ## AI間インターフェースとしてのプロンプト |
| architecture/reference-architecture | AI業務システムの参照アーキテクチャ | AI要件・方式・責任の設計 | active | 変更なし | ## AI業務システムの参照アーキテクチャ |
| architecture/security-threat-modeling | 生成AIセキュリティと脅威モデリング | AI要件・方式・責任の設計 | active | 変更なし | ## 生成AIセキュリティと脅威モデリング |
| career/overview | Career | Career：経験・志向 | active | 変更なし | ## 何をする人か / ## 仕事で重視すること |
| cases/customer-support-ai-dx/continuous-improvement | 08. 導入後にどう育てるか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 導入を完成にしない / ## 観測するもの |
| cases/customer-support-ai-dx/customer-experience | 06. 顧客体験をどう変えたか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 内部分類を利用者へ押し付けない / ## 一度に一つずつ確認する |
| cases/customer-support-ai-dx/design-principles | 09. この事例から得た設計原則 | Case：担当範囲を保持（企画実績にしない） | active | 企画の所与条件とSA判断を明確化 | ## 1. AIから始めず、価値と業務課題から始める / ## 2. 全自動化を目的にしない |
| cases/customer-support-ai-dx/executive-summary | 00. このケーススタディについて | Case：担当範囲を保持（企画実績にしない） | active | 企画の所与条件とSA判断を明確化 | ## Executive Summary / ## 何を設計したケースか |
| cases/customer-support-ai-dx/human-handoff | 07. AIから人間へどう引き継ぐか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 「分からなければ人間へ」だけでは足りない / ## 引き継ぐ情報 |
| cases/customer-support-ai-dx/knowledge-design | 04. RAG / Knowledgeをどう設計したか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## Semantic Similarityは回答資格ではない / ## 横断検索の前に揃えるもの |
| cases/customer-support-ai-dx/poc-evaluation | 03. PoCで「使えるか」をどう判断したか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 「動いた」だけでは採用できない / ## 1. Retrieval |
| cases/customer-support-ai-dx/responsibility-boundary | 02. 何をAIに任せ、何を人間に残したか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 問い合わせを一律に自動化しない / ## Responsibility Boundary |
| cases/customer-support-ai-dx/stopping-conditions | 05. AIをどこで止めるか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 回答できそうかではなく、回答してよいか / ## 停止条件 |
| cases/customer-support-ai-dx/why-ai | 01. なぜAIを導入したのか | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 技術ではなく、変えたい業務から始める / ## 提供したい価値 |
| cases/customer-support-ai-dx | 生成AI / RAGによる顧客サポートDX | Case：担当範囲を保持（企画実績にしない） | active | 企画の所与条件とSA判断を明確化 | ## このBookについて / ## 読み方 |
| cases/specification-debt-review | 3万文字・68ページの仕様書をAIで横断レビューする | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 背景 / ## 最初の目的はMarkdown移行レビューだった |
| cases/system-understanding/connecting-ui-and-internals | 第7章 UI操作と内部処理を結び付け、操作結果を追えるようにする | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 利用者の問いは、クラス名から始まらない / ## 操作を起点に、処理と結果を確認する |
| cases/system-understanding/human-and-ai-knowledge | 第6章 人が読む仕様とAIが使うKnowledgeを分ける | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 確認した仕様を、誰がどう使うか / ## 図の役割と、検索対象の役割を混ぜない |
| cases/system-understanding/project-structure | 第3章 調査の起点を作るため、ファイルとクラスの役割を整理する | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 読み始める場所を決める / ## 名前から得られる仮説と、コード上の事実を分ける |
| cases/system-understanding/qa-case-study-revisited | 第12章 QAで暗号処理を調査し、人間の変更判断へつなぐ | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## セキュリティ要件の変更で、既存の暗号処理を調べる / ## 復元した知識から、方式と処理位置を確認する |
| cases/system-understanding/qa-case-study | 第2章 対象システムの変更を妨げる構造と知識の不足を整理する | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 変更の前に、使われている処理と責務を把握する / ## 不足していたのはコードではなく、対応関係だった |
| cases/system-understanding/qa-evaluation | 第9章 正しさ・出典・回答拒否から、QAの利用可否を評価する | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 誤った回答が、変更や設定の根拠にならないか / ## 答えられる問いと、答えるべきでない問いを用意する |
| cases/system-understanding/qa-operations | 第11章 仕様変更に追従できるKnowledge更新フローを作る | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 昨日正しかった情報も、現行仕様とは限らない / ## 変更を、関連する資料へ戻す |
| cases/system-understanding/rag-implementation | 第8章 復元したKnowledgeを、根拠を確認できるQAへつなぐ | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 資料を検索できるだけでは、問い合わせに使えない / ## 対象外の知識で、不足を埋めさせない |
| cases/system-understanding/rag-improvement | 第10章 評価結果をKnowledgeと回答範囲の改善へ戻す | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 回答だけを直しても、同じ根拠から誤りが繰り返される / ## 修正後も、同じ観点で回答を確認する |
| cases/system-understanding/recovering-code-structure | 第4章 コードから仕様と依存関係を復元する | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## ファイルの所在から、機能の役割へ進む / ## AIの説明を、実コードと実行結果で確かめる |
| cases/system-understanding/system-understanding-problems | 第1章 仕様を答えられない状態から、復元すべき情報を決める | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 廃止できないシステムで、仕様の問い合わせに答えられない / ## 調査のたびに答えを探し直す構造を変える |
| cases/system-understanding/visualizing-process-flows | 第5章 処理の流れを復元し、変更影響を追えるようにする | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 要素の一覧だけでは、変更の影響を追えない / ## 一つの巨大な図ではなく、確認できる単位に分ける |
| cases/system-understanding | 理解しにくいレガシーシステムを、変更判断できる状態へ変える | Case：担当範囲を保持（企画実績にしない） | obsolete | 変更なし | ## 使い続けるために、まず現行仕様へ到達できるようにする / ## 仕様書の整理だけでは、問い合わせに答えられない |
| cases/three-ai-maintenance/code-generation-and-unit-tests | 第6章　全体像を共有しながら、コード生成と単体テストを進める | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 全体像を共有してから、関数単位へ分ける / ## 最小限の修正案を、人間が確認する |
| cases/three-ai-maintenance/cryptography-and-failure-modes | 第1章 暗号方式の変更で見直すべき異常系を特定する | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 暗号方式の変更は、エラー処理の見直しでもあった / ## エラーの発生箇所と、値が使われる先を合わせて調べる |
| cases/three-ai-maintenance/implementation-design | 第3章 コード探索と人間の確認で、変更箇所と実現方法を絞る | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 確定した方針から、変更箇所を探す / ## コード上の粗さと、今回直すべき問題を分ける |
| cases/three-ai-maintenance/results-and-reflections | 第7章　内製化の成果と、保守業務へAIを広げられた条件を振り返る | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 内製化と期間短縮は、保守工程をつないだ結果だった / ## 一つのAIでは届かなかった情報を、工程としてつなぐ |
| cases/three-ai-maintenance/reviewable-specifications | 第4章　分散した検討結果を、レビュー可能な仕様書へ集約する | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 分散した検討結果を、同じ項目で確認できる形にする / ## 仕様書には、動作だけでなく判断の根拠も残す |
| cases/three-ai-maintenance/sharing-current-specifications | 第5章　確認した現行仕様をAI間で渡し、仕様書へ反映する | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 表の認識違いを、コードへ戻って確認する / ## 処理順序と分岐を、確認できる形へ変える |
| cases/three-ai-maintenance/structuring-failure-handling | 第2章　異常系の構造を整理し、設計方針を確定する | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 保守の制約を先に決める / ## 復旧機能を増やすより、不正な状態で進ませない |
| cases/three-ai-maintenance | 複数AIを使い分けるレガシー保守 | Case：担当範囲を保持（企画実績にしない） | active | 変更なし | ## 暗号方式の変更を、保守工程全体の問題として捉える / ## 製品の順位ではなく、問いに必要な情報から選ぶ |
| cases/understanding-systems-as-capability | 理解できないシステムは、コストである | DXテーマ／実践・考察 | retired | 変更なし | ## 理解できないシステムは、コストである |
| essays/ai-career-market | 採用される側から見たAI人材の転職概況 | 既存の知識・考察・参照 | obsolete | 変更なし |  |
| essays/ai-roles-beyond-fde | AI人材はFDEだけではない――これから進む専門職の細分化 | 既存の知識・考察・参照 | obsolete | 変更なし | ## AI人材はFDEだけではない――これから進む専門職の細分化 / ## 追記：顧客自身が継続的に変えられる仕組みへ |
| essays/ai-use-and-operation | AIは誰でも使えるようになったのに、なぜ業務で使いこなせる人は少ないのか | DXテーマ／実践・考察 | active | 変更なし | ## AIを使うこと自体の敷居は下がった / ## それでも業務では、利用と運用の間に距離が残る |
| essays/dx-and-value | DXを学んで、「価値」という言葉が気になるようになった | DXテーマ／実践・考察 | active | 変更なし | ## DXを学んで、「価値」という言葉が気になるようになった |
| essays/it-strategy-and-not-building | IT戦略では「何を作らないか」も設計する | 企画の判断知識 | active | 企画入口へ横断接続（元分類維持） | ## 「作った」という成果は見えやすい / ## ソフトウェアを作ることは、将来の維持責任を引き受けること |
| essays/legacy-change-and-retirement | レガシーシステムは、変えやすくしながら終わらせる | DXテーマ／実践・考察 | active | 変更なし | ## レガシーの問題は、古いことだけではない / ## 終わらせるまでの期間も長い |
| essays/model-competition-and-ecosystems | AIはどこへ進化しているのか — モデル競争の裏にある「構造」と「エコシステム」 | 既存の知識・考察・参照 | retired | 変更なし | ## はじめに / ## エコシステムを持つ企業 |
| essays/rethink-work-before-ai | AI化する前に、業務そのものを疑う | 企画の判断知識 | active | 企画入口へ横断接続（元分類維持） | ## AI化する前に、業務そのものを疑う / ## Eliminate — まず、消せないか |
| essays/trust-in-ai-generated-content | AI生成コンテンツは、なぜ信頼されにくいのか | 既存の知識・考察・参照 | active | 変更なし |  |
| essays/what-not-to-build-with-ai | AIで作れる時代に、何を作らないか | DXテーマ／実践・考察 | retired | 変更なし | ## AIで作れる時代に、何を作らないか |
| evaluation-hitl/code-evaluation-acceptance | コード生成AIの評価と採用設計 | AI要件・方式・責任の設計 | active | 変更なし | ## コード生成AIの評価と採用設計 |
| evaluation-hitl/datasets-and-regression | AI評価データセットと回帰評価設計 | AI要件・方式・責任の設計 | active | 変更なし | ## AI評価データセットと回帰評価設計 |
| evaluation-hitl/human-review-capability | AI時代において「レビューできる人」が価値を持つ理由 | 既存の知識・考察・参照 | retired | 変更なし |  |
| evaluation-hitl/qa-evaluation | QAチャット評価設計思想 | AI要件・方式・責任の設計 | active | 変更なし | ## QAチャット評価設計思想 |
| evaluation-hitl/responsibility-and-hitl | AI出力の責任境界とHITL | AI要件・方式・責任の設計 | active | 変更なし | ## AI出力の責任境界とHITL |
| foundations/ai-business-design/asking-versus-delegating | 第3章　AIに聞くことと、AIに仕事を任せることは違う | DXテーマ／実践・考察 | active | 変更なし |  |
| foundations/ai-business-design/delegation-and-responsibility | 第1章　AIに仕事を任せても、責任は消えない | DXテーマ／実践・考察 | active | 変更なし | ## 第1章　AIに仕事を任せても、責任は消えない |
| foundations/ai-business-design/evaluating-business-efficiency | 第2章　AI導入は効率化とは限らない | DXテーマ／実践・考察 | active | 変更なし | ## AIが速くても、仕事が速いとは限らない / ## 実際に手戻りした経験 |
| foundations/ai-business-design/explainable-delegation | 第4章　AIに任せない条件を、先に決める | DXテーマ／実践・考察 | active | 変更なし | ## 第4章　説明できない仕事を、AIに任せてはいけない |
| foundations/ai-business-design/human-judgment-capability | 第5章　AI時代、人間には「判断する力」が求められる | DXテーマ／実践・考察 | active | 変更なし |  |
| foundations/ai-business-design | 『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』 | DXテーマ／実践・考察 | active | 変更なし |  |
| foundations/answer-scope | なぜ回答範囲を制限した方がよいのか | AI要件・方式・責任の設計 | active | 変更なし | ## なぜ回答範囲を制限した方がよいのか |
| foundations/applicability-and-delegation | AI適用可否と委任レベルの設計 | AI要件・方式・責任の設計 | active | 変更なし | ## AI適用可否と委任レベルの設計 |
| foundations/conditional-probability | 生成AIの条件付き確率モデル基礎 | AI理論 | active | 変更なし | ## 生成AIの条件付き確率モデル基礎 |
| foundations/generation-and-acceptance | AIは自動化できる。しかし、その出力を確定値として扱ってはいけない | DXテーマ／実践・考察 | retired | 変更なし |  |
| foundations/glossary | Reference索引 | 既存の知識・考察・参照 | active | 変更なし | ## Reference |
| foundations/guardrail-models | ガードレールの数学的説明 | AI要件・方式・責任の設計 | active | 変更なし | ## ガードレールの数学的説明 |
| foundations/hallucination-mechanisms | ハルシネーションの発生原理 | AI理論 | active | 変更なし | ## ハルシネーションの発生原理 |
| foundations/layered-hallucination-controls | ハルシネーションの多層制御設計 | AI要件・方式・責任の設計 | active | 変更なし | ## ハルシネーションの多層制御設計 |
| foundations/llm-as-probabilistic-model | LLMを確率モデルとして設計するという立場 | AI理論 | retired | 変更なし | ## LLMは何をしているのか / ## プロンプトは何をしているのか |
| foundations/temperature-design | Temperature設計指針 | AI理論 | active | 変更なし | ## Temperature設計指針 |
| knowledge-context/context-before-model-performance | AIを使い分ける基準は、モデル性能よりコンテキストではないか | 既存の知識・考察・参照 | active | 変更なし | ## AIを使い分ける基準は、モデル性能よりコンテキストではないか |
| knowledge-context/human-and-ai-documentation | 人向け資料とAI向け資料の分離設計 | AI要件・方式・責任の設計 | active | 変更なし | ## 人向け資料とAI向け資料の分離設計 |
| knowledge-context/instruction-knowledge-evidence | Instruction・Knowledge・Evidenceの責務分離 | AI要件・方式・責任の設計 | active | 変更なし | ## Instruction・Knowledge・Evidenceの責務分離 |
| knowledge-context/prompt-failure-modes | プロンプト設計の失敗モード | AI要件・方式・責任の設計 | active | 変更なし | ## プロンプト設計の失敗モード |
| knowledge-context/prompt-structure | プロンプト設計の基本構造 | AI要件・方式・責任の設計 | active | 変更なし | ## プロンプト設計の基本構造 |
| knowledge-context/qa-behavior-constraints | QA行動制約Knowledge | AI要件・方式・責任の設計 | active | 変更なし | ## QA行動制約Knowledge |
| knowledge-context/qa-operations | QAチャット運用思想 | AI要件・方式・責任の設計 | active | 変更なし | ## QAチャット運用思想 |
| practices/adoption-governance | AI導入を業務へ定着させる | DXテーマ／実践・考察 | active | 変更なし | ## 1. 業務目的から始める / ## 2. 委任範囲を決める |
| practices/ai-adoption-and-effective-use | AIは使われている。でも使いこなされていない | DXテーマ／実践・考察 | active | 変更なし | ## 利用する場面によって、必要な設計は違う / ## 業務全体を設計するための問い |
| practices/ai-education-principles | 生成AI教育はなぜ難しいのか ― 変わらない原則と変わり続ける実践を分けて設計する | DXテーマ／実践・考察 | retired | 変更なし | ## 生成AI教育が「使い方研修」だけではうまくいかない理由 |
| practices/education-and-capability | AI教育を原則と実践に分ける | DXテーマ／実践・考察 | active | 変更なし | ## 原則として学ぶもの / ## 実践として学ぶもの |
| practices/transferring-ai-practices | 全員の業務が違うのに、AI活用事例をそのまま横展開できるのか | DXテーマ／実践・考察 | retired | 変更なし |  |
| practices/transferring-practices | AI活用を別の業務へ横展開する | DXテーマ／実践・考察 | active | 変更なし | ## 共有した経験から分かったこと / ## 成功条件を分解する |
| reference/evaluation-metrics | 評価指標リファレンス | 既存の知識・考察・参照 | active | 変更なし | ## 評価指標リファレンス |
| reference/glossary | 基本用語集 | 既存の知識・考察・参照 | active | 変更なし | ## 基本用語集 |
| reference/mathematical-reference | 数式・記号リファレンス | 既存の知識・考察・参照 | active | 変更なし | ## 数式・記号リファレンス |
| reference/responsibility-state-model | 責任境界・状態モデル | 既存の知識・考察・参照 | active | 変更なし | ## 責任境界・状態モデル |
| software-engineering/ai-design-assistance | 設計支援AIは消えない。コード生成の次に残る領域 | 既存の知識・考察・参照 | retired | 変更なし |  |
| software-engineering/ai-driven-development | 私が考えるAI駆動開発 ― AI・人間・成果物をどうつなぐか | 既存の知識・考察・参照 | retired | 変更なし | ## 私が考えるAI駆動開発 ― AI・人間・成果物をどうつなぐか |
| software-engineering/code-generation-and-work-design | コード生成AIはなぜ業務を変えないのか — 設計支援として使うべき理由 | DXテーマ／実践・考察 | retired | 変更なし | ## 追記：実装支援の先まで、価値を評価する |
| software-engineering/code-generation-boundaries | コード生成を使うべき場所 | AI要件・方式・責任の設計 | retired | 変更なし | ## コード生成を使うべき場所 |
| software-engineering/code-generation-models | コード生成AIの正体 | AI理論 | active | 変更なし | ## コード生成AIの正体 |
| software-engineering/code-maintenance-context | なぜAIは新規コードよりコード保守に強いのか | AI要件・方式・責任の設計 | active | 変更なし | ## なぜAIは新規コードよりコード保守に強いのか |
| software-engineering/development-workflow | AIを開発工程に組み込む | AI要件・方式・責任の設計 | active | 変更なし | ## AIを開発工程に組み込む |
| software-engineering/multi-ai-orchestration | 複数AIの役割分担と工程設計 | AI要件・方式・責任の設計 | active | 変更なし | ## 複数AIの役割分担と工程設計 |

## 検証結果

- npm ci、npm run check、npm test（51件）、npm run buildが成功。
- 全142 HTML／7,750 local links・assetsを検証。110 sitemap URLs、broken link・indexable orphanなし。
- 1920×1080、1440×900、430×932、375×812 × Dark／Light × 6ページの48条件で横方向overflowなし。企画Navigation、keyboard focus、SA更新履歴を確認。
- 既存本文の変更は3ページ。公開日、source、canonical、layer、section、kind、entry_points、DXカテゴリ、tags、Lifecycleは変更なし。
- 企画の公開Caseなし。Caseを企画知識へ自動分類しないことをテスト。
