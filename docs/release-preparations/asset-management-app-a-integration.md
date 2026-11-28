# 資産管理アプリA 統合Bookの公開・統合記録

著者の正式承認対象：Rosarium-asset-management-app-a-final-author-review-20261128.zip（a302cd9）。公開設定を2026-11-28 JSTに適用する。本番デプロイと受入確認の結果は同日の完了報告ZIPへ記録する。

## 正本と公開仕様

- Book：cases/asset-management-app-a-architecture、目次と全7章。承認原稿の本文・図解を維持し、初回公開日・最終更新日を2026-11-28にする。
- 元記事：cases/ai-development-management。原稿・初回公開日・過去履歴・IDを保持して統合済みとし、現行事例の二重掲載を解消する。
- 明示的な後継記事：cases/asset-management-app-a-architecture/development-management（第6章）。
- 統合関係と旧9節の対応はsrc/data/case-integrations.mjsを正本とし、既存のcompatibility-urls.mjsから参照する。54件目の互換URLとして登録する。
- 旧URLは静的HTMLのmeta refresh・JavaScript・手動リンクによる案内。HTTP 301ではない。queryの同名複数値を保持し、既知のhashは対応する節、未知のhashは第6章の既定節へ案内する。
- 元記事のcollection/idを保存データから書き換えず、既存カタログの明示的な後継解決で案内する。新規登録はBook目次・7章が対象。

## 更新履歴

トピック：個人資産管理Webアプリの設計・開発事例をBookに統合

資産管理アプリAのシステム方式設計と生成AIを活用した開発管理を一つのBookに統合し、対象範囲の定義、技術選定、運用設計、開発管理及び品質保証を全7章に整理しました。

同日既存トピックと元記事の初回公開記録を保持し、新規Book公開と元記事統合の操作を記録する。同日の異なる操作はIDと操作の組で識別し、公開リンクは記事IDごとに一度表示する。

## 受入確認

承認ZIPとの本文・図解照合、日付、全7章・目次の公開、元URLのquery/hash、検索・sitemap・SEO、既存/新規ブックマーク、PWA、PC/スマートフォンのLight/Dark、匿名化を確認する。自動ブラウザーは既存のGA4除外ヘルパーを初回遷移前に適用する。

本番反映コミット、GitHub Actions、本番の表示証跡、テスト・ビルドと残存する未確認環境はRosarium-asset-management-app-a-integrated-book-production-20261128.zipを参照する。完了報告の記録をもって本番受入結果を確定する。
