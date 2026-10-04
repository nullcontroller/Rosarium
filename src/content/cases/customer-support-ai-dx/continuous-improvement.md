---
summary: "誤回答や人への引き継ぎが起きた理由を調べ、次の改善へ戻す仕組みを設計します。知識不足・検索失敗・画面での離脱を分け、Knowledge・Retrieval・UI・業務のどこを直すか判断します。"
layer: publication
title: 08. 導入後にどう育てるか
kind: case
section: cases
status: published
last_updated: "2026-10-04"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [business-transformation]
tags: [Continuous Improvement, AI Evaluation, RAG, Operations]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 9
---

## 導入を完成にしない

問い合わせの内容、対象製品、Knowledge、利用者の入力は変化します。PoC時点で回答できたからといって、同じ品質が続くとは限りません。

運用では、正解率や自己解決率だけでなく、どの段階で利用者が止まり、なぜ人間へ移行し、どのKnowledgeが不足していたかを確認します。

## 観測するもの

| 観測対象 | 改善先の例 |
|---|---|
| 誤った回答・根拠逸脱 | 回答条件、Prompt、受入判定 |
| 有人対応へ移った問い合わせ | 対象範囲、停止条件、業務分担 |
| 適合する文書を取得できない | Knowledge追加、機種・版の対応付け、検索条件 |
| 追加質問が長い・離脱する | 質問順序、表現、UI、入力支援 |
| 同じ確認を人間が繰り返す | Handoff情報、担当者画面、要約 |
| 新機種・版更新 | 文書の有効期間、回帰評価データ |

観測値はAI Quality、System Quality、Business Qualityへ分けます。

| 品質層 | 確認すること | 直す可能性がある場所 |
|---|---|---|
| AI Quality | 根拠との整合、Unsupported Claim、追加質問と回答の品質 | Prompt、Context構成、生成条件 |
| System Quality | Retrieval、遅延、失敗、状態遷移、Handoff | Index、Filter、API、Workflow、監視 |
| Business Quality | 自己解決、有人負荷、再問い合わせ、離脱、顧客体験 | 適用範囲、業務分担、UI、Knowledge運用 |

一つの数値へ集約しないのは、例えば回答品質が高くても、追加質問が長く離脱が増えれば業務価値が出ないためです。逆に自己解決率だけを上げると、停止すべき問い合わせまで回答する危険があります。

<div data-case-diagram="support-continuous-improvement"></div>

## 失敗を分類して改善する

回答できなかった問い合わせを、すぐKnowledge不足と決めつけません。原因は次のように分けられます。

- 必要な文書が存在しない
- 文書はあるが機種・版・公開属性が不足している
- 検索条件や分類が適切でない
- 追加質問で必要なContextを得られていない
- 回答生成が根拠を正しく利用していない
- そもそも人間が扱うべき問い合わせである

原因によって、改善先はKnowledge、Retrieval、Dialogue、UI、業務プロセスへ分かれます。モデル変更だけで直そうとすると、失敗の所在が見えなくなります。

## 変更単位と責任者を分ける

| Failureの所在 | 主な変更 | 受入確認 |
|---|---|---|
| Knowledge不足・期限切れ | 文書追加、版・公開状態の修正 | 対象条件で正しい根拠だけを取得できるか |
| Retrieval不良 | Filter、検索式、Ranking、Chunkの修正 | 既存の正常ケースを落とさず順位が改善したか |
| Generation逸脱 | Context、Prompt、出力制約の修正 | 根拠外の主張がなく、引用を追跡できるか |
| UX離脱 | 質問順序、説明、入力支援の修正 | 必要情報を得ながら負担を増やしていないか |
| Handoff不良 | Packet、担当者画面、状態遷移の修正 | 調査を続きから再開できるか |
| 適用範囲の誤り | 業務分担、停止条件の修正 | 自己解決と専門判断の境界が妥当か |

## 同じ条件で再評価する

改善後は、失敗した問い合わせを評価データへ加え、同じ条件で再実行します。自己解決範囲を広げる場合も、既存の安全な回答が壊れていないかを回帰評価します。

変更は、モデル、Prompt、Knowledge、Index、業務ルール、UIを一つの版として記録します。どの組合せで評価したかを残さなければ、改善後の差分や問題発生時の切戻しを説明できません。評価を通過した変更だけを展開し、停止漏れや高影響の回帰があれば適用範囲を戻します。

Design、Use、Observe、Evaluate、Improveを循環させることで、QAシステムを導入プロジェクトから継続的な業務改善へ変えます。これは[Lifecycle / Operations](/Rosarium/ai-design/lifecycle-operations/)で扱う設計思想と同じです。

