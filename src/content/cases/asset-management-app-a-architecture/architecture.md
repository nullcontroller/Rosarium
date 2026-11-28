---
title: "02. システム全体構成と技術選定"
summary: "確定した要求を、PCへの処理集約、共通Web UI、標準ライブラリ、ファイル保存などの方式へ対応付け、技術選定と運用上の取引条件を説明する。"
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

## 確定した要求を方式へつなぐ

第1章で対応範囲を絞り、複数端末での利用、データの整合性、自動処理、復旧性を要求として整理した。ここでは、それらを実現する仕組みと、維持する必要がある管理対象を対応付ける。保存・計算の共通基準となるデータを正本と呼び、その所在をまず決める。

|要求|選択した方式|引き受ける制約|
|---|---|---|
|複数端末で同じ状態を見る|PC上に正本を一つ置く|PC停止中は利用を制限される|
|有料サービスを使わない|公式公表データと既存環境を利用|公表形式や利用条件の変更へ追従が必要|
|日常作業を減らす|サーバー内の定期実行処理（ワーカー）と永続ジョブ状態|停止中の時刻保証はできない|
|データの正確性|単位・基準日・revision・世代保存を検証|検証規則の実装と保守が必要|
|復旧可能性|外部媒体へ検証済みZIPを保存|PCと媒体の同時被災等は別課題|
|依存を抑える|標準ライブラリと共通Web UI|枠組みが提供する機能も自前で担う|

## 正本・計算・自動処理をPCへ集める

資産管理アプリAでは、Windows PCが資産データと計算処理を保持し、Windows・Androidは共通のWeb UIを利用する。端末ごとにデータベースを作る方式では、同期や競合解消を管理し続ける必要がある。今回は正本を一つにし、接続できるときに同じ状態を参照する方式を採った。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/architecture-light.svg" aria-label="PC集約型の論理構成を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/architecture-light.svg" alt="PC集約型の論理構成。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/architecture-dark.svg" aria-label="PC集約型の論理構成を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/architecture-dark.svg" alt="PC集約型の論理構成。" width="480" height="600" loading="lazy" /></a>
  <figcaption>PC集約型の論理構成。</figcaption>
</figure>

この構成では、端末、非公開ネットワーク、PC上の処理、保存先の役割を分ける。ブラウザーは非公開ネットワークからTailscale Serveへ接続し、ループバックで待ち受けるPythonサーバーへ転送される。市場情報はPC側から取得し、外部媒体はバックアップに利用する。

## 少ない依存と、自前で持つ責務

バックエンドはPython標準ライブラリ中心で、HTTP要求はThreadingHTTPServerが処理する。JavaScript ES Modules・HTML・CSSで画面を構成し、JSONとMarkdownを永続化に使う。PowerShellとWindowsタスクスケジューラが起動を担い、Python内のワーカーが定期処理を担う。PWA（Progressive Web App）は、同じWeb UIをアプリとして起動するための仕組みとして利用する。

標準ライブラリ中心の構成は追加パッケージの更新対象を抑えられる一方、入力検証、アクセス制御、保存整合性、監視をアプリ側で担う。ThreadingHTTPServerは、本人の限定端末と非公開接続を前提に採用した。Python公式資料はhttp.serverを一般的な本番用途には推奨しておらず、公開サービスへ展開する場合はHTTP基盤と安全性の設計を見直す必要がある。[ThreadingHTTPServerの仕様](https://docs.python.org/3.14/library/http.server.html)も参照できる。

## 代替方式との比較

採用方式の特徴を捉えるため、代替方式が持つ運用上の利点と管理対象を整理する。対応範囲を決めた経緯は第1章、運用面の総括は第12章で扱う。

|方式候補|得られるもの|今回採用しなかった場合の論点|
|---|---|---|
|クラウド上のアプリとDB|PC停止と切り離した稼働|契約・費用・秘密情報・配信基盤の管理が増える|
|RDBMS（関係データベース管理システム）|制約、問い合わせ、トランザクション|今回の少量データで導入・運用対象を増やすかの判断|
|Webフレームワーク|ルーティング・検証等の枠組み|依存更新が増える一方、自前コードを減らせる利点もある|
|OS別ネイティブアプリ|各OS機能との密な統合|複数の実装・配布経路を保守する必要|
|専用ジョブキュー|分散・監視・再実行の機構|単一PCの個人用途には常駐要素が増える|
|有料市場情報API|契約で定めた仕様や提供範囲|有料サービスを使わない制約と適合しない|

対象範囲に必要な処理を既存PCへ集約し、追加の実行基盤を抑えることを採用理由とした。PCが単一障害点になること、手動配信やファイル容量管理が残ることを合わせて受け入れる。

## 構成を維持するための条件

接続経路には[Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)を利用する。利用条件や提供範囲の変化、PCの故障、保存容量の増加は継続して確認する対象となる。アクセス制御の信頼境界は第8章、復旧と運用の条件は第9・12章で説明する。

## 次の論点

[第3章：データモデルと正本管理](/cases/asset-management-app-a-architecture/data-model/)へ進む。
