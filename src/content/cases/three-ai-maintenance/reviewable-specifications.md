---
summary: "設計方針、GPTとの検討、コード調査、人間が確認した事実は、別々の場所にあった。実装前に、現行仕様と変更後仕様、異常条件、処理内容、影響範囲を同じ基準でレビューできるようにする必要があった。"
layer: publication
title: 第4章　分散した検討結果を、レビュー可能な仕様書へ集約する
kind: case
section: cases
status: published
last_updated: "2026-09-28"
tags: &a1
  - ソフトウェア設計
  - 生成ai
  - オーケストレーション
  - hitl
  - 保守開発
published_at: null
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/40f445
source:
  type: zenn
  original_type: chapter
  slug: 40f445
  book_slug: b9a9feaefb4001
  chapter_slug: 40f445
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/40f445
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第4章　Microsoft 365 Copilotでレビュー可能な仕様書へ変換する
    free: false
series: three-ai-maintenance
series_title: 仕様調査から実装まで、複数AIを役割分担したレガシー保守
order: 4
---

## 分散した検討結果を、同じ項目で確認できる形にする

設計方針、GPTとの検討、コード調査、人間が確認した事実は、別々の場所にあった。実装前に、現行仕様と変更後仕様、異常条件、処理内容、影響範囲を同じ基準でレビューできるようにする必要があった。

そこで、保守の前提、承認済みの方針、調査結果、採用する実現方法をMicrosoft 365 Copilotへ渡し、Excel仕様書へ集約した。

<div data-case-diagram="maintenance-specification-review"></div>

## 仕様書には、動作だけでなく判断の根拠も残す

現行・変更後の正常系と異常系、停止条件、利用者の復旧方法、変更範囲、判断理由、試験観点を整理した。処理順序、呼出し関係、読出し・復号のタイミング、外部連携へ進む条件も確認対象にした。

Excelへ並べたことで、検討時には見えにくかった認識の違いも確認できた。

ただし、表に整っていることは、仕様が正しいことを意味しない。コード上の事実、設計方針、承認した内容との整合を人間がレビューした。

## 誤りを見つけたら、表の修正より先に現行仕様へ戻る

確認では、正常動作を変えていないか、異常時の対応に過不足がないか、影響範囲と試験観点が対応しているかを見た。Excelの認識が現行コードと違う箇所は、その行だけを直すのではなく、処理全体の関係を確認し直す対象とした。

次の工程では、コードを参照できるAIから情報を取り出し、処理構造として確認した内容を文書を扱うAIへ渡して、仕様書へ反映する。
