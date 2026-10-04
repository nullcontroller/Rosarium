---
summary: "仕様や運用環境の変化に合わせ、RAG・人間向け資料・UI操作手順を更新する方法を整理する。古い情報による誤案内を防ぎ、継続的に正しい状態を維持する運用を考える。"
layer: publication
title: 第11章 仕様変更に追従できるKnowledge更新フローを作る
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
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/6dcbe1
source:
  type: zenn
  original_type: chapter
  slug: 6dcbe1
  book_slug: db491398459cbc
  chapter_slug: 6dcbe1
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/6dcbe1
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第11章 QAシステムの運用設計 ― 品質を維持するための更新プロセス
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 11
---
## 昨日正しかった情報も、現行仕様とは限らない

セキュリティ要件、外部システムの仕様、運用環境が変われば、過去に正しかった説明も現行の根拠ではなくなる。廃止機能の案内や旧仕様の設定を自然に答えてしまう状態は、誤回答と同じ問題を持つ。

そこで、RAGの構造化知識だけでなく、人向け資料とUI操作手順も更新対象にした。検索用の説明だけを直し、図や手順に古い情報を残す構成にはしなかった。

## 変更を、関連する資料へ戻す

更新の流れは、変更の発生、影響範囲の特定、該当データの修正、QAチャットでの確認、必要に応じた再評価とした。変更箇所を単独で扱わず、関連する知識と操作への影響を確認するための手順である。

人向けには画像付き手順書、操作説明、FAQを整備し、「何かあったときに何をするか」も残した。当時使用したプロンプト集も、目的ごとに再利用できる形へ整理した。

## 回答に適した情報と、資料で確認する情報を分ける

QAには、非構造データを直接回答するのではなく、人向け資料へ誘導する挙動を持たせた。すべての情報をチャットの回答だけで完結させず、確認に適した表現へ戻れるようにした。

この章が扱うのは情報を更新するための設計と手順である。新しい自動更新システムや、長期運用の測定値を追加して示すものではない。次章では、復元した知識を実際の暗号処理の調査へ利用した場面を振り返る。
