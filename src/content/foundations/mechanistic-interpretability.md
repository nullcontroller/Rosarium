---
title: "言語モデルの内部表現は、どこまで判断の仕組みを説明できるのか"
summary: "活性化の可視化から、重ね合わせ・SAE・活性化置換へ進む。人工辞書と介入例を検算し、相関、再構成、条件付きの因果的証拠と説明の限界を分ける。"
layer: ai-mathematics
ai_theme: ai-mathematics
kind: principle
section: foundations
status: draft
public: false
lifecycle: active
last_updated: "2026-11-26"
tags: [数理基礎, 言語モデル, 第4段階]
---

## 色付きの活性化図から、回答の理由まで分かるのか

言語モデルが「パリ」と回答したとき、ある内部の数値が大きくなっていたとする。その数値を地図のように色付けしても、「その数値が回答を生んだ」とまでは言えない。地名に関連する表現が同時に現れただけかもしれず、別の計算経路が答えを決めている可能性もある。

機構的解釈可能性（Mechanistic Interpretability）は、学習済みネットワークの内部計算を、再現・介入できる機構として理解しようとする研究である。活性化（Activation）は、ある入力を処理したときの中間的な数値であり、学習済みの重みそのものとは違う。特徴（Feature）は、入力の性質などを表す計算上の要素である。一つのニューロンと一つの人間の概念が、必ず一対一に対応するとは限らない。

本稿では、表現を分けて読む疎な自己符号化器と、途中の数値を置き換えて出力の変化を見る介入を接続する。どこまでが観測で、どこからが条件付きの因果的説明なのかを、二つの別々の人工モデルで確認する。実際の商用LLMの内部表現を取得した例ではない。

<span id="figure-1"></span>

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-four/interpretation-flow-light.svg" alt="入力、内部活性化、特徴候補、介入、回答の変化を分けて検証する" width="480" height="640" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-four/interpretation-flow-dark.svg" alt="入力、内部活性化、特徴候補、介入、回答の変化を分けて検証する" width="480" height="640" loading="lazy" />
  <figcaption>図1 観測、表現の近似、介入による検証を分ける。特定のLLMの内部実装図ではない。</figcaption>
</figure>

図1の「読む」と「変えて確かめる」は違う操作である。前提となるベクトルの加重和と次トークンのスコアは、[Attention](/foundations/attention-information-flow/)と[学習損失](/foundations/language-model-loss/)で扱った。ここでは重みを再学習するのではなく、固定したモデルの一部を調べる。

## ニューロンより多い特徴を、少ない次元へ重ねる

重ね合わせ（Superposition）は、表現空間の次元数より多くの特徴を、非直交な方向へ符号化する考え方である。特徴が同時に現れにくい場合には区別できても、重なれば干渉が起き得る。[Elhage et al.の人工モデル](https://transformer-circuits.pub/2022/toy_model/index.html)は、この関係を疎な入力と小さなネットワークで調べた研究報告である。任意のLLMに同じ表現があるという一般定理ではない。

具体的に、特徴の強さを表す非負ベクトル$z\in\mathbb R_{\ge0}^{3}$を、活性化$h\in\mathbb R^2$へ写す辞書$D\in\mathbb R^{2\times3}$を置く。列が特徴の方向である。

<span id="equation-1"></span>

$$
D=\begin{pmatrix}1&-1/2&-1/2\\0&\sqrt3/2&-\sqrt3/2\end{pmatrix},
\qquad h=Dz.
$$

三つの列は長さ1で、互いの内積は$-1/2$である。$z$が$(1,0,0)$、$(0,1,0)$、$(0,0,1)$のいずれかなら、$h$は異なる三方向になる。固定した読み出し$\tilde z=\operatorname{ReLU}(D^\top h)$を使うと、自分の成分は1、他は負の内積を0にするので、これら三例は復元できる。ReLUは各成分を$\max(0,x)$にする演算である。

一方、三特徴が同時に強さ1で現れると、列の和が0なので$D(1,1,1)^\top=(0,0)^\top$となる。特徴が全て0の場合と同じ活性化である。したがって、この写像から任意の$z$を一意に復元することはできない。「疎な三例を分けられる」と「全ての組合せを識別できる」は違う。これは本稿の固定した人工辞書の性質であり、訓練済みSAEの結果ではない。

## 疎な自己符号化器は、何を最小化するのか

疎な自己符号化器（Sparse Autoencoder, SAE）は、中間活性化を、多数の潜在特徴のうち少数だけが有効になる表現へ写し、元へ再構成するネットワークである。疎性（Sparsity）は、ここでは有効な特徴の少なさを意味する。分かりやすい特徴名が自動的に得られるという定義ではない。

活性化$h\in\mathbb R^d$に対し、潜在特徴$f\in\mathbb R_{\ge0}^m$、再構成$\hat h\in\mathbb R^d$を計算する。$W_e\in\mathbb R^{m\times d}$、$b_e\in\mathbb R^m$、$D\in\mathbb R^{d\times m}$、$b_d\in\mathbb R^d$である。前節の具体的な$D$とは別の、一般形の記号として使う。

<span id="equation-2"></span>

$$
\begin{aligned}f&=\operatorname{ReLU}(W_e(h-b_d)+b_e),\\ \hat h&=b_d+Df.\end{aligned}
$$

ReLU型の代表的な学習目的では、再構成誤差と潜在特徴の大きさの和を抑える。$\lambda\ge0$は疎性をどれだけ重視するかの係数である。

<span id="equation-3"></span>

$$
\mathcal L=\mathbb E_h\left[\|h-\hat h\|_2^2+\lambda\|f\|_1\right].
$$

L1ノルムは成分の絶対値の総和 $\|f\|_1=\sum_{i=1}^{m}|f_i|$ であり、この非負表現では $\sum_i f_i$ となる。非ゼロ成分数を直接数える指標ではない。L1正則化は疎性を促すが、非ゼロ成分数を直接最小化することとは異なる。

この期待値には対象とする活性化の分布と有限性が必要である。辞書を自由に拡大し、$f$を逆に縮めるだけでL1項を減らせないよう、列のノルムなどを制約する。本稿の例は列ノルム1とする。[Gao et al. §2](https://arxiv.org/html/2406.04093v1)はReLU型と、一定数の潜在特徴を選ぶTopK型を区別している。上のL1目的を全てのSAEの定義とはしない。

この目的が何をしているか、固定した直交辞書$D=I$、$b_d=0$で一成分ずつ考える。ここでは$f$を直接最適化し、エンコーダ全体の訓練を再現するわけではない。$h_i\ge0$、$f_i\ge0$として、目的は$(h_i-f_i)^2+\lambda f_i$である。正の解では微分を0にすると$2(f_i-h_i)+\lambda=0$、境界も考慮して

<span id="equation-4"></span>

$$
f_i^*=\max(h_i-\lambda/2,0).
$$

$h=(0.8,0.2)$、$\lambda=0.2$なら$f^*=(0.7,0.1)$、二乗誤差は0.02、疎性項は0.16、合計は0.18である。Pythonでは別の方法である0.001刻みの全探索と照合する。非直交な学習済み辞書でもこの成分別解になる、とは主張しない。

## 同時に動くことと、回答を変えることを分ける

ここからは別の人工モデルを使う。隠れた活性化を$h=(u,v)$、回答候補のlogitを$M(h)=2u-0.5$とする。logitは確率へ変換する前のスコアである。観測した標本が$(u,v)=(0,0),(1,1)$の繰返しなら、$u$も$v$もlogitと完全に相関する。しかし、この計算式では$v$を変えても出力は変わらない。

活性化置換（Activation Patching）は、対照的な入力の間で、選んだ位置・層・成分の活性化を移し、下流の出力がどう変わるかを調べる方法である。正しい挙動をするclean入力と、それを崩したcorrupted入力を用意し、重みと他の条件を固定する。実モデルでどの入力を対照にするか、どの出力指標を使うかは実験設計の一部である。[Zhang and Nanda](https://arxiv.org/html/2309.16042v2)は、破損方法と指標の選択による違いを検討している。

$P_S$を選んだ成分集合$S$の射影とすると、置換するベクトルを次のように定義できる。$I$は恒等写像である。

<span id="equation-5"></span>

$$
h^{patch}=(I-P_S)h^{corr}+P_Sh^{clean}.
$$

人工例でcleanを$(1,1)$、corruptedを$(0,0)$とする。元のlogitは1.5と$-0.5$である。$u$だけを置換すると1.5へ戻り、$v$だけなら$-0.5$のままである。相関だけでは区別できなかった役割が、固定した構造への介入では分かれる。

<span id="figure-2"></span>

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/math-phase-four/patching-comparison-light.svg" alt="人工例で二成分は共に出力と相関するが、uの置換だけでlogitが回復する" width="480" height="640" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/math-phase-four/patching-comparison-dark.svg" alt="人工例で二成分は共に出力と相関するが、uの置換だけでlogitが回復する" width="480" height="640" loading="lazy" />
  <figcaption>図2 相関が同じでも、介入効果は同じとは限らない。数値は本文の人工readoutだけの結果である。</figcaption>
</figure>

図2の回復率は、出力指標$M$を次の比で正規化したものである。

<span id="equation-6"></span>

$$
R_S=\frac{M(h^{patch})-M(h^{corr})}{M(h^{clean})-M(h^{corr})}.
$$

分母が0なら未定義である。この人工例では$u$の置換で1、$v$で0になるが、一般には0未満や1超もあり、確率ではない。さらに、cleanとcorruptedの間にない不自然な内部状態を作る可能性がある。特定の対照・位置・出力についての介入結果を、人間の意思決定全体への因果説明へ拡張しない。

## 回路を描いた後、説明をどう評価するのか

回路解析（Circuit Analysis）は、複数の計算要素とそれらの接続が、ある挙動をどう実現するかを調べる。特定成分の除去で挙動が消えることは、その対照における必要性の証拠となり得る。一部だけを残して挙動が保たれることは、同じ条件での十分性に関わる。冗長な経路があれば、単一の除去だけで役割を否定できない。

[2025年のCircuit Tracing](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)は、元モデルの一部を近似する置換モデルで帰属グラフを作り、介入で仮説を確認する研究報告である。元モデルと置換モデルの差、Attentionの機構の未説明部分、再構成誤差が残ることも明示されている。グラフ全体が、元モデルの全計算の忠実な説明になったとは扱わない。

評価では、再構成誤差、特徴の疎性、出力損失の回復、介入の再現性、別入力・別層での安定性を分ける。人手のラベルが読みやすいだけでは、出力への寄与を保証しない。[ICML 2025の疎なプローブの評価](https://proceedings.mlr.press/v267/kantamneni25a.html)も、強い比較手法を置く重要性を示すが、その課題での結果を全SAEの無用性へ一般化しない。

2026年の[活性化外れ値と特徴の不活性化の研究](https://proceedings.mlr.press/v306/simon26a.html)は、対象モデル群でSAEの特徴が使われなくなる現象を調べている。本稿では会議公式の要旨で確認した範囲に限り、全モデルに同じ前処理が有効だという結論や、報告値の独立再現は主張しない。

## 検算の範囲と、理解できたこと

`python scripts/math-phase-four/verify.py`のN08は、三つの疎な特徴の復元と密な特徴の衝突、直交辞書での解析解と格子探索、観測相関と置換後のlogitを照合する。全て人工計算であり、LLMの訓練やSAEの発見実験は行わない。密な辞書の符号化・復元は素朴に$O(dm)$、位置・層ごとの介入には下流の再計算費用も掛かる。回路の候補探索の費用は、辞書の一回の積だけでは表せない。

問いへの答えは、内部表現の可視化を入口にしつつ、何を再構成し、何を介入し、どの入力と出力に対して説明が保たれたかまで調べることである。SAEは表現の候補を、patchingは条件付きの介入証拠を与える。両者を組み合わせても、判断理由の完全で一意な説明が得られたとは限らない。[共通用語集](/reference/glossary/#mechanistic-interpretability)で補助用語も確認できる。

## 一次資料

- Elhage et al., [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html), 2022、研究機関の技術報告。人工ReLUモデルと幾何。
- Gao et al., [Scaling and evaluating sparse autoencoders](https://arxiv.org/html/2406.04093v1), 2024、確認したarXiv v1。§2の符号化・目的、§4の評価。査読版との同一性は未確認。
- Zhang and Nanda, [Towards Best Practices of Activation Patching](https://arxiv.org/html/2309.16042v2), ICLR 2024対応版、§2–4。対照と評価指標。
- Ameisen et al., [Circuit Tracing](https://transformer-circuits.pub/2025/attribution-graphs/methods.html), 2025、技術報告。置換モデル、介入、限界。
- Kantamneni et al., [Are Sparse Autoencoders Useful?](https://proceedings.mlr.press/v267/kantamneni25a.html), ICML 2025、会議公式の要旨。課題限定の評価。
- Simon et al., [Activation Outliers and Feature Death](https://proceedings.mlr.press/v306/simon26a.html), ICML 2026、会議公式の要旨。全文の全実験・証明は未検証。
