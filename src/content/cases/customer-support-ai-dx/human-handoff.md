---
summary: "会話履歴、機種、環境、エラー、確認済み事項、検索結果、参照文書を失わず、AIから人間へ対応を継続する設計を示す。"
layer: publication
title: 07. AIから人間へどう引き継ぐか
kind: case
section: cases
status: published
last_updated: "2026-10-12"
entry_points: [ai, dx]
primaryCategory: business-transformation
secondaryCategories: []
tags: [HITL, Human Handoff, UX, Workflow]
published_at: "2026-09-28"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium
series: customer-support-ai-dx
series_title: 生成AI / RAGによる顧客サポートDX
order: 8
---

## 「分からなければ人間へ」だけでは足りない

AIが回答できないときに有人窓口を案内するだけでは、顧客は問い合わせを最初から説明し直すことになります。  
担当者も長い会話履歴を読み直し、どこまで確認済みかを探さなければなりません。

この状態では、AIとの対話がそのまま追加負担になります。  
HITLを成立させるには、対応の主体だけでなく、途中まで集めたContextを引き継ぐ必要があります。

<span id="引き継ぐ情報"></span>
<span id="handoff-packetを契約として定義する"></span>

## 引継ぎ情報と対応の再開位置

引継ぎ内容を会話ログの添付にせず、担当者が次の判断を始められる構造へします。

引継ぎ情報はAIが作る要約だけでは成立しません。  
機種ID、文書ID、版、停止理由のような構造化項目はシステムが保持し、要約はそれらを読む補助として生成します。

<div data-case-diagram="support-human-handoff"></div>

<div data-case-diagram="support-handoff-information"></div>

## 担当者向け画面

長い対話をそのまま表示するだけでなく、「確認済み情報」と「追加確認が必要な情報」を分けます。  
対象機種、接続方法、エラー、実施済みの対処、参照文書を一覧できれば、担当者は判断を再開する位置を把握できます。

AIの要約だけに依存せず、元の会話と参照文書へ戻れることも必要です。  
要約は入口であり、判断根拠そのものではありません。

担当者は引継ぎを受けた後、AIの回答を承認するだけではありません。  
追加調査、別部門への照会、回答、Knowledge更新候補の登録のいずれへ進むかを判断します。

担当者が判断を終えた結果は、顧客対応の記録と改善データの両方へ戻します。

## 顧客側の体験

顧客側にも「これまでに確認した内容を担当者へ引き継ぎました」と示します。  
引継ぎが見えなければ、同じ説明を求められる不安が残るからです。

AIから人間への移行は、自己解決できなかった後の退避先ではありません。  
低リスクな自己解決と専門対応を一つのサービスとして接続する、主要なWorkflowです。

Handoffの品質は、転送件数ではなく、担当者がどこから調査を再開できたか、顧客へ同じ説明を求めたか、根拠と停止理由を追跡できたかで評価します。  
これを次章の継続改善で観測対象にします。
