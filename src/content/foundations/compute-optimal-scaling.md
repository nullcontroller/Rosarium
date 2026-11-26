---
title: "モデル規模・学習データ・計算量の関係をどう最適化するか"
summary: "経験的な損失モデルと学習計算制約から、モデル規模とデータ量の最適配分を導く。Kaplan・Chinchillaの実験条件、推論需要を含む費用、外挿の限界を人工曲面と数値最適化で確認する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: draft
public: false
lifecycle: active
last_updated: "2026-11-26"
tags: [数理基礎, スケーリング則, 第2段階]
---

## 同じ計算予算を、大きなモデルと多いデータへどう配るか

学習計算量に上限があるとき、パラメータ数だけを増やせばよいわけではない。モデルを大きくすると、同じ予算で読めるトークンが減る。本稿は、経験的に当てはめた損失の式を仮定し、制約下の配分を数学的に求める。

前提は[言語モデルの学習損失](/foundations/language-model-loss/)である。最適化するのは、指定されたデータ分布上の損失モデルであり、推論能力や業務上の成果そのものではない。[推論時の予算配分](/foundations/test-time-compute-allocation/)とは、学習費用か推論費用かを分けて接続する。

## 経験則を置く範囲

$N>0$ をパラメータ数、$D>0$ を学習トークン数とし、正の定数 $A,B,\alpha,\beta$ と $E\ge0$ を使う。

$$
L(N,D)=E+\frac{A}{N^\alpha}+\frac{B}{D^\beta}.
$$

これはべき乗の減衰を足した経験的な近似モデルである。$E$ は両方を大きくした極限の床として当てはめる値で、「不可約損失」と解釈される場合もある。しかし、有限範囲での推定値を自然言語に普遍的な真のエントロピーと断定しない。有限データの質、トークン化、モデル構造、最適化不足も当てはめに影響する。

学習計算量をFLOPsで概算し

$$
C\approx\kappa ND,\qquad\kappa>0
$$

と置く。密なTransformerの概算でよく使われる $\kappa\approx6$ は、パラメータとトークンを数える特定の計算モデルによる。Attentionの系列長依存項、出力層、埋め込み、通信、再計算、最適化器等の含め方で変わり、疎なモデルの総パラメータ数へ機械的に適用できない。

実数の $N,D$ を選べる緩和問題として解く。現実には層数・幅が離散的で、データ上限やメモリ制約もあるので、最後に実行可能な構成へ戻す必要がある。

## 固定計算予算の最適解を導く

近似計算モデルをこの節だけ厳密な制約 $C=\kappa ND$ として扱い、$K=C/\kappa$ と置く。損失は $N,D$ のそれぞれで減少するので、上限予算なら境界を使う。$D=K/N$ を代入すると一変数になる。

$$
f(N)=E+A N^{-\alpha}+B K^{-\beta}N^\beta.
$$

極値の条件を求めるため $N$ で微分する。

$$
\begin{aligned}
f'(N)&=-\alpha A N^{-\alpha-1}
+\beta B K^{-\beta}N^{\beta-1}=0,\\
N^{\alpha+\beta}&=\frac{\alpha A}{\beta B}K^\beta.
\end{aligned}
$$

従って最適配分は

$$
\begin{aligned}
N^*(C)&=\left(\frac{\alpha A}{\beta B}\right)^{1/(\alpha+\beta)}
\left(\frac C\kappa\right)^{\beta/(\alpha+\beta)},\\
D^*(C)&=\left(\frac{\beta B}{\alpha A}\right)^{1/(\alpha+\beta)}
\left(\frac C\kappa\right)^{\alpha/(\alpha+\beta)}.
\end{aligned}
$$

一意性も確認できる。$u=\log N$ に変換すると、$f(u)=E+Ae^{-\alpha u}+BK^{-\beta}e^{\beta u}$。二階微分は正で、両端で発散するため一意の大域最小である。経験式を採用した条件下での数学的結論と、その経験式が現実に当てはまるという実証を分ける。

最適点では $\alpha A/N^\alpha=\beta B/D^\beta$。二つの損失項が等しいのは $\alpha=\beta$ の場合に限る。$\alpha=\beta$ なら双方が $C^{1/2}$ で増えるが、一般に指数は半分ではない。

## Kaplan型とChinchilla型をどう読むか

|研究|主な観測・配分の考え方|比較時の注意|
|---|---|---|
|Kaplan et al.（2020）|損失とモデル・データ・学習計算のべき乗関係を調べ、計算最適では比較的大きいモデルと収束前の停止を重視|計算の数え方と学習条件が後続研究と同じとは限らない|
|Hoffmann et al.（2022、Chinchilla）|複数の手法で固定計算量の配分を推定し、対象範囲ではモデルとトークンを概ね同じ割合で増やす結論|全モデルで固定のトークン／パラメータ比になるという普遍則ではない|
|Porian et al.（2024、v4 2025）|出力層費用、warmup、規模に応じた最適化設定などを制御して相違を再検討|指数の違いを技術の「法則の交代」だけで説明しない|

本稿の加算型損失はChinchillaのパラメトリックな近似に対応する一つの代表モデルで、Kaplanの全式を同じ形に置換したものではない。学習率、データ分布、重複、訓練範囲、評価損失の定義を確認してから係数を用いる。

## 人工曲面で配分を確かめる

説明用に $E=1,A=B=1,\alpha=\beta=0.5,\kappa=1$ とする。$N,D,C$ は正規化した任意単位で、パラメータの実数個数や実機FLOPsの測定値ではない。

|計算予算 $C$|解析 $N^*$|解析 $D^*$|予測損失 $L^*$|
|---:|---:|---:|---:|
|100|10|10|1.632456|
|400|20|20|1.447214|
|1600|40|40|1.316228|

例えば $C=400$ で $(N,D)=(5,80)$ とすると $L=1.559017$ であり、$(20,20)$ の1.447214より大きい。片方だけへ偏らせると、もう片方の不足が損失に残る。図1は対数軸上の損失曲面を色で示し、同じ計算量の曲線と最適点を重ねたものである。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-two/scaling-light.svg" alt="人工損失の色付き曲面に計算予算100、400、1600の等計算量線と、対角上の最適点を重ねる" width="480" height="570" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-two/scaling-dark.svg" alt="人工損失の色付き曲面に計算予算100、400、1600の等計算量線と、対角上の最適点を重ねる" width="480" height="570" loading="lazy" />
  <figcaption>図1 人工的な損失曲面と予算制約。色は上の式の損失、線はND = C。実モデルを学習した図ではない。</figcaption>
</figure>

## 推論需要を含めると最適化問題が変わる

一度学習して多数回使うモデルでは、学習計算だけを最小化しても総費用は最小にならない。推論で処理する総トークン量を $U\ge0$、1パラメータ・1推論トークン当たりの近似費用を $\lambda>0$ とし、説明用モデルを置く。

$$
C_{total}=\kappa ND+\lambda NU.
$$

長い文脈やバッチ、KVキャッシュ、prefill/decodeの違いを捨てた近似である。通貨や秒へ変換するには別に実測する必要がある。総予算を $B_{total}$ とすると

$$
D=\frac{B_{total}-\lambda NU}{\kappa N}
=\frac{B_{total}}{\kappa N}-\frac{\lambda U}{\kappa},
\qquad 0<N<\frac{B_{total}}{\lambda U}
$$

となる（$U>0$ の場合）。これを損失へ代入して数値的に最小化する。$B_{total}=400,\kappa=1,\lambda U=10$、上と同じ損失なら、$N^*\approx11.824$、$D^*\approx23.830$ となる。推論需要なしの $(20,20)$ とは異なり、小さいモデルへ多いトークンを配る。この例の損失は約1.496で、推論費用も同じ予算から払っているため、需要なしの最適損失と費用条件を混同しない。

Sardanaらは実際の推論需要を含む最適化を研究している。本稿の単純な式はその実測値の再現ではなく、目的と制約を変えると最適配分も変わることを示す。サービス全体では検証器・探索の推論費用も加わり、N06の配分へ接続する。

## Python検算と外挿の限界

`python scripts/math-phase-two/n13_scaling.py` は対数 $N$ の区間を黄金分割探索し、解析解と数値最適解を比較する。さらに二階微分の正値、有限差分の停留条件、総費用モデルの予算一致を確認し、図1と同じ曲面データをCSVへ出力する。Python標準ライブラリのみ、乱数なし、$N$ の相対誤差 $10^{-6}$、目的値 $10^{-10}$ を基準とする。

数値探索は単純な凸性を持つ人工問題の検算であり、現実のモデル選定の探索費用を再現していない。$M$ 点の損失式評価は $O(M)$ だが、経験式を当てはめるには多数の実学習が必要で、その費用を無視できない。

データ再利用、有限データ、構造変更、最適化器、学習範囲外への外挿により、係数と指数は変わり得る。2025年改訂の再現研究も、推定が実験プロトコルに敏感であることを確認する材料であり、普遍定数を確定したものではない。学習損失が下がっても、特定の推論課題、安全性、実務品質の改善は別の評価が必要である。

本稿の結論は、経験則を信じて大きくすることではなく、仮定した損失と費用を明示して配分を導き、その適用範囲を実験で確かめることである。

## 一次資料

- Kaplan et al., [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361), 2020-01-23, §1、§3、§6。技術報告。経験的なべき乗則と計算配分。
- Hoffmann et al., [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556), 2022-03-29, NeurIPS 2022, §3.1–3.3、Appendix D。査読済み。加算型近似と固定FLOPsの配分。
- Porian et al., [Resolving Discrepancies in Compute-Optimal Scaling of Language Models](https://arxiv.org/abs/2406.19146), 初出2024-06-27、v4 2025-01-19, NeurIPS 2024。査読済み論文と改訂プレプリント。計算の数え方と最適化条件の再検討。
- Sardana et al., [Beyond Chinchilla-Optimal: Accounting for Inference in Language Model Scaling Laws](https://arxiv.org/abs/2401.00448), 初出2023-12-31、v3 2025-04-14, ICML 2024。推論需要込みの配分。本文の人工係数・単純費用とは区別する。
