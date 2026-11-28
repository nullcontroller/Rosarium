---
title: "05. 外部市場情報の取得方式"
summary: "有料サービスを利用せず、資産管理に必要な価格情報をどう取得するか。 採用方式、その理由と検証範囲・適用限界を整理する。"
layer: "publication"
kind: "case"
section: "cases"
case_context: "personal"
case_specialty: "システム方式設計・システムアーキテクチャ"
status: "draft"
public: false
lifecycle: "active"
last_updated: "2026-11-28"
entry_points: ["ai"]
tags: ["個人開発", "システム方式設計", "データ整合性"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリのシステム方式設計 ― 低コスト・低保守負担を目指した設計"
order: 5
---

## この章の問い

有料サービスを利用せず、資産管理に必要な価格情報をどう取得するか。

## 場中の速さより、日付と単位の説明可能性を選ぶ

資産管理アプリAは場中更新を行わない。日次の評価と配分確認に必要な公表値を用いることで、有料契約や高頻度取得を避け、取得失敗への対応範囲を限定する。終値でも公表遅延や形式変更はあり、保守が不要になるわけではない。

上場商品の終値、投資信託等の基準価額、参考為替は別の観測値である。公式公開データのHTML・CSV・XML・ZIPを提供元別アダプターで解析する。基準価額を市場終値の代わりに使わず、対象商品の識別子と単位を検証する。実際の保有商品名・商品コードは公開しない。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/market-data-light.svg" aria-label="価格取得と最新正本への適用を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/market-data-light.svg" alt="価格取得と最新正本への適用。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/market-data-dark.svg" aria-label="価格取得と最新正本への適用を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/market-data-dark.svg" alt="価格取得と最新正本への適用。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>価格取得と最新正本への適用。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

## 取得できたことと、使える価格であることを分ける

共通HTTP処理が期限、読込サイズ、HTTP応答等を検証する。その後、商品、基準日、有限な値、単位を確認する。未来日や不適切な日付逆行を受け入れない。取得時刻は通信を行った日時であり、その時刻の市場価格を意味しない。

外部通信は正本ロックの外で実施する。検証済みの価格を適用するときだけロック内で最新正本を読む。取得開始時の数量や全体データを書き戻さず、取得中に行われた別端末の編集を保護する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/price-states-light.svg" aria-label="価格観測結果と次の処理を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/price-states-light.svg" alt="価格観測結果と次の処理。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/price-states-dark.svg" aria-label="価格観測結果と次の処理を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/price-states-dark.svg" alt="価格観測結果と次の処理。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>価格観測結果と次の処理。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

未公表、休場、通信失敗、解析失敗を区別し、最後の有効価格を維持する。値が同じでも新しい基準日の公表なら、その日付の観測として意味がある。HTTP200だけで価格更新成功にせず、失敗した価格をゼロや現在値の推測で補わない。

自動バッチは最低30分間隔で未取得対象を再試行し、長期失敗、認可・制限応答、Retry-After等に応じて待機する。共通通信層の短い再試行と、永続ジョブの次回試行は役割が異なる。取得失敗だけで画面用HTTPサーバーを停止しない。

## 為替の交差換算を単位から導く

同じ基準日の基軸通貨1単位あたり円を $r_J>0$、対象通貨単位を $r_F>0$ とする。対象通貨1単位の円価格は、基軸通貨を中間に消去して次になる。

$$
r_{J/F}=\frac{r_J\;[\mathrm{JPY/base}]}{r_F\;[\mathrm{foreign/base}]}\quad[\mathrm{JPY/foreign}].
$$

説明用の架空値で $r_J=180$、$r_F=1.2$ なら、$180\div1.2=150$ 円／対象通貨となる。異なる基準日の混在や分子分母の逆転を避ける。これは参考レートであり、金融機関の売買・手数料込み適用額ではない。付属Pythonは有理数とDecimalの別計算で照合する。

## 公開データ利用の限界

今回の取得方式は引継ぎ資料を根拠とし、提供元の現行利用条件や実通信の再調査を完了した報告ではない。公開されていることは、無期限の無料提供、再配布権、API契約やSLAを意味しない。提供条件が変われば再評価する。有料サービスを使わないという要求から、取得できないデータを非公式手段で無制限に集める結論は導かれない。

## 次の論点

[第6章：金融計算と業務データの整合性](/cases/asset-management-app-a-architecture/financial-consistency/)へ進む。
