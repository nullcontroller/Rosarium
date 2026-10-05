---
summary: "CRA対応をきっかけに、長年使ってきた暗号方式をCNG・DPAPIへ変更することになった。既存の方式はMD5を内部で用いていたが、変更の対象はAPIの呼び替えだけではない。新しいAPIでは失敗を返すため、保存・読出し・復号の各段階"
layer: publication
title: 第1章 暗号方式の変更で見直すべき異常系を特定する
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
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/c90225
source:
  type: zenn
  original_type: chapter
  slug: c90225
  book_slug: b9a9feaefb4001
  chapter_slug: c90225
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/c90225
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第1章　暗号方式の変更によって顕在化した異常系
    free: false
series: three-ai-maintenance
series_title: 複数AIを使い分けるレガシー保守
order: 1
---

## 暗号方式の変更は、エラー処理の見直しでもあった

CRA対応をきっかけに、長年使ってきた暗号方式をCNG・DPAPIへ変更することになった。既存の方式はMD5を内部で用いていたが、変更の対象はAPIの呼び替えだけではない。

新しいAPIでは失敗を返すため、保存・読出し・復号の各段階で、失敗後の処理を決める必要があった。

パスワードは、保存時には平文から暗号化してレジストリへ保存し、利用時には読み出して復号し、外部処理へ渡す。どの時点で値が不正になったかによって、後続の処理へ与える影響が異なる。

<div data-case-diagram="maintenance-password-flow"></div>

## エラーの発生箇所と、値が使われる先を合わせて調べる

暗号化APIの失敗、レジストリへの保存失敗、値の欠落・破損・読出し失敗、復号APIの失敗を区別した。特に復号に失敗した値を外部連携で利用すれば、誤った処理や課金へつながるリスクがある。

これは発生した事故の記録ではなく、変更前に検討した影響である。

<div data-case-diagram="maintenance-error-points"></div>

同じレジストリでも、UIの表示位置と暗号化パスワードでは重要度が異なる。表示位置は初期値へ戻せる場合があるが、連携に使う資格情報を推測で補って処理を続けることはできない。

保存場所を基準に一律の復旧方法を決めず、値の用途を基準に停止・復旧を検討した。

<div data-case-diagram="maintenance-data-criticality"></div>

## 呼出しのタイミングを調べ、変更範囲を決める

読出し・復号は起動時だけに実行されるわけではない。特定機能の実行や外部連携の前、設定変更時の暗号化・保存も確認対象になる。APIの呼出し箇所だけでなく、その後に値を使う処理まで追い、エラーを検出する位置と止める位置を対応させた。

<div data-case-diagram="maintenance-call-timings"></div>

この調査によって、正常処理を大きく変えずに、どの異常系へ対応すべきかを検討する土台を作った。次の段階では、個別の自動復旧を増やすか、安全に停止させるかを比較する。
