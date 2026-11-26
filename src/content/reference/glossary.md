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
