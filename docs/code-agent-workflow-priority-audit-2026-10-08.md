# コード生成・Agent・Workflow 優先監査（2026-10-08）

## 目的・範囲・受入条件

能力や工程の固定的な境界より、委任・情報・検証・権限・復旧を中心に整理する。重点9記事と比較先の3 AI保守Book全7章を全文確認した。旧URL・保存本文・元公開日を維持し、正常な導線・検索・履歴とcheck/test/buildを受入条件とする。教育・横展開は変更しない。全体98ファイルの全文精読完了を意味しない。

## 実装前判断と結果

| 対象 | 判断 | 理由・説明先 |
|---|---|---|
| ai-design-assistance | RETIRE維持 | 設計とコード生成の固定的対立。退役理由の案内を現行development-workflowへ修正 |
| ai-driven-development | MERGE → RETIRED | 工程原則はdevelopment-workflow、経験と具体例はthree-ai-maintenanceで読める。独立記事を残す必要が薄い |
| code-generation-and-work-design | 統合維持 | 設計支援との対立を引き継がず、development-workflowで委任・工程評価を説明 |
| code-generation-boundaries | 統合維持 | 作業名で利用場所を固定せず、development-workflowで変更ごとに範囲を決める |
| code-generation-models | KEEP | モデル＋情報取得＋道具＋状態＋権限＋検証の構成を説明。製品性能比較が中心ではない |
| code-maintenance-context | REWRITE | 既存成果物が調査と検証を助ける条件は独立した問い。能力適性の高低表を必要な制御条件へ変更 |
| development-workflow | KEEP・補強 | 調査から反映・復旧までの工程設計を所有。実務の根拠は保守Caseへの短い導線で補強 |
| multi-ai-orchestration | KEEP | 単一AIを基準に、役割・成果物・状態・権限・停止を設計。手動で複数製品を使い分ける前提ではない |
| applicability-and-delegation | KEEP | 価値・リスク・検証・可逆性・権限・復旧に基づく一般の委任判断 |

## 統合の情報保存

ai-driven-developmentの要件整理、既存仕様調査、設計、資料化、実装、テスト、成果物受け渡し、人間による判断は、three-ai-maintenance本文と全7章で確認した。製品別の役割は実務事実としてCaseで保持する。一般原則はdevelopment-workflowの工程契約・検証・権限・効率評価と重複しており再コピーしない。旧Markdown本文は変更・削除しない。元公開日2026-08-15も維持。

## 保守記事の変更

- 「コードは正本ではない」の一律説明を、判断対象に応じた基準の選択へ変更。現行実装へ仕様書を合わせるCaseではコードを正本にできる。
- 暗黙仕様や高リスク変更を能力の低評価で固定せず、情報収集・検証・バックアップ・承認等の条件を示す。
- 調査や局所変更だけへの固定的限定を除き、複数工程を委任する場合も成果物・権限・停止条件を追跡する。
- 性能優位は仮説として保持し、新規開発より常に保守に強いという保証はしない。

## 導線・履歴

旧ai-driven-development URLは既存方式のmeta refresh・location.replace・手動リンクでdevelopment-workflowへ移動。noindex、canonicalは統合先、検索本文登録なし。保存記録は退役一覧に残す。通常の出版物導線は既存three-ai-maintenanceへ集約。

同日の記事履歴は「統合」へ更新し、Garden Notesは記事18件改訂・3件統合・Case1件改訂の件数通知。復元時の移行記録は歴史的証跡として保持し、検証で後続統合を明示する。

## 検証

実行結果は完了後に追記。全体の未精読ページはcontent-architecture-audit-2026-10-08.mdの一次判断を維持し、今回の優先9記事と区別する。

### 実行結果

- npm run check：134ファイル、エラー・警告0。コンテンツと公開範囲検証成功。
- npm test：48件成功、失敗0。
- npm run build：成功。141 HTML・7,520ローカルリンク/asset、孤立ページ0、115 sitemap URLを確認。Lifecycle・原文チェックサム・元公開日・検索・SEO・GA4・更新日・TOC検証成功。
- 1920×1080、1440×900、375×812、430×932、Dark/Light：6ページ計48ケース、横はみ出しなし。改訂した保守記事の表と正本の説明も8ケースで確認。
- 統合3URL：JavaScript有効/無効ともdevelopment-workflowへの移動を確認。ai-driven-developmentの保存本文と元公開日はHEADとの差分比較で不変。
- CSS・レイアウト・教育・横展開・Careerは変更なし。全体98ファイルの全文精読は別の未完了範囲として明示。


## 2026-10-08 全体監査後の状態

教育・横展開を含む全公開98ファイルの判断と統合後の構造は[全体監査結果](content-architecture-audit-2026-10-08.md)を参照。この記事の従来の件数・判断は実施時点の記録として保存する。統合元は退役保存し、既存URLは統合先への互換redirectを持つ。
