---
title: "拡散言語モデルは、なぜ左から順番に生成しなくても文章を作れるのか"
summary: "自己回帰生成とマスク復元を文章の模式例で比較する。離散吸収マスク過程の遷移・逆確率・ELBOと復元損失を導き、人工分布を検算しながら並列更新、再マスク、生成費用の条件を整理する。"
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

## 「猫が眠る」を、左から作るか、隠れた位置を直すか

一般的な自己回帰型言語モデルは「猫」→「猫 が」→「猫 が 眠る」のように、確定した接頭辞から次のトークンを選ぶ。ここでは説明のため日本語を三つのトークンに区切っている。実際のトークン化がこの単位になるとは限らない。

別の方式として「[M] [M] [M]」→「猫 [M] [M]」→「猫 が 眠る」のように、複数の未確定位置を反復的に復元する生成を考えられる。[M]はマスクという特別な状態である。これは生成順序の模式例であり、どのモデルでもこの文章を生成するという測定結果ではない。

Autoregressive Model（自己回帰モデル）は、過去に確定した出力を次の条件へ戻すモデルである。Non-Autoregressive Model（非自己回帰モデル）は、その左から一つずつという生成依存に限らない方式を指す。全トークンが独立だという意味ではない。Diffusion Model（拡散モデル）は、データを壊す順方向過程を定義し、それを戻す逆方向過程を学ぶ生成モデルの枠組みである。

<figure id="figure-1" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/diffusion-generation-light.svg" alt="自己回帰は猫、猫が、猫が眠るの順で生成し、マスク復元は系列の複数の未確定位置を反復更新する" width="480" height="650" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/diffusion-generation-dark.svg" alt="自己回帰は猫、猫が、猫が眠るの順で生成し、マスク復元は系列の複数の未確定位置を反復更新する" width="480" height="650" loading="lazy" />
  <figcaption>図1 確率を表す方法と、実際に生成する順序を対応付ける。並列更新が可能でも、全体のレイテンシが短いとは限らない。</figcaption>
</figure>

図1を理解するには、「どの文章へ確率を与えるか」と「その分布からどう標本を得るか」を分ける必要がある。画像の連続値へガウスノイズ（正規分布に従う連続値のゆらぎ）を足す[DDPM](https://arxiv.org/html/2006.11239v2)と、離散トークンを別の状態へ移す方式は同じ式ではない。本稿は代表例として、マスクを吸収状態とする離散拡散を扱う。

## 二つの系列確率の表現

語彙$\mathcal V$の大きさを整数$V\ge1$、系列長を整数$n\ge1$、ノイズ段数を整数$T\ge2$として固定し、文を$x_0=(x_0^1,\ldots,x_0^n)\in\mathcal V^n$とする。上付きは位置、下付きは後に使うノイズ時刻である。条件の指示などは$c$と書く。

自己回帰なら[連鎖律](/foundations/conditional-probability/)を使って

<span id="equation-1"></span>

$$
p_\theta(x_0\mid c)=\prod_{i=1}^np_\theta(x_0^i\mid x_0^{<i},c)
$$

と分解し、この順にサンプリングする。確率の連鎖律自体は一般的な恒等式であり、左からの生成算法まで一意に決めるわけではない。

離散拡散では、途中の壊れた系列$x_1,\ldots,x_T$を潜在変数として導入する。潜在変数は、観測する完成文とは別の、周辺化する中間状態である。最終ノイズ分布$p_T$と逆遷移を使って

<span id="equation-2"></span>

$$
p_\theta(x_0\mid c)
=\sum_{x_{1:T}}p_T(x_T)\prod_{t=1}^Tp_\theta(x_{t-1}\mid x_t,c)
$$

と表せる。$\theta$は復元器のパラメータである。潜在経路を全て足せば、完成文へ確率が与えられる。左端を先に確定しなくても、このような確率モデルを定義できることが出発点になる。

## 順方向の吸収マスク過程

Forward Process（順方向過程）は、完成データへノイズを加える側である。Discrete Diffusion（離散拡散）は、有限状態間の遷移でこれを記述する。Masked Diffusion（マスク拡散）は、その一種として内容をマスクへ置き換える。

マスク$M\notin\mathcal V$を加え、行列$Q_t\in\mathbb R^{(V+1)\times(V+1)}$を定義する。行は現在、列は次の状態である。位置ごとに独立に、確率$\beta_t\in[0,1]$で未マスクのトークンを$M$へ移し、一度$M$になれば戻さない。

<span id="equation-3"></span>

$$
Q_t(a,b)=
\begin{cases}
1-\beta_t & a=b\in\mathcal V,\\
\beta_t & a\in\mathcal V,\ b=M,\\
1 & a=b=M,\\
0 & \text{otherwise}.
\end{cases}
$$

各行の和は1になる。これが遷移確率（Transition Probability）であり、次の状態が現在の状態だけに依存する列をMarkov Chain（マルコフ連鎖）という。入力文のトークン自体が互いに独立だとは仮定していない。

Noise Schedule（ノイズスケジュール）は$\beta_1,\ldots,\beta_T$などの壊し方の時間配分である。生存確率を$\alpha_0=1$、$\alpha_t=\prod_{s=1}^t(1-\beta_s)$とすると、元の一トークン$a$が時刻$t$に残る確率は

<span id="equation-4"></span>

$$
q(x_t^i=b\mid x_0^i=a)
=\alpha_t\mathbf1[b=a]+(1-\alpha_t)\mathbf1[b=M].
$$

前の時刻まで残る確率へ$1-\beta_t$を掛ければ帰納的に導ける。全系列の順方向遷移確率は、各位置の遷移確率の積である（行列として表すなら位置ごとの行列のKronecker積になる）。[D3PM](https://arxiv.org/html/2107.03006v3)は、吸収型を含む離散状態での設計を扱う。語彙番号へガウスノイズをそのまま足しているのではない。

## 何を手掛かりに逆方向へ戻すのか

Reverse Process（逆方向過程）は、壊れた系列から前の時刻の状態を生成する側、Denoisingはそのノイズを除いて内容を復元する処理である。順方向の遷移行列を逆行列にする操作とは異なる。

完成トークン$x_0^i=a$まで知っていれば、$x_t^i=M$のとき前時刻に$a$が残っていた確率をベイズ則で計算できる。$1-\alpha_t>0$を仮定すると

<span id="equation-5"></span>

$$
\begin{aligned}
q(x_{t-1}^i=a\mid x_t^i=M,x_0^i=a)
&=\frac{q(x_t^i=M\mid x_{t-1}^i=a)q(x_{t-1}^i=a\mid x_0^i=a)}{q(x_t^i=M\mid x_0^i=a)}\\
&=\frac{\beta_t\alpha_{t-1}}{1-\alpha_t}
=\frac{\alpha_{t-1}-\alpha_t}{1-\alpha_t}=w_t.
\end{aligned}
$$

前時刻にもマスクだった確率は$(1-\alpha_{t-1})/(1-\alpha_t)=1-w_t$である。現在未マスクなら過去も同じトークンである。条件のマスクが確率0なら、この条件付き式を使わない。

生成時には$x_0$が未知なので、復元器$r_\theta(a\mid x_t,t,c)$が、位置ごとに完成トークンの分布を予測する。$r_\theta$は語彙$\mathcal V$上で正規化し、マスク自体へ確率を与えないものとする。SUBS型の説明では

<span id="equation-6"></span>

$$
p_\theta(x_{t-1}^i=a\mid x_t,c)=w_t\,r_\theta(a\mid x_t,t,c),\quad
p_\theta(x_{t-1}^i=M\mid x_t,c)=1-w_t
$$

をマスク位置へ適用し、未マスク位置はそのまま引き継ぐ。和が1になることは直ちに確認できる。[MDLM](https://arxiv.org/html/2406.07524v2)は、このような置換によるパラメータ化と学習目的の簡略化を扱う。

複数のマスク位置の$r_\theta$は系列全体を参照するが、一回の逆ステップの出力を位置ごとの積で実装するなら、その一歩の条件付き独立性はモデル化の仮定である。真のデータ分布の全依存関係を一度で完全復元する保証はない。短い一語の厳密な逆確率と、長い文を近似する復元器は分ける。

## 尤度と、マスクを当てる学習目的のつながり

途中の系列には「どの位置が、どの時刻に隠れたか」ごとに候補があり、長い文や多段の過程では、全経路の確率を足すことが難しい。そこで、壊した例を抽出して評価できる期待値を作り、それが対数尤度の下側にあるという関係を学習に利用する。ELBO（Evidence Lower Bound、変分下界）は、この対数尤度の下限であり、計算しやすい補助分布$q(x_{1:T}\mid x_0)$を使う。下界を改善しただけで、実際の生成品質が必ず向上するとは限らない。

支持集合上で比が定義でき、必要な期待値が有限とする。Jensenの不等式（対数は凹関数なので、平均の対数は対数の平均以上）から

<span id="equation-7"></span>

$$
\begin{aligned}
\log p_\theta(x_0\mid c)
&=\log\mathbb E_q\left[\frac{p_\theta(x_{0:T}\mid c)}{q(x_{1:T}\mid x_0)}\right]\\
&\ge\mathbb E_q[\log p_\theta(x_{0:T}\mid c)-\log q(x_{1:T}\mid x_0)].
\end{aligned}
$$

上の等号には、生成経路の質量を$q$が被覆する条件が必要である。被覆がない場合は$q$の支持上の部分和が$p_\theta(x_0\mid c)$以下なので、同じ下界自体は得られるが、最初の等号はそのまま使えない。有限状態の人工例では正の質量を明示的に確認する。

右辺の負を整理し、Markov過程の逆向き分解を使うと、負のELBOは

<span id="equation-8"></span>

$$
\begin{aligned}
\mathcal L_{\rm VLB}={}&D_{\rm KL}(q(x_T\mid x_0)\|p_T(x_T))\\
&+\sum_{t=2}^T\mathbb E_{q(x_t\mid x_0)}
D_{\rm KL}(q(x_{t-1}\mid x_t,x_0)\|p_\theta(x_{t-1}\mid x_t,c))\\
&-\mathbb E_{q(x_1\mid x_0)}\log p_\theta(x_0\mid x_1,c).
\end{aligned}
$$

KLは[分布のずれ](/foundations/language-model-loss/)を表す非負の量である。初項は終端ノイズ、和は逆遷移、末項は完成データの再構成を評価する。$α_T=0$かつ$p_T$を全マスクにすれば初項は0になる。$α_T>0$なのに$p_T$を全マスクだけにすると支持が合わず、初項が無限大になり得る。

一マスク位置の真の事後は、$a$へ$w_t$、$M$へ$1-w_t$を与える。予測は$a$へ$w_tr_\theta(a)$を与えるので、そのKLは

<span id="equation-9"></span>

$$
w_t\log\frac{w_t}{w_tr_\theta(a)}
+(1-w_t)\log\frac{1-w_t}{1-w_t}
=-w_t\log r_\theta(a).
$$

零質量の項は$0\log(0/q)=0$とし、$w_t=0$なら寄与0として連続的に定義する。$r_\theta(a)=0$で真の重みが正なら無限大である。独立な順方向マスクと、位置ごとの逆分布の積を仮定すれば、位置別の損失を足せる。このため、所定の重み付きのマスク復元交差エントロピーが現れる。任意のBERT型マスク損失が、そのまま任意の拡散モデルの尤度に等しいわけではない。

## 一語の人工分布を、順方向と逆方向で照合する

語彙を$\{A,B\}$、完成データの確率を$(0.6,0.4)$とする。二段の$\beta=(0.5,1)$では

<span id="equation-10"></span>

$$
Q_1=\begin{pmatrix}0.5&0&0.5\\0&0.5&0.5\\0&0&1\end{pmatrix},
\qquad Q_2=\begin{pmatrix}0&0&1\\0&0&1\\0&0&1\end{pmatrix}.
$$

行・列の順は$(A,B,M)$である。初期分布$(0.6,0.4,0)$は、$(0.3,0.2,0.5)$、$(0,0,1)$へ移る。後段の真の逆条件付き分布は、全マスクから$(0.3,0.2,0.5)$へ戻し、前段で残るマスクを$(0.6,0.4)$へ分ければ完成分布を復元する。これは既知のデータ分布からベイズ則で作ったoracleの逆確率で、学習したニューラルモデルの出力ではない。

<figure id="figure-2" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/diffusion-mask-light.svg" alt="人工分布A0.6B0.4を、A0.3B0.2マスク0.5、全マスクへ移し、既知の逆確率で戻す" width="480" height="500" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/diffusion-mask-dark.svg" alt="人工分布A0.6B0.4を、A0.3B0.2マスク0.5、全マスクへ移し、既知の逆確率で戻す" width="480" height="500" loading="lazy" />
  <figcaption>図2 順方向の破壊と逆方向の復元。全ての数値は一トークンの人工モデルで、文生成の品質を測定していない。</figcaption>
</figure>

Pythonでは行列積と全経路列挙で周辺分布を照合し、既知の同時確率から真の逆遷移を作る。ELBOの検算では、時刻1の完成語予測を$(0.7,0.3)$、時刻2を$(0.8,0.2)$と別に人工設定し、経路列挙の対数尤度とELBO・KLの分解を比較する。完成語Aの確率は0.75、対数尤度は約−0.287682、ELBOは約−0.289909となり、差の約0.002227が経路の事後分布間のKLに一致する。どちらの復元器も訓練して得た値ではない。二段・四段で中間マスク量が変わっても、oracle逆過程なら同じ完成分布へ戻ることを検算する。これは近似復元器のステップ数を増やせば必ず品質が向上するという主張ではない。

## 並列更新と速度、再マスクと分布は分ける

Sampling Stepは、推論時にノイズ状態を一段更新する回数である。密Attentionの復元器で、長さ$n$、モデル幅$d$、更新$K$回なら、系列混合の素朴な費用は$O(Kn^2d)$、射影などは別に$O(Knd^2)$となる。生成位置を一度に更新しても、長い系列を何度も読む費用がある。

Remasking（再マスク）は、一度提案したトークンを未確定へ戻し、別の反復で再検討する操作である。上で導いた「未マスク位置は引き継ぐ」SUBS型の逆遷移とは異なるサンプリング規約である。信頼度による選別やブロック生成を加えた算法の分布・品質は別途評価する必要があり、元の逆過程の証明を無条件に流用しない。

[LLaDA](https://arxiv.org/html/2502.09992v3)は、ランダムにマスクした位置を予測する事前学習とSFTを用い、生成時のマスク除去・再検討の方式を研究している。2025年の論文であり、全ての拡散言語モデルに同じ目的関数や生成規則を指定するものではない。2026年の[実験比較](https://arxiv.org/html/2606.19475v1)も、複数の特定モデルと生成条件を比べるプレプリントとして参照する。確認した版から査読完了は判断せず、報告された順位を一般優位性へ拡張しない。

自己回帰方式はKVキャッシュと逐次確定が使いやすく、拡散型は複数位置の修正・制約付き復元などの余地を持つ。品質・費用・制御性の比較には、同じ学習規模、生成長、更新回数、ハードウェア、評価課題が必要である。[投機的復号](/foundations/speculative-decoding/)のように、自己回帰分布を保つ高速化とは目的と条件が異なる。拡散型が自己回帰型を置き換えると確定したわけではない。

## 検算と結論

`python scripts/math-phase-three/verify.py` の拡散系統で、行の正規化、周辺化、ベイズ逆遷移、段数比較、ELBOの下界とKL分解を検算する。小さい有限状態を全列挙し、式と異なる経路で確かめる。実モデルの学習や性能測定は行わない。

問いへの答えは、途中のノイズ系列を潜在変数とし、そこから完成系列へ戻す分布を学べば、左からの確定を生成の唯一の順序にする必要がないことである。ただし、潜在系列の確率モデル、学習の下界、実際の復元算法を分けて理解しなければ、並列性を速度や品質の保証と取り違える。

共通の定義は<a data-reference-page href="/reference/glossary/#diffusion-model">基本用語集</a>からも確認できる。

## 一次資料

- Ho et al., [Denoising Diffusion Probabilistic Models](https://arxiv.org/html/2006.11239v2), NeurIPS 2020。連続値の拡散と変分学習。
- Austin et al., [Structured Denoising Diffusion Models in Discrete State-Spaces](https://arxiv.org/html/2107.03006v3), NeurIPS 2021。§3、吸収マスク・逆過程・変分目的。
- Sahoo et al., [Simple and Effective Masked Diffusion Language Models](https://arxiv.org/html/2406.07524v2), NeurIPS 2024。§3と付録B、SUBSと復元損失の対応。
- Nie et al., [Large Language Diffusion Models](https://proceedings.nips.cc/paper_files/paper/2025/hash/48b383b24230e0e6e649d9c98dae4d8c-Abstract-Conference.html), NeurIPS 2025。本文照合は[arXiv v3](https://arxiv.org/html/2502.09992v3)の§2。
- [Diffusion Language Models: An Experimental Analysis](https://arxiv.org/html/2606.19475v1), 2026。§5の特定モデル・生成条件の比較。査読状況未確認の追跡資料。
