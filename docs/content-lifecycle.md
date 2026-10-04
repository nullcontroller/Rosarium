# コンテンツのライフサイクル

- ACTIVE：現在の考え方・推奨内容として公開する。
- OBSOLETE：現在の推奨ではないが、当時の前提や判断に参考価値がある。通常一覧の旧記事として確認できる。
- RETIRED：独立した記事の役割を終えた記録。通常一覧・テーマ・Home・RSS・Pagefind・sitemapから除外し、`/retired/` の専用一覧と自身のURLで公開を維持する。
- DELETE：テスト・誤公開・完全重複など、履歴としても残す意味がない場合に限る。

`lifecycle` はContent Collectionを正本とする。退役記事一覧は公開可能なRETIRED記事を自動取得し、元の公開日・要約・退役理由を表示する。
一覧はOBSOLETEとRETIREDの2区分。左サイドバーのReference直下の補助領域、および「Rosariumとは？」のライフサイクル説明から確認できる。上部の主要ナビには追加しない。

退役記事一覧と個別記事は `noindex, follow`、canonicalは自身のURLとする。本文を現在の考え方へ書き換えず、位置づけと理由を注記する。
