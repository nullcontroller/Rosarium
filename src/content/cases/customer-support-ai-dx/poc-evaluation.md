---
summary: "本格開発前のPoCで誤検索と誤自動回答を発見し、検索対象の適格性と回答許可を別々に制御する方式へ改善します。再検証に基づく方式判断を要約し、評価値・検証経緯・効果試算は補完記事へつなぎます。"
layer: publication
title: 03. PoCによる方式の検証
kind: case
section: cases
status: published
last_updated: "2026-10-18"
entry_points: [ai, dx]
primaryCategory: continuous-value
secondaryCategories: [system-transformation]
tags: [PoC, AI Evaluation, RAG, 業務成立性]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 4
---

## 本格開発前に方式の成立性を確かめる

顧客向けQAを新規開発するに当たり、本格開発前にPoCを行い、採用方式が業務要求を満たし得るかを確認しました。  
追加質問で必要な情報を集め、適合する文書から回答を作り、専門判断や根拠不足では担当者へ引き継げるかを検証する構成です。  
ここで示すPoCの経過と評価は検証シナリオ内のものであり、本番運用で測定された成果とは区別します。

## 二つの問題から、採用方式を見直す

**初回PoCでは定型問い合わせの自動回答可能率が目標に届かず、専門判断案件への誤自動回答も発生しました。**  
類似する別機種の文書を回答根拠に使う問題と、文書があれば回答してよいと扱う問題を切り分け、初期方式の制御を見直しました。

| 問題 | 方式上の原因 | 設計判断 |
| --- | --- | --- |
| 類似する別機種の文書を回答根拠に使う | 意味の近さだけでは対象条件の一致を保証できない | 機種・環境・版数のメタデータで検索対象を絞ってから検索する |
| 専門判断が必要な問い合わせにも自動回答する | 根拠文書があることを回答の許可と取り違える | 回答項目の自動回答可否・適用条件・専門判断条件を回答前に照合する |

**検索対象の適格性と、自動回答の許可は別々に制御します。**  
取得できる文書の範囲と顧客へ回答してよい範囲を分け、生成AIの回答能力だけへ判断を委ねない方式へ改善しました。

## 再検証から方式の採用を判断する

改善後は、適合する文書を取得できるか、定型問い合わせへ回答できるか、専門判断・根拠不足時に停止して引き継げるかを再検証しています。  
**再検証で二段階制御の有効性を評価し、本格開発へ進める方式と判断しました。**  
再検証の対象範囲と評価値、月間工数への試算は、以下の補完記事で詳しく示します。

<span id="システム方式の成立性を判断する"></span>
<span id="検証シナリオの初期評価と原因分析"></span>
<span id="二つの制御を併用した再検証"></span>
<span id="別の評価系列一連の処理の自動回答可能率7296"></span>
<span id="pocの結果から求める業務効果の試算"></span>
<span id="動いただけでは採用できない"></span>
<span id="1-根拠文書の検索"></span>
<span id="2-対話による必要情報の取得"></span>
<span id="3-根拠に基づく回答生成"></span>
<span id="4-業務上の受入判断"></span>
<span id="1-retrieval"></span>
<span id="2-dialogue--context"></span>
<span id="3-generation"></span>
<span id="4-business-acceptance"></span>

[PoC詳細：1,000件の検証シナリオ・失敗分析・再検証結果・業務効果の試算](/evaluation-hitl/customer-support-qa-poc/)で、評価対象と数値の意味を確認できます。  
システム内での条件照合は[責任境界](/cases/customer-support-ai-dx/responsibility-boundary/)、資料の整備は[参照資料の設計](/cases/customer-support-ai-dx/knowledge-design/)へ進んでください。
