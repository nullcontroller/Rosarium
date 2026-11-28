---
title: "02. システム全体構成と技術選定"
summary: "Google Driveでのソース管理と容量制限、Windows PC上のデータ・処理、複数端末からの非公開アクセスを役割別に説明する。"
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
tags: ["個人開発", "システム方式設計", "運用設計"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 2
---

## この章の問い

対応範囲に必要な機能を、場所と端末を使い分けながら、少ない管理対象で利用するにはどう構成するか。

## 場所を問わず利用するために、役割を分ける

私はGoogle Driveを活用し、場所を問わず利用できる環境を目指した。ソースファイル一式をGoogle Driveの管理領域へ置き、容量を100MB以内に抑えて管理している。保存するものを増やし続けるのではなく、管理領域の容量も制約として扱う方針である。

このソース管理と、アプリを動かす処理の配置は役割が異なる。資産データの正本と計算処理はWindows PCに置き、Windows・Androidは共通のWeb UIで利用する。端末からPCへ接続する経路には、非公開ネットワークのTailscaleを利用する。

Google Driveはソースファイルの管理、Windows PCは実行と正本保持、Tailscaleは遠隔接続を担当する。Google Driveを利用していても、アプリの利用にはPCの稼働とネットワーク接続が必要である。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/architecture-light.svg" alt="Google Drive上のソース管理と、Windows PCの実行・正本保持、端末からの非公開接続を分ける。" width="480" height="600" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/architecture-dark.svg" alt="Google Drive上のソース管理と、Windows PCの実行・正本保持、端末からの非公開接続を分ける。" width="480" height="600" loading="lazy" />
  <figcaption>Google Drive上のソース管理と、Windows PCの実行・正本保持、端末からの非公開接続を分ける。</figcaption>
</figure>

## 正本を一つにして、端末ごとの同期を持たない

保存・計算の基準となるデータを正本と呼ぶ。資産管理アプリAではWindows PC上の正本を参照し、端末ごとに資産データベースを作らない。Androidで利用するときも、PCと同じ資産状態を読み、更新する。

資産、保有数量、価格、現金、目標、予定、履歴などをJSONで管理し、方針等の文書にはMarkdownを使う。計算と入力検証はPC側に集め、ブラウザーは表示と操作を担当する。閲覧位置などの画面状態と、評価の基準になる金融データを分けて扱う。

ファイル保存は、個人用途の小規模なデータを見通しよく管理できる一方、入力の整合性と復元手順をアプリ側で整える必要がある。端末が独自に正本を持つ同期方式を避ける代わりに、PCへ接続できることを利用条件とした。

## 共通のWeb UIと、標準ライブラリ中心の構成

バックエンドはPython標準ライブラリ中心で、ThreadingHTTPServerがHTTP要求を処理する。画面はJavaScript ES Modules・HTML・CSSで構成した。OSごとのアプリを作り分けるより、同じ画面と処理をWindows・Androidで利用する方式を選んだ。

PWA（Progressive Web App）により、共通のWeb UIをアプリとして起動できる。資産管理アプリAのService WorkerはNetwork Onlyで、金融データの鮮度を優先する。PCやネットワークが使えないときの閲覧は制限される。更新時には編集中・保存中の再読み込みを待ち、閲覧状態を保持する。

依存パッケージを抑える構成では、更新対象を減らす代わりに、検証や保存、アクセス制御などを自前で保守する責務が残る。Python公式資料はhttp.serverを一般的な本番用途に推奨していないため、本人の限定端末と非公開接続を前提とした構成として扱う。[PythonのHTTPサーバー仕様](https://docs.python.org/3.14/library/http.server.html)

## 非公開アクセスとデータ保護

Tailscale ServeがHTTPS接続を受け、PCのループバックで待ち受けるアプリへ転送する。アプリ側でも接続者・端末や書込み要求を確認し、配信する静的ファイルを限定する。正本、ログ、設定、バックアップはWeb公開する対象から外す。

第1章で金融取引を責務から外したうえで、残る金融情報もこの接続経路と端末側の管理によって保護する。OS権限、PC、接続設定を維持することは運用上の条件となる。[Tailscale Serveの仕様](https://tailscale.com/docs/features/tailscale-serve)

## 必要十分な構成の適用条件

|選択|目的への寄与|引き受ける条件|
|---|---|---|
|PCへデータと処理を集約|端末別の同期管理を抑える|PC停止中は利用できない|
|Google Driveでソース管理|管理場所をまとめる|100MB以内の容量管理を続ける|
|ファイル保存|追加のDB運用を増やさない|データ検証と復元手順を持つ|
|共通Web UI・PWA|端末別の実装・配布を抑える|ブラウザーと接続環境の条件を受ける|
|非公開ネットワーク|利用者と接続経路を限定する|端末とアクセス設定を管理する|

利用人数や可用性要求が変わる場合は、クラウド実行やデータベース、HTTP基盤を改めて選ぶ必要がある。今回は単一利用者が手元のPCを管理する範囲で構成した。


## 次の論点

[第3章：資産価格の取得方式](/cases/asset-management-app-a-architecture/market-data/)へ進む。
