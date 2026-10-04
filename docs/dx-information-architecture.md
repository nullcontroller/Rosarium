# DX情報設計と分類監査（2026-10-04）

DX対象36件を監査し、主カテゴリ1つ・副カテゴリ0件以上へ移行した。記事本文、既存slug、sourceの来歴情報は変更していない。

主カテゴリは「この記事を1つだけ棚に置くならどこか」、副カテゴリは「他にどの論点とも関係するか」で選ぶ。DXトップとカテゴリ一覧は主カテゴリだけを参照する。

## 全DXコンテンツの分類

| コンテンツ | 主カテゴリ | 副カテゴリ | トップ代表 |
|---|---|---|---|
| [AI業務システムの参照アーキテクチャ](../src/content/architecture/reference-architecture.md) | システム変革 | なし | — |
| [08. 導入後にどう育てるか](../src/content/cases/customer-support-ai-dx/continuous-improvement.md) | 継続的価値創出 | 業務変革 | — |
| [06. 顧客体験をどう変えたか](../src/content/cases/customer-support-ai-dx/customer-experience.md) | 業務変革 | なし | — |
| [09. この事例から得た設計原則](../src/content/cases/customer-support-ai-dx/design-principles.md) | 業務変革 | なし | — |
| [00. このケーススタディについて](../src/content/cases/customer-support-ai-dx/executive-summary.md) | 業務変革 | なし | — |
| [07. AIから人間へどう引き継ぐか](../src/content/cases/customer-support-ai-dx/human-handoff.md) | 業務変革 | なし | — |
| [04. RAG / Knowledgeをどう設計したか](../src/content/cases/customer-support-ai-dx/knowledge-design.md) | システム変革 | なし | — |
| [03. PoCで「使えるか」をどう判断したか](../src/content/cases/customer-support-ai-dx/poc-evaluation.md) | 継続的価値創出 | システム変革 | — |
| [02. 何をAIに任せ、何を人間に残したか](../src/content/cases/customer-support-ai-dx/responsibility-boundary.md) | 業務変革 | システム変革 | — |
| [05. AIをどこで止めるか](../src/content/cases/customer-support-ai-dx/stopping-conditions.md) | 業務変革 | システム変革 | — |
| [01. なぜAIを導入したのか](../src/content/cases/customer-support-ai-dx/why-ai.md) | 業務変革 | なし | — |
| [生成AI / RAGによる顧客サポートDX](../src/content/cases/customer-support-ai-dx.md) | 業務変革 | 継続的価値創出 | — |
| [理解しにくいレガシーシステムを、変更判断できる状態へ変える](../src/content/cases/system-understanding.md) | システム変革 | なし | — |
| [仕様調査から実装まで、複数AIを役割分担したレガシー保守](../src/content/cases/three-ai-maintenance.md) | システム変革 | なし | — |
| [理解できないシステムは、コストである](../src/content/cases/understanding-systems-as-capability.md) | システム変革 | 選択と廃止 | — |
| [DXを学んで、「価値」という言葉が気になるようになった](../src/content/essays/dx-and-value.md) | 価値設計 | なし | 代表記事 |
| [IT戦略では「何を作らないか」も設計する](../src/content/essays/it-strategy-and-not-building.md) | 選択と廃止 | 価値設計・システム変革 | 代表記事 |
| [レガシーシステムは、変えやすくしながら終わらせる](../src/content/essays/legacy-change-and-retirement.md) | システム変革 | 選択と廃止 | 代表記事 |
| [AI化する前に、業務そのものを疑う](../src/content/essays/rethink-work-before-ai.md) | 業務変革 | 価値設計・選択と廃止 | 代表記事 |
| [AIで作れる時代に、何を作らないか](../src/content/essays/what-not-to-build-with-ai.md) | 選択と廃止 | 価値設計 | — |
| [AI出力の責任境界とHITL](../src/content/evaluation-hitl/responsibility-and-hitl.md) | システム変革 | なし | — |
| [第3章　AIに聞くことと、AIに仕事を任せることは違う](../src/content/foundations/ai-business-design/asking-versus-delegating.md) | 業務変革 | なし | — |
| [第1章　AIに仕事を任せても、責任は消えない](../src/content/foundations/ai-business-design/delegation-and-responsibility.md) | 業務変革 | なし | — |
| [第2章　AI導入は効率化とは限らない](../src/content/foundations/ai-business-design/evaluating-business-efficiency.md) | 業務変革 | なし | — |
| [第4章　AIに任せない条件を、先に決める](../src/content/foundations/ai-business-design/explainable-delegation.md) | 業務変革 | なし | — |
| [第5章　AI時代、人間には「判断する力」が求められる](../src/content/foundations/ai-business-design/human-judgment-capability.md) | 業務変革 | なし | — |
| [『生成AIを業務へ組み込む設計原則 ― AI・人間・既存システムの責任をどう分けるか』](../src/content/foundations/ai-business-design.md) | 業務変革 | 価値設計 | — |
| [AI適用可否と委任レベルの設計](../src/content/foundations/applicability-and-delegation.md) | 価値設計 | 選択と廃止 | — |
| [AIは自動化できる。しかし、その出力を確定値として扱ってはいけない](../src/content/foundations/generation-and-acceptance.md) | 業務変革 | なし | — |
| [AI導入を業務へ定着させる](../src/content/practices/adoption-governance.md) | 継続的価値創出 | 業務変革 | 代表記事 |
| [AIは使われている。でも使いこなされていない](../src/content/practices/ai-adoption-and-effective-use.md) | 業務変革 | なし | — |
| [生成AI教育はなぜ難しいのか ― 変わらない原則と変わり続ける実践を分けて設計する](../src/content/practices/ai-education-principles.md) | 継続的価値創出 | 業務変革 | — |
| [AI教育を原則と実践に分ける](../src/content/practices/education-and-capability.md) | 継続的価値創出 | 業務変革 | — |
| [全員の業務が違うのに、AI活用事例をそのまま横展開できるのか](../src/content/practices/transferring-ai-practices.md) | 継続的価値創出 | 業務変革 | — |
| [AI活用を別の業務へ横展開する](../src/content/practices/transferring-practices.md) | 継続的価値創出 | 業務変革 | — |
| [コード生成AIはなぜ業務を変えないのか — 設計支援として使うべき理由](../src/content/software-engineering/code-generation-and-work-design.md) | 業務変革 | 選択と廃止・システム変革 | — |

## 表示と運用

- DXトップは5テーマを維持し、説明3文、主な問い3件、代表記事1件とそのsummaryを表示する。
- 実践事例とAI接続UIはDXトップから外す。Cases、既存カテゴリURL、Global Navigationは維持する。
- 右側はテーマ名によるページ内目次だけにし、代表記事を再掲しない。Mobileでは同じ説明と記事要約を縦に表示する。
- 代表記事はfeaturedInCategoryで指定し、主カテゴリとの一致、1〜2件、Case除外を検証する。
- 旧dx_topic・dx_topicsは公開コンテンツとschemaから撤去した。歴史資料の過去の記述は保持する。
- 副カテゴリは横断導線で利用できるが、カテゴリ一覧の所属を増やさない。

## テーマ説明と代表記事

### 価値設計

新しい技術を使うことと、価値を生むことは同じではありません。誰のどんな困りごとを減らすのかを先に定め、業務・サービス・システムを逆算します。AIも、その価値を届けるための手段の一つとして選びます。

代表記事：[DXを学んで、「価値」という言葉が気になるようになった](../src/content/essays/dx-and-value.md)

DXを学ぶ中で出会った「価値」という視点が、AI・RAG・エージェントを見る順序をどう変えたか。技術導入ではなく、誰の仕事や判断をどう変えるかからAIを考える。

### 業務変革

現行業務を速くする前に、その作業が本当に必要かを確かめます。ECRSの観点で削除・統合・順序変更・簡素化を考え、残る仕事を人・AI・既存システムへどう分けるかを設計します。個々の作業速度ではなく、仕事全体の流れを見直す領域です。

代表記事：[AI化する前に、業務そのものを疑う](../src/content/essays/rethink-work-before-ai.md)

AIへ任せる前に、その仕事をなくす・まとめる・変える・単純化できないか考えます。業務改善の手順（ECRS）を踏まえ、残る仕事を人間・既存ソフトウェア・AIのどれへ任せるか判断します。

### 選択と廃止

作ることだけが設計ではありません。残す・変える・統合する・作らない・終わらせることも、価値と維持責任から判断します。生成コストが下がるほど、何を作らず、何を残さないかを選ぶ意味が大きくなります。

代表記事：[IT戦略では「何を作らないか」も設計する](../src/content/essays/it-strategy-and-not-building.md)

システムを新しく作る前に、保守・変更・移行・廃止までの負担を考えます。既存の仕組みを使う選択も含め、作るものと作らないものを判断します。

### システム変革

既存システムは、全面刷新だけで変えるものではありません。現行仕様と依存関係を理解し、継続保守・移行・統合を進めながら、変更しやすさ（Changeability）を確保します。Legacy Modernizationを、必要なら安全に終わらせるところまで含めて考えます。

代表記事：[レガシーシステムは、変えやすくしながら終わらせる](../src/content/essays/legacy-change-and-retirement.md)

廃止予定でも変更要求が続く既存システムを、どう保守しながら終わらせるか考えます。依存や変更箇所を減らし、役割を段階的に移す判断を整理します。

### 継続的価値創出

導入したことを完成とは捉えず、実際の利用と失敗から改善を続けます。品質・工数・確認負荷を見て、仕組みが価値を生んでいるかを確かめます。評価や現場の学びを次の設計へ戻し、別の業務へ広げるときも成立条件を見直します。

代表記事：[AI導入を業務へ定着させる](../src/content/practices/adoption-governance.md)

AIツールを配るだけでなく、日々の仕事で使い続けられる条件を考えます。人が確認する場面、失敗時の対応、運用結果を改善へ戻す方法を整理します。
