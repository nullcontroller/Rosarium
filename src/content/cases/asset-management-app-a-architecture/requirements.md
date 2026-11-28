---
title: "01. システム化の背景と要求定義"
summary: "個人資産管理において何をシステム化し、何を対象外とするか。 採用方式、その理由と検証範囲・適用限界を整理する。"
layer: "publication"
kind: "case"
section: "cases"
case_context: "personal"
case_specialty: "システム方式設計・システムアーキテクチャ"
status: "draft"
public: false
lifecycle: "active"
last_updated: "2026-11-28"
entry_points: ["ai"]
tags: ["個人開発", "システム方式設計", "データ整合性"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリのシステム方式設計 ― 低コスト・低保守負担を目指した設計"
order: 1
---

## この章の問い

個人資産管理において何をシステム化し、何を対象外とするか。

## 管理するためのシステムに、管理時間を奪われない

私は以前からExcelで個人の資産管理を行っていた。カスタマイズが容易で、自分の管理方法に合わせて構成を変えられるためである。Codex登場以前から生成AIを利用してExcelをカスタマイズしていたが、従来の運用には手作業が残っていた。

この管理をWebアプリへ発展させ、ChatGPTとCodexを活用して5日間で開発した。5日間は経過した開発期間であり、実作業工数や従来方式との生産性比較ではない。開発管理の委任は既存の[開発プロセスの事例](/cases/ai-development-management/)で扱い、本Bookでは要求からシステム方式を選ぶ判断を扱う。

本Bookでは、私が個人利用を目的として開発した資産管理Webアプリケーションを、資産管理アプリAと呼ぶ。

最上位の目標は、日常的な手動メンテナンスを極力不要にすることである。資産を管理するために、資産管理システムの管理へ時間を費やしていては本末転倒になる。ただし、完全なメンテナンスフリーを達成したという主張ではない。

## 機能を増やす前に、用途と制約を決める

必要な機能は、資産評価、目標配分との比較、予定入出金、日次・月次の記録、長期予測とストレスの試算、バックアップである。単一利用者がWindowsとAndroidから同じ資産状態を見ることを想定する。金融機関の公式残高や会計記録を置き換えるものではない。

有料サービスを利用しないことと、場中の価格更新を行わないことを設計制約とした。判断に必要なのは、管理用途に見合う日付と出典の分かる評価である。リアルタイム性を求めれば、契約・取得頻度・欠損対応・可用性の要求が増える。この範囲では終値・基準価額・参考為替を採用し、注文執行や短期売買の判断基盤を目指さない。

|要求|選択した方式|引き受ける制約|
|---|---|---|
|複数端末で同じ状態を見る|PC上に正本を一つ置く|PC停止中は利用を制限される|
|有料サービスを使わない|公式公表データと既存環境を利用|公表形式や利用条件の変更へ追従が必要|
|日常作業を減らす|サーバー内ワーカーと永続ジョブ状態|停止中の時刻保証はできない|
|データの正確性|単位・基準日・revision・世代保存を検証|検証規則の実装と保守が必要|
|復旧可能性|外部媒体へ検証済みZIPを保存|PCと媒体の同時被災等は別課題|
|依存を抑える|標準ライブラリと共通Web UI|枠組みが提供する機能も自前で担う|

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/requirements-light.svg" aria-label="要求から方式選択へを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/requirements-light.svg" alt="要求から方式選択へ。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/requirements-dark.svg" aria-label="要求から方式選択へを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/requirements-dark.svg" alt="要求から方式選択へ。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>要求から方式選択へ。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

## 対象外を決めることも要求定義である

自動売買、送金、証券注文、銀行口座への自動ログイン、利用者一般への公開、複数人の権限管理は対象外である。場中情報や相場予測の精度競争、完全なオフライン編集同期も求めない。これらを加えるなら、今回とは別の要求・信頼境界・検証が必要になる。

有料サービスを使わないことは総費用ゼロと同義ではない。既存PC、電力、通信、外部媒体、保守時間は必要であり、第三者サービスの将来の料金や継続提供も保証されない。

## 確認できたことと、評価の限界

機能と方式の実装状態は技術引継ぎ資料、上位要求と開発背景は著者提供情報を根拠とする。保守時間、作業削減率、代替製品との費用比較は測定していない。本Bookでは効果を設計上の期待と実装された機構に分けて説明する。商用金融サービスの監査・可用性・法令対応を満たす設計として一般化しない。

## 次の論点

[第2章：システム全体構成と技術選定](/cases/asset-management-app-a-architecture/architecture/)へ進む。
