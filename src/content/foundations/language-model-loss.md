---
title: "言語モデルは何を損失として学習するのか"
summary: "自己回帰モデルの最尤学習を、負の対数尤度・交差エントロピー・KL・softmaxの勾配から導く。小さな計算例で、学習損失と事実性の違いを説明する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: published
public: true
lifecycle: active
published_at: "2026-11-26"
last_updated: "2026-11-26"
tags: [数理基礎, 第1段階]
---

## 尤度を上げることは、何を近づけることなのか

言語モデルの事前学習では、観測されたトークン列へ高い確率を与えるようにパラメータを調整する。本稿では有限語彙を持つ自己回帰モデルの最尤学習に対象を限定する。拡散型の学習、強化学習、選好学習は同じ目的関数とは限らない。

先に答えを述べると、最尤学習は経験データに対する負の対数尤度を小さくする。これは一定の条件で交差エントロピーの最小化であり、真偽判定器の学習を自動的に意味しない。[基礎となる条件付き確率](/foundations/conditional-probability/)の連鎖律から、損失、勾配、限界へ進む。

### 記号と対象

|記号|意味|
|---|---|
|$V$|有限語彙、語彙数は $v$|
|$c$|固定された文脈。直前のトークン列も含む|
|$p_i$|この文脈に対する目標分布。総和は1|
|$q_\theta(i\mid c)$|パラメータ $\theta$ の予測分布|
|$z_i$|出力層のlogit|
|$N$|損失を集計する予測位置の数|

対数は自然対数で、損失の単位はnatとする。$p_i>0$ の位置で $q_i>0$ を仮定する。$p_i=0$ の項は極限により0と定める。

### 系列の確率から、各位置の損失へ

一つの訓練系列 $y_1,\dots,y_T$ と入力条件 $x$ に対し、連鎖律を用いる。

$$
q_\theta(y_{1:T}\mid x)=\prod_{t=1}^Tq_\theta(y_t\mid x,y_{<t}).
$$

積の対数は和になるため、負の対数尤度は

$$
-\log q_\theta(y_{1:T}\mid x)
=-\sum_{t=1}^T\log q_\theta(y_t\mid x,y_{<t})
$$

である。複数系列の予測位置を合計し、$N$ で割るとトークン平均損失になる。系列同士を独立な標本とみなすことは統計的なモデル化である。長さの異なる系列を系列単位で平均する場合は、トークン単位の平均とは重みが異なる。どちらを報告するかも評価条件である。

### 交差エントロピーとKLの関係を導く

文脈を固定し、交差エントロピーを $H(p,q)=-\sum_i p_i\log q_i$、エントロピーを $H(p)=-\sum_i p_i\log p_i$ と定義する。KLダイバージェンスの定義から、

$$
\begin{aligned}
D_{\mathrm{KL}}(p\Vert q)
&=\sum_i p_i\log\frac{p_i}{q_i}\\
&=\sum_i p_i\log p_i-\sum_i p_i\log q_i\\
&=-H(p)+H(p,q).
\end{aligned}
$$

よって $H(p,q)=H(p)+D_{\mathrm{KL}}(p\Vert q)$ となる。固定された目標分布に対し、$H(p)$ は予測パラメータで変化しない。交差エントロピーを小さくすることは、この条件下でKLを小さくすることと同じである。KLの非負性はGibbsの不等式による数学的性質であり、有限データで得たモデルが母集団分布へ完全一致するという保証ではない。

非負性も確認できる。$p_i>0$ の添字だけで $\log u\le u-1$ を使うと、

$$
-D_{\mathrm{KL}}(p\Vert q)
=\sum_{i:p_i>0}p_i\log\frac{q_i}{p_i}
\le\sum_{i:p_i>0}(q_i-p_i)\le0.
$$

最後は該当位置の $q_i$ の和が1以下であることによる。損失を有限にする支持集合の条件がここでも必要である。

例えば $p=(0.75,0.25)$、$q=(0.5,0.5)$ なら、$H(p)=0.562335$、$H(p,q)=0.693147$、KLは $0.130812$ natである。差は説明用の2カテゴリ計算であり、実モデルの測定値ではない。

### softmaxの勾配は「予測と目標の差」になる

1位置のsoftmaxを $q_i=e^{z_i}/\sum_j e^{z_j}$、損失を $L=-\sum_i p_i\log q_i$ とする。

$$
\log q_i=z_i-\log\sum_j e^{z_j},\qquad
L=-\sum_i p_i z_i+\log\sum_j e^{z_j}.
$$

ここで $\sum_i p_i=1$ を使った。logit $z_k$ で微分すると、

$$
\frac{\partial L}{\partial z_k}
=-p_k+\frac{e^{z_k}}{\sum_j e^{z_j}}
=q_k-p_k.
$$

次に連鎖律で $\nabla_\theta L=\sum_k(q_k-p_k)\nabla_\theta z_k$ を求め、勾配法なら $\theta\leftarrow\theta-\eta\nabla_\theta L$ と更新する。これは計算手順の説明であり、実際の大規模学習が常に単純なSGDを用いるという意味ではない。非凸なネットワークについて大域最適解への到達も保証しない。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-one/loss-light.svg" alt="目標分布と予測分布から損失を計算し、勾配でパラメータを更新する。事実性の確認は別の評価である" width="480" height="480" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-one/loss-dark.svg" alt="目標分布と予測分布から損失を計算し、勾配でパラメータを更新する。事実性の確認は別の評価である" width="480" height="480" loading="lazy" />
  <figcaption>図1 学習目的と検証の責務。目標分布と予測分布から損失を計算し、勾配でパラメータを更新する。事実性の確認は別の評価である。式との対応を示す模式図であり、実測したモデル性能ではない。</figcaption>
</figure>

### 計算量と、ここで説明していない費用

既知のlogitから1位置のsoftmaxと損失を求める費用は語彙数 $v$ に対して $O(v)$ である。隠れ状態の幅 $d$ から全語彙のlogitを作る密な出力射影には $O(dv)$ が必要で、ネットワーク本体の計算も別にある。したがって、損失の式が短いことから学習全体が軽いとは言えない。

ミニバッチごとに前向き計算、損失集計、逆伝播、更新を繰り返す。標本選択、系列長、パディング、混合精度、最適化器によるメモリはこの単純な $O(v)$ に含めない。

### 尤度と事実性の境界

最尤目的が合わせるのは訓練分布である。誤った説明が訓練データにあれば、それへ確率を与えることも目的に適合し得る。データの選別、文脈の観測範囲、目的関数、外部検証は別々に考える必要がある。

この数学だけから、あらゆるハルシネーションが不可避である、あるいは学習目的だけが原因であるとは結論しない。[ハルシネーションの発生原理](/foundations/hallucination-mechanisms/)は、モデルの損失と実行時の情報不足・検索失敗・検証を分けて扱う。

### 検算の読み方と一次資料

添付のPython検算は交差エントロピーの分解と、有限差分による $q-p$ の一致を確認する。学習実験、汎化性能、真偽判定性能の再現ではない。

- Andrew Ng, [CS229 Supervised Learning](https://cs229.stanford.edu/notes_archive/cs229-notes-all/cs229-notes1.pdf), §Classification and logistic regression／GLM。最尤と勾配法の基礎教材。
- Zhang et al., [Dive into Deep Learning §4.1](https://d2l.ai/chapter_linear-classification/softmax-regression.html), 交差エントロピー・尤度・softmaxの導出を照合する著者公開教材。
- Shannon, [A Mathematical Theory of Communication](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf), 1948, Part I §6。エントロピーの基礎原典。ニューラルネットの性能保証として引用しない。
