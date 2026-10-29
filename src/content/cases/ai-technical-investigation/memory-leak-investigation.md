---
title: 05. 情報を渡し、修正候補を絞り込む――メモリリークの調査
summary: Jiraの調査履歴、関連コード、問題がある版と前回版の比較を使って修正候補を提示し、担当チームの修正と改善検証につなげる。
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
order: 5
---

## 調査経緯を欠落させないため、関連するやり取りをまとめて渡した

<p id="investigation-leak-flow-caption">担当チームでは、もう1件のメモリリークについて調査が続いていた。</p>

私はJira上の担当者間のやり取りを確認しており、そこには過去の調査内容、原因候補、試した対応、その結果、担当者の判断が蓄積されていた。

短い要約で途中の候補や対応結果を落とさず、自分が把握した経緯をCopilotにも共有するため、関連するやり取りをまとめてCopilotへ渡した。Jiraの会話履歴をもとに、それまでに試したことと結果を踏まえて、残るメモリリークの原因候補を検討させた。

Jiraの会話原文は掲載しない。業務情報をAIへ渡す際には、利用環境と入力範囲に関する情報管理上の条件を確認する必要がある。

Copilotの回答を受けた後も、調査対象の情報が十分に確認されているとは判断できず、私自身が関連コードを調べた。履歴を踏まえた回答が、実装とも整合するかを確かめるためである。

<h2 id="問題の有無が異なる二つの版から探索範囲を減らした">問題がある版と前回版を比較し、探索範囲を減らした</h2>

共通ライブラリ全体の実装を評価することは難しかったが、問題がある版と前回版の変更箇所であれば、自分でもコードを比較して確認できた。そこで、変更点からメモリリークに関係する原因候補を探るため、Copilotに両版のコード比較を依頼した。

調査対象には、単純な解放忘れを探すだけでは捉えられないメモリ管理上の問題もあった。解放済みの対象を再び利用・呼び出すような処理も見られ、コードを目視するだけでは問題箇所を見つけにくかった。Copilotによるコード探索と版間比較は、原因候補を絞り込む助けになった。

AIは、メモリリークの発生に関係する可能性が高い実装上の問題と修正案を示した。差分があるだけで原因と決めず、私は両版の変更箇所を比較し、AIの説明が実際のコードと整合するかを確認して、修正候補を絞り込んだ。

## 根拠付きの修正候補を渡し、担当チームが改善を検証した

コード確認を経て、私は修正候補を担当チームへ提示できると判断した。ただし、自分の環境では、その修正の最終的な効果を確かめられなかった。対象は私が変更権限を持たないコードでもあり、自分で直接変更するのではなく、実装と検証環境に詳しい担当者へ確認を依頼した。

考えられる修正案と根拠をまとめて渡した後、担当チームでも問題箇所が確認され、修正が行われた。**対象のメモリリークについて、修正による改善が検証された。**

修正案の採用と効果確認の考え方は、[コード生成AIの評価と採用設計](/evaluation-hitl/code-evaluation-acceptance/)で詳しく扱っている。

<figure class="diagram diagram-static" id="investigation-roles-caption" aria-label="メモリリーク調査の役割分担">
  <div role="region" tabindex="0" aria-label="筆者・Copilot・担当チームの役割・横スクロール対応" style="overflow-x:auto;">
    <picture>
      <source media="(max-width:600px)" srcset="/diagrams/static/software-engineering--ai-technical-investigation-design-roles-mobile-light.svg" />
      <img class="diagram-light" src="/diagrams/static/software-engineering--ai-technical-investigation-design-roles-light.svg" alt="筆者、GitHub Copilot、担当チームのシーケンス図。Copilotは候補と修正案を提示し、筆者はコードを確認して根拠付きで共有。担当チームが修正と効果検証を担う。" width="720" height="880" style="min-width:320px;" />
    </picture>
    <picture>
      <source media="(max-width:600px)" srcset="/diagrams/static/software-engineering--ai-technical-investigation-design-roles-mobile-dark.svg" />
      <img class="diagram-dark" src="/diagrams/static/software-engineering--ai-technical-investigation-design-roles-dark.svg" alt="筆者、GitHub Copilot、担当チームのシーケンス図。Copilotは候補と修正案を提示し、筆者はコードを確認して根拠付きで共有。担当チームが修正と効果検証を担う。" width="720" height="880" style="min-width:320px;" />
    </picture>
  </div>
</figure>


全体の実装評価を独力で担えなくても、版間の変更箇所に範囲を絞ることで、自分で回答を照合し、候補を選べた。その根拠を引き継ぎ、担当チームによる修正・改善検証につなげた。
