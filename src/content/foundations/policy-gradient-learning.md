---
title: "強化学習は、報酬からどのように方策を改善するのか"
summary: "MDPと割引収益を定義し、軌跡の確率から方策勾配を導く。REINFORCE、ベースライン、Importance Sampling、PPOを離散行動の検算と結び、言語生成への対応と保証の限界を説明する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: draft
public: false
lifecycle: active
last_updated: "2026-11-26"
tags: [数理基礎, 強化学習, 第2段階]
---

## 報酬しか与えられないとき、何を微分するのか

二つの行動のどちらを選ぶべきか、正解ラベルがなくても、選んだ結果の報酬を観測できる場合がある。強化学習では、その観測を使って行動を選ぶ確率である方策を改善する。本稿の問いは、離散的な行動そのものを微分せずに、どう期待報酬の勾配を求めるかである。

[言語モデルの学習損失](/foundations/language-model-loss/)が観測されたトークンの尤度を扱うのに対し、ここでは方策から標本を生成し、その結果の価値を評価する。小さな有限問題で式を導き、REINFORCEからPPOへ進む。期待目的の改善は、個々の出力が正しいことや、大域最適解への到達の保証ではない。

## 状態・行動・報酬を定義する

有限の状態集合 $\mathcal S$、行動集合 $\mathcal A$、遷移確率 $P(s'\mid s,a)$、有界な報酬 $r(s,a,s')$、初期分布 $\mu$ を置く。マルコフ決定過程（MDP）では、現在の状態と行動を与えると、次状態の分布はそれ以前の履歴に追加依存しない。実際の観測がこの条件を満たすとは限らず、その場合は履歴を状態に含めるか、部分観測として別にモデル化する。

方策 $\pi_\theta(a\mid s)$ は、パラメータ $\theta\in\mathbb R^d$ に対して微分可能な確率分布とする。まず長さ $H$ が固定された有限エピソードを扱い、$0\le\gamma\le1$ を割引率とする。$R_{t+1}$ は行動 $A_t$ の後に得る報酬である。

$$
G_t=\sum_{k=t}^{H-1}\gamma^{k-t}R_{k+1},\qquad
J(\theta)=\mathbb E_{\tau\sim p_\theta}[G_0].
$$

$G_t$ は時点 $t$ からの割引累積報酬（収益）、$\tau=(S_0,A_0,\ldots,S_H)$ は軌跡である。無限時間へ広げる場合は、例えば $\gamma<1$ と有界報酬によって収益を有限にする必要がある。本稿の導出は有限和を使い、積分と微分の交換に関する問題を避ける。

ある状態から方策に従った場合の期待収益を価値関数、その最初の行動を固定したものを行動価値関数と呼ぶ。有限時間では残り時間で値が変わるため、時間添字を付ける。

$$
V_t^\pi(s)=\mathbb E[G_t\mid S_t=s],\qquad
Q_t^\pi(s,a)=\mathbb E[G_t\mid S_t=s,A_t=a].
$$

$V_H=0$ と置けば、条件付き期待値を一段分解して

$$
Q_t^\pi(s,a)=\sum_{s'}P(s'\mid s,a)
\{r(s,a,s')+\gamma V_{t+1}^\pi(s')\},\quad
V_t^\pi(s)=\sum_a\pi(a\mid s)Q_t^\pi(s,a)
$$

を得る。報酬が確率的なら $r$ は条件付き平均と読み替える。これらの式は、現在の一手と、それ以後の価値を接続する。

## 軌跡の確率から方策勾配を導く

環境の $\mu,P,r$ は $\theta$ に依存しないとする。以下の対数微分では、微分する点の開近傍で軌跡の支持集合 $\mathcal T_+$ が固定され、各 $\tau\in\mathcal T_+$ について $p_\theta(\tau)>0$ かつ微分可能であると仮定する。集合外の軌跡はその近傍で恒等的に確率0であり、微分も0である。したがって、対数は集合内だけで取り、確率0の項を失わずに和を期待値へ変換できる。有限の状態・行動と固定長により和は有限で、和と微分の交換も正当化できる。例えば固定した許可行動集合上で正のsoftmax方策を使い、環境の遷移を固定する場合がこの条件に当たる。支持集合が変わる境界へ、この導出を追加の検討なしに適用しない。

$$
p_\theta(\tau)=\mu(s_0)
\prod_{t=0}^{H-1}\pi_\theta(a_t\mid s_t)P(s_{t+1}\mid s_t,a_t).
$$

離散的な軌跡の和に戻すと、微分すべきものが明確になる。対数微分 $\nabla p=p\nabla\log p$ を使って

$$
\begin{aligned}
\nabla_\theta J
&=\sum_\tau G_0(\tau)\nabla_\theta p_\theta(\tau)\\
&=\mathbb E_{p_\theta}[G_0\nabla_\theta\log p_\theta(\tau)]\\
&=\mathbb E_{p_\theta}\left[G_0
\sum_{t=0}^{H-1}\nabla_\theta\log\pi_\theta(A_t\mid S_t)\right].
\end{aligned}
$$

過去の報酬 $R_{k+1}$（$k<t$）は、$S_t$ までの履歴を固定した条件付き期待値で、時点 $t$ のscore $\nabla\log\pi(A_t\mid S_t)$ と掛けると平均0になる。未来に影響しない報酬項を落とすと

$$
\nabla_\theta J=
\mathbb E\left[\sum_{t=0}^{H-1}\gamma^t
G_t\nabla_\theta\log\pi_\theta(A_t\mid S_t)\right].
$$

さらに $G_t$ を $S_t,A_t$ の条件付き期待値 $Q_t^\pi$ に置換しても期待値は変わらない。これが本稿の有限時間・割引目的に対する方策勾配の形である。外側の $\gamma^t$ を省略した実装や、割引状態訪問分布へ吸収した定式化とは、目的・標本の取り方を揃えて比較する必要がある。[Policy Gradient原論文](https://proceedings.neurips.cc/paper_files/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html)は関数近似を含む定理を扱うが、ここでは上の有限和から導出した。

## REINFORCEとベースライン

REINFORCEは、方策で得た軌跡の $G_t$ を使って上の勾配を標本平均で推定する。$M$ エピソードを独立に生成した推定値を $\hat g$ とし、$\theta\leftarrow\theta+\eta\hat g$（$\eta>0$）で上昇させる。報酬を通じて行動確率を更新できるが、長い軌跡では推定分散が大きくなり得る。

行動に依存しない $b_t(s)$ を引いても、次の恒等式により期待勾配は変わらない。

$$
\begin{aligned}
\mathbb E_{A\sim\pi}[b_t(s)\nabla\log\pi(A\mid s)]
&=b_t(s)\sum_a\nabla\pi(a\mid s)\\
&=b_t(s)\nabla1=0.
\end{aligned}
$$

ベースラインを $V_t^\pi(s)$ とすれば、期待値では $Q_t^\pi-V_t^\pi=A_t^\pi$（Advantage）になる。同じ状態での平均的な選択より良いか、という比較である。学習した価値推定を使うactor–criticでは、その近似誤差やブートストラップの偏りも検討する。方策勾配を計算するとき、ベースライン側を通る微分は別に扱う。

ベースラインは何を選んでも分散を減らすわけではない。条件付き二乗ノルムを最小化するスカラーは、scoreを $z=\nabla\log\pi(A\mid s)$ として

$$
b^*(s)=\frac{\mathbb E[G_t\|z\|^2\mid s]}{\mathbb E[\|z\|^2\mid s]}
$$

である（分母が正の場合）。これは $\mathbb E[(G_t-b)^2\|z\|^2]$ を $b$ で微分して得る。$V(s)$ は扱いやすい基準だが、常に分散最小の値とは限らない。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-two/policy-light.svg" alt="方策から行動を標本化し、収益とベースラインの差をscoreへ掛け、方策を更新する" width="480" height="560" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-two/policy-dark.svg" alt="方策から行動を標本化し、収益とベースラインの差をscoreへ掛け、方策を更新する" width="480" height="560" loading="lazy" />
  <figcaption>図1 報酬から更新まで。期待値を変えない基準の減算と、標本分散の低減は別々に確認する。</figcaption>
</figure>

## 古い方策の標本を使う場合とPPO

同じ状態 $s$ で新方策の期待値を古い方策から求めるには、$\pi_\theta(a\mid s)>0$ なら $\pi_{old}(a\mid s)>0$ という被覆条件の下で

$$
\mathbb E_{a\sim\pi_\theta}[f(a)]
=\mathbb E_{a\sim\pi_{old}}\left[
\frac{\pi_\theta(a\mid s)}{\pi_{old}(a\mid s)}f(a)\right]
$$

というImportance Sampling（重要度サンプリング）が使える。軌跡分布全体の厳密な補正には行動比の積が必要で、分散が大きくなりやすい。単一時点の比だけでは、新方策で変わる状態訪問分布まで厳密に補正したことにはならない。

PPOは古い標本上の代理目的を使う。$\rho_t=\pi_\theta(A_t\mid S_t)/\pi_{old}(A_t\mid S_t)$、固定したAdvantage推定値を $\hat A_t$、$0<\epsilon<1$ とする。

$$
L^{clip}(\theta)=\widehat{\mathbb E}_t
\left[\min\{\rho_t\hat A_t,
\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\hat A_t\}\right].
$$

$\hat A_t>0$ なら単項は $\hat A_t\min(\rho_t,1+\epsilon)$、$\hat A_t<0$ なら $\hat A_t\max(\rho_t,1-\epsilon)$ となる。改善方向への行き過ぎに追加の利得を与えない、という片側の飽和である。例えば $\epsilon=0.2$、$\hat A=1$、$\rho=1.5$ では1.2となる。一方 $\hat A=-1$、$\rho=0.5$ では $-0.8$ となる。

この処理は、全ての比を区間内に拘束する操作ではない。未標本の行動や共有パラメータの変化もあるため、方策間のKLダイバージェンスに対する厳密な上限制約を保証しない。実際の学習ではKL監視、学習率、更新回数なども必要である。価値損失やエントロピー項を持つPPO全体と、ここで示したクリップ項だけを区別する。[PPO原論文](https://arxiv.org/pdf/1707.06347)§3、式(7)と照合した。

図2は正負のAdvantageで飽和する側が異なることを示す。横軸は新旧方策の確率比であり、報酬の値ではない。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-two/policy-clip-light.svg" alt="Advantageが正なら確率比1.2以上で上側へ飽和し、負なら0.8以下で改善方向へ飽和するクリップ目的" width="480" height="520" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-two/policy-clip-dark.svg" alt="Advantageが正なら確率比1.2以上で上側へ飽和し、負なら0.8以下で改善方向へ飽和するクリップ目的" width="480" height="520" loading="lazy" />
  <figcaption>図2 ε = 0.2の単項。各曲線は上のminの式から計算した模式的なグラフで、KL制約を描いたものではない。</figcaption>
</figure>

## 二行動の計算を独立に検算する

1状態・1ステップで行動1の確率を $p=\sigma(\theta)$、行動0を $1-p$、決定的報酬をそれぞれ1、0とする。この人工モデルでは $J=p$ なので

$$
\frac{dJ}{d\theta}=p(1-p).
$$

一方、scoreは行動1で $1-p$、行動0で $-p$。全行動の列挙で $\mathbb E[R\,score]=p(1-p)$ と一致する。$\theta=0$ では勾配0.25、学習率1の期待勾配による1回の更新で $p=0.562177$ になる。

|量|初期値／検算値|意味|
|---|---:|---|
|$p$|0.5|学習前の行動1確率|
|解析勾配|0.25|期待収益の微分|
|中心差分|約0.25|$h=10^{-5}$ で独立に照合|
|勾配推定量の分散、$b=0$|0.0625|二点分布の列挙|
|同じ分散、$b=0.5$|0|この対称な一手問題に限る|

分散0という結果を多段の強化学習へ一般化してはいけない。検算スクリプト `python scripts/math-phase-two/n03_policy.py` は、解析式、全行動の列挙、有限差分、反復更新を比較する。乱数を使わず、許容絶対誤差は勾配で $10^{-8}$。20回の期待勾配更新を記録するが、実モデルの学習曲線ではない。

## 言語モデルへの対応と限界

言語生成では、入力と生成済み接頭辞を状態、次トークンを行動、モデルの次トークン分布を方策とする。遷移はトークンの追加、終了はEOSまたは長さ上限である。最終回答の採点を終端報酬に置ける。$\gamma=1$ の有限生成では、回答全体の報酬を各トークンのscoreへ掛けられるが、どの途中判断が寄与したかは直接観測できない。

履歴を全て保持するMDPと、モデルが有限の文脈しか見ない実装は区別する。報酬の設計、標本数、探索で得られる候補、推定の偏り・分散によって学習は変わる。$M$ 本・長さ $H$ の収益集計は $O(MH)$、方策の前向き・逆伝播はネットワークの計算費用が別に掛かる。価値モデルや報酬モデルの学習費用もこの集計量に含まない。

報酬から勾配へ接続するのが本稿の結論である。次に必要なのは、その報酬が何を表すかという問題である。[選好学習](/foundations/preference-learning-dpo/)では人の比較判断を目的へ変換し、[検証可能な報酬](/foundations/verifiable-reward-reasoning/)では検証器の条件を扱う。

## 一次資料

- Williams, [Simple statistical gradient-following algorithms for connectionist reinforcement learning](https://doi.org/10.1007/BF00992696), Machine Learning 8, 1992, §3–4。REINFORCEの原典（査読済み）。
- Sutton et al., [Policy Gradient Methods for Reinforcement Learning with Function Approximation](https://proceedings.neurips.cc/paper_files/paper/1999/hash/464d828b85b0bed98e80ade0a5c43b0f-Abstract.html), NeurIPS 1999, Theorem 1。方策勾配定理（査読済み）。
- Sutton and Barto, [Reinforcement Learning: An Introduction, 2nd ed.](https://www2.imm.dtu.dk/courses/02465/pensum/sutton2018.pdf), 2018（2020 printing）, Chapters 3、5、13、特にpp.104、325–329。大学配布の教科書本文で、MDP、重要度サンプリング、割引付きREINFORCEとベースラインを照合した。
- Schulman et al., [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347), 2017-07-20、v2 2017-08-28, §2–3、Algorithm 1。技術報告。クリップ代理目的の実験と厳密なKL制約を区別した。
