---
title: "04. 収支管理と入力業務の設計"
summary: "銀行APIを使わず収入と利用金額の差額を管理する。固定額を登録し、変動額を月末に入力する業務と入力忘れの通知を説明する。"
layer: "publication"
kind: "case"
section: "cases"
case_context: "personal"
case_specialty: "システム方式設計・システムアーキテクチャ"
status: "published"
public: true
lifecycle: "active"
published_at: "2026-11-28"
last_updated: "2026-11-28"
entry_points: ["ai"]
tags: ["個人開発", "システム方式設計", "運用設計"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 4
---

## この章の問い

銀行APIを使わず収支を把握するために、繰り返し登録する情報と、毎月入力する情報をどう分けたか。

## 銀行APIの代わりに、収支を管理する

銀行APIによる残高取得は採用せず、毎月の収入と利用金額との差額によって収支を管理する方式を選んだ。外部連携を増やすよりも、把握したい収支と、そのために必要な情報を決めることにした。

## 固定額を登録し、変動額だけを月末に入力する

毎月のカード利用金額を固定額と変動額に分けた。固定額はあらかじめ登録して再利用し、変動額は毎月末に私が入力する。

固定額まで毎回入力する作業を避け、その月に変わる情報だけを確認・入力する業務にした。入力忘れを防ぐため、月末に未入力ならスマートフォンへ通知する機能も設けた。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/monthly-input-light.svg" alt="固定額は事前登録、変動額は月末入力とし、収入と利用金額の差額を確認する。" width="480" height="600" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/monthly-input-dark.svg" alt="固定額は事前登録、変動額は月末入力とし、収入と利用金額の差額を確認する。" width="480" height="600" loading="lazy" />
  <figcaption>固定額は事前登録、変動額は月末入力とし、収入と利用金額の差額を確認する。</figcaption>
</figure>

## 人間に残す作業を限定する

月末には通知や入力状況を確認し、その月の変動額を入力して、収入と利用金額の差額を把握する。固定額に変更がある場合は登録内容を見直す。

すべての入力をなくすより、繰り返し使う情報は登録し、変動する情報だけを人間が確認する方式を選んだ。入力する内容と時点を決めることが、日常の収支管理を簡素化するうえで重要だった。

## 次の論点

[第5章：データ保全とバックアップ](/cases/asset-management-app-a-architecture/backup-and-recovery/)へ進む。
