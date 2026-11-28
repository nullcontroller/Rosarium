---
title: "02. システム全体構成と技術選定"
summary: "個人利用という規模に対して、必要十分なシステム構成をどう選択するか。 採用方式、その理由と検証範囲・適用限界を整理する。"
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
order: 2
---

## この章の問い

個人利用という規模に対して、必要十分なシステム構成をどう選択するか。

## 正本・計算・自動処理をPCへ集める

資産管理アプリAでは、Windows PCが資産データと計算処理を保持し、Windows・Androidは共通のWeb UIを利用する。端末ごとにデータベースを作る方式では、同期や競合解消を管理し続ける必要がある。今回は正本を一つにし、接続できるときに同じ状態を参照する方式を採った。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/architecture-light.svg" aria-label="PC集約型の論理構成を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/architecture-light.svg" alt="PC集約型の論理構成。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/architecture-dark.svg" aria-label="PC集約型の論理構成を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/architecture-dark.svg" alt="PC集約型の論理構成。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>PC集約型の論理構成。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

図は論理構成であり、実際のホスト名・接続情報・保存先を示さない。ブラウザーは非公開ネットワークからTailscale Serveへ接続し、ループバックで待ち受けるPythonサーバーへ転送される。市場情報はPC側から取得し、外部媒体はバックアップに利用する。

## 少ない依存と、自前で持つ責務

バックエンドはPython標準ライブラリ中心で、HTTP要求はThreadingHTTPServerが処理する。JavaScript ES Modules・HTML・CSSで画面を構成し、JSONとMarkdownを永続化に使う。PowerShellとWindowsタスクスケジューラが起動を担い、Python内のワーカーが定期処理を担う。PWAは同じWeb UIをアプリとして起動するための仕組みであり、別のネイティブ実装ではない。

追加の実行依存を抑えると更新対象は減るが、入力検証、アクセス制御、保存整合性、監視まで自動的に提供されるわけではない。Python公式資料もhttp.serverを一般的な本番用途には推奨していない。この選択は本人の限定端末・非公開接続という狭い前提で説明すべきであり、公開サービスへの推奨構成ではない。[ThreadingHTTPServerの仕様と注意](https://docs.python.org/3.14/library/http.server.html)を確認して適用範囲を区切る。

## 代替方式との比較

次の表は記事執筆時の一般的な方式比較であり、各方式の試作やベンチマークを実施した記録ではない。有料市場情報や銀行API等の見送り経緯は第12章で区別する。

|方式候補|得られるもの|今回採用しなかった場合の論点|
|---|---|---|
|クラウド上のアプリとDB|PC停止と切り離した稼働|契約・費用・秘密情報・配信基盤の管理が増える|
|RDBMS|制約、問い合わせ、トランザクション|今回の少量データで導入・運用対象を増やすかの判断|
|Webフレームワーク|ルーティング・検証等の枠組み|依存更新が増える一方、自前コードを減らせる利点もある|
|OS別ネイティブアプリ|各OS機能との密な統合|複数の実装・配布経路を保守する必要|
|専用ジョブキュー|分散・監視・再実行の機構|単一PCの個人用途には常駐要素が増える|
|有料市場情報API|契約で定めた仕様や提供範囲|有料サービスを使わない制約と適合しない|

採用理由は「Pythonなら常に低コスト」ではない。対象範囲に必要な処理を既存PCへ集約し、追加の実行基盤を減らすという判断である。PCが単一障害点になること、手動配信やファイル容量管理が残ることを合わせて受け入れる。

## 検証と適用限界

技術構成は引継ぎ資料で確認された実装を記述している。実際の認証設定・稼働先・PC再起動を今回のBook検証で再確認したわけではない。一般仕様としては[Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)による私設ネットワーク内の配信を参照し、同製品の採用だけでアプリ全体の安全性や継続無償性を保証しない。

## 次の論点

[第3章：データモデルと正本管理](/cases/asset-management-app-a-architecture/data-model/)へ進む。
