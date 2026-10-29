# Content Modernization Report

監査日：2026-09-22

## 判断基準

| Decision | 意味 |
|---|---|
| KEEP | 現在の分類・主張・Summaryを正本として維持 |
| UPDATE | 古い媒体表現や局所的な前提を更新 |
| REWRITE | URLと出典を保ち、現在の理解で本文を再構成 |
| MERGE | 役割を分割先へ統合し、既存URLを索引として維持 |
| SPLIT | 集中していた責務を独立した正本として追加 |
| ADD | 現在の思想・経験から新しい公開物として追加 |
| ARCHIVE | 履歴として保持し、通常の公開導線から除外 |
| REMOVE_FROM_PUBLIC | 出典記録は保持し、公開対象から除外 |

## Summary

| Decision | Count |
|---|---:|
| KEEP | 60 |
| UPDATE | 9 |
| REWRITE | 4 |
| MERGE | 1 |
| SPLIT | 7 |
| ADD | 14 |
| ARCHIVE | 1 |
| REMOVE_FROM_PUBLIC | 1 |
| **Total** | **97** |

## Full Audit

| Page | Decision | Reason | Major Change |
|---|---|---|---|
| `src/content/architecture/agents-tools-and-workflows.md` | KEEP | Tool・権限・停止条件を分離した現行設計として有効 | — |
| `src/content/architecture/change-and-reevaluation.md` | KEEP | 変更時の再評価とLifecycle設計が現行構造に一致 | — |
| `src/content/architecture/cost-latency-routing.md` | KEEP | Cost・Latency・品質のRouting判断を明示 | — |
| `src/content/architecture/observability-and-slo.md` | KEEP | 運用観測とSLOを設計へ接続 | — |
| `src/content/architecture/prompts-as-interfaces.md` | KEEP | Promptを工程間Interfaceとして整理 | — |
| `src/content/architecture/reference-architecture.md` | UPDATE | 現行構造・表現との不一致 | 旧章番号への依存を除去し、現在のDesign Topicへ接続 |
| `src/content/architecture/security-threat-modeling.md` | KEEP | 脅威・権限・Tool実行の境界が明確 | — |
| `src/content/career/overview.md` | UPDATE | 現在のCareer方針とユーザー提供の実務事実へ整合 | 価値起点のApplied AI、問い合わせ対応DX、長期改善を中心に再編集 |
| `src/content/career/profile.md` | UPDATE | 現在のCareer方針とユーザー提供の実務事実へ整合 | 年代、問い合わせ対応、現行業務、希望役割、Portfolioを更新 |
| `src/content/essays/dx-and-value.md` | ADD | DX学習から得た価値起点のAI観を独立した随筆として保持 | DXを主軸化せず、個人的な思考変化からAI設計へ接続 |
| `src/content/essays/what-not-to-build-with-ai.md` | ADD | AI時代の選択・ライフサイクル判断を独立した論点として保持 | 作る量ではなく、残す・変える・統合・移行・終了を論じる |
| `src/content/cases/system-understanding.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 事実を保持し、ContextからResultと現在の改善点まで再構成 |
| `src/content/cases/system-understanding/connecting-ui-and-internals.md` | KEEP | Book章の工程と事実を保持 | — |
| `src/content/cases/system-understanding/human-and-ai-knowledge.md` | KEEP | 人間向け説明とAI参照構造の差を保持 | — |
| `src/content/cases/system-understanding/project-structure.md` | KEEP | Project構造の復元手順を保持 | — |
| `src/content/cases/system-understanding/qa-case-study-revisited.md` | KEEP | QA事例の再評価を保持 | — |
| `src/content/cases/system-understanding/qa-case-study.md` | KEEP | 実務QA事例を保持 | — |
| `src/content/cases/system-understanding/qa-evaluation.md` | KEEP | QA評価の実務工程を保持 | — |
| `src/content/cases/system-understanding/qa-operations.md` | KEEP | QA運用の実務工程を保持 | — |
| `src/content/cases/system-understanding/rag-implementation.md` | KEEP | RAG実装の事実と手順を保持 | — |
| `src/content/cases/system-understanding/rag-improvement.md` | KEEP | RAG改善の事実と手順を保持 | — |
| `src/content/cases/system-understanding/recovering-code-structure.md` | KEEP | Codeから構造を復元する工程を保持 | — |
| `src/content/cases/system-understanding/system-understanding-problems.md` | KEEP | 仕様不足時の問題設定を保持 | — |
| `src/content/cases/system-understanding/visualizing-process-flows.md` | KEEP | 処理構造の図による可視化工程を保持 | — |
| `src/content/cases/three-ai-maintenance.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 実績値を保持し、責任境界とWorkflowを明示 |
| `src/content/cases/three-ai-maintenance/code-generation-and-unit-tests.md` | KEEP | 実装・単体テスト工程を保持 | — |
| `src/content/cases/three-ai-maintenance/cryptography-and-failure-modes.md` | KEEP | CNG / DPAPIと異常系の事実を保持 | — |
| `src/content/cases/three-ai-maintenance/implementation-design.md` | KEEP | 実装設計の判断を保持 | — |
| `src/content/cases/three-ai-maintenance/results-and-reflections.md` | KEEP | 工期約7割短縮を含む結果を保持 | — |
| `src/content/cases/three-ai-maintenance/reviewable-specifications.md` | KEEP | 審議可能な仕様化工程を保持 | — |
| `src/content/cases/three-ai-maintenance/sharing-current-specifications.md` | KEEP | 現行仕様共有の工程を保持 | — |
| `src/content/cases/three-ai-maintenance/structuring-failure-handling.md` | KEEP | 異常系を構造化する工程を保持 | — |
| `src/content/cases/customer-support-ai-dx.md` | ADD | 顧客サポートDXを価値・業務・AI・人間・Knowledge・UXから統合して読める実践事例が必要 | 8資料の共通設計判断を統合し、試算と公開実績を分離した第3冊目のBookを追加 |
| `src/content/cases/customer-support-ai-dx/executive-summary.md` | ADD | Bookの前提、対象範囲、証拠の扱いを先に示すため | Before / Afterと事実・設計モデルの境界を整理 |
| `src/content/cases/customer-support-ai-dx/why-ai.md` | ADD | 技術導入より価値と業務変化を先に置く判断を説明するため | 価値からAIの役割を逆算する設計順序を整理 |
| `src/content/cases/customer-support-ai-dx/responsibility-boundary.md` | ADD | AI・人間・既存システムの責任境界を明示するため | 問い合わせ分類と役割分担を整理 |
| `src/content/cases/customer-support-ai-dx/poc-evaluation.md` | ADD | PoCの評価方法と採否判断を分離して示すため | Retrieval・対話・回答・業務効果の評価を整理 |
| `src/content/cases/customer-support-ai-dx/knowledge-design.md` | ADD | RAGのKnowledge制御を意味類似度だけで説明しないため | 機種・版・公開範囲を含むmetadata設計を整理 |
| `src/content/cases/customer-support-ai-dx/stopping-conditions.md` | ADD | AIが答えない条件を設計要素として示すため | 停止・確認・人間への引継ぎ条件を整理 |
| `src/content/cases/customer-support-ai-dx/customer-experience.md` | ADD | 自然言語UIを顧客体験の変化として説明するため | 追加質問、確認情報、段階的な説明を整理 |
| `src/content/cases/customer-support-ai-dx/human-handoff.md` | ADD | AIから人間へ文脈を失わず引き継ぐ設計を示すため | 確認済み情報と未確認事項のhandoffを整理 |
| `src/content/cases/customer-support-ai-dx/continuous-improvement.md` | ADD | 導入後の観測をKnowledge・業務改善へ戻すため | 利用・失敗・有人対応結果の改善循環を整理 |
| `src/content/cases/customer-support-ai-dx/outcomes-and-evidence.md` | ADD | 資料間で異なる数値の母数と位置づけを混同しないため | 設計・評価モデル、試算、未確認の公開実績を分離 |
| `src/content/cases/customer-support-ai-dx/design-principles.md` | ADD | 事例固有の判断を再利用可能な原則へ接続するため | 価値起点、選択的自動化、停止、評価、改善の原則を整理 |
| `src/content/cases/understanding-systems-as-capability.md` | UPDATE | 現行構造・表現との不一致 | 外部媒体名をCase Studyの現行導線へ変更 |
| `src/content/essays/ai-career-market.md` | UPDATE | 現行構造・表現との不一致 | 公開主体を外部媒体ではなく現在のサイトへ更新 |
| `src/content/essays/ai-roles-beyond-fde.md` | KEEP | Publicationとしての役割論を保持 | — |
| `src/content/essays/model-competition-and-ecosystems.md` | RETIRE | 企業・AIを二分する説明モデルが現在のContext / Knowledge / 権限設計より粗い | 本文を非公開アーカイブとして保持し、Context基準の後継記事へredirect |
| `src/content/essays/trust-in-ai-generated-content.md` | KEEP | Publicationとしての信頼性論を保持 | — |
| `src/content/evaluation-hitl/code-evaluation-acceptance.md` | UPDATE | 現行構造・表現との不一致 | 旧媒体を主語にした表現を現在のサイトへ更新 |
| `src/content/evaluation-hitl/datasets-and-regression.md` | KEEP | 評価Datasetと回帰評価を分離した現行設計 | — |
| `src/content/evaluation-hitl/human-review-capability.md` | RETIRE | 人間Reviewの論点が責任境界・状態遷移・移管条件の正本へ包含された | 本文を非公開アーカイブとして保持し、責任境界とHITLへredirect |
| `src/content/evaluation-hitl/qa-evaluation.md` | KEEP | QA評価の指標と運用条件を整理 | — |
| `src/content/evaluation-hitl/responsibility-and-hitl.md` | KEEP | 責任境界とHITLの現行正本 | — |
| `src/content/foundations/ai-business-design.md` | KEEP | 独立した連載入口として役割が明確 | — |
| `src/content/foundations/ai-business-design/asking-versus-delegating.md` | KEEP | 質問と委任の差を保持 | — |
| `src/content/foundations/ai-business-design/delegation-and-responsibility.md` | KEEP | 委任と責任の関係を保持 | — |
| `src/content/foundations/ai-business-design/evaluating-business-efficiency.md` | KEEP | 業務全体で効率を測る観点を保持 | — |
| `src/content/foundations/answer-scope.md` | KEEP | CoverageとSelective Riskの設計を保持 | — |
| `src/content/foundations/applicability-and-delegation.md` | KEEP | AI適用判断と委任レベルの現行正本 | — |
| `src/content/foundations/conditional-probability.md` | UPDATE | 現行構造・表現との不一致 | 「確率空間」を説明モデルとして明示し、旧媒体表現を除去 |
| `src/content/foundations/design-system-overview.md` | ARCHIVE | 履歴価値はあるが現在の主導線には不要 | 過去の章構造を履歴として非公開保持 |
| `src/content/foundations/generation-and-acceptance.md` | KEEP | 生成と受理の分離を示す現行原則 | — |
| `src/content/foundations/ai-business-design/explainable-delegation.md` | KEEP | Book第4章のPublication本文と章順を保持 | — |
| `src/content/foundations/ai-business-design/human-judgment-capability.md` | KEEP | Book第5章のPublication本文と章順を保持 | — |
| `src/content/foundations/glossary.md` | MERGE | 役割が新しいReferenceと重複 | 既存URLを維持し、4つのReference正本への索引に変更 |
| `src/content/foundations/guardrail-models.md` | KEEP | Guardrailの説明モデルと限界を保持 | — |
| `src/content/foundations/hallucination-mechanisms.md` | KEEP | 発生機序をAI数学論として保持 | — |
| `src/content/foundations/layered-hallucination-controls.md` | KEEP | 多層制御をAI Designへ接続 | — |
| `src/content/foundations/llm-as-probabilistic-model.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 数学的定義・説明モデル・設計判断・非含意を分離 |
| `src/content/foundations/temperature-design.md` | KEEP | Temperatureの数理と設計上の限界を保持 | — |
| `src/content/foundations/wiki-overview.md` | REMOVE_FROM_PUBLIC | 移行前構造を前提とし一般公開価値がない | 過去媒体の概要として非公開保持 |
| `src/content/knowledge-context/context-before-model-performance.md` | KEEP | Context条件をModel比較から分離 | — |
| `src/content/knowledge-context/human-and-ai-documentation.md` | KEEP | Human ViewとAI Access Layerの差を整理 | — |
| `src/content/knowledge-context/instruction-knowledge-evidence.md` | KEEP | 三責務の分離を示す現行正本 | — |
| `src/content/knowledge-context/prompt-failure-modes.md` | KEEP | Promptの失敗を構造別に整理 | — |
| `src/content/knowledge-context/prompt-structure.md` | UPDATE | 現行構造・表現との不一致 | 用語表の旧媒体表現を現在のサイトへ更新 |
| `src/content/knowledge-context/qa-behavior-constraints.md` | KEEP | QAの回答・拒否条件を設計 | — |
| `src/content/knowledge-context/qa-operations.md` | KEEP | Knowledge更新とQA運用を接続 | — |
| `src/content/practices/adoption-governance.md` | SPLIT | 安定して参照する責務を独立させる | AI導入を目的・委任・例外・改善の正本として独立 |
| `src/content/practices/ai-adoption-and-effective-use.md` | REWRITE | 主題と事実は有効だが、現在の説明構造が必要 | 属性の一般化を避け、影響・情報・責任による判断へ再構成 |
| `src/content/practices/ai-education-principles.md` | KEEP | Zenn Publicationとして教育論を保持 | — |
| `src/content/practices/education-and-capability.md` | SPLIT | 安定して参照する責務を独立させる | 変化しにくい原則と更新する実践を正本化 |
| `src/content/practices/transferring-ai-practices.md` | UPDATE | 現行構造・表現との不一致 | 本文の外部媒体名を現在の公開知識へ更新 |
| `src/content/practices/transferring-practices.md` | SPLIT | 安定して参照する責務を独立させる | 横展開を目的・情報・判断・Risk・評価へ分解して正本化 |
| `src/content/reference/evaluation-metrics.md` | SPLIT | 安定して参照する責務を独立させる | Retrieval・生成・受理・運用の指標を独立 |
| `src/content/reference/glossary.md` | SPLIT | 安定して参照する責務を独立させる | サイト共通の基本用語を独立 |
| `src/content/reference/mathematical-reference.md` | SPLIT | 安定して参照する責務を独立させる | 数学的定義・説明モデル・設計仮説の索引を独立 |
| `src/content/reference/responsibility-state-model.md` | SPLIT | 安定して参照する責務を独立させる | Capability・Authority・Accountabilityと状態遷移を独立 |
| `src/content/software-engineering/ai-design-assistance.md` | RETIRE | Code生成と設計を単純な正解問題 / 非関数問題で対比しており、後発記事の方が精密 | 本文を非公開アーカイブとして保持し、Code生成と業務設計の後継記事へredirect |
| `src/content/software-engineering/ai-driven-development.md` | UPDATE | 現行構造・表現との不一致 | 外部Bookという表現をCase Studyの現行導線へ更新 |
| `src/content/software-engineering/code-generation-and-work-design.md` | RETIRE | 生成と設計支援を対立させる説明の役割終了 | 2026-10-08にdevelopment-workflowへ統合。旧本文を保存し互換redirect |
| `src/content/software-engineering/code-generation-boundaries.md` | RETIRE | 独立した適用場所の判断が工程・委任設計と重複 | 2026-10-08にdevelopment-workflowへ統合。旧本文を保存し互換redirect |
| `src/content/software-engineering/code-generation-models.md` | UPDATE | 現行構造・表現との不一致 | 設計仮説と製品固有情報の扱いから旧媒体表現を除去 |
| `src/content/software-engineering/code-maintenance-context.md` | KEEP | 保守で必要なContext構成を整理 | — |
| `src/content/software-engineering/development-workflow.md` | UPDATE | AIへの変更委任と工程ゲートのAI設計ガイド | 変更影響・検証・反映権限・確認負荷・復旧を統合 |
| `src/content/software-engineering/multi-ai-orchestration.md` | KEEP | 複数AIの役割・受渡し・停止条件を整理 | — |

## Findings

- AI DesignとAI数学論の正本は、すでに事実、説明モデル、設計仮説を概ね分離できていたため、大部分をKEEPとした。
- 主な負債は、Referenceの一ページ集中、Practices正本の不足、公開本文に残る旧媒体表現、Case入口の説明不足だった。
- Zenn / Wiki由来であることは削除せず、front matterとmanifestで保持した。
- Bookの章順、実務上の数値、製品名、暗号方式、承認工程は変更していない。

## 2026-10-03 添付原稿の追加監査

| 正本 | 判断 | 独立した問い・役割 | 発見経路 |
| --- | --- | --- | --- |
| `src/content/essays/it-strategy-and-not-building.md` | ADD | 新規開発そのものをIT戦略・維持責任から判断する。既存what-not-to-build-with-aiはAIによる生成費用低下が起点であり、問いを区別する | DXの価値設計・選択と廃止・システム変革、AI設計Lifecycle、考察一覧 |
| `src/content/practices/transferring-ai-practices.md` | REUSE | 添付「企業内で生成AIの活用事例を共有する活動が行われています。」は既存記事と本文・構成・図が一致するため、既存URLを正本に保持。ContextとECRS記事へ関連導線を補強 | 実践知の導入・教育・定着、DX業務変革・継続的価値創出 |
| `src/content/essays/rethink-work-before-ai.md` | ADD | ECRSで業務自体を再設計した後に実行主体を選ぶ順序を論じる。AI業務設計の一般原則を置き換えない | DX価値設計・業務変革・選択と廃止、AI適用判断、考察一覧 |
| `src/content/essays/legacy-change-and-retirement.md` | ADD | 終焉までの変更容易性と段階的移行を論じる。既存2事例は具体的な仕様理解・保守実践であり役割が異なる | DXシステム変革・選択と廃止、AI設計Lifecycleの関連出版物、考察一覧 |

原稿はUpNote_2026-10-03_17-24-23の4ファイルを使用。Markdownのエスケープ、改行用br、重複した箇条書き記号を整え、主張を保持した。新規3記事はpublication / essay / essaysに正本を置き、AI/DX入口とdx_topicsを分離した。IT戦略・ECRSはAI+DX、レガシー終了はDXのみとし、関連事例からの横断を妨げない。

新規3記事に外部画像はない。横展開原稿の画像は既存正本のローカル画像とMermaidを利用し、外部Hot Linkを追加しない。既存Zenn由来の公開日・source・canonicalを維持した。公開・最終更新日は新規記事のみ2026-10-03とし、更新履歴は既存の同日1件へ統合した。

## 2026-10-03 Career入口と経験ハブ

`src/content/career/overview.md` はユーザー提供原稿による設計思想の正本。`src/content/career/details.md` は従来のCareerの経験・実践事例・外部プロフィールを継承するハブ。職歴・資格・期間の詳細はLinkedInへ委譲し、非公開profileと互換URLは維持する。新規実績を追加せず、3 Caseと8つの関連テーマ・背景へ接続した。


## 2026-10-07：AI利用と運用の非対称性

| 対象 | 判断 | 理由 | 接続 |
| --- | --- | --- | --- |
| `src/content/essays/ai-use-and-operation.md` | ADD | 利用の敷居低下に業務運用能力が追いつかない原因を、技術と組織の変化速度・判断能力の見えにくさから考察。設計手順・定着方法とは問いが異なる | AI / DX業務変革、考察一覧、Garden Notes。詳細はai-use-and-operation-audit-2026-10-07.md |

## 2026-10-07 実務Case追加

| Path | Decision | 理由 |
|---|---|---|
| `src/content/cases/specification-debt-review.md` | ADD | Documentation Debtと仕様・実装の横断調査、Before / Afterの人間による採否判断を扱う独立したACTIVE Case。既存の複数AI保守Caseは情報源ごとの役割分担、旧仕様復元Caseは仕様復元とQAが中心であり、本文を複製しない。 |

## 2026-10-08 AI業務設計の整理

| Path | Decision | 理由 |
|---|---|---|
| `src/content/practices/ai-generation-and-work-completion.md` | MERGE | 第2章 evaluating-business-efficiencyへ実務経験・理解・レビュー・評価・改善後の業務を集約。旧公開URLは既存方式で転送。 |

## 2026-10-08 AI業務設計の最終体系

問いを基準に統合を再評価。詳細は `docs/ai-workflow-content-audit-2026-10-08.md`。第2章が効率評価と実務経験の説明を所有し、責任、Context、停止条件、人間判断、委任、運用は各ページへ接続する。公開Markdownは101から100へ減少し、公開済み旧URLは互換転送として維持する。

## 2026-10-08 全体の前提・役割監査（一次判定）

最新の公開98ファイルの棚卸しと確度は `content-architecture-audit-2026-10-08.md` を参照。Agentと3製品の実務構成を能力の固定境界から区別し、保守の適用例を情報・道具・検証環境による再評価へ接続した。3記事を改訂。追加の退役・物理削除・URL変更はない。教育・横展開の2記事は統合候補であり、未実施。全公開本文の全文精読は未完了で、KEEPには暫定判断を含む。


## 2026-10-08 全体監査後の状態

教育・横展開を含む全公開98ファイルの判断と統合後の構造は[全体監査結果](content-architecture-audit-2026-10-08.md)を参照。この記事の従来の件数・判断は実施時点の記録として保存する。統合元は退役保存し、既存URLは統合先への互換redirectを持つ。
## 2026-10-12：方式設計の判断過程を追加

- `src/content/architecture/requirements-to-system-method.md`：NEW。要求から機能・品質条件を導き、技術比較、機能分担、PoCの採否判断へつなぐ主題を追加。参照アーキテクチャの構成配置、QA評価の測定・判定、QA運用の更新責務とは分離し、詳細は既存記事へ参照する。試験論述資料の一人称・数値を実務成果として移植しない。

## 2026-10-16：技術判断と効率化後の意思決定を追加

- `src/content/software-engineering/engineering-judgment-in-ai-code-review.md`：NEW。所有権・ライフサイクル・依存関係から期待条件を定め、不整合を仮説と検証へ変える独立した技術記事。保守Contextの利用条件、開発工程の構成、コードの受入判定とは主題を分ける。説明用の架空例のみを用い、内部障害の組合せや未確認成果を掲載しない。
- `src/content/essays/from-ai-efficiency-to-value.md`：NEW。効率化確認後の余力の再配分について、決定主体、業務量調整、使途ごとの指標と見直しを扱う論考。DXの価値観、総工数の計測、システム廃止判断の再説明は既存記事へ委ねる。数値は明示した仮例であり、業務実績ではない。

## 2026-10-18：顧客サポートDXのPoC詳細を分離

- `src/content/evaluation-hitl/customer-support-qa-poc.md`：RETIRED（2026-10-19統合）。PoC詳細の正規本文を本編第04章・第08章・第10章へ集約。公開日と履歴のメタデータだけを保持し、旧URLは第10章へ転送する。通常一覧・検索・サイトマップへ独立記事として掲載しない。

- `src/content/cases/customer-support-ai-dx/poc-effect-evaluation.md`：同じCaseの第08章。開発後の第2回PoCで初期方式の評価と問題発見を扱う。改善と再実施の結果は第10章へ分離する。

- `src/content/cases/customer-support-ai-dx/poc-metadata-improvement.md`：同じCaseの第10章。検索対象制御と回答許可判定の改善、PoC再実施、文書検索の適合率98％への改善と月280時間相当の試算を説明。具体的な成功件数や未確認の安全性指標、商用運用の実測成果は追加しない。

## 2026-10-29：生成AIによる技術調査の設計を追加

- `src/content/software-engineering/ai-technical-investigation-design.md`：NEW。ユーザーが公開用に抽象化した実務経験に基づき、一般的な初回回答への一次情報追加、終了処理の同期制御の解放順序の確認、修正後も残ったクラッシュの実行情報、別コードベースへの引き継ぎ、専門外の仮説評価、残存メモリリークの履歴再投入・版間比較・コード確認を具体化。筆者の判断・調査・候補提示と、担当チームの確認・修正・検証を分ける。案件固有情報、未提示の発生機序・測定値は追加しない。プロンプト構造・HITL・変更受入条件は既存の正本へリンクする。公開前に情報の組み合わせによる識別リスクと社内の公開許可を人間が確認する必要があり、編集・検証を公開承認とは扱わない。

## 2026-10-29：技術調査のCase化

既存本文を全6章のBookへ移設。本文の事実・図・公開日は保持し、旧URLは見出しごとの移転案内とする。代表3事例の優先順位は変更しない。公開前の人間による機密確認は引き続き必要。

- `src/content/cases/ai-technical-investigation.md`：技術調査の実務記録。概要または対応する1章の正規本文。
- `src/content/cases/ai-technical-investigation/background.md`：技術調査の実務記録。概要または対応する1章の正規本文。
- `src/content/cases/ai-technical-investigation/initial-investigation.md`：技術調査の実務記録。概要または対応する1章の正規本文。
- `src/content/cases/ai-technical-investigation/shared-library-investigation.md`：技術調査の実務記録。概要または対応する1章の正規本文。
- `src/content/cases/ai-technical-investigation/crash-resolution.md`：技術調査の実務記録。概要または対応する1章の正規本文。
- `src/content/cases/ai-technical-investigation/memory-leak-investigation.md`：技術調査の実務記録。概要または対応する1章の正規本文。
- `src/content/cases/ai-technical-investigation/investigation-principles.md`：技術調査の実務記録。概要または対応する1章の正規本文。


## 2026-10-29 技術調査Caseの考察を調査経緯へ統合

全5章に再編。旧第06章の情報共有・回答確認・権限境界の考察を第02〜05章へ移し、旧URLと見出しは対応する現行章へ転送する。図は維持。旧章の公開日を保持する退役レコードを残し、シリーズから除外した。技術的な事実は追加せず、公開前の人間による確認を継続する。

図下のキャプションを撤去し、旧キャプションIDはfigure自体へ保持。クラッシュ・メモリリークのフローを実際に通った単一路線へ更新し、未実施の分岐と凡例を除去。SVGのtitle/desc、画像の代替テキスト、テーマ・モバイル対応は維持。


## 2026-10-29 技術調査Caseの情報と用途を具体化

紹介と全5章を再読し、第01章で情報共有の基本方針と段階別の用途を明示。第02章は情報追加を選んだ理由、第03章は引き継ぎ内容、第05章はユーザー提示のJira履歴の種類と用途を具体化した。第04章の重複した結論を整理。図・章構成・見出しアンカー・公開日は維持。初期調査で追加した情報の正確な内訳と実際のプロンプト原文は未確認のまま補完せず、社内資料へはアクセスしていない。


## 2026-10-29 技術調査Caseの比較条件と情報共有の表現修正

メモリリークの比較対象を「問題がある版と前回版」へ訂正し、前回版を検証済みの正常版とする説明を撤去。第01章で共有する前提と回答の評価を基本方針として示し、第03章の表は必須テンプレートではないと説明。紹介に原資料照合・会社の公開許可の未確認を明記。第04章の事実経過は維持。フロー・シーケンスの6 SVGを両テーマ・モバイルへ反映し、旧見出しIDは互換性のため保持した。社内資料へアクセスせず、プロンプト例や原文は追加していない。


## 2026-10-29 公開本文の制作管理表現と初期バグの位置づけ

紹介本文から原資料照合・会社公開許可の確認状況を除去し、読者向けの抽象化・機密非掲載方針は維持。第02章と一覧用概要では、同期制御の実装上のバグを筆者が確認して担当者が修正した成果と、対象クラッシュが残った結果を区別した。第04章の互換性問題と第05章のメモリリークは別問題として維持し、既存図もその経緯と一致するため変更しない。

作業報告上の確認事項：社内原資料との照合と会社の公開許可は未確認のままであり、公開承認済みとは扱わない。社内資料へのアクセスや新規の原文掲載、commit・push・デプロイは行っていない。


## 2026-10-29 共通ライブラリ側のメモリリークの確定結果を追記

ユーザーの追加事実に基づき、第03章で発見・引き継ぎ時点の未確定候補と、その後にメモリリークのバグとして確認・修正された結果を区別。第04章ではクラッシュの直接原因が別の互換性問題だったことを維持し、第05章の調査対象との同一性は未確認として断定しない。初期の同期制御バグをメモリリークへ改称していない。図の経路や章順を変更せず、クラッシュフローのSVG説明に時点と後日の結果を補足。内部名称・実装詳細・原資料は追加せず、公開承認は未確認のまま。


## 2026-10-29 技術調査Caseのレビュー限定修正

第02章の図の前に第02〜04章全体の経過である説明を追加。第04章ではクラッシュと異なる問題として残るメモリリークという表現へ調整し、第03章のバグとの別件断定を避ける。第05章のタイトルを「修正候補を絞り込む」に変更し、重複するフロー図の本文参照を解除して役割分担図を優先。フロー図固有の冒頭確認は本文にあり、その他の主な工程は役割分担図でも確認できるため情報は失われない。SVGは削除せず、旧図アンカーは説明段落へ保持。末尾の総括を短縮し、5章構成・URL・日付・公開状態・既存リンクは維持した。

## 2026-10-30 AI投資判断の論考を追加

- `src/content/essays/ai-investment-value-cost-evolution.md`：NEW。既存の考察分類・価値設計に配置。自律化そのものではなく価値と総コストを比較し、標準AI環境との差分、人間の判断、技術進化への追随と撤退の負担から追加開発を判断する。概念式を財務ROIや測定済み効果と区別し、既存の作らない判断・余力の使途の記事へリンクする。社内事例・未測定の数値は使用しない。公開対象メタデータはローカル検証用であり、commit・push・デプロイは別途承認まで行わない。
