# 情報アーキテクチャ再設計（レビュー待ち）

承認仕様：2026-11-27の確定実装指示。基準masterは `86766abeebb01192b3f4030990d03faf30bf1057`。本変更はステージング限定であり、本番公開はセリーヌの最終レビューと著者の明示承認後に行う。

## 正本と責務

- 主所属：`src/data/knowledge-domains.mjs`。Referenceの4資料は現在の所属を維持する。旧layer・design_topic・entry_pointsは既存原稿とフィード等の互換情報であり、主所属として再解釈しない。
- AI・数理の目次：`src/data/ai-knowledge-groups.mjs`。5領域・19記事のIDと順序のみを持ち、表示タイトルは原稿から取得する。
- 互換URL：`src/data/compatibility-urls.mjs`。53URLの転送先と既知のhashを管理する。URLの解決処理もここに置く。
- 仮想設計：`src/data/design-studies.mjs`。`idBase`は既存IDの基底、`listingTarget`は表示先、`caseId`は起点となる実務事例であり、互いの代用にしない。6記事はBookの実務11章には含めない。
- 個別に監査した本文中の案内リンク：`navigation-link-exclusions.mjs`。元Markdownと表示文言を保存し、特定したsource・target・textの組だけを表示時に非リンク化する。論証・定義・出典を一括除去しない。
- Careerの実績出典4リンク、共通ヘッダー・左ナビ・検索・サイトマップ・パンくず・GARDEN NOTESは維持する。

## ビルドと互換性

通常ビルドではAstroの後、Pagefindの前に `node scripts/generate-compatibility.mjs` を実行する。互換HTMLはnoindexで、通常の記事検索とsitemapへ含めない。JavaScriptのlocation.replaceとmeta refreshによる静的転送であり、HTTP 301を返す処理ではない。

queryの同名複数値も保持し、転送先が指定する値を優先する。既知hashは登録先へ、その他は転送先の既定hashがあればそれを優先し、なければ元hashを保持する。壊れたパーセントエンコードも例外で停止しない。アーカイブの「統合先・移転先」はこの登録正本を参照する。個別Astroソースの解析には依存しない。

レビュー用はプロセス限定の `ROSARIUM_DRAFT_PREVIEW=ia-review-no-drafts ROSARIUM_DISABLE_ANALYTICS=1` でAstroをビルドし、互換HTMLを `dist-review` に生成する。公開用Pagefindをコピーし、未承認の2稿をレビューにも混入させない。通常ビルドの一般読者向けGA4は維持する。

## 検証

`npm run check`、`npm test`、`npm run build` に加え、レビュー用へ `node scripts/verify-index.mjs dist-review` を実行する。旧ページの存在を前提とする検証を新しい受入条件へ更新した。互換ページには記事用の全レイアウトを要求せず、53件のcanonical・noindex・転送先・アンカー・循環・多段化を別に検証する。

`verify-ia-protected-assets.mjs` は今回の変更専用の比較監査であり、将来の正当な記事改訂を禁止する恒久規則ではない。基準版の原稿等のハッシュと、生成後の本文テキスト・数式・表・画像・コードを確認する。fixtureのハッシュを変更して検証を通す運用は行わない。

## 本番承認後に行うこと

実際の公開日（JST）で、情報構造が変わったカテゴリ、Book目次、その他の実質変更ページの日付を既存規約に従って更新する。個別記事の本文・タイトル・初回公開日・最終更新日は今回のIAだけを理由に変更しない。

GARDEN NOTES予定トピック：**サイトの情報構造を再設計し、専門領域の独立性と閲覧性を改善**。AI・数理の5領域化、重複案内ページの統合・廃止、不要な横断導線の整理、事例と仮想設計の関連改善、URL互換と保守構造の簡素化を記録する。現在の公開履歴へ先行追記しない。

## 後続のID監査への引継ぎ

現行IDは原稿の物理パスと関連し、仮想設計は旧一覧の語を基底に含む。今回は既存IDを維持した。移動先URLやナビゲーションの見出しからIDを生成し直さない。永続IDの新体系とブックマークは未実装・別タスクである。
