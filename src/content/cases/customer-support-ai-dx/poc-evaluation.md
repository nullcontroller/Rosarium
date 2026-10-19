---
summary: "本格開発前に過去の問い合わせ500件を用い、逆質問・ベクトル検索・RAGによる回答生成の3機能を確認。構想したQAシステムの技術的な実現可能性と開発へ進む見込みを示します。"
layer: publication
title: 04. 第1回PoC：技術的実現可能性の確認
kind: case
section: cases
status: published
last_updated: "2026-10-19"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [system-transformation]
tags: [PoC, AI Evaluation, RAG, 技術的実現可能性]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 4
---

## 本格開発前に技術的な実現可能性を確認する

顧客向けQAシステムの新規開発に先立ち、過去の問い合わせ500件を用いて第1回PoCを実施しました。  
**検証したのは、生成AIによる逆質問、ベクトル検索による関連文書の取得、RAGによる回答生成の3機能です。**

## 検証した3機能

<div data-case-diagram="support-poc-checks"></div>

問い合わせに不足している情報を生成AIが聞き返し、問い合わせに関連する文書をベクトル検索で取得し、その文書を根拠にRAGで回答を生成できることを確認しました。

## 技術的な実現見込みを本格開発へつなぐ

**過去の問い合わせ500件でこの3機能を確認した結果、構想したQAシステムについて技術的な実現可能性の見込みが立ち、本格開発へ進む判断につながりました。**

本章は設計・検証シナリオにおける技術確認です。第1回PoCは業務効果や安全性を評価したものではありません。開発したQAシステムの業務への適合性は、[第9章：第2回PoC](/cases/customer-support-ai-dx/poc-effect-evaluation/)で確認します。
