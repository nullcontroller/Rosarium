---
summary: "クラスやモジュールの構造に加え、順序・分岐・呼出し関係を図で可視化する。代表的なフローを抽出し、動きと変更影響を人間が把握できる状態にする。"
layer: publication
title: 第5章 処理の流れを復元し、変更影響を追えるようにする
kind: case
section: cases
status: published
last_updated: "2026-10-04"
tags: &a1
  - ai
  - 設計
  - リファクタリング
  - レガシー
  - rag
published_at: null
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/cf471a
source:
  type: zenn
  original_type: chapter
  slug: cf471a
  book_slug: db491398459cbc
  chapter_slug: cf471a
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/cf471a
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第5章 処理フローの可視化 ― 処理構造の図による動きの再構築
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 5
---
## 要素の一覧だけでは、変更の影響を追えない

クラスやモジュールの役割を把握しても、どの順番で呼ばれ、条件によってどこへ分岐するかは別に確認しなければならない。文章だけで順序・分岐・呼出し関係を説明すると、読み手が頭の中で全体を組み立てる負担が残る。

そこで、確認した処理フローや要素間・システム間の関係、運用手順をUMLで可視化した。図で理解できることに加え、変更のたびに手作業で描き直さずに更新できることも必要だったため、テキストから生成・更新できる処理構造の図を使った。

## 一つの巨大な図ではなく、確認できる単位に分ける

すべての処理を一枚へ詰めると、関係を示しても読み取れない。理解に必要なユースケース単位で分け、代表的なメインフローに分岐・例外処理・呼出し関係を加えた。

起動方法ごとの前処理、共通のコア処理、出力処理も分離した。同じ処理と開始条件による差分を区別することで、何が共通で、どこが変わるかを確認できる。

<div data-case-diagram="legacy-process-structure"></div>

## 確認した動きを、更新できる情報として残す

コードから復元した構造へ、実行順序と分岐を加えたことで、局所的な説明を処理全体の流れへ接続できた。処理構造の図は見た目のためではなく、その流れを確認し、後の変更に合わせて修正するための表現だった。

ただし、人が読む図と、質問に必要な根拠を検索する資料では使い方が異なる。次章では、確認した仕様をそれぞれの利用方法に合う形へ分ける。
