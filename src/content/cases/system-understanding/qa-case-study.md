---
summary: "対象となる約3万行のC#業務アプリケーションの状況を整理する。不要コード・連携責務・処理フロー・設計意図が分かりにくい問題から、仕様と知識を復元する必要性を示す。"
layer: publication
title: 第2章 対象システムの変更を妨げる構造と知識の不足を整理する
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
published_at: "2026-03"
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/4f03c8
source:
  type: zenn
  original_type: chapter
  slug: 4f03c8
  book_slug: db491398459cbc
  chapter_slug: 4f03c8
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/4f03c8
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第2章 実践事例 ― QAチャットによる構造理解と意思決定の高速化
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 2
---
## 変更の前に、使われている処理と責務を把握する

対象はWindows上で動く、約3万行のC#業務アプリケーションだった。単体で完結せず、他システムとも連携していた。長年の改修で、廃止機能のコード、呼び出されない関数、参照されない処理が残り、どこが現在も使われているか分かりにくかった。

処理フローや連携先との責任範囲も俯瞰できない。改修履歴は局所的な変更が中心で、影響範囲が分からないことが、大きな変更を進めにくくしていた。

## 不足していたのはコードではなく、対応関係だった

実装は存在しているが、どの機能を担い、どの条件で動き、他システムへ何を渡すかが共有されていなかった。設計意図や過去の判断理由も、現担当者が参照できる形には揃っていない。

そこで、ソースコードから構造・振る舞い・責任を抽出し、UI、実動作、既存資料、担当者の知識と照合する方針とした。資料が不足している部分を、AIの推測だけで埋めることはしない。

調査対象をこのように捉えると、古いコードを新しい技術へ置き換える前に、何を調べ、何を維持するかを説明できる。次章では、ファイルとクラスの位置から調査を始められるよう、プロジェクトの地図を作る。
