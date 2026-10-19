---
summary: "企画部門からの業務改善提案を受け、顧客向けQAの新規開発に向けて、要求をシステム要件・機能分担・処理方式へ具体化した設計事例です。検索対象制御と有人引継ぎを設計し、目標実現への見通しを示します。"
publication_format: book
layer: publication
title: 生成AI / RAGによる顧客サポートDX
kind: case
section: cases
status: published
last_updated: "2026-10-19"
entry_points:
  - ai
  - dx
primaryCategory: business-transformation
secondaryCategories: [continuous-value]
tags: &topics
  - Applied AI
  - DX
  - RAG
  - Knowledge Architecture
  - AI Evaluation
  - HITL
  - UX
  - System Architecture
published_at: "2026-09-28"
publication_status: published
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
  topics: *topics
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 0
cover: /assets/cases/customer-support-ai-dx-overview.jpg
show_cover: false
cover_alt: 顧客問い合わせから参照資料の検索、RAG、生成AI、人間レビュー、回答、評価・改善までの顧客サポートDX全体フロー
---

## 業務背景

複合機・プリンタの顧客サポートでは、8名の担当者が月1,500件の問い合わせに約400時間を費やしていました。顧客から機種や利用環境を聞き取り、仕様書・FAQ・障害情報を調べて回答するため、定型的な問い合わせも人手に依存していました。

## 解決すべき課題

担当者の負担を減らし、定型問い合わせを顧客自身で解決できる仕組みが必要でした。一方、専門判断や追加調査が必要な案件までAIに回答させるわけにはいきません。

## 設計と問題発見

生成AIによる追加質問、RAGによる文書検索・回答生成、専門担当者への引継ぎを組み合わせたQAシステムを設計しました。

第2回PoCでは、別機種の文書を誤検索する問題と、専門判断が必要な案件に誤って自動回答する問題が判明しました。

## 改善結果

RAGの参照資料を整備し、検索対象と回答許可を別々に制御する方式へ改善しました。

- 文書検索の適合率：72％ → 98％
- 専門判断案件の有人振り分け率：94％ → 100％

## 業務効果の見込み

定型問い合わせのうち月720件を顧客自身で解決できると想定すると、対応工数は月400時間から280時間へ削減できる見込みです。

本事例は設計・検証シナリオです。評価値はシナリオ内の結果、業務効果は条件付きの試算であり、本番運用の実績ではありません。
