---
summary: "内部構造の知識をUI操作と結び付け、操作・実行処理・結果の対応を整理する。利用者が機能へ到達し、操作結果を理解できる状態へ知識をつなぐ。"
layer: publication
title: 第7章 UI操作と内部処理を結び付け、操作結果を追えるようにする
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
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/7da717
source:
  type: zenn
  original_type: chapter
  slug: 7da717
  book_slug: db491398459cbc
  chapter_slug: 7da717
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/7da717
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第7章 UIと内部構造の接続 ― 利用可能な状態への変換
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 7
---
## 利用者の問いは、クラス名から始まらない

内部構造を整理しても、利用者が知りたいのは「何を操作すると、何が起きるか」である。クラスやモジュールの説明だけでは、画面上の操作から必要な情報へ到達しにくい。

そこで、UI操作、内部で実行される処理、結果の対応を整理した。操作から処理を追い、処理から対応する操作を確認できるようにし、内部視点と利用者の視点をつないだ。

<div data-case-diagram="legacy-ui-internals"></div>

## 操作を起点に、処理と結果を確認する

操作と内部構造の対応をKnowledgeへ組み込み、RAGで参照できる形にした。利用者が内部の名称を知らなくても、操作に関する質問から、何が実行されるかを探せる構成である。

UIの画面説明だけを増やす方法では、内部処理との関係が残らない。逆に、内部構造だけを示しても、利用者が機能へ到達できない。両者を接続したことで、操作と結果を理解するための調査に使えるようになった。

次章では、この対応をQAで利用するため、知識の粒度と回答範囲を調整する。
