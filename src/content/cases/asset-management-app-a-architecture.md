---
title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
summary: "資産管理アプリAを題材に、システム化対象の選定から要求定義、方式設計、生成AIを活用した開発管理、品質保証、運用保守までを説明する。"
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

## このBookで扱うこと

本Bookでは、私が個人利用を目的として開発した資産管理Webアプリケーションを、資産管理アプリAと呼ぶ。資産管理に伴う日常的な作業を減らすために開発した本システムを題材に、要求定義、システム方式設計、生成AIを活用した開発管理、品質保証及び運用保守を説明する。

追加費用と日常の運用保守負担を抑える方針を基に、システム化する範囲を決めた。確定した範囲では、有料サービスを利用せず、場中の価格更新を行わない条件の下で、必要な機能とデータの整合性を確保する構成を設計した。

## 全12章の構成

1. [システム化の背景と対象範囲の定義](/cases/asset-management-app-a-architecture/requirements/)
2. [システム全体構成と技術選定](/cases/asset-management-app-a-architecture/architecture/)
3. [データモデルと正本管理](/cases/asset-management-app-a-architecture/data-model/)
4. [排他制御と保存の整合性設計](/cases/asset-management-app-a-architecture/persistence/)
5. [外部市場情報の取得方式](/cases/asset-management-app-a-architecture/market-data/)
6. [金融計算と業務データの整合性](/cases/asset-management-app-a-architecture/financial-consistency/)
7. [定期処理と状態管理](/cases/asset-management-app-a-architecture/scheduled-jobs/)
8. [アクセス制御とPWA設計](/cases/asset-management-app-a-architecture/access-and-pwa/)
9. [バックアップと障害復旧](/cases/asset-management-app-a-architecture/backup-and-recovery/)
10. [生成AIへの開発管理の委任](/cases/asset-management-app-a-architecture/development-management/)
11. [レビュー方式と品質保証](/cases/asset-management-app-a-architecture/review-and-quality/)
12. [運用保守と設計上のトレードオフ](/cases/asset-management-app-a-architecture/operations-and-tradeoffs/)
