# AI利用と業務運用：追加判断（2026-10-07）

content-update-policy.md、authoring-guide.md、content-lifecycle.md、content-maintenance.mdを確認してから判断した。

| 既存記事 | 問い・役割 | 今回との違い |
| --- | --- | --- |
| foundations/ai-business-design | AI・人間・既存システムをどう設計するか | 設計手順の正本。今回は操作の普及に運用が追いつかない原因 |
| practices/adoption-governance | 導入後にどう定着させるか | 適用・運用の実践。今回は技術と組織の変化速度の差を説明 |
| evaluation-hitl/responsibility-and-hitl | 採否・承認・実行の責任をどう分けるか | 責任設計の正本。今回は責任の不足が利用と運用の差を生む因果 |
| evaluation-hitl/human-review-capability | レビューできる人の価値 | RETIRED。現在の責任境界に統合済みで復活・複製しない |
| foundations/ai-business-design/human-judgment-capability | AIへ任せた後に人の判断能力をどう維持するか | 今回は判断能力の維持策より、生成品質が運用能力の差を隠す因果が中心 |
| essays/dx-and-value | 何の価値からAIを見るか | 価値を出発点とする考察。今回は判断能力が生成品質に隠れる問題 |
| essays/ai-roles-beyond-fde | AI専門職の役割分化 | OBSOLETEの歴史的考察。今回は職種予測ではなく運用能力の成立条件 |
| essays/what-not-to-build-with-ai / it-strategy-and-not-building | 非構築・維持・統合・終了の判断 | 選択の原則。今回は運用能力の一部として必要な範囲のみ接続 |

判断：C（独立記事）。A（一節）では速度差と判断能力の見えにくさの因果が脇道となり、B（大幅改訂）では設計・定着の正本の焦点がぼやける。生成の入口と運用の成立条件の非対称性を独立した問いとして育てる。統合・終了対象はない。

新規URL：/Rosarium/essays/ai-use-and-operation/。published / ACTIVE、publication / essay。普及人数・統計・将来予測の断定は置かず、構造的な仮説として適用範囲を示す。関連記事は責任境界・業務設計・定着の3件だけを本文の該当箇所で参照する。既存記事本文・URL・Lifecycleは変更しない。

Garden Notes：2026-10-07の1entry、NEW、「新規公開」と正式タイトルへのcontent IDリンク。Homeと詳細は既存GrowthEntryで同一データを表示。

開始時から変更済みのauthoring-guide.md、content-lifecycle.md、content-maintenance.md、および未追跡content-update-policy.mdは今回の変更と分離して保持する。

検証結果：npm run check（124 files、error/warningなし）、npm test（40/40）、npm run build（139 pages）成功。リンク7457件、SEO・Lifecycle・GA4・目次・アクセシビリティ検証成功。1920/1440/375/430px × dark/light、Home/詳細の16条件と記事リンク16遷移を確認。記事h2は7件、横スクロールなし。


## 公開後の役割重複監査

前回の監査はpractices/ai-adoption-and-effective-useとの比較を欠いていた。2記事の問い・主張・結論・見出し・具体例・設計論・原因分析を比較して修正した。

| 観点 | 修正前の重複 | 既存記事に維持 | 新規記事の修正後 |
| --- | --- | --- | --- |
| 問い | 個人利用と業務運用の差 | どう業務で扱うか | なぜ運用できる状態が広がらないか |
| 主張・結論 | 役割分担と評価が必要 | 情報・検証・権限・責任を設計する | 速度差・能力差の不可視化・共有条件の違いが普及を制約する |
| 見出し・設計論 | AI単体では仕事にならない、Design Skillの実務手順 | Human Review、Workflow、利用範囲、制御、改善 | 実務手順を除き、能力の変化と組織の調整コストを説明 |
| 具体例 | 問い合わせ下書き、確認負荷、有人移管 | 問い合わせ対応の適用判断 | 分析文の滑らかさと前提の理解を分ける概念例 |
| 原因分析 | 速度差と良い出力を扱うが設計説明が混在 | 実務上の成立条件 | 技術更新と組織変更の周期差→準備不足→良い出力で不足が見えにくい→運用の学習投資が後回しになる可能性 |

Context、承認・権限、HITL、評価の詳細と例外処理は新規記事から削除。業務設計へのリンクは「AIは使われている。でも使いこなされていない」への本文内1か所に集約し、既存記事側への逆リンクは追加しない。既存記事は無変更。新規記事のタイトル・URL・ACTIVE・公開日は維持。Garden Notesも新規公開の同日1entryを維持し、追加・変更しない。


## 既存記事の実務設計強化

既存記事の適用判断と問い合わせ例、従来の見出し・アンカーを維持し、利用量と使いこなす能力を分離した。情報・委任範囲・検証・Human Review・実行権限・例外処理・運用評価・縮小/統合/終了を具体化。重複する項目列挙はWorkflowを接続する説明へ置き換え、社会的な普及原因は追加せず新規記事へ1か所リンクした。タイトル・URL・ACTIVE・元公開日・出典は維持。

復旧台帳は既存Rosarium本文（restored_from=current file）の改訂として、旧本文checksumと理由をlocal_revisionへ記録し、現本文checksumを更新した。原Zenn snapshotとsource_sha256は無変更。

Garden Notesは10月7日の同日entryへ「改訂」と正式タイトルリンクを1項目追加。既存の新規記事は「新規公開」を維持。
