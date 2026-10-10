# Rosarium

Rosariumは、AIを主軸に、設計・実務・思想を考察するPersonal Technical Siteです。AIだけでなく、文脈に応じてDXなど周辺の技術・設計領域も扱います。

MarkdownをGitで管理し、レビュー・検証を経てAstroから静的HTMLを生成します。

**[サイトを見る](https://rosarium-tech.com/)**

[キャリア](https://rosarium-tech.com/career/) / [AI](https://rosarium-tech.com/ai/) / [DX](https://rosarium-tech.com/dx/) / [企画](https://rosarium-tech.com/planning/)

中心テーマ：Applied AI / System Architecture / Knowledge・Context / Evaluation・HITL / AI-Assisted Software Engineering / AI System Lifecycle。
既存システムの改善・モダナイゼーションは、設計原則を適用した実務事例として扱います。

価値発見と業務要件の定義を、今後深めたい専門領域として[企画](https://rosarium-tech.com/planning/#purpose)に整理しています。現在の実務実績とは区別して扱います。

## 領域の境界

- **企画**：何を、なぜ、どこまでシステム化するか。業務課題、業務要件・業務目標、価値・KPI、対象と対象外、投資・優先順位を決め、業務要件を要件定義へ渡します。
- **要件定義・システムアーキテクチャ**：与えられた業務要件を、実現可能な機能・非機能要件、役割分担、方式、検証・移行・運用へ具体化します。
- **DX**：デジタル技術による業務・価値・組織の変化を扱います。企画と同義ではありません。
- **AI**：AIの性質と、AI・人間・既存システムを組み合わせる設計・実践を扱います。**実践事例**は実際の担当範囲と確認できた結果を示します。

企画 → 業務要件・業務目標 → システム要件 → 実現方式を区別します。PoCや利用者評価から前段へ戻る反復も含めます。企画入口は既存の知識記事を横断参照し、現時点では企画担当の実務Caseを掲載していません。分類の詳細は[執筆ガイド](docs/authoring-guide.md#企画要件定義dxの判断基準)を参照してください。

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

[Career](https://rosarium-tech.com/career/) — 設計思想と実践事例へのPortfolio Gateway。詳細な職務プロフィールはCareerからLinkedInへ案内します。

開発記録はdocs/historyへ保存し、Project・Tools・Journalは公開しません。
