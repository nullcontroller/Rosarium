---
summary: "異常系を網羅しようとすれば、再試行や自動修復を含む多くの実装が考えられる。しかし、今回の目的は既存ソフトウェアの暗号方式変更であり、正常系を全面的に作り直すことではなかった。発生頻度、工数、安全性、変更範囲、保守性、アプリケーショ"
layer: publication
title: 第2章　異常系の構造を整理し、設計方針を確定する
kind: case
section: cases
status: published
last_updated: "2026-10-04"
tags: &a1
  - ソフトウェア設計
  - 生成ai
  - オーケストレーション
  - hitl
  - 保守開発
published_at: null
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/e68b04
source:
  type: zenn
  original_type: chapter
  slug: e68b04
  book_slug: b9a9feaefb4001
  chapter_slug: e68b04
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/e68b04
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第2章　異常系の構造を整理し、設計方針を確定する
    free: false
series: three-ai-maintenance
series_title: 複数AIを使い分けるレガシー保守
order: 2
---

## 保守の制約を先に決める

異常系を網羅しようとすれば、再試行や自動修復を含む多くの実装が考えられる。

しかし、今回の目的は既存ソフトウェアの暗号方式変更であり、正常系を全面的に作り直すことではなかった。発生頻度、工数、安全性、変更範囲、保守性、アプリケーションが担う責務を前提として整理した。

仕様検討には、一つのAIだけを使わなかった。コード上の影響はGitHub Copilot、設計上の選択肢はGPT、過去資料や背景はMicrosoft 365 Copilotが参照する情報に違いがある。一つの変更についても、それぞれのContextを必要に応じて確認し、人間が統合して判断した。

<div data-case-diagram="maintenance-policy-choice"></div>

## 復旧機能を増やすより、不正な状態で進ませない

GPTで個別の復旧方法を検討したが、低頻度の異常に対して修復処理を増やすと、検証と保守の対象も増える。異常の原因を区別することと、原因ごとに自動復旧を実装することは分けて考えた。

資格情報を安全に使えない場合は処理を止め、利用者へ再インストールを案内する方針を採った。UIの表示位置のような低影響の値とは扱いを分け、外部連携へ不正な値を渡さないことを優先した。

## アプリケーションで直す範囲を限定する

OSやユーザープロファイルに関わる問題まで、アプリケーションが修復する構成にはしなかった。アプリケーションの責務は異常を検出し、危険な後続処理を止めるところまでとした。

この方針はAIの回答で確定したわけではない。安全性・工数・保守性を人間が比較し、上司のレビューを受けて組織の設計方針として確認した。その後、コード上のどこへ対応を入れるかを調査した。
