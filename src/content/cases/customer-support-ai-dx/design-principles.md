---
summary: "第1回PoCの課題をRAG管理システムの設計へつなぎ、第2回PoCで目標を達成した事例から、データ管理と人間による判断の役割を整理します。"
layer: publication
title: 11. この事例から得た設計判断
kind: case
section: cases
status: published
last_updated: "2026-10-19"
entry_points: [ai, dx]
primaryCategory: business-transformation
secondaryCategories: []
tags: [Applied AI, DX, Design Principles, System Architecture]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 11
---

<a id="1-aiから始めず価値と業務課題から始める" aria-hidden="true"></a>
<a id="10-技術導入ではなく業務変革として評価する" aria-hidden="true"></a>
<a id="2-全自動化を目的にしない" aria-hidden="true"></a>
<a id="3-aiqaシステム人間knowledgeの責任を分ける" aria-hidden="true"></a>
<a id="3-aiqaシステム人間参照資料の責任を分ける" aria-hidden="true"></a>
<a id="3-ai人間既存システムの責任境界を設計する" aria-hidden="true"></a>
<a id="4-semantic-similarityだけでknowledgeを選ばない" aria-hidden="true"></a>
<a id="4-意味の近さだけで回答根拠を選ばない" aria-hidden="true"></a>
<a id="5-aiには停止条件が必要である" aria-hidden="true"></a>
<a id="6-hitlでは情報を失わずに引き継ぐ" aria-hidden="true"></a>
<a id="6-人間へ判断を委ねるときも情報を引き継ぐ" aria-hidden="true"></a>
<a id="7-フィージビリティ確認と業務上の評価を分ける" aria-hidden="true"></a>
<a id="8-uxは利用者に内部構造を理解させない" aria-hidden="true"></a>
<a id="8-利用者に内部構造の理解を求めない" aria-hidden="true"></a>
<a id="9-導入後のevaluation-loopまで設計する" aria-hidden="true"></a>
<a id="9-評価で見つかった問題を方式改善へ戻す" aria-hidden="true"></a>

## 11.1 意味の近さと適用条件を分ける

同じ症状が書かれた文書でも、製品・版数・利用環境が違えば適用できません。意味検索の順位だけに判断を任せず、適用条件を検索前に扱うことが重要でした。

## 11.2 検索品質をデータ管理基盤から支える

検索条件を設定しても、原本と属性の対応が崩れていれば適合する根拠を選べません。RAG管理システムを新規構築し、原本管理・検索用データ管理・顧客向け対話を分けることが、この事例の設計判断です。

節単位の適用範囲を管理し、属性候補を担当者がレビュー・修正・承認する境界を置くことで、検索に使う情報の確定責任を明確にしました。

## 11.3 検索対象制御と回答許可を分ける

意味が近いこと、根拠として適合すること、自動回答が許されることは異なります。条件を満たす定型問い合わせは自動回答し、人間が資料・回答候補の採否を判断する案件はCS部へ渡す責任分担です。

AIは不足情報の追加質問や回答候補の生成を担い、システムは条件と状態を保持し、人間は業務上の採否を判断します。有人対応へは、確認済み事項・根拠・未確認事項・停止理由を引き継ぎます。

<a id="114-pocの確認範囲と本番適用を分ける" aria-hidden="true"></a>

## 11.4 PoCの結果から設計判断を評価する

第1回PoCでは絞込み前の方式を評価し、回答正答率72％を確認しました。RAG管理システムの新規設計・構築と節単位のメタデータ整備を経て、第2回PoCで96％を確認しました。第2回PoCの回答正答率96％は、今回評価した範囲の値です。検索文書だけの適合率や、自動回答率、本番での回答品質を代表するものではありません。

評価件数や他工程の見積もり、自己解決と対応工数の試算を、検索の確認値へ混在させないことも重要です。

<a id="115-本番適用前に残る課題" aria-hidden="true"></a>

詳しい評価の考え方は[QAチャット評価設計思想](/evaluation-hitl/qa-evaluation/)、情報境界は[生成AIセキュリティと脅威モデリング](/architecture/security-threat-modeling/)へ接続します。

第1回PoCで見つかった課題を、RAG管理システムとメタデータによる検索対象制御へつなげ、第2回PoCで設定した目標を達成しました。
