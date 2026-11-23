---
summary: "第1回PoCで回答正答率72％を確認。意味的には近くても製品・版数・利用環境が異なる文書を取得する問題を、検索用データの管理方式から見直します。"
layer: publication
title: 07. 第1回PoCの課題分析
kind: case
section: cases
status: published
last_updated: "2026-10-19"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [system-transformation]
tags: [PoC, AI Evaluation, RAG, 業務成立性]
published_at: "2026-10-19"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 7
---

<a id="071-開発したqaシステムを評価する" aria-hidden="true"></a>
<a id="072-評価条件と判定基準" aria-hidden="true"></a>
<a id="073-誤検索と誤自動回答を別の問題として捉える" aria-hidden="true"></a>
<a id="074-検索対象と回答許可の制御が必要と判断する" aria-hidden="true"></a>
<a id="実際の評価に先立ち確定すること" aria-hidden="true"></a>
<a id="評価指標を読み分ける" aria-hidden="true"></a>

<a id="071-検索品質の初回評価で72を確認した" aria-hidden="true"></a>

## 07.1 第1回PoCで72％を確認した

[第04章](/cases/customer-support-ai-dx/poc-evaluation/)と同じ第1回PoCで確認した検索品質の課題を詳しく分析します。メタデータによる絞込み前の方式を評価した結果、回答正答率は72％でした。検索結果が質問に関連するだけでなく、その顧客の製品・版数・利用環境に適用できる根拠を取得できるかが課題でした。

ここでの72％は第1回PoCの回答正答率です。検索結果だけの適合率や、本番運用の成果を示すものではありません。

## 07.2 意味的な関連性と業務上の適合性が異なる

ベクトル検索は、問い合わせと意味的に近い文書を探せます。しかし、似た症状や手順が書かれていても、別の製品・版数・利用環境の文書を、その顧客への回答根拠にはできません。

| 確認すること | この事例での違い |
| --- | --- |
| 意味的な関連性 | 問い合わせと文書の内容が近いか |
| 業務上の適合性 | 対象製品・版数・利用環境に使える文書か |
| 自動回答の許可 | 適合する根拠があっても、人間の専門判断を要しないか |

初期方式は製品仕様書・FAQ・障害情報を登録する段階にとどまり、対象条件を統一して管理する仕組みが十分ではありませんでした。類似度の調整だけで、文書の適用条件そのものを補うことはできません。

<div data-case-diagram="support-poc-evaluation"></div>

<a id="074-他の指標と測定範囲を分ける" aria-hidden="true"></a>

## 07.3 プロンプト調整からデータ管理の課題へ捉え直す

誤検索への対策を、指示文の修正だけに限定しませんでした。必要なのは、原本のどの節がどの製品・版数・環境に適用できるかを管理し、その条件を検索に使える形へ反映することです。

そこで、既存の製品情報システムとは責務を分けたRAG管理システムを新規設計・構築しました。管理したメタデータを使って検索対象を限定する経緯を、第08・09章で説明します。改善後の結果は[第10章](/cases/customer-support-ai-dx/poc-metadata-improvement/)で扱います。
