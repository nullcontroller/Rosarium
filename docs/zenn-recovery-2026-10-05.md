# 過去Zenn記事の復元・ライフサイクル移行（2026-10-05）

## 調査範囲と結果

- 添付40.Zenn.zipの現存記事16件、HEADまでの6コミット、mainとorigin/main、reflog、全92 Gitオブジェクトを照合。
- Git削除履歴は articles/test.md 1件。削除前コミットから本文全体を取得できたが、未公開の連携・図表示テストのためDELETE（移行しない）とした。実記事のDELETEは0件。
- 到達不能blob 2件は.gitignoreとREADMEで、追加の記事本文ではなかった。Codex checkpoint ref 1件はZIP内で無効な参照のため、--allではなく有効なmain履歴・reflog・全オブジェクトを照合した。templates/article.mdとREADME内の見本frontmatterは下書き記事ではないため除外。実記事の下書き・完全重複は0件。確認できた実記事の復元不能・部分復元は0件。ZIP外や欠落したGitオブジェクトに存在したかもしれない記事は推測しない。
- Zenn現行URLの直接GETは実記事16件とも404（取得時刻はJSONに記録）。404だけでは削除・非公開・掲載終了の区別はできない。Web検索の旧キャッシュを現行公開の証拠にはしない。
- 現存16件は全件既存Rosariumへ移植済み。二重登録せず、既存URLを維持した。既存の現役9件と旧記事3件の本文は変更していない。退役4件は、添付原文から本文を復元し、同じURLの統合案内・転送を置換した。
- 原文16ファイルをmigration/zenn-recovery-2026-10-05/articles/へバイト単位で保存した。これは非公開の移行証跡で、サイト出力・Content Collectionには含まれない。SHA-256はJSONへ記録。
- ZIP内のBook 3件・章22件も既存移行マニフェストと照合済み。Rosariumは別スナップショット由来の補完2章を含め24章の移行証跡を既に保持しているため、巻き戻し・重複公開はしない。

## 定義・公開方針

- ACTIVE: 現在の考え方・推奨として読む。
- OBSOLETE: 現在の推奨ではないが、当時の前提・判断に参考価値がある。旧記事欄、灰色表示、記事ごとの理由を付ける。
- RETIRED: 独立記事の役割は終了。通常一覧・テーマ代表・Feed・Pagefind・sitemapから外すが、URLと原文を維持する。
- DELETE: テスト、誤公開、完全重複、公開不適切、実体のない内容のみ。

従来のstatus（published / archived等）は出版状態として保持し、lifecycleを別に持つ。公開URL生成はpublishedEntry、通常導線はpublicEntryで制御する。既存Caseのrecommended / activeはACTIVE、reference / obsoleteはOBSOLETE、retiredはRETIREDの意味に対応する。Caseの既存位置づけやGPT-4のみという本人確認済み前提は変更しない。

RETIRED 4件はすべて既存コンテンツへ統合済みであり、現在の推奨と重複して検索される必要が薄いため、今回の4件に限ってnoindexとする。canonicalは後継記事への転送先ではなく各保存URL自身とし、直接閲覧できる状態を明示する。ACTIVE・OBSOLETEはindex可能。元の公開日時を保持し、移行日はlast_updatedにのみ記録する。公開日不明のテストへGit日時から日付を発明しない。

## 全対象記事

| 原タイトル | 元slug | 元公開日時 | Zenn現行 | 既存Rosarium | 判定 | 判定理由 | 移行先slug | 復元元 |
|---|---|---|---|---|---|---|---|---|
| 生成AI教育はなぜ難しいのか ― 変わらない原則と変わり続ける実践を分けて設計する | 00d48d3802ff49 | 2026-08-14 07:35 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | practices/ai-education-principles | ZIP内current file |
| AIは使われている。でも使いこなされていない | 15bcff341ff67b | 2026-03-28 14:37 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | practices/ai-adoption-and-effective-use | ZIP内current file |
| AIを使い分ける基準は、モデル性能よりコンテキストではないか | 1c9ec1d7e01206 | 2026-08-22 10:28 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | knowledge-context/context-before-model-performance | ZIP内current file |
| 全員の業務が違うのに、AI活用事例をそのまま横展開できるのか | 3a18f3f15b840a | 2026-08-27 22:58 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | practices/transferring-ai-practices | ZIP内current file |
| 採用される側から見たAI人材の転職概況 | 4f6be09295656b | 2026-08-20 08:25 | 404・公開取得不可 | あり | OBSOLETE | 2026年8月時点の転職市場や職種の見え方を、採用される側から記した記事です。市場の状況は変わるため、現在の求人動向や職種選択の推奨としては扱いません。 | essays/ai-career-market | ZIP内current file |
| AIはどこへ進化しているのか — モデル競争の裏にある「構造」と「エコシステム」 | 5b8a6a1c413e10 | 2026-03-08 22:05 | 404・公開取得不可 | あり | RETIRED | AI企業をエコシステムと生成能力で二分する当時の説明は、現在のContextを基準にした使い分けの考察へ役割を統合しています。この内容は独立した記事としての役割を終えています。 | essays/model-competition-and-ecosystems | ZIP内current file |
| AI人材はFDEだけではない――これから進む専門職の細分化 | 5bbc6c7f86194f | 2026-08-17 07:26 | 404・公開取得不可 | あり | OBSOLETE | 公開当時のFDEという職名とAI人材の役割分化を論じた記事です。職名や各社の責任範囲は変化するため、現在の職種分類としてではなく、当時の考察として扱います。 | essays/ai-roles-beyond-fde | ZIP内current file |
| 設計支援AIは消えない。コード生成の次に残る領域 | 6c399a260e0535 | 2026-04-09 00:14 | 404・公開取得不可 | あり | RETIRED | 設計支援とコード生成を分ける論点は、現在の「コード生成AIはなぜ業務を変えないのか」へ統合されています。この内容は独立した記事としての役割を終えています。 | software-engineering/ai-design-assistance | ZIP内current file |
| AIは自動化できる。しかし、その出力を確定値として扱ってはいけない | 7e06dd0e4e67d2 | 2026-08-07 19:26 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | foundations/generation-and-acceptance | ZIP内current file |
| AI時代において「レビューできる人」が価値を持つ理由 | 7f7cb55c4ebcaa | 2026-03-28 14:46 | 404・公開取得不可 | あり | RETIRED | 人によるレビューの価値は、現在の責任境界とHITLの設計に統合されています。この内容は独立した記事としての役割を終えています。 | evaluation-hitl/human-review-capability | ZIP内current file |
| LLMを確率モデルとして設計するという立場 | a1ac10c371e230 | 2026-02-28 18:58 | 404・公開取得不可 | あり | RETIRED | LLMを数学的・確率的な対象として扱う立場は、現在のAI理論トップに統合されています。この内容は独立した記事としての役割を終えています。 | foundations/llm-as-probabilistic-model | ZIP内current file |
| 「AIエージェントを0から作る時代」は本当に来るのか？ | c95d77150aa590 | 2026-05-07 22:47 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | architecture/agents-tools-and-workflows | ZIP内current file |
| AI生成コンテンツは、なぜ信頼されにくいのか | dfd99f00db85d7 | 2026-08-23 11:47 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | essays/trust-in-ai-generated-content | ZIP内current file |
| コード生成AIはなぜ業務を変えないのか — 設計支援として使うべき理由 | ecf0bcfd611d7f | 2026-04-03 21:02 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | software-engineering/code-generation-and-work-design | ZIP内current file |
| 理解できないシステムは、コストである | f5c1a1276d2191 | 2026-04-12 19:01 | 404・公開取得不可 | あり | OBSOLETE | 旧AI環境下で行った仕様復元とRAGへの再利用を紹介する記事です。現在はGitHub Copilotがコードベースを参照できるため、ここで述べた理解の手順を現在の推奨構成としては扱いません。人による確認と判断は引き続き必要です。 | cases/understanding-systems-as-capability | ZIP内current file |
| 私が考えるAI駆動開発 ― AI・人間・成果物をどうつなぐか | fccbf170ead145 | 2026-08-15 08:42 | 404・公開取得不可 | あり | ACTIVE | 独立した問い・判断原則が現在の記事と補完関係にあり、現在の推奨を妨げる旧前提を確認していないため。 | software-engineering/ai-driven-development | ZIP内current file |
| GitHub連携からZennへ投稿してみる | test | 不明 | 非公開テスト・未照会 | なし | DELETE | GitHub/Zenn連携と図表示を確認する非公開テスト記事。実記事ではないため移行しない。 | 移行しない | 16a96adの削除前コミット（6d2d706） |

## 本文・記法の扱い

新しい現代化・要約・本文生成は行っていない。RETIRE済み4件は原文を使用し、レイアウトが生成するh1との重複削除、既存ローカル画像パスへの変換、空altへの図タイトル付与だけを行った。数式・コード・表・処理フローは保持する。

原文のMermaid 2箇所（transferring-ai-practices）は既存のSVG化済み公開本文を維持し、Mermaidを実装へ再導入しない。原文のPlantUML名称は非公開スナップショットに履歴として残るが、現在の図機能の依存にはしない。既存移行済み外部画像はローカルアセットを維持する。独立16記事にZennのmessage/details/embed専用構文は検出しなかった。必要な本文参照は既存Markdown処理を維持し、新しい関連記事・CTAは追加しない。

過去のdocs/zenn-knowledge-lifecycle-audit-2026-10-03.mdは当時の判断記録として保持する。今回の16記事の公開・退役扱いは本記録とJSONを正本とする。

## Garden Notes

2026-10-05の1エントリに「過去のZenn記事を確認・復元し、ACTIVE・OBSOLETE・RETIREDに分類」を記録。Homeは自動的に最新1件だけを表示する。

## 証跡と検証

詳細はmigration/zenn-recovery-2026-10-05.jsonを参照。scripts/verify-content-lifecycle.mjsで原文ハッシュ、復元本文ハッシュ、元公開日、全16URL、記事別note、退役記事の一覧・Feed・sitemap・検索除外を検証する。scripts/content-lifecycle.test.mjsで退役公開とdraft/private非公開の境界を検証する。

## 変更ファイル一覧

- `docs/zenn-recovery-2026-10-05.md`
- `migration/zenn-recovery-2026-10-05.json`
- `migration/zenn-recovery-2026-10-05/articles/00d48d3802ff49.md`
- `migration/zenn-recovery-2026-10-05/articles/15bcff341ff67b.md`
- `migration/zenn-recovery-2026-10-05/articles/1c9ec1d7e01206.md`
- `migration/zenn-recovery-2026-10-05/articles/3a18f3f15b840a.md`
- `migration/zenn-recovery-2026-10-05/articles/4f6be09295656b.md`
- `migration/zenn-recovery-2026-10-05/articles/5b8a6a1c413e10.md`
- `migration/zenn-recovery-2026-10-05/articles/5bbc6c7f86194f.md`
- `migration/zenn-recovery-2026-10-05/articles/6c399a260e0535.md`
- `migration/zenn-recovery-2026-10-05/articles/7e06dd0e4e67d2.md`
- `migration/zenn-recovery-2026-10-05/articles/7f7cb55c4ebcaa.md`
- `migration/zenn-recovery-2026-10-05/articles/a1ac10c371e230.md`
- `migration/zenn-recovery-2026-10-05/articles/c95d77150aa590.md`
- `migration/zenn-recovery-2026-10-05/articles/dfd99f00db85d7.md`
- `migration/zenn-recovery-2026-10-05/articles/ecf0bcfd611d7f.md`
- `migration/zenn-recovery-2026-10-05/articles/f5c1a1276d2191.md`
- `migration/zenn-recovery-2026-10-05/articles/fccbf170ead145.md`
- `package.json`
- `scripts/content-lifecycle.test.mjs`
- `scripts/recover-zenn-articles.mjs`
- `scripts/verify-content-health.mjs`
- `scripts/verify-content-lifecycle.mjs`
- `scripts/verify-index.mjs`
- `src/components/ContentIndex.astro`
- `src/components/ContentLink.astro`
- `src/components/LifecycleNote.astro`
- `src/components/PublicationLink.astro`
- `src/content.config.ts`
- `src/content/architecture/agents-tools-and-workflows.md`
- `src/content/cases/understanding-systems-as-capability.md`
- `src/content/essays/ai-career-market.md`
- `src/content/essays/ai-roles-beyond-fde.md`
- `src/content/essays/model-competition-and-ecosystems.md`
- `src/content/essays/trust-in-ai-generated-content.md`
- `src/content/evaluation-hitl/human-review-capability.md`
- `src/content/foundations/generation-and-acceptance.md`
- `src/content/foundations/llm-as-probabilistic-model.md`
- `src/content/knowledge-context/context-before-model-performance.md`
- `src/content/practices/ai-adoption-and-effective-use.md`
- `src/content/practices/ai-education-principles.md`
- `src/content/practices/transferring-ai-practices.md`
- `src/content/software-engineering/ai-design-assistance.md`
- `src/content/software-engineering/ai-driven-development.md`
- `src/content/software-engineering/code-generation-and-work-design.md`
- `src/data/recent-growth.ts`
- `src/lib/ai.ts`
- `src/lib/dx.ts`
- `src/lib/site.ts`
- `src/pages/[...id].astro`
- `src/pages/[section]/index.astro`
- `src/pages/essays/model-competition-and-ecosystems.astro`
- `src/pages/evaluation-hitl/human-review-capability.astro`
- `src/pages/foundations/llm-as-probabilistic-model.astro`
- `src/pages/garden-notes.astro`
- `src/pages/software-engineering/ai-design-assistance.astro`
- `src/styles/global.css`

