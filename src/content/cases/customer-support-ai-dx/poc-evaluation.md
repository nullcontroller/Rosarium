---
summary: "本格開発前に過去の問い合わせ500件を用い、追加質問・検索・RAG・有人引継ぎを確認。構想したQAシステムの技術的な実現可能性と開発へ進む見込みを示します。"
layer: publication
title: 03. 第1回PoC：技術的実現可能性の確認
kind: case
section: cases
status: published
last_updated: "2026-10-19"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [system-transformation]
tags: [PoC, AI Evaluation, RAG, 業務成立性]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 4
---

## 本格開発前に「作れるか」を確認する

**第1回PoCでは、構想した顧客向けQAシステムの技術的な実現可能性を確認しました。**  
本格開発前に過去の問い合わせ500件を使い、対話で必要情報を集め、根拠文書から回答し、回答できない場合に担当者へ引き継ぐ一連の方式を確かめました。

## 構想した方式で確認したこと

<div data-case-diagram="support-poc-checks"></div>

顧客の問い合わせだけで情報が足りなければ追加質問を行い、対象機種や利用環境を特定します。その条件に適合する文書を検索し、取得した根拠をRAGへ渡して回答を生成する流れを確認しました。  
自動回答できない場合は、確認済み情報や参照文書を担当者へ渡し、有人対応へつなげることも確認対象としました。

## 技術的な実現見込みを開発へつなぐ

**500件の問い合わせを用いて技術的な実現可能性を検証し、構想したQAシステムは実現できる見込みが立ちました。**  
この確認を受け、追加質問、検索、RAGによる回答生成、回答許可判定、有人引継ぎを備えるQAシステムの開発へ進みます。

本章は設計・検証シナリオにおける技術的実現可能性の確認です。

[次章：第2回PoC](/cases/customer-support-ai-dx/poc-effect-evaluation/)へ進みます。
