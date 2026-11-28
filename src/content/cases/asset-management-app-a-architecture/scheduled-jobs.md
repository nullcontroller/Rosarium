---
title: "07. 定期処理と状態管理"
summary: "OSによる起動とサーバー内ワーカーを分担し、価格取得・記録・定例処理の完了状態、再試行、停止後の再開を管理する。"
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
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 7
---

## この章の問い

専用ジョブ管理サービスを追加せず、日常の管理作業をどう自動化するか。

## ブラウザーを開かなくても処理を進める

画面を開くことを価格更新の起点にすると、利用端末や操作回数に処理が依存する。資産管理アプリAはWindowsタスクスケジューラとPowerShellで起動を管理し、定期処理はPythonサーバー内ワーカーが行う。追加のジョブキューや別の常駐製品は採用していない。

起動監視と業務ジョブは責務が違う。前者は多重起動防止、ヘルス確認、異常終了時の回数制限付き再起動を担い、後者は価格・記録・定例処理の状態を扱う。[Windowsタスクスケジューラ](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page)のトリガーは処理を開始する条件である。金融データへの反映が完了したかは、アプリ側の処理済み記録で確認する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/scheduled-jobs-light.svg" aria-label="未完了を保存して処理を追跡するを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/scheduled-jobs-light.svg" alt="未完了を保存して処理を追跡する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/scheduled-jobs-dark.svg" aria-label="未完了を保存して処理を追跡するを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/scheduled-jobs-dark.svg" alt="未完了を保存して処理を追跡する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>未完了を保存して処理を追跡する。</figcaption>
</figure>

## 時刻より、何が終わったかを保存する

日次価格取得は04:00日本時間のバッチとし、未取得の対象だけを最低30分間隔で再試行する。ジョブは対象日、対象系列、試行・未完了状態等を永続化し、再起動後にも追跡する。取得日と価格基準日は別で、休場や商品ごとの公表周期を考慮する。臨時休場など、保存した営業日情報だけで判断できない日については、公表された価格の基準日も確認する。

外部通信は正本保存ロック外、適用はロック内に分ける。価格ジョブの排他と金融データの排他も役割が異なる。画面更新のための状態ポーリングと、外部価格を実際に取得する処理を混同しない。

|処理|確定・確認の条件|失敗・停止時の扱い|
|---|---|---|
|日次資産記録|対象価格バッチの完了|現在値で過去日を埋めない|
|月末スナップショット|月末23:59の保存処理|補完なら元世代と時点を明示|
|定例内部残高処理|設定と対象月の処理記録|二重処理を抑制し、不明状態は確認待ち|
|予定の完了|利用者の明示確認|到来日だけで削除・実残高変更しない|
|外部バックアップ|月末記録後の共通処理|一時退避と状態から再試行|

## 停止後は保存した状態から追跡する

PC停止・スリープ中は処理できず、WakeToRunは無効としている。起動後の追跡は、指定時刻に実行したことと異なる。月末に使った最後の有効価格が、必ず当日終値を含むとも限らない。

過去の月末世代が残る場合はその世代を根拠に補完し、後日の価格で当時の値を作らない。元世代がなければ未実行・不明として扱う。対象月の処理済み記録で重複を抑制する。異常終了で処理の完了を確定できない場合は、保存済み状態との照合が必要になる。

## 自動処理と利用者の確認をつなぐ

定例処理が扱うのは、本システム内の残高や予定、処理状態である。実口座の数量は口座資料との照合を必要とする。積立口数の自動反映については、現在の運用で有効になっている範囲の確認が残っている。

自動化した処理でも、完了、不明、再試行待ちを識別できるようにする。未完了を保存し、必要な場合に利用者の判断へ戻すことが、日常の手作業を減らしながら整合性を守る条件となる。

## 次の論点

[第8章：アクセス制御とPWA設計](/cases/asset-management-app-a-architecture/access-and-pwa/)へ進む。
