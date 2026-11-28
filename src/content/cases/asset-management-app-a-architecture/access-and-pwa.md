---
title: "08. アクセス制御とPWA設計"
summary: "個人の金融情報を直接公開せず、複数端末から利用するにはどう設計するか。 採用方式、その理由と検証範囲・適用限界を整理する。"
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

資産管理アプリAは一般公開サービスではない。Tailscale ServeでHTTPSを終端し、ループバックだけで待ち受けるPythonへ転送する。アプリは転送元、HTTPS等の転送情報、設定された本人・端末を確認し、公開転送は拒否する。実際の識別値や接続先は掲載しない。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/access-light.svg" aria-label="非公開経路とアプリの信頼境界を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/access-light.svg" alt="非公開経路とアプリの信頼境界。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/access-dark.svg" aria-label="非公開経路とアプリの信頼境界を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/access-dark.svg" alt="非公開経路とアプリの信頼境界。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>非公開経路とアプリの信頼境界。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

これは、同一PC上の任意プロセスまで不信とする強い隔離ではない。転送ヘッダーを信じられるかは、OSとリバースプロキシの管理に依存する。製品を置いただけで本人限定になるという説明ではなく、経路と設定とアプリの判定を一体で扱う。[Tailscale Serveの仕様](https://tailscale.com/docs/features/tailscale-serve)は一般機能の根拠であり、この環境の設定監査結果ではない。

## 読み取らせないものと、書き込ませない経路

静的配信は許可リストに限定し、正本・ログ・設定・バックアップを公開ファイルとして配信しない。書込みAPIはOrigin、JSONのContent-Type、Fetch Metadata等を検査する。ローカルのヘルス応答と金融データへのアクセスは区別し、「全エンドポイントが同じ認証必須」と一般化しない。

CSP（Content Security Policy）はブラウザーに読み込める資源等を制限する方針である。nosniff、no-referrer、埋込み制限を併用し、動的文字列は原則textContentで表示する。[MDNのCSP説明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)を参照し、これを入力検証・OS保護・権限設計の代替にしない。多人数向けRBAC、独自の保存暗号化、署名付き監査基盤は未実装とされている。

## PWAでも金融データをオフライン正本にしない

Windows・Androidで共通のWeb UIをManifestのstandalone表示から利用する。Service WorkerはNetwork Onlyで、資産APIや画面資源の古いキャッシュを通常表示へ戻す方式ではない。これはデータ鮮度を優先し、オフライン利便性を制限した判断である。ネットワークやPCが使えなければ閲覧を保証しない。

Rosarium自身の「閲覧済み記事のオフライン表示」とは別のシステムであり、両者のキャッシュ戦略を混同しない。今回のBook実装のために、どちらのService Workerも変更しない。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/pwa-update-light.svg" aria-label="編集状態を守るアプリ版更新を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/pwa-update-light.svg" alt="編集状態を守るアプリ版更新。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/pwa-update-dark.svg" aria-label="編集状態を守るアプリ版更新を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/pwa-update-dark.svg" alt="編集状態を守るアプリ版更新。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>編集状態を守るアプリ版更新。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

アプリ資源の内容ハッシュから版を判別し、起動・画面復帰・表示中の確認で更新を検知する。編集中・保存中は再読込みを待機し、更新時は閲覧状態を保持する。旧アプリ用Cache Storageの整理と、localStorageの閲覧状態は別である。[Service Workerのライフサイクル](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)があることと、編集中に安全に更新できるアプリ側制御は区別する。

## 適用限界

PWAはOS別アプリの開発負担を減らすが、ネイティブ機能、OSごとの保存・起動・更新挙動がすべて同じになるわけではない。本Bookのステージング閲覧確認はRosariumの章表示の検証であり、資産管理アプリAのAndroid実機試験や認証試験の代わりではない。

## 次の論点

[第9章：バックアップと障害復旧](/cases/asset-management-app-a-architecture/backup-and-recovery/)へ進む。
