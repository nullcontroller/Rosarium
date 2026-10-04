---
summary: "評価で見つかった誤情報・根拠不足・粒度の不統一・不完全データを修正する。Knowledgeの改善と再評価を繰り返し、回答の一貫性と信頼性を高める過程を示す。"
layer: publication
title: 第10章 評価結果をKnowledgeと回答範囲の改善へ戻す
kind: case
section: cases
status: published
lifecycle: obsolete
lifecycle_reason: "旧AI環境下のレガシーシステム理解事例の一章です。当時はGPT-4のみを利用しており、コードベース全体を十分に参照できない制約がありました。現在の推奨手順ではなく、当時の設計判断の記録として残しています。"
last_updated: "2026-10-04"
tags: &a1
  - ai
  - 設計
  - リファクタリング
  - レガシー
  - rag
published_at: null
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/28501b
source:
  type: zenn
  original_type: chapter
  slug: 28501b
  book_slug: db491398459cbc
  chapter_slug: 28501b
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/28501b
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第10章 RAGの改善設計 ― 評価結果に基づく品質向上
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 10
---
## 回答だけを直しても、同じ根拠から誤りが繰り返される

評価で見つかったのは、誤った事実、根拠の未記載、記述粒度のばらつき、不完全な情報に基づく推測だった。出力の文章を直すだけでは、検索される知識の問題が残る。

そのため、該当するRAGデータへ戻り、実装と異なる説明を修正した。参照元を明確にし、出典を回答へ結び付け、同じ粒度で情報を揃えた。根拠のない情報や推測に基づく不完全な記述は削除した。

## 修正後も、同じ観点で回答を確認する

改善は一度の作業では終わらせず、評価で問題を特定し、データを修正し、再評価するサイクルで進めた。構造化されていることと、内容が正しいことを区別し、検索対象と回答の両方を確認した。

この過程で誤答を減らし、回答の一貫性と信頼性を高めていった。ここでは既存の定性的な改善を述べており、新たな精度や削減率は示さない。

修正した状態も、仕様変更に追従しなければ古くなる。次章では、Knowledge、人向け資料、操作手順を合わせて更新する流れを扱う。
