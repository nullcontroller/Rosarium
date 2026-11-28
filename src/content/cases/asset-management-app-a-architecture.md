---
title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
summary: "個人資産管理の負担を減らす目的から対応範囲・費用・保守性・セキュリティを整理し、方式と運用を決めた事例。生成AIを活用した開発管理と品質保証も扱う。"
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
order: 0
---

## このBookで扱うこと

本Bookでは、私が個人利用を目的として開発した資産管理Webアプリケーションを、資産管理アプリAと呼ぶ。Excelでの管理を出発点に、システム化の目的、対応範囲、方式、運用を決め、ChatGPTとCodexを活用して実現した過程を説明する。

追加費用と日常の管理負担を抑えるため、公表価格の夜間取得、収支と月末入力、データの保全を組み合わせた。金融取引を対象外とし、個人利用に必要な管理・計算へ責務を限定した設計と、その実現を支えた開発管理・レビューを扱う。

## 全7章の構成

1. [システム化の背景と対象範囲の定義](/cases/asset-management-app-a-architecture/requirements/)
2. [システム全体構成と技術選定](/cases/asset-management-app-a-architecture/architecture/)
3. [資産価格の取得方式](/cases/asset-management-app-a-architecture/market-data/)
4. [収支管理と入力業務の設計](/cases/asset-management-app-a-architecture/cashflow-and-input/)
5. [データ保全とバックアップ](/cases/asset-management-app-a-architecture/backup-and-recovery/)
6. [生成AIへの開発管理の委任](/cases/asset-management-app-a-architecture/development-management/)
7. [レビュー方式と品質保証](/cases/asset-management-app-a-architecture/review-and-quality/)
