---
title: "09. バックアップと障害復旧"
summary: "確定世代からのZIP作成、外部媒体での検証、一時退避と再試行、現行データを保護した復元を、一連の保全手順として説明する。"
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
order: 9
---

## この章の問い

日常的な手動バックアップを減らしながら、データの復旧可能性をどう確保するか。

## 確定世代を外部媒体へ保存する

正本の保存世代は、同じPCや媒体を失う障害へ単独では対応できない。資産管理アプリAは自動・手動を共通の外部バックアップ処理へ集約する。自動処理は月末記録後、手動は設定画面から実行し、検証済みの新方式バックアップを共通で最新3世代保持する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/backup-light.svg" aria-label="外部保存完了後に成功とするを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/backup-light.svg" alt="外部保存完了後に成功とする。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/backup-dark.svg" aria-label="外部保存完了後に成功とするを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/backup-dark.svg" alt="外部保存完了後に成功とする。" width="480" height="600" loading="lazy" /></a>
  <figcaption>外部保存完了後に成功とする。</figcaption>
</figure>

確定済み世代からスナップショット、設定、履歴等を集め、まず非公開の一時ZIPを作る。CRC、許可されたファイル名、一覧、SHA-256、JSON／Markdownの復元整合性を検証する。外部媒体の同一性を確認して一時名で保存し、読戻し検証と正式名への確定を経て成功を記録する。単にドライブ文字が同じという理由で別媒体へ保存しない。

CRCはZIP内の読取り時の破損検出に役立ち、SHA-256は期待した内容との比較に用いる。[Python ZipFile.testzip](https://docs.python.org/3.14/library/zipfile.html#zipfile.ZipFile.testzip)でZIP内のCRC等を検査し、内容の整合性は別に検証する。業務上の値の確認、バックアップの保管権限、実際の復元は、それぞれ別の確認対象となる。

## 媒体がないときは、未完了を残す

外付け未接続や権限不足の場合は一時退避ZIPを保持し、状態を永続化して再試行する。再試行は5分間隔で行い、再起動後にも保存した状態から再開する。外部保存と検証を終えるまで成功にせず、成功済み同名ZIPも内容一致を確認し、無条件に上書きしない。

新しいZIPが外部媒体で検証できた後にだけ、通常バックアップの古い世代を整理する。旧形式、復元前の保護コピー、正本保存世代まで同じ規則で削除するものではない。それらの容量管理は別の残存課題である。

## 復元も、新しい保存操作として扱う

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/restore-light.svg" aria-label="現行正本を保護して復元するを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/restore-light.svg" alt="現行正本を保護して復元する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/restore-dark.svg" aria-label="現行正本を保護して復元するを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/restore-dark.svg" alt="現行正本を保護して復元する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>現行正本を保護して復元する。</figcaption>
</figure>

利用者の確認とrevision照合後、まず現行正本を保護する。選んだZIPと内容を検証し、新しい正本世代として復元する。古いファイルを稼働中の正本へ無条件に上書きする操作ではない。起動・接続用設定がZIPに含まれる場合も、稼働先を勝手に切り替えるような自動適用は行わない。

コードのロールバックと資産データの復元は別である。画面障害のために正常な資産データまで過去へ戻すと、新しい入力を失う。逆にデータを復元しただけで起動用コード・OSタスク・接続設定が整うとも限らない。

## バックアップと復旧可能性の検証を分ける

バックアップ処理ではZIPの内容と保存先へのコピーを検証する。実際の復旧性を確認するには、外部媒体からの復元に加え、PCを失った場合の実行環境の再構築も必要になる。現時点で、実媒体からの総合復旧と復旧時間は未確認である。

独自暗号化、遠隔地への自動複製は未実装・未確認であり、同一場所のPCと媒体を同時に失う障害も別途考える必要がある。バックアップは金融情報や環境情報を含むため、保管先のアクセスと媒体の管理も必要になる。

## 次の論点

[第10章：生成AIへの開発管理の委任](/cases/asset-management-app-a-architecture/development-management/)へ進む。
