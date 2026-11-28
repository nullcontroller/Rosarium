---
title: "07. 定期処理と状態管理"
summary: "専用ジョブ管理サービスを追加せず、日常の管理作業をどう自動化するか。 採用方式、その理由と検証範囲・適用限界を整理する。"
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
order: 7
---

## この章の問い

専用ジョブ管理サービスを追加せず、日常の管理作業をどう自動化するか。

## ブラウザーを開かなくても処理を進める

画面を開くことを価格更新の起点にすると、利用端末や操作回数に処理が依存する。資産管理アプリAはWindowsタスクスケジューラとPowerShellで起動を管理し、定期処理はPythonサーバー内ワーカーが行う。追加のジョブキューや別の常駐製品は採用していない。

起動監視と業務ジョブは責務が違う。前者は多重起動防止、ヘルス確認、異常終了時の回数制限付き再起動を担い、後者は価格・記録・定例処理の状態を扱う。[Windowsタスクスケジューラ](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page)のトリガー機能は起動手段であり、金融処理の成功保証そのものではない。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/scheduled-jobs-light.svg" aria-label="未完了を保存して処理を追跡するを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/scheduled-jobs-light.svg" alt="未完了を保存して処理を追跡する。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/scheduled-jobs-dark.svg" aria-label="未完了を保存して処理を追跡するを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/scheduled-jobs-dark.svg" alt="未完了を保存して処理を追跡する。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>未完了を保存して処理を追跡する。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

## 時刻より、何が終わったかを保存する

日次価格取得は04:00日本時間のバッチとし、未取得の対象だけを最低30分間隔で再試行する。ジョブは対象日、対象系列、試行・未完了状態等を永続化し、再起動後にも追跡する。取得日と価格基準日は別で、休場や商品ごとの公表周期を考慮する。取引所のあらゆる臨時休場を網羅する保証はない。

外部通信は正本保存ロック外、適用はロック内に分ける。価格ジョブの排他と金融データの排他も役割が異なる。画面更新のための状態ポーリングと、外部価格を実際に取得する処理を混同しない。

|処理|確定・確認の条件|失敗・停止時の扱い|
|---|---|---|
|日次資産記録|対象価格バッチの完了|現在値で過去日を埋めない|
|月末スナップショット|月末23:59の保存処理|補完なら元世代と時点を明示|
|定例内部残高処理|設定と対象月の処理記録|二重処理を抑制し、不明状態は確認待ち|
|予定の完了|利用者の明示確認|到来日だけで削除・実残高変更しない|
|外部バックアップ|月末記録後の共通処理|一時退避と状態から再試行|

## 停止中の時刻を取り戻したことにはしない

PC停止・スリープ中は処理できず、引継ぎ資料ではWakeToRunは無効とされている。起動後の追跡は、指定時刻に実行したことと異なる。月末に使った最後の有効価格が、必ず当日終値を含むとも限らない。

過去の月末世代が残る場合はその世代を根拠に補完し、後日の価格で当時の値を作らない。元世代がなければ未実行・不明として扱う。対象月の処理済み記録は重複抑制の機構であり、あらゆる異常終了下の完全なExactly Onceを保証するものではない。

## 未確認の自動化を実装済みとしない

積立口数の反映には資料間の確認保留が残る。コードの条件付き処理と運用上の有効化は同じではないため、本Bookでは自動登録の現行運用を確定しない。銀行・証券への注文や約定照会を、この定例処理が行うとも記述しない。

永続状態、時計を制御したテスト、重複処理試験は検証の観点として有効だが、今回のBook制作は実アプリの全テストを再実行した報告ではない。日常作業を減らすほど、未完了を残し、利用者が必要時に判断できる状態表示が重要になる。

## 次の論点

[第8章：アクセス制御とPWA設計](/cases/asset-management-app-a-architecture/access-and-pwa/)へ進む。
