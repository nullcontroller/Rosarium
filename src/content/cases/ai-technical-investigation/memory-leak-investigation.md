---
title: "07. 残存メモリリークの仮説検証と解決"
summary: "調査履歴と関連コード、問題がある版と前回版の比較から修正候補を絞り、私自身の稼働工数2人日で調査し、担当者の修正・検証と連携して残存メモリリークの解決に導いた。"
layer: publication
kind: case
section: cases
status: published
published_at: "2026-10-29"
last_updated: "2026-11-26"
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
series_title: "複数のソフトウェアにまたがる障害調査の設計"
order: 7
---

## 調査経緯を欠落させないため、関連するやり取りをまとめて渡した

<p id="investigation-leak-flow-caption">担当チームでは、もう1件のメモリリークについて調査が続いていた。私は、自身の稼働工数2人日で、残存メモリリークの解決に導いた。ただし、生成AIを使わない場合との比較データはなく、工数削減効果は不明である。</p>

### 観測事実――調査範囲は既に狭まっていた

再調査の開始時点では、担当者の調査によって対象範囲が初期調査時よりも絞られていた。課題管理上のやり取りには、過去の調査内容、疑っている箇所、試した対応、結果、担当者の判断が蓄積していた。

私はそれまでのやり取りを確認したうえで、関連するやり取りをまとめてCopilotへ渡した。情報を選んで整理する方法もあったが、今回は経緯を抜き出す段階で必要な結果を落とさず、蓄積された調査を使って候補を検討させることを優先した。これを、すべての案件で履歴全文を入力するべきだという方法には一般化しない。

初期調査ではクラッシュの原因と責任箇所が広く未確定であったのに対し、再調査では対象の現象と処理が限定され、担当者及び委託先の調査結果も蓄積されていた。私はこの差を利用し、C全体を一から調べ直す方法を選ばなかった。図9は、二つの調査時点の前提を比較する。

<figure class="diagram diagram-static" id="investigation-figure-9" aria-label="図9 初期調査と残存リーク再調査の範囲">
  <a class="diagram-light" href="/diagrams/investigation/scope-comparison-light.svg" aria-label="図9を拡大して表示"><img class="diagram-light" src="/diagrams/investigation/scope-comparison-light.svg" alt="初期調査では責任箇所と原因が広く未確定。再調査では残存リーク、蓄積履歴、比較対象のOSS版を使い、著者が確認できる範囲へ絞った。" width="480" height="720" /></a>
  <a class="diagram-dark" href="/diagrams/investigation/scope-comparison-dark.svg" aria-label="図9をDark配色で拡大して表示"><img class="diagram-dark" src="/diagrams/investigation/scope-comparison-dark.svg" alt="初期調査では責任箇所と原因が広く未確定。再調査では残存リーク、蓄積履歴、比較対象のOSS版を使い、著者が確認できる範囲へ絞った。" width="480" height="720" /></a>
  <figcaption>図9　初期調査と残存リーク再調査の範囲。初期調査では責任箇所と原因が広く未確定。再調査では残存リーク、蓄積履歴、比較対象のOSS版を使い、著者が確認できる範囲へ絞った。 図を選択すると拡大できる。</figcaption>
</figure>

### 判断と実施事項――回答を関連コードとも照合する

履歴を受けたCopilotは原因候補を示した。しかし、履歴を読ませたことだけでは実装との整合を確認したことにはならない。私自身が関連コードを調べた。今回は調査範囲が限定されていたため、C全体の構造を理解していなくても、対象箇所なら自分でもコードを比較して確認できた。

<h2 id="問題の有無が異なる二つの版から探索範囲を減らした">問題がある版と前回版を比較し、探索範囲を減らした</h2>

### 仮説――変更箇所に、残存リークを説明する手掛かりがある

私は、今回の現象が発生しないOSSの版と、発生するOSSの版のコードをCopilotへ提供し、両版のコード比較を依頼した。正常条件と異常条件を明示することで、差分からリークに関係する候補を探せると考えたためである。ここでいう正常版は今回の現象が発生しない比較条件を指し、その版の全機能が無欠陥であるという保証ではない。

版間差分を使う理由は、C全体を一度に評価しようとせず、自分がコードを照合できる単位まで範囲を減らすためである。更新があったことだけでその変更を原因と決めるのではなく、変更内容とリークに関係する処理を結び付けて確認する必要があった。

図10では、観測された正常・異常条件、比較するコード、AIに求めた調査、私が行う照合を分ける。差分の存在だけでは原因の証明にならないため、関連処理と一致するかを自分で確かめる必要があった。

<figure class="diagram diagram-static" id="investigation-figure-10" aria-label="図10 正常版と異常版の差分を使う調査">
  <a class="diagram-light" href="/diagrams/investigation/version-diff-light.svg" aria-label="図10を拡大して表示"><img class="diagram-light" src="/diagrams/investigation/version-diff-light.svg" alt="今回の現象がない版とある版のコードを提供し、AIに差分から候補を調べさせた。著者が候補のコードを確認し、担当者が実環境で検証する。" width="480" height="800" /></a>
  <a class="diagram-dark" href="/diagrams/investigation/version-diff-dark.svg" aria-label="図10をDark配色で拡大して表示"><img class="diagram-dark" src="/diagrams/investigation/version-diff-dark.svg" alt="今回の現象がない版とある版のコードを提供し、AIに差分から候補を調べさせた。著者が候補のコードを確認し、担当者が実環境で検証する。" width="480" height="800" /></a>
  <figcaption>図10　正常版と異常版の差分を使う調査。今回の現象がない版とある版のコードを提供し、AIに差分から候補を調べさせた。著者が候補のコードを確認し、担当者が実環境で検証する。 図を選択すると拡大できる。</figcaption>
</figure>

### 実施事項と評価――複数の候補から、根拠を確認できる箇所を選ぶ

比較後、Copilotは二つの案を提示した。私は、一つ目については残る課題に関係する可能性が薄いと考え、今回の問題としては採用しなかった。OSS更新との関連性も考慮し、更新差分と残存する現象を結び付けて確認できる案を優先した。その案の内部実装は公開しない。関係が薄いと判断したことと、その案を独立した試験で否定したことは同じではないため、未実施の棄却試験は付け加えない。

もう一つの案では、調査していた終了処理に関連する問題箇所が示された。私は、その回答がコードに書かれている処理と一致するかを確認した。差分があるだけで原因と決めず、AIが示した箇所を読んで、メモリ管理の流れとの対応を確かめた。

対象には、単純に解放処理が一つ欠けているかを探すだけでは捉えにくい処理もあった。メモリの解放と、その後に対象を扱う処理との関係を確認する必要があった。公開原稿では、実装の所有権や寿命を再現できるコードがないため、二重解放や解放後使用などの特定の障害機序へ断定しない。

<figure class="diagram diagram-static" id="investigation-figure-11" aria-label="図11 残存リークの候補を絞り込む過程">
  <a class="diagram-light" href="/diagrams/investigation/leak-investigation-light.svg" aria-label="図11を拡大して表示">
    <img class="diagram-light" src="/diagrams/investigation/leak-investigation-light.svg" alt="履歴と関連コードを確認し、二つの版の差分を調べた。案の一つを見送り、もう一つをコードと照合して担当者へ渡した。担当者が修正と検証を行った。" width="480" height="780" />
  </a>
  <a class="diagram-dark" href="/diagrams/investigation/leak-investigation-dark.svg" aria-label="図11をDark配色で拡大して表示">
    <img class="diagram-dark" src="/diagrams/investigation/leak-investigation-dark.svg" alt="履歴と関連コードを確認し、二つの版の差分を調べた。案の一つを見送り、もう一つをコードと照合して担当者へ渡した。担当者が修正と検証を行った。" width="480" height="780" />
  </a>
  <figcaption>図11　残存リークの候補を絞り込む過程。履歴と関連コードを確認し、二つの版の差分を調べた。案の一つを見送り、もう一つをコードと照合して担当者へ渡した。担当者が修正と検証を行った。 図を選択すると拡大できる。</figcaption>
</figure>

## 根拠付きの修正候補を渡し、担当チームが改善を検証した

### 判断――確認できた候補を、変更権限と検証環境を持つ担当者へ渡す

コードを確認した結果、私は修正候補を担当者へ提示できると判断した。ただし、自分の環境では最終的な効果を検証できなかった。また、対象は私が直接変更する権限を持たないコードであった。そこで、問題と考えた箇所、修正案、判断の根拠をまとめ、Cの環境と実装に詳しい担当者へ修正と効果確認を依頼した。

### 結果――担当者の確認・修正・検証により解決へ至った

担当チームでも問題箇所が確認され、修正が行われた。修正後の効果確認を経て、残存メモリリークの解決に至った。**私自身の稼働工数は2人日であり、担当者による修正・検証と連携して解決に導いた成果である。** この2人日に、関係担当者の工数は含めていない。 AI単独で原因を確定し、修正して検証まで完了したという成果ではない。

原資料の記録では改善が検証されている。2人日が私自身の稼働工数であることは著者の確認による。これは、残存リークの調査開始から担当者による修正後の効果確認までの対応について、私が稼働した工数である。関係担当者の修正・検証工数や待ち時間を含む経過期間は、この数値からは分からない。最終修正の正確な差分、測定したメモリ量、反復回数や観測期間の全条件も公開資料からは示せないため、全環境での無欠陥や一定割合のリーク削減を主張しない。

図12は、先行するクラッシュ調査と残存リークの対応を、判断が変わった順序に沿って示す。図の長さは期間・工数に比例しない。各作業の開始時刻・終了時刻・所要時間は補わず、1日目・2日目への割当ても行っていない。

<figure class="diagram diagram-static" id="investigation-figure-12" aria-label="図12 観測・仮説・判断・検証の順序">
  <a class="diagram-light" href="/diagrams/investigation/timeline-light.svg" aria-label="図12を拡大して表示">
    <img class="diagram-light" src="/diagrams/investigation/timeline-light.svg" alt="先行調査では修正後も現象が残った結果を受けて方針を変更し、残存リークでは候補の採否と担当者の検証を経て解決した。著者の稼働工数は2人日であり、図は経過日数を表さない。" width="480" height="1780" />
  </a>
  <a class="diagram-dark" href="/diagrams/investigation/timeline-dark.svg" aria-label="図12をDark配色で拡大して表示">
    <img class="diagram-dark" src="/diagrams/investigation/timeline-dark.svg" alt="先行調査では修正後も現象が残った結果を受けて方針を変更し、残存リークでは候補の採否と担当者の検証を経て解決した。著者の稼働工数は2人日であり、図は経過日数を表さない。" width="480" height="1780" />
  </a>
  <figcaption>図12　観測・仮説・判断・検証の順序。先行調査では修正後も現象が残った結果を受けて方針を変更し、残存リークでは候補の採否と担当者の検証を経て解決した。著者の稼働工数は2人日であり、図は経過日数を表さない。 図を選択すると拡大できる。</figcaption>
</figure>

修正案の採否と効果確認は、[コード生成AIの評価と採用設計](/evaluation-hitl/code-evaluation-acceptance/)でも扱っている。自分が検証できる範囲を絞り、根拠を確認して引き継ぐことが、担当者の修正・検証へつながった。

<span id="investigation-roles-caption"></span>
