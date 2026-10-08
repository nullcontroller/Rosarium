# コード変更の委任設計への統合

## 判断

`code-generation-boundaries` は既に委任・権限・検証・復旧を扱っており、内容全体が誤りになったわけではない。独立した適用場所の記事としては、`development-workflow` の工程ゲート、レビュー、テスト、リリース、HITL、評価と重複するためRETIREDとする。

## 役割と保存

- 統合先：`software-engineering/development-workflow`。AI設計のソフトウェア開発ガイドとして配置し、変更ごとの委任範囲、試作と正式反映の権限分離、確認負荷、コード以外の復旧条件を補強。
- 一般の委任判断：`foundations/applicability-and-delegation`。
- コード受入：`evaluation-hitl/code-evaluation-acceptance`。
- 既存情報の取得：`software-engineering/code-maintenance-context`。
- Agentと複数AIの工程制御：`software-engineering/multi-ai-orchestration`。
- AI駆動開発の実務経験、コード生成モデルの仕組み、業務価値の考察は役割が異なるため変更しない。

固定的な用途一覧、未計測の適性式、過去研究の比較は統合先へ複製しない。旧Markdown本文と図は変更・削除せず保存する。

## URLと履歴

旧URLは、既存の `ai-generation-and-work-completion` と同じ静的ページによるmeta refresh・location.replace・手動リンクで統合先へ誘導。noindex、canonicalは統合先、Pagefind本文登録なし。動的記事生成からこのIDだけを除外する。通常の退役記事の直接閲覧方針は維持し、この統合記事のみ互換redirectを使用する。退役一覧に記録は残る。

2026-10-08の同日Garden Notesへ統合2件と統合先改訂1件を記録。個別履歴は同じ中央データを利用し、初回公開記録を保持する。AI入口・AI設計の読書順・実践導線から旧入口を除去する。

## コード生成関連の追加監査

`code-generation-and-work-design` もRETIRED。同じ統合先への互換redirectとする。「設計支援だけが有効」「実装の価値はない」等の断定は引き継がず、10月6日の追記にあった実装支援の価値と保守・移行・終了責任を工程評価へ短く統合。復元原文・追記のチェックサムと元公開日は保持し、Lifecycle検証で後続の退役を明示する。

`code-generation-models` はモデル、検索、道具、状態、権限、検証の構成説明としてKEEP。`code-maintenance-context` は新規・保守の性能優位を保証しないことを明示した、既存情報の取得と検証条件の説明としてKEEP。`ai-driven-development` と3 AI保守Caseは実務経験の記録としてKEEP。`multi-ai-orchestration` は情報環境と工程制御としてKEEP。`ai-design-assistance` は既に退役しており復活させない。

`docs/content-update-policy.md` は現checkoutに存在しないため、`content-history-policy.md`、`content-lifecycle.md` と既存互換routeを判断根拠とした。

## 後続の優先監査による判断更新

ai-driven-developmentと3 AI保守Book全7章を全文比較した結果、記事の独立した役割より、工程原則と実務Caseへ集約する価値が高いと判断した。前段のKEEPはこの比較前の判断。development-workflowへ工程接続の実務リンクを補強し、旧本文・元公開日は保存、RETIREDと既存方式の互換redirectへ変更した。code-generation-modelsとmulti-ai-orchestrationは全文確認でKEEP、code-maintenance-contextは委任条件とコードを基準にする範囲を改訂。教育・横展開は保留。


## 2026-10-08 全体監査後の状態

教育・横展開を含む全公開98ファイルの判断と統合後の構造は[全体監査結果](content-architecture-audit-2026-10-08.md)を参照。この記事の従来の件数・判断は実施時点の記録として保存する。統合元は退役保存し、既存URLは統合先への互換redirectを持つ。
