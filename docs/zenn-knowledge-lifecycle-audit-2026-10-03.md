# Zenn由来Knowledge Lifecycle監査

監査日：2026-10-03

## 判定原則

公開日や文章量ではなく、現在のRosariumに独立した `Question / Answer / Role` があるかで判定した。Zennの元記事、移行元metadata、canonicalは削除せず、Rosarium上の公開状態だけを変更する。

## 退役した3記事

| Article | 旧Rosarium URL | Decision | 後継Knowledge | Knowledge Salvage | Redirect |
|---|---|---|---|---|---|
| 設計支援AIは消えない。コード生成の次に残る領域 | `/software-engineering/ai-design-assistance/` | RETIRE | コード生成AIはなぜ業務を変えないのか | 選択肢・責務・判断を整理する価値は後継記事に既存。正解問題 / 非関数問題という粗い対比は移植しない | `/software-engineering/code-generation-and-work-design/` |
| AIはどこへ進化しているのか | `/essays/model-competition-and-ecosystems/` | RETIRE | AIを使い分ける基準は、モデル性能よりコンテキストではないか | Context、情報源、権限、利用目的の論点は後継記事に既存。企業とAIを二分する説明モデルは移植しない | `/knowledge-context/context-before-model-performance/` |
| AI時代において「レビューできる人」が価値を持つ理由 | `/evaluation-hitl/human-review-capability/` | RETIRE | AI出力の責任境界とHITL | 根拠確認・採否判断・責任の論点は状態遷移、Review Packet、移管条件として正本化済み。一般的な人物論は移植しない | `/evaluation-hitl/responsibility-and-hitl/` |

3記事のMarkdownは `public: false` / `status: archived` として移行証跡を保持する。Search、RSS、sitemap、一覧、Relatedからは除外し、旧URLにはnoindexの転送ページを置く。

## 保留記事の詳細評価

### コード生成AIはなぜ業務を変えないのか

**推奨：REFINE**

- Question：Code生成が速くなっても、なぜ業務全体は変わらないのか。
- Answer：実装は局所工程であり、入力・判断・責務・運用を含む仕事の構造は別に設計する必要がある。
- Role：Code生成から業務設計へ視点を移す入口。

独立した問いは残っている。一方、「コード生成 = 未確定問題」「コメント / Refactoring = 確定問題」という数理的に見える対比と、「設計支援として使ったときに初めて価値を持つ」という断定は粗い。次回改稿では、検証可能性、変更影響、可逆性、Review負荷、既存Workflowへの接続で説明し直すのが妥当である。今回は本文、URL、redirectを変更しない。

## Zenn Article全16件

| Article | Question | Answer | Role | Decision | Successor / Related Book |
|---|---|---|---|---|---|
| 生成AI教育はなぜ難しいのか | 何を教育すれば業務品質につながるか | 不変の責任原則と変化する実践を分け、業務結果を教育へ戻す | 教育設計 | KEEP | AI業務設計Book 第1・5章とCOMPLEMENTARY |
| AIは使われている。でも使いこなされていない | 利用と業務価値は何が違うか | 情報・検証・権限・影響から利用可否を設計する | AI導入の入口 | KEEP | AI業務設計BookへのARTICLE_AS_ENTRY |
| AIを使い分ける基準は、モデル性能よりコンテキストではないか | 複数AIを何で使い分けるか | 必要情報、接続先、権限、根拠適格性で役割を決める | Context設計の経験知 | KEEP | 3 AI保守BookとCOMPLEMENTARY |
| 全員の業務が違うのに、AI活用事例をそのまま横展開できるのか | 事例を別業務へどう移すか | 成立条件を分解し、目的・情報・Risk・評価をテーラリングする | 横展開の原則 | KEEP | AI業務設計BookとCOMPLEMENTARY |
| 採用される側から見たAI人材の転職概況 | AI経験を年数以外でどう示すか | 設計対象、責任範囲、成果で専門性を分解する | Career考察 | REFINE | BookとはCOMPLEMENTARY。市場情報は定期確認が必要 |
| AIはどこへ進化しているのか | AI競争をどう説明するか | 構造の蓄積と生成という二分法 | 旧Architecture説明 | RETIRE | Context記事へ統合 |
| AI人材はFDEだけではない | AI社会実装の役割をどう捉えるか | Architecture、Engineering、Evaluation、Governanceへ責任が分化する | Role設計の考察 | REFINE | AI業務設計BookとCOMPLEMENTARY。固有職名は定期確認が必要 |
| 設計支援AIは消えない | Code生成後に何が残るか | 設計判断の支援が残る | 旧Code生成論 | RETIRE | Code生成と業務設計の記事へ統合 |
| AIは自動化できる。しかし、その出力を確定値として扱ってはいけない | AI入力を正式値にしてよいか | 候補、根拠、確認、確定を分離する | 責任状態モデルの入口 | KEEP | AI業務設計Book 第1・5章へのARTICLE_AS_ENTRY |
| AI時代において「レビューできる人」が価値を持つ理由 | AI出力に誰が責任を持つか | 人間が根拠確認、採否判断、責任を担う | 旧Review人物論 | RETIRE | 責任境界とHITLへ統合 |
| LLMを確率モデルとして設計するという立場 | LLMの揺らぎをどう設計へ落とすか | 条件付き確率分布として扱い、制約と評価を設計する | AI理論 | KEEP | AI業務設計BookとCOMPLEMENTARY |
| 「AIエージェントを0から作る時代」は本当に来るのか？ | Agentの価値は自作範囲にあるか | ModelよりTools、接続先、責務の組合せを見る | Agent設計の入口 | KEEP | 3 AI保守BookとCOMPLEMENTARY |
| AI生成コンテンツは、なぜ信頼されにくいのか | 生成文の信頼は何で決まるか | 理解、検証、Review、確定工程で決まる | 公開物の信頼論 | KEEP | AI業務設計Book 第5章とCOMPLEMENTARY |
| コード生成AIはなぜ業務を変えないのか | 生成高速化だけで仕事は変わるか | 業務構造、責務、運用判断は別に残る | Code生成から業務設計への入口 | REFINE | 3 AI保守BookへのARTICLE_AS_ENTRY |
| 理解できないシステムは、コストである | 既存System理解をなぜ資産化するか | 調査結果を仕様、構造、Knowledgeとして再利用する | Case Bookの入口 | KEEP | System理解BookへのARTICLE_AS_ENTRY |
| AI駆動開発は、どのように進化するのか | AIを開発工程へどう組み込むか | 生成だけでなく調査、設計、検証へWorkflowとして組み込む | 開発工程の展望 | REFINE | 3 AI保守BookへのARTICLE_AS_ENTRY |

公開継続は13件、退役は3件。`REFINE` は公開を維持し、今回本文を変更しない。

## ArticleとZenn Bookの重複分類

| Article / Book section | Classification | 判定 |
|---|---|---|
| AI利用・教育Article群 / AI業務設計Book | ARTICLE_AS_ENTRY / COMPLEMENTARY | Articleは個別の問題提起、Bookは委任・効率・判断能力を連続して扱う |
| generation-and-acceptance / AI業務設計 第1・5章 | ARTICLE_AS_ENTRY | Articleは確定値の具体例、Bookは責任分担と判断能力を一般化する |
| human-review-capability / AI業務設計 第5章 + 責任境界正本 | BOOK_SUPERSEDES_ARTICLE | Review人物論を、判断条件と責任設計が包含する |
| ai-design-assistance / 3 AI保守 第3〜6章 + code-generation-and-work-design | BOOK_SUPERSEDES_ARTICLE | 設計支援の主張を、具体的な調査・仕様・実装・Review工程が上位互換する |
| context-before-model-performance / 3 AI保守Book | COMPLEMENTARY | Articleは使い分け原則、BookはContext差を利用した実践 |
| agents-tools-and-workflows / 3 AI保守Book | COMPLEMENTARY | ArticleはAgentの構成原則、Bookは複数AIと既存Toolの事例 |
| code-generation-and-work-design / 3 AI保守Book | ARTICLE_AS_ENTRY | Articleは局所最適の問題提起、Bookは既存Code保守での実装例 |
| understanding-systems-as-capability / System理解Book | ARTICLE_AS_ENTRY | ArticleはPortfolio入口、Bookは復元・可視化・RAG・運用の詳細 |
| LLM確率論 / 3 Book | COMPLEMENTARY | 理論Articleと業務・Case Bookの責務が異なる |
| Career Article群 / 3 Book | COMPLEMENTARY | Role・市場の考察と、設計能力を示すEvidenceは役割が異なる |

`DUPLICATE` と判定して公開継続すべき組合せはない。退役3件は正本または後発Article / Bookへ役割を統合した。

## Book側の確認事項

- AI業務設計Book：第4・5章が後から補完されており、章1〜3の委任設計との接続説明は将来整理の余地がある。削除対象ではない。
- System理解Book：第2章と第12章は同じQA事例の導入版と再訪版で、Questionが近い。現在は前後の学習差を示すが、将来は第2章をProblem、12章をOutcomeへ明確化するか統合を検討できる。
- 3 AI保守Book：第4章と第5章はExcel仕様書の生成と修正で連続しており、役割は異なる。統合必須ではない。
- 今回はBookの章削除、順序変更、本文統合を行っていない。

## 提示された12章案との対応

提示された「境界 → 品質保証 → 開発工程 → 組織評価」の12章案は、既存Knowledgeを将来まとめる構成として妥当である。特に第7章を「AIの回答は、いつ業務上の判断になるのか」とすることで、第1章の責任論と重複せず、`Generated → Validated → Approved → Executed` の状態遷移を扱える。

| 部 | 主な既存正本 |
|---|---|
| 第1部 AIへ任せる境界 | applicability-and-delegation、responsibility-and-hitl、ai-business-design |
| 第2部 品質を業務として保証 | qa-evaluation、instruction-knowledge-evidence、generation-and-acceptance |
| 第3部 開発工程へ組み込む | prompts-as-interfaces、multi-ai-orchestration、code-evaluation-acceptance、3 AI保守Book |
| 第4部 導入後の組織 | evaluating-business-efficiency、教育・横展開Article群 |

ただし、現在の3 Bookは実践の連続性を持つため、この案で直ちに再編するとCaseと設計原則の役割が混ざる。今回は新Book作成・大規模再構成を行わない。

## 次の退役候補

現時点で、本文比較だけから追加でRETIREを確定できるArticleはない。次回優先して再評価するなら、次の3件を `REFINE` 候補とする。

1. コード生成AIはなぜ業務を変えないのか：粗い問題分類を検証可能性・影響・Review負荷へ置換する。
2. 採用される側から見たAI人材の転職概況：変化する市場記述と持続する経験分解を分ける。
3. AI人材はFDEだけではない：固有職名の最新性と、責任分化という持続的主張を分ける。

## 最終評価

現時点では、Zenn由来独立Article 16件のうち13件を公開するのが妥当である。13件は、教育、導入、Context、横展開、Career、責任状態、確率モデル、Agent、信頼、業務設計、既存System理解、開発工程という異なるQuestion / Answer / Roleを持つ。退役3件は非公開で移行証跡を保持し、読者は旧URLから現在の正本へ到達できる。
