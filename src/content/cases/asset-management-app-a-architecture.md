---
title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
summary: "資産管理アプリAの要求から方式設計、生成AIへの開発管理の委任、品質保証、運用保守までを全12章に統合。低コスト・低保守負担を目指す設計判断と制約を整理する。"
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
tags: ["個人開発", "システム方式設計", "データ整合性", "AI駆動開発"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 0
publication_format: "book"
---

## 個人資産管理の目的から、設計と実現をつなぐ

本Bookでは、私が個人利用を目的として開発した資産管理Webアプリケーションを、資産管理アプリAと呼ぶ。

個人資産管理という目的に対して、継続的な費用と運用保守負担を抑えるシステム方式をどう設計し、生成AIを活用してどう実現したか。これが全12章を貫く問いである。システム方式設計を主軸に、AI駆動開発はその実現手段として位置付ける。

有料サービスを利用せず、場中更新を行わず、日常の手動メンテナンスを極力減らす。その要求からPC集約、正本管理、外部取得、自動処理、復旧を選び、開発管理と品質保証、運用まで一つの事例として追う。技術数の多さ、完全な保守不要、総費用ゼロを成果として主張しない。

Excelを生成AIでカスタマイズしていた管理をWebアプリへ発展させ、ChatGPTとCodexを用いて5日間で開発した。5日間は開発期間であり、実作業工数や生産性の比較値ではない。

## 読み方と根拠の区分

|区分|本Bookでの意味|
|---|---|
|実装済み|最新技術引継ぎ資料に記録された機構。今回の本体実機再検証ではない|
|設計意図|著者の要求と選択の目的|
|技術的考察|一般仕様に基づく方式比較。比較実験とは異なる|
|未確認|資料間で確認が残る事項、実稼働設定や実機・復旧試験|
|改善候補|未採用・未実装の将来方向|

数値例は架空とし、個人の金融情報、商品、口座、接続先、原画面、個人ログやバックアップを掲載しない。引継ぎ原本も公開資産へ含めない。第2〜9章の方式・数式・図解を維持し、開発管理と品質保証を第10・11章へ統合した。

## 全12章の論点

1. [システム化の背景と要求定義](/cases/asset-management-app-a-architecture/requirements/)：個人資産管理において何をシステム化し、何を対象外とするか。
2. [システム全体構成と技術選定](/cases/asset-management-app-a-architecture/architecture/)：個人利用という規模に対して、必要十分なシステム構成をどう選択するか。
3. [データモデルと正本管理](/cases/asset-management-app-a-architecture/data-model/)：複数端末から利用するシステムで、データの正本をどう維持するか。
4. [排他制御と保存の整合性設計](/cases/asset-management-app-a-architecture/persistence/)：ファイルベースの永続化で、競合と保存途中の障害にどう対応するか。
5. [外部市場情報の取得方式](/cases/asset-management-app-a-architecture/market-data/)：有料サービスを利用せず、資産管理に必要な価格情報をどう取得するか。
6. [金融計算と業務データの整合性](/cases/asset-management-app-a-architecture/financial-consistency/)：実績、予定、目標、予測を混同せず、金融データの意味をどう維持するか。
7. [定期処理と状態管理](/cases/asset-management-app-a-architecture/scheduled-jobs/)：専用ジョブ管理サービスを追加せず、日常の管理作業をどう自動化するか。
8. [アクセス制御とPWA設計](/cases/asset-management-app-a-architecture/access-and-pwa/)：個人の金融情報を直接公開せず、複数端末から利用するにはどう設計するか。
9. [バックアップと障害復旧](/cases/asset-management-app-a-architecture/backup-and-recovery/)：日常的な手動バックアップを減らしながら、データの復旧可能性をどう確保するか。
10. [生成AIへの開発管理の委任](/cases/asset-management-app-a-architecture/development-management/)：生成AIによって実装速度が向上した環境で、人間の判断負荷をどのように抑えるか。
11. [レビュー方式と品質保証](/cases/asset-management-app-a-architecture/review-and-quality/)：AIに開発管理を委任しながら、成果物の品質と人間の最終責任をどのように維持するか。
12. [運用保守と設計上のトレードオフ](/cases/asset-management-app-a-architecture/operations-and-tradeoffs/)：個人利用に必要な品質を維持しながら、どこまでシステムを簡素化できるか。

## 確認保留と適用限界

積立口数の自動反映の現行運用、常設ステージング、版管理、実機・総合復旧等の保留を推測で解消しない。元記事の「ステージング」という呼称は、第11章で本アプリの隔離検証・本番・Rosariumの常設ステージングと区別する。個人用途の構成を商用金融サービスへ無条件に適用しない。
