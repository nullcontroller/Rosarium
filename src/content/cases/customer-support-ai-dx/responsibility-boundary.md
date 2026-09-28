---
summary: "問い合わせの性質を分け、自然言語処理と根拠検索はAIへ、専門判断と例外対応は人間へ残す責任境界を整理する。"
layer: publication
title: 02. 何をAIに任せ、何を人間に残したか
kind: case
section: cases
status: published
last_updated: "2026-09-28"
entry_points: [ai, dx]
dx_topic: system-planning
tags: [Applied AI, HITL, 責任境界, 業務設計]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/ai-design-foundations
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 3
---

## 問い合わせを一律に自動化しない

同じ顧客サポートでも、問い合わせの性質は異なります。資料では、過去の問い合わせを次の三つに分けて考えています。

1. 既存文書に回答根拠があり、確認事項も比較的定型的である
2. 既存文書に根拠はあるが、症状の切分けや専門判断が必要である
3. 個別調査や開発部門への確認が必要である

AIの主な対象は1です。2と3まで自動化率を上げるためにAIへ任せると、根拠の弱い回答や、影響を判断できない案内が増えます。自動化率ではなく、責任を持って回答できる範囲を先に決めます。

## Responsibility Boundary

```mermaid
flowchart LR
  Q[問い合わせ] --> A[AI]
  A --> K[既存システム / Knowledge]
  K --> J{回答条件を満たすか}
  J -->|満たす| R[根拠に基づく回答]
  J -->|満たさない| H[人間へ引継ぎ]

  subgraph AIの役割
    A1[自然な表現の理解]
    A2[不足情報の追加質問]
    A3[Knowledge検索]
    A4[根拠に沿った回答案]
  end

  subgraph 人間の役割
    H1[専門判断]
    H2[個別調査]
    H3[影響の大きい判断]
    H4[例外対応]
  end
```

| 担当 | 保持する役割 |
|---|---|
| AI | 自然な問い合わせの解釈、不足情報の確認、検索要求の構成、根拠に沿った回答案 |
| 人間 | 専門判断、個別調査、高影響の操作、例外の処理、最終的な責任 |
| 既存システム / Knowledge | マニュアル、仕様、FAQ、確認済み障害情報、機種・版・公開可否などの事実と制約 |

## 委任レベルを変える

回答根拠と確認事項が明確な問い合わせでは、AIへ対話から回答まで委任できます。専門判断が必要なら、AIは情報収集と候補提示までに留めます。個別調査が必要なら、入口で必要情報を集め、人間へ渡す支援に限定します。

同じシステムの中でも、問い合わせのリスクと不確実性に応じて委任レベルを変える設計です。これは「AIを使うか、使わないか」の二択ではありません。どこまで任せ、どこから人間が受理するかを決めることです。

詳しい原則は、[AIと人間の責任境界](/ai-design-foundations/ai-design/responsibility-control/)で扱っています。

