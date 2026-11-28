---
title: "08. アクセス制御とPWA設計"
summary: "非公開接続とアプリ側のアクセス確認を組み合わせ、複数端末から金融情報を利用する。データ鮮度を優先するPWAの更新方式と信頼境界を説明する。"
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
order: 8
---

## この章の問い

個人の金融情報を直接公開せず、複数端末から利用するにはどう設計するか。

## 私設の接続経路とアプリ側の確認を重ねる

資産管理アプリAは、本人の許可した端末から非公開ネットワーク経由で利用する。Tailscale ServeでHTTPSを終端し、ループバックだけで待ち受けるPythonへ転送する。アプリは転送元、HTTPS等の転送情報、設定された本人・端末を確認し、公開転送は拒否する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/access-light.svg" aria-label="非公開経路とアプリの信頼境界を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/access-light.svg" alt="非公開経路とアプリの信頼境界。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/access-dark.svg" aria-label="非公開経路とアプリの信頼境界を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/access-dark.svg" alt="非公開経路とアプリの信頼境界。" width="480" height="600" loading="lazy" /></a>
  <figcaption>非公開経路とアプリの信頼境界。</figcaption>
</figure>

転送ヘッダーを使った確認は、OSとリバースプロキシを信頼する構成の上に成り立つ。同一PC上の別プロセスからの干渉への対処は、OS側の権限と端末保護が担う。[Tailscale Serveの仕様](https://tailscale.com/docs/features/tailscale-serve)に沿って、接続経路、転送設定、アプリの判定を組み合わせる。

## 読み取らせないものと、書き込ませない経路

静的配信は許可リストに限定し、正本・ログ・設定・バックアップを公開ファイルとして配信しない。書込みAPIはOrigin、JSONのContent-Type、Fetch Metadata等を検査する。ローカルのヘルス応答は稼働確認用で、金融データを扱うAPIとはアクセス条件を分けている。

CSP（Content Security Policy）はブラウザーに読み込める資源等を制限する方針である。nosniff、no-referrer、埋込み制限を併用し、動的文字列は原則textContentで表示する。[MDNのCSP説明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)も参照できる。ブラウザーの資源制限と、サーバーの入力検証、OSの保護はそれぞれ別の層を担う。現在の構成は単一利用者を対象とし、多人数向けRBAC、独自の保存暗号化、署名付き監査基盤は備えていない。

## PWAでも金融データをオフライン正本にしない

Windows・Androidで共通のWeb UIをManifestのstandalone表示から利用する。Service WorkerはNetwork Onlyで、資産APIや画面資源の古いキャッシュを通常表示へ戻す方式ではない。これはデータ鮮度を優先し、オフライン利便性を制限した判断である。閲覧にはPCの稼働とネットワーク接続が必要になる。

この構成では、ネットワークから現在の資産状態を得ることを優先する。閲覧済みコンテンツのオフライン参照を重視するサイトとは、キャッシュを利用する目的が異なる。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/pwa-update-light.svg" aria-label="編集状態を守るアプリ版更新を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/pwa-update-light.svg" alt="編集状態を守るアプリ版更新。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/pwa-update-dark.svg" aria-label="編集状態を守るアプリ版更新を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/pwa-update-dark.svg" alt="編集状態を守るアプリ版更新。" width="480" height="600" loading="lazy" /></a>
  <figcaption>編集状態を守るアプリ版更新。</figcaption>
</figure>

アプリ資源の内容ハッシュから版を判別し、起動・画面復帰・表示中の確認で更新を検知する。編集中・保存中は再読込みを待機し、更新時は閲覧状態を保持する。旧アプリ用Cache Storageの整理と、localStorageの閲覧状態は別である。[Service Workerのライフサイクル](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)があることと、編集中に安全に更新できるアプリ側制御は区別する。

## 適用限界

PWAはOSごとに別のUIを実装する負担を減らし、各OSのインストール・保存・起動・更新の条件に従って動作する。利用端末ごとにインストール、画面復帰、編集中の更新、保存状態を確認する必要がある。

## 次の論点

[第9章：バックアップと障害復旧](/cases/asset-management-app-a-architecture/backup-and-recovery/)へ進む。
