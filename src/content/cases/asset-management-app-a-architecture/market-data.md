---
title: "03. 資産価格の取得方式"
summary: "場中取得を費用・保守負担から見送り、公表価格を採用する。17時の取得失敗と確認時点の要求から夜間処理へ変更した経緯を説明する。"
layer: "publication"
kind: "case"
section: "cases"
case_context: "personal"
case_specialty: "システム方式設計・システムアーキテクチャ"
status: "published"
public: true
lifecycle: "active"
published_at: "2026-11-28"
last_updated: "2026-11-28"
entry_points: ["ai"]
tags: ["個人開発", "システム方式設計", "運用設計"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 3
---

## この章の問い

必要な価格を取得するために、費用・保守負担と確認する時点をどう決めたか。

## 場中取得を見送り、相場終了後の価格を採用する

当初は場中価格の取得を検討した。私が検討した手段と要求の範囲では有料APIが必要であり、場中更新を続けるための保守負担も増えると考えた。

一方、無料で利用できる手段では相場終了後の株価を取得できた。そこで、追加費用と日常の保守負担を抑える方針に合わせ、場中取得を見送り、相場終了後の価格を採用した。資産評価には終値、投資信託等の基準価額、参考為替を利用する。

## 17時の取得から夜間処理へ変更する

当初は17時に価格を取得していたが、取得失敗が多かった。私は相場終了直後に資産額を確認する必要性を感じていなかったため、取得を急ぐ条件を見直し、夜間処理へ変更した。現行の設定は毎日04:00（日本時間）である。

場中取得の見送りは費用と保守負担の判断であり、17時から夜間への変更は、実際の取得状況と必要な確認時点を踏まえた運用の判断である。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/price-decision-light.svg" alt="場中取得の費用を踏まえて公表値を採用し、17時の失敗と利用要求の再評価から夜間処理へ変更した。" width="480" height="600" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/price-decision-dark.svg" alt="場中取得の費用を踏まえて公表値を採用し、17時の失敗と利用要求の再評価から夜間処理へ変更した。" width="480" height="600" loading="lazy" />
  <figcaption>場中取得の費用を踏まえて公表値を採用し、17時の失敗と利用要求の再評価から夜間処理へ変更した。</figcaption>
</figure>

## 取得失敗時の扱い

価格を取得できなかった場合は、最後の有効価格を維持する。値を取れなかったことをゼロ価格として資産評価に反映せず、取得状況と評価に使う価格を確認できるようにした。

必要な確認時点から処理時刻を決めることで、高頻度の更新を維持するよりも、日常の資産管理に合った取得方式へ絞った。

## 次の論点

[第4章：収支管理と入力業務の設計](/cases/asset-management-app-a-architecture/cashflow-and-input/)へ進む。
