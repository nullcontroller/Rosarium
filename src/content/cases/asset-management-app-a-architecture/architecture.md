---
title: "02. システム全体構成と技術選定"
summary: "Google Driveでのファイル管理、Windows PCの実行・データ保持、Tailscaleでの非公開接続、共通Web UIを、個人利用の目的に対応付ける。"
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

場所や端末を使い分けて利用しながら、個人で管理し続けやすい構成をどう選んだか。

## Google Driveの採用目的と管理範囲

私は、ソースファイル、資産データ、動作するアプリに場所を問わずアクセスできることを目指した。Google Driveを活用する構成を選び、ソースファイル一式をその管理領域へ置いた。管理領域は100MB以内に抑え、保存容量が大きくならないようにしている。

Google Driveをファイル管理に使い、アプリの実行と資産データの正本保持はWindows PC、遠隔からの利用はTailscaleによる非公開接続が担う。ファイルを管理する場所、処理を実行する場所、利用端末からの接続経路をそれぞれの役割に応じて組み合わせた。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/architecture-light.svg" alt="Google Drive上のソース管理と、Windows PCの実行・正本保持、端末からの非公開接続を分ける。" width="480" height="600" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/architecture-dark.svg" alt="Google Drive上のソース管理と、Windows PCの実行・正本保持、端末からの非公開接続を分ける。" width="480" height="600" loading="lazy" />
  <figcaption>Google Drive上のソース管理と、Windows PCの実行・正本保持、端末からの非公開接続を分ける。</figcaption>
</figure>

## Windows・Androidで同じ画面を使う

Windows・Androidからは共通のWeb UIを利用する。データと計算処理をWindows PCへ集め、端末ごとに別々の資産データを管理する作業を避けた。接続できるときに同じ資産状態を参照し、更新する。

Pythonで計算や保存を扱い、JavaScript・HTML・CSSで画面を構成した。保存にはJSONとMarkdownを使う。個人利用の規模に合わせ、追加のデータベースや端末別のネイティブアプリを管理する構成を増やさず、共通のWebアプリにまとめた。

## 非公開接続とPWAによる利用

Tailscaleによる非公開ネットワークからPCへ接続し、本人の利用端末でアプリを操作する。金融取引を対象外としたうえで、保存する金融情報も公開先を限定して扱う。

PWA（Progressive Web App）により、共通のWeb UIをアプリとして起動できる。資産データの鮮度を優先し、利用時はPCとネットワークへの接続を前提とする。端末別の実装を増やすより、個人で利用するための画面と接続経路を揃えることを重視した。

このように、ファイル管理、実行・データ保持、遠隔接続、端末上の利用を役割別に組み合わせた。Google Driveの容量を抑える運用も含め、日常的に維持する対象を限定した構成である。

## 次の論点

[第3章：資産価格の取得方式](/cases/asset-management-app-a-architecture/market-data/)へ進む。
