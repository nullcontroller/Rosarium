---
title: "Mixture of Expertsは、なぜ一部のネットワークだけを使って計算するのか"
summary: "Dense層と疎なMoE層を比べ、Router・Top-k・Expertの加重和から条件付き計算を説明する。人工ルーティングで出力と負荷を検算し、総パラメータ・活性パラメータ・通信・実測性能を分ける。"
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

## モデルを大きくすると、全てを毎回計算する必要があるのか

言語モデルの各トークンは、複数の層を通って次の表現へ変換される。モデルを大きくすれば、重みを保持するメモリと、使う重みに対する演算が増える。全トークンで同じ大きなネットワークを使うDense Model（密なモデル）に対して、入力ごとに一部の部分ネットワークを選ぶ構成がSparse Model（疎なモデル）の一例である。ここでの疎性は計算経路の選択を意味し、重みの値が0であることとは区別する。

Mixture of Experts（MoE）は、複数のExpertの出力を選択・合成する枠組みである。Expertは学習可能な関数であり、人間の専門家や人格を持つ独立AIではない。トークンを読む処理の一部を、選択した関数だけに割り当てる。これをConditional Computation（条件付き計算）という。どの入力にも必ず異なるExpertが選ばれるという意味ではない。

<figure id="figure-1" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/moe-routing-light.svg" alt="Denseでは同じFFNを使い、疎なMoEではRouterが複数Expertから一部を選び出力を合成する" width="480" height="650" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/moe-routing-dark.svg" alt="Denseでは同じFFNを使い、疎なMoEではRouterが複数Expertから一部を選び出力を合成する" width="480" height="650" loading="lazy" />
  <figcaption>図1 同じ層を使う経路と、関数を選ぶ経路。Attentionなど共通の処理も残り、モデル全体の計算が選択Expertだけになるわけではない。</figcaption>
</figure>

図1ではTransformerのFeed-Forward Network（FFN）を置き換える例を考える。FFNは、各位置のベクトルへ同じ重みを適用する非線形変換である。[Attention](/foundations/attention-information-flow/)のように位置間から情報を集める処理とは役割が異なる。RouterまたはGating Networkは、どのExpertへ送るかと合成の重みを計算する小さなネットワークである。

## RouterのスコアからExpertの加重和まで

入力$x\in\mathbb R^d$、Expert数$E\ge1$、選択数$1\le k\le E$を定義する。Expert $f_e:\mathbb R^d\to\mathbb R^d$は、例えば中間幅$h$の二層FFNである。

<span id="equation-1"></span>

$$
f_e(x)=W_{2e}\,\phi(W_{1e}x+b_{1e})+b_{2e}.
$$

$W_{1e}\in\mathbb R^{h\times d}$、$W_{2e}\in\mathbb R^{d\times h}$、$b_{1e}\in\mathbb R^h$、$b_{2e}\in\mathbb R^d$である。$\phi$は成分ごとに作用する非線形関数とする。実モデルにはゲート付きFFNなどもあり、式は全実装の共通仕様ではない。

Routerの行列$W_r\in\mathbb R^{E\times d}$とバイアス$b_r\in\mathbb R^E$でスコア$s=W_rx+b_r$を作る。各$s_e$は実数のlogitであり確率ではない。[Softmax](/foundations/temperature-design/)で

<span id="equation-2"></span>

$$
p_e(x)=\frac{e^{s_e}}{\sum_{j=1}^E e^{s_j}},\qquad
S_k(x)=\operatorname{TopK}(s,k)
$$

を計算する。$S_k$は大きいスコアを持つ$k$個の添字集合である。有限スコアを仮定し、同点時には添字順などの規約を固定する。Top-k Routingはこの集合へ入力を送る処理である。

選択後に再正規化する方式なら、使う重みと出力は

<span id="equation-3"></span>

$$
g_e(x)=\frac{\mathbf1[e\in S_k(x)]p_e(x)}{\sum_{j\in S_k(x)}p_j(x)},
\qquad y=\sum_{e\in S_k(x)}g_e(x)f_e(x).
$$

分母は正で、重みの和は1になる。選択集合内のsoftmaxとして直接計算しても同じである。この等価性は検算で確かめる。

一方、選択後も元の$p_e$をそのまま使い、和を1に戻さない方式もある。SwitchのTop-1では、選択したExpertの出力へRouterの確率を掛ける構成を取る。Top-1を常に重み1と説明すると、この違いを失う。Mixtral型の選択集合内の正規化と区別し、以下の人工例は再正規化ありに固定する。

Top-1を選択後に再正規化すると、選ばれた$e_*$の重みは$g_{e_*}=p_{e_*}/p_{e_*}=1$となる。選択集合が局所的に固定され、入力とExpert出力を固定してRouter専用パラメータを動かす範囲では、この重みは変化しない。したがって、主損失から合成重みを経由してRouterへ伝わる勾配は0である。Switch型は$p_{e_*}$を掛けたままなので、同じ選択の範囲でも、その確率を経由する勾配が残り得る。これは補助損失や共有パラメータなど、他の学習経路まで存在しないという意味ではない。

Top-kの集合選択は離散的であり、境界をまたぐ通常の微分を無条件に使えない。学習では選択された経路の勾配、補助損失、ノイズなど、採用方式の条件を確認する必要がある。

## 人工4Expertの出力を手で追う

一次元の説明用Expertを$f_0(x)=x$、$f_1(x)=2x$、$f_2(x)=-x$、$f_3(x)=0$とする。入力$x=2$でRouterのスコアを$(\log4,\log3,\log2,\log1)$と人工的に指定する。実際のLLMから取得した値ではない。

Softmaxは$(0.4,0.3,0.2,0.1)$になる。Top-1の再正規化ありならExpert 0のみを使い出力は2、再正規化なしなら$0.4\times2=0.8$である。Top-2で再正規化すると重みは$(4/7,3/7)$になり

<span id="equation-4"></span>

$$
y=\frac47\times2+\frac37\times4=\frac{20}7\approx2.857143.
$$

全Expertを同じsoftmaxで混合する密な比較器なら$0.4\times2+0.3\times4+0.2\times(-2)=1.6$である。この比較器は四つ全てを実行するが、一般的なDense TransformerのFFNと同じ重み・能力を持つモデルではない。

複数トークンも比較する。4トークンのスコアを、順に$(4,3,2,1)$、$(4,1,3,2)$、$(4,2,1,3)$、$(4,3,1,2)$とする。Top-1は全てExpert 0を選び、負荷は$(4,0,0,0)$になる。Top-2の割当件数は$(4,2,1,1)$、異なるExpertの使用数は4である。1トークンの活性数と、バッチ全体で使ったExpert数を混同しない。

## なぜ負荷を分散するのか

Load Balancing（負荷分散）は、少数のExpertへの割当集中を抑える考え方である。Expert Collapseは、一部だけが選ばれて他が十分に利用・学習されない偏りを指す。Expertが人間の分野ごとに必ず分化するとの保証はない。

SwitchのTop-1に対応する補助損失の一例を説明する。$T$トークンのバッチで、$F_e$はExpert $e$へ割り当てた比率、$P_e$はRouter確率の平均である。

<span id="equation-5"></span>

$$
F_e=\frac1T\sum_{t=1}^T\mathbf1[\arg\max_jp_j(x_t)=e],
\quad P_e=\frac1T\sum_{t=1}^Tp_e(x_t),
$$

<span id="equation-6"></span>

$$
\mathcal L_{\rm aux}=\lambda E\sum_{e=1}^EF_eP_e,\qquad\lambda>0.
$$

添字は式では1始まり、人工例の実装では0始まりである。$\sum F_e=\sum P_e=1$で、両者が一様なら$\mathcal L_{\rm aux}=\lambda$になる。$F_e$は離散割当なので、この項では主に$P_e$を通じて学習を誘導する。損失値が小さいことだけで完全な均等割当を保証しない。Top-2などへ使う場合は、割当比率の分母を$T$か$kT$かも含めて再定義が必要であり、この式をそのまま全MoEへ一般化しない。

人工Top-1例を、各Expertへ1トークンずつ送るスコアへ置き換えると負荷は$(1,1,1,1)$になる。これは「分散した場合」の対照条件であり、補助損失を最適化して学習が成功したとの実験ではない。Pythonでは補助損失の値と、割当を固定した近傍でのRouter勾配を有限差分で検算する。

<figure id="figure-2" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/moe-load-light.svg" alt="4トークンが一つのExpertへ集中する負荷4、0、0、0と、各Expertへ一つずつ割り当てる負荷1、1、1、1を比較する" width="480" height="500" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/moe-load-dark.svg" alt="4トークンが一つのExpertへ集中する負荷4、0、0、0と、各Expertへ一つずつ割り当てる負荷1、1、1、1を比較する" width="480" height="500" loading="lazy" />
  <figcaption>図2 出力を選ぶ問題と、処理を偏らせない問題。人工的な割当の比較であり、学習後の性能測定ではない。</figcaption>
</figure>

Expert Capacityは、一バッチなどでExpertが受け入れる割当の上限である。平均割当$kT/E$へ係数$c$を掛けて$\lceil ckT/E\rceil$とするのは一つの定義例である。容量超過時には、ドロップ、別のExpertへの送信、バッチ再構成など方式が分かれる。ドロップは表現・勾配へ影響するため、計算量だけで評価しない。

## 何が減り、何が残るのか

Activated Parameters（活性パラメータ）は、一トークンの計算で使われる重みである。各Expertが約$2dh$個の行列要素を持ち、共通部分の重み数を$P_0$とすれば、バイアスを省いた概算は

<span id="equation-7"></span>

$$
P_{\rm total}\approx P_0+2Edh+Ed,
\qquad P_{\rm active}\approx P_0+2kdh+Ed.
$$

Router自体は全Expertのスコアを計算するので$Ed$を残す。全重みを保存するメモリが$k/E$になるという式ではない。知識量はこの重み数から直接測定できない。

[スケーリング則](/foundations/compute-optimal-scaling/)は学習時の規模とデータ配分を扱うが、本稿は一層の実行費用を分ける。FLOPsは浮動小数点演算の回数であり、毎秒の性能FLOPSではない。積和を2演算と数え、非線形・選択・通信を除いた一トークンの行列演算は、Expert部分が約$4kdh$ FLOPs、Routerが約$2Ed$ FLOPsである。同じ幅の単一Dense FFNは約$4dh$であり、$k=2$ならExpert演算はむしろ二つ分になる。一方、全$E$個を実行する混合器との比較なら約$k/E$である。比較対象を固定せず「MoEは常に演算が減る」とは言えない。

例えば$E=4,k=1,d=2,h=3$なら、単一FFNは24、Router込みTop-1は40、全ExpertとRouterは112 FLOPsという人工概算になる。Attention、活性化、重み転送、Top-k費用は含まない。実GPUの高速化率ではない。

分散Expertでは、All-to-All Communication（全相互通信）により、各装置のトークン表現を担当装置へ送り、結果を戻す。送信される実数の数は割当数・$d$・配置に関係し、同じ装置内にあるExpertなら転送条件も異なる。通信待ち、負荷偏り、小バッチでの非効率、全重みのメモリ容量が律速になり得る。学習では逆伝播の通信・勾配・optimizer（重み更新の算法）の状態も加わり、推論ではバッチサイズとトークンごとの割当が影響する。

## 研究の発展と、この説明の境界

[Jacobs et al.](https://www.cs.toronto.edu/~hinton/absps/jjnh91.pdf)の1991年の混合モデル、[Shazeer et al.](https://arxiv.org/abs/1701.06538)の疎なゲートは、近年のLLMより前からある概念である。[GShard](https://arxiv.org/html/2006.16668v1)は大規模な条件付き計算と分割、[Switch](https://www.jmlr.org/papers/v23/21-0998.html)はTop-1と訓練安定化、[Mixtral](https://arxiv.org/html/2401.04088v1)はTop-2のLLM構成を扱う。[DeepSeekMoE](https://arxiv.org/html/2401.06066v1)の細粒度化・共有Expertは別の設計選択である。各論文のベンチマーク結果を、ここでの人工層や任意の実装の性能として移さない。

2026年の[RouterInterp](https://proceedings.mlr.press/v306/lasy26a.html)はICML掲載のルーティング解析であり、専門化の解釈も研究対象である。今回の確認範囲は会議ページの要旨・書誌までで、全実験を再現していない。本稿の式の根拠に未精読の追加定理を使わない。

Python検算は `python scripts/math-phase-three/verify.py` で実行する。Top-1/2、二通りの正規化、割当と容量、補助損失、理論演算数を検証する。GPU測定・LLM学習・分類精度の実験は対象外である。

問いへの答えは、Routerが入力ごとに一部のExpertを選ぶため、全体の重み数と一回に使うExpertの数を分けられることである。その代わりに選択・負荷・通信という問題が生じる。疎性は費用の全項を消す保証ではない。

共通の定義は<a data-reference-page href="/reference/glossary/#mixture-of-experts">基本用語集</a>からも確認できる。

## 一次資料

- Jacobs et al., [Adaptive Mixtures of Local Experts](https://www.cs.toronto.edu/~hinton/absps/jjnh91.pdf), Neural Computation 3, 1991。
- Shazeer et al., [Outrageously Large Neural Networks](https://arxiv.org/abs/1701.06538), ICLR 2017。疎なゲートと負荷。
- Lepikhin et al., [GShard](https://arxiv.org/html/2006.16668v1), ICLR 2021。§2のTop-2・容量・分散構成。
- Fedus et al., [Switch Transformers](https://www.jmlr.org/papers/v23/21-0998.html), JMLR 2022。Top-1、補助損失、容量。
- Jiang et al., [Mixtral of Experts](https://arxiv.org/html/2401.04088v1), 2024、技術報告。§2のFFN置換とTop-2。
- Dai et al., [DeepSeekMoE](https://arxiv.org/html/2401.06066v1), 2024、arXiv版。細粒度化と共有Expert。
- Lasy et al., [RouterInterp](https://proceedings.mlr.press/v306/lasy26a.html), ICML 2026。要旨・書誌を確認した追補資料。
