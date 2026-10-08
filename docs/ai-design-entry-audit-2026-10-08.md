# AI設計全体監査 — 2026-10-08

## 変更前の判断
`src/pages/ai-design/index.astro` は700〜1200の接続領域と、`designTopics`由来の7領域別記事一覧を二重に持つ。描画条件がAgentの1件だけをリンク化していた。番号は当該配列の表示ラベルで、ID・学習依存・優先順位ではない。

新規記事は不要。既存本文は存在するが、入口の粒度・対応先だけでなく、本文の説明範囲と領域別の読む順にも問題がある。既存23本のAI設計知識と、Book・総論・原因分析・関連実務事例の役割を照合する。本文の重複説明は詳細を担うページへの参照に置き換える。記事の削除・統合・Lifecycle変更はしない。

| 最終テーマ | 対応先 | A〜E判定 / 根拠 |
| --- | --- | --- |
| 価値・AI適用判断 | foundations/applicability-and-delegation | A: 価値、非利用、L0〜L5、確認負荷、可逆性 |
| 業務全体の効果 | foundations/ai-business-design/evaluating-business-efficiency | A: 工数・経過時間、レビュー・手戻り・合意 |
| 責任境界・HITL | evaluation-hitl/responsibility-and-hitl | A/C: 生成・承認・実行、移管、人間レビューの評価を一つの入口へ |
| Knowledge / Context | ai-design/knowledge-context | B: 指示・知識・根拠、取得、制約、QA運用を束ねる既存入口 |
| 評価設計 | ai-design/evaluation-hitl | B: QA評価、コード採用、回帰データ、人間レビュー。QA単体へ限定しない |
| Architecture・既存システム統合 | architecture/reference-architecture | A/C: 候補生成、Validator、承認、実行API、冪等性、監査、復旧を扱うため入口を統合 |
| Agent / Tool / Workflow | software-engineering/multi-ai-orchestration | A: 単一AIからの適用判断、動的Agentと固定Workflow、Context/Tool/Permission、共有状態、停止・移管 |
| セキュリティ・権限制御 | architecture/security-threat-modeling | A: 脅威境界、利用者権限、最小権限、機密、外部実行、停止・復旧 |
| 導入・定着・改善 | practices/adoption-governance | A: 担当者・教育・例外・業務成果・継続/縮小/終了の組織判断 |
| 監視・再評価・終了 | ai-design/lifecycle-operations | B: observability-and-sloの観測とchange-and-reevaluationの変更・回帰・切り戻し・廃止 |

旧Agentリンク `architecture/agents-tools-and-workflows` は自宅ストレージ整理の考察で、設計ガイドではない。考察自体は残す。旧「既存システム統合」→software-engineering入口はコード開発の一覧で、業務システム統合の問いと一致しない。

## 本文変更前の判断

- 参照アーキテクチャ: 候補→検証→承認→実行の配置を担当。既存システム接続時の対象・引数・版の固定、実行時再検査、失敗時の状態を補強する。誤答制御の確率分解は多層制御へ委ねる。
- AI間インターフェース: 入出力契約、根拠、状態、版、冪等性を担当。一般的なHITL閾値、多数決/相関、反復制御を再説明せず、責任設計・工程設計へ参照する。
- 複数AI工程設計: 単一AIから始める構成判断と実行制御を担当。単一Agentにも必要な情報・道具・権限・状態・停止の契約を具体化し、受渡しSchemaの重複数式をインターフェース記事へ委ねる。
- 多層制御: 誤答を業務影響へ変えない対策の配置を担当。検索指標、選択的回答、検出器の詳細評価はQA評価・回答範囲・Guardrail数理へ委ねる。
- QA運用: 知識不足・矛盾を誰が修正し、運用結果をどう改善へ戻すかを担当。回答成功確率の連鎖式はQA評価へ委ね、前提のない「前章」参照を廃止する。
- コード生成適用: 開発固有の検証環境・変更影響を担当。一般の委任L3は人間承認後の実行だが、コード記事ではSandbox編集としていた。L0〜L4の意味を一般の委任設計に合わせ、Sandbox内の試作と正式反映を分ける。L5の広い自律実行は推奨範囲に追加しない。

## 全知識ページの問い・役割

| Page ID | このページが答える問い | 判断 |
| --- | --- | --- |
| foundations/applicability-and-delegation | 価値・影響・検証可能性から、どこまでAIへ任せるか | KEEP / 委任レベルの定義元 |
| evaluation-hitl/responsibility-and-hitl | 採用・承認・実行・是正に誰が責任を持つか | KEEP / 責任とHITL詳細 |
| foundations/layered-hallucination-controls | 誤答を業務へ流さない対策をどの層へ置くか | UPDATE / 評価詳細を分離 |
| foundations/answer-scope | どの入力に答え、拒否・移管と回答率をどう評価するか | KEEP / 選択的回答 |
| foundations/guardrail-models | 誘導・生成制約・検証・実行制御の強さと限界は何か | KEEP / 制御の数理。多層配置とは異なる問い |
| knowledge-context/instruction-knowledge-evidence | 指示・管理知識・今回の根拠の責務をどう分けるか | KEEP / 情報分類の起点 |
| knowledge-context/human-and-ai-documentation | 一つの知識から人向け表示とAI向け取得単位をどう作るか | KEEP / 文書・索引構造 |
| knowledge-context/prompt-structure | 一回の依頼にTask・Input・Context・Criteria・Outputをどう組み立てるか | KEEP / 入力契約 |
| knowledge-context/qa-behavior-constraints | 許可・禁止・例外・移管の規則をどう管理し強制へ渡すか | KEEP / Policy Knowledge |
| knowledge-context/prompt-failure-modes | 不足・競合・汚染・検証欠如をどう診断するか | KEEP / 症状から原因を分ける手順 |
| evaluation-hitl/datasets-and-regression | 通常・境界・危険・過去の失敗を評価資産へどう残すか | KEEP / 評価入口 |
| evaluation-hitl/qa-evaluation | 検索・根拠利用・拒否・回答・業務成果をどう測るか | KEEP / QA固有評価 |
| evaluation-hitl/code-evaluation-acceptance | 生成コードを要求・テスト・レビューから採用できるか | KEEP / コード固有評価 |
| architecture/reference-architecture | AI候補を既存システムの確定処理へどう安全につなぐか | UPDATE / 構成と統合 |
| architecture/prompts-as-interfaces | 根拠・未解決事項・状態を失わず次工程へどう渡すか | UPDATE / 受渡し契約 |
| architecture/security-threat-modeling | 入力・検索・Tool・出力の脅威と権限逸脱をどう制御するか | KEEP / 脅威モデル |
| architecture/cost-latency-routing | Taskごとに非AIを含む処理経路をどう選ぶか | KEEP / Routing・Cache・Budget。Book第2章の業務効率と区別 |
| software-engineering/code-generation-boundaries | 検証環境と変更影響からコード生成へ何を任せるか | UPDATE / 委任レベル整合 |
| software-engineering/code-maintenance-context | 既存コード・テスト・履歴が有効な根拠になる条件は何か | KEEP / 保守Contextの条件と限界 |
| software-engineering/multi-ai-orchestration | 単一AI・固定Workflow・Agent・複数AIをどう配置・制御するか | UPDATE / 工程全体 |
| architecture/observability-and-slo | 稼働中の品質・費用・異常を何で観測し対応へつなぐか | KEEP / 観測 |
| architecture/change-and-reevaluation | 版の変更をどう比較し、公開・切戻し・終了を判断するか | KEEP / 技術的変更管理 |
| knowledge-context/qa-operations | 回答・拒否・移管の結果から知識とQAを誰が改善するか | UPDATE / QA固有運用 |

## 隣接する公開物・実務知との境界

Book『生成AIを業務へ組み込む設計原則』は、責任→業務全体の効率→必要情報→停止条件→人間判断の順を維持。特に第2章が理解・説明・レビュー・合意形成と工数/経過時間を担当する。AI設計入口から必要時に参照し、技術的なRoutingやAPI認可をBookへ重ねない。

総論 `practices/ai-adoption-and-effective-use` は設計する問いの全体像、`essays/ai-use-and-operation` は技術・組織の速度差という原因分析を担当する。`practices/adoption-governance` は導入体制・担当者・教育・利用継続、`practices/education-and-capability` は判断能力の学習を担当する。技術監視や版管理をこれらへコピーしない。

`knowledge-context/context-before-model-performance` は実務の参照可能情報の差、`software-engineering/ai-driven-development` と `code-generation-and-work-design` は開発上の経験・省察。Casesの `specification-debt-review` は資料/コード横断調査とBefore/After判断、`three-ai-maintenance` は情報環境による役割分担、`customer-support-ai-dx` は業務再設計、旧 `system-understanding` は当時の制約下の知識復元。個別事例を一般的な保証として扱わず、事実・定量情報・Lifecycleを維持する。

旧Agentリンクの考察はArchitecture領域に「経験から考える」導線を残す。入口の設計ガイドと区別し、孤立ページにしない。

## 実装・履歴方針

`src/lib/ai-design.ts` に10領域の入口、7分類の問い、23本の読む順、次に進む領域を定義する。既存のURL・記事分類・全件索引を保持し、新しい分類や万能componentは作らない。01〜10は読む順の目安と明記し、過去のWiki章番号700〜1200を工程・優先度のように見せない。

本文6件の意味のある改訂を、2026-10-08の既存entryへ追加する。同日1entryを維持し、Garden Notesは合計16件の改訂通知、各記事の履歴はその記事の改訂内容を表示する。入口・リンクだけの変更は改訂件数へ入れない。新規記事0、削除0、統合による廃止0、Lifecycle変更0、URL変更0。

## 最終検証

- `npm run check`: Astro 131ファイル、error / warning / hint 0。コンテンツ・公開条件・出典検証成功。
- `npm test`: 48件成功。入口の実在・公開状態、23記事の全件対応、読む順、欠落・誤分類時の検出を含む。
- `npm run build`: 成功。内部リンク、一覧、Lifecycle、孤立ページ、SEO、sitemap、GA4、更新日、TOC、accessibility、performanceの既存検証を全実行。
- Chrome: 入口・7領域・本文改訂6記事について、375×812 / 430×932 / 1440×900 / 1920×1080、Dark / Lightの計112組を確認。ページ横スクロールなし、キーボードのfocus-visible維持。Lightで確認対象の文字コントラスト比は最低4.51。
- スクリーンショットは入口、領域、更新履歴を目視確認。JavaScript無効の入口・Architecture領域・参照アーキテクチャでも本文と内部リンクを確認し、対象リンクのHTTP成功を検証。
- 改訂6記事のtitle / lifecycle / status / canonical / source / published_at / layer / design_topicを変更前と比較し、すべて維持。静的図のラベルも委任レベル改訂と矛盾しないことを確認。
- 新規記事・削除・URL変更・Lifecycle変更なし。既存のCSS・Dark/Lightトークン・Navigation構造は変更しない。

実機Android / iPhoneでの操作は未実施。Mobileの検証はChromeのviewport・touch対応エミュレーションによる。今後追加する記事も、対応する読者の問いと既存本文との差分を確認し、この読む順と検証へ反映する。
