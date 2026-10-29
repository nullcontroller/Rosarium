---
title: 01. 担当業務と障害調査の背景
summary: 担当範囲と障害の背景を示し、人間が持つ前提条件をCopilotへ共有する基本方針と、筆者・担当チームの役割を説明する。
layer: publication
kind: case
section: cases
status: published
published_at: "2026-10-29"
last_updated: "2026-10-29"
updated_at: "2026-10-29"
entry_points:
  - ai
tags:
  - 技術調査
  - 仮説検証
  - 情報設計
  - 責任境界
  - HITL
series: ai-technical-investigation
series_title: 生成AIによる技術調査の設計――情報、仮説、検証、責任境界
order: 1
---

## 結合評価中のクラッシュと、私が担当していた範囲

私は既存ソフトウェアの開発・保守に関わり、主としてアプリケーションから呼び出されるインターフェース層を担当していた。その先には複数の機能から利用される共通ライブラリがあり、共通ライブラリは外部ライブラリを利用していた。

外部ライブラリの更新を含む共通コンポーネントの更新後、アプリケーションの結合評価中にクラッシュが発生した。

**私が調査範囲を決める基準にしたのは、Copilotがコードを調べられるかどうかではなく、私自身がその回答をレビューできるかどうかだった。** 共通ライブラリの内部実装には詳しくなく、AIが示した修正案の妥当性や他の機能への影響を独力で評価することは難しかった。一方、自分の担当するインターフェース層であれば、コードと処理の流れを確認できる。そこで、まず自分が検証できる範囲に調査を限定し、担当外の問題については証拠と候補を整理して担当チームへ引き継ぐ方針にした。

<figure class="diagram diagram-static" id="investigation-architecture-caption" aria-label="担当範囲を説明する一般化した依存関係">
  <div role="region" tabindex="0" aria-label="依存関係と担当範囲・横スクロール対応" style="overflow-x:auto;">
    <img class="diagram-light" src="/diagrams/static/software-engineering--ai-technical-investigation-design-architecture-light.svg" alt="アプリケーションからインターフェース層、共通ライブラリ、外部ライブラリへつながる。筆者の主担当はインターフェース層。" width="360" height="470" style="min-width:360px;" />
    <img class="diagram-dark" src="/diagrams/static/software-engineering--ai-technical-investigation-design-architecture-dark.svg" alt="アプリケーションからインターフェース層、共通ライブラリ、外部ライブラリへつながる。筆者の主担当はインターフェース層。" width="360" height="470" style="min-width:360px;" />
  </div>
</figure>

## 調査に役立つ情報を集め、Copilotにも渡す

**人間が調査するときに持っている前提条件を、生成AIにもできるだけ与える**ことを基本方針にした。途中から調査に加わる人へ説明するように、背景、経緯、確認済みのこと、試した対応と結果を共有した。プロンプトを決まった形式で作ること自体を目的にはしていない。

情報を渡したことと、Copilotが人間と同じ理解に到達したことは別である。Copilotにはコード探索や原因候補の検討を任せ、私は回答をコードや観測結果と照合し、不足する情報を補って次の調査を選んだ。担当外コードの修正と最終的な効果検証は、担当チームが担った。

<p id="copilotを使い回答ではなく調査の前進を求める">求めたのは、AIから回答を得ることではなく、対象障害の解決に役立つ情報を得ることだった。</p>

本記事は、その実務経験を公開用に抽象化した記録である。上の依存関係は担当範囲を説明するためのもので、内部構成の詳細な再現ではない。名称、日時、版番号、実装識別子、詳細な発生機序を省き、非公開のコード、ログ、社内資料、関係者間のやり取りの原文は掲載しない。
