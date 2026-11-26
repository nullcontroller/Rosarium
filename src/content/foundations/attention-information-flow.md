---
title: "Attentionは系列からどのように情報を集めるのか"
summary: "文章中のトークンが他の位置の情報を受け取る処理を、Query・Key・Valueから説明する。内積・加重和・スケーリング係数を導き、人工例からマスクと計算量の意味を確認する。"
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

## 文章の途中のトークンは、前のどの情報を受け取るのか

「猫が窓辺で眠る」という入力を読む言語モデルでは、「眠る」の位置を処理するときに、「猫」や「窓辺」など前の位置の情報をどう混ぜるかが問題になる。実際のトークン化は単語の区切りと一致しないこともあるが、ここでは各語を一位置とした模式例で考える。

各位置は埋め込み（Embedding）などによる数値ベクトルで表現され、層を進むにつれて文脈に応じた表現へ変わる。Attention（注意機構）は、各位置から他の位置への参照の重みを求め、その重みで値を集約する計算である。Query（照会）は「この位置が何を参照するか」を照合するベクトル、Key（キー）は参照先との一致を測るベクトル、Value（値）は実際に受け渡す情報のベクトルであり、同じ入力表現から別の射影（ここでは行列を掛けて別のベクトル空間へ写す線形変換）で作る。

本稿では1ヘッドのscaled dot-product self-attentionを扱う。selfは同じ系列内を参照すること、ヘッドは一組のQuery・Key・Valueによる集約を指す。内積で参照スコアを作り、Softmax（指数を正規化して総和1の重みにする関数）で混ぜる割合へ変えるために、行列と確率に似た重みの数学が必要になる。この重みは、次トークンそのものの生成確率とは別の量である。

これから「どの位置をどれだけ混ぜるか」と、未来位置を見ないマスクを数式で追う。重みの大きさだけで、人間が考える理由や因果関係まで説明できるとは言わない。[次トークン予測の学習](/foundations/language-model-loss/)とは、予測に使う内部表現を作る工程で接続する。

### 入力からQuery・Key・Valueを作る

系列長を $n$、入力幅を $d$ とし、行がトークン位置である $X\in\mathbb R^{n\times d}$ を置く。射影行列を $W_Q,W_K\in\mathbb R^{d\times d_k}$、$W_V\in\mathbb R^{d\times d_v}$ とする。

$$
Q=XW_Q,\quad K=XW_K,\quad V=XW_V.
$$

$Q,K$ は $n\times d_k$、$V$ は $n\times d_v$ である。位置 $i$ のQuery $q_i$ と位置 $j$ のKey $k_j$ の内積（対応成分を掛けて足す演算）で、値 $v_j$ を読むためのスコアを作る。

$$
s_{ij}=\frac{q_i^\top k_j}{\sqrt{d_k}}+m_{ij},\qquad
\alpha_{ij}=\frac{e^{s_{ij}}}{\sum_{r=1}^{n}e^{s_{ir}}},\qquad
o_i=\sum_{j=1}^{n}\alpha_{ij}v_j.
$$

$m_{ij}$ は参照可能なら0、参照禁止なら $-\infty$ とする模式的なマスクである。実数計算では少なくとも一つ参照先が必要で、全て禁止された行のsoftmaxをそのまま計算してはいけない。因果マスクでは $j>i$ を禁止する。出力 $O$ は $n\times d_v$ である。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-one/attention-light.svg" alt="QueryとKeyから重みを作り、各位置のValueを加重平均する。因果マスクは参照できる位置を制限する" width="480" height="480" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-one/attention-dark.svg" alt="QueryとKeyから重みを作り、各位置のValueを加重平均する。因果マスクは参照できる位置を制限する" width="480" height="480" loading="lazy" />
  <figcaption>図1 位置ごとの参照と集約。QueryとKeyから重みを作り、各位置のValueを加重平均する。因果マスクは参照できる位置を制限する。式との対応を示す模式図であり、実測したモデル性能ではない。</figcaption>
</figure>

### なぜ内積を次元の平方根で割るのか

原論文の動機を、仮定を明示して導く。$q_r,k_r$ の平均は0、分散は1、同じ成分内の $q_r$ と $k_r$ は独立とする。さらに異なる成分の積 $q_rk_r$ 同士は無相関とする。

$$
\mathbb E[q_rk_r]=0,\qquad
\operatorname{Var}(q_rk_r)=\mathbb E[q_r^2]\mathbb E[k_r^2]=1.
$$

$s=\sum_{r=1}^{d_k}q_rk_r$ なら、共分散項が0なので $\operatorname{Var}(s)=d_k$。したがって

$$
\operatorname{Var}\!\left(\frac{s}{\sqrt{d_k}}\right)=1.
$$

これは初期的なスケールの説明であり、学習後の全てのQuery・Keyが独立で分散1だと証明したものではない。一般には共分散項や平均も影響する。スコアの絶対値が大きいとsoftmaxが一つの位置へ集中しやすいことを緩和する動機であり、最適な注意や事実性の保証ではない。

### 2位置の計算を手で追う

前の文章での参照を、二つのトークン位置だけへ縮めて数値を追う。「猫」「眠る」の二位置に情報ベクトルを割り当てたと解釈できるが、値は学習された日本語の表現ではない。内積と加重平均の動作だけを確認する人工例である。

射影後の $Q=K=I_2$、$V=((10,0),(0,20))$、$d_k=2$、マスクなしを考える。第1行のスコアは $(1/\sqrt2,0)$ となる。

$$
\alpha_{1,:}\approx(0.669762,0.330238),\qquad
o_1\approx(6.697615,6.604769).
$$

第2行は逆の重みになり、$o_2\approx(3.302385,13.395231)$ となる。どの値をどれだけ混ぜたかは行ごとに決まる。因果マスクを付けると、第1行は未来の第2位置を読めないため $(1,0)$ の重みとなり、出力は $(10,0)$ になる。数値は説明用の人工例であり、日本語や意味を学習したモデルではない。

### 多頭化と位置情報

複数ヘッドでは、別々の射影で同様の計算を行い、結果を連結して出力射影する。ヘッドごとに異なる情報の組合せを表せる構造だが、各ヘッドが必ず一つの人間的概念を担当するという定理はない。

位置情報もマスクもないself-attentionは、入力位置を置換すると出力も同じように置換される。置換行列 $P$ に対して $Q'=PQ,K'=PK,V'=PV$ とすると、

$$
\operatorname{softmax}_{row}(P QK^\top P^\top)=P\operatorname{softmax}_{row}(QK^\top)P^\top
$$

であるため、$O'=PO$ となる。これは順序を区別する手掛かりを追加する必要性を示す。位置符号化、回転位置埋め込み、因果マスクは同一の方式ではなく、ここではその内部の導出まで広げない。

### 計算量を区切る

密な1ヘッドのスコア計算は $O(n^2d_k)$、値の集約は $O(n^2d_v)$。スコア行列を保存する素朴な実装は $O(n^2)$ 要素を要する。射影には別に $O(nd(d_k+d_k+d_v))$ が掛かる。

ただし、二乗の中間行列を必ず外部メモリへ保存しなければならないわけではない。N12では、計算量を変えることとメモリ転送を減らすことを分けて扱う。1ステップだけを更新するdecodeの費用は系列全体を一度に扱うprefillと異なる。

### 限界と検算

Attentionの式は真偽判定器や検索の完全性を定義しない。値の加重和は学習された表現上の計算であり、根拠の妥当性は別に評価する。Transformer全体には残差、正規化、MLPなどもあり、本稿の1ヘッドの式だけでその能力全体を決めない。

Python検算は2位置の重みとマスク、行の総和、置換同変性を確認する。さらに独立な人工乱数で内積の分散とスケーリングの効果を確認する。有限標本の乱数実験は、実モデルで仮定が成立する証拠ではない。

#用語の別名や定義を確認するときは、<a href="/reference/glossary/#query-key-value" data-reference-page>Query・Key・Valueの定義</a>を参照できる。本文の数式は、各節で示した記号と成立条件に従って読む。

## 一次資料

- Vaswani et al., [Attention Is All You Need](https://arxiv.org/html/1706.03762v7), NeurIPS 2017, §3.2.1、脚注1、§3.2.2、§3.5、Table 1。計算式、スケーリングの仮定、位置情報、計算量を照合した。置換式と2位置例は本稿の導出である。
- Bahdanau et al., [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473), ICLR 2015, §3。Attentionによる入力表現の加重和という先行研究。加算型のスコアをscaled dot-productと混同しない。
