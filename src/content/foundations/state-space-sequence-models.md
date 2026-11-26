---
title: "状態空間モデル（SSM）の計算原理"
summary: "文章の過去情報を参照するAttentionと、内部状態へ集約するSSMを比較する。連続系の離散化から再帰・畳み込み・並列走査を導き、S4・Mambaの発想、計算条件と記憶の限界を人工系列で検算する。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: published
public: true
lifecycle: active
published_at: "2026-11-26"
last_updated: "2026-11-27"
tags: [数理基礎, 言語モデル, 第3段階]
---

## 長い文章の過去情報を、参照するか、状態に集約するか

AIが長い文章を読み、最後の質問に答えるとする。標準的なAttentionは、現在の位置から過去のトークン表現を参照し、重み付きで集約する。参照先が増えるほど計算と保持の負担が増える。一方、文章を読み進めるたびに内部状態を更新し、そこへ過去の情報を集約する方法もある。State Space Model（状態空間モデル、SSM）は、その更新を状態方程式で記述する枠組みである。

状態変数は、次の計算へ引き継ぐ情報を数値ベクトルで表したもの、状態遷移は、そのベクトルを入力から更新する規則である。状態は原文をそのまま保存する箱とは限らない。「昨日の気温」「今日の気温」を読みながら、減衰する合計を更新するだけでも状態を持てるが、全ての過去の値を正確に取り出せるわけではない。本稿の系列例は人工数列であり、実LLMの文章理解の測定ではない。

<figure id="figure-1" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/ssm-structure-light.svg" alt="Attentionは過去のKeyとValueを参照し、SSMは前の状態と現在入力から次の状態を更新する。保持対象が異なる" width="480" height="650" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/ssm-structure-dark.svg" alt="Attentionは過去のKeyとValueを参照し、SSMは前の状態と現在入力から次の状態を更新する。保持対象が異なる" width="480" height="650" loading="lazy" />
  <figcaption>図1 過去を読む計算と、履歴を状態へ集約する計算。一般的な因果Attentionと再帰SSMを比べる模式図であり、全てのハイブリッドを表すものではない。</figcaption>
</figure>

図1の違いを数学で確かめるため、まず制御工学でも使われる線形の状態方程式を置く。ニューラル系列モデルは、この枠組みを層として学習し、非線形処理や射影と組み合わせる。古典的な制御対象そのものと、学習する言語モデル全体は同じではない。

## 連続時間の式を、トークンごとの更新へ変える

状態次元は、次の位置へ引き継ぐ数値の個数と考えられる。一成分なら一つの減衰する合計、二成分なら速く忘れる合計と長く残す合計を別々に持つ、といった使い方ができる。原文のトークン数そのものではない。成分を増やすと表現の余地は増えるが、何を残してどう読むかは更新規則・学習・数値精度にも依存するため、記憶や正答の精度が必ず向上するとは限らない。

連続時間モデルは、実数時間$\tau$のどの時点にも状態を定義する。状態$h(\tau)\in\mathbb R^s$、入力$x(\tau)\in\mathbb R^d$、出力$y(\tau)\in\mathbb R^r$とする。$s$は状態次元、$d$は入力のモデル次元、$r$は出力次元である。

<span id="equation-1"></span>

$$
\frac{dh(\tau)}{d\tau}=Ah(\tau)+Bx(\tau),
\qquad y(\tau)=Ch(\tau)+Dx(\tau).
$$

$A\in\mathbb R^{s\times s}$は状態遷移の係数、$B\in\mathbb R^{s\times d}$は入力を状態へ入れる行列、$C\in\mathbb R^{r\times s}$は状態から出力を読む行列、$D\in\mathbb R^{r\times d}$は入力から出力への直接経路である。$D$はデータ量を表す記号ではない。本節では全行列が時間に依存しない線形時不変系（Linear Time-Invariant, LTI）を仮定する。

トークン位置$t=1,\ldots,n$に対応する離散時間モデルを作るには、区間幅$\Delta>0$の間に何が起きるかをまとめる。離散化とは、このように連続系から刻みごとの規則を作ることである。Zero-Order Hold（零次ホールド、ZOH）は、各区間中の入力$x_t$を一定とみなす仮定である。言語のトークン間隔を物理時間と同一視する必要はなく、系列モデルでは刻みも計算上のパラメータになり得る。

行列指数関数は$e^{A\Delta}=\sum_{j=0}^\infty(A\Delta)^j/j!$で定義する。有限次元の行列なら収束する。積分因子を使うと、区間の初めの状態$h_{t-1}$から

<span id="equation-2"></span>

$$
h_t=e^{A\Delta}h_{t-1}
+\left(\int_0^\Delta e^{Au}\,du\right)Bx_t.
$$

したがって、離散系の行列は

<span id="equation-3"></span>

$$
\bar A=e^{A\Delta},\quad
\bar B=\left(\int_0^\Delta e^{Au}\,du\right)B,
$$

<span id="equation-4"></span>

$$
h_t=\bar Ah_{t-1}+\bar Bx_t,
\qquad y_t=Ch_t+Dx_t.
$$

積分の式は$A$の可逆性を要求しない。$A$が可逆なら$\frac d{du}e^{Au}=Ae^{Au}$を積分して

<span id="equation-5"></span>

$$
\bar B=A^{-1}(e^{A\Delta}-I)B
$$

とも書ける。$A$が特異なら、この逆行列の表現は使えない。例えば$A=0$なら$\bar A=I,\bar B=\Delta B$である。小さい$\Delta$の一次近似$\bar A\approx I+\Delta A$とZOHの厳密式も区別する。

## 再帰を展開すると、なぜ畳み込みになるのか

再帰計算（Recurrence）は、前の状態から次の状態を順に求める計算である。線形・時不変なら、入力を過去へさかのぼって式を展開できる。

<span id="equation-6"></span>

$$
\begin{aligned}
h_1&=\bar Ah_0+\bar Bx_1,\\
h_2&=\bar A^2h_0+\bar A\bar Bx_1+\bar Bx_2,\\
h_t&=\bar A^th_0+\sum_{j=1}^t\bar A^{t-j}\bar Bx_j.
\end{aligned}
$$

出力へ代入すると

<span id="equation-7"></span>

$$
y_t=C\bar A^th_0+\sum_{j=1}^tK_{t-j}x_j+Dx_t,
\qquad K_\ell=C\bar A^\ell\bar B.
$$

$K_\ell\in\mathbb R^{r\times d}$は、$\ell$位置前の入力が出力へどう影響するかを表す核である。畳み込み（Convolution）は、位置差ごとの核を入力へ掛けて足す計算である。$h_0=0$なら最初の初期状態項が消え、入力との畳み込みと直接項になる。初期状態が非零なのに省略してはいけない。

時間依存行列$\bar A_t,\bar B_t,C_t$の場合、核の代わりに$C_t\bar A_t\cdots\bar A_{j+1}\bar B_j$が現れる。これは$t-j$だけでは決まらず、一般には同じ固定核を使い回せない。この区別が、後のSelective SSMに重要である。

## 状態容量と減衰を人工系列で見る

一次元で$h_0=0,\bar B=C=1,D=0$、入力$(1,0,2,0)$とする。$\bar A=0.5$なら状態と出力は$(1,0.5,2.25,1.125)$になる。最初の入力1が位置4へ残す寄与は$0.5^3=0.125$である。

<span id="calculation-table"></span>

|$\bar A$|状態 $h_1,h_2,h_3,h_4$|最初の入力の位置4への寄与|
|---|---|---:|
|0.5|1, 0.5, 2.25, 1.125|0.125|
|0.9|1, 0.9, 2.81, 2.529|0.729|

大きな係数ほどこの例の履歴は長く残るが、任意の系列に対する品質の優劣ではない。$|\bar A|<1$なら単一の過去入力の寄与は減衰する。行列系では固有値・行列構造・非正規性を含めて考える必要があり、成分ごとの大小だけで安定性を判断しない。

二状態の例として$\bar A=\operatorname{diag}(0.5,0.9)$、$\bar B=(1,1)^\top$、$C=(1/2,1/2)$を置くと、短い減衰と長い減衰の二つを同時に持てる。核は$K_\ell=(0.5^\ell+0.9^\ell)/2$である。

<figure id="figure-2" class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-three/ssm-memory-light.svg" alt="人工一次元状態で0.5と0.9の遷移係数が過去の寄与を異なる速さで減衰させる。二状態なら両方の成分を保持する" width="480" height="500" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-three/ssm-memory-dark.svg" alt="人工一次元状態で0.5と0.9の遷移係数が過去の寄与を異なる速さで減衰させる。二状態なら両方の成分を保持する" width="480" height="500" loading="lazy" />
  <figcaption>図2 状態数と減衰の役割。数値は一回の入力の寄与であり、LLMの文脈保持率ではない。</figcaption>
</figure>

状態容量は、保持できる状態成分数やその精度などに制約される。例えば一成分$b$ビット・$s$成分なら、有限精度の状態は最大$2^{bs}$通りである。同じ状態へ圧縮された履歴を、その後の同一入力から必ず区別することはできない。これは有限表現の数え上げであり、実数の無限精度まで仮定して同じ結論を無条件に述べない。

## S4から、入力に応じて状態を選ぶMambaへ

[HiPPO](https://arxiv.org/html/2008.07669v2)は過去の関数を多項式基底へ投影して記憶する構成を研究した。[S4](https://arxiv.org/html/2111.00396v3)（Structured State Space Sequence Model）は、そのような構造を持つ状態行列を利用し、長系列の核を効率よく計算する発想である。一般の密行列$A$をそのまま高速化したという説明ではなく、構造化された行列と算法が重要である。基底の係数は原文そのものではない。

Selective State Space Model（選択的SSM）は、入力に応じて書き込み・保持・読み出しを変える構成である。[Mamba](https://arxiv.org/html/2312.00752v2)では$B,C,\Delta$などを入力から決める。連続系の$A$が固定でも$\Delta_t$が変われば$\bar A_t=e^{\Delta_tA}$は変わる。固定核のLTI畳み込みと混同しない。

単純な選択の人工例なら、$g_t\in[0,1]$を入力から得るゲートとして

<span id="equation-8"></span>

$$
h_t=(1-g_t)h_{t-1}+g_tx_t
$$

と書ける。$g_t=0$なら保持、1なら上書きである。Mamba全体の再現ではなく、入力に依存する更新を理解する小さな例である。検算では$g_t$を固定した場合と、$x_t>0$なら0.8、それ以外なら0.1と人工的に変えた場合を比べる。

Parallel Scan（並列走査）は、前からの累積計算を結合法則でまとめ、木状に処理する方法である。入力列から$A_t,b_t$が決まった後の更新$h_t=A_th_{t-1}+b_t$について、二つの更新の合成は

<span id="equation-9"></span>

$$
(A_2,b_2)\circ(A_1,b_1)
=(A_2A_1,A_2b_1+b_2)
$$

であり結合的である。これにより、全接頭辞の更新を並列に計算する余地が生まれる。係数が未計算の前状態へ非線形に依存する一般RNNへ、この構成をそのまま適用できるとは限らない。また、任意の密行列積なら高価で、対角などの構造とメモリ配置が実効速度を左右する。

## Attentionとの費用比較は条件を揃える

系列長$n$、モデル次元$d$、各チャネルの状態次元$s$、層数固定として、代表的な項だけを比較する。Attentionの射影費用など、共通又は別項は表に明記する。

|工程|標準的な密Attention|対角・チャネル別SSMの例|
|---|---|---|
|全系列の混合演算|$O(n^2d)$|再帰又はscanの総仕事 $O(nds)$|
|生成の次の一位置|過去$n$位置への参照 $O(nd)$|状態更新 $O(ds)$|
|生成中の層ごとの履歴|KVキャッシュ $O(nd)$|状態 $O(ds)$|
|別に数える項|射影・FFNなど $O(nd^2)$|入出力射影など $O(nd^2)$|

一般の密な状態遷移行列なら、一チャネルで$O(s^2)$の更新になり得る。LTIで核を作れる場合はFFT（高速フーリエ変換）を使い、周波数側の積として求める畳み込み計算も選べるが、核生成・パディング・チャネル構造の費用がある。学習時は逆伝播用の中間値・再計算を含み、推論時の状態サイズだけを学習メモリと同一視しない。[AttentionのIO最適化](/foundations/attention-efficiency/)によっても比較は変わる。

SSMの線形な長さ依存は、状態数を長さと独立に固定した条件での話である。精度を維持するために状態を増やすなら、その費用を戻して考える。状態の集約と、任意の過去位置へ直接アクセスするAttentionには違いがある。

[SSD／Mamba-2](https://proceedings.mlr.press/v235/dao24a.html)は構造化行列を通じてAttentionとSSMの対応を調べている。全てのAttentionが固定状態で完全に代替されるとの意味ではない。両者を層ごとに組み合わせるハイブリッドも、参照と集約の使い分けとして理解できる。2026年の[Mamba-3の研究機関解説](https://pli.dais.princeton.edu/blog/2026/mamba-3-improved-sequence-modeling-using-state-space-principles)は離散化・状態構造の継続的な研究を示しているが、本稿の人工例はMamba-3を再現せず、報告された速度を一般性能へ転用しない。

## 検算と結論

`python scripts/math-phase-three/verify.py` のSSM系統では、ZOHのスカラー解析解と数値積分、$A=0$の特別な場合、再帰と直接畳み込み、二状態、scan合成、選択的更新を比較する。乱数系列も固定シードで補助検証する。行列指数を要する任意の密行列まで数値検証したとは主張しない。状態容量の図は検算した人工核から生成する。

問いへの答えは、SSMが過去の入力の効果を状態へ集約し、入力と状態の更新を繰り返して系列を処理することである。LTIなら畳み込みへ展開でき、入力依存なら選択性が得られる。その代わり、情報をどの状態へ残すかと、有限な状態から何を復元できるかが設計上の制約になる。常にAttentionより高精度・高速という結論は得られない。

共通の定義は<a data-reference-page href="/reference/glossary/#state-space-model">基本用語集</a>からも確認できる。

## 一次資料

- Gu et al., [HiPPO: Recurrent Memory with Optimal Polynomial Projections](https://arxiv.org/html/2008.07669v2), NeurIPS 2020。射影による記憶。
- Gu et al., [Efficiently Modeling Long Sequences with Structured State Spaces](https://arxiv.org/html/2111.00396v3), ICLR 2022。§2–3、構造化行列と核。
- Gu and Dao, [Mamba](https://arxiv.org/html/2312.00752v2), COLM 2024。§2–3、ZOH、選択的SSM、scan。
- Dao and Gu, [Transformers are SSMs](https://proceedings.mlr.press/v235/dao24a.html), ICML 2024。構造化状態空間双対性。
- Lahoti et al., [Mamba-3研究機関解説](https://pli.dais.princeton.edu/blog/2026/mamba-3-improved-sequence-modeling-using-state-space-principles), 2026年4月。解説とリンク先プレプリントの査読状態を同一視せず、今回の本文では追加定理の根拠に用いない。
