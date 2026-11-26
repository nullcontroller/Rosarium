---
title: "言語モデルは、なぜ再学習せずに新しいタスクへ適応できるのか"
summary: "指示や例示で回答が変わる現象から、文脈内学習の条件付け・潜在タスク推定・Attentionによる参照を整理する。ベイズ更新の人工例と、暗黙的最適化・Induction Headの研究が説明できる範囲を区別する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: draft
public: false
lifecycle: active
last_updated: "2026-11-26"
tags: [数理基礎, 言語モデル, 第3段階]
---

## 入力例を足すと、重みを変えずに何が変わるのか

同じ言語モデルに、次の三つの入力を与える場面を考える。「感情を分類せよ」だけの場合、「楽しい→肯定」という例を添えた場合、さらに「悲しい→否定」という例も添えた場合である。例は求める分類規則や回答形式の手掛かりになる。しかし、例を増やせば必ず正解するとは限らない。これは現象を説明するための入力例であり、実モデルを測定した結果ではない。

指示だけで例がない設定をZero-shot、一例ならOne-shot、少数例ならFew-shotという。ここでのshotは学習時に重みを更新する回数ではなく、入力内の例の数である。Demonstration（例示）は「入力と望ましい出力」の組など、解き方を示す情報を指す。指示そのものと区別する。

文脈内学習（In-Context Learning, ICL）は、推論時に与える例などの文脈に応じて、パラメータを更新せずにタスクへの振る舞いが変わる現象を扱う。本稿では、この広い現象と、後に述べる特定の内部機構を同一視しない。コンテキスト（Context）は、その一回の処理でモデルが実際に参照できる指示・例・生成済み文字列などである。保存済みの会話全体や学習データ全体とは異なる。[GPT-3の原論文](https://arxiv.org/html/2005.14165v4)は、重みを更新しない評価をzero/one/few-shotに分けて実施した。個々のタスクで同じ効果を保証する実験ではない。

<figure id="figure-1" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/icl-context-light.svg" alt="指示に例を追加し、固定したモデルのAttentionから回答分布を計算する。重み更新を行う学習とは分ける" width="480" height="650" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/icl-context-dark.svg" alt="指示に例を追加し、固定したモデルのAttentionから回答分布を計算する。重み更新を行う学習とは分ける" width="480" height="650" loading="lazy" />
  <figcaption>図1 変えるのは文脈か、パラメータか。文脈適応の計算経路を示す模式図であり、特定製品の内部実装図ではない。</figcaption>
</figure>

図1の区別が必要なのは、回答が変わることだけでは、追加学習が起きた証拠にならないためである。以下では、まず出力分布を条件付けとして記述し、その計算を理解するための二つの解釈を導く。

## 条件付けとパラメータ更新を分ける

$\theta\in\mathbb R^p$をモデルの学習済みパラメータ、$I$を指示、$D_m=((x_1,y_1),\ldots,(x_m,y_m))$を$m$例の文脈、$x_*$を今回の質問とする。$m=0$では例がない。回答$Y$の分布は

<span id="equation-1"></span>

$$
p_\theta(Y\mid I,D_m,x_*)
$$

である。添字の$\theta$を固定したまま、条件の$D_m$を変えている。自己回帰型なら、この分布を[次トークンの条件付き確率](/foundations/conditional-probability/)の積で表す。入力が変わっても偶然同じ分布になる場合はあり、「例を追加したら必ず分布が変わる」という不等式は置かない。

一方、追加学習では、例えば[損失関数](/foundations/language-model-loss/)$\mathcal L(\theta;D_m)$を使って

<span id="equation-2"></span>

$$
\theta'=\theta-\eta\nabla_\theta\mathcal L(\theta;D_m)
$$

と重み自体を変える。$\eta>0$は学習率である。通常のICLの記述にはこの更新を含めない。文脈に含まれる回答が、重みへ永続的に保存されたとも限らない。

[Attention](/foundations/attention-information-flow/)では、生成位置のQuery（何を探すかを表すベクトル）と、例の各位置のKey（照合用のベクトル）から重みを作り、Value（集約する表現）を読む。$q\in\mathbb R^{d_k}$、$k_j\in\mathbb R^{d_k}$、$v_j\in\mathbb R^{d_v}$なら

<span id="equation-3"></span>

$$
a_j=\frac{\exp(q^\top k_j/\sqrt{d_k})}{\sum_{r\in J}\exp(q^\top k_r/\sqrt{d_k})},
\qquad o=\sum_{j\in J}a_jv_j.
$$

$J$は因果マスクで許された参照位置の空でない集合である。例のトークンも$J$へ入り得る。これは文脈へアクセスする計算であり、重みの値だけから「規則を理解した」「最も重要な例を特定した」と結論することはできない。複数層での表現変換も必要になる。

## 潜在タスクを推定する、という説明モデル

「同じラベルを使うのか、反対のラベルを使うのか」が入力から明示されていないとする。タスクを表す潜在変数$Z\in\mathcal Z$を導入する。潜在とは直接観測していないという意味であり、モデル内にその名前の変数が実装されているという意味ではない。タスク分布は、どの課題がどれだけ現れるかを表す確率分布である。

有限集合$\mathcal Z$、事前確率$\pi_z=P(Z=z)$、タスク別の尤度（そのタスクで観測した出力が生じる確率）$\ell_z(y\mid x)$を置く。ここでは$Z$と各$x_i$を固定すると、例の出力$y_i$は条件付き独立と仮定する。例の尤度は

<span id="equation-4"></span>

$$
P(D_m\mid Z=z,x_{1:m})=\prod_{i=1}^m\ell_z(y_i\mid x_i).
$$

ベイズ推論（Bayesian Inference）は、観測の尤度と事前確率から、観測後の事後確率を求める方法である。同時確率を$P(D_m,Z=z)=P(D_m\mid Z=z)\pi_z$と二通りに分解し、全タスクで足した観測確率で割ると

<span id="equation-5"></span>

$$
\pi_z^{(m)}
=\frac{\pi_z\prod_{i=1}^m\ell_z(y_i\mid x_i)}
{\sum_{u\in\mathcal Z}\pi_u\prod_{i=1}^m\ell_u(y_i\mid x_i)}.
$$

分母は正でなければならない。事前確率0のタスクを、この式だけで正の確率へ戻すことはできない。全候補が観測へ確率0を与える場合、仮定したタスク集合が適切でなく、この更新は定義できない。

次の回答は、推定したタスクを一つに決め打ちせず、事後確率で平均できる。全確率の法則から

<span id="equation-6"></span>

$$
P(y_*\mid x_*,D_m)
=\sum_{z\in\mathcal Z}\ell_z(y_*\mid x_*)\pi_z^{(m)}.
$$

前の式は「どの規則か」、後の式は「その規則の不確実性を残したまま何を答えるか」を求めている。[Xie et al.](https://arxiv.org/html/2111.02080v3)は潜在概念を持つ生成過程でICLを説明したが、識別可能性、区切り、分布の正則性などの仮定がある。本節の有限混合モデルはその全理論の再現ではなく、事後予測を理解するための簡略例である。実際のLLMが明示的なベイズ計算を行うとの断定ではない。

## Zero・One・Few-shotを同じ人工モデルで比べる

$Z=A$は入力ビットと同じラベルを90%で返す課題、$Z=B$は反対を90%で返す課題とする。事前確率は各$1/2$、例は$(0,0)$、次に$(1,1)$である。例同士の独立性は前節の人工的な仮定であり、自然言語の例へ無条件に適用しない。

<span id="calculation-table"></span>

|文脈|尤度 $P(D_m\mid A),P(D_m\mid B)$|事後 $P(A\mid D_m)$|質問 $x_*=1$ への $P(y_*=1)$|
|---|---|---:|---:|
|例なし|1, 1|0.5|0.5|
|一例 $(0,0)$|0.9, 0.1|0.9|0.82|
|二例 $(0,0),(1,1)$|0.81, 0.01|約0.987805|約0.890244|

最後の値は$0.9\times(81/82)+0.1\times(1/82)=73/82$である。モデルの重みを変えず、どの規則らしいかという条件が変わっただけでも回答分布が変わる。これが数学で確かめたい点であり、実LLMの正答率を表す数値ではない。

<figure id="figure-2" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/icl-posterior-light.svg" alt="人工二タスクモデルで例なし、一例、二例に伴いタスクAの事後確率が0.5、0.9、約0.988へ変化する" width="480" height="500" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/icl-posterior-dark.svg" alt="人工二タスクモデルで例なし、一例、二例に伴いタスクAの事後確率が0.5、0.9、約0.988へ変化する" width="480" height="500" loading="lazy" />
  <figcaption>図2 例示によるタスク推定の変化。数値は本文の人工モデルだけの理論値である。</figcaption>
</figure>

Pythonでは分数による一括尤度計算と、浮動小数点の逐次更新を照合する。例えば、同じ質問「1→？」の前に「0→0、1→1」を置く場合と、逆順の「1→1、0→0」を置く場合を考える。この人工モデルでは尤度の積が同じなので、事後確率も予測分布も変わらない。一方、実際の言語モデルでは例の位置や直前の文脈が変わり、参照のされ方や回答が変わり得る。どちらの順序が有利かはモデルや課題ごとに検証が必要であり、この入力例を使った実LLMの測定は行っていない。

## メタ学習・暗黙的最適化・パターン参照は同じ主張ではない

メタ学習（Meta-learning）は、多数のタスクから、新しいタスクへ適応しやすい学習規則や表現を得る考え方である。タスクを$Z\sim\mu$から取り、文脈$D$と問い合わせ$(x,y)$を与えて

<span id="equation-7"></span>

$$
\min_\theta\;\mathbb E_{Z,D,x,y}
[-\log p_\theta(y\mid D,x)]
$$

のような外側の学習を行えば、文脈を使う予測器を訓練できる。$\mu$は訓練タスクの分布である。外側では$\theta$を更新し、利用時には固定する。Garg et al.の[単純関数族の研究](https://arxiv.org/html/2208.01066v3)は、合成された回帰課題などでこの性質を検討した。一般の自然言語タスクで同じアルゴリズムが実現されることを証明したものではない。

帰納バイアス（Inductive Bias）は、構造や学習分布が、どの規則を選びやすくするかという傾向である。文脈へ適合する規則が複数あれば、例だけで一意に決まらない。タスク分布とモデル構造が予測へ関係する。

暗黙的勾配降下（Implicit Gradient Descent）は、ネットワークの順伝播が、別の推定問題の勾配更新に対応するという研究上の解釈である。具体的に$X\in\mathbb R^{m\times d}$、$y\in\mathbb R^m$、回帰重み$w\in\mathbb R^d$を置き

<span id="equation-8"></span>

$$
\mathcal L(w)=\frac{1}{2m}\|Xw-y\|^2,
\quad \nabla_w\mathcal L=\frac1mX^\top(Xw-y).
$$

$w_0=0$から一回更新すると$w_1=\eta X^\top y/m$である。問い合わせ$x_*\in\mathbb R^d$の予測は

<span id="equation-9"></span>

$$
x_*^\top w_1=\frac\eta m\sum_{i=1}^m(x_*^\top x_i)y_i.
$$

これは内積を重みとして例の出力を集約する形である。負の重みも許す線形Attentionなら、適切な射影・残差を構成して勾配ステップへ対応付けられる。[von Oswald et al.](https://proceedings.mlr.press/v202/von-oswald23a.html)の定理と実験はその構成と回帰条件に依存する。正規化softmax付きの任意のAttentionが、この一式と等しいわけではない。ここでの$w$は文脈内で推定する回帰係数であり、固定したTransformerパラメータ$\theta$とは別物である。

Induction Head（反復パターンを利用するAttentionヘッド）は、概略「Aの後にBがあった。再びAが来たらBを予測する」という参照に関係する。例えば「赤→R、青→B、赤→」からRを補う模式である。[Olsson et al.](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html)は小規模モデルの回路・介入結果などを示した研究報告で、全ICLがこの回路一つで説明できるとの確立した一般定理ではない。ベイズ的説明は振る舞いの記述、回路解析は内部計算の候補であり、説明の水準が異なる。

## 検算、費用、適用限界

検算はリポジトリの `scripts/math-phase-three/verify.py` をPython 3で実行する。標準ライブラリだけを使い、ICL系統では事後確率・予測分布の正規化、一括／逐次更新、逆順、回帰勾配と有限差分、内積集約との一致を確かめる。許容誤差・実行環境・出力は同ディレクトリのREADMEとJSON結果に記録する。LLMの訓練・API測定は行わない。

有限$K=|\mathcal Z|$タスクの逐次ベイズ更新は$m$例で$O(mK)$、単純な一勾配更新は$O(md)$である。これらは人工推定器の費用であり、LLMそのものの費用ではない。Transformerの例の参照は系列長・層数・Attention方式に依存し、例を増やせば入力処理とKV保持の負担も増える。

誤った例、曖昧な指示、学習したタスク分布から外れた規則、類似した候補タスクは適応を妨げ得る。例の数だけで品質は保証できない。コンテキスト長の上限内でも、全例の均等・完全な利用が保証されるわけではない。

2026年の[Markov系列での機構研究](https://arxiv.org/html/2604.12151v3)は、有限集合の遷移規則を取り出す戦略と、文脈から統計を推定する戦略を区別している。これは人工系列での分析であり、自然言語LLM全般への証明とは扱わない。今回確認したarXiv版だけから査読完了とは認定せず、付録の全証明を独立再証明したとも主張しない。

本稿の問いへの答えは、パラメータを変えなくても、入力例を条件にして出力分布を計算し直せることである。その内部で何を推定・参照しているかには、モデルと課題を限定した説明が必要になる。「学習していない」ことと「入力に適応する計算がない」ことは同じではない。

共通の定義は<a data-reference-page href="/reference/glossary/#in-context-learning">基本用語集</a>からも確認できる。

## 一次資料

- Brown et al., [Language Models are Few-Shot Learners](https://arxiv.org/html/2005.14165v4), NeurIPS 2020。§2の評価設定と限界。
- Xie et al., [An Explanation of In-context Learning as Implicit Bayesian Inference](https://arxiv.org/html/2111.02080v3), ICLR 2022。§2–4の潜在概念・条件付きの理論と合成実験。
- Garg et al., [What Can Transformers Learn In-Context?](https://arxiv.org/html/2208.01066v3), NeurIPS 2022。単純関数族の訓練と分布外評価。
- von Oswald et al., [Transformers Learn In-Context by Gradient Descent](https://proceedings.mlr.press/v202/von-oswald23a.html), ICML 2023。線形Attentionの構成と回帰実験。
- Olsson et al., [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html), 2022。研究機関の技術報告。
- Gibson et al., [Distinct mechanisms underlying in-context learning in transformers](https://arxiv.org/html/2604.12151v3), 2026、arXiv追跡資料。人工Markov系列への限定を維持する。
