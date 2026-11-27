# ブックマークと記事IDの保守（R3）

## 正本と識別

保存の正本はブラウザー標準のIndexedDBである。localStorageは旧形式からの移行元に限り、通常操作で書き戻さない。公開記事ID、URL、loader、公開カタログ、分類は変更しない。同一性はcollectionとidの組であり、タイトル・URL・カテゴリ・表示位置を識別子として使わない。記事ID管理規約は[Authoring Guide](authoring-guide.md#公開済み記事idの維持)を維持する。

新規登録の条件はsrc/lib/bookmark-catalog.mjsのisBookmarkableで一元管理する。pages、公開、published/stable、active、互換URLに転送されない独立した閲覧先を対象とし、件数を固定しない。Career・案内・旧・退役・非公開には新規登録ボタンを出さない。既存の旧・退役・統合・未解決項目は保持する。

## IndexedDBスキーマ

- DB名: rosarium.bookmarks、DBバージョン: 1。
- bookmarksストア: keyPathは[collection, id]。記事単位のレコードを保存する。
- レコード: collection、id、addedAt（UTCのISO日時）、任意のtitleSnapshot、urlSnapshot。旧JSONのitems内の形を維持する。
- metaストア: keyPathはkey。legacy-local-storage-v1というキーで移行完了を管理する。
- 全件を一つのJSONとして更新しない。表示用のgetAllはreadonlyトランザクションで取得する。

現在のタイトル・URL・主カテゴリ・ライフサイクル・明示的な後継関係は/bookmarks.jsonから解決する。非公開情報を含めない。スナップショットURLを表示リンクとして採用せず、未知の項目を自動削除しない。本文や検索インデックスを記事IDの正本として使わない。

## 操作トランザクション

登録・解除・toggleはbookmarksストアのreadwriteトランザクション内でget([collection,id])して状態を判定する。未登録のaddは検証済みレコードをadd、登録済みのaddはそのレコードを維持する。removeは対象キーだけをdeleteする。toggleは取得した最新状態に応じてaddまたはdeleteする。登録件数の上限2000も同じトランザクション内でcountして判定する。

リクエストのsuccessでは成功表示しない。transaction.complete後にだけ呼出元へ成功を返し、通知とUI更新を行う。abort/error/同期例外では成功表示せず、トランザクションを中断する。既存の他レコードは維持される。

同一IDの明示的な同時addは1件となる。同じ記事ボタンを2タブから押す場合は2回のtoggleであり、未登録からなら登録・解除の順に処理して最終状態は未登録となる。同じIDへのadd/removeはIndexedDBが直列化した順の最後の操作が有効となる。異なるIDの変更は両方を維持する。Web Locks、独自の排他、タブ選出、タイマー待機、複雑な再試行は使用しない。

## 旧localStorageの移行

ready時にmetaとbookmarksを同じreadwriteトランザクションへ含める。移行完了マーカーがあればlocalStorageにはアクセスしない。マーカーがない場合だけrosarium.bookmarksを読み、旧schemaVersion=1、site=rosarium、itemsの型・件数・ID・日時・文字列長・安全なURL形式を検証する。未知のschemaや破損データを黙って捨てない。

妥当な旧レコードのうち未登録のものだけを追加し、既に存在するIndexedDBレコードを上書きしない。collection/idで重複を排除する。全レコードと移行完了マーカーを同じトランザクションでコミットする。複数タブが初期化しても重なるreadwriteトランザクションが直列化され、後続はマーカーを確認して取り込まない。移行後に解除した記事は、再読込みや新しいstoreインスタンスでも再登録されない。

旧キーのバイト列は移行成功後も削除・変更しない。他のlocalStorage設定にも触れない。移行失敗では部分的な追加やマーカーだけの確定はせず、元のデータも残す。読取拒否・破損・容量超過等を表示し、利用者の再操作時に再確認する。未移行時にlocalStorageを読めなければ、データがないと決め付けず移行を中止する。移行済みならlocalStorageが利用拒否されてもIndexedDBから利用できる。

移行マーカーを含むIndexedDB自体を手動削除した場合は、残っている旧キーからの移行対象として再び扱われる。これは通常のページ再読込み・解除後の復元防止とは別である。旧版を開いたままのタブは旧キーへ書くため、更新時は全タブを再読込みする。移行完了後に旧版が追加した項目を自動で再取込みしない。

## 複数タブの表示

BroadcastChannel名はrosarium.bookmarks.changed。コミット後に{type:changed}だけを送る。ID・タイトル・保存データは通知に含めず、受信した通知の内容を保存正本として採用しない。受信時にはIndexedDBから再取得する。初期読込みが完了してからボタンを有効化し、古い非同期読込結果が新しい表示を上書きしないようにする。

BroadcastChannel非対応・作成失敗でもIndexedDBトランザクションの整合性は変わらない。focus、pageshow、可視化、パネルを開く操作でも再取得する。通知なしの背景タブで即時の表示更新は保証しない。

## UI・安全性・制約

R2の簡潔なパネル、カテゴリ別一覧、長い一覧のスクロール、Tab循環・Escape・フォーカス復帰を維持する。保存説明は「ブックマークはこのブラウザーに保存されます。」である。JSONファイルの入出力、専用ページ、ログイン、サーバー保存、クラウド同期は提供しない。保存文字列はtextContentだけで表示する。

IndexedDBが利用できない環境でlocalStorageへ書き戻すフォールバックは行わない。エラーを表示して元データを維持する。端末・ブラウザープロファイル・origin間で自動同期しない。データ消去・プライベートモード終了・ブラウザーの退避／削除等による喪失や、電源断の耐久性を、この検証で保証するものではない。

## 検証と根拠

npm run check、npm test、npm run buildを用いる。従来のWeb Locks／localStorage書戻し専用テストは整理し、旧形式の妥当性・カタログ・ID保護の検査は継承する。IndexedDBの同時操作・移行・中断は実ブラウザーで検証し、再現コードと結果をレビューZIPへ収録する。アプリの依存ライブラリは増やさない。

[IndexedDB仕様のトランザクション](https://www.w3.org/TR/IndexedDB-2/#transaction-concept)と[スケジューリング](https://www.w3.org/TR/IndexedDB-2/#transaction-scheduling)が、重なるreadwriteトランザクションの直列化とコミット／中断を規定する。新しいドラフトの説明だけに依存せず、実行ブラウザーと条件を検証結果に記録する。APIの対応資料と実機検証の範囲を区別する。
