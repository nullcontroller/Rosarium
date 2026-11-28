---
title: "04. 排他制御と保存の整合性設計"
summary: "ファイルベースの永続化で、競合と保存途中の障害にどう対応するか。 採用方式、その理由と検証範囲・適用限界を整理する。"
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
order: 4
---

## この章の問い

ファイルベースの永続化で、競合と保存途中の障害にどう対応するか。

## 複数の画面から同時に保存されたら

二つの端末が同じ状態を読み、一方が保存した後に他方が古い全体状態を書けば、先の更新を失い得る。資産管理アプリAでは、読み取った版を表すrevisionを保存要求に付け、現行版と一致しない古い要求を拒否する。拒否は同期成功ではなく、利用者が最新状態を確認すべき結果として扱う。

|機構|保護する範囲|代わりにならないもの|
|---|---|---|
|revision|古い端末要求による上書き|処理途中の相互排他|
|RLock|同一プロセス内の保存操作|複数プロセス間の排他|
|ファイルロック|同じ保存領域を使うプロセスの排他|端末が読んだ版の検査|
|起動監視のMutex|アプリの多重起動抑止|データごとの業務検証|

RLockは同じスレッドからの再取得を許すロックである。これだけでプロセスや端末全体を守るとは説明しない。[PythonのRLock仕様](https://docs.python.org/3.14/library/threading.html#rlock-objects)と、引継ぎ資料にある保存窓口の役割を分けて読む必要がある。

## 保存済みファイルを直接書き換えない

ロック内で最新の正本とrevisionを読み、候補全体を生成して検証する。候補を新しい世代へ書き、flush・fsync、ハッシュを含むmanifest、読戻し検証を経て、最後に正本manifestを置き換える。途中で旧manifestが参照する世代を編集しない。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/persistence-light.svg" aria-label="新世代保存とmanifestの確定点を拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/persistence-light.svg" alt="新世代保存とmanifestの確定点。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/persistence-dark.svg" aria-label="新世代保存とmanifestの確定点を拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/persistence-dark.svg" alt="新世代保存とmanifestの確定点。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>新世代保存とmanifestの確定点。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

manifestは「今どの世代を正本として読むか」を決める索引である。新世代の存在だけでは保存成功にしない。manifestの置換を確定点とし、その後に確定世代の再読込・再計算を行って応答する。画面も保存成功後に確定表示する。

<figure class="diagram diagram-static">
  <a class="diagram-light" href="/diagrams/asset-management-app-a-architecture/save-failure-light.svg" aria-label="置換前失敗で旧世代を保護するを拡大"><img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/save-failure-light.svg" alt="置換前失敗で旧世代を保護する。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <a class="diagram-dark" href="/diagrams/asset-management-app-a-architecture/save-failure-dark.svg" aria-label="置換前失敗で旧世代を保護するを拡大"><img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/save-failure-dark.svg" alt="置換前失敗で旧世代を保護する。本文で各工程の条件と制約を説明する。" width="480" height="600" loading="lazy" /></a>
  <figcaption>置換前失敗で旧世代を保護する。実環境の接続情報や実データを含まない概念図。</figcaption>
</figure>

置換前に失敗した場合、旧manifestと旧世代が残るため、未完成候補を正本として使わずに済む。ただし置換後に応答が失われた場合は、サーバーでは保存済みでも画面は成功を受け取れない。通信失敗を「必ず未保存」と断定せず、最新revisionと状態を再確認する。

## 原子的な見え方と、停電後の永続性は違う

flushはPython側のバッファを出し、fsyncはOSへ同期を要求する。os.replaceによる置換の成否・原子性は対象OSとファイルシステム等の条件に依存する。これらの組合せを、あらゆる停電や媒体故障でも最新保存が必ず残るという保証へ拡張しない。[Pythonのファイル同期と置換](https://docs.python.org/3.14/library/os.html#os.fsync)を参照する。

SHA-256は読み戻した内容が期待値と一致するかの破損検出に用いる。第三者が内容とmanifestを共に書き換えられる状況で、本人作成の証明や電子署名の代わりにはならない。RDBMSと同等のACID特性を一式実現したという主張でもない。

## 検証の範囲

実装済みの機構は引継ぎ資料に基づく。本Bookの付属検証は、一時領域の小さなモデルで置換前失敗時の旧世代保持とハッシュ破損検出を確認する。実アプリの障害注入、OS再起動、媒体故障試験を実施した結果ではない。正本保存世代と通常バックアップは目的が異なり、後者は第9章で扱う。

## 次の論点

[第5章：外部市場情報の取得方式](/cases/asset-management-app-a-architecture/market-data/)へ進む。
