---
title: 基本用語集
summary: "モデル・情報・責任の基本用語と、AIの学習・生成・推論を理解する数学・計算用語を整理する。日本語名・英語名・略称から、役割、定義、混同しやすい概念を確認できる参照資料。"
layer: reference
kind: principle
section: foundations
status: stable
last_updated: "2026-11-26"
order: 10
tags: [用語, AI Design]
updated_at: "2026-09-22"
published_at: "2026-09-23"
publication_date_basis: fallback
---

## 基本用語集

このページは、サイト全体で使う語の意味を揃えるための参照資料である。製品ごとの呼称ではなく、設計時に区別すべき責務を中心に定義する。

### モデルと実行構造

| 用語 | このサイトでの意味 |
|---|---|
| AI | 入力から分類・予測・生成・推薦などを行うモデルまたは機能の総称 |
| LLM | 文脈を条件としてToken系列の確率分布を扱う大規模言語モデル |
| AIシステム | モデルに加え、入力、Knowledge、検索、Tool、検証、承認、実行、監視を含む系 |
| Agent | モデル、Tool、状態、停止条件をWorkflowで接続した実行Loop |
| Workflow | Task、状態遷移、担当、入力、出力、停止、例外処理を定義した工程 |
| Orchestrator | Taskの割当て、受渡し、再試行、停止、統合を制御する構成要素 |
| Tool | 検索、計算、更新など、モデル外部の能力へ接続する明示的なインターフェース |
| Artifact | AI、人間、既存システムが工程間で受け渡す成果物 |
| Provenance | 成果物の由来。入力、根拠、作成者、版、時刻、処理履歴を含む |

### 情報と根拠

| 用語 | 意味 |
|---|---|
| Input | 今回の処理要求または観測値 |
| Instruction | 役割、Task、制約、出力契約 |
| Context | 一回の処理でモデルが実際に参照できる情報 |
| Knowledge | 組織やDomainで再利用する知識資産 |
| Evidence | 判断や主張を検証するために関連付けた根拠 |
| Canonical Knowledge | 事実、版、責任主体を管理する正本 |
| Retrieval | 入力に関連する根拠候補を検索し、Contextへ組み込む処理 |

Knowledgeが存在しても、今回のContextへ正しく組み込まれなければ生成条件にはならない。検索された情報も、取得された時点で正しいと確定したわけではない。

### 検証と制御

| 用語 | 意味 |
|---|---|
| Validation | Schema、型、範囲、権限など、定義済み条件への適合確認 |
| Verification | 内容が根拠、仕様、期待結果と整合するかの確認 |
| Approval | 権限者が業務上の採用または実行を確定する行為 |
| Guardrail | 生成前の誘導、生成時制約、出力検証、実行制御を含む多層統制 |
| Human in the Loop（HITL） | 条件に応じてAIから人間へ判断・承認・例外処理を戻す設計 |
| Rollback | 実行後の変更を、安全が確認された状態へ戻す処理 |


<span id="ai-math-terms"></span>

## AI・数理の共通用語

学習・生成・推論で何を計算しているかを確認するための用語集である。各項目に日本語名、英語名と略称を併記し、ブラウザーのページ内検索でも探せる。本文を読むために全項目を先に覚える必要はない。記事の初出では意味を再掲し、ここは別名・定義・注意点の参照先とする。

- <a href="#math-probability" data-reference-page>数学・確率・統計</a>
- <a href="#math-information" data-reference-page>情報理論</a>
- <a href="#math-learning" data-reference-page>機械学習</a>
- <a href="#math-language" data-reference-page>言語モデル</a>
- <a href="#math-reinforcement" data-reference-page>強化学習・選好学習</a>
- <a href="#math-inference" data-reference-page>推論・探索</a>
- <a href="#math-structure" data-reference-page>モデル構造</a>
- <a href="#math-resources" data-reference-page>計算資源・最適化</a>

<span id="math-probability"></span>

### 数学・確率・統計

<span id="random-variable"></span>

#### 確率変数（Random Variable）

結果を値へ対応させる関数。AIの生成結果や採点値を、確率の対象として表す。実際に一度観測した値と、変数そのものを区別する。

<span id="distribution"></span>

#### 確率分布（Probability Distribution）

結果へ確率を割り当てる規則。有限語彙では非負の値の総和が1で、次トークンの選ばれやすさを表す。一回の出力は分布から得る結果であり、分布そのものではない。

<span id="conditional-probability"></span>

#### 条件付き確率（Conditional Probability）

情報を与えた下での確率。事象では P(A|B)=P(A∩B)/P(B)（P(B)>0）。言語モデルでは入力と生成済みトークンを条件に次を予測する。0確率の条件はこの比だけでは定義できない。

<span id="joint-probability"></span>

#### 同時確率（Joint Probability）

複数の事象が同時に起きる確率。二トークン列の確率は、最初の確率と、その後の条件付き確率の積で表せる。独立でなければ周辺確率同士の積にはならない。

<span id="expectation"></span>

#### 期待値（Expectation）

確率で重み付けした平均。離散値では E[f(X)]=Σx p(x)f(x)。AIが生成し得る回答の報酬を平均する。有限標本の平均とは別で、無限集合では可積分性などを確認する。

<span id="variance"></span>

#### 分散（Variance）

平均からのずれの二乗の期待値。方策勾配の推定が回答を生成し直すとどれだけ揺れるかを表す。値自体の大きさやモデルの正確さとは異なる。有限の二次モーメントを必要とする。

<span id="independence"></span>

#### 独立性（Independence）

一方を知っても他方の分布が変わらない関係。二変数では同時分布が周辺分布の積へ分かれる。AIの候補や検証器が同じ根拠を共有する場合、独立と決め付けない。

<span id="iid"></span>

#### 独立同分布（Independent and Identically Distributed; IID）

標本が互いに独立で、同じ分布に従う条件。複数候補の成功確率を積で扱う人工モデルなどに使う。似た候補を複製しても独立な試行にはならない。

<span id="support"></span>

#### 支持集合（Support）

本サイトの有限離散モデルでは、確率が正である値の集合。確率比や対数を使う前に分母と支持集合を確かめる。連続分布の位相的な支持の定義とは区別する。

<span id="maximum-likelihood"></span>

#### 最尤推定（Maximum Likelihood Estimation; MLE）

観測データを生じやすくするパラメータを選ぶ推定。言語モデルでは訓練トークンの対数確率を高くする。データの事実性や未見データへの最適性は、それだけでは保証しない。

基礎資料：[確率の定義](https://d2l.ai/chapter_preliminaries/probability.html)。著者公開教材 Probability and Statistics。有限離散モデルの定義を確認。

<span id="bayesian-inference"></span>

#### ベイズ推論（Bayesian Inference）

観測の尤度と事前確率から事後確率を求める方法。ICLの説明モデルに使う場合も、LLM内部が明示的なベイズ算法を実行しているとの断定とは分ける。観測の周辺確率が正であることが必要である。

<span id="latent-variable"></span>

#### 潜在変数（Latent Variable）

直接観測せず、推定又は周辺化する変数。ICLの潜在タスクや拡散の中間系列など、対象ごとに定義域を明示する。内部に同名の実装変数があるとは限らない。

<span id="markov-chain"></span>

#### マルコフ連鎖（Markov Chain）

次の状態の分布が、現在の状態を条件にすると、それ以前の履歴に依存しない確率過程。離散拡散の遷移を記述する。系列の全トークンが無条件に独立という意味ではない。

<span id="transition-probability"></span>

#### 遷移確率（Transition Probability）

ある状態から次の状態へ移る条件付き確率。有限状態の遷移行列は非負で、行を出発状態とする規約なら各行和を1にする。行列の向きを明記する。

<span id="convolution"></span>

#### 畳み込み（Convolution）

位置差に応じた核を各入力へ掛けて足す演算。LTIのゼロ初期状態SSMは因果畳み込みに展開できるが、入力依存の状態更新は一般に同じ固定核を持たない。

第3段階追加語の基礎資料：[原著論文](https://arxiv.org/html/2107.03006v3)。各語の利用条件と主張の根拠はレビュー資料の対応表で区別する。

<span id="math-information"></span>

### 情報理論

<span id="entropy"></span>

#### エントロピー（Entropy）

離散分布自身の不確実性 H(p)=−Σi p_i log p_i。生成の一位置の分布の広がりを調べる。0 log 0=0とし、対数の底で単位が変わる。文章の事実性の尺度ではない。

<span id="cross-entropy"></span>

#### 交差エントロピー（Cross-Entropy）

目標pの結果へ予測qが与える負の対数確率の平均 H(p,q)=−Σi p_i log q_i。次トークン予測の学習に使う。pが正でqが0なら無限大となり、p自身のエントロピーとは異なる。

<span id="kl-divergence"></span>

#### KLダイバージェンス（Kullback–Leibler Divergence; KL）

D_KL(p∥q)=Σi p_i log(p_i/q_i)という向き付きのずれ。選好学習で基準分布からの乖離を罰する。対称な距離ではなく、pが正の位置でqが0なら無限大となる。

基礎資料：[情報量と学習損失](https://d2l.ai/chapter_linear-classification/softmax-regression.html)。著者公開教材。エントロピー等の歴史的原典はN01のShannon文献も参照。

<span id="math-learning"></span>

### 機械学習

<span id="parameter"></span>

#### パラメータ（Parameter）

モデルを定める数値。学習で更新する重みやバイアスなどがある。学習率や層数のように学習設定として与えるハイパーパラメータと区別する。

<span id="weight"></span>

#### 重み（Weight）

入力や内部表現へ掛ける学習対象の係数。Attentionの一時的な参照重みと、モデルに保存する重みは別の文脈である。パラメータ数を、そのまま知識の件数とはみなさない。

<span id="loss"></span>

#### 損失関数（Loss Function）

予測と目標のずれを数値化し、小さくする学習目的を作る関数。トークンの負の対数尤度などがある。大きくしたい報酬とは向きが異なり、損失の低下が実用能力の改善を保証するとは限らない。

<span id="gradient"></span>

#### 勾配（Gradient）

各パラメータに対する微分を並べたベクトル。損失や期待報酬の局所的な変化率を表す。微分可能性を確認し、有限標本の推定値と真の勾配を区別する。

<span id="gradient-descent"></span>

#### 勾配降下法（Gradient Descent）

損失の勾配と逆の方向へ小さく更新する最適化法。学習率が更新幅を決める。非凸なニューラルモデルの大域最適到達は一般には保証しない。

<span id="backpropagation"></span>

#### 逆伝播（Backpropagation）

計算グラフの出力から入力側へ連鎖律を適用して微分を計算する手順。重みを更新する最適化器とは別で、勾配を求める計算である。

<span id="supervised-learning"></span>

#### 教師あり学習（Supervised Learning）

入力と教師情報の組から予測を学ぶ枠組み。回答例や比較ラベルなどが教師となる。教師あり微調整SFTと、教師情報のある学習全般は同一の範囲ではない。

<span id="pretraining"></span>

#### 事前学習（Pretraining）

大量のデータで基礎となる表現や予測能力を学ぶ工程。自己回帰型では次トークン予測が代表例である。全方式が同じ目的を使うとは限らない。

<span id="post-training"></span>

#### 事後学習（Post-training）

事前学習後に、指示回答例、選好、報酬などでモデルを調整する工程の総称。生成時に重みを固定して回答する推論とは別の処理である。

<span id="regularization"></span>

#### 正則化（Regularization）

望ましい性質へ学習を誘導する罰則や制約。KL正則化では基準からの分布のずれを罰する。ソフトな罰則を、必ず守られる厳密な上限制約と同一視しない。

<span id="generalization"></span>

#### 汎化（Generalization）

学習に使わなかった標本や条件でも学習結果が役立つこと。同じ分布の評価と分布外への評価を分ける。訓練報酬の改善だけでは汎化を確認したことにならない。

基礎資料：[学習の基礎](https://d2l.ai/chapter_multilayer-perceptrons/backprop.html)。著者公開教材。逆伝播と更新を区別。

<span id="task-distribution"></span>

#### タスク分布（Task Distribution）

訓練又は評価でどの課題がどれだけ生じるかを表す分布。ICLの適応範囲やメタ学習の外側の期待値を定義する。自然言語の全課題を被覆する保証ではない。

<span id="meta-learning"></span>

#### メタ学習（Meta-learning）

複数のタスクから、新しい課題に適応しやすい規則・表現・初期値などを得る枠組み。外側のパラメータ学習と、利用時の文脈適応を区別する。

<span id="inductive-bias"></span>

#### 帰納バイアス（Inductive Bias）

有限の観測に適合する複数の規則の中で、構造・学習分布・算法によって特定の規則が選ばれやすい傾向。単なる偏見という意味ではなく、一般化の前提に関わる。

第3段階追加語の基礎資料：[原著論文](https://arxiv.org/html/2208.01066v3)。各語の利用条件と主張の根拠はレビュー資料の対応表で区別する。

<span id="math-language"></span>

### 言語モデル

<span id="token"></span>

#### トークン（Token）

モデルが入出力を扱う離散的な処理単位。単語、部分語、文字やバイト列などに対応し得る。トークン数と日本語の文字数は一致しない。

<span id="tokenization"></span>

#### トークン化（Tokenization）

文字列を語彙内のトークンIDの列へ変換する工程。言語モデルの入力形式と系列長を決める。具体的な分割は採用方式と語彙に依存する。

<span id="embedding"></span>

#### 埋め込み（Embedding）

離散的なトークンなどを数値ベクトルへ対応させる表現。モデル内部の計算の出発点となる。文脈で変わった中間表現と、入力の埋め込み表だけを同一視しない。

<span id="logit"></span>

#### ロジット（Logit）

本サイトの多クラス生成では、Softmax前の実数スコア。確率と違って負でもよい。二値統計でいう対数オッズlog(p/(1−p))と、モデル出力スコアという用法を区別する。

<span id="softmax"></span>

#### ソフトマックス（Softmax）

実数スコアzを exp(z_i)/Σj exp(z_j)へ写す関数。次トークン分布やAttention重みを作る。有限の実数入力を前提とし、マスクで全候補を消した場合の分母を放置しない。

<span id="temperature"></span>

#### 温度（Temperature）

生成時にlogitを正のTで割り、候補間の確率比を調整する設定。モデルの学習済み重みは変えない。T=0はこの式では未定義で、製品の0設定の扱いは別途確認する。

<span id="autoregression"></span>

#### 自己回帰（Autoregression）

既に得たトークンを条件に次のトークンを予測する方式。系列確率を条件付き確率の積で表す。確率の分解そのものと、どのアルゴリズムで生成するかは区別する。

基礎資料：[Transformerの構造](https://arxiv.org/html/1706.03762v7)。Vaswani et al., NeurIPS 2017, §3.2–3.5。用語は本サイトの説明へ一般化した。

<span id="context"></span>

#### コンテキスト（Context）

一回の処理でモデルが実際に参照する入力情報。指示・例・生成済み文字列などを含む。保存された全履歴や全学習データと同一ではない。

<span id="in-context-learning"></span>

#### 文脈内学習（In-Context Learning, ICL）

推論時の例などに応じ、重みを更新せずに課題への振る舞いが変わる現象。条件付けとしての記述、ベイズ的解釈、特定回路の仮説を区別する。

<span id="zero-shot"></span>

#### 例なし設定（Zero-shot）

入力に解答例を含めないタスク設定。指示や事前学習の知識がないという意味ではない。

<span id="one-shot"></span>

#### 一例設定（One-shot）

入力に一つの例示を含む設定。重み更新を一回行うという意味ではない。

<span id="few-shot"></span>

#### 少数例設定（Few-shot）

少数の例示を含む入力でタスクへ適応させる設定。例数を増やすだけで正答が保証されるわけではない。

<span id="demonstration"></span>

#### 例示（Demonstration）

入力と望ましい出力の組など、解き方や形式を示す情報。評価対象そのものの正解を漏らすこととは区別する。

<span id="non-autoregressive"></span>

#### 非自己回帰（Non-Autoregressive）

左から一つずつ確定する生成依存に限定しない方式。複数位置の反復更新を含み得る。全出力位置の無条件独立や高速化を保証する名称ではない。

<span id="diffusion-model"></span>

#### 拡散モデル（Diffusion Model）

データを壊す順方向過程を定め、そこから復元する逆過程を学ぶ生成モデルの枠組み。連続ガウス型と離散トークン型を区別する。

<span id="forward-process"></span>

#### 順方向過程（Forward Process）

データへノイズを加えて潜在状態へ移す過程。マスク拡散ではトークンをマスク状態へ移す。生成時のニューラルネットの順伝播とは別の用語である。

<span id="reverse-process"></span>

#### 逆方向過程（Reverse Process）

ノイズ状態からデータへ戻す確率遷移。順方向行列の逆行列ではなく、未知の内容をモデルなどで推定する。

<span id="denoising"></span>

#### ノイズ除去・復元（Denoising）

壊した入力から内容を推定する処理。拡散言語モデルではマスクされたトークンなどを予測する。

<span id="discrete-diffusion"></span>

#### 離散拡散（Discrete Diffusion）

有限状態間の確率遷移でデータを壊し復元する方式。語彙番号へ画像用ガウスノイズをそのまま加える意味ではない。

<span id="masked-diffusion"></span>

#### マスク拡散（Masked Diffusion）

内容を特別なマスクへ移す離散拡散。吸収型なら一度マスクになると順方向では戻らない。逆側の再マスク算法とは区別する。

<span id="noise-schedule"></span>

#### ノイズスケジュール（Noise Schedule）

各時点でどの程度ノイズを加えるかの規則。離散マスクでは一段のマスク率と累積生存率を区別する。

<span id="elbo"></span>

#### 変分下界（Evidence Lower Bound, ELBO）

補助分布による期待値で表す対数尤度の下限。必要な支持条件・有限性を確認する。下界の最大化と実際の生成品質の改善を同一視しない。

<span id="sampling-step"></span>

#### 生成更新ステップ（Sampling Step）

拡散などで推論中に状態を一段更新する回数の単位。訓練のパラメータ更新回数とは別である。

<span id="remasking"></span>

#### 再マスク（Remasking）

一度提案した位置を未確定へ戻して再検討する生成上の操作。未マスクを固定する逆過程の定理が、そのまま成り立つとは限らない。

第3段階追加語の基礎資料：[原著論文](https://arxiv.org/html/2406.07524v2)。各語の利用条件と主張の根拠はレビュー資料の対応表で区別する。

<span id="math-reinforcement"></span>

### 強化学習・選好学習

<span id="mdp"></span>

#### マルコフ決定過程（Markov Decision Process; MDP）

状態・行動・遷移・報酬などで逐次意思決定を表すモデル。言語生成では入力と接頭辞を状態にできる。現在の状態と行動で次状態の条件付き分布が定まるという仮定が必要である。

<span id="state"></span>

#### 状態（State）

意思決定に必要な現在の情報を表す量。言語モデルのMDPでは入力と生成済みトークンを含める。見えている観測だけでマルコフ性があるとは限らない。

<span id="action"></span>

#### 行動（Action）

方策が選ぶ選択肢。トークン単位の言語生成では次トークンで、回答全体を一行動にする人工モデルとは粒度が違う。

<span id="policy"></span>

#### 方策（Policy）

状態ごとの行動の選び方を定める確率分布π(a|s)。言語モデルが次トークン分布を計算する実装になれる。方策という数学的な規則と、モデル全体を区別する。

<span id="trajectory"></span>

#### 軌跡（Trajectory）

開始から終了までの状態と行動の列。回答生成全体が一つの軌跡になり、その確率を微分して報酬と更新を結び付ける。

<span id="reward"></span>

#### 報酬（Reward）

行動や生成結果への数値評価。正解なら1などと定義する。評価器が誤れば信号も誤り、実用上の価値を自動的に表すものではない。

<span id="return"></span>

#### 累積報酬・収益（Return）

将来の報酬を割引して足した値。G_t=Σk≥t γ^(k−t)R_(k+1)。一回の報酬とは別で、終端だけを採点する有限生成ではγ=1も使える。

<span id="discount"></span>

#### 割引率（Discount Factor）

先の報酬をどれだけ重く数えるかを決めるγ。有限長なら0≤γ≤1を使い、無限時間の収益の有限性には追加条件が要る。学習される重みではなく目的の設定である。

<span id="value"></span>

#### 価値関数（Value Function）

状態sから方策に従ったときの期待累積報酬Vπ(s)。接頭辞からどれだけよい終端評価を見込めるかに対応する。有限時間では残り時間への依存もある。

<span id="action-value"></span>

#### 行動価値関数（Action-Value Function）

最初の行動も固定した期待累積報酬Qπ(s,a)。次トークンを指定した後の見込みを表す。行動を平均したVとは条件が異なる。

<span id="advantage"></span>

#### 優位性（Advantage）

Aπ(s,a)=Qπ(s,a)−Vπ(s)。同じ状態での通常の選択に比べた良さ。GRPOの標本群で正規化した報酬は、この真の差に等しいと保証された量ではない。

<span id="baseline"></span>

#### ベースライン（Baseline）

勾配の揺れを抑えるため収益から引く比較基準。状態だけの基準なら期待勾配を変えない条件を示せるが、任意の基準が分散を下げるわけではない。

<span id="policy-gradient"></span>

#### 方策勾配（Policy Gradient）

方策パラメータに関する期待報酬の微分。対数確率の勾配と収益を結ぶ。支持集合や微分の交換条件を確認し、報酬を直接微分する処理と区別する。

<span id="importance-sampling"></span>

#### 重要度サンプリング（Importance Sampling; IS）

別の分布から得た標本を、目的の分布との確率比で重み付けする方法。旧方策の回答の再利用に使う。被覆条件が必要で、比が大きいと分散が増え得る。

<span id="reinforce"></span>

#### REINFORCE（REINFORCE）

生成した軌跡の累積報酬と対数確率の勾配から更新を推定する方法の原著名。報酬しかない場合を扱えるが、有限標本では推定のばらつきがある。

<span id="ppo"></span>

#### 近接方策最適化（Proximal Policy Optimization; PPO）

旧方策の標本で代理目的を最適化する方策更新方式。クリップ項は改善方向の利得を飽和させる。全行動の確率比やKLへ厳密な上限を保証する操作ではない。

<span id="grpo"></span>

#### グループ相対方策最適化（Group Relative Policy Optimization; GRPO）

同じ入力の回答群を相対評価して更新する方式。DeepSeekMathの基本形にはクリップとKL項がある。全報酬が同じ場合のゼロ分散処理など、原式と実装規約を区別する。

<span id="preference"></span>

#### 選好（Preference）

同じ問いへの回答を比較して、どちらを好むかという関係。簡潔さなどを学習信号にできるが、事実性や安全性の真値とは限らない。評価者による違いもある。

<span id="reward-model"></span>

#### 報酬モデル（Reward Model）

入力と回答から報酬を予測するモデル。人の比較ラベルなどから学ぶ。予測の誤差や学習範囲外での挙動を、方策自体の生成能力と分ける。

<span id="reference-policy"></span>

#### 参照方策（Reference Policy）

更新の基準として固定する分布。KL正則化で離れ方を測る。古い標本を生成した旧方策と、参照方策は同じとは限らない。

<span id="rlhf"></span>

#### 人間のフィードバックによる強化学習（Reinforcement Learning from Human Feedback; RLHF）

人の評価を利用して方策を改善する方法群。代表形では比較から報酬モデルを学び、生成を採点して更新する。全方式が同じ工程や報酬を持つとは限らない。

<span id="dpo"></span>

#### 直接選好最適化（Direct Preference Optimization; DPO）

参照方策との対数確率比を使って回答対の選好損失を直接作る方法。KL正則化目的と比較モデルの仮定から導く。任意のRLHFとの無条件な等価性を意味しない。

<span id="rlvr"></span>

#### 検証可能な報酬による強化学習（Reinforcement Learning with Verifiable Rewards; RLVR）

正解照合やテストなどで得る報酬による強化学習。採点規則を実行できることと、全ての正しさを判定できることは別である。

<span id="reward-hacking"></span>

#### 報酬ハッキング（Reward Hacking）

本来の目的を満たさず、代理報酬の抜け穴で高得点になる問題。テストの盲点を使う回答など。報酬改善と独立評価を分けて調べる。

<span id="outcome-reward"></span>

#### 結果報酬（Outcome Reward）

最終回答や実行結果を評価する報酬。採点を自動化しやすい場合があるが、途中の推論が正しかったかは最終解だけで保証しない。

<span id="process-reward"></span>

#### 過程報酬（Process Reward）

解答の途中段階を評価する報酬。段階の区切り、採点の正しさ、終端目的への集約方法を必要とする。過程採点モデルも万能な証明器ではない。

選好と更新方式の原著：[DPO](https://arxiv.org/html/2305.18290v2)、[PPO](https://arxiv.org/abs/1707.06347)、[GRPO](https://arxiv.org/html/2402.03300v3)。原著の目的と、本用語集の短い説明を区別する。

基礎資料：[報酬と方策の定義](https://www2.imm.dtu.dk/courses/02465/pensum/sutton2018.pdf)。Sutton and Barto, Chapters 3, 5, 13。RLHF/DPO/GRPOは各記事の原著を参照。

<span id="math-inference"></span>

### 推論・探索

<span id="inference"></span>

#### 推論（Inference）

学習したモデルを用いて予測や生成を計算すること。論理的推論Reasoningと区別する。利用時にも学習する方式を論じるなら、その更新を別に明示する。

<span id="reasoning"></span>

#### 論理的推論（Reasoning）

複数段階で関係や条件をたどって問題を解く処理・能力。文章に推論過程が書かれたことだけで、内部計算や結論の正しさは確定しない。

<span id="sampling"></span>

#### サンプリング（Sampling）

指定した分布から値を取り出す操作。言語生成では次トークンを選ぶ。独立性や同分布性は標本化の設計による条件であり、語の意味から自動的には付かない。

<span id="verifier"></span>

#### 検証器（Verifier）

候補を採点・検査する規則やモデル。テストを実行するものも、比較スコアを予測するものもある。生成候補に正解があることと、検証器が正解を選べることを区別する。

<span id="test-time-scaling"></span>

#### 推論時スケーリング（Test-Time Scaling）

利用時の生成・探索・検証へ使う計算を増減する考え方。学習時に重みを改善することと区別する。計算増加だけで正答率改善を保証しない。

<span id="speculative-decoding"></span>

#### 投機的復号（Speculative Decoding）

軽いモデルの提案を重いモデルでまとめて検証する生成方式。厳密型では受理と補正で目標分布を保つ。分布保存と実時間の高速化は別の条件である。

<span id="draft-model"></span>

#### 下書きモデル（Draft Model）

先読み候補を生成するモデル。Targetより安価に提案できることが高速化の動機である。小さいだけで常に全体が速くなるわけではない。

<span id="target-model"></span>

#### 目標モデル（Target Model）

本来使いたい生成分布を与えるモデル。投機的復号では提案接頭辞も評価する。真偽の正解を与える採点器とは限らない。

<span id="proposal-distribution"></span>

#### 提案分布（Proposal Distribution）

候補の標本化に使う分布q。投機的復号ではDraftが条件付きで与える。生成した提案だけで比p/qを評価し、q=0の位置で割らない。

<span id="target-distribution"></span>

#### 目標分布（Target Distribution）

最終的に保ちたい分布p。Targetの変換後の生成分布を対象とする。どの出力が一回現れるかとは別の確率法則である。

<span id="acceptance-probability"></span>

#### 受理確率（Acceptance Probability）

提案したxを採用する条件付き確率。基本の投機的復号ではmin(1,p(x)/q(x))。正解率の保証とは別で、接頭辞と実際の分布を揃える必要がある。

<span id="correction-distribution"></span>

#### 補正分布（Correction Distribution）

棄却後に不足質量の正部分(p−q)へ比例して引き直す分布。受理経路と足して目標分布を復元する。棄却確率0なら定義せず、その経路を使わない。

基礎資料：[提案・受理・補正](https://proceedings.mlr.press/v202/leviathan23a.html)。Leviathan et al., ICML 2023, Algorithm 1。探索と検証はN06、RLVRはN05の一次資料と区別。

<span id="math-structure"></span>

### モデル構造

<span id="query-key-value"></span>

#### Query・Key・Value（Query, Key, Value; Q/K/V）

QueryとKeyで位置間の参照スコアを計算し、Valueを重み付きで集約する三つの表現。学習された射影で作る。照会や鍵という名前を、人の意図が直接格納される場所とはみなさない。

<span id="attention"></span>

#### 注意機構（Attention）

入力に応じた重みで情報を集約する計算。Transformerのscaled dot-product型では内積をSoftmaxへ通してValueを混ぜる。参照重みは生成確率や因果説明と同じではない。

<span id="mask"></span>

#### マスク（Mask）

参照や選択を許さない位置を計算上で除外する規則。因果マスクは未来のトークンを参照させない。全候補を無効にする行の扱いなど、正規化の成立条件を要する。

<span id="kv-cache"></span>

#### KVキャッシュ（Key–Value Cache）

過去位置のKey・Valueを保存し、逐次生成で再利用する仕組み。再計算は減らせるが、保持容量と毎ステップの読出しは増える。学習済みの重みとは別の実行時データである。

基礎資料：[Transformerの構造](https://arxiv.org/html/1706.03762v7)。Vaswani et al., NeurIPS 2017, §3.2–3.5。用語は本サイトの説明へ一般化した。

<span id="induction-head"></span>

#### 反復パターン参照ヘッド（Induction Head）

以前のAの後のBを、再びAが来たときの予測へ利用するようなAttentionヘッド。特定モデルの回路研究の対象であり、ICL全般の唯一の原因ではない。

<span id="implicit-gradient-descent"></span>

#### 暗黙的勾配降下（Implicit Gradient Descent）

固定ネットワークの順伝播が、別の推定問題の勾配更新に対応するという説明。回帰係数の更新とTransformer自体の重み更新を混同しない。

<span id="dense-model"></span>

#### 密なモデル（Dense Model）

ここでは各トークンが対象層の共通ネットワークを使用する構成。モデル全体の各要素が常に非零であるという意味ではない。

<span id="sparse-model"></span>

#### 疎なモデル（Sparse Model）

ここでは入力ごとに一部の計算経路を選ぶモデル。重み行列の零要素による疎性とは区別する。

<span id="mixture-of-experts"></span>

#### 混合Expertモデル（Mixture of Experts, MoE）

複数の学習可能な関数をゲートにより選択・合成する構成。疎なMoEは一部のみを実行する。総パラメータ数は知識量ではない。

<span id="expert"></span>

#### Expert（専門家関数）

MoE内で入力表現を変換する学習可能な部分ネットワーク。人間の専門家や独立人格ではなく、人間の分野への分化も保証されない。

<span id="router"></span>

#### Router・ゲート（Gating Network）

入力からExpertの選択スコア・合成重みを計算するネットワーク。外部のAIサービスを振り分ける業務ルーターとは文脈が異なる。

<span id="top-k-routing"></span>

#### 上位k経路選択（Top-k Routing）

Routerスコアの上位k個のExpertへ送る処理。選択後の再正規化、同点処理、容量超過の規約を別に定める。

<span id="conditional-computation"></span>

#### 条件付き計算（Conditional Computation）

入力に応じて実行する部分を変える構成。MoEではExpertの選択により全重み数と一回の活性数を分ける。全費用の減少は別条件である。

<span id="feed-forward-network"></span>

#### 順伝播ネットワーク（Feed-Forward Network, FFN）

Transformerでは主に各位置へ適用する非線形変換部分を指す。位置間を読むAttentionとは別の役割であり、MoEが置き換える対象の一例。

<span id="state-space-model"></span>

#### 状態空間モデル（State Space Model, SSM）

入力・内部状態・出力の方程式で系列を記述する枠組み。ニューラルSSMは構造を学習する層として利用する。制御対象とモデル全体は同じではない。

<span id="state-variable"></span>

#### 状態変数（State Variable）

次の計算へ引き継ぐ情報のベクトル。SSMでは前状態と現在入力から更新する。強化学習の環境状態と同じ定義だと決め付けない。

<span id="state-transition"></span>

#### 状態遷移（State Transition）

状態を次の時点へ更新する規則。連続SSMのAと離散SSMのAバーの関係は離散化に依存する。

<span id="continuous-time"></span>

#### 連続時間モデル（Continuous-Time Model）

実数時刻で状態を定義し、微分方程式などで変化を表すモデル。系列層では物理時間の実測とは限らない。

<span id="discrete-time"></span>

#### 離散時間モデル（Discrete-Time Model）

刻みごとの状態を定義するモデル。SSMではトークン位置などの更新に用い、離散トークンという状態の種類とは別軸である。

<span id="discretization"></span>

#### 離散化（Discretization）

連続系を有限刻みの規則へ変換する操作。ZOHは区間内の入力一定を仮定する。一次近似と厳密な区間解を区別する。

<span id="matrix-exponential"></span>

#### 行列指数関数（Matrix Exponential）

eの行列乗を級数で定義したもの。定係数線形系の状態遷移e^(AΔ)を表す。成分ごとの指数計算とは異なる。

<span id="recurrence"></span>

#### 再帰計算（Recurrence）

前の状態を用いて次を順に求める計算。線形時不変SSMなら初期状態項と入力の畳み込みへ展開できる。

<span id="parallel-scan"></span>

#### 並列走査（Parallel Scan）

結合的な演算の累積値を木状に計算する方法。既知のアフィン状態更新の合成に利用できるが、一般の非線形状態依存更新を自動的に並列化しない。

<span id="selective-ssm"></span>

#### 選択的状態空間モデル（Selective SSM）

入力によって書き込み・保持・読み出しの係数などを変えるSSM。一般に固定核のLTI畳み込みとは異なる。

<span id="s4"></span>

#### 構造化状態空間系列モデル（Structured State Space Sequence Model, S4）

構造化した状態行列を使い、長系列の核を効率よく計算するモデル系列。任意の密行列SSMが同じ費用になるわけではない。

<span id="mamba-model"></span>

#### Mamba

入力依存の選択的SSMとハードウェアを考慮した算法を組み合わせる系列モデル。スカラーゲートだけで完全に再現されるものではない。

<span id="state-capacity"></span>

#### 状態容量（State Capacity）

状態次元・表現精度などに制約される保持能力。有限精度の固定状態から任意の長さの全履歴を完全に復元できるとは限らない。

第3段階追加語の基礎資料：[原著論文](https://arxiv.org/html/2312.00752v2)。各語の利用条件と主張の根拠はレビュー資料の対応表で区別する。

<span id="math-resources"></span>

### 計算資源・最適化

<span id="scaling-law"></span>

#### スケーリング則（Scaling Law）

規模の変化に対する損失などの経験的関係。LLMでモデル数・トークン数・予算の配分を近似する。実験条件と範囲に依存し、普遍的な能力保証ではない。

<span id="power-law"></span>

#### べき乗則（Power Law）

変数の一定のべきで変化を表す関係。損失の項AN^(−α)などに使う。係数と指数はデータなどから推定し、外挿を無条件には正当化しない。

<span id="irreducible-loss"></span>

#### 不可約損失（Irreducible Loss）

近似損失モデルの規模を増やしても残る床Eとして扱う量。有限範囲の当てはめ値を、自然言語の真の不確実性と断定しない。

<span id="constrained-optimization"></span>

#### 制約付き最適化（Constrained Optimization）

予算などの条件を満たす変数から最良の目的値を選ぶ問題。LLMでは計算上限の下でモデル規模とデータ量を配る。連続緩和の解を、実装可能な離散構成と区別する。

<span id="flops-count"></span>

#### 浮動小数点演算回数（Floating-point Operations; FLOPs）

処理に必要な演算回数。学習や生成の仕事量を近似する。積和の数え方などを揃える必要があり、秒単位の時間を直接表さない。

<span id="flops-rate"></span>

#### 毎秒の浮動小数点演算数（Floating-point Operations per Second; FLOPS）

単位時間当たりの演算速度。理論ピークと実効値は違い、演算回数FLOPsと区別する。転送律速なら演算速度だけで時間は決まらない。

<span id="complexity"></span>

#### 計算量（Computational Complexity）

入力規模に対する演算数や記憶領域の増え方。O(n²)などは漸近的な表現で、定数やハードウェアを含むレイテンシとは別である。

<span id="memory-bandwidth"></span>

#### メモリ帯域幅（Memory Bandwidth）

毎秒に転送できるデータ量。Attentionの中間行列やKVを読む費用へ関係する。容量（保存できる量）と区別する。

<span id="latency"></span>

#### レイテンシ（Latency）

一要求の応答までの時間。最初のトークンまでか、回答完了までかを定義する。複数要求の総処理量であるスループットと同一ではない。

<span id="throughput"></span>

#### スループット（Throughput）

単位時間当たりに処理する量。トークン/秒や要求/秒など単位を揃える。高い総処理量が、一要求の短い待ち時間を保証するとは限らない。

<span id="batching"></span>

#### バッチ処理（Batching）

複数の標本や系列をまとめて計算する方法。演算器を効率よく使える場合があるが、待ち時間・メモリ・形状で効果が変わる。

基礎資料：[学習計算予算](https://arxiv.org/abs/2203.15556)。Hoffmann et al., NeurIPS 2022, §3。ハードウェア性能はN12のRoofline原典へ。

<span id="activated-parameters"></span>

#### 活性パラメータ（Activated Parameters）

一トークンの処理で使う重み。MoEでは選択Expertだけでなく共通部分・Routerも含めて定義する。全重みの保存量とは異なる。

<span id="load-balancing"></span>

#### 負荷分散（Load Balancing）

特定Expertへの割当集中を抑える考え方。補助損失を小さくすることだけで完全均等を保証しない。

<span id="expert-capacity"></span>

#### Expert受入容量（Expert Capacity）

一バッチなどでExpertが受け付ける割当の上限。超過時のドロップ・迂回などの規約で結果と費用が変わる。

<span id="expert-collapse"></span>

#### Expert集中・崩壊（Expert Collapse）

一部だけが選択され、他のExpertが十分に利用・学習されない状態。出力品質の低下と常に同義ではない。

<span id="all-to-all"></span>

#### 全相互通信（All-to-All Communication）

分散MoEなどで、各装置の表現を担当Expertの装置へ送って結果を戻す通信。全装置の全データを同じ量ずつ送るとは限らない。

第3段階追加語の基礎資料：[原著論文](https://www.jmlr.org/papers/v23/21-0998.html)。各語の利用条件と主張の根拠はレビュー資料の対応表で区別する。

### 内部表現と介入

<span id="mechanistic-interpretability"></span>

#### 機構的解釈可能性（Mechanistic Interpretability）

モデルの内部計算要素が挙動をどう作るかを調べる研究。可視化や読みやすいラベルだけで判断理由を完全に説明できるとは限らず、再構成・介入・対照条件を分けて評価する。

<span id="activation"></span>

#### 活性化（Activation）

ある入力を処理した際に、ニューロンや層から得られる値・ベクトル。学習によって保存された重みとは異なり、入力や位置によって変わる。

<span id="feature-representation"></span>

#### 特徴表現（Feature Representation）

入力の性質や計算中の情報に対応付けて調べる内部表現。特徴が単一ニューロンと一対一に対応するとは限らず、人間の概念名を付けたこと自体は因果的な証明ではない。

<span id="superposition"></span>

#### 重ね合わせ（Superposition）

複数の特徴を、それらの数より少ない次元の方向へ重ねて表す考え方。特徴の疎性などの条件で復元しやすさが変わる。量子状態の重ね合わせと同じ理論を意味しない。

<span id="sparse-autoencoder"></span>

#### 疎な自己符号化器（Sparse Autoencoder, SAE）

入力表現を少数の活動する成分で符号化し、その成分から元の表現を近似的に復元するモデル。再構成誤差と疎性の両方を調べる。L1罰則やTop-kなど複数の学習方式がある。

<span id="dictionary-decoder"></span>

#### 復号辞書（Decoder Dictionary）

符号の各成分を元の表現空間のベクトルへ対応付ける行列。列の尺度と符号の尺度には自由度があり、疎性罰則を比較する際は列の正規化などの条件が必要となる。

<span id="activation-patching"></span>

#### 活性化置換（Activation Patching）

指定した入力での内部値を、対照入力から得た値へ置換し、下流の出力変化を測る介入。何を置換するか、対照、評価指標に依存する証拠であり、全状況の原因を一意に確定する手段ではない。

<span id="circuit-analysis"></span>

#### 回路解析（Circuit Analysis）

ある挙動に関係する内部要素と接続の計算を調べる。相関した要素の一覧とは異なり、除去・置換などの介入と対照を通じて仮説を評価する。

### 計算モデルと資源

<span id="formal-language"></span>

#### 形式言語（Formal Language）

有限の記号集合から作る有限列の集合の一部。対象列がその集合に属するかという判定問題を、入力長一般について定義できる。自然言語の意味理解と同義ではない。

<span id="finite-automaton"></span>

#### 有限オートマトン（Finite Automaton）

有限個の状態、入力記号ごとの遷移、初期状態などを持つ計算モデル。入力を読みながら状態を更新する。無制限に増やせる記憶領域を備えるチューリング機械とは区別する。

<span id="computational-complexity"></span>

#### 計算複雑性（Computational Complexity）

問題を解くのに必要な時間、空間、回路の深さなどを入力長との関係で調べる分野。特定ハードウェアで測った実行時間やモデルの正答率とは異なる。

<span id="turing-completeness"></span>

#### チューリング完全性（Turing Completeness）

指定した資源の拡張を許した計算モデルで、チューリング機械を模擬できる性質。有限の実機で任意の問題を短時間で解けることや、学習できることを保証しない。

<span id="threshold-circuit"></span>

#### しきい値回路（Threshold Circuit）

しきい値判定を行うゲートなどを接続した計算モデル。深さ、ゲート数、一様性の条件を指定して計算能力を比較する。定数深さのしきい値回路と、AND・ORだけの回路は同じではない。

<span id="numerical-precision"></span>

#### 数値精度（Numerical Precision）

数をどの形式とビット数で区別して表すかという計算条件。任意精度の理論、固定精度の実装、入力長とともに増える精度は区別する。丸め規則も結果に影響する。

### 記号推論と形式的検証

<span id="neural-symbolic"></span>

#### 神経記号推論（Neural-Symbolic Reasoning）

ニューラルネットワークによる候補生成や探索の誘導と、記号で定めた表現・規則による推論を組み合わせる考え方。構成は一つではなく、生成と検査の責務を明示する必要がある。

<span id="propositional-logic"></span>

#### 命題論理（Propositional Logic）

真または偽を取る命題と、否定・論理積・含意などの演算を扱う論理。古典論理では含意P→Qは¬P∨Qとして評価し、因果関係を直接表すわけではない。

<span id="predicate-logic"></span>

#### 述語論理（Predicate Logic）

対象領域、対象についての述語、すべて・存在するなどの量化を扱う論理。真偽を評価するには対象領域と各記号の解釈を指定する。

<span id="formal-system"></span>

#### 形式体系（Formal System）

使用できる式の構文、公理、推論規則を定めた体系。形式的に証明できることと、現実についての前提が正しいことは異なる。

<span id="inference-rule"></span>

#### 推論規則（Inference Rule）

既に得られた式から、どの式を導いてよいかを指定する規則。モーダスポネンスはAとA→BからBを導く。自然な文章の続きの予測とは別の適合条件である。

<span id="proof-search"></span>

#### 証明探索（Proof Search）

目標を導くために、規則、補題、中間目標などの組合せを探す作業。候補が与えられた後の検査と費用や責務が異なる。

<span id="sat"></span>

#### 充足可能性判定（Boolean Satisfiability, SAT）

命題論理式を真にする割当てが存在するかを調べる問題。前提と結論の否定を合わせた式の充足不能性を調べれば、命題論理での帰結を確認できる。

<span id="smt"></span>

#### 背景理論付き充足可能性判定（Satisfiability Modulo Theories, SMT）

算術・配列などの指定した背景理論を加えた充足可能性判定。扱う理論や断片によって決定可能性と費用が異なり、手続きがunknownを返す場合もある。

<span id="proof-assistant"></span>

#### 定理証明支援系（Proof Assistant）

形式的な命題と証明を構築・検査するシステム。自動探索やAIの候補生成を利用しても、検査カーネル、公理、形式化の妥当性を保証の条件として確認する。

<span id="soundness"></span>

#### 健全性（Soundness）

指定した体系で導ける式が、その意味論でも前提からの帰結となる性質。証明規則、意味論、実装の範囲を特定して使う。

<span id="completeness"></span>

#### 完全性（Completeness）

指定した意味論での帰結を、採用した証明体系で導ける性質。一般の入力に必ず停止する判定手続きがあることとは異なる。チューリング完全性とも別の概念である。

<span id="decidability"></span>

#### 決定可能性（Decidability）

対象とする問題のすべての入力に対し、有限時間で正否を返すアルゴリズムが存在する性質。証明がある場合だけ探索が停止する半決定可能性とは区別する。

<span id="counterexample"></span>

#### 反例（Counterexample）

一般的な主張や帰結を成立させない具体的な例。論理的帰結なら、前提を真、結論を偽にする解釈である。有限テストで反例が見つからないことは一般の証明ではない。

追加語の基礎資料：[疎な自己符号化器](https://arxiv.org/html/2406.04093v1)、[Transformerの計算モデル](https://aclanthology.org/2023.tacl-1.31/)、[Lean公式の命題と証明](https://lean-lang.org/theorem_proving_in_lean4/Propositions-and-Proofs/)、[Z3公式資料](https://microsoft.github.io/z3guide/docs/logic/basiccommands/)。本文の使用条件と閲覧範囲は記事及びレビュー対応表で区別する。

### 似ている用語を読み分ける

|組|区別する点|
|---|---|
|報酬／累積報酬|一時点の評価／将来分の割引和|
|報酬／損失|大きくしたい評価／小さくしたい誤差。目的を変換する場合は符号・尺度を明示|
|方策／モデル|行動の選択分布／その分布などを計算する実装|
|価値／行動価値|状態からの期待収益／最初の行動も固定した期待収益|
|確率／logit|正規化済みの選ばれやすさ／変換前の実数スコア|
|エントロピー／交差エントロピー|分布自身の不確実性／目標を別の予測で表す負の対数確率の平均|
|パラメータ／ハイパーパラメータ|モデルを定める学習対象／学習率など更新や構造を決める設定|
|学習／推論|パラメータを更新／学習済みモデルを利用。利用時学習なら別に明示|
|Inference／Reasoning|予測・生成の実行全般／段階的に問題を解く処理・能力|
|FLOPs／FLOPS|演算回数／毎秒の演算数|
|レイテンシ／スループット|一要求の時間／単位時間の総処理量|
|出力分布／生成結果|候補に与える確率の規則／一回得られた具体的な出力|

### 詳細な導出へ進む

- [条件付き確率](/foundations/conditional-probability/) → [学習損失](/foundations/language-model-loss/) → [Temperature](/foundations/temperature-design/)
- [Attentionの計算](/foundations/attention-information-flow/) → [Attentionの効率](/foundations/attention-efficiency/)
- [候補生成と検証](/foundations/test-time-compute-allocation/)では、学習済みモデルを使う計算を扱う。

強化学習・選好学習や資源配分の発展記事は、公開状態に応じてAI・数理の一覧から参照する。用語の短い定義だけで、各方式の目的関数や成立条件を置き換えない。
