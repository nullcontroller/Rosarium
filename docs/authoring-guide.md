# Authoring Guide

このRepositoryはKnowledge / Publishing as Codeの母艦です。本文の正本は標準Markdownです。
既存Zennの文章を統合・要約・リライトする場合は、移行作業と分離してレビューしてください。

## 新規ページ

`src/content/{section}/{semantic-slug}.md`を追加します。通常ページはMDXを使いません。
英小文字・数字・ハイフンのsemantic slugを使い、公開後はURLを安易に変更しません。
ファイルの相対パスがURLになります。例：`foundations/acceptance-boundary.md` → `/Rosarium/foundations/acceptance-boundary/`。

```yaml
---
title: "採否判断の境界"
summary: "このページが扱う範囲を簡潔に記述する。"
kind: principle
section: foundations
layer: ai-design
design_topic: applicability
status: draft
order: 10
tags:
  - Applied AI
  - HITL
published_at: "2026-09-21"
updated_at: "2026-09-21"
update_type: expanded
update_note: "責任境界と実行権限の整理を追加"
---
```

タイトルは共通レイアウトがH1として表示します。本文の見出しは`##`から始めます。
新規記事に出典や日付を捏造しません。公開日・更新日は不明なら省略できます。
内容を実質的に変更した場合は`updated_at`を設定します。変化の種類を明示する必要がある場合だけ、`update_type`（new / updated / expanded / revised / connected / reframed）と1行の`update_note`を追加します。Homeと`/updates/`はこれらの値から自動生成されます。
`summary`は必須です。本文で実際に扱う内容を1〜2文で要約し、タイトルから推測しません。すべての一覧・章目次・前後リンク・検索結果はこの値だけを概要として表示します。本文を変更したら概要も確認してください。

## Layer / Topic / Source

layerは知識の役割、sectionは既存のテーマとURL用分類、source.typeは出典です。これらを混同しません。

| layer          | 役割                                   |
| -------------- | -------------------------------------- |
| ai-design      | 現在の設計知識の正本                   |
| ai-mathematics | AIの振る舞いを説明する数学・モデル基礎 |
| practice       | 組織・業務・開発への適用               |
| case           | 実務事例                               |
| publication    | 独立した記事・Book・Essay              |
| project        | プロジェクトの記録                     |
| reference      | 用語・参照資料                         |

AI Designはdesign_topicも必須です。applicability / responsibility-control / architecture / knowledge-context / evaluation-hitl / software-engineering / lifecycle-operationsから選びます。
既存URLはlayerに合わせて移動しません。旧foundationsの文書も同じURLを維持します。新規本文の物理配置と公開URLは編集時に決め、公開後は維持します。

記事一覧は出版物の横断ビューです。Zenn由来のLLM確率モデル記事のように、layerがai-mathematicsでも出版元情報を保持したまま掲載できます。出典だけでlayerを自動判定しません。
PublicationのTypeはBook、kindがessayならEssay、それ以外はArticle。sourceの元typeは保持し、章はBookの目次から辿ります。未確認の公開日は捏造せず、判明している月だけを「YYYY年M月」と表示します。現在も連載中のBookは`publication_status: ongoing`で「連載中」と表示し、Rosariumでの最終更新日は`last_updated`として別に扱います。

AI Designの正本一覧にはZennを混在させません。Related Publicationsはsrc/lib/navigation.tsの明示的な文書ID対応表で管理します。Case Studiesも同ファイルでBook・注目章・関連原則を接続し、本文は複製しません。

## Section / kind / status

| section              | 内容                                      |
| -------------------- | ----------------------------------------- |
| foundations          | 変わりにくい設計原則                      |
| architecture         | 全体構成・権限・Workflow・Lifecycle       |
| knowledge-context    | RAG・Context・Evidence・情報更新          |
| evaluation-hitl      | 評価・レビュー・承認・判断条件            |
| software-engineering | AIを用いたソフトウェア開発・Orchestration |
| practices            | 教育・導入・横展開・適用判断              |
| cases                | 原則を適用した実務事例                    |
| essays               | 市場・キャリア・技術に関する論考          |

`kind`: `principle`, `architecture`, `guide`, `case`, `essay`。
`status`: `draft`（非公開）、`published`（公開）、`stable`（安定）、`archived`（過去資料）。記事の更新状態には使用せず、内容を変更した日は`last_updated`を更新します。
移行時は著者による安定性を推測せず、公開済みContentを`published`として扱います。
Draftはページ生成・ナビゲーション・検索対象から除外しますが、公開GitHubリポジトリのソース自体は閲覧可能です。
機密情報の保存場所として使わないでください。

## 意味構造のDirective

通常の文章・リスト・表・コード・画像は標準Markdownで書きます。
意味を明示する必要がある箇所だけ、以下の7種類を使います。
HTML代わりの独自言語として増やしません。未定義のcontainer directiveはビルドエラーです。

```markdown
:::principle{title="設計原則"}
AIが生成できることと、業務で採用してよいことは別である。
:::

:::decision{title="設計判断"}
AI出力は中間成果物として扱う。
:::

:::risk{title="リスク"}
誤生成だけでなく誤実行まで考慮する。
:::

:::responsibility{title="責任境界"}

- AI：候補生成
- 人間：採否判断
- 既存システム：確定処理
  :::

:::evidence{title="根拠"}
判断に使用した情報や評価結果。
:::

:::case{title="実務事例"}
実際に適用した事例。
:::

:::note{title="補足"}
補足情報。
:::
```

Directiveは段落間の独立ブロックとして使います。`title`は省略できます。
`remark-directive`がASTを解析し、対応するAstro Componentで`section`、`figure`、`aside`として出力します。
通常のコロン記号は独自インライン記法として扱いません。

## 図 / コード / 数式

静的な構造図はSVGアセット、操作可能な理解支援図は既存のSVG＋TypeScriptコンポーネントを利用します。
静的図はLight / Darkの既存表示を保存し、JavaScriptに依存せず表示します。コードはShikiでハイライトします。
数式は`$...$`と`$$...$$`に対応し、KaTeXのフォント・CSSもbundleします。
`<br/>`はそのまま使えます。スクリプトやiframeをMarkdownへ追加しないでください。

## 画像・リンク

新規画像は`public/assets/`へ配置し、本文では`![説明](/assets/example.png)`と記述します。
共通Markdown処理がPagesのbaseを付加します。Zenn移行画像は`public/assets/imported/zenn/`です。
外部画像の代替を勝手に生成しません。

内部リンクは`[表示名](/foundations/acceptance-boundary/)`のようにカテゴリから始まる絶対パスにします。
末尾スラッシュを付け、`.md`へのリンクにしません。baseはHTML変換時に付加されます。
同ページ内は`#見出し-id`。`npm run build`は内部リンク・画像・アンカーを検査します。

## Series / Book

シリーズ概要：`src/content/cases/example-series.md`。
章：`src/content/cases/example-series/chapter-topic.md`。
全ページに`series: example-series`、`series_title: "シリーズ名"`を設定します。
概要は`order: 0`、章は`order: 1`から連番にします。概要には必要なら`cover: /assets/cover.jpg`。
各章で全章目次・現在の章・前後リンクを自動生成します。
移行Bookの順序は元`config.yaml`の`chapters`を正とします。初回移行では変更しません。

## 出典とcanonical

Zenn由来ページは`source`に元slug、Book/Chapter slug、type、topics、公開日、URL、元front matterを保持しています。
`canonical`には元Zenn URLを設定しています。将来の正規URL切替はこの値の変更としてレビューします。
Git-nativeページでは`source`と`canonical`を省略すると、自身のPages URLがcanonicalになります。
元Book・章は公開月がcatalogにある場合のみ保持し、正確な公開日は未確認のままです。

## 検証と公開

```sh
npm ci
npm run check
npm test
npm run build
npm run preview
```

`check`はAstroの型・schemaと移行完全性を検証します。`build`は静的HTMLとPagefind索引を生成し、リンクを検証します。
移行済み本文の編集でハッシュ検証が失敗した場合は、意図した本文変更かレビューし、台帳の変更理由とハッシュも同じコミットで更新してください。失敗を無条件に無効化しません。

`master`へpushするとGitHub Actionsが公開します。default branchを`main`へ変更しません。
Repository Settings → Pages → SourceはGitHub Actionsに設定します。
Zennとの自動双方向同期は行いません。

## 初回移行の再現

`scripts/migrate.mjs`は初回移行専用です。元READMEが現行READMEへ置き換わる前のスナップショットに対して実行するため、通常の編集・buildでは実行しません。
元Zennと公開Wikiのcommit、各ファイルのハッシュ、変換先は`migration/`に記録しています。
catalogは分類根拠、templatesは参考資料として扱い、公開記事として水増ししていません。

## 個人統合サイトの公開方針

サイトブランドは「Rosarium」。Authorである立林 裕太朗のCareerと、技術知識・公開物を同じサイト内で閲覧できる構成です。
Careerは src/content/career/overview.md の1ページで人物・仕事観・今後の志向を扱います。実践内容はCases、客観的な職歴・資格はLinkedInを正本とし、Career Detailsは旧URLの転送だけを維持します。職歴・条件の事実変更は依頼に基づいて行います。

sourceとcanonicalの移行元情報は内部資料として保持します。公開ページのcanonicalは自サイトです。
公開UIにはSource表示を追加せず、GitHub・Zenn・旧Careerサイトへのリンクを出しません。
MarkdownBodyが対応する出典URLを内部リンクへ変換し、未対応のリンクはテキストとして残します。
技術本文は保持し、変換は公開時に行います。

Project・Tools・Project Journalは公開しません。開発記録は docs/history に保持します。
移行概要ページは public: false として保存し、一覧・検索・ページ生成から除外します。

## Bookと連載の表示分類

DX入口を持つコンテンツには、`primaryCategory`を必ず1つ指定します。「この記事を1つだけ棚に置くならどこか」を本文の中心的な問いから判断します。`secondaryCategories`には、他に関係する論点を0件以上指定できます。主カテゴリと同じ値や重複値は指定しません。

カテゴリIDは`value-design`（価値設計）、`business-transformation`（業務変革）、`selection-retirement`（選択と廃止）、`system-transformation`（システム変革）、`continuous-value`（継続的価値創出）です。DXトップとカテゴリ一覧は主カテゴリだけで分類します。副カテゴリは記事の横断導線に使用でき、同じ記事を複数の主カテゴリへ重複表示するためには使いません。

各テーマの入口として最適な記事1件（必要なら最大2件）に`featuredInCategory: true`を指定します。CaseはDXトップの代表記事にはしません。旧`dx_topic`・`dx_topics`は使用せず、記事本文・既存URL・sourceの来歴情報は維持します。

publication_format（article / book / series / essay）で公開形式を指定します。
source.original_typeは元の形式として保持し、サイト上の分類には使用しません。
実務BookはCase Studies、連載は /series/、横断索引は /overview/ から参照します。

## 読者の目的と知識分類

Homeと `/articles/` は、出版形式ではなく読者の目的を入口にします。現在の目的分類は `src/lib/use-cases.ts` で管理し、既存の `layer`、`design_topic`、`section`、`tags` から導出します。1つのページは複数の目的に所属できます。

`AI Design`、`AI数学論`、`Practices`、`Case Studies` は知識体系の分類として維持します。`Article`、`Book`、`Series`、`Essay` は `publication_format` で保持しますが、一覧では補助情報として表示します。同じ意味の分類をfront matterへ重複して追加せず、新しい目的が必要になった場合は既存メタデータで安定して判定できるかを先に確認してください。

## 文章の段落と行長

段落は文字数ではなく、主張・理由・条件・対比・結果などの意味のまとまりで分けます。「しかし」「そのため」「一方」などで論点が切り替わる場合は、段落を分ける候補とします。同じ主題を説明する短い文はまとめ、1文ごとの分割や大量の`<br>`は避けます。

3項目以上の独立した説明は箇条書きを検討します。短い並列語や、同じ判断に必要な前提は無理に分解しません。見出し直後は節の主題を示し、その後に詳細や判断理由を続けます。

本文幅は日本語の読みやすさとDesktopの余白を両立します。`ch`は日本語の文字数と一致しないため、60〜75chを機械的に適用して本文だけを狭めません。本文全体の上限70remと画面幅を使い、段落間は約1emに保ちます。変更時は文章・数値・リンク・Front Matterを保持し、Mobileでも過剰な分割や余白がないことを確認します。

## 主要事例の理解支援図

主要3事例の読者向け可視化は、SVGとTypeScriptで実装します。`src/data/case-diagrams.ts`でノード・役割・分岐・説明を管理し、本文では`<div data-case-diagram="system-understanding"></div>`のように共通コンポーネントを呼び出します。顧客サポートDXの全体図は既存の専用レイアウトを維持し、選択操作を共通化しています。

人間は破線、AI支援は太線、知識は淡い背景、判断は丸みと強調線、評価・再利用は別背景で表します。色だけに依存しません。JavaScript無効時も静的SVGと説明へのアンカーが残ります。

主要事例の全体図と章ごとの詳細図は、SVG＋TypeScriptを正本とします。旧生成図は置き換え、専用の図記法・レンダラーは使用しません。新しい理解支援図を過去に作成した実物として掲載しません。記事の既存構造図も静的SVGとして表示します。
