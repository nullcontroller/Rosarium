# PWA運用

## 構成と境界

`site.webmanifest.ts`がManifest、`PwaStatus.astro`が登録と状態表示、
`scripts/pwa-build.mjs`がビルド内容のSHA-256から版番号を生成し、
`src/pwa/worker.js`を`/sw.js`へ出力する。追加依存ライブラリはない。
既存の192/512px・maskable・180px Apple Touchアイコンとfaviconを利用する。
Manifestの本番名はRosarium、ステージング名はRosarium Staging（短縮名Rosarium STG）。
識別情報は`src/lib/pwa-environment.mjs`で一元管理する。本番登録はHTTPS正規originのみ、
ステージング登録は既存TailscaleのHTTPS origin（ポート8450）だけで許可する。
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
|外部通信・GA4・query付き資産要求|保存しない|

公開HTMLのナビゲーションに検索条件やanalytics指定が付く場合、通信には元URLを使い、
キャッシュの識別にはpathnameのみを使う。検索語をキャッシュキーへ保存しない。
Pagefindの固定入口`/pagefind/pagefind-entry.json`に付く`ts`のみの時刻パラメーターも、
通信では維持し、保存キーからは除く。これによりオフラインで取得済み索引を再初期化できる。

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
Cache Storageの`rosarium-pwa-production-`（ステージングは`rosarium-pwa-staging-`）だけ削除する。
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

## 環境別の識別とアイコン

|設定|本番|ステージング|
|---|---|---|
|origin|https://rosarium-tech.com|https://nullcontroller.tail8bbb3b.ts.net:8450|
|name / short_name|Rosarium / Rosarium|Rosarium Staging / Rosarium STG|
|id|本番origin + `/`|ステージングorigin + `/?app=rosarium-review`（既存IDを維持）|
|start_url|本番origin + `/`|ステージングorigin + `/`|
|scope|本番origin + `/`|ステージングorigin + `/`|
|worker|`/sw.js`|`/sw-staging.js`|
|cache|`rosarium-pwa-production-*`|`rosarium-pwa-staging-*`|
|アイコン|従来の深緑 `/icons/` と `/favicon.svg`|琥珀 `/icons/staging/`|
|theme / background|#17383b|#96651C|

既存の本番id `/` を絶対URLで明示しても、解決後の識別子は同じであり変更しない。
scopeは両サイトの全体を覆うが、絶対URLのoriginが異なる。同じ端末での識別は
Manifest idとoriginに基づく設計で、実際の同時インストールはOS別の実機確認を要する。
Manifest idやキャッシュ名だけでは同一originのIndexedDBは分離できない。
本番とステージングを同一originへ配置する運用はしない。DB名・スキーマは既存どおり。

通常ビルドは本番、`ROSARIUM_DRAFT_PREVIEW`があるレビュービルドはステージングを選ぶ。
任意の`ROSARIUM_PWA_ENV`を指定する場合も、この出力先と一致するproduction/stagingのみ許可する。
未知値・空値・矛盾はビルドを停止する。不明なoriginではSWを登録しない。
Manifestの起動先とscopeも絶対URLに固定し、別ホストへ誤配置したものを有効な同一originアプリとして扱わない。

本番配布済みの各PNGとfavicon SVGが形状の正本。`brand/staging-palette.json`の
輝度アンカーを使い、`scripts/generate-staging-icons.ps1`（Windows PowerShell環境）で色だけを変換する。
リサイズやalpha変更は行わない。SVGも色指定以外は変更しない。
生成物は`brand/staging/`、入力・出力ハッシュは`brand/staging-generation.json`に記録する。
レビュー用ビルドのみ生成物をコピーし、本番出力には琥珀アイコンとステージングworkerを含めない。
favicon SVG/32px PNG、Apple Touch、通常192/512px、maskable192/512px及びアプリ名metaに適用する。
ステージングでは旧アイコンURLも同じ琥珀画像へ置き換え、ルートのfavicon SVG/ICOと
Apple TouchのOS向けフォールバックも用意する。正本は1組の生成画像で、別々には編集しない。
サイト本文のCSS配色と本番の既存画像は変更しない。

旧Rosarium Reviewの解決後idを維持し、表示名とアイコンだけを更新する。
OSの既存アイコン・名称の更新時期はブラウザーに依存し、実機では未検証。
自動アンインストールや保存領域の全削除は行わない。同じステージングoriginのDBを保持する。
ブラウザーとstandaloneアプリの保存共有はOS依存であり、id維持だけを根拠に保証しない。
旧Review workerの切替はscope内の既存登録を更新し、従来どおりタブ終了後に自然有効化する。
有効化後は旧`rosarium-pwa-review-*`だけを破棄して古い深緑のHTMLを持ち越さず、
オンラインで一度開いて新しい閲覧キャッシュを作る。本番や他機能のキャッシュ、IndexedDBには触れない。

一次資料：[SW lifecycle](https://web.dev/articles/service-worker-lifecycle)、
[Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)、
[PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)。
