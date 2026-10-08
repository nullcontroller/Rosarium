# Reading Classification Audit

監査日：2026-10-03

## 原則

Canonical classificationとDiscovery Pathを分離する。`layer`、`section`、`design_topic`、URL、本文、source metadataは変更せず、一つの正本へ複数の「読む経路」から到達できるようにした。分類数を均等にするための移動や複製は行っていない。

## Canonical counts

| Category | Before | After | 判定 |
|---|---:|---:|---|
| AI設計 | 23 | 23 | 変更なし |
| AI理論 | 4 | 4 | 変更なし |
| 実践知 | 4 | 4 | 変更なし |
| 実践事例 | 2 Book | 3 Book | 顧客サポートDXを追加 |

## Reading Path counts

| Reading Path | Before | After | 追加した発見経路 |
|---|---:|---:|---|
| AI設計 | 23 | 26 | AI業務設計Book、Agent / Tool / Workflow、運用・再設計 |
| AI理論 | 4 | 6 | 多層Hallucination制御、Guardrail数理、Code生成モデル |
| 実践知 | 4 | 25 | Prompt、QA運用、Knowledge、開発・保守、複数AI、評価、関連Publication |
| 実践事例 | 2 | 3 | 顧客サポートDXを追加 |

## Reading groups and order

| Path | Group | Order rationale | Canonical entries / cross-listed entries |
|---|---|---|---|
| AI設計 | 基礎・適用判断 | 適用可否 → 回答範囲 → 責任 → 連載 | applicability, answer-scope, responsibility-and-hitl, ai-business-design |
| AI設計 | 責任・安全 | 数理的制約 → 多層制御 → Security | guardrail-models, layered-hallucination-controls, security-threat-modeling |
| AI設計 | アーキテクチャ | 全体構成 → Routing / Interface → 変更・観測 → Agent | reference-architecture, cost-latency-routing, prompts-as-interfaces, change-and-reevaluation, observability-and-slo, agents-tools-and-workflows |
| AI設計 | Knowledge / Context | 情報責務 → Prompt → 文書 → QA制約・運用 | instruction-knowledge-evidence, prompt-structure, prompt-failure-modes, human-and-ai-documentation, qa-behavior-constraints, qa-operations |
| AI設計 | 評価・HITL | Dataset → QA → Code受入 | datasets-and-regression, qa-evaluation, code-evaluation-acceptance |
| AI設計 | Software Engineering | 生成境界 → 保守Context → 複数AI | code-generation-boundaries, code-maintenance-context, multi-ai-orchestration |
| AI理論 | 確率と生成 | 条件付き確率 → Temperature | conditional-probability, temperature-design |
| AI理論 | 誤りと制御 | 発生原理 → 多層制御 → Guardrail数理 | hallucination-mechanisms, layered-hallucination-controls, guardrail-models |
| AI理論 | 生成モデルと変化 | Code生成モデルをSystemとして分解 | code-generation-models |
| 実践知 | 導入・教育・定着 | 導入 → 教育 → Capability → 横展開 | adoption-governance, ai-adoption-and-effective-use, education-and-capability, ai-education-principles, transferring-practices, transferring-ai-practices |
| 実践知 | Prompt・Knowledge運用 | Prompt設計・失敗 → QA運用 → Context → 文書 | prompt-structure, prompt-failure-modes, qa-operations, context-before-model-performance, human-and-ai-documentation |
| 実践知 | 開発・保守 | Workflow → 生成境界 → 保守 → 複数AI → Publication実践 | development-workflowほか8件 |
| 実践知 | 評価・Human Review | 回帰評価 → 責任境界 → 受理 → 信頼 | datasets-and-regression, responsibility-and-hitl, generation-and-acceptance, trust-in-ai-generated-content |
| 実践知 | 組織・キャリア | 採用市場 → Role分化 | ai-career-market, ai-roles-beyond-fde |
| 実践事例 | 業務・システムの実践 | 単独GPT中心 → 3 AIの役割分担 → 顧客サポートDX | system-understanding, three-ai-maintenance, customer-support-ai-dx |

順序のSingle Source of Truthは `src/lib/reading.ts`。Hub、カテゴリページ、Desktop右ペイン、Mobile Navigator、個別記事で同じデータを利用する。

## Publication reachability

top-level Zenn Article 16件のうち13件を公開し、退役3件は後継Knowledgeへredirectする。Series Chapter 24件は親Book / Seriesの目次から到達する。ReferenceとCareerはそれぞれ専用入口を持つ。公開コンテンツの孤児は0件。

## Knowledge gaps

既存資産からは、Embedding / Similarity、Attentionを独立して深く説明するAI理論正本は確認できなかった。既存本文にない主張を水増ししないため、今回は新記事を作成していない。将来の候補は「Embeddingと類似度が検索結果へ与える影響」「Attention / Context Windowを設計上どう読むか」。既存の確率・Hallucination・Guardrail・Code生成モデルで今回のNavigation要件は満たす。

実践知では、AIを使った調査だけを独立責務とする正本はない。QA運用、Context、開発Workflowに分散しており、現時点では新記事へ分割するだけの固有知識量がないため追加していない。

## Compatibility

公開を継続するContentのURL、canonical、layer、section、design_topic、Zenn / Wiki provenanceは変更していない。退役3件の旧Rosarium URLは後継Knowledgeへredirectし、Zenn canonicalと移行元metadataは非公開Content内に保持する。

## 2026-10-08 AI設計全体の再監査

上記の2026-10-03時点の経路は履歴として保持する。現在のAI設計入口は10の設計領域を示し、領域別の23件は適用判断→責任→情報→評価→構成→開発工程→運用の順とする。読む順の定義は `src/lib/ai-design.ts` を共有し、`src/lib/reading.ts` もそこから参照する。分類・URL・Lifecycleは維持する。

Architectureの構成ガイドを参照アーキテクチャ、Agent/Tool/Workflowのガイドを複数AI工程設計へ対応付ける。ストレージ整理の考察は設計ガイドの代わりにせず、Architecture領域から経験として辿れるようにする。QA運用はLifecycle、モデルRoutingはArchitectureに属する現在のmetadataへ読む経路を一致させる。

本文6件の説明範囲、改訂判断、全23件の問いは [AI設計全体監査](../docs/ai-design-entry-audit-2026-10-08.md) に記録する。新規記事・記事削除・分類移動は行わない。
