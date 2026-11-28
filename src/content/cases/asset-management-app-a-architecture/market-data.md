---
title: "05. 外部市場情報の取得方式"
summary: "終値・基準価額・参考為替を取得し、商品・単位・日付を検証する。提供元別の解析、失敗時の状態管理、交差換算を説明する。"
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
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 5
---

## この章の問い

有料サービスを利用せず、資産管理に必要な価格情報をどう取得するか。

## 公表値を評価用の価格へ取り込む

第1章で確定した対応範囲に従い、価格取得は終値・基準価額を中心に設計した。取得対象の公表周期に合わせて処理し、評価に使う価格の基準日と取得状況を管理する。

上場商品の終値、投資信託等の基準価額、参考為替は別の観測値である。公式公開データのHTML・CSV・XML・ZIPは、提供元ごとの形式を読み取り、アプリが扱う価格へ変換するアダプターで解析する。基準価額を市場終値の代わりに使わず、対象商品の識別子と単位を検証する。取得処理は商品の種別と提供元ごとに分け、必要な観測値を対応する評価方法へ渡す。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/market-data-light.svg" aria-label="価格取得と最新正本への適用を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/market-data-light.svg" alt="価格取得と最新正本への適用。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/market-data-dark.svg" aria-label="価格取得と最新正本への適用を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/market-data-dark.svg" alt="価格取得と最新正本への適用。" width="480" height="600" loading="lazy" /></a>
  <figcaption>価格取得と最新正本への適用。</figcaption>
</figure>

## 取得できたことと、使える価格であることを分ける

共通HTTP処理が期限、読込サイズ、HTTP応答等を検証する。その後、商品、基準日、有限な値、単位を確認する。未来日や不適切な日付逆行を受け入れない。取得時刻は通信を行った日時であり、その時刻の市場価格を意味しない。

外部通信は正本ロックの外で実施する。検証済みの価格を適用するときだけロック内で最新正本を読む。取得開始時の数量や全体データを書き戻さず、取得中に行われた別端末の編集を保護する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/price-states-light.svg" aria-label="価格観測結果と次の処理を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/price-states-light.svg" alt="価格観測結果と次の処理。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/price-states-dark.svg" aria-label="価格観測結果と次の処理を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/price-states-dark.svg" alt="価格観測結果と次の処理。" width="480" height="600" loading="lazy" /></a>
  <figcaption>価格観測結果と次の処理。</figcaption>
</figure>

未公表、休場、通信失敗、解析失敗を区別し、最後の有効価格を維持する。値が同じでも新しい基準日の公表なら、その日付の観測として意味がある。HTTP200だけで価格更新成功にせず、失敗した価格をゼロや現在値の推測で補わない。

自動バッチは最低30分間隔で未取得対象を再試行し、長期失敗、認可・制限応答、次の試行までの待機を指定するRetry-After等に応じて待機する。共通通信層の短い再試行と、永続ジョブの次回試行は役割が異なる。取得失敗だけで画面用HTTPサーバーを停止しない。

## 為替の交差換算を単位から導く

同じ基準日の基軸通貨1単位あたり円を $r_J>0$、対象通貨単位を $r_F>0$ とする。対象通貨1単位の円価格は、基軸通貨を中間に消去して次になる。

$$
r_{J/F}=\frac{r_J\;[\mathrm{JPY/base}]}{r_F\;[\mathrm{foreign/base}]}\quad[\mathrm{JPY/foreign}].
$$

説明用の架空値で $r_J=180$、$r_F=1.2$ なら、$180\div1.2=150$ 円／対象通貨となる。異なる基準日の混在や分子分母の逆転を避ける。これは参考レートであり、金融機関の売買・手数料込み適用額ではない。この例は有理数とPythonの十進演算（Decimal）で照合した。

## 公開データ利用の限界

公表データを利用する際は、提供元の利用条件、再配布の可否、取得頻度の条件を確認する。公表遅延やHTML・CSV等の形式変更、提供終了への対応も運用保守に含まれる。提供条件が変わった場合は、取得方式と対応範囲を見直す。

## 次の論点

[第6章：金融計算と業務データの整合性](/cases/asset-management-app-a-architecture/financial-consistency/)へ進む。
