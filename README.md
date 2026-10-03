# Rosarium

Rosariumは、AIを主軸に、設計・実務・思想を考察するPersonal Technical Siteです。AIだけでなく、文脈に応じてDXなど周辺の技術・設計領域も扱います。

MarkdownをGitで管理し、レビュー・検証を経てAstroから静的HTMLを生成します。

**[サイトを見る](https://nullcontroller.github.io/Rosarium/)**

[キャリア](https://nullcontroller.github.io/Rosarium/career/) / [AI](https://nullcontroller.github.io/Rosarium/ai/) / [DX](https://nullcontroller.github.io/Rosarium/dx/)

中心テーマ：Applied AI / System Architecture / Knowledge・Context / Evaluation・HITL / AI-Assisted Software Engineering / AI System Lifecycle。
既存システムの改善・モダナイゼーションは、設計原則を適用した実務事例として扱います。

## Authoring

Node.js 24を使用します。

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

[執筆ガイド](docs/authoring-guide.md)にfront matter、Markdown拡張、Series、公開手順をまとめています。
[検索・Discovery設定](docs/search-discovery.md)と[無料施策チェックリスト](docs/free-discovery-checklist.md)に、Search Console、Bing、Feed、外部Profileの運用手順をまとめています。
`master`へのpushでGitHub Actionsが検証・ビルド・Pagesデプロイを行います。

## Repository

- `src/content/` — Careerと技術領域のMarkdown原文
- `src/components/`, `src/layouts/`, `src/styles/` — 文書UIと意味ブロック
- `src/pages/` — トップ・カテゴリ・本文・検索
- `public/assets/` — ローカル配信する画像
- `migration/` — Zenn・Wikiの台帳、URL対応表、移行報告
- `scripts/` — 移行・完全性・リンク検証
- `.github/workflows/` — `master`用Pages CI/CD

## Provenance

出典と移行時の本文ハッシュはmigration台帳・source metadataで保持します。
公開HTMLのcanonicalは自サイトを指し、GitHub・Zenn・旧Careerサイトへのリンクは公開しません。

[Career](https://nullcontroller.github.io/Rosarium/career/) — 設計思想と実践事例へのPortfolio Gateway。詳細な職務プロフィールはCareerからLinkedInへ案内します。

開発記録はdocs/historyへ保存し、Project・Tools・Journalは公開しません。
