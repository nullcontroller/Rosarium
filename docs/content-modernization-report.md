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
