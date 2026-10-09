---
summary: "企画から与えられた工数削減・自己解決の業務目標を、システム要件・方式へ具体化する事例です。RAGによる根拠検索から、人への引き継ぎ、評価・改善までを扱います。"
publication_format: book
layer: publication
title: 生成AI / RAGによる顧客サポートDX
kind: case
section: cases
status: published
last_updated: "2026-10-10"
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
cover_alt: 顧客問い合わせからKnowledge検索、RAG、生成AI、人間レビュー、回答、評価・改善までの顧客サポートDX全体フロー
---

<div data-support-dx-diagram></div>

## このBookについて

企画部門から、プリンタ事業縮小への対応、担当者8名から6名への縮小、残業抑制が与えられています。業務目標は、問い合わせ対応工数を月400時間から300時間以下へ減らし、定型問い合わせ750件のうち600件以上を顧客自身で完結させることです。これらを著者自身が企画した事例ではありません。

本書は、その業務要求を受け、追加確認、回答根拠、有人引継ぎ、品質評価、Knowledge運用のシステム要件と、生成AI・ベクトル検索・RAG・HITLの方式を設計する事例です。[企画からシステム要件への境界](/planning/#handoff)に沿って、目標と実現方式を区別します。

顧客サポートで生成AIやRAGを使うとき、技術を導入するだけでは業務は変わりません。誰にどのような価値を届けるのか、どの問い合わせを自己解決へ移すのか、どこでAIを止めるのか、人間へ何を引き継ぐのかまで設計する必要があります。

本書は、B2B機器・ITサービス企業の顧客サポートを対象に、業務課題から回答・有人対応・継続改善までを設計するケーススタディです。

```text
企画で与えられた業務要求・業務目標
  ↓
システム要件
  ↓
業務プロセスの再設計
  ↓
AI・人間・既存システムの責任分担
  ↓
PoC / Knowledge / UX / HITL
  ↓
評価・運用・継続改善
```

設計案、PoCの評価条件、効果試算は、実測した導入成果と区別して扱います。公開実績として確認できない数値は成果として断定しません。

## 読み方

PCでは右側のBook目次、モバイルでは折りたたみ式の目次から任意の章へ移動できます。順番に読む場合は、各章末の前後ナビゲーションを利用してください。


