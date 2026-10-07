# AI業務設計の記事整理（2026-10-08）

authoring-guide.md、content-maintenance.mdと関連本文を監査。content-update-policy.mdは現在存在しない。旧配置のチェックアウトは変更せず、originのmasterを確認した作業領域で編集。

## 役割と判断

| 対象 | 主な問い | 判断 |
|---|---|---|
| 新記事 practices/ai-generation-and-work-completion | なぜ生成が速くても仕事は終わらないか | 新規独立記事。経験は既存Book第2章にも存在するため、未公開の新経験とは扱わない |
| Book 第1章 delegation-and-responsibility | 誰が責任を持ち、どの条件で人間へ戻すか | 確認コストとRisk別の確認・停止・移管条件を追加 |
| Book 第2章 evaluating-business-efficiency | AI導入効果をどの範囲・完成条件で比較するか | 同じ失敗談・仮例・図表化の詳述を新記事へ集約し、評価の要点に整理。URL・章順・タイトルは維持 |
| foundations/applicability-and-delegation | どこまで任せるべきか | Value / Risk / Verification / Correction / Recoveryの比較を追加 |
| Book 第4章 explainable-delegation | どの条件で任せないか | 説明可能でも検証負荷が大きければ範囲を縮める。費用モデルの詳述は委任設計記事へ |
| practices/ai-adoption-and-effective-use | 業務で使いこなすとは何を設計できることか | 定義と1段落だけ補強し、経験の詳述は新記事へ |

責任章 → 新記事 → 委任設計 → 総論の本文リンクを接続。Book第2章から新記事、責任章からHITL詳細、Book第4章から委任設計へも接続。

## 変更しない周辺本文

- evaluation-hitl/responsibility-and-hitl：既にReview Cost、遅延、Risk Tier、Escalationを扱う詳細設計。費用式や責任モデルを複製しない。
- evaluation-hitl/code-evaluation-acceptance：コードの採用基準・検証・監視が中心。文書レビューの失敗談へ広げない。
- software-engineering/code-generation-and-work-design：コード生成と設計判断の関係。今回のReviewability・合意形成の経験と問いを分ける。
- architecture/cost-latency-routing：モデル・Taskの処理経路と総費用。人間向け成果物の形式設計とは範囲が異なる。
- practices/adoption-governance：導入・定着・運用の改善。総論を重複追加しない。
- essays/rethink-work-before-ai：AI適用前の業務の要否。生成後の受け渡しとは問いが異なる。
- essays/ai-use-and-operation：技術と組織の速度差という原因分析。実務手順を追加しない。
- Book第3章 asking-versus-delegating：一般知識と組織固有Knowledgeへのアクセス。委任費用の主記事に置き換えない。

## 事実・保護範囲

設計レビューへ持ち込み、作成者の理解と読み手への表現が不足して手戻りになった経験は依頼文と既存第2章から確認。会議固有名・会社名・人名・製品名は載せない。60分対100分、生成5分・Review60分は説明用の仮例。実測の時間削減やROIは主張しない。総工数と経過時間を区別し、確認工程を二重計上しない。

公開本文へ編集事情やGit操作は記載しない。既存Lifecycle、公開URL、元公開日、source snapshotを維持。総論の復旧台帳は依頼された実質改訂として旧本文checksumと理由を記録し、元snapshotのchecksumは変更しない。以前の改訂記録も保持する。

Garden Notesは10月8日に1entry、新記事1件は新規公開、既存本文5件は改訂として独立リンク。Book入口・一覧の更新日は章改訂・新記事追加に合わせるだけで、別の変更項目にはしない。
