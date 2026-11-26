---
title: "Attentionの計算効率"
summary: "LLMで長い入力を処理する負担から、Attentionの演算回数・保存容量・メモリ転送を区別する。オンラインsoftmaxを導き、入力処理と逐次生成で異なる費用と成立条件を示す。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: published
public: true
lifecycle: active
published_at: "2026-11-26"
last_updated: "2026-11-27"
tags: [数理基礎, 第1段階]
---

## 長い入力を読ませると、Attentionの何が重くなるのか

言語モデルへ長い文書を渡すと、多くのトークン位置をまとめて処理し、位置間で情報を集める必要がある。入力長を2倍にしたとき、全ての位置対を扱う密なAttentionでは、その組数は4倍になる。計算回数だけでなく、巨大な途中結果を保存し、メモリと演算器の間を往復させる負担も問題になる。

[Attentionの計算原理](/foundations/attention-information-flow/)で扱ったQuery・Keyから重みを作りValueを混ぜる式を、結果を保ちながらどう実行するかが本稿の問いである。Prefill（入力の一括処理）とDecode（回答の次トークンを順次作る処理）を区別し、同じ「高速化」でも節約する資源を分ける。

FLOPsは浮動小数点演算の回数、FLOPSは毎秒の演算数であり、前者は仕事量、後者は速さの単位である。メモリ帯域幅（Memory Bandwidth）は毎秒どれだけデータを転送できるかを表す。計算量は入力長が増えたときの仕事や必要領域の増え方で、実時間そのものではない。本稿では二乗行列を保存せず集計する数学を導き、演算回数を変える改善と、転送を減らす改善を区別する。

1ヘッドの $Q,K\in\mathbb R^{n\times d_k}$、$V\in\mathbb R^{n\times d_v}$ を用い、$O=\operatorname{softmax}(QK^\top/\sqrt{d_k})V$ を計算する。$n$ はトークン数、$d_k,d_v$ はベクトル幅、$\mathbb R^{a\times b}$ は実数の $a$ 行 $b$ 列の行列、転置 $\top$ は行と列の交換である。

### 素朴な実装で増えるもの

$QK^\top$ の $n^2$ 要素を作るには $O(n^2d_k)$、重みと $V$ の積には $O(n^2d_v)$ が必要である。素朴な実装はスコアや確率行列を外部メモリへ保存する。

系列長4096なら $n^2=16,777,216$。1行列を2バイト要素で保存すると32 MiB、8192なら128 MiBとなる。これはバッチ1・1ヘッド・1行列だけの概算で、勾配、他ヘッド、作業領域を含まない。実測GPUメモリではない。

### 二乗行列を保存せず、同じ加重平均を求める

一つのQuery行を固定し、既に $1,\dots,t$ のスコア $s_j$ と値ベクトル $v_j$ を読んだとする。次の三つだけを保持する。

$$
m=\max_{j\le t}s_j,\quad
\ell=\sum_{j\le t}e^{s_j-m},\quad
u=\sum_{j\le t}e^{s_j-m}v_j.
$$

最終出力は $u/\ell$ である。次のスコア・値 $(s,v)$ を読むとき、新しい最大値を $m'=\max(m,s)$ と置く。過去の項の指数を共通の基準 $m'$ へ変換すると、

$$
\begin{aligned}
e^{s_j-m'}&=e^{s_j-m}e^{m-m'},\\
\ell'&=e^{m-m'}\ell+e^{s-m'},\\
u'&=e^{m-m'}u+e^{s-m'}v.
\end{aligned}
$$

分母・分子へ同じ係数を使うため比が保たれる。初期化は最初の有効要素で $m=s,\ell=1,u=v$ とすればよい。マスクで全要素無効の行は別処理とする。この導出は実数演算上の同値性であり、浮動小数点で素朴な実装とビット一致する保証ではない。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-one/efficiency-light.svg" alt="全スコア行列を保存する経路に対し、ブロックごとの最大値・分母・分子を更新して同じ出力を得る" width="480" height="480" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-one/efficiency-dark.svg" alt="全スコア行列を保存する経路に対し、ブロックごとの最大値・分母・分子を更新して同じ出力を得る" width="480" height="480" loading="lazy" />
  <figcaption>図1 中間行列の保存と逐次集計。全スコア行列を保存する経路に対し、ブロックごとの最大値・分母・分子を更新して同じ出力を得る。式との対応を示す模式図であり、実測したモデル性能ではない。</figcaption>
</figure>

この1行の集計では値幅を固定すれば、保持する状態は $m,\ell,u$ の $O(d_v)$ であり、スコア長 $n$ の配列は不要である。ただし、全てのQueryとKeyの組を計算する密な方式の $O(n^2d_k+n^2d_v)$ の演算は残る。

### ブロック化が転送を減らす

上の集計を複数行・複数Keyのブロックへ拡張し、GPU内部の高速メモリに置いたブロックを再利用するのがFlashAttentionを理解する入口である。巨大なスコア行列を外部メモリへ書いてから読み直す代わりに、ブロックを計算して出力統計へ合流させる。

FlashAttention原論文§3.1、Algorithm 1の要点は、密なAttentionの結果を近似せずにIOを減らすことである。密な行列積のFLOPsが線形になるという主張ではない。逆伝播では中間結果を再計算する設計もあり、計算を増やして転送と保存を減らすトレードオフがある。

### 同じ「節約」でも保証が異なる

|方式|主に節約するもの|元の密なAttentionとの関係|
|---|---|---|
|タイル化・オンライン集計|中間行列保存と外部メモリIO|実数演算で同じ式を評価できる|
|疎な参照|参照する組の数|元から制限されたAttentionとして定義するか、密な計算の近似かを明示する|
|低ランク・カーネル化|計算と中間表現|別の演算・近似の条件や誤差が必要|
|KVキャッシュ|過去位置のKey・Valueの再計算|過去表現の再利用。キャッシュ容量は増える|

本稿は各近似法の導出を追加するものではない。計算の変更と、同じ計算の実装改善を取り違えないための整理である。

### Prefillとdecodeで支配要因が変わる

KVキャッシュ（Key–Value Cache）は、過去位置について計算済みのKey・Valueを保持し、新しいトークンの生成で再利用する仕組みである。モデルの重みを書き換える学習ではなく、同じリクエストの途中結果を保存する。再計算を減らす代わりに、文脈が長いほど容量と読出しが増える。

Prefillは入力の多数のQueryをまとめて扱う。1トークンのdecodeでは、新しい1行のQueryが既存 $n$ 個のKey・Valueを読むため、Attention本体は $O(n(d_k+d_v))$ となる。KVキャッシュは $O(n(d_k+d_v))$ 要素であり、ヘッド数・層数・バッチ数を掛ける必要がある。

密な自己回帰モデルで長さ $n$ まで逐次decodeすると、各時点の読出しの和は $1+\cdots+n=O(n^2)$ になる。したがって「1ステップが線形」と「系列全体が線形」を混同しない。出力射影やMLPの費用はこの式の外にある。

### 速さを式だけで決めない

概念的な下限として、演算量を $F$、実効演算速度を $P$、転送量を $D$、実効帯域を $W$ とすれば、所要時間には $\max(F/P,D/W)$ という資源制約がある。単純な説明用モデルであり、同期や起動費用、通信、並列度を捨てた正確な実行時間式ではない。

精度、ハードウェア、形状、バッチ、カーネル、マスク、学習か推論かを揃えて測定する必要がある。本稿のPythonはオンライン集計の数値同値性と容量の算術を確認するだけで、GPU高速化率は測定していない。

#用語の別名や定義を確認するときは、<a href="/reference/glossary/#kv-cache" data-reference-page>KVキャッシュの定義</a>を参照できる。本文の数式は、各節で示した記号と成立条件に従って読む。

## 一次資料と研究の境界

- Dao et al., [FlashAttention](https://arxiv.org/html/2205.14135v2), NeurIPS 2022, §2、§3.1、Algorithm 1、§3.2。IOとFLOPsの区別を参照。上の1行・1要素の集計は本稿の導出である。
- Milakov and Gimelshein, [Online normalizer calculation for softmax](https://arxiv.org/abs/1805.02867), 2018技術報告, Algorithm 3。最大値を更新するオンライン正規化の基礎。
- Williams et al., [Roofline: an insightful visual performance model for multicore architectures](https://doi.org/10.1145/1498765.1498785), Communications of the ACM, 2009。演算と帯域の制約を考える性能モデル。

2026年の特定GPU向け実装の優位性は、同じ理論から無条件には導けない。本稿は新実装の速度ランキングを作らず、基礎演算とメモリ階層の区別に範囲を限定した。
