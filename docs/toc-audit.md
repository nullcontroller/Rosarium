# 共通目次と右補助パネルの全ページ監査

`npm run build`で本文レイアウトを持つ全ページを検査。noindexのアーカイブも含め、検索エンジン向け公開と区別する。互換HTML54件は別のIA監査で検証する。

対象 149ページ。目次あり 138、なし 11。Referenceあり 140、なし 9。

共通ルール：描画済み本文のh2/h3から生成し、h2が2件以上で表示。一覧の移動単位が複数ある場合、本文1000文字以上でh3が複数ある構造、Book章構造も対象。Home、Reference本体、検索、404、互換リダイレクトは明示除外。既存IDとmetadata由来の一覧アンカーを保持。

| URL | ページ | indexable | 目次 | Reference | 項目数 | 判定 |
|---|---|---|---|---|---:|---|
| / | Rosarium | あり | なし | あり | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /404.html | ページが見つかりません | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /about/ | Rosariumとは？ | あり | あり | なし | 8 | 主要見出しが複数 |
| /ai/ | AI・数理 | あり | あり | あり | 5 | 主要見出しが複数 |
| /architecture/change-and-reevaluation/ | AIシステムの変更・再評価設計 | あり | あり | あり | 18 | 長文の複数h3セクション |
| /architecture/cost-latency-routing/ | AIのモデルルーティング設計 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /architecture/observability-and-slo/ | AIシステムのオブザーバビリティとSLO設計 | あり | あり | あり | 13 | 長文の複数h3セクション |
| /architecture/prompts-as-interfaces/ | AI間インターフェースとしてのプロンプト | あり | あり | あり | 24 | 長文の複数h3セクション |
| /architecture/reference-architecture/ | AI業務システムの参照アーキテクチャ | あり | あり | あり | 18 | 長文の複数h3セクション |
| /architecture/requirements-to-system-method/ | 業務要求からシステム方式を設計する | あり | あり | あり | 8 | 主要見出しが複数 |
| /architecture/security-threat-modeling/ | 生成AIセキュリティと脅威モデリング | あり | あり | あり | 12 | 長文の複数h3セクション |
| /career/ | Career | あり | あり | あり | 6 | 主要見出しが複数 |
| /cases/ | 事例 | あり | なし | あり | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /cases/ai-technical-investigation/ | 複数のソフトウェアにまたがる障害調査の設計 | あり | あり | あり | 13 | 主要見出しが複数 |
| /cases/ai-technical-investigation/background/ | 01. 対象システムと障害調査の背景 | あり | あり | あり | 13 | 主要見出しが複数 |
| /cases/ai-technical-investigation/crash-resolution/ | 06. クラッシュの解消と残存するメモリリーク | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/ai-technical-investigation/findings-and-evaluation/ | 08. 障害調査の成果と評価範囲 | あり | あり | あり | 14 | 主要見出しが複数 |
| /cases/ai-technical-investigation/initial-investigation/ | 04. 潜在不具合の発見と修正後の検証 | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/ai-technical-investigation/investigation-input/ | 03. 生成AIへの情報提供と調査方法の改善 | あり | あり | あり | 14 | 主要見出しが複数 |
| /cases/ai-technical-investigation/investigation-scope/ | 02. 初期調査範囲の決定 | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/ai-technical-investigation/memory-leak-investigation/ | 07. 残存メモリリークの仮説検証と解決 | あり | あり | あり | 18 | 主要見出しが複数 |
| /cases/ai-technical-investigation/reusable-method/ | 09. 生成AIへの調査指示と判断基準 | あり | あり | あり | 24 | 主要見出しが複数 |
| /cases/ai-technical-investigation/shared-library-investigation/ | 05. 実行時情報の取得とソフトウェアCへの調査移行 | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/ | 個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築 | あり | あり | あり | 10 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/architecture/ | 02. システム全体構成と技術選定 | あり | あり | あり | 13 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/backup-and-recovery/ | 05. データ保全とバックアップ | あり | あり | あり | 12 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/cashflow-and-input/ | 04. 収支管理と入力業務の設計 | あり | あり | あり | 13 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/development-management/ | 06. 生成AIへの開発管理の委任 | あり | あり | あり | 14 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/market-data/ | 03. 資産価格の取得方式 | あり | あり | あり | 13 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/requirements/ | 01. システム化の背景と対象範囲の定義 | あり | あり | あり | 19 | 主要見出しが複数 |
| /cases/asset-management-app-a-architecture/review-and-quality/ | 07. レビュー方式と品質保証 | あり | あり | あり | 12 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/ | 生成AI / RAGによる顧客サポートDX | あり | あり | あり | 12 | Book章構造 |
| /cases/customer-support-ai-dx/customer-experience/ | 06. 自己解決と有人対応をつなぐ顧客体験設計 | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/design-principles/ | 11. 検索対象制御と回答許可の設計判断 | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/executive-summary/ | 01. 顧客サポートの課題と設計範囲 | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/human-handoff/ | 05. 有人対応への引継ぎと責務分担 | あり | あり | あり | 18 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/knowledge-design/ | 08. RAG管理システムのアーキテクチャ | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/poc-effect-evaluation/ | 07. 第1回PoCの課題分析 | あり | あり | あり | 15 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/poc-evaluation/ | 04. 第1回PoC：初期方式の評価 | あり | あり | あり | 14 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/poc-metadata-improvement/ | 10. 第2回PoC：改善方式の評価 | あり | あり | あり | 16 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/responsibility-boundary/ | 03. 何をAIに任せ、何を人間に残したか | あり | あり | あり | 20 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/stopping-conditions/ | 09. メタデータ管理方式の設計 | あり | あり | あり | 17 | 主要見出しが複数 |
| /cases/customer-support-ai-dx/why-ai/ | 02. 業務要求と方式選定 | あり | あり | あり | 19 | 主要見出しが複数 |
| /cases/design-studies/data-migration/ | 文書から節へ構造を変えるRAGデータ移行の設計 | あり | あり | あり | 6 | 主要見出しが複数 |
| /cases/design-studies/document-lifecycle/ | 文書改訂に伴うRAGの更新・承認設計 | あり | あり | あり | 8 | 主要見出しが複数 |
| /cases/design-studies/inquiry-analysis/ | 問い合わせ履歴から自動化対象と業務要件を決める | あり | あり | あり | 7 | 主要見出しが複数 |
| /cases/design-studies/metadata-batch/ | RAGメタデータを大量登録するバッチ処理の設計 | あり | あり | あり | 8 | 主要見出しが複数 |
| /cases/design-studies/qualification-testing/ | RAGシステムの品質をどうテストするか | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/design-studies/rag-security/ | 顧客向けRAGの情報境界を取得段階で設計する | あり | あり | あり | 7 | 主要見出しが複数 |
| /cases/specification-debt-review/ | 仕様書と実装の不整合をどう解消するか | あり | あり | あり | 18 | 主要見出しが複数 |
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
| /cases/three-ai-maintenance/results-and-reflections/ | 07. 内製化の成果と保守手法の適用条件 | あり | あり | あり | 12 | 主要見出しが複数 |
| /cases/three-ai-maintenance/reviewable-specifications/ | 04. 分散した検討結果を、レビュー可能な仕様書へ集約する | あり | あり | あり | 11 | 主要見出しが複数 |
| /cases/three-ai-maintenance/sharing-current-specifications/ | 05. 確認した現行仕様をAI間で渡し、仕様書へ反映する | あり | あり | あり | 12 | 主要見出しが複数 |
| /cases/three-ai-maintenance/structuring-failure-handling/ | 02. 安全停止と責務範囲を定める異常系設計 | あり | あり | あり | 11 | 主要見出しが複数 |
| /dx/ | DX | あり | あり | あり | 2 | 主要見出しが複数 |
| /essays/ai-adoption-success-and-value/ | AI導入の成功は、何をもって定義するべきか | あり | あり | あり | 14 | 主要見出しが複数 |
| /essays/ai-capability-and-organization/ | AIの能力と、人間のAI活用能力はなぜ一致しないのか | あり | あり | あり | 17 | 主要見出しが複数 |
| /essays/ai-career-market/ | 採用される側から見たAI人材の転職概況 | あり | あり | あり | 7 | 長文の複数h3セクション |
| /essays/ai-case-sharing-and-judgment/ | AI活用事例は、なぜノウハウにならないのか | あり | あり | あり | 14 | 主要見出しが複数 |
| /essays/ai-essence/ | AI活用の本質を問う | あり | あり | あり | 7 | Book章構造 |
| /essays/ai-intellectual-collaboration/ | AIを効率化ツールとして捉えることの限界 | あり | あり | あり | 14 | 主要見出しが複数 |
| /essays/ai-investment-value-cost-evolution/ | AIシステムへの投資をどう評価するか――価値、コスト、技術進化 | あり | あり | あり | 6 | 主要見出しが複数 |
| /essays/ai-operation-management-improvement/ | AIを使うことと、成果を生むことはなぜ違うのか | あり | あり | あり | 15 | 主要見出しが複数 |
| /essays/ai-roles-beyond-fde/ | AI人材はFDEだけではない――これから進む専門職の細分化 | あり | あり | あり | 12 | 主要見出しが複数 |
| /essays/ai-verification-cost-and-learning/ | AIを使えば、本当に工数は削減されるのか | あり | あり | あり | 14 | 主要見出しが複数 |
| /essays/dx-and-value/ | DXを学んで、「価値」という言葉が気になるようになった | なし | あり | あり | 6 | 長文の複数h3セクション |
| /essays/from-ai-efficiency-to-value/ | AIによる時間削減はゴールではない。生まれた時間をどう使うか | あり | あり | あり | 8 | 主要見出しが複数 |
| /essays/it-strategy-and-not-building/ | IT戦略では「何を作らないか」も設計する | あり | あり | あり | 10 | 主要見出しが複数 |
| /essays/legacy-change-and-retirement/ | レガシーシステムは、変えやすくしながら終わらせる | あり | あり | あり | 7 | 主要見出しが複数 |
| /essays/model-competition-and-ecosystems/ | AIはどこへ進化しているのか — モデル競争の裏にある「構造」と「エコシステム」 | なし | あり | あり | 25 | 主要見出しが複数 |
| /essays/rethink-work-before-ai/ | AI化する前に、業務そのものを疑う | あり | あり | あり | 10 | 主要見出しが複数 |
| /essays/trust-in-ai-generated-content/ | AI生成コンテンツは、なぜ信頼されにくいのか | あり | あり | あり | 5 | 長文の複数h3セクション |
| /evaluation-hitl/code-evaluation-acceptance/ | コード生成AIの評価と採用設計 | あり | あり | あり | 23 | 長文の複数h3セクション |
| /evaluation-hitl/datasets-and-regression/ | AI評価データセットと回帰評価設計 | あり | あり | あり | 12 | 長文の複数h3セクション |
| /evaluation-hitl/human-review-capability/ | AI時代において「レビューできる人」が価値を持つ理由 | なし | なし | あり | 0 | 短いページまたは移動見出し不足 |
| /evaluation-hitl/qa-evaluation/ | QAチャットの品質評価設計 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /evaluation-hitl/responsibility-and-hitl/ | AI出力の責任境界とHITL | あり | あり | あり | 29 | 長文の複数h3セクション |
| /foundations/ai-business-design/ | 『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』 | あり | あり | あり | 6 | Book章構造 |
| /foundations/ai-business-design/asking-versus-delegating/ | 03. AIに聞くことと、AIに仕事を任せることは違う | あり | あり | あり | 13 | 長文の複数h3セクション |
| /foundations/ai-business-design/delegation-and-responsibility/ | 01. AIに仕事を任せても、責任は消えない | あり | あり | あり | 15 | 長文の複数h3セクション |
| /foundations/ai-business-design/evaluating-business-efficiency/ | 02. AI導入は効率化とは限らない | あり | あり | あり | 15 | 主要見出しが複数 |
| /foundations/ai-business-design/explainable-delegation/ | 04. AIに任せない条件を、先に決める | あり | あり | あり | 16 | 長文の複数h3セクション |
| /foundations/ai-business-design/human-judgment-capability/ | 05. AI時代、人間には「判断する力」が求められる | あり | あり | あり | 15 | 長文の複数h3セクション |
| /foundations/answer-scope/ | AIの回答範囲と回答可否の設計 | あり | あり | あり | 11 | 長文の複数h3セクション |
| /foundations/applicability-and-delegation/ | AI適用可否と委任レベルの設計 | あり | あり | あり | 13 | 長文の複数h3セクション |
| /foundations/attention-efficiency/ | Attentionの計算効率 | あり | あり | あり | 8 | 主要見出しが複数 |
| /foundations/attention-information-flow/ | Attentionは系列からどのように情報を集めるのか | あり | あり | あり | 8 | 主要見出しが複数 |
| /foundations/compute-optimal-scaling/ | 言語モデルのスケーリング則 | あり | あり | あり | 8 | 主要見出しが複数 |
| /foundations/conditional-probability/ | 自己回帰型生成AIの条件付き確率モデル | あり | あり | あり | 16 | 長文の複数h3セクション |
| /foundations/diffusion-language-models/ | 拡散言語モデルは、なぜ左から順番に生成しなくても文章を作れるのか | あり | あり | あり | 9 | 主要見出しが複数 |
| /foundations/guardrail-models/ | ガードレールの数理モデル | あり | あり | あり | 17 | 長文の複数h3セクション |
| /foundations/hallucination-mechanisms/ | ハルシネーションの発生原理 | あり | あり | あり | 15 | 長文の複数h3セクション |
| /foundations/in-context-learning/ | In-Context Learningの原理 | あり | あり | あり | 7 | 主要見出しが複数 |
| /foundations/language-model-loss/ | 言語モデルは何を損失として学習するのか | あり | あり | あり | 8 | 長文の複数h3セクション |
| /foundations/layered-hallucination-controls/ | ハルシネーションの多層制御設計 | あり | あり | あり | 16 | 長文の複数h3セクション |
| /foundations/llm-as-probabilistic-model/ | LLMを確率モデルとして設計するという立場 | なし | あり | あり | 5 | 主要見出しが複数 |
| /foundations/mechanistic-interpretability/ | 機構的解釈可能性 | あり | あり | あり | 7 | 主要見出しが複数 |
| /foundations/mixture-of-experts/ | Mixture of Expertsは、なぜ一部のネットワークだけを使って計算するのか | あり | あり | あり | 7 | 主要見出しが複数 |
| /foundations/neural-symbolic-proof/ | 神経記号推論と形式的検証 | あり | あり | あり | 10 | 主要見出しが複数 |
| /foundations/policy-gradient-learning/ | 強化学習は、報酬からどのように方策を改善するのか | あり | あり | あり | 8 | 主要見出しが複数 |
| /foundations/preference-learning-dpo/ | 言語モデルは、人間の選好をどのように学習するのか | あり | あり | あり | 9 | 主要見出しが複数 |
| /foundations/speculative-decoding/ | 投機的復号の分布保存と高速化条件 | あり | あり | あり | 8 | 主要見出しが複数 |
| /foundations/state-space-sequence-models/ | 状態空間モデル（SSM）の計算原理 | あり | あり | あり | 8 | 主要見出しが複数 |
| /foundations/temperature-design/ | Temperatureの数理原理 | あり | あり | あり | 13 | 長文の複数h3セクション |
| /foundations/test-time-compute-allocation/ | 推論時計算の予算配分 | あり | あり | あり | 9 | 長文の複数h3セクション |
| /foundations/transformer-computational-limits/ | Transformerの計算能力と理論的限界 | あり | あり | あり | 11 | 主要見出しが複数 |
| /foundations/verifiable-reward-reasoning/ | 検証可能な報酬は、言語モデルの推論能力をどう変えるのか | あり | あり | あり | 8 | 主要見出しが複数 |
| /garden-notes/ | Garden Notes | あり | あり | なし | 44 | 主要見出しが複数 |
| /knowledge-context/context-before-model-performance/ | コンテキストに基づくAIと調査経路の選択 | あり | あり | あり | 9 | 長文の複数h3セクション |
| /knowledge-context/human-and-ai-documentation/ | 単一の正本から設計する人向け資料とAI向け資料 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /knowledge-context/instruction-knowledge-evidence/ | Instruction・Knowledge・Evidenceの責務分離 | あり | あり | あり | 11 | 長文の複数h3セクション |
| /knowledge-context/prompt-failure-modes/ | プロンプト設計の失敗モード | あり | あり | あり | 10 | 長文の複数h3セクション |
| /knowledge-context/prompt-structure/ | プロンプト設計の基本構造 | あり | あり | あり | 18 | 長文の複数h3セクション |
| /knowledge-context/qa-behavior-constraints/ | QAチャットの回答・停止・移管設計 | あり | あり | あり | 17 | 長文の複数h3セクション |
| /knowledge-context/qa-operations/ | QAチャットの運用設計 | あり | あり | あり | 14 | 長文の複数h3セクション |
| /planning/ | IT戦略・企画 | あり | あり | あり | 2 | 主要見出しが複数 |
| /practices/adoption-governance/ | AI導入を業務へ定着させる | あり | あり | あり | 7 | 主要見出しが複数 |
| /practices/education-and-capability/ | AI教育を原則と実践に分ける | あり | あり | あり | 6 | 主要見出しが複数 |
| /reference/ | Reference | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/evaluation-metrics/ | 評価指標リファレンス | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/glossary/ | 基本用語集 | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/mathematical-reference/ | 数式・記号リファレンス | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /reference/responsibility-state-model/ | 責任境界・状態モデル | あり | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /retired/ | 旧記事・退役記事 | なし | なし | なし | 0 | 入口・Reference・検索・404・互換リダイレクト |
| /sitemap/ | サイトマップ | あり | あり | あり | 8 | 主要見出しが複数 |
| /software-engineering/ai-design-assistance/ | 設計支援AIは消えない。コード生成の次に残る領域 | なし | なし | あり | 0 | 短いページまたは移動見出し不足 |
| /software-engineering/code-generation-models/ | コード生成AIの構成と動作原理 | あり | あり | あり | 24 | 長文の複数h3セクション |
| /software-engineering/code-maintenance-context/ | AIによるコード保守を支える情報と検証条件 | あり | あり | あり | 23 | 長文の複数h3セクション |
| /software-engineering/development-workflow/ | AIを開発工程に組み込む | あり | あり | あり | 27 | 長文の複数h3セクション |
| /software-engineering/engineering-judgment-in-ai-code-review/ | AIがコードを読めても、違和感に気づくには技術力がいる | なし | あり | あり | 6 | 主要見出しが複数 |
| /software-engineering/multi-ai-orchestration/ | 複数AIの役割分担と工程設計 | あり | あり | あり | 27 | 長文の複数h3セクション |
| /system-design/ | システム設計 | あり | あり | あり | 5 | 主要見出しが複数 |
