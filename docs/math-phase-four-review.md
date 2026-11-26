# AI・数理 第4段階（非公開レビュー）

基準master: `838b5a321481d3638f3c2cc3f3fff9cd0e0ac240`。第2・第3段階9記事とGA4対策の本番反映・検証後に開始した独立ブランチである。

- N08: `/foundations/mechanistic-interpretability/`
- N15: `/foundations/transformer-computational-limits/`
- N16: `/foundations/neural-symbolic-proof/`

ステージング: `https://nullcontroller.tail8bbb3b.ts.net:8450`（既存の私的Tailscale環境）。3稿はdraft/public:false、初回公開日なし。通常ビルド、検索、sitemapから除外し、レビュー用のみnoindexで表示する。

本文では主要用語を説明し、共通用語集へ27語を追加する。既存用語・アンカーと公開記事本文は維持する。新規SVG6図をLight/Dark用に生成する。`python scripts/math-phase-four/verify.py`で人工例3系統、`python scripts/math-phase-four/render.py`で図を再生成できる。

検証: `npm run check`、`npm test`、`npm run build`、`node scripts/build-review.mjs`、`node scripts/verify-math-phase-four-build.mjs`。詳細な一次資料対応表、導出監査、表示証跡、ステージング配信ハッシュ、変更差分はレビューZIPへ保存する。

保証境界: 実LLMの能力測定なし、Lean/Z3実行なし、Python実装自体の形式検証なし。一部の2025/2026会議資料は公式要旨のみであり本文中にも限定する。数学的恒等式、原典の条件付き定理、研究上の証拠、説明用人工モデルを区別する。

R1（5e4e769）はセリーヌの条件付き合格を受領した。L1と成分数、並列深さと仕事、探索木とSAT全列挙の限定を修正し、R2の最終レビュー及び著者の公開承認を待つ。第4段階はmasterへマージせず、本番公開しない。GARDEN NOTES、既存記事の更新日、UI、GA4運用を変更しない。


## 著者の正式公開承認（2026-11-26）

R2の48078acはセリーヌの最終レビュー合格及び著者の本番公開承認を受領した。本文・数式・図解・検算を維持し、公開設定と初回公開日を反映する。現行の公開・計画状態は`docs/releases/ai-mathematics-plan-20261126.json`を正本とし、上記のレビュー待ち記録は当時の履歴として保存する。完了への更新は本番確認後に行う。


## 本番確認と強化計画の完了

2026-11-26に第4段階を本番公開し、全16記事と補強4記事の反映及び表示を確認した。計画は完了。[完了記録](ai-mathematics-plan-completion.md)と公開状態データを参照する。上記の未公開・レビュー待ち記録は過去の制作段階の履歴である。
