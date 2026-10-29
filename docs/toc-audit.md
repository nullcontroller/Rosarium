# 共通目次と右補助パネルの全ページ監査

`npm run build`の最終監査で全HTMLルートを検査。公開URLにはnoindexのアーカイブ・互換ルートも含め、検索エンジン向け公開と区別する。

対象 157ページ。目次あり 121、なし 36。Referenceあり 120、なし 37。

共通ルール：描画済み本文のh2/h3から生成し、h2が2件以上で表示。一覧の移動単位が複数ある場合、本文1000文字以上でh3が複数ある構造、Book章構造も対象。Home、Reference本体、検索、404、互換リダイレクトは明示除外。既存IDとmetadata由来の一覧アンカーを保持。

| URL | ページ | indexable | 目次 | Reference | 項目数 | 判定 |
|---|---|---|---|---|---:|---|
| / | Rosarium | あり | なし | あり | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /404.html | ページが見つかりません | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /about/ | Rosariumとは？ | あり | あり | なし | 7 | 主要見出しが複数 |
| /ai-design/ | AI設計 | あり | あり | あり | 44 | 主要見出しが複数 |
| /ai-design/applicability/ | AI適用判断 | あり | なし | あり | 0 | 短いページまたは移動見出し不足 |
| /ai-design/architecture/ | システムアーキテクチャ | あり | あり | あり | 5 | 主要見出しが複数 |
| /ai-design/evaluation-hitl/ | 評価・ヒューマンレビュー | あり | あり | あり | 3 | 主要見出しが複数 |
| /ai-design/knowledge-context/ | ナレッジ / コンテキスト | あり | あり | あり | 5 | 主要見出しが複数 |
| /ai-design/lifecycle-operations/ | ライフサイクル・運用 | あり | あり | あり | 3 | 主要見出しが複数 |
| /ai-design/responsibility-control/ | 責任境界・制御 | あり | あり | あり | 4 | 主要見出しが複数 |
| /ai-design/software-engineering/ | ソフトウェア開発 | あり | あり | あり | 3 | 主要見出しが複数 |
| /ai-mathematics/ | 数学 | あり | あり | あり | 5 | 主要見出しが複数 |
| /ai-theory/ | AI理論 | あり | あり | あり | 5 | 主要見出しが複数 |
| /ai/ | AI | あり | あり | あり | 6 | 主要見出しが複数 |
| /architecture/ | システムアーキテクチャ | なし | あり | あり | 8 | 主要見出しが複数 |
| /architecture/agents-tools-and-workflows/ | 「AIエージェントを0から作る時代」は本当に来るのか？ | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /architecture/change-and-reevaluation/ | AIシステムの変更・再評価設計 | あり | あり | あり | 18 | 長文の複数h3セクション |
| /architecture/cost-latency-routing/ | AIコスト・Latency・モデルルーティング設計 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /architecture/observability-and-slo/ | AIシステムのオブザーバビリティとSLO設計 | あり | あり | あり | 13 | 長文の複数h3セクション |
| /architecture/prompts-as-interfaces/ | AI間インターフェースとしてのプロンプト | あり | あり | あり | 24 | 長文の複数h3セクション |
| /architecture/reference-architecture/ | AI業務システムの参照アーキテクチャ | あり | あり | あり | 18 | 長文の複数h3セクション |
| /architecture/requirements-to-system-method/ | 業務要求からシステム方式を設計する | あり | あり | あり | 7 | 主要見出しが複数 |
| /architecture/security-threat-modeling/ | 生成AIセキュリティと脅威モデリング | あり | あり | あり | 12 | 長文の複数h3セクション |
| /articles/ | AIへ移動しました | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /books/ | 実践事例をご覧ください | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /career/ | Career | あり | あり | なし | 8 | 主要見出しが複数 |
| /career/details/ | Careerをご覧ください | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /career/profile/ | Careerをご覧ください | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /cases/ | 実践事例 | あり | なし | あり | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /cases/ai-technical-investigation/ | 生成AIによる技術調査の設計――情報、仮説、検証、責任境界 | あり | あり | あり | 6 | Book章構造 |
| /cases/ai-technical-investigation/background/ | 01. 担当業務と障害調査の背景 | あり | あり | あり | 8 | 主要見出しが複数 |
| /cases/ai-technical-investigation/crash-resolution/ | 04. 担当チームによるクラッシュの修正と、残存するメモリリーク | あり | あり | あり | 8 | 主要見出しが複数 |
| /cases/ai-technical-investigation/initial-investigation/ | 02. 担当領域の初期調査――不具合発見と修正後の検証 | あり | あり | あり | 9 | 主要見出しが複数 |
| /cases/ai-technical-investigation/investigation-principles/ | 考察を調査の各章へ統合しました | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /cases/ai-technical-investigation/memory-leak-investigation/ | 05. 情報を渡し、修正候補を絞り込む――メモリリークの調査 | あり | あり | あり | 8 | 主要見出しが複数 |
| /cases/ai-technical-investigation/shared-library-investigation/ | 03. 調査情報を引き継ぎ、共通ライブラリを調査する | あり | あり | あり | 8 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/ | 生成AI / RAGによる顧客サポートDX | あり | あり | あり | 12 | Book章構造 |
| /cases/customer-support-ai-dx/continuous-improvement/ | 顧客サポートDXの結末は第10章へ | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /cases/customer-support-ai-dx/customer-experience/ | 06. 顧客体験をどう変えたか | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/design-principles/ | 11. この事例から得た設計原則 | あり | あり | あり | 22 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/executive-summary/ | 01. このケーススタディについて | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/human-handoff/ | 05. AIから人間へどう引き継ぐか | あり | あり | あり | 18 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/knowledge-design/ | 08. RAGの参照資料整備と検索方式の再設計 | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/poc-effect-evaluation/ | 07. 第2回PoC：開発したQAシステムの評価 | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/poc-evaluation/ | 04. 第1回PoC：フィージビリティ確認 | あり | あり | あり | 14 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/poc-metadata-improvement/ | 10. 改善後のPoC再実施 | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/responsibility-boundary/ | 03. 何をAIに任せ、何を人間に残したか | あり | あり | あり | 20 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/stopping-conditions/ | 09. AIをどこで止めるか | あり | あり | あり | 20 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/why-ai/ | 02. なぜAIを導入したのか | あり | あり | あり | 19 | 主要見出しが複数 |
| /cases/specification-debt-review/ | 3万文字・68ページの仕様書をAIで横断レビューする | あり | あり | あり | 13 | 主要見出しが複数 |
| /cases/system-understanding/ | 理解しにくいレガシーシステムを、変更判断できる状態へ変える | あり | あり | あり | 19 | 主要見出しが複数 |
| /cases/system-understanding/connecting-ui-and-internals/ | 07. UI操作と内部処理を結び付け、操作結果を追えるようにする | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/system-understanding/human-and-ai-knowledge/ | 06. 人が読む仕様とAIが使うKnowledgeを分ける | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/system-understanding/project-structure/ | 03. 調査の起点を作るため、ファイルとクラスの役割を整理する | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/system-understanding/qa-case-study-revisited/ | 12. QAで暗号処理を調査し、人間の変更判断へつなぐ | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/system-understanding/qa-case-study/ | 02. 対象システムの変更を妨げる構造と知識の不足を整理する | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/system-understanding/qa-evaluation/ | 09. 正しさ・出典・回答拒否から、QAの利用可否を評価する | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/system-understanding/qa-operations/ | 11. 仕様変更に追従できるKnowledge更新フローを作る | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/system-understanding/rag-implementation/ | 08. 復元したKnowledgeを、根拠を確認できるQAへつなぐ | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/system-understanding/rag-improvement/ | 10. 評価結果をKnowledgeと回答範囲の改善へ戻す | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/system-understanding/recovering-code-structure/ | 04. コードから仕様と依存関係を復元する | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/system-understanding/system-understanding-problems/ | 01. 仕様を答えられない状態から、復元すべき情報を決める | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/system-understanding/visualizing-process-flows/ | 05. 処理の流れを復元し、変更影響を追えるようにする | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/three-ai-maintenance/ | 複数AIを使い分けるレガシー保守 | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/three-ai-maintenance/code-generation-and-unit-tests/ | 06. 全体像を共有しながら、コード生成と単体テストを進める | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/three-ai-maintenance/cryptography-and-failure-modes/ | 01. 暗号方式の変更で見直すべき異常系を特定する | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/three-ai-maintenance/implementation-design/ | 03. コード探索と人間の確認で、変更箇所と実現方法を絞る | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/three-ai-maintenance/results-and-reflections/ | 07. 内製化の成果と、保守業務へAIを広げられた条件を振り返る | あり | あり | あり | 12 | 主要見出しが複数 |
| /cases/three-ai-maintenance/reviewable-specifications/ | 04. 分散した検討結果を、レビュー可能な仕様書へ集約する | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/three-ai-maintenance/sharing-current-specifications/ | 05. 確認した現行仕様をAI間で渡し、仕様書へ反映する | あり | あり | あり | 12 | 主要見出しが複数 |
| /cases/three-ai-maintenance/structuring-failure-handling/ | 02. 異常系の構造を整理し、設計方針を確定する | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/understanding-systems-as-capability/ | 理解できないシステムは、コストである | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /dx/ | DX | あり | あり | あり | 5 | 主要見出しが複数 |
| /dx/business-transformation/ | 業務変革 | あり | あり | あり | 4 | 主要見出しが複数 |
| /dx/continuous-value/ | 継続的価値創出 | あり | あり | あり | 5 | 主要見出しが複数 |
| /dx/selection-retirement/ | 選択と廃止 | あり | あり | あり | 2 | 主要見出しが複数 |
| /dx/system-transformation/ | システム変革 | あり | あり | あり | 5 | 主要見出しが複数 |
| /dx/value-design/ | 価値設計 | あり | あり | あり | 3 | 主要見出しが複数 |
| /essays/ | 考察 | あり | あり | あり | 7 | 主要見出しが複数 |
| /essays/ai-career-market/ | 採用される側から見たAI人材の転職概況 | あり | あり | あり | 7 | 長文の複数h3セクション |
| /essays/ai-roles-beyond-fde/ | AI人材はFDEだけではない――これから進む専門職の細分化 | あり | あり | あり | 12 | 主要見出しが複数 |
| /essays/ai-use-and-operation/ | AIは誰でも使えるようになったのに、なぜ業務で使いこなせる人は少ないのか | あり | あり | あり | 8 | 主要見出しが複数 |
| /essays/dx-and-value/ | DXを学んで、「価値」という言葉が気になるようになった | あり | あり | あり | 6 | 長文の複数h3セクション |
| /essays/from-ai-efficiency-to-value/ | AIによる時間削減はゴールではない。生まれた時間をどう使うか | あり | あり | あり | 8 | 主要見出しが複数 |
| /essays/it-strategy-and-not-building/ | IT戦略では「何を作らないか」も設計する | あり | あり | あり | 10 | 主要見出しが複数 |
| /essays/legacy-change-and-retirement/ | レガシーシステムは、変えやすくしながら終わらせる | あり | あり | あり | 7 | 主要見出しが複数 |
| /essays/model-competition-and-ecosystems/ | AIはどこへ進化しているのか — モデル競争の裏にある「構造」と「エコシステム」 | なし | あり | あり | 25 | 主要見出しが複数 |
| /essays/rethink-work-before-ai/ | AI化する前に、業務そのものを疑う | あり | あり | あり | 10 | 主要見出しが複数 |
| /essays/trust-in-ai-generated-content/ | AI生成コンテンツは、なぜ信頼されにくいのか | あり | あり | あり | 5 | 長文の複数h3セクション |
| /essays/what-not-to-build-with-ai/ | AIで作れる時代に、何を作らないか | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /evaluation-hitl/ | 評価・ヒューマンレビュー | なし | あり | あり | 5 | 主要見出しが複数 |
| /evaluation-hitl/code-evaluation-acceptance/ | コード生成AIの評価と採用設計 | あり | あり | あり | 23 | 長文の複数h3セクション |
| /evaluation-hitl/customer-support-qa-poc/ | PoC詳細は第10章へ移転しました | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /evaluation-hitl/datasets-and-regression/ | AI評価データセットと回帰評価設計 | あり | あり | あり | 12 | 長文の複数h3セクション |
| /evaluation-hitl/human-review-capability/ | AI時代において「レビューできる人」が価値を持つ理由 | なし | なし | あり | 0 | 短いページまたは移動見出し不足 |
| /evaluation-hitl/qa-evaluation/ | QAチャット評価設計思想 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /evaluation-hitl/responsibility-and-hitl/ | AI出力の責任境界とHITL | あり | あり | あり | 29 | 主要見出しが複数 |
| /foundations/ | 設計資料アーカイブ | なし | あり | あり | 10 | 主要見出しが複数 |
| /foundations/ai-business-design/ | 『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』 | あり | あり | あり | 6 | Book章構造 |
| /foundations/ai-business-design/asking-versus-delegating/ | 03. AIに聞くことと、AIに仕事を任せることは違う | あり | あり | あり | 13 | 長文の複数h3セクション |
| /foundations/ai-business-design/delegation-and-responsibility/ | 01. AIに仕事を任せても、責任は消えない | あり | あり | あり | 15 | 長文の複数h3セクション |
| /foundations/ai-business-design/evaluating-business-efficiency/ | 02. AI導入は効率化とは限らない | あり | あり | あり | 15 | 主要見出しが複数 |
| /foundations/ai-business-design/explainable-delegation/ | 04. AIに任せない条件を、先に決める | あり | あり | あり | 16 | 長文の複数h3セクション |
| /foundations/ai-business-design/human-judgment-capability/ | 05. AI時代、人間には「判断する力」が求められる | あり | あり | あり | 15 | 長文の複数h3セクション |
| /foundations/answer-scope/ | なぜ回答範囲を制限した方がよいのか | あり | あり | あり | 11 | 長文の複数h3セクション |
| /foundations/applicability-and-delegation/ | AI適用可否と委任レベルの設計 | あり | あり | あり | 13 | 主要見出しが複数 |
| /foundations/conditional-probability/ | 生成AIの条件付き確率モデル基礎 | あり | あり | あり | 16 | 長文の複数h3セクション |
| /foundations/generation-and-acceptance/ | AIは自動化できる。しかし、その出力を確定値として扱ってはいけない | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /foundations/glossary/ | Reference索引 | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /foundations/guardrail-models/ | ガードレールの数学的説明 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /foundations/hallucination-mechanisms/ | ハルシネーションの発生原理 | あり | あり | あり | 15 | 長文の複数h3セクション |
| /foundations/layered-hallucination-controls/ | ハルシネーションの多層制御設計 | あり | あり | あり | 16 | 長文の複数h3セクション |
| /foundations/llm-as-probabilistic-model/ | LLMを確率モデルとして設計するという立場 | なし | あり | あり | 5 | 主要見出しが複数 |
| /foundations/temperature-design/ | Temperature設計指針 | あり | あり | あり | 13 | 長文の複数h3セクション |
| /garden-notes/ | Garden Notes | あり | あり | なし | 17 | 主要見出しが複数 |
| /knowledge-context/ | ナレッジ / コンテキスト | なし | あり | あり | 7 | 主要見出しが複数 |
| /knowledge-context/context-before-model-performance/ | AIを使い分ける基準は、モデル性能よりコンテキストではないか | あり | あり | あり | 9 | 主要見出しが複数 |
| /knowledge-context/human-and-ai-documentation/ | 人向け資料とAI向け資料の分離設計 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /knowledge-context/instruction-knowledge-evidence/ | Instruction・Knowledge・Evidenceの責務分離 | あり | あり | あり | 11 | 主要見出しが複数 |
| /knowledge-context/prompt-failure-modes/ | プロンプト設計の失敗モード | あり | あり | あり | 10 | 長文の複数h3セクション |
| /knowledge-context/prompt-structure/ | プロンプト設計の基本構造 | あり | あり | あり | 18 | 長文の複数h3セクション |
| /knowledge-context/qa-behavior-constraints/ | QA行動制約Knowledge | あり | あり | あり | 17 | 長文の複数h3セクション |
| /knowledge-context/qa-operations/ | QAチャット運用思想 | あり | あり | あり | 14 | 長文の複数h3セクション |
| /overview/ | AIをご覧ください | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /planning/ | 企画 | あり | あり | あり | 4 | 主要見出しが複数 |
| /practices/ | 実践知 | あり | あり | あり | 19 | 主要見出しが複数 |
| /practices/adoption-governance/ | AI導入を業務へ定着させる | あり | あり | あり | 7 | 主要見出しが複数 |
| /practices/ai-adoption-and-effective-use/ | AIは使われている。でも使いこなされていない | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /practices/ai-education-principles/ | 生成AI教育はなぜ難しいのか ― 変わらない原則と変わり続ける実践を分けて設計する | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /practices/ai-generation-and-work-completion/ | AI導入は効率化とは限らない | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /practices/education-and-capability/ | AI教育を原則と実践に分ける | あり | あり | あり | 6 | 主要見出しが複数 |
| /practices/transferring-ai-practices/ | 全員の業務が違うのに、AI活用事例をそのまま横展開できるのか | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /practices/transferring-practices/ | AI活用を別の業務へ横展開する | あり | あり | あり | 5 | 主要見出しが複数 |
| /reference/ | Reference | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/evaluation-metrics/ | 評価指標リファレンス | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/glossary/ | 基本用語集 | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/mathematical-reference/ | 数式・記号リファレンス | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/responsibility-state-model/ | 責任境界・状態モデル | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /retired/ | 旧記事・退役記事 | なし | あり | なし | 3 | 主要見出しが複数 |
| /retired/obsolete-cases/ | 旧事例 | なし | あり | なし | 2 | アーカイブ個別項目 |
| /retired/obsolete/ | 旧記事 | なし | あり | なし | 3 | アーカイブ個別項目 |
| /retired/retired/ | 退役記事 | なし | あり | なし | 21 | アーカイブ個別項目 |
| /search/ | 検索 | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /series/ | 業務変革をご覧ください | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /software-engineering/ | ソフトウェア開発 | なし | あり | あり | 6 | 主要見出しが複数 |
| /software-engineering/ai-design-assistance/ | 設計支援AIは消えない。コード生成の次に残る領域 | なし | なし | あり | 0 | 短いページまたは移動見出し不足 |
| /software-engineering/ai-driven-development/ | 私が考えるAI駆動開発 ― AI・人間・成果物をどうつなぐか | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /software-engineering/ai-technical-investigation-design/ | 技術調査のCaseへ移転しました | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /software-engineering/code-generation-and-work-design/ | コード生成AIはなぜ業務を変えないのか — 設計支援として使うべき理由 | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /software-engineering/code-generation-boundaries/ | コード生成を使うべき場所 | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /software-engineering/code-generation-models/ | コード生成AIの正体 | あり | あり | あり | 24 | 長文の複数h3セクション |
| /software-engineering/code-maintenance-context/ | なぜAIは新規コードよりコード保守に強いのか | あり | あり | あり | 23 | 長文の複数h3セクション |
| /software-engineering/development-workflow/ | AIを開発工程に組み込む | あり | あり | あり | 27 | 長文の複数h3セクション |
| /software-engineering/engineering-judgment-in-ai-code-review/ | AIがコードを読めても、違和感に気づくには技術力がいる | あり | あり | あり | 6 | 主要見出しが複数 |
| /software-engineering/multi-ai-orchestration/ | 複数AIの役割分担と工程設計 | あり | あり | あり | 27 | 主要見出しが複数 |
| /start-here/ | Start Here | あり | なし | あり | 0 | 短いページまたは移動見出し不足 |
| /updates/ | 庭をご覧ください | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
