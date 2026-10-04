---
summary: "フォルダ・ファイル・クラスの役割をMarkdownで整理し、調査のための地図を作る。AIが構造の仮説を出し、人間がコードで検証する初動の進め方を示す。"
layer: publication
title: 第3章 調査の起点を作るため、ファイルとクラスの役割を整理する
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
canonical: https://zenn.dev/nullcontroller/books/db491398459cbc/view/147cdb
source:
  type: zenn
  original_type: chapter
  slug: 147cdb
  book_slug: db491398459cbc
  chapter_slug: 147cdb
  url: https://zenn.dev/nullcontroller/books/db491398459cbc/view/147cdb
  published_at: null
  publication_month: 2026-03
  topics: *a1
  zenn_type: null
  metadata:
    title: 第3章 プロジェクト構造の整理 ― 理解のための地図を作る
    free: false
series: system-understanding
series_title: 理解しにくいレガシーシステムを、変更判断できる状態へ変える
order: 3
---
## 読み始める場所を決める

プロジェクトを開いても、多数のファイルやフォルダが並ぶだけでは、重要な処理や未使用コードを区別できない。いきなりすべての実装を読むのではなく、まず所在と役割を俯瞰できる情報を作った。

フォルダ構成、ファイル一覧、クラスの役割、機能単位の分類をMarkdownへ整理した。軽量なテキストで構造を表せるため、後の調査で分かったことも更新しやすい。

## 名前から得られる仮説と、コード上の事実を分ける

構造情報をGPTへ渡し、ディレクトリ名や命名規則から役割の仮説を出させた。例えば、次のような構成なら、層ごとの分担を調べる起点になる。

```text
src/
api/
service/
repository/
config/
```

これは構成例であり、名前だけで実際の設計を確定できるわけではない。controller、service、repositoryという名称があっても、その責務は実コードで確認する必要がある。

AIは探索の候補を整理し、人間はコードで検証する。この順序により、仮説を完成した仕様と取り違えずに、どこから調べるかを絞れた。

## 地図に調査結果を戻す

この段階で得られるのは、プロジェクト全体の位置関係と、調査の起点である。各クラスの実際の処理、呼出し関係、未使用かどうかは、次のコード調査で確かめる。

位置と確認済みの役割を一つずつ対応させることで、調査結果が次の探索にも使える。次章では、作成した地図へ実装の意味を加える。
