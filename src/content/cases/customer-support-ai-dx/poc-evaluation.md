---
summary: "メタデータによる検索対象の絞込みを導入する前の方式を第1回PoCで評価し、回答正答率72％を確認しました。適用条件が異なる文書の誤検索を課題として整理します。"
layer: publication
title: 04. 第1回PoC：初期方式の評価
kind: case
section: cases
status: published
last_updated: "2026-11-24"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [system-transformation]
tags: [PoC, AI Evaluation, RAG, 検索品質]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 4
---

<a id="本格開発前に3機能の実現可能性を確認する" aria-hidden="true"></a>
<a id="確認した3機能" aria-hidden="true"></a>

## 第1回PoCで絞込み前の方式を評価する

逆質問、ベクトル検索、RAGによる根拠付き回答生成を組み合わせた初期方式を評価しました。この時点では、メタデータによる検索対象の絞込みを導入していません。回答正答率は72％でした。

<div data-case-diagram="support-poc-checks"></div>

## 機能の動作と検索品質を分けて捉える

関連文書を取得できても、対象製品・版数・利用環境が異なれば回答根拠として適用できません。検索が動くことだけでは、顧客へ案内できる品質とは判断できませんでした。

本章は第1回PoCの概要です。同じPoCで確認した検索の問題と設計上の課題分析を[第07章](/cases/customer-support-ai-dx/poc-effect-evaluation/)で詳しく扱い、RAG管理システムの構築とメタデータ整備を経た第2回PoCは[第10章](/cases/customer-support-ai-dx/poc-metadata-improvement/)で説明します。本番環境での検索品質を評価した結果ではありません。
