---
title: "Career"
seo_title: "Career | Applied AI・DX・System Architecture"
summary: "業務課題を整理し、AI・人間・データ・既存システムの役割を決め、運用できる仕組みへ落とし込む仕事をしています。Applied AI × DX × System Architectureを軸に、企画から改善・終了までを考えます。"
layer: career
status: stable
last_updated: "2026-10-04"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium/blob/master/src/content/career/overview.md
  commit: "ae8d6b5be128f332ba6a7be4e158cde1f8a937d4"
---

## Applied AI × DX × System Architecture

私が関心を持っているのは、
AIそのものを作ることでも、
AIを既存業務へ単純に追加することでもありません。

業務や利用者にとって何を実現したいのかを起点に、

- そもそもシステム化するべきか
- AIを使うべきか
- 人間に残す判断は何か
- 既存システムをどこまで活かすか
- 必要なKnowledgeやContextは何か
- どのように評価し、改善するか
- 何を残し、変え、統合し、終わらせるか

を考え、一つの仕組みとして設計することです。

生成AIによって「作ること」そのもののコストは急速に下がっています。

だからこそ今後は、
何を作れるか以上に、

**何を作るべきか、何を作らないか、そして作ったものをどう育て、いつ終わらせるか**

という設計判断の価値が高くなると考えています。

---

## What I Do

私の仕事は、技術を起点に始まりません。

まず業務や利用者の課題を理解し、
現在の業務、データ、既存システム、制約を整理します。

その上で、

**Business / Human / AI / Data / Existing Systems**

それぞれの役割を決め、
実際に運用可能なシステムへ落とし込みます。

関心領域は、要求や要件の整理だけでも、
アーキテクチャ設計だけでもありません。

価値の定義から、

**要求 → 要件 → Architecture → Implementation → Adoption → Operation → Evaluation → Improvement**

までが一つの連続した設計対象です。

導入して終わりではなく、
利用された結果を次の設計へ戻すところまで含めて考えます。

---

## AIを使う前に考えること

私は、AIを使える仕事を探すのではなく、
まず業務そのものを見るようにしています。

その仕事は本当に必要なのか。

既存システムで解決できないのか。

ルール化できないのか。

人間が判断すべきことは何か。

AIが扱うために必要な情報は何か。

誤った場合に、
人間がその判断理由を説明できるのか。

AIの採用は、その後です。

AIは非常に強力な実装手段ですが、
それ自体が目的ではありません。

---

## System Lifecycle

私が重視しているのは、
新しいものを作ることだけではありません。

システムには、

- 作る
- 使う
- 直す
- 変える
- 統合する
- 縮小する
- 終わらせる

というライフサイクルがあります。

特に既存システムでは、
「古いこと」よりも
「変えにくいこと」の方が大きな問題になることがあります。

そのため、

**Changeability と Retirement を同時に設計する**

ことを重視しています。

作る時点から、
将来どのように変更し、
どのように終わらせるかまで考える。

これは Software Lifecycle だけでなく、
Knowledge や業務にも共通する考え方です。

---

## Human Responsibility

AIを業務へ組み込むとき、
最も重要だと考えているのは責任境界です。

AIが何を生成したかだけではなく、

- どの情報を使ったか
- どの前提で判断したか
- どこから人間が確認するか
- 誤った場合に誰が判断を引き取るか

を設計します。

最終的な責任を人間が持つ以上、
人間が説明できない判断をAIへ丸ごと委ねるべきではありません。

そのため、
Human in the Loop や AI Evaluation は
補助機能ではなく、
AIシステムそのものの一部だと考えています。

---

## What I Want to Build

今後取り組みたいのは、
生成AIや自然言語インターフェースを活用した
社内DXの仕組みです。

ただし、
短期間でPoCを次々に作ることよりも、

一つのサービスやシステムに長く関わり、

**企画 → 要求 → Architecture → 導入 → 利用 → 評価 → 改善**

を継続して回すことを志向しています。

実際の利用結果を観察し、
その結果を次の設計へ戻しながら、
時間をかけて価値を育てる仕事をしたいと考えています。

---

## Explore

設計の具体例を知りたい方はCaseへ、考え方を掘り下げたい方は関連テーマへ進んでください。

### 考え方の実例

<div class="career-work-grid">
  <article class="career-work">
    <h3><a href="../cases/customer-support-ai-dx/">生成AI / RAGによる顧客サポートDX →</a></h3>
    <p>業務・AI・人間・Knowledgeを一体で設計した例。価値と責任分担から、評価・運用・改善までを追えます。</p>
  </article>
  <article class="career-work">
    <h3><a href="../cases/three-ai-maintenance/">3つのAIをオーケストレーションしたレガシー保守 →</a></h3>
    <p>AIを判断主体ではなく設計支援として組み込み、人間がレビューと最終判断を引き取った例です。</p>
  </article>
  <article class="career-work">
    <h3><a href="../cases/system-understanding/">レガシーシステムを「理解可能な状態」にする設計手法 →</a></h3>
    <p>分散したコード・資料の理解を、変更と問い合わせへ再利用できるKnowledgeへ変換した例です。</p>
  </article>
</div>

### 設計・実践を読む

<div class="career-focus-grid">
  <section>
    <h3><a href="../ai/">Applied AI →</a></h3>
    <p>AIをどこへ適用し、どこで止めるか。AI設計・理論・実践知へ進めます。</p>
  </section>
  <section>
    <h3><a href="../dx/">DX →</a></h3>
    <p>技術導入より先に、価値・業務・システムをどう変えるかを考えます。</p>
  </section>
  <section>
    <h3><a href="../ai-design/architecture/">System Architecture →</a></h3>
    <p>業務・人間・AI・既存システムを接続する構成と境界を扱います。</p>
  </section>
  <section>
    <h3><a href="../ai-design/lifecycle-operations/">Software Lifecycle →</a></h3>
    <p>導入後の評価・運用・変更・再設計へ。終了までの判断を考えます。</p>
  </section>
  <section>
    <h3><a href="../ai-design/knowledge-context/">Knowledge / Context →</a></h3>
    <p>指示・知識・根拠を分け、AIと人間に必要な情報を設計します。</p>
  </section>
  <section>
    <h3><a href="../ai-design/evaluation-hitl/">Human Review / AI Evaluation →</a></h3>
    <p>生成結果を採用できる条件と、人間が判断を引き取る仕組みを扱います。</p>
  </section>
  <section>
    <h3><a href="../practices/">Practices →</a></h3>
    <p>AI導入・教育・横展開・開発Workflowへ設計原則を適用した実践知です。</p>
  </section>
</div>

### LinkedIn

職歴・肩書き・在籍期間・資格・経歴の詳細はLinkedInを正本として更新しています。Rosariumでは設計思想と実践事例を示しています。

[LinkedInで職務プロフィールを見る →](https://www.linkedin.com/in/%E8%A3%95%E5%A4%AA%E6%9C%97-%E7%AB%8B%E6%9E%97-99076b352/)
