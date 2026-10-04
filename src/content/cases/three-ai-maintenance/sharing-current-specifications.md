---
summary: "Excel仕様書のレビューで現行仕様の認識違いが見つかった。Microsoft 365 Copilotへ各行を説明し直すだけでは、処理の前後関係まで伝えるやり取りが増える。そこで、コードを参照できるGitHub Copilotで必"
layer: publication
title: 第5章　確認した現行仕様をAI間で渡し、仕様書へ反映する
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
canonical: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/b2b1c6
source:
  type: zenn
  original_type: chapter
  slug: b2b1c6
  book_slug: b9a9feaefb4001
  chapter_slug: b2b1c6
  url: https://zenn.dev/nullcontroller/books/b9a9feaefb4001/view/b2b1c6
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第5章　AI間で現在の仕様を受け渡し、Excel仕様書を修正する
    free: false
series: three-ai-maintenance
series_title: 仕様調査から実装まで、複数AIを役割分担したレガシー保守
order: 5
---

## 表の認識違いを、コードへ戻って確認する

Excel仕様書のレビューで現行仕様の認識違いが見つかった。Microsoft 365 Copilotへ各行を説明し直すだけでは、処理の前後関係まで伝えるやり取りが増える。

そこで、コードを参照できるGitHub Copilotで必要な情報を整理し、GPTで動的な処理構造として表現した。

<div data-case-diagram="maintenance-reviewed-handoff"></div>

## 処理順序と分岐を、確認できる形へ変える

整理したのは、処理の開始条件、関数・モジュール間の呼出し順序、レジストリの保存・読出し、暗号化・復号API、正常系と異常系の分岐、エラー後の停止位置、外部連携までの流れである。

図を通して、表の各行を処理全体のどこへ位置づけるかを確認した。

GPTによる構造化の前には、コード調査から作ったプロンプトを人間が確認した。生成した処理構造も実コードと照合し、誤りがあれば修正した。コードを参照できないAIの説明を、コード上の事実として確定することはしなかった。

## 確認済みの前提だけを、次のAIへ渡す

確認した処理構造をMicrosoft 365 Copilotへ渡し、Excel仕様書へ反映させた。読出し・復号のタイミング、呼出し関係、分岐条件、停止位置、連携条件を修正した後、人間がコード・処理構造・設計方針との整合を再度レビューした。

AI Aの出力をAI Bへ自動投入する方式は採らなかった。人間が確認し、必要なら修正してから次へ渡すことで、誤った前提の連鎖を防ぎ、中間成果物と判断の変化を追えるようにした。

ここで受け渡したのは、未確認の回答ではなく、次の問いに必要な確認済みの情報である。

## 仕様を承認し、実装の前提を揃える

修正した仕様書は組織のサブ審議へ提出し、承認を受けた。AI間で形式を変換する工程と、組織として仕様を確定する工程は別である。レビューと承認を経た仕様を、次のコード修正と単体テストの前提にした。
