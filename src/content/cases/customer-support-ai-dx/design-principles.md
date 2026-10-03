---
summary: "顧客サポートQAの設計から、価値起点、責任境界、Knowledge制御、停止条件、HITL、PoC、UX、継続評価の原則を抽出する。"
layer: publication
title: 10. この事例から得た設計原則
kind: case
section: cases
status: published
last_updated: "2026-09-28"
entry_points: [ai, dx]
dx_topic: case-study
tags: [Applied AI, DX, Design Principles, System Architecture]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 11
---

## 1. AIから始めず、価値と業務課題から始める

「RAGを使いたい」から用途を探すのではなく、顧客と担当者へ届けたい価値、変えたい業務、そのために必要なCapabilityの順で考えます。

## 2. 全自動化を目的にしない

自己解決へ移す問い合わせと、専門判断を必要とする問い合わせを分けます。自動化率を上げるために境界を越えないことが、品質と業務効果を両立させます。

## 3. AI・人間・既存システムの責任境界を設計する

AIは対話と根拠利用、人間は専門判断と例外対応、既存システムは事実と制約を保持します。生成、受理、実行を一つの処理へ混ぜません。

## 4. Semantic SimilarityだけでKnowledgeを選ばない

機種、版数、公開可否、分類、Provenanceを用いて、回答根拠として利用できる範囲を制御します。似ていることと、使ってよいことを分けます。

## 5. AIには停止条件が必要である

根拠不足、特定不能、専門判断、高影響、非公開情報、矛盾を停止条件として定義します。推測で処理を継続しないことも、システムの正常動作です。

## 6. HITLでは情報を失わずに引き継ぐ

会話履歴だけでなく、確認済みContext、根拠、未確認事項、停止理由を人間へ渡します。顧客にも引継ぎ済みであることを示します。

## 7. PoCではモデル性能より業務成立性を見る

Retrieval、Dialogue、Answerを分けて評価し、自己解決と有人移行を含むWorkflow全体が成立するかを確認します。

## 8. UXは利用者に内部構造を理解させない

自然な表現から始め、不足情報を一つずつ確認します。カテゴリ、専門用語、必要項目の判断を利用者へ押し付けません。

## 9. 導入後のEvaluation Loopまで設計する

誤回答、有人移行、文書不足、検索失敗、離脱を分類し、Knowledge、Retrieval、UI、業務へ改善を戻します。

## 10. 技術導入ではなく業務変革として評価する

AIを導入した事実ではなく、顧客の自己解決、人間の専門性、回答品質、待ち時間、運用負荷がどう変わったかを評価します。

```text
価値
  ↓
業務変化
  ↓
責任境界
  ↓
Knowledge / AI / UX
  ↓
評価と停止条件
  ↓
運用から再設計へ
```

この順序を保つことで、利用するモデルや検索技術が変わっても、設計判断を再利用できます。

## 次に読む

- [生成AIを業務へ組み込む設計原則](/Rosarium/foundations/ai-business-design/)
- [AI出力の責任境界とHITL](/Rosarium/evaluation-hitl/responsibility-and-hitl/)
- [AI評価データセットと回帰評価設計](/Rosarium/evaluation-hitl/datasets-and-regression/)
- [DXを価値・業務・システムの変化から考える](/Rosarium/dx/)

