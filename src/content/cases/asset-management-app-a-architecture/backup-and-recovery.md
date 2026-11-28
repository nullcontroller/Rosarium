---
title: "05. データ保全とバックアップ"
summary: "毎月末に外付けHDDへ自動バックアップし、保存成功後に最新3回分を残す。データ保全、容量管理、手作業削減の関係を説明する。"
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
order: 5
---

## この章の問い

日常的な手動作業を増やさず、資産データの保全とバックアップ容量の管理をどう続けるか。

## 月末の自動バックアップ

継続して管理している資産データを保全するため、毎月末に外付けHDDへ自動バックアップする運用とした。毎回手動でコピーする作業を減らし、月次の管理にデータ保全を組み込んだ。

## 最新3回分を保持する

バックアップは最新3回分を保持し、それより古いものを自動削除する。保存数を制限することで、容量が増え続けることと、古い保存物を手動で整理する作業を抑える。

古いバックアップを削除するのは、新しいバックアップの保存成功後とした。保存が失敗した場合に、既存の復旧元まで先に失わないためである。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/monthly-backup-light.svg" alt="月末に外付けHDDへバックアップし、保存成功後に最新3回分を残す。" width="480" height="600" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/monthly-backup-dark.svg" alt="月末に外付けHDDへバックアップし、保存成功後に最新3回分を残す。" width="480" height="600" loading="lazy" />
  <figcaption>月末に外付けHDDへバックアップし、保存成功後に最新3回分を残す。</figcaption>
</figure>

月末の自動保存と、保存成功後の世代整理を組み合わせ、保全を続けながら日常の手作業と容量の増大を抑える方式にした。

## 次の論点

[第6章：生成AIへの開発管理の委任](/cases/asset-management-app-a-architecture/development-management/)へ進む。
