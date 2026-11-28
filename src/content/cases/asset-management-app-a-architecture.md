---
title: "個人資産管理Webアプリのシステム方式設計 ― 低コスト・低保守負担を目指した設計"
summary: "資産管理アプリAの要求から、PC集約・正本管理・価格取得・金融計算・自動処理・アクセス制御・復旧の方式を導く全10章。低保守負担を目指す選択と代償、未確認事項を整理する。"
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
order: 0
publication_format: "book"
---

## 管理負担を増やさないための方式設計

本Bookでは、私が個人利用を目的として開発した資産管理Webアプリケーションを、資産管理アプリAと呼ぶ。

有料サービスを利用せず、場中更新を行わず、日常の手動メンテナンスを極力減らす。その要求を起点に、PCへの集約、ファイルによる正本、定期処理、Network OnlyのPWA、外部バックアップをどう選んだかを全10章で説明する。完全なメンテナンスフリーや総費用ゼロを実現したという報告ではない。

Excelを生成AIでカスタマイズしていた管理をWebアプリへ発展させ、ChatGPTとCodexを利用して5日間で開発した。開発期間は工数・生産性の比較値ではない。AIへの委任は[既存の開発管理事例](/cases/ai-development-management/)で扱い、本Bookはシステム方式に責務を限定する。

## 読み方と事実の区分

|区分|本Bookでの意味|
|---|---|
|実装済み|技術引継ぎ資料で確認された機構。今回の本体実機検証を意味しない|
|設計意図|著者の要求と、方式を採用する目的|
|技術的考察|一般仕様に基づく比較・条件の整理。比較実験ではない|
|未確認|実稼働設定や資料間で確認が残る事項|
|改善候補|未採用・未実装の将来の検討方向|

技術情報はレビュー済み引継ぎ資料を根拠とし、一般仕様は各章の一次資料で補う。金融データ・保有商品・口座・内部接続情報は掲載せず、計算例はすべて架空である。原本、実画面、個人ログ、バックアップは公開資産に含めない。

## 全10章の論点

1. [システム化の背景と要求定義](/cases/asset-management-app-a-architecture/requirements/)：個人資産管理において何をシステム化し、何を対象外とするか。
2. [システム全体構成と技術選定](/cases/asset-management-app-a-architecture/architecture/)：個人利用という規模に対して、必要十分なシステム構成をどう選択するか。
3. [データモデルと正本管理](/cases/asset-management-app-a-architecture/data-model/)：複数端末から利用するシステムで、データの正本をどう維持するか。
4. [排他制御と保存の整合性設計](/cases/asset-management-app-a-architecture/persistence/)：ファイルベースの永続化で、競合と保存途中の障害にどう対応するか。
5. [外部市場情報の取得方式](/cases/asset-management-app-a-architecture/market-data/)：有料サービスを利用せず、資産管理に必要な価格情報をどう取得するか。
6. [金融計算と業務データの整合性](/cases/asset-management-app-a-architecture/financial-consistency/)：実績、予定、目標、予測を混同せず、金融データの意味をどう維持するか。
7. [定期処理と状態管理](/cases/asset-management-app-a-architecture/scheduled-jobs/)：専用ジョブ管理サービスを追加せず、日常の管理作業をどう自動化するか。
8. [アクセス制御とPWA設計](/cases/asset-management-app-a-architecture/access-and-pwa/)：個人の金融情報を直接公開せず、複数端末から利用するにはどう設計するか。
9. [バックアップと障害復旧](/cases/asset-management-app-a-architecture/backup-and-recovery/)：日常的な手動バックアップを減らしながら、データの復旧可能性をどう確保するか。
10. [運用保守と設計上のトレードオフ](/cases/asset-management-app-a-architecture/operations-and-tradeoffs/)：個人利用に必要な品質を維持しながら、どこまでシステムを簡素化できるか。

## 確認保留と適用限界

積立口数の自動反映の現行運用、常設ステージング、版管理、実機・総合復旧等には確認限界が残る。既存の開発管理記事と今回の資料で「ステージング」が指す環境の違いも第10章で明示する。不明点を推測で埋めず、個人用途の方式を商用金融サービスへ無条件に一般化しない。
