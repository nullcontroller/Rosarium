---
summary: "PoC再実施で得た到達点と工数削減の見込みを受け、本番適用前に確認する実際の業務効果・回答品質の維持・運用負荷の3点を整理します。"
layer: publication
title: 11. 本番適用に向けて残る課題
kind: case
section: cases
status: published
last_updated: "2026-10-19"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [business-transformation]
tags: [Continuous Improvement, AI Evaluation, RAG, Operations]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 11
---

第10章のPoC再実施では、設計・検証シナリオ上で<strong>文書検索の適合率98％、専門判断案件の有人振り分け率100％</strong>を確認しました。月720件の自己解決を前提に、対応工数280時間／月を見込んでいます。**本番運用の実績はまだなく、適用前に次の3点を確認する必要があります。**

## 実際の業務効果

顧客が実際に自己解決できるか、引継ぎ後の対応工数や重複質問、再問い合わせを含めても工数削減につながるかを確認します。280時間／月は現時点の条件付き試算です。

## 回答品質の維持

問い合わせや製品資料が変わっても、根拠に沿った自動回答と、専門判断が必要な案件の有人振り分けを維持できるか確認します。

## 運用負荷

資料の更新、利用状況の確認、有人対応に必要な作業量を把握し、顧客と担当者が無理なく利用を続けられるか確かめます。

この3点を踏まえ、本番適用の可否と範囲を判断します。方式設計と評価から得た知見は、[第12章：この事例から得た設計原則](/cases/customer-support-ai-dx/design-principles/)へ整理します。
