# AI・数理 第4段階（非公開レビュー）

基準master: `838b5a321481d3638f3c2cc3f3fff9cd0e0ac240`。第2・第3段階9記事とGA4対策の本番反映・検証後に開始した独立ブランチである。

- N08: `/foundations/mechanistic-interpretability/`
- N15: `/foundations/transformer-computational-limits/`
- N16: `/foundations/neural-symbolic-proof/`

ステージング: `https://nullcontroller.tail8bbb3b.ts.net:8450`（既存の私的Tailscale環境）。3稿はdraft/public:false、初回公開日なし。通常ビルド、検索、sitemapから除外し、レビュー用のみnoindexで表示する。

本文では主要用語を説明し、共通用語集へ27語を追加する。既存用語・アンカーと公開記事本文は維持する。新規SVG6図をLight/Dark用に生成する。`python scripts/math-phase-four/verify.py`で人工例3系統、`python scripts/math-phase-four/render.py`で図を再生成できる。

検証: `npm run check`、`npm test`、`npm run build`、`node scripts/build-review.mjs`、`node scripts/verify-math-phase-four-build.mjs`。詳細な一次資料対応表、導出監査、表示証跡、ステージング配信ハッシュ、変更差分はレビューZIPへ保存する。

保証境界: 実LLMの能力測定なし、Lean/Z3実行なし、Python実装自体の形式検証なし。一部の2025/2026会議資料は公式要旨のみであり本文中にも限定する。数学的恒等式、原典の条件付き定理、研究上の証拠、説明用人工モデルを区別する。

Codexの自己点検のみ。セリーヌによるレビュー及び著者の公開承認を待つ。第4段階はmasterへマージせず、本番公開しない。GARDEN NOTES、既存記事の更新日、UI、GA4運用を変更しない。
