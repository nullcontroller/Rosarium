---
summary: "実務に基づきRAG管理システムを新規設計・構築し、メタデータによる検索対象制御後のPoCで回答正答率72％から96％への改善を確認した事例です。本番での回答品質と業務削減効果は確認していません。"
publication_format: book
layer: publication
title: 生成AI / RAGによる顧客サポートDX
kind: case
section: cases
status: published
last_updated: "2026-11-27"
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

**実際に携わった顧客サポートDXの業務・設計・PoCを、公開可能な形へ再構成した技術事例です。** 業務量・対応工数・人員は実測に基づきます。PoCの回答正答率は72％と96％を確認しました。業務効果の試算とは区別します。

## 業務課題と制約

複合機・プリンタのCS部では、8名で月1,500件、400時間の問い合わせに対応していました。定型問い合わせの自己解決を目指す一方、個別の適用判断や追加調査は人間へ残します。既存の製品資料を利用し、顧客向けQAシステムを新規開発する方式を設計しました。

## このBookで検討する設計判断

生成AIの追加質問とRAGを組み合わせました。ただし、意味が近い文書を取得できることと、顧客へ自動回答してよいことは別です。対象製品・版数・利用環境を管理するRAG管理システムを新規設計・構築しました。原本文書、検索用データ、顧客向けQAの責務を分け、検索対象制御と回答許可を独立させる方式です。

<a id="シナリオの評価と効果試算" aria-hidden="true"></a>

<a id="評価の見積もりと効果試算" aria-hidden="true"></a>

## PoCの確認結果と業務効果の試算

第1回PoCの回答正答率72％から、RAG管理システムとメタデータによる検索対象制御を導入した第2回PoCで96％へ改善し、目標を達成しました。改善幅は24パーセントポイントです。残る4％は、自動回答できる問い合わせを保守的に有人へ回したケースです。誤った回答の提示ではなく、今回は追加改善を行っていません。検索文書だけの適合率や本番成果とは区別します。

月720件は実測の問い合わせ件数です。この720件を顧客自身で解決できると想定すると、対応工数は月400時間から280時間へ減る計算です。自己解決件数や削減後工数の実測ではなく、資料整備や保守などの増加工数は含みません。

## 詳細の読み方

第01章で事例と担当範囲、第02〜03章で業務条件と初期構想、第04章で第1回PoC、第05〜06章で初期方式の引継ぎ・顧客体験、第07章で第1回PoCの課題分析、第08〜09章でRAG管理基盤と属性管理、第10章で第2回PoC、第11章で設計判断を扱います。章の一覧は以下のBook目次から参照できます。
