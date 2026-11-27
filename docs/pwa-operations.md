# PWA運用

## 構成と境界

`site.webmanifest.ts`がManifest、`PwaStatus.astro`が登録と状態表示、
`scripts/pwa-build.mjs`がビルド内容のSHA-256から版番号を生成し、
`src/pwa/worker.js`を`/sw.js`へ出力する。追加依存ライブラリはない。
既存の192/512px・maskable・180px Apple Touchアイコンとfaviconを利用する。
Manifestの本番名はRosarium、レビュー名はRosarium Review。id・キャッシュ名前空間も分離する。
本番登録はHTTPS正規ホストのみ、レビュー登録は既存Tailscaleホスト及びlocalhostのみ。
開発サーバーには生成SWを置かない。同一originで本番とレビューを併用しない。

独自インストールUIは追加しない。対応ブラウザーの標準操作を使う。
iOSはSafariの共有操作、PC/Androidは対応ブラウザーのインストール操作となる。
インストール可否及び保存領域の共有はOS・ブラウザー・プロファイルに依存する。
別origin、別プロファイル、iOSの独立した保存領域との共有は保証しない。

## キャッシュ

初回に全記事を取得せず、SW制御下で実際に要求された公開リソースのみ保存する。
ビルド生成の公開HTMLリストは許可判定用であり、取得一覧ではない。
レビュー版は通常ビルドの公開ルートとの積集合で判定し、選択された非公開原稿を除く。
互換URL・noindex HTMLは保存しない。
画像・図解等も公開HTMLから実際に参照されるURLだけをビルド時に抽出し、未公開原稿専用の資産を除く。

|対象|方式|
|---|---|
|公開HTML、bookmarks.json、Pagefind|Network First。通信失敗時のみキャッシュ|
|_astro配下のハッシュ付き資産|Cache First|
|非ハッシュ画像・図解・フォント等|毎回ネットワークで更新確認、通信失敗時キャッシュ|
|更新情報・サイトマップのデータ|ネットワーク専用（公開HTMLの更新履歴ページはNetwork First）|
|外部通信・GA4・query付きURL|保存しない|

オンライン404や転送では旧キャッシュを削除し、旧本文を復活させない。
保存上限は240応答、合計32MiB、1応答2MiB、保持30日。
保存・有効化時に期限と最古取得順で整理する。OSの容量制限で早期削除される場合もある。
大きい画像、未取得記事、外部資産のオフライン利用は保証しない。
ブックマーク登録による本文の先読みは行わない。
初回インストール前の閲覧は制御対象外のため、その後に開いたページから保存対象となる。
オフライン本文には保存済み表示の案内を出す。未取得ページには簡潔な503案内を返す。

## 更新と復旧

デプロイは通常ビルド全体を原子的に公開する。SWは`updateViaCache: none`で確認する。
skipWaiting、強制再読込み、強制claimは使用しない。新SWは既存タブ・アプリが閉じるまで待機する。
待機時は小さな状態表示で案内する。新しいHTMLは待機中でもNetwork Firstで取得される。
新しいハッシュ付き資産はそのHTMLのURLから取得し、旧資産は既存ページ向けに保持する。
有効化時に同じ環境の旧キャッシュから有効な閲覧済み資産だけ移し、専用旧版キャッシュを削除する。
版番号はビルド成果物とSWソースから自動生成し、記事ごとの手動登録は不要。

障害時はDevToolsのApplication > Service Workersで当該origin・scope `/`の登録のみ解除し、
Cache Storageの`rosarium-pwa-production-`（レビューは`rosarium-pwa-review-`）だけ削除する。
ブラウザーの「サイトデータ全削除」、storage.clear、IndexedDB削除は行わない。
SWファイルをサーバーから消すだけでは既存登録は解除されない。緊急解除用SWの配信は別途承認して行う。
通常のキャッシュ削除・SW更新ではブックマークDB、移行マーカー、他のlocalStorageに触れない。

## 回帰確認

通常ビルドを先に生成し、非公開IDを含まないレビュー指定でレビュービルドを生成する。
GA4除外を最初の遷移前に適用し、PC/スマートフォン相当のLight/Darkで確認する。
実ブラウザーで登録・再起動、閲覧済み/未取得のオフライン、数式・画像・検索、
ブックマーク登録解除・保持・通知を確認する。2ビルドで待機、有効化、版・キャッシュ更新を確認する。
Cache Storageの削除前後でIndexedDBが維持されることを確認する。
エンジン試験や画面幅エミュレーションを実機インストールと同一視しない。

一次資料：[SW lifecycle](https://web.dev/articles/service-worker-lifecycle)、
[Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)、
[PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)。
