---
summary: "処理を止める条件と責務を決めた後、GitHub Copilotで関連コードを探索した。文字列の一致だけではなく、暗号化・復号、レジストリの保存・読出し、値の利用先という意味から、呼出し関係と変更影響の候補を調べた。"
layer: publication
title: 第3章 コード探索と人間の確認で、変更箇所と実現方法を絞る
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
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/49e444
source:
  type: zenn
  original_type: chapter
  slug: "49e444"
  book_slug: b9a9feaefb4001
  chapter_slug: "49e444"
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/49e444
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第3章　GitHub Copilotと人間で実現方法を具体化する
    free: false
series: three-ai-maintenance
series_title: 仕様調査から実装まで、複数AIを役割分担したレガシー保守
order: 3
---

## 確定した方針から、変更箇所を探す

処理を止める条件と責務を決めた後、GitHub Copilotで関連コードを探索した。文字列の一致だけではなく、暗号化・復号、レジストリの保存・読出し、値の利用先という意味から、呼出し関係と変更影響の候補を調べた。

<div data-case-diagram="maintenance-code-investigation"></div>

AIが挙げた箇所は調査候補であり、そのまま修正対象ではない。前後の処理、到達条件、実行順序、値の用途、運用条件、外部連携への影響を人間が確認し、今回の変更に関係するものを絞った。

## コード上の粗さと、今回直すべき問題を分ける

コードだけを見れば問題に見える箇所でも、前段の処理や運用条件によって実際には問題にならない場合がある。AIの指摘をすべて取り込むのではなく、実運用で影響が生じるかを確認した。今回の目的に関係しない整理や改修は対象から外した。

<div data-case-diagram="maintenance-change-scope"></div>

AIの回答が食い違った場合も、製品の信頼順位を固定しなかった。コード上の事実にはコード全体を参照できるGitHub Copilot、設計の検討にはGPT、過去経緯にはMicrosoft 365 Copilotを重視し、問いとContextの一致度を基準に材料を選んだ。採否は人間が決めた。

## 正常動作を保ちながら、異常時の停止を具体化する

APIの戻り値を確認し、復号に失敗した値を使わず、必要な位置で後続処理を停止する構成へ絞った。利用者への復旧案内、OS側の問題との責務分界も、先に確認した方針へ合わせた。

関連箇所が分かったからといって、全体の設計を変える必要はない。正常系への変更を最小限にし、必要なエラー処理を追加する方法を具体化した。
