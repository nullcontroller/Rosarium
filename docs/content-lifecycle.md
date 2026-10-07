# コンテンツのライフサイクル

- ACTIVE：現在の考え方・推奨内容として公開する。
- OBSOLETE：現在の推奨ではないが、当時の前提や判断に参考価値がある。通常一覧から外し、`/retired/obsolete/` と検索で確認できる。
- RETIRED：独立した記事の役割を終えた記録。通常一覧・テーマ・Home・RSS・sitemapから除外し、`/retired/retired/` のカテゴリ別一覧と自身のURLで公開を維持する。内部検索では「退役記事」を明示的に選択した場合だけ表示する。
- DELETE：テスト・誤公開・完全重複など、履歴としても残す意味がない場合に限る。

`lifecycle` はContent Collectionを正本とする。`/retired/`（旧記事・退役記事）は、旧記事・旧事例・退役記事の3入口。OBSOLETEはCase metadataで旧記事と旧事例を分け、RETIREDは種別を問わず同じ保存領域へ入る。各一覧は公開可能な記事・Caseをmetadataから取得し、カテゴリ別に元の公開日・要約・理由を表示する。Caseも同じlifecycleを使い、独自の状態は持たない。通常一覧はactiveEntryでACTIVEのみ、SEO・Feedの公開範囲はpublicEntryで制御する。
保存領域は左サイドバーでReferenceと別グループに置く。Mobileは上部メニューから入口へ進み、Referenceは補助領域に残す。

保存領域の入口・一覧とRETIRED個別記事は `noindex, follow`（OBSOLETE個別記事はindex可能）、canonicalは自身のURLとする。本文を現在の考え方へ書き換えず、位置づけと理由を注記する。

Pagefindには公開記事のLifecycleを登録する。検索の初期値はACTIVE・OBSOLETEがON、RETIREDがOFF。内部検索への登録と外部検索エンジンのindex可否は独立して管理する。退役記事一覧自体は内部検索対象にも含めない。

Bookは一覧の1件として扱い、章は既存の章ナビで参照する。章にもBookと同じlifecycleと理由を明記し、内部検索でも位置づけが一致するようにする。
