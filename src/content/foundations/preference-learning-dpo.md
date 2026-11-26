---
title: "言語モデルは、人間の選好をどのように学習するのか"
summary: "回答の比較をBradley–Terryモデルへ写し、KL正則化付き報酬最大化の最適方策からDPO損失を導く。正規化定数の相殺、RLHFとの関係、選好と正しさの違いを人工例で確認する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: draft
public: false
lifecycle: active
last_updated: "2026-11-26"
tags: [数理基礎, 選好学習, 第2段階]
---

## 「こちらがよい」を、どの目的関数へ変えるのか

同じ質問に複数の妥当な回答がある場合、一つの正解文を模倣するだけでは、簡潔さや説明の仕方への好みを表現しにくい。選好学習では、同じ入力に対する回答の比較を学習信号にする。本稿は比較データから報酬、報酬から方策、さらにDPOの損失へ至る関係を導く。

前提は[方策勾配](/foundations/policy-gradient-learning/)と[学習損失](/foundations/language-model-loss/)である。人間が好んだという観測は、事実性、安全性、社会的価値の真値ではない。この限界を保ったまま数学を組み立てる。

## 比較データとBradley–Terryモデル

入力 $x$、好まれた回答 $y_w$、比較対象 $y_l$ の組をデータ集合 $\mathcal D$ に保存する。教師あり微調整（SFT）が主に $-\log\pi_\theta(y\mid x)$ を小さくするのに対し、選好学習は二つの回答の相対的な評価を扱う。選好が循環したり、評価者ごとに異なったりする可能性がある。

Bradley–Terryモデルでは正の強度 $u_w,u_l$ を置き、$P(y_w\succ y_l\mid x)=u_w/(u_w+u_l)$ とモデル化する。$u_y=e^{r(x,y)}$ と書けば、

$$
P(y_w\succ y_l\mid x)
=\frac{e^{r_w}}{e^{r_w}+e^{r_l}}
=\sigma(r_w-r_l),\qquad
\sigma(z)=\frac{1}{1+e^{-z}}.
$$

ここで $r_w=r(x,y_w)$ である。スカラー報酬差とロジスティックな選択雑音を仮定した統計モデルであり、全ての人間の判断がこの式に従う定理ではない。共通の定数を両報酬へ加えても確率は変わらず、比較だけでは絶対水準を識別できない。

報酬モデル $r_\phi$ は、独立な比較標本という作業仮定の下で負の対数尤度

$$
\mathcal L_{RM}(\phi)
=-\mathbb E_{(x,y_w,y_l)\sim\mathcal D}
\log\sigma\{r_\phi(x,y_w)-r_\phi(x,y_l)\}
$$

を最小化して推定する。有限データでは全て同じ側が勝つなどの分離で推定値が発散する場合もあり、正則化や比較の被覆が重要になる。

## RLHFの学習構造

代表的なRLHFは、SFTで初期方策を作り、比較データから報酬モデルを学び、その報酬を方策からの生成に適用して更新する構造である。InstructGPTはこの構造を用いた実証研究であり、あらゆるRLHFの唯一の定義ではない。

参照方策 $\pi_{ref}$ を固定し、報酬を上げながら参照からの乖離も抑えたい。入力 $x$ を固定して、有限候補集合 $\mathcal Y$ 上の次の目的を考える。

$$
F(\pi)=\sum_y\pi(y)r(y)
-\beta\sum_y\pi(y)\log\frac{\pi(y)}{\pi_{ref}(y)},\qquad\beta>0.
$$

ここでは $\pi_{ref}(y)>0$、$r(y)$ は有限、$\sum_y\pi(y)=1$ とする。無限の回答集合なら、さらに正規化定数の有限性が必要である。KLは $D_{KL}(\pi\Vert\pi_{ref})$ であり、向きを逆にしてはいけない。$\beta$ は報酬と同じ尺度で乖離を罰する強度である。報酬の尺度を変更すると、その意味も変わる。

## 最適方策を導く

確率の総和制約をラグランジュ乗数 $\lambda$ で加え、内点で微分する。

$$
\frac{\partial}{\partial\pi(y)}
\{F(\pi)+\lambda(\sum_y\pi(y)-1)\}
=r(y)-\beta\left(\log\frac{\pi(y)}{\pi_{ref}(y)}+1\right)+\lambda=0.
$$

両辺を整理して指数を取ると、$y$ に依存しない因子が現れる。総和1によりその因子を決定する。

$$
\begin{aligned}
\pi^*(y\mid x)&=\frac{\pi_{ref}(y\mid x)e^{r(x,y)/\beta}}{Z(x)},\\
Z(x)&=\sum_{y\in\mathcal Y}\pi_{ref}(y\mid x)e^{r(x,y)/\beta}.
\end{aligned}
$$

実際に $F(\pi)=\beta\log Z-\beta D_{KL}(\pi\Vert\pi^*)$ と書けるので、KLの非負性からこれが大域最大であると確認できる。これは自由に確率分布を選べる場合の解である。有限のニューラルモデル、有限データ、最適化途中のチェックポイントがこの解へ到達する保証ではない。

## 正規化定数を消してDPOへ進む

最適方策の式を対数で戻すと

$$
r(x,y)=\beta\log\frac{\pi^*(y\mid x)}{\pi_{ref}(y\mid x)}+\beta\log Z(x)
$$

である。同じ $x$ の二回答で差を取るからこそ、未知の正規化定数が相殺される。

$$
\begin{aligned}
r_w-r_l
&=\beta\log\frac{\pi^*(y_w\mid x)}{\pi_{ref}(y_w\mid x)}+\beta\log Z(x)\\
&\quad-\beta\log\frac{\pi^*(y_l\mid x)}{\pi_{ref}(y_l\mid x)}-\beta\log Z(x)\\
&=\beta\left[\log\frac{\pi^*(y_w\mid x)}{\pi_{ref}(y_w\mid x)}
-\log\frac{\pi^*(y_l\mid x)}{\pi_{ref}(y_l\mid x)}\right].
\end{aligned}
$$

この差をBradley–Terryの選好確率へ代入し、方策を $\pi_\theta$ でパラメータ化して、比較標本の負の対数尤度を最小化するのがDPOである。式を短くするため $h_\theta(x,y)=\log\pi_\theta(y\mid x)-\log\pi_{ref}(y\mid x)$ と定義する。

$$
\mathcal L_{DPO}(\theta)
=-\mathbb E_{\mathcal D}
\log\sigma\{\beta[h_\theta(x,y_w)-h_\theta(x,y_l)]\}.
$$

生成確率は系列全体の確率なので、自己回帰モデルでは各回答のトークン対数確率を足す。任意に長さで割ると別の目的になり、元の導出とは区別する。スカラーのmarginを $m=\beta(h_w-h_l)$ とすると、損失の $m$ 微分は $\sigma(m)-1$。好まれた回答の相対対数確率を上げる方向へ学習するが、全入力に対する絶対確率の増加を保証するものではない。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-two/preference-light.svg" alt="比較データから報酬モデルと方策更新へ進むRLHFと、参照確率比から比較損失を直接作るDPO" width="480" height="650" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-two/preference-dark.svg" alt="比較データから報酬モデルと方策更新へ進むRLHFと、参照確率比から比較損失を直接作るDPO" width="480" height="650" loading="lazy" />
  <figcaption>図1 比較データを目的へ変換する二経路。DPOでは上の仮定により独立した報酬モデルを明示的に学習する工程を省く。</figcaption>
</figure>

## 同じものと、同じでないもの

|観点|報酬モデルを使う代表的RLHF|DPO|
|---|---|---|
|比較のモデル|報酬差で選好を推定|方策と参照の確率比で選好を推定|
|更新時の標本|方策からの生成を報酬で評価|比較データの回答対を評価|
|明示的な報酬モデル|通常は別に学習|基本形では不要|
|KLとの関係|目的へ正則化項として加える|最適方策との対応を損失へ埋め込む|
|限界|報酬推定誤差、探索、最適化|データ被覆、選好モデルの適合、最適化|

DPOの対応は、上で置いたKL正則化目的、同じ入力の選好モデル、支持集合、表現能力などの条件に基づく。任意の報酬、任意のRLHFアルゴリズム、有限標本での学習経路と無条件に等価ではない。KLを学習中に必ず一定値以下へ保つハード制約でもない。

## 三回答の人工例とPython検算

参照分布を $(0.5,0.3,0.2)$、報酬を $(1,0,-1)$、$y_1\succ y_2$ の選好確率を $\sigma(1)=0.731059$ とする。これは人のラベルを測定した値ではなく、上のモデルで生成した母集団の例である。

|$\beta$|最適方策 $\pi^*$（丸め値）|$P(y_1\succ y_2)$|その対のDPO損失|
|---:|---|---:|---:|
|0.5|$(0.91867,0.07460,0.00673)$|0.731059|0.313262|
|1|$(0.78440,0.17314,0.04246)$|0.731059|0.313262|
|2|$(0.66178,0.24083,0.09738)$|0.731059|0.313262|

最適方策を代入すると $\beta$ と対数確率比の変化が打ち消し合い、選好確率は同じになる。一方、方策は大きい $\beta$ ほど参照へ近づく。この区別が重要である。初期方策が参照そのものならmarginは0で、同じ対の損失は $\log2=0.693147$ である。

検算 `python scripts/math-phase-two/n04_preference.py` は正規化定数の相殺、$F(\pi)$ のKL分解、DPO損失を確認する。さらに $\beta=1$ の三回答単体で確率単体上の格子探索を行い、解析最適解と目的値を比較する。DPOのmargin微分は有限差分で確認する。Python標準ライブラリのみ、乱数なし、恒等式の許容誤差 $10^{-10}$、有限差分 $10^{-8}$、格子の確率刻み0.002である。少数データの例を一回学習しただけで実モデルの選好を推定できるとは主張しない。

## 偏り、Reward Hacking、費用

選好データは評価者、提示順、文章長、言語、課題の構成に依存する。単一のスカラーへの集約が少数者の価値を失うこともあり得る。学習した代理報酬を上げても、人の意図に沿うとは限らない。Reward Hackingは代理目的の抜け穴を利用して高得点になる問題であり、選好モデルの精度だけでなく分布外の生成、過剰最適化、独立評価を検討する必要がある。

$M$ 対・平均長 $T$ のDPOは、少なくとも二回答分のトークン対数確率を集計する $O(MT)$ の仕事に加え、方策の前向き・逆伝播が必要である。参照の固定値を事前計算する費用・保存量もある。RLHFには生成、報酬モデル、価値モデル等の費用があるが、どちらが速いかはモデル・標本・ハードウェア・目的の条件を揃えて測る必要がある。

本稿で導いたのは、選好を方策学習の目的へ変換する数学である。人間の選好を真偽や安全性と同一視せず、次の[検証可能な報酬](/foundations/verifiable-reward-reasoning/)でも、採点器の正しさと学習結果の評価を分離する。

## 一次資料

- Bradley and Terry, [Rank Analysis of Incomplete Block Designs: I. The Method of Paired Comparisons](https://doi.org/10.1093/biomet/39.3-4.324), Biometrika 39, 1952, pp.324–345。査読済み原典。書誌・対比較モデルを確認し、現代の対数報酬表現はDPO §3と照合した。出版社の閲覧制限により原典全文の再検証は未実施である。
- Ouyang et al., [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155), 2022-03-04, NeurIPS 2022, §3、Figure 2。SFT・報酬モデル・PPOによる構造。論文の実験条件を一般的な効果保証にしない。
- Rafailov et al., [Direct Preference Optimization](https://proceedings.neurips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html), NeurIPS 2023, §3–5、Appendix A.1–A.2。査読済み。[著者公開全文](https://arxiv.org/html/2305.18290v2)式(3)–(7)と導出を照合した。
