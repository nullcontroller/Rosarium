---
title: "06. クラッシュの解消と残存するメモリリーク"
summary: "Cの担当者及び委託先が更新時の管理方式の不整合を特定・修正してクラッシュを解消した経緯と、別のメモリリークへ調査対象を移した判断を整理する。"
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
order: 6
---

## 外部ライブラリ更新に伴う互換性の問題が特定された

### 観測事実――担当チームから原因特定と修正が報告された

調査情報を引き継いだ後、Cの担当者・委託先が原因調査と修正を進めた。引継ぎ後の約2週間、私は追加調査や修正作業に関与しなかった。私は、その後の原因特定や修正作業へ直接参加していない。以降の経緯は、担当者の調査・修正報告を確認したものである。

この段階は、私の初期調査の継続ではなく、Cの担当者及び委託先による調査・修正である。図6では三者を分ける。共同で進めた作業について、個々の担当者がどの操作を行ったかまでは原資料から割り当てない。

<figure class="diagram diagram-static" id="investigation-figure-6" aria-label="図6 調査の三段階と担当者別スイムレーン">
  <a class="diagram-light" href="/diagrams/investigation/swimlanes-light.svg" aria-label="図6を拡大して表示"><img class="diagram-light" src="/diagrams/investigation/swimlanes-light.svg" alt="引継ぎ後の約2週間、著者は追加調査・修正に不関与。C担当者と委託先が原因特定・修正を進め、その後、著者が残存リークを再調査した。共同欄は個別の実施分担を示さない。" width="480" height="1050" /></a>
  <a class="diagram-dark" href="/diagrams/investigation/swimlanes-dark.svg" aria-label="図6をDark配色で拡大して表示"><img class="diagram-dark" src="/diagrams/investigation/swimlanes-dark.svg" alt="引継ぎ後の約2週間、著者は追加調査・修正に不関与。C担当者と委託先が原因特定・修正を進め、その後、著者が残存リークを再調査した。共同欄は個別の実施分担を示さない。" width="480" height="1050" /></a>
  <figcaption>図6　調査の三段階と担当者別スイムレーン。引継ぎ後の約2週間、著者は追加調査・修正に不関与。C担当者と委託先が原因特定・修正を進め、その後、著者が残存リークを再調査した。共同欄は個別の実施分担を示さない。 図を選択すると拡大できる。</figcaption>
</figure>

### 報告された原因――OSS更新とCの既存カスタマイズとの不整合

Cの担当者及び委託先からは、OSS更新に伴う変数の管理方式及びメモリ解放処理の変更と、Cの既存カスタマイズ実装との不整合がクラッシュの原因だったと報告された。

更新前は共有される変数をCの独自の管理方式で扱っていた。更新後のOSSでは、その変数が処理内のローカル変数となり、解放処理も変わった。一方、C側には従来の管理を前提にしたカスタマイズが残っていた。報告では、その組合せによって不正なアドレスを解放しようとする状態が生じたと説明されている。更新後の実装に変数の扱いを合わせる修正が行われ、対象のクラッシュは解消した。

これは私自身が原因箇所を確定した結果ではなく、担当者・委託先の調査と修正報告による確認である。図7は、その報告を管理責務の違いとして一般化した。内部クラス名、変数名、関数名、正確な修正コード、メモリ配置は再現していない。

<figure class="diagram diagram-static" id="investigation-figure-7" aria-label="図7 OSS更新前後と既存カスタマイズの不整合">
  <a class="diagram-light" href="/diagrams/investigation/variable-management-light.svg" aria-label="図7を拡大して表示"><img class="diagram-light" src="/diagrams/investigation/variable-management-light.svg" alt="更新前の共有変数を前提としたCの管理が、更新後のローカル変数・解放処理と整合しなくなったという報告を一般化した概念図。実装の詳細や残存リークの原因を示す図ではない。" width="480" height="850" /></a>
  <a class="diagram-dark" href="/diagrams/investigation/variable-management-dark.svg" aria-label="図7をDark配色で拡大して表示"><img class="diagram-dark" src="/diagrams/investigation/variable-management-dark.svg" alt="更新前の共有変数を前提としたCの管理が、更新後のローカル変数・解放処理と整合しなくなったという報告を一般化した概念図。実装の詳細や残存リークの原因を示す図ではない。" width="480" height="850" /></a>
  <figcaption>図7　OSS更新前後と既存カスタマイズの不整合。更新前の共有変数を前提としたCの管理が、更新後のローカル変数・解放処理と整合しなくなったという報告を一般化した概念図。実装の詳細や残存リークの原因を示す図ではない。 図を選択すると拡大できる。</figcaption>
</figure>

図8では、初期の不具合候補、担当者側で確認されたクラッシュ原因、後に残存したメモリリークを分ける。クラッシュ修正によって別のリークまで解消したとは扱わない。

<figure class="diagram diagram-static" id="investigation-figure-8" aria-label="図8 潜在不具合・クラッシュ・残存リークを分ける">
  <a class="diagram-light" href="/diagrams/investigation/separate-problems-light.svg" aria-label="図8を拡大して表示">
    <img class="diagram-light" src="/diagrams/investigation/separate-problems-light.svg" alt="Bのロック解放漏れ、Cの先行するリーク、クラッシュ原因の互換性問題、後続の残存リークは、それぞれの修正結果で区別する。" width="480" height="850" />
  </a>
  <a class="diagram-dark" href="/diagrams/investigation/separate-problems-dark.svg" aria-label="図8をDark配色で拡大して表示">
    <img class="diagram-dark" src="/diagrams/investigation/separate-problems-dark.svg" alt="Bのロック解放漏れ、Cの先行するリーク、クラッシュ原因の互換性問題、後続の残存リークは、それぞれの修正結果で区別する。" width="480" height="850" />
  </a>
  <figcaption>図8　潜在不具合・クラッシュ・残存リークを分ける。Bのロック解放漏れ、Cの先行するリーク、クラッシュ原因の互換性問題、後続の残存リークは、それぞれの修正結果で区別する。 図を選択すると拡大できる。</figcaption>
</figure>

### 評価――先に見つかった不具合を直接原因と扱わない

第4章のロック解放漏れと、第5章で発見されたメモリリークは、いずれも今回のクラッシュの直接原因としては確認されなかった。Cの担当者及び委託先が別の不整合を特定したことで、クラッシュの原因と修正結果が結び付いた。ただし、別の不整合を修正して現象が解消したことは、先行する不具合の関与があらゆる条件で完全に否定されたことを意味しない。本稿で参照できる検証記録から、先行不具合の関与を完全に棄却したとは扱わない。

私が提示した候補と、担当者が最終的に採用した修正は同じものとして扱わない。担当者への情報提供は私の仕事であり、Cの実装を調べ、修正の妥当性と効果を確認した仕事は担当チームの成果である。

## 解消していない別の現象を、次の調査対象にした

### 観測事実――クラッシュ修正後にもリークが報告された

クラッシュを修正した後、繰返し評価でメモリリークが残っていることが報告された。第5章で修正されたものとは別のメモリリークが残っている状態である。

担当者は、終了処理の過程で確保されたメモリが解放されない経路を調べていた。呼出し順の変更によって特定のテストでリークが発生しなくなったという報告もあった。ただし、その時点でメモリリーク全体が解決したとは確認されず、調査は続いていた。

### 判断と実施事項――蓄積された結果から調査を再開する

私は、担当者間のやり取りと修正履歴を確認し、自分でも原因候補を検討することにした。クラッシュを説明する仮説を追い続けるのではなく、残存リークを新たな調査対象として定めたのである。

次章の2人日は、この残存メモリリークの解決へ向けた私自身の稼働工数である。解決までの経過日数や関係担当者を含む総工数ではない。途中の試行と結果が既に蓄積していたため、それを出発点として利用した。
