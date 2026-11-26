---
title: "神経記号推論と形式的検証"
summary: "LLMによる証明候補の生成と、記号的な検査の責務を分ける。有限命題の証明書・SATを検算し、健全性、完全性、前提と現実世界の対応を整理する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: published
public: true
lifecycle: active
published_at: "2026-11-26"
last_updated: "2026-11-27"
tags: [数理基礎, 言語モデル, 第4段階]
---

## AIの証明がもっともらしいとき、何を確認するのか

言語モデルが「$P$ならば$Q$、$Q$ならば$R$、したがって$P$ならば$R$」と説明しても、文章が自然であることだけでは、途中の推論が規則に従うかは分からない。証明の候補を生成する仕事と、候補が形式的な規則を満たすかを確認する仕事を分けると、生成結果の評価を明確にできる。

**神経記号推論**（neural-symbolic reasoning）は、ニューラルネットワークによる候補生成や探索の誘導と、記号で定義した知識・推論規則を組み合わせる考え方である。本稿では、LLMが証明候補を作り、形式的な検査器が確認する構成を扱う。何でも正しいと判断できる装置ではなく、指定した前提と形式体系に対する保証を作る仕組みである。

<span id="figure-1"></span>

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-four/proof-pipeline-light.svg" alt="人間が問題を形式化し、AIの証明候補を検査器が受理または拒否する構成。" width="480" height="640" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-four/proof-pipeline-dark.svg" alt="人間が問題を形式化し、AIの証明候補を検査器が受理または拒否する構成。" width="480" height="640" loading="lazy" />
  <figcaption>図1 証明候補の生成、形式体系に対する検査、前提の確認を分ける。</figcaption>
</figure>

### 候補の生成確率と、証明の成立を分ける

前提の有限集合を $\Gamma$、目標の式を $\varphi$、証明候補を $\Pi$ とする。言語モデルの生成分布 $q_\theta(\Pi\mid\Gamma,\varphi)$ は、候補が出力される確率である。式の真理値や、検査に合格する確率そのものではない。

**形式体系**（formal system）は、使用できる式の構文、前提として認める公理、式から式を導く推論規則を定めたものである。検査器を $V_T(\Gamma,\varphi,\Pi)\in\{0,1\}$ と書く。$T$ は採用する体系であり、1は候補がその体系の検査を通ったことを表す。不正な構文や参照先も拒否する必要がある。

人間は、自然言語の問題をどの形式的な命題として記述するかを決める。AIに候補生成を任せても、この**形式化**と前提の妥当性は別に確認する。誤った命題を忠実に証明したり、矛盾した前提から結論を導いたりしても、元の業務問題を解決したことにはならない。

## 小さな命題論理で、検査できる内容を具体化する

**命題論理**（propositional logic）は、真または偽を取る命題と、それらを結ぶ論理演算を扱う。$P,Q,R$ を命題、$\neg$ を否定、$\land$ を論理積、$\to$ を含意とする。古典論理の含意 $P\to Q$ は $\neg P\lor Q$ と同じ真理値を持つ。因果関係や時間順序の表現ではない。

**推論規則**は、どの前提からどの式へ進めるかを定める。ここでは、$A$ と $A\to B$ から $B$ を導くモーダスポネンス（modus ponens, MP）を用いる。

<span id="equation-1"></span>

$$
\frac{A\qquad A\to B}{B}.
$$

これは、生成モデルが学習した「続きとして自然な文」を選ぶ処理とは異なる。式の形と参照先が規則に合うかを確認する処理である。

前提を $\Gamma=\{P,P\to Q,Q\to R\}$、目標を $R$ とする。検査する証明書は次の5行となる。

| 行 | 式 | 根拠 |
| --- | --- | --- |
| 0 | $P$ | 前提0 |
| 1 | $P\to Q$ | 前提1 |
| 2 | $Q\to R$ | 前提2 |
| 3 | $Q$ | 行0と行1にMPを適用 |
| 4 | $R$ | 行3と行2にMPを適用 |

<span id="figure-2"></span>

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-four/proof-steps-light.svg" alt="PとPならばQからQ、QとQならばRからRを導く証明。" width="480" height="640" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-four/proof-steps-dark.svg" alt="PとPならばQからQ、QとQならばRからRを導く証明。" width="480" height="640" loading="lazy" />
  <figcaption>図2 前提を引用し、既に得られた式に推論規則を適用する人工例。</figcaption>
</figure>

検査器は、前提番号の範囲、参照先が既に得られた行であること、含意の前件ともう一方の式が一致することを確認する。最後の式が目標と一致した場合だけ受理する。先の行を参照する候補や、$P\to Q$ と $Q$ から $P$ を得ようとする候補は、この規則では認めない。

## 証明の構文と、真理値による意味を照合する

$\Gamma\vdash_T\varphi$ は、体系 $T$ の規則で証明できるという**構文上**の関係である。一方、$\Gamma\models\varphi$ は、前提をすべて真にする解釈では必ず結論も真になるという**意味上**の関係である。

命題変数が $m$ 個なら、真理値の割当て $v$ は $2^m$ 通りである。意味上の帰結は次の条件で定義できる。

<span id="equation-2"></span>

$$
\Gamma\models\varphi
\quad\Longleftrightarrow\quad
\forall v,\ \left(\bigwedge_{\gamma\in\Gamma}v(\gamma)\right)\Rightarrow v(\varphi).
$$

**健全性**（soundness）は、証明できた式が意味上も帰結となる性質である。**完全性**（completeness）は、その体系と意味論の範囲で、意味上の帰結を証明できる性質である。単にプログラムが実行できることとは異なる。

今回のMP検査器について、健全性の理由を追う。前提の行は、$\Gamma$ を真にする割当てで真となる。既に真である $A$ と $A\to B$ にMPを適用すると、古典論理の含意の定義から $B$ も真となる。行数に関する帰納法により、受理した有限証明の最終行も真となる。これは採用した規則に対する数学的な説明であり、Python実装そのものを証明支援系で形式検証したものではない。

前提の引用とMPだけを実装した小さな検査器に、古典命題論理全体についての完全性を主張してはいけない。完全な証明体系を選ぶことと、その一部の規則を実装することは異なる。

### 反例は、どの推論が誤りかを明らかにする

$P\to Q$ から $Q\to P$ が従うかを調べるなら、$P$ が偽、$Q$ が真という割当てが反例となる。前提は真だが結論は偽である。検査器が拒否したという結果に加え、この割当てによって誤りの意味を説明できる。

**SAT**（Boolean satisfiability、充足可能性判定）は、論理式を真にする割当てが存在するかを調べる問題である。命題論理では、帰結の確認を反例の不在へ変換できる。

<span id="equation-3"></span>

$$
\begin{aligned}&\Gamma\models\varphi\\&\quad\Longleftrightarrow\quad\operatorname{UNSAT}\!\left(\left(\bigwedge_{\gamma\in\Gamma}\gamma\right)\land\neg\varphi\right).\end{aligned}
$$

ここでUNSATは、式を真にする割当てが存在しないことを表す。反例があれば左辺は成立せず、反例がなければ成立するのである。先の例では、$P$、$\neg P\lor Q$、$\neg Q\lor R$、$\neg R$ の四つを同時に満たせない。$P$ から $Q$、さらに $R$ が必要となり、$\neg R$ と矛盾する。

検算では、この節の有限命題を真理値表で全列挙する。同時に、節に含まれる単一のリテラルを伝播し、必要なら場合分けするDPLL型のSAT手続きを実装し、300個の人工的な小規模CNFと全列挙の結果を照合する。CNFは論理和で作る節を論理積で接続した形式であり、リテラルは命題変数またはその否定である。この照合は検査対象の範囲を増やすが、SAT実装の一般的な正しさの形式証明ではない。変数が $m$ 個なら割当ては $2^m$ 通りある。充足可能性の単純な全列挙では、満たす割当てが見つかれば早期終了できるが、充足不能な場合や最後の割当てまで見つからない場合は全候補を確認する。したがって、最悪の評価回数は $2^m$ であり、実行時間には各割当てで式を評価する費用も掛かる。

## 述語、理論、証明支援系では、何が加わるか

**述語論理**（predicate logic）は、対象の領域、対象についての述語、量化子を扱う。$P(x)$ は領域の要素 $x$ に関する命題であり、$\forall x$ はその領域のすべての要素についてという意味である。$\forall x(P(x)\to Q(x))$ と $P(a)$ から、全称式を $a$ に適用して $P(a)\to Q(a)$ を得た後、MPで $Q(a)$ を導ける。

対象領域と述語の解釈は、現実世界との対応に必要である。「すべての入力」を有限のテストデータだけに限定して形式化した証明から、未知の入力一般の安全性は導けない。

**SMT**（satisfiability modulo theories、背景理論付き充足可能性判定）は、命題に加えて算術、配列など、指定した理論の意味を扱う。使用する理論や論理の断片によって、判定可能性と計算費用が異なる。Z3などが返す `sat` はモデルの存在、`unsat` は充足不能、`unknown` は手続きが結論を出せなかったことを示す。`unknown` は命題の偽を意味しない。

**決定可能性**（decidability）は、対象とする問題のすべての入力について、有限時間で正否を返すアルゴリズムが存在する性質である。古典一階述語論理の妥当性には健全かつ完全な証明体系があるが、一般の妥当性判定は決定可能ではない。証明がある場合に探索で見つけられることと、証明がない場合にも必ず停止することを区別する。これは本稿の有限命題の全列挙とは対象が異なる。

### LLMが探索し、カーネルが確認する

**定理証明支援系**（proof assistant）は、形式的に記述した命題と証明を検査するシステムである。Leanでは命題を型、証明をその型の項として扱い、検査の中核であるカーネルが項の整合性を確認する。自動探索やLLMが候補を作っても、受理の条件を別にできる。

たとえば、先の命題に対応するLeanの記述は次となる。

```lean
example (P Q R : Prop) (hp : P) (hpq : P → Q) (hqr : Q → R) : R :=
  hqr (hpq hp)
```

これは公式資料の関数適用と命題の対応に基づく説明用の記述である。今回の環境にはLean実行系がなく、このコードをLeanで実行したとは報告しない。Python検算は前節の独立した小さな命題検査器を対象とする。

カーネルに対する信頼、採用した公理、実装の不具合、未証明部分を許す宣言も保証の境界となる。未証明の仮定を追加して検査を通すことと、元の前提から証明を完成させることは異なる。

## AIに任せる探索と、人間が確認する前提

証明探索は、次に使う規則、補題、中間目標を選ぶ仕事である。各ノードの子の数が高々整数 $B\ge1$、根を深さ0とし最大深さが整数 $d\ge0$ の探索木を考える。深さ $j$ のノードは高々 $B^j$ 個なので、探索ノード総数 $N$ の上界は次となる。

<span id="search-node-bound"></span>

$$
\begin{aligned}
N&\le\sum_{j=0}^{d}B^j\\
&=\begin{cases}(B^{d+1}-1)/(B-1),&B\ge2,\\d+1,&B=1.\end{cases}
\end{aligned}
$$

$B\ge2$ ならこの総和は $2B^d$ 以下であり、最悪のノード数を $O(B^d)$ と表せる。$B=1$ なら一本の経路となり、$d+1$ ノードである。途中で証明が見つかる場合や枝刈りがある場合は、上界より少なくて済む。

ノード数は実行時間そのものではない。訪れたノード $v$ での候補生成・検査・推論の費用を $c_v$ とすれば、単純な逐次探索の仕事は $\sum_v c_v$ と管理費用で決まる。一律の上限 $c$ を仮定できる場合には $O(cN)$ と評価できるが、LLM生成や式の検査を無条件に定数時間とは扱わない。LLMは有望な候補を提案する役割を担えるが、採用した手順を検査する責務は残る。

今回のように式が明示され、行の参照と一致判定だけで確認できる証明書では、検査は探索全体より小さくできる。ただし式の比較費用も数える必要があり、一般の証明支援系の型検査や簡約が常に線形時間であると主張してはいけない。

DeepSeek-Prover（2024）は生成と形式検証を組み合わせるとともに、矛盾した仮説を含む形式化の問題を報告している。DeepSeek-Prover-V2（2025）は中間目標への分解と学習を扱う技術報告である。ここではこれらを構成の事例として参照し、実験で測定した性能を一般的な保証へ拡張しない。

[検証可能な報酬](/foundations/verifiable-reward-reasoning/)として「検査器の受理」を使う場合も、何を検査しているかを明示する必要がある。受理された証明が、形式化した命題を満たすことと、その命題が現実の要求を正しく表すことは別である。

2026年の[Goedel-Prover-V2](https://proceedings.iclr.cc/paper_files/paper/2026/hash/13e8be77982beb73d7ed0bbf122f9f3c-Abstract-Conference.html)は、Leanからのフィードバックによる自己修正などを扱うICLR会議論文である。ここでは公式要旨で確認した生成・修正・検査の構成だけを参照する。実験全文の独立評価は行っておらず、報告されたベンチマークの値を、本稿の検算結果や一般の証明成功率とは扱わない。

## 検算の範囲と、分かったこと

`scripts/math-phase-four/verify.py` は、正しいMP証明書の受理、誤った参照や規則適用の拒否、真理値表による帰結の確認、SATとの照合を行う。前提に $P$ と $\neg P$ を同時に置くと、それらを真にする割当てが存在しないことも確認する。意味上の帰結が空虚に成立する状況であり、現実の前提が正しいという証拠にはならない。

検算に外部のLeanやZ3は使っておらず、一般の述語論理の証明器も実装していない。数値的な試行や有限の全列挙を、一般の形式証明の代用とは扱わない。

生成AIと形式的検証を組み合わせる意義は、もっともらしさと規則への適合を分けられることである。形式体系の中の正しさは検査器へ委ね、形式化、前提、現実への適用範囲は人間が確認する。この責務分離まで含めて、AIの推論を評価できる。

補助用語は[共通用語集](/reference/glossary/#neural-symbolic)で確認できる。

## 一次資料・基礎資料

- Lean公式, [Propositions and Proofs](https://lean-lang.org/theorem_proving_in_lean4/Propositions-and-Proofs/), [Quantifiers and Equality](https://lean-lang.org/theorem_proving_in_lean4/Quantifiers-and-Equality/), [Axioms and Computation](https://lean-lang.org/theorem_proving_in_lean4/Axioms-and-Computation/). 命題と証明、量化、公理とカーネルの関係。
- Avigadほか, [Logic and Proof: Semantics of Propositional Logic](https://leanprover-community.github.io/logic_and_proof/semantics_of_propositional_logic.html), [Semantics of First-Order Logic](https://leanprover-community.github.io/logic_and_proof/semantics_of_first_order_logic.html). 構文と意味、健全性・完全性の基礎資料。
- Cornell CS486, [Applied Logic: Computability](https://www.cs.cornell.edu/info/people/kreitz/Teaching/CS486/notes-24.pdf). 一階論理の妥当性と半決定可能性。
- Microsoft, [Z3 Guide: Basic Commands](https://microsoft.github.io/z3guide/docs/logic/basiccommands/). `sat`・`unsat`・`unknown`の公式資料。
- Xinほか（2024）, [DeepSeek-Prover](https://arxiv.org/html/2405.14333v1). 特に§5.2の矛盾した仮説に関する分析。技術報告の確認範囲に限定する。
- Renほか（2025）, [DeepSeek-Prover-V2](https://arxiv.org/html/2504.21801v1). 中間目標と形式検証の構成を参照するプレプリント。
- Linほか（2026）, [Goedel-Prover-V2](https://proceedings.iclr.cc/paper_files/paper/2026/hash/13e8be77982beb73d7ed0bbf122f9f3c-Abstract-Conference.html). ICLR、公式要旨のみ。
- Cornell CS486, [Completeness and Compactness of First-Order Tableaux](https://www.cs.cornell.edu/courses/cs4860/2019fa/lectures/Completeness-Compactness-FOT.pdf). 完全性と探索の停止条件に関する基礎資料。
