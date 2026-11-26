# GA4計測と検証アクセスの分離

## 適用範囲

GA4は通常ビルド、HTTPSの正規ホスト `rosarium-tech.com`、除外対象でないページと読者だけで初期化する。localhost、LAN、Tailscale、別ホスト、既知の自動UA、webdriver=trueでは読み込まない。レビュー用ビルドは公開済みページを含む全HTMLから初期化コードを除く。静的ファイルをコピーしてもこの無効化は維持される。

静的な検証専用ビルドはプロセス限定で `ROSARIUM_DISABLE_ANALYTICS=1` を設定する。本番用ビルドの環境へ永続設定しない。通常の `npm run build` は一般読者の計測を維持する。

## ブラウザーによる自動確認

本番、ステージング、ローカルのいずれも、検証専用の新規BrowserContextを作り、ページ作成・最初の遷移より前に次を実行する。既存ユーザーのブラウザーへ初期化スクリプトを注入しない。

```js
import { blockAnalytics } from './scripts/browser-analytics.mjs';
const context = await browser.newContext({ serviceWorkers: 'block' });
await blockAnalytics(context);
const page = await context.newPage();
```

このヘルパーはGoogleの収集・タグ配布先への要求を中断し、Google公式の `ga-disable-MEASUREMENT_ID` とサイト側の除外フラグを初期化前に設定する。UA・webdriver判定だけに依存しない。Service Workerで迂回しない新規contextを用い、収集先の変更時は遮断対象も見直す。

ネットワーク遮断を提供しないブラウザー操作サービスでは、修正版が公開済みであることをHTTP取得で確認してから、最初の遷移を `https://rosarium-tech.com/?analytics=off` とする。検証用ブラウザーに限り保存済み除外を確認し、以後の遷移にも適用する。修正版公開前にこのURLだけで遮断できると判断しない。HTTPだけの取得はJavaScriptを実行しないためGA4を起動しない。`?verify=...` は除外指定ではない。

## 著者の閲覧

修正版公開後、著者が使う各ブラウザー・プロファイルで一度 `https://rosarium-tech.com/?analytics=off` を開く。localStorageの `rosarium.analytics.disabled=1` がその正規オリジンに保存され、通常リンクへ移動しても除外される。ブラウザー間・端末間で同期される設定ではない。サイトデータ削除・別プロファイル・別端末では再設定する。ストレージが拒否される場合、クエリ指定の当該ページだけは無効になるが永続化は保証しない。

解除は著者自身のブラウザーの開発者ツールで `localStorage.removeItem('rosarium.analytics.disabled')` を実行して再読み込みする。`analytics=on` などの外部リンクでは保存済み除外を解除しない。一般読者にはこの操作を要求しない。代替はGoogleの公式オプトアウト拡張機能である。

固定の公開IPで識別できる場合はGA4の内部トラフィック定義・データフィルタも候補だが、モバイル回線や動的IPでは取りこぼしや共有IPの読者除外がある。まずTestingで照合し、著者確認後にActiveを検討する。今回GA4管理画面のフィルタは変更しない。

## 過去データと原因調査

GA4管理者は11月25日と前後日を、プロパティのタイムゾーン、時間帯、ホスト名、ページパス、セッションの参照元／メディア、デバイス、イベント名ごとに比較する。開発・公開確認の時刻と照合する。正規ホスト上の自動閲覧と一般読者を既存集計だけで完全に識別できるとは限らない。

過去データは削除しない。必要なら探索・レポート上で分析条件を分けて残す。新しいデータフィルタは過去のデータを修復しない。未確認の増加件数を開発アクセスと断定しない。

## 一次資料

- Google: https://developers.google.com/tag-platform/security/guides/privacy — 初期化前のga-disableフラグ。
- Google: https://support.google.com/analytics/answer/10104470?hl=ja — 内部トラフィック・IP条件・Testing。
- Google: https://support.google.com/analytics/answer/13296761?hl=ja — フィルタは将来の入力へ適用、過去データには非遡及。
