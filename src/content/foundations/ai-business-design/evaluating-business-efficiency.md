---
summary: "AI導入効果を、生成時間ではなく確認・修正・受け渡し・合意形成まで含めて評価する。総工数と業務完了までの経過時間を区別し、同じ品質・完成条件で比較する。"
layer: publication
title: 第2章　AI導入は効率化とは限らない
kind: principle
section: foundations
status: published
last_updated: "2026-10-08"
entry_points:
  - ai
  - dx
primaryCategory: business-transformation
secondaryCategories: []
tags: &a1
  - システム設計
  - 生成ai
  - aiエージェント
  - hitl
  - aiガバナンス
published_at: null
canonical: https://zenn.dev/nullcontroller/books/76ed12dcc7e5d7/view/62ecee
source:
  type: zenn
  original_type: chapter
  slug: 62ecee
  book_slug: 76ed12dcc7e5d7
  chapter_slug: 62ecee
  url: https://zenn.dev/nullcontroller/books/76ed12dcc7e5d7/view/62ecee
  published_at: null
  publication_month: 2026-08
  topics: *a1
  zenn_type: null
  metadata:
    title: 第2章　AI導入は効率化とは限らない
    free: false
series: ai-business-design
series_title: 『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』
order: 2
updated_at: "2026-10-08"
update_type: revised
---

## 生成ではなく、業務の完了までを評価する

AIが一つの工程を速くしても、人間の確認、修正、説明、合意形成が増えれば、仕事全体は速く終わるとは限りません。導入効果は、利用可能な成果が確定するまでを対象にします。

要件をAIでMarkdown化して設計レビューへ持ち込んだ際、私自身の理解と、読み手が判断できる形式への変換が不足して手戻りになりました。この経験と、その後の業務プロセスの見直しは[AIで速く作れても、仕事は速く終わらない](/practices/ai-generation-and-work-completion/)で詳しく扱っています。

## 比較する条件と工程を揃える

生成だけを従来の仕事全体と比べず、同じ品質・完成条件で比較します。

| 評価対象 | 確認すること |
|---|---|
| 総工数 | 生成、確認、修正、形式変換、説明、手戻り、合意形成、必要時の復旧 |
| 完了までの経過時間 | Review待ち、承認待ち、並行工程を含む開始から完了まで |
| 品質 | 欠落、不整合、誤り、次工程でのレビュー可能性 |
| 運用 | 更新、監視、例外対応を続けるための負担 |

確認とレビューが同じ作業なら二重に数えません。AIによって減った工程と新たに増えた工程を分け、確認者の作業量と待ち時間も記録します。仮の時間例は実測値と区別し、未測定の削減率を成果として扱いません。

## 評価を委任範囲へ戻す

確認や修正の負担が大きい場合、必要な承認を省くより、AIが生成する範囲を小さくする、根拠や差分を添える、人間向けの成果物へ変換する方法を見直します。必要なら既存の方法へ戻すことも選びます。

AI導入をツールの追加で終えず、後工程まで含めて設計し、その結果を評価することが重要です。価値・Risk・検証負荷から委任範囲を決める方法は[AI適用可否と委任レベルの設計](/foundations/applicability-and-delegation/)で扱っています。

次の[第3章　AIに聞くことと、AIに仕事を任せることは違う](/foundations/ai-business-design/asking-versus-delegating/)では、業務に必要なKnowledgeへアクセスできる条件を考えます。
