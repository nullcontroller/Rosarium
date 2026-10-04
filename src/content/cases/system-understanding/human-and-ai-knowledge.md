---
summary: "人がシステムの全体像を理解する図と、AIが必要な根拠を探す資料を分けます。図とMarkdownを使い、文脈を残しながら、RAGが取得する情報の範囲を整理します。"
layer: publication
title: 第6章 人が読む仕様とAIが使うKnowledgeを分ける
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
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/720ca8
source:
  type: zenn
  original_type: chapter
  slug: 720ca8
  book_slug: db491398459cbc
  chapter_slug: 720ca8
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/720ca8
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第6章 人間用とAI用の分離設計 ― 図とMarkdownの役割分担
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 6
---
## 確認した仕様を、誰がどう使うか

復元した構造とフローを、そのまま一つの資料形式ですべての用途へ使うことは難しかった。人が全体を理解するときには図や関係性が役立つ。

一方、QAチャットには質問に必要な条件や例外を検索し、回答へ渡せる文書が必要になる。

この事例では、人向けには構造や流れを示す視覚情報を、AI向けにはMarkdownを中心とするKnowledgeを用意した。別々の仕様を作るのではなく、確認した同じ仕様情報について、利用主体に適した表現を選ぶ分離である。

<div data-case-diagram="legacy-information-views"></div>

## 図の役割と、検索対象の役割を混ぜない

処理構造の図は流れ・分岐・関係を俯瞰するために使った。しかし、図の構造だけでは、自然言語の問いに必要な情報を意味単位で取り出し、回答文へ使う用途に合わせにくい。

Markdownでは条件、例外、詳細情報を文書として整理し、検索対象にした。図で全体を確認する用途と、文書から根拠を取得する用途を、一つの形式へ無理に押し込まなかった。

| 利用する側 | 用意した表現 | 確認すること |
|---|---|---|
| 人間 | 構造・フローの図と説明 | 全体構造、処理の順序、関係 |
| AI / QA | 構造化したMarkdown | 質問に必要な条件、例外、詳細 |

## 分離するのは表現であり、仕様そのものではない

同じ説明を大量に複製することは目的ではない。人向けの図と検索用文書が異なる現行仕様を表してしまえば、理解や回答の根拠が崩れる。

この分担によって、人は全体を確認し、AIは必要な知識を取得できる構成へ整理した。AIが図や文脈を一切扱えないという一般論ではなく、このQAで必要な取得単位と、人の理解しやすさを両立させるための選択だった。

次章では、内部の知識をUI操作と接続し、利用者の問いから現行の処理へ到達できるようにする。
