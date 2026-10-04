---
summary: "承認済み仕様を基に、GitHub Copilotへ処理全体の構造や関数間の関係、必要なUI情報を共有した。関数だけを切り出すと、入力の前提や後続処理への影響が抜けやすい。ただし、情報を渡したことをもってAIが全体を完全に理解したと"
layer: publication
title: 第6章　全体像を共有しながら、コード生成と単体テストを進める
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
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/147fb6
source:
  type: zenn
  original_type: chapter
  slug: 147fb6
  book_slug: b9a9feaefb4001
  chapter_slug: 147fb6
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/147fb6
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第6章　全体像を共有しながら、コード生成と単体テストを進める
    free: false
series: three-ai-maintenance
series_title: 仕様調査から実装まで、複数AIを役割分担したレガシー保守
order: 6
---

## 全体像を共有してから、関数単位へ分ける

承認済み仕様を基に、GitHub Copilotへ処理全体の構造や関数間の関係、必要なUI情報を共有した。関数だけを切り出すと、入力の前提や後続処理への影響が抜けやすい。ただし、情報を渡したことをもってAIが全体を完全に理解したとは扱わなかった。

<div data-case-diagram="maintenance-implementation-cycle"></div>

## 最小限の修正案を、人間が確認する

対象関数の役割と追加するエラー条件を確認し、関数単位で修正案を生成した。人間がコードをレビューし、ビルドと単体テストで確認してから次の関数へ進んだ。問題があれば修正案を見直し、再生成したコードも再度レビュー・試験した。

今回の目的に関係しないリファクタリング、名前の変更、依存関係の変更は広げなかった。正常系を維持し、異常時に必要な位置で止まることを、変更範囲を限定する基準にした。

## テストの期待結果は、仕様から人間が確かめる

APIの成功・失敗、レジストリ値がない場合、既存の正常動作などを確認した。AIに試験案を出させても、その期待結果が承認済み仕様と合っているかは人間が確認する。コードが生成できたことと、変更を採用できることは分けて扱った。

この反復により、異常系への対応を実装しながら、既存動作への影響と修正範囲を確認した。
