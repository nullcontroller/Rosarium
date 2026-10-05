# 内部構造監査（2026-10-06）

## 固定する外部仕様
公開URL・redirect・本文・見出し・SEO・GA4・Lifecycle・検索・目次・Navigation・CSSを維持する。変更前の生成ファイルと14ページ×4viewport×2themeの112画面を保存して比較する。

## 監査結果と変更範囲
- Navigationはlib/navigation.tsが既に正本。PageHeader、Home、Siteが個別にflat/findしており、共通参照関数へ整理する。
- SiteはTOC生成・SEO・Navigation・描画が混在。純粋なSidebar表示条件とページ種別判定だけをlayout-policy.mjsへ分離する。
- ArchiveListとarchiveページの目次が同じカテゴリで繰り返しfilterする。archive.tsの分類・順序を共通groupingへ集約する。
- PageHeaderの説明文配列生成が重複している。markupを維持して一度だけ計算する。
- Lifecycleの公開判定はsite.tsが既に正本。ACTIVE-onlyとOBSOLETEを含む通常公開判定は異なる意味なので統合しない。
- icon mappingはicons.ts、TOC抽出はpage-contents.mjs、AI/DXテーマ描画はDomainThemeSectionが既に共通化済み。
- content.config.tsのprimaryCategoryはDX分類、section/layer/kindは別責務。互換metadataを削除しない。

## あえて維持する箇所
- CSSとdesign tokenは値・cascadeを含め変更しない。重複するdark paletteはOS自動選択と明示選択の別selectorで必要。
- Home Heroは固有markupを持つためPageHeaderへ強制統合しない。
- GlobalSearchはquery世代管理・URL state・keyboardの一つのcontroller。分割だけの変更はしない。
- InteractiveCaseDiagramは既存共通controllerを利用。SupportDxDiagramは別の操作構造であり強制統合しない。case-diagramsは図の静的データなので長さだけを理由に分割しない。
- NavIconはsize指定wrapperとして責務がある。明確に未使用と証明できないhelper/component/CSSは削除しない。
- books/seriesを含む互換redirectとmigration scriptは維持する。
- URL生成、SEO構造、RSS/sitemap/Pagefindの公開条件、Reference独立ページ例外を変更しない。

## 変更前検証
check: 119 files、0 errors/warnings/hints。test: 31成功。build: 138 HTML pages。
リンク、index、Lifecycle、Navigation、公開サイト、brand assets、accessibility、performance、SEO、Analytics、最終更新、TOC監査成功。
112画面で横overflowなし。TOC117、Reference115、空タブなし。
