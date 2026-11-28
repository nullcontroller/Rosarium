---
title: "09. バックアップと障害復旧"
summary: "日常的な手動バックアップを減らしながら、データの復旧可能性をどう確保するか。 採用方式、その理由と検証範囲・適用限界を整理する。"
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
order: 9
---

## この章の問い

日常的な手動バックアップを減らしながら、データの復旧可能性をどう確保するか。

## ZIPを作っただけでは、外部保存の成功にしない

正本の保存世代は、同じPCや媒体を失う障害へ単独では対応できない。資産管理アプリAは自動・手動を共通の外部バックアップ処理へ集約する。自動処理は月末記録後、手動は設定画面から実行し、検証済みの新方式バックアップを共通で最新3世代保持する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/backup-light.svg" aria-label="外部保存完了後に成功とするを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/backup-light.svg" alt="外部保存完了後に成功とする。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/backup-dark.svg" aria-label="外部保存完了後に成功とするを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/backup-dark.svg" alt="外部保存完了後に成功とする。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>外部保存完了後に成功とする。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

確定済み世代からスナップショット、設定、履歴等を集め、まず非公開の一時ZIPを作る。CRC、許可されたファイル名、一覧、SHA-256、JSON／Markdownの復元整合性を検証する。外部媒体の同一性を確認して一時名で保存し、読戻し検証と正式名への確定を経て成功を記録する。単にドライブ文字が同じという理由で別媒体へ保存しない。

CRCはZIP内の読取り時の破損検出に役立ち、SHA-256は期待した内容との比較に用いる。どちらも内容の業務的な正しさや秘密性を保証しない。[Python ZipFile.testzip](https://docs.python.org/3.14/library/zipfile.html#zipfile.ZipFile.testzip)の検査範囲だけで、実アプリの復旧が完了したとは判断しない。

## 媒体がないときは、未完了を残す

外付け未接続や権限不足の場合は一時退避ZIPを保持し、状態を永続化して再試行する。引継ぎ資料では5分間隔とされ、再起動後にも再開する。外部保存と検証を終えるまで成功にせず、成功済み同名ZIPも内容一致を確認し、無条件に上書きしない。

新しいZIPが外部媒体で検証できた後にだけ、通常バックアップの古い世代を整理する。旧形式、復元前の保護コピー、正本保存世代まで同じ規則で削除するものではない。それらの容量管理は別の残存課題である。

## 復元も、新しい保存操作として扱う

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/restore-light.svg" aria-label="現行正本を保護して復元するを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/restore-light.svg" alt="現行正本を保護して復元する。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/restore-dark.svg" aria-label="現行正本を保護して復元するを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/restore-dark.svg" alt="現行正本を保護して復元する。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>現行正本を保護して復元する。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

利用者の確認とrevision照合後、まず現行正本を保護する。選んだZIPと内容を検証し、新しい正本世代として復元する。古いファイルを稼働中の正本へ無条件に上書きする操作ではない。起動・接続用設定がZIPに含まれる場合も、稼働先を勝手に切り替えるような自動適用は行わない。

コードのロールバックと資産データの復元は別である。画面障害のために正常な資産データまで過去へ戻すと、新しい入力を失う。逆にデータを復元しただけで起動用コード・OSタスク・接続設定が整うとも限らない。

## バックアップと復旧可能性の検証を分ける

今回の付属検証は架空データのZIPで内容ハッシュ、復元値、破損検出を確認する。実媒体からの総合復旧、PC喪失時の環境再構築、復旧時間の測定は未実施である。実装済みのバックアップ検証があることと、どの障害でも復元可能であることは同じではない。

独自暗号化、遠隔地への自動複製は未実装・未確認であり、同一場所のPCと媒体を同時に失う障害も別途考える必要がある。原バックアップは金融情報や環境情報を含み得るため、BookやレビューZIPへ収録しない。

## 次の論点

[第10章：運用保守と設計上のトレードオフ](/cases/asset-management-app-a-architecture/operations-and-tradeoffs/)へ進む。
