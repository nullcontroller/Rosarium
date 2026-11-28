---
title: "03. データモデルと正本管理"
summary: "資産・価格・現金・目標・予定・履歴の意味を分け、複数端末から利用するデータの正本、入力検証と移行時の照合を設計する。"
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
order: 3
---

## この章の問い

複数端末から利用するシステムで、データの正本をどう維持するか。

## 端末が増えても、金融データの正本は増やさない

WindowsとAndroidで別々に資産データを持つと、数量・予定・価格が異なる状態で編集され得る。資産管理アプリAはWindows PCを唯一の正本保持サーバーとし、画面にはサーバーが検証・計算した結果を返す。編集の確定にはサーバーへの接続を必要とし、端末間の状態同期をサーバー上の保存処理へ集約する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/data-model-light.svg" aria-label="正本を構成する論理モデルを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/data-model-light.svg" alt="正本を構成する論理モデル。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/data-model-dark.svg" aria-label="正本を構成する論理モデルを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/data-model-dark.svg" alt="正本を構成する論理モデル。" width="480" height="600" loading="lazy" /></a>
  <figcaption>正本を構成する論理モデル。</figcaption>
</figure>

資産と保有明細は識別子で対応し、価格には単位・基準日・出典・取得時刻を持つ。現金、目標、予定は評価額と役割が異なり、履歴は確定時点の値と出典を保持する。この関係を基に、保存する値と参照する値を区別する。

## JSONとMarkdownをどう使い分けるか

JSONは数量・設定・履歴等の構造化データ、Markdownは方針などの文章を担う。通常運用の正本はこれらのファイルで構成する。旧SQLiteやシート評価関連の処理は、移行時の照合と互換性を担う。

長期予測の設定と単年ストレス設定は別に保持する。前者の年率と入金を後者へ無条件に流用すると、異なる問いに同じ仮定を当てはめてしまう。ジョブの進行・再試行・診断ログ等のランタイム状態も、利用者が編集する金融データとは分離する。

|情報|正本と責務|混同しない対象|
|---|---|---|
|保有・現金・目標・予定|PC上の検証対象データ|ブラウザーの表示状態|
|価格系列|単位・日付・出典付きの外部観測値|約定値・口座の公式残高|
|日次・月次履歴|確定値と元データ時点|現在値から再構成した過去|
|予測・ストレス|互いに独立した仮定|実績と将来の保証|
|ジョブ状態|未完了対象や次回試行|金融取引の発生事実|

## 画面とサーバーの境界

フロントエンドは入力、一時編集、表示整形、明示保存を担う。選択画面やスクロール位置等の閲覧状態はlocalStorageに保持できるが、資産の正本をそこへ置かない。未保存の入力は一時状態なので、端末を終了する前に保存の完了を確認する必要がある。

バックエンドは有限数値、型、識別子の参照先、通貨・価格単位、業務条件を検証する。画面だけのチェックでは、別端末や古い要求から不整合を持ち込めるためである。検証規則はPythonの業務コードとして持ち、入力項目ごとの型と業務条件をそこで確認する。

ファイルは人が読め、保存世代や移行前後を照合しやすい。一方、参照整合性・集計・競合・容量管理をDB製品へ委ねられない。そのため、JSONの形式とは別に、検証と保存を一体で行う手順を設計する。次章ではその確定点を説明する。

## 移行時には計算の意味を照合する

旧データからの移行では、数量や価格だけでなく、表示単位、予定の扱い、旧式と現行式の差を確認する。過去の比較値を最新価格から作り直さず、根拠が不明な記録は不明のまま扱う。移行元と移行後の値を照合し、旧式と現行式で結果が異なる場合は、その差の理由を確認する。

数量、価格、計算式の対応を確認することで、画面が表示できるかだけでなく、移行前後で管理している値の意味が保たれているかを評価する。

## 次の論点

[第4章：排他制御と保存の整合性設計](/cases/asset-management-app-a-architecture/persistence/)へ進む。
