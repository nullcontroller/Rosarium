---
title: 02. 担当領域の初期調査――不具合発見と修正後の検証
summary: 情報追加と横断調査から実在する同期制御のバグを確認し、担当者へ修正を依頼した。対象クラッシュは残り、実行時の証拠を集めて次のコードベースへ引き継ぐ。
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
order: 2
---

第02〜04章にわたるクラッシュ調査全体の経過を、次の図に示す。

<figure class="diagram diagram-static" id="investigation-crash-flow-caption" aria-label="クラッシュ調査の経緯">
  <div role="region" tabindex="0" aria-label="クラッシュ調査の経緯・横スクロール対応" style="overflow-x:auto;">
    <img class="diagram-light" src="/diagrams/static/software-engineering--ai-technical-investigation-design-crash-flow-light.svg" alt="一般的なAI回答へ情報を追加し、同期制御の不備を修正したがクラッシュは残存。証拠と未確定の候補を担当チームへ引き継ぎ、チームの互換性問題の修正で解消。" width="360" height="1260" style="min-width:360px;" />
    <img class="diagram-dark" src="/diagrams/static/software-engineering--ai-technical-investigation-design-crash-flow-dark.svg" alt="一般的なAI回答へ情報を追加し、同期制御の不備を修正したがクラッシュは残存。証拠と未確定の候補を担当チームへ引き継ぎ、チームの互換性問題の修正で解消。" width="360" height="1260" style="min-width:360px;" />
  </div>
</figure>

## 一般的な初回回答に対し、元の調査情報を追加した

自分の担当領域では、共通ライブラリの呼び出し方や終了処理を確認できる。まずそこを調べれば、担当領域に問題があるかを検討し、別の担当者へ渡す情報も集められると考えた。

Copilotには障害の背景と既存の調査結果を伝え、担当領域のどのコードを、どの順に確認するか、調査方針と具体的な手順を求めた。

ところが、初回回答は一般的な調査項目や確認手順にとどまった。そのままでは、次にどのコードを確認するかを決められない。私はAIの能力だけを問題にする前に、自分が調査結果を要約して渡したことで、必要な背景や結果まで落としてしまった可能性を考えた。

質問の言い換えより判断材料を補う必要があると考え、元の調査情報を追加した。その後に提示された調査の選択肢を評価し、当初の目的に合う、担当プロジェクト内の横断調査を選んだ。Copilotに関連コードを探索させ、候補を確認しながら、次に何を調べるか、追加調査が必要かを私が判断した。

情報の役割の整理は、[Instruction・Knowledge・Evidenceの責務分離](/knowledge-context/instruction-knowledge-evidence/)で扱っている。指示の明確さについては[プロンプト設計の基本構造](/knowledge-context/prompt-structure/)も参照できる。

## 同期制御の解放順序の不備を、コードで確認した

横断調査の中で、Copilotが終了処理で用いる同期制御の解放順序に関する実装上の不備を発見した。私は該当コードを読み、指摘された不備を、実際に存在する実装上のバグと判断した。

さらにCopilotへ修正方法と、その修正が必要な理由を説明させた。同期制御に関するリソースの後始末をどう改めるのか、なぜその変更が必要なのかを理解したうえで、担当者へ修正と効果確認を依頼した。

修正は実施されたが、対象のクラッシュは解消しなかった。**実在するバグの発見・修正と、当初のクラッシュの解決は別の成果だった。** 同期制御の不備は修正されたものの、当初のクラッシュの直接原因とは確認できず、残る現象の調査を続けた。

コードを読む判断の役割は、[終了処理の順序に着目した調査の記録](/software-engineering/engineering-judgment-in-ai-code-review/)でも考察している。

## 実行時の証拠を集め、引き継ぎ情報を作った

私はクラッシュダンプやコールスタックなどを確認し、それまでの調査結果と併せて、共通ライブラリ側の追加調査が必要だと判断した。担当領域で見つかった不具合だけを追い続けても、残るクラッシュの説明には届いていなかったためである。

次のコードベースでも、それまでの調査を前提に進められるよう、Copilotへ引き継ぎ用のプロンプトを作成させた。調査・修正済みの内容、残る現象、証拠、未確定の候補を含めた。次章では、この情報を共通ライブラリ側の調査へ持ち込む。
