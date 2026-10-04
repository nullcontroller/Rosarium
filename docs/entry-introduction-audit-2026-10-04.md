# 入口文監査（2026-10-04）

公開Markdown 94ページのsummaryと、主要一覧・カテゴリ・Home・Careerの導入を確認。既に平易な説明から始まる入口は維持し、専門概念が先行する入口を以下のように整理した。本文・URL・分類・出典は維持する。

平易な説明 → 課題・価値 → 専門概念 → 詳細、を基本順序とする。同一記事のsummaryを一覧・本文冒頭・SEOへ使い、説明の二重管理を避ける。

## summaryを修正したページ

- `career/overview`：業務課題を整理し、AI・人間・データ・既存システムの役割を決め、運用できる仕組みへ落とし込む仕事をしています。Applied AI × DX × System Architectureを軸に、企画から改善・終了までを考えます。
- `career/details`：開発や保守、プロジェクトを進めた経験が、現在の仕事の考え方へどうつながったかを紹介します。実践事例と職務プロフィールから、その背景を確認できます。
- `cases/customer-support-ai-dx`：顧客が自分で解決できる問い合わせと、人の専門判断が必要な問い合わせを分け、対応の流れを設計する事例です。RAGによる根拠検索から、人への引き継ぎ、評価・改善までを扱います。
- `cases/system-understanding`：仕様書が不足する既存システムを、まず人間が理解し、変更できる状態へ整える事例です。コードから仕様を復元し、図で可視化した知識をRAG / QAへつなぎます。
- `cases/three-ai-maintenance`：既存ソフトウェアの暗号処理を安全に変更するため、仕様調査・実装・確認を3つのAIで分担した事例です。GPT・GitHub Copilot・Microsoft 365 Copilotを使い、人間が判断責任を保持した工程を示します。
- `architecture/change-and-reevaluation`：AIシステムを変更したとき、どこを確認し直し、問題があればどう元へ戻すかを考えます。モデル・指示・知識・権限をVersion Bundleで管理し、再評価とリリースの条件を整理します。
- `architecture/cost-latency-routing`：回答の速さやモデルの価格だけでなく、やり直しと人間の確認を含めて処理方法を選びます。品質・待ち時間（Latency）・リスクから、使うモデルや処理経路を評価します。
- `architecture/prompts-as-interfaces`：複数のAIへ仕事を渡すとき、成果物・根拠・状態を取り違えずに引き継ぐ方法を考えます。プロンプトを受け渡しの契約として捉え、情報の型・意味・権限を検証します。
- `architecture/reference-architecture`：AIの答えをそのまま業務処理に使わず、確認・承認・実行を分ける全体構成を示します。必要情報（Context）の準備から監視までをつなぎ、誤生成が業務へ届く経路を制御します。
- `evaluation-hitl/code-evaluation-acceptance`：AIが書いたコードを、安全に採用できる変更かどうか確認する工程を設計します。コンパイラ・テスト・静的解析・人間のレビューを組み合わせ、未確認の変更を本番へ流しません。
- `evaluation-hitl/qa-evaluation`：AIの回答が正しいかだけでなく、根拠の提示、回答を控える判断、人への引き継ぎも評価します。検索から業務効果までを分けて測り、QAの改善箇所を見つけます。
- `evaluation-hitl/responsibility-and-hitl`：AIが答えや作業案を出した後、誰が確認し、採用し、実行を承認するかを決めます。人への引き継ぎ条件・根拠・記録まで含めてHuman in the Loopを設計します。
- `foundations/ai-business-design`：AIへ仕事を任せても、人間の判断や責任は残ります。必要な情報、確認の手間、例外対応を含めて、AI・人間・既存システムの仕事をどう分けるか考える連載です。
- `foundations/answer-scope`：AIが答えてよい質問と、人へ渡すべき質問の範囲を決めます。対象・版・根拠・入力条件を明示し、回答・拒否・引き継ぎの品質を継続して測ります。
- `foundations/conditional-probability`：同じAIでも、渡す情報や指示が変わると答えが変わります。その仕組みを条件付き確率から整理し、回答のばらつきと、RAG・ガードレール・評価で制御できる範囲を考えます。
- `foundations/guardrail-models`：AIへ「してはいけない」と伝えることと、システムが実際に止めることは異なります。指示による誘導、生成時の制約、検証、実行認可を分け、Guardrailの限界を説明します。
- `foundations/temperature-design`：AIの答えの出方を変える設定は、正しさを保証する設定ではありません。Temperatureが生成の確率分布へ与える影響を説明し、用途に合う値を評価と実験で選びます。
- `knowledge-context/human-and-ai-documentation`：人が全体を理解する資料と、AIが根拠を検索する資料は、読み方が異なります。知識の正本は一つに保ち、版・条件・例外を共有しながら、表示と取得単位を分けて設計します。
- `knowledge-context/instruction-knowledge-evidence`：AIへの作業指示、継続して参照する知識、今回の回答を支える根拠を分けます。Instruction・Knowledge・Evidenceの役割を明確にし、更新や失敗原因の確認を個別に行える構成を考えます。
- `knowledge-context/prompt-failure-modes`：指示を長くしても、必要な情報が足りなかったり、指示同士が矛盾していたりすればAIは失敗します。Context不足・情報の混在・検証基準の欠如を分けて、直すべき箇所を判断します。
- `knowledge-context/prompt-structure`：AIへ何を頼み、何を根拠にし、どの形で返してほしいかを分けて伝えます。Role・Task・Contextなどからプロンプトを構成し、権限や承認はシステム側の制御と区別します。
- `knowledge-context/qa-behavior-constraints`：問い合わせに何を答え、何を開示せず、どこで人へ渡すかを決めます。対応規則をKnowledgeとして管理し、指示に書くだけでなく、実行時の検証・認可で業務への流出を防ぎます。
- `knowledge-context/qa-operations`：問い合わせAIを、回答して終わる道具ではなく、知識を確認・更新し続ける仕組みとして設計します。検索・回答・拒否・人への引き継ぎ・記録を、QAとKnowledgeの運用としてつなぎます。
- `practices/ai-education-principles`：AIの操作を覚えるだけでなく、答えを確認し、使うか止めるか判断する力を育てます。責任境界・HITLの原則とツール別の実践を分け、業務の品質と工数から教育を見直します。
- `reference/evaluation-metrics`：検索や回答、人への引き継ぎがうまく働いているかを、何で測るか確認する資料です。Retrieval・安全性・運用品質・レビュー負荷の指標を、対象集合や閾値と合わせて定義します。
- `reference/mathematical-reference`：AIの出力の揺らぎや失敗リスクを考えるときに使う数式をまとめています。条件付き確率・Temperature・RAG・期待損失について、数学上の定義と設計用の簡略モデルを区別します。
- `software-engineering/code-generation-boundaries`：AIにコードを書かせる前に、変更の影響を確認できるか、失敗時に戻せるかを考えます。必要なContext・テスト・人間レビューの費用を整理し、安全に採用できた変更で評価します。
- `software-engineering/code-generation-models`：コード生成AIは、文章を出すモデルだけで成り立つわけではありません。必要情報（Context）、編集ツール、権限、テストを分け、生成から採用までの仕組みと失敗箇所を説明します。
- `software-engineering/multi-ai-orchestration`：複数のAIを使うとき、誰に何を渡し、どの成果物を確認して次へ進むかを決めます。Task・Context・Tool・権限を役割ごとに整理し、工程全体の品質と費用を管理します。
- `essays/ai-roles-beyond-fde`：AIを実際の仕事へ組み込むには、モデルの操作だけでなく、設計・実装・評価を担う専門性が必要です。FDEを起点に、Architecture・Engineering・Evaluationなどの責任が分かれていく見通しを考察します。
- `essays/rethink-work-before-ai`：AIへ任せる前に、その仕事をなくす・まとめる・変える・単純化できないか考えます。業務改善の手順（ECRS）を踏まえ、残る仕事を人間・既存ソフトウェア・AIのどれへ任せるか判断します。
- `cases/customer-support-ai-dx/continuous-improvement`：誤回答や人への引き継ぎが起きた理由を調べ、次の改善へ戻す仕組みを設計します。知識不足・検索失敗・画面での離脱を分け、Knowledge・Retrieval・UI・業務のどこを直すか判断します。
- `cases/customer-support-ai-dx/design-principles`：問い合わせ対応の設計から、他の業務でも使える判断原則を整理します。価値を起点に、AIと人の責任、回答根拠、停止条件、HITL、評価・改善をどう組み合わせるか考えます。
- `cases/customer-support-ai-dx/executive-summary`：問い合わせ対応の何が問題で、AIと人の仕事をどう分ける設計なのかを短くまとめます。扱う設計範囲と、確認できる事実・設計条件・試算の区別をExecutive Summaryとして示します。
- `cases/customer-support-ai-dx/knowledge-design`：検索で見つかった文書でも、顧客への回答根拠として使えるとは限りません。製品・機種・版数・公開可否を確認し、RAGが参照してよいKnowledgeの範囲を設計します。
- `cases/customer-support-ai-dx/poc-evaluation`：AIが一度答えられたことと、問い合わせ業務で使えることは異なります。試験導入（PoC）で検索・対話・回答を分け、根拠の適合性と人へ渡す判断から採用可否を見ます。
- `cases/customer-support-ai-dx/stopping-conditions`：根拠がない、機種が分からない、専門判断が必要なときには、AIの回答を止めます。高影響な操作や非公開情報も停止条件として整理し、人へ引き継ぐFail Safeを設計します。
- `cases/system-understanding/human-and-ai-knowledge`：人がシステムの全体像を理解する図と、AIが必要な根拠を探す資料を分けます。図とMarkdownを使い、文脈を残しながら、RAGが取得する情報の範囲を整理します。
- `cases/system-understanding/rag-implementation`：質問に関係する根拠を探し、実務で確認できる回答へつなぐ仕組みを整えます。RAGの検索範囲・知識の粒度・画面操作との対応を調整し、AIの生成と人間の検証を分担します。
- `cases/three-ai-maintenance/cryptography-and-failure-modes`：暗号処理を変えるとき、失敗した場合の動作が決まっていない箇所を確認します。CNG API / DPAPIとレジストリを題材に、後続処理への影響から安全な停止・復旧を考えます。

## カテゴリと表示

主要ページの導入は `src/lib/site.ts`、AI設計テーマは `designTopics`、DXテーマは `dxCategories` を正本とする。Homeはサイトの目的・仕事像・読書入口を短く示す。Careerは仕事像を先に置き、専門ラベルと本文は維持する。関連導線は本文後へ置く。

## 検証

check・test・build・SEO監査と生成HTMLで確認する。Chromeの実viewportでMobile / Tablet / Desktopを確認済み。

## 表示・本文監査

40件の変更はsummaryと更新日のみで、Markdown本文はHEADと一致。ChromeでHome、Career、Books、Knowledge / Context、Evaluation / HITLを390・768・1440pxで表示し、全15条件で横スクロールなし。HomeとBooksのMobile画像、CareerのDesktop画像を確認。
