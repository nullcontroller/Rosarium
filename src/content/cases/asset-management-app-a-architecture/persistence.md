---
title: "04. 排他制御と保存の整合性設計"
summary: "古い更新要求の検査と排他制御、新しい保存世代とmanifestの置換を組み合わせ、保存の確定点と途中失敗から守る範囲を説明する。"
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
order: 4
---

## この章の問い

ファイルベースの永続化で、競合と保存途中の障害にどう対応するか。

## 複数の画面から同時に保存されたら

二つの端末が同じ状態を読み、一方が保存した後に他方が古い全体状態を書けば、先の更新を失い得る。資産管理アプリAでは、読み取った版を表すrevisionを保存要求に付け、現行版と一致しない古い要求を拒否する。古い要求が拒否された場合は、利用者が最新状態を読み直して入力内容を確認する。

|機構|保護する範囲|代わりにならないもの|
|---|---|---|
|revision|古い端末要求による上書き|処理途中の相互排他|
|RLock|同一プロセス内の保存操作|複数プロセス間の排他|
|ファイルロック|同じ保存領域を使うプロセスの排他|端末が読んだ版の検査|
|起動監視のMutex|アプリの多重起動抑止|データごとの業務検証|

RLockは同じスレッドからの再取得を許すロックである。[PythonのRLock仕様](https://docs.python.org/3.14/library/threading.html#rlock-objects)が対象とするのは同一プロセス内のスレッドである。複数プロセスの排他と端末が読んだ版の確認は、表の別の機構が受け持つ。

## 保存済みファイルを直接書き換えない

manifestは「今どの世代を正本として読むか」を決める索引である。ロック内で最新の正本とrevisionを読み、候補全体を生成して検証する。候補を新しい世代へ書き、flush・fsync、ハッシュを含むmanifest、読戻し検証を経て、最後に正本manifestを置き換える。途中で旧manifestが参照する世代を編集しない。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/persistence-light.svg" aria-label="新世代保存とmanifestの確定点を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/persistence-light.svg" alt="新世代保存とmanifestの確定点。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/persistence-dark.svg" aria-label="新世代保存とmanifestの確定点を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/persistence-dark.svg" alt="新世代保存とmanifestの確定点。" width="480" height="600" loading="lazy" /></a>
  <figcaption>新世代保存とmanifestの確定点。</figcaption>
</figure>

新世代の存在だけでは保存成功にしない。manifestの置換を確定点とし、その後に確定世代の再読込・再計算を行って応答する。画面も保存成功後に確定表示する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/save-failure-light.svg" aria-label="置換前失敗で旧世代を保護するを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/save-failure-light.svg" alt="置換前失敗で旧世代を保護する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/save-failure-dark.svg" aria-label="置換前失敗で旧世代を保護するを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/save-failure-dark.svg" alt="置換前失敗で旧世代を保護する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>置換前失敗で旧世代を保護する。</figcaption>
</figure>

置換前に失敗した場合、旧manifestと旧世代が残るため、未完成候補を正本として使わずに済む。ただし置換後に応答が失われた場合は、サーバーでは保存済みでも画面は成功を受け取れない。通信失敗を「必ず未保存」と断定せず、最新revisionと状態を再確認する。

## 原子的な見え方と、停電後の永続性は違う

flushはPython側のバッファを出し、fsyncはOSへ同期を要求する。os.replaceによる置換の成否・原子性は対象OSとファイルシステム等の条件に依存する。停電後の保存状態はOS・ファイルシステム・媒体の動作にも左右されるため、保存処理と併せて外部バックアップからの復旧を用意する。[Pythonのファイル同期と置換](https://docs.python.org/3.14/library/os.html#os.fsync)を参照する。

SHA-256は読み戻した内容が期待値と一致するかの破損検出に用いる。第三者が内容とmanifestを共に書き換えられる状況で、本人作成の証明や電子署名の代わりにはならない。データベース製品が提供するトランザクション機能のうち、必要な競合検査・保存の確定・読戻しをアプリの保存窓口で実装している。

## 保存世代とバックアップの役割

保存世代は、候補作成から確定までの途中失敗に備える仕組みである。同じPCや媒体を失う障害への備えは、第9章の外部バックアップが担う。保存処理のテストでは、失敗が置換の前か後か、次の読込みがどの世代を参照するかを確認する。

## 次の論点

[第5章：外部市場情報の取得方式](/cases/asset-management-app-a-architecture/market-data/)へ進む。
