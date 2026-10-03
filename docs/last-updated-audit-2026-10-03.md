# 最終更新日監査 — 2026-10-03

記事追加後の全133 HTMLを走査し、表示・JSON-LD dateModified・sitemap lastmodを照合した。先行する全ページ日付監査で25ページを修正し、今回の新規3記事と変更した関連一覧にも2026-10-03を設定した。

## 日付の判定根拠

- Home：95b646e（命名由来と内部導線）、AI：b45fef8（入口とOTHER PATHS）、実践知：b3571fd（カテゴリ別一覧）。いずれも2026-10-03。
- AI理論：937125c（公開状態表示・知識探索導線の整理）、CasesとBooks：b3571fd（公開Case画像追加・差し替え）およびdcc89c9（表紙なしBook一覧の修正）。2026-10-03。
- 顧客サポートDX概要：b3571fdの全体構成画像追加。code-generation-models、transferring-ai-practices：937125cの本文・Knowledge統合。2026-10-03。
- 旧3記事URL：937125cの退役と転送ページ新設。2026-10-03。
- AI設計の適用判断・Knowledge/Context・Lifecycle、および関連する旧一覧：5d3c701の本文改訂を一覧の最終更新日に反映。2026-09-29。
- DXの業務変革・システム変革・継続的価値創出、およびDXトップ：2026-10-03に更新した代表Caseの表示情報を反映。
- 技術・考察一覧：937125cの退役・本文整理を反映。2026-10-03。
- 他ページは既存の明示日付を保持。根拠不明の場合の2026-09-28という既存運用も保持。
- 共通Header、Footer、GA4、CSS、build、deployだけの変更で全記事の日付を更新しない。Gitは今回の事後監査の根拠として参照し、ビルド時の日付生成には使用しない。

## 今後の運用

記事はfront matterのlast_updated、静的ページと互換ページはsrc/lib/site.tsのstaticPageLastUpdatedを実質的な変更時に更新する。一覧の内容や表示情報が変わった場合は、その一覧ページの日付も確認する。npm run buildのverify-last-updated.mjsが、全HTMLの明示的な出典、表示、JSON-LD、sitemapの整合性を検証し、dist/last-updated-audit.jsonへ全件を出力する。

今回追加したIT戦略・ECRS・レガシー終了の記事、および関連出版物を追加したAI適用判断・Lifecycle、記事一覧が変化したDX価値設計・選択と廃止は2026-10-03。本文や構造を変更していないページの日付は保持した。

## 全ページ

| URL | 最終更新日 | 正本 |
| --- | --- | --- |
| / | 2026-10-03 | src/lib/site.ts |
| /404.html | 2026-09-28 | src/lib/site.ts |
| /about | 2026-09-28 | src/lib/site.ts |
| /ai | 2026-10-03 | src/lib/site.ts |
| /ai-design | 2026-09-28 | src/lib/site.ts |
| /ai-design/applicability | 2026-10-03 | src/lib/site.ts |
| /ai-design/architecture | 2026-09-28 | src/lib/site.ts |
| /ai-design/evaluation-hitl | 2026-09-28 | src/lib/site.ts |
| /ai-design/knowledge-context | 2026-09-29 | src/lib/site.ts |
| /ai-design/lifecycle-operations | 2026-10-03 | src/lib/site.ts |
| /ai-design/responsibility-control | 2026-09-28 | src/lib/site.ts |
| /ai-design/software-engineering | 2026-10-03 | src/lib/site.ts |
| /ai-mathematics | 2026-10-03 | src/lib/site.ts |
| /architecture | 2026-09-29 | src/lib/site.ts |
| /architecture/agents-tools-and-workflows | 2026-09-28 | src\content\architecture\agents-tools-and-workflows.md |
| /architecture/change-and-reevaluation | 2026-09-29 | src\content\architecture\change-and-reevaluation.md |
| /architecture/cost-latency-routing | 2026-09-28 | src\content\architecture\cost-latency-routing.md |
| /architecture/observability-and-slo | 2026-09-28 | src\content\architecture\observability-and-slo.md |
| /architecture/prompts-as-interfaces | 2026-09-28 | src\content\architecture\prompts-as-interfaces.md |
| /architecture/reference-architecture | 2026-09-28 | src\content\architecture\reference-architecture.md |
| /architecture/security-threat-modeling | 2026-09-28 | src\content\architecture\security-threat-modeling.md |
| /articles | 2026-09-28 | src/lib/site.ts |
| /books | 2026-10-03 | src/lib/site.ts |
| /career | 2026-09-28 | src\content\career\overview.md |
| /career/profile | 2026-09-28 | src/lib/site.ts |
| /cases | 2026-10-03 | src/lib/site.ts |
| /cases/customer-support-ai-dx | 2026-10-03 | src\content\cases\customer-support-ai-dx.md |
| /cases/customer-support-ai-dx/continuous-improvement | 2026-09-28 | src\content\cases\customer-support-ai-dx\continuous-improvement.md |
| /cases/customer-support-ai-dx/customer-experience | 2026-09-28 | src\content\cases\customer-support-ai-dx\customer-experience.md |
| /cases/customer-support-ai-dx/design-principles | 2026-09-28 | src\content\cases\customer-support-ai-dx\design-principles.md |
| /cases/customer-support-ai-dx/executive-summary | 2026-09-28 | src\content\cases\customer-support-ai-dx\executive-summary.md |
| /cases/customer-support-ai-dx/human-handoff | 2026-09-28 | src\content\cases\customer-support-ai-dx\human-handoff.md |
| /cases/customer-support-ai-dx/knowledge-design | 2026-09-28 | src\content\cases\customer-support-ai-dx\knowledge-design.md |
| /cases/customer-support-ai-dx/outcomes-and-evidence | 2026-09-28 | src\content\cases\customer-support-ai-dx\outcomes-and-evidence.md |
| /cases/customer-support-ai-dx/poc-evaluation | 2026-09-28 | src\content\cases\customer-support-ai-dx\poc-evaluation.md |
| /cases/customer-support-ai-dx/responsibility-boundary | 2026-09-28 | src\content\cases\customer-support-ai-dx\responsibility-boundary.md |
| /cases/customer-support-ai-dx/stopping-conditions | 2026-09-28 | src\content\cases\customer-support-ai-dx\stopping-conditions.md |
| /cases/customer-support-ai-dx/why-ai | 2026-09-28 | src\content\cases\customer-support-ai-dx\why-ai.md |
| /cases/system-understanding | 2026-10-03 | src\content\cases\system-understanding.md |
| /cases/system-understanding/connecting-ui-and-internals | 2026-09-28 | src\content\cases\system-understanding\connecting-ui-and-internals.md |
| /cases/system-understanding/human-and-ai-knowledge | 2026-09-28 | src\content\cases\system-understanding\human-and-ai-knowledge.md |
| /cases/system-understanding/project-structure | 2026-09-28 | src\content\cases\system-understanding\project-structure.md |
| /cases/system-understanding/qa-case-study | 2026-09-28 | src\content\cases\system-understanding\qa-case-study.md |
| /cases/system-understanding/qa-case-study-revisited | 2026-09-28 | src\content\cases\system-understanding\qa-case-study-revisited.md |
| /cases/system-understanding/qa-evaluation | 2026-09-28 | src\content\cases\system-understanding\qa-evaluation.md |
| /cases/system-understanding/qa-operations | 2026-09-28 | src\content\cases\system-understanding\qa-operations.md |
| /cases/system-understanding/rag-implementation | 2026-09-28 | src\content\cases\system-understanding\rag-implementation.md |
| /cases/system-understanding/rag-improvement | 2026-09-28 | src\content\cases\system-understanding\rag-improvement.md |
| /cases/system-understanding/recovering-code-structure | 2026-09-28 | src\content\cases\system-understanding\recovering-code-structure.md |
| /cases/system-understanding/system-understanding-problems | 2026-09-28 | src\content\cases\system-understanding\system-understanding-problems.md |
| /cases/system-understanding/visualizing-process-flows | 2026-09-28 | src\content\cases\system-understanding\visualizing-process-flows.md |
| /cases/three-ai-maintenance | 2026-10-03 | src\content\cases\three-ai-maintenance.md |
| /cases/three-ai-maintenance/code-generation-and-unit-tests | 2026-09-28 | src\content\cases\three-ai-maintenance\code-generation-and-unit-tests.md |
| /cases/three-ai-maintenance/cryptography-and-failure-modes | 2026-09-28 | src\content\cases\three-ai-maintenance\cryptography-and-failure-modes.md |
| /cases/three-ai-maintenance/implementation-design | 2026-09-28 | src\content\cases\three-ai-maintenance\implementation-design.md |
| /cases/three-ai-maintenance/results-and-reflections | 2026-09-28 | src\content\cases\three-ai-maintenance\results-and-reflections.md |
| /cases/three-ai-maintenance/reviewable-specifications | 2026-09-28 | src\content\cases\three-ai-maintenance\reviewable-specifications.md |
| /cases/three-ai-maintenance/sharing-current-specifications | 2026-09-28 | src\content\cases\three-ai-maintenance\sharing-current-specifications.md |
| /cases/three-ai-maintenance/structuring-failure-handling | 2026-09-28 | src\content\cases\three-ai-maintenance\structuring-failure-handling.md |
| /cases/understanding-systems-as-capability | 2026-09-28 | src\content\cases\understanding-systems-as-capability.md |
| /dx | 2026-10-03 | src/lib/site.ts |
| /dx/business-transformation | 2026-10-03 | src/lib/site.ts |
| /dx/continuous-value | 2026-10-03 | src/lib/site.ts |
| /dx/selection-retirement | 2026-10-03 | src/lib/site.ts |
| /dx/system-transformation | 2026-10-03 | src/lib/site.ts |
| /dx/value-design | 2026-10-03 | src/lib/site.ts |
| /essays | 2026-10-03 | src/lib/site.ts |
| /essays/ai-career-market | 2026-09-22 | src\content\essays\ai-career-market.md |
| /essays/ai-roles-beyond-fde | 2026-09-28 | src\content\essays\ai-roles-beyond-fde.md |
| /essays/dx-and-value | 2026-09-28 | src\content\essays\dx-and-value.md |
| /essays/it-strategy-and-not-building | 2026-10-03 | src\content\essays\it-strategy-and-not-building.md |
| /essays/legacy-change-and-retirement | 2026-10-03 | src\content\essays\legacy-change-and-retirement.md |
| /essays/model-competition-and-ecosystems | 2026-10-03 | src/lib/site.ts |
| /essays/rethink-work-before-ai | 2026-10-03 | src\content\essays\rethink-work-before-ai.md |
| /essays/trust-in-ai-generated-content | 2026-09-28 | src\content\essays\trust-in-ai-generated-content.md |
| /essays/what-not-to-build-with-ai | 2026-09-28 | src\content\essays\what-not-to-build-with-ai.md |
| /evaluation-hitl | 2026-10-03 | src/lib/site.ts |
| /evaluation-hitl/code-evaluation-acceptance | 2026-09-22 | src\content\evaluation-hitl\code-evaluation-acceptance.md |
| /evaluation-hitl/datasets-and-regression | 2026-09-28 | src\content\evaluation-hitl\datasets-and-regression.md |
| /evaluation-hitl/human-review-capability | 2026-10-03 | src/lib/site.ts |
| /evaluation-hitl/qa-evaluation | 2026-09-28 | src\content\evaluation-hitl\qa-evaluation.md |
| /evaluation-hitl/responsibility-and-hitl | 2026-09-28 | src\content\evaluation-hitl\responsibility-and-hitl.md |
| /foundations | 2026-09-28 | src/lib/site.ts |
| /foundations/ai-business-design | 2026-09-28 | src\content\foundations\ai-business-design.md |
| /foundations/ai-business-design/asking-versus-delegating | 2026-09-28 | src\content\foundations\ai-business-design\asking-versus-delegating.md |
| /foundations/ai-business-design/delegation-and-responsibility | 2026-09-28 | src\content\foundations\ai-business-design\delegation-and-responsibility.md |
| /foundations/ai-business-design/evaluating-business-efficiency | 2026-09-28 | src\content\foundations\ai-business-design\evaluating-business-efficiency.md |
| /foundations/ai-business-design/explainable-delegation | 2026-09-28 | src\content\foundations\ai-business-design\explainable-delegation.md |
| /foundations/ai-business-design/human-judgment-capability | 2026-09-28 | src\content\foundations\ai-business-design\human-judgment-capability.md |
| /foundations/answer-scope | 2026-09-28 | src\content\foundations\answer-scope.md |
| /foundations/applicability-and-delegation | 2026-09-28 | src\content\foundations\applicability-and-delegation.md |
| /foundations/conditional-probability | 2026-09-22 | src\content\foundations\conditional-probability.md |
| /foundations/generation-and-acceptance | 2026-09-28 | src\content\foundations\generation-and-acceptance.md |
| /foundations/glossary | 2026-09-22 | src\content\foundations\glossary.md |
| /foundations/guardrail-models | 2026-09-28 | src\content\foundations\guardrail-models.md |
| /foundations/hallucination-mechanisms | 2026-09-28 | src\content\foundations\hallucination-mechanisms.md |
| /foundations/layered-hallucination-controls | 2026-09-28 | src\content\foundations\layered-hallucination-controls.md |
| /foundations/llm-as-probabilistic-model | 2026-09-28 | src/lib/site.ts |
| /foundations/temperature-design | 2026-09-28 | src\content\foundations\temperature-design.md |
| /knowledge-context | 2026-09-29 | src/lib/site.ts |
| /knowledge-context/context-before-model-performance | 2026-09-29 | src\content\knowledge-context\context-before-model-performance.md |
| /knowledge-context/human-and-ai-documentation | 2026-09-28 | src\content\knowledge-context\human-and-ai-documentation.md |
| /knowledge-context/instruction-knowledge-evidence | 2026-09-28 | src\content\knowledge-context\instruction-knowledge-evidence.md |
| /knowledge-context/prompt-failure-modes | 2026-09-28 | src\content\knowledge-context\prompt-failure-modes.md |
| /knowledge-context/prompt-structure | 2026-09-22 | src\content\knowledge-context\prompt-structure.md |
| /knowledge-context/qa-behavior-constraints | 2026-09-28 | src\content\knowledge-context\qa-behavior-constraints.md |
| /knowledge-context/qa-operations | 2026-09-28 | src\content\knowledge-context\qa-operations.md |
| /overview | 2026-09-28 | src/lib/site.ts |
| /practices | 2026-10-03 | src/lib/site.ts |
| /practices/adoption-governance | 2026-09-28 | src\content\practices\adoption-governance.md |
| /practices/ai-adoption-and-effective-use | 2026-09-29 | src\content\practices\ai-adoption-and-effective-use.md |
| /practices/ai-education-principles | 2026-09-28 | src\content\practices\ai-education-principles.md |
| /practices/education-and-capability | 2026-09-28 | src\content\practices\education-and-capability.md |
| /practices/transferring-ai-practices | 2026-10-03 | src\content\practices\transferring-ai-practices.md |
| /practices/transferring-practices | 2026-09-28 | src\content\practices\transferring-practices.md |
| /reference | 2026-09-28 | src/lib/site.ts |
| /reference/evaluation-metrics | 2026-09-22 | src\content\reference\evaluation-metrics.md |
| /reference/glossary | 2026-09-22 | src\content\reference\glossary.md |
| /reference/mathematical-reference | 2026-09-22 | src\content\reference\mathematical-reference.md |
| /reference/responsibility-state-model | 2026-09-22 | src\content\reference\responsibility-state-model.md |
| /search | 2026-09-28 | src/lib/site.ts |
| /series | 2026-09-28 | src/lib/site.ts |
| /software-engineering | 2026-10-03 | src/lib/site.ts |
| /software-engineering/ai-design-assistance | 2026-10-03 | src/lib/site.ts |
| /software-engineering/ai-driven-development | 2026-09-22 | src\content\software-engineering\ai-driven-development.md |
| /software-engineering/code-generation-and-work-design | 2026-09-28 | src\content\software-engineering\code-generation-and-work-design.md |
| /software-engineering/code-generation-boundaries | 2026-09-28 | src\content\software-engineering\code-generation-boundaries.md |
| /software-engineering/code-generation-models | 2026-10-03 | src\content\software-engineering\code-generation-models.md |
| /software-engineering/code-maintenance-context | 2026-09-28 | src\content\software-engineering\code-maintenance-context.md |
| /software-engineering/development-workflow | 2026-09-28 | src\content\software-engineering\development-workflow.md |
| /software-engineering/multi-ai-orchestration | 2026-09-28 | src\content\software-engineering\multi-ai-orchestration.md |
| /start-here | 2026-09-28 | src/lib/site.ts |
| /updates | 2026-09-28 | src/lib/site.ts |
