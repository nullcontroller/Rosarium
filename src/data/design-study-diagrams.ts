import type { CaseDiagramModel } from "./case-diagrams.ts";

function verticalLayouts(ids: string[]): NonNullable<CaseDiagramModel["layouts"]> {
  const make = (mobile: boolean) => {
    const width = mobile ? 320 : 620, step = mobile ? 124 : 144;
    const w = mobile ? 200 : 220, h = mobile ? 88 : 108;
    const nodes = Object.fromEntries(ids.map((id, i) => [id, { x: (width - w) / 2, y: 18 + i * step, w, h }]));
    const edges = Object.fromEntries(ids.slice(1).map((id, i) => {
      const a = nodes[ids[i]], b = nodes[id];
      return [`${ids[i]}:${id}`, { path: `M${width / 2} ${a.y + h}V${b.y}`, x: width / 2 + 42, y: (a.y + h + b.y) / 2 + 4 }];
    }));
    return { width, height: 18 + (ids.length - 1) * step + h + 18, nodes, edges };
  };
  return { mobile: make(true), desktop: make(false) };
}

function stateLayouts(): NonNullable<CaseDiagramModel["layouts"]> {
  const make = (mobile: boolean) => {
    const width = mobile ? 320 : 620, w = mobile ? 140 : 180, h = mobile ? 88 : 108, step = mobile ? 124 : 144;
    const center = (width - w) / 2, left = mobile ? 8 : 90, right = mobile ? 172 : 350;
    const nodes = {
      pending: { x: center, y: 18, w, h }, running: { x: center, y: 18 + step, w, h },
      complete: { x: left, y: 18 + step * 2, w, h }, error: { x: right, y: 18 + step * 2, w, h },
      review: { x: left, y: 18 + step * 3, w, h }, retry: { x: right, y: 18 + step * 3, w, h },
      approved: { x: center, y: 18 + step * 4, w, h }, indexed: { x: center, y: 18 + step * 5, w, h },
    };
    const pairs = [["pending", "running"], ["running", "complete"], ["running", "error"], ["complete", "review"], ["error", "retry"], ["review", "approved"], ["approved", "indexed"]] as const;
    const edges = Object.fromEntries(pairs.map(([from, to]) => {
      const a = nodes[from], b = nodes[to], mid = (a.y + h + b.y) / 2;
      return [`${from}:${to}`, { path: `M${a.x + w / 2} ${a.y + h}V${mid}H${b.x + w / 2}V${b.y}`, x: from === "running" ? b.x + w / 2 : a.x + w / 2, y: mid - 3 }];
    }));
    edges["retry:pending"] = { path: `M${right + w} ${nodes.retry.y + h / 2}H${width - 6}V${18 + h / 2}H${center + w}`, x: width - 25, y: 18 + h + 10 };
    return { width, height: nodes.indexed.y + h + 18, nodes, edges };
  };
  return { mobile: make(true), desktop: make(false) };
}

function securityLayouts(): NonNullable<CaseDiagramModel["layouts"]> {
  const make = (mobile: boolean) => {
    const width = mobile ? 360 : 680, w = mobile ? 180 : 240, h = mobile ? 88 : 108, step = mobile ? 124 : 144;
    const x = mobile ? 10 : 40, sideX = mobile ? 208 : 420, sideW = mobile ? 140 : 220;
    const ids = ["source", "permission", "approved", "index", "ai", "answer"];
    const nodes = Object.fromEntries(ids.map((id, i) => [id, { x, y: 18 + step * i, w, h }]));
    nodes.blocked = { x: sideX, y: 18 + step, w: sideW, h };
    const edges = Object.fromEntries(ids.slice(1).map((id, i) => {
      const a = nodes[ids[i]], b = nodes[id];
      return [`${ids[i]}:${id}`, { path: `M${x + w / 2} ${a.y + h}V${b.y}`, x: x + w / 2 + 40, y: (a.y + h + b.y) / 2 + 4 }];
    }));
    edges["permission:blocked"] = { path: `M${x + w} ${nodes.permission.y + h / 2}H${sideX}`, x: sideX, y: nodes.permission.y - 8 };
    return { width, height: nodes.answer.y + h + 18, nodes, edges };
  };
  return { mobile: make(true), desktop: make(false) };
}

/** Fictional examples only; reuse the existing responsive SVG renderer. */
export const designStudyDiagrams: Record<string, CaseDiagramModel> = {
  "design-study-batch-flow": {
    title: "仮想設計：起動から候補生成・承認・検索反映へ",
    intro: "初回・臨時は手動、通常の差分は定期起動です。候補生成、担当者レビュー、定期反映は別の処理として管理します。",
    description: "手動・定期・臨時の起動で原本から対象を抽出し、節分割・候補生成・保存を行います。レビュー後に別ジョブが承認済みデータを反映し、オンライン問い合わせは有効な検索DBを参照します。",
    nodes: [
      { id: "source", label: "既存製品情報システム", kind: "knowledge", description: "原本の登録・改訂とCSの検索・閲覧を継続します。文書Aの製品・版と本文を管理します。" },
      { id: "extract", label: "手動・定期・臨時の抽出", kind: "system", description: "初回は管理者が全件を手動起動。通常は定期差分、緊急時は臨時起動です。文書IDと版を固定し、取得量を制限します。" },
      { id: "workspace", label: "作業領域", kind: "knowledge", description: "文書A（第2版）の本文と既存属性を同じ版として保存します。" },
      { id: "split", label: "節分割", kind: "system", description: "USB接続を節A、無線LAN接続を節Bへ分け、元文書と対応付けます。" },
      { id: "ai", label: "AIによる属性候補生成", kind: "ai", description: "製品・版は継承し、節本文から利用環境の候補を生成します。不明なら要確認とします。" },
      { id: "save", label: "候補保存", kind: "system", description: "形式を検査し、候補と処理完了を同一DBのトランザクションで保存します。確認状態は未承認です。" },
      { id: "review", label: "担当者レビュー", kind: "human", description: "製品担当者が本文と候補を比較し、必要に応じて修正・承認します。" },
      { id: "register", label: "承認後の定期反映", kind: "system", description: "別の定期反映ジョブが有効性と公開承認を再確認し、本文と属性を反映・照合します。失敗は未反映として再試行します。" },
      { id: "index", label: "RAG検索用DB", kind: "knowledge", description: "オンラインの問い合わせは承認済みの有効な節を参照します。問い合わせごとに候補生成を起動しません。" },
    ],
    rows: [["source"], ["extract"], ["workspace"], ["split"], ["ai"], ["save"], ["review"], ["register"], ["index"]],
    layouts: verticalLayouts(["source", "extract", "workspace", "split", "ai", "save", "review", "register", "index"]),
    edges: [
      { from: "source", to: "extract", label: "" }, { from: "extract", to: "workspace", label: "" },
      { from: "workspace", to: "split", label: "" }, { from: "split", to: "ai", label: "" },
      { from: "ai", to: "save", label: "" }, { from: "save", to: "review", label: "" },
      { from: "review", to: "register", label: "承認後" }, { from: "register", to: "index", label: "" },
    ],
    groups: [
      { title: "オンライン業務・原本", ids: ["source"] },
      { title: "候補生成バッチ", ids: ["extract", "workspace", "split", "ai", "save"] },
      { title: "検索反映ジョブ", ids: ["register", "index"] },
      { title: "製品担当者", ids: ["review"] },
    ],
  },
  "design-study-batch-state": {
    title: "仮想設計：節単位の処理状態と承認を分ける",
    intro: "形式が正しい「要確認」は処理済み・未承認です。技術的エラーだけを再実行の判断へ回します。",
    description: "未処理から処理中へ。正常な候補保存は処理済みとなり、レビューと承認を経て検索反映へ進みます。技術的失敗はエラーへ隔離し、一時障害の場合だけ上限付き再試行で未処理へ戻します。",
    nodes: [
      { id: "pending", label: "未処理", kind: "system", description: "処理対象を識別するキーと版を確認し、ワーカーが排他的に処理権を取得します。" },
      { id: "running", label: "処理中", kind: "ai", description: "AIへ要求し、出力形式を確認します。別の節は並行して処理できます。" },
      { id: "complete", label: "処理済み", kind: "system", description: "正常な候補、または正しい形式の要確認を保存した状態です。承認済みという意味ではありません。" },
      { id: "error", label: "エラー", kind: "system", description: "通信・形式・保存の失敗を節IDと対象版に結び付けて隔離します。他の正常な節は進めます。" },
      { id: "review", label: "レビュー待ち", kind: "human", description: "未承認の状態です。節AのUSB候補も節Cの要確認も、本文と照合して担当者が確定します。" },
      { id: "retry", label: "待機・再試行", kind: "decision", description: "同じ処理キーの保存結果を先に確認し、処理済みは再生成しません。未完了の一時的なAPI失敗だけ、間隔と回数に上限を設けて再試行します。形式不正や破損は修復後に再開します。" },
      { id: "approved", label: "承認済み", kind: "human", description: "対象の本文と属性を担当者が確認・修正・承認した状態です。" },
      { id: "indexed", label: "検索へ反映", kind: "knowledge", description: "有効な対象版を確認し、同じキーの重複登録を防いで検索へ反映します。" },
    ],
    rows: [["pending"], ["running"], ["complete", "error"], ["review", "retry"], ["approved"], ["indexed"]],
    layouts: stateLayouts(),
    edges: [
      { from: "pending", to: "running", label: "" },
      { from: "running", to: "complete", label: "形式正常" },
      { from: "running", to: "error", label: "技術的失敗" },
      { from: "complete", to: "review", label: "要確認も含む" },
      { from: "error", to: "retry", label: "一時障害" },
      { from: "retry", to: "pending", label: "再開" },
      { from: "review", to: "approved", label: "修正・承認" },
      { from: "approved", to: "indexed", label: "" },
    ],
  },
  "design-study-migration-data": {
    title: "仮想設計：一つの文書から適用条件の異なる二つの節へ",
    description: "移行前の文書A、Printer-A、第2版はUSBと無線LANの説明を含みます。移行後は同じ文書・版に対応する節AへUSB、節Bへ無線LANを付けます。",
    nodes: [
      { id: "manual", label: "文書A（第2版）", kind: "knowledge", description: "移行前。Printer-Aの文書本文にUSBと無線LANの説明が混在しています。" },
      { id: "usb", label: "節A・USB", kind: "knowledge", description: "移行後。元文書：文書A、製品Printer-A、版第2版、利用環境USBとして、USB接続の節を管理します。" },
      { id: "wifi", label: "節B・無線LAN", kind: "knowledge", description: "移行後。元文書：文書A、製品Printer-A、版第2版、利用環境無線LANとして、無線LAN接続の節を管理します。" },
    ],
    layouts: {
      desktop: {
        width: 620, height: 310,
        nodes: { manual: { x: 10, y: 100, w: 190, h: 110 }, usb: { x: 370, y: 15, w: 230, h: 110 }, wifi: { x: 370, y: 180, w: 230, h: 110 } },
        edges: { "manual:usb": { path: "M200 155H285V70H370", x: 285, y: 52 }, "manual:wifi": { path: "M200 155H285V235H370", x: 285, y: 257 } },
      },
      mobile: {
        width: 320, height: 350,
        nodes: { manual: { x: 70, y: 12, w: 180, h: 100 }, usb: { x: 6, y: 225, w: 145, h: 110 }, wifi: { x: 169, y: 225, w: 145, h: 110 } },
        edges: { "manual:usb": { path: "M160 112V165H78V225", x: 78, y: 193 }, "manual:wifi": { path: "M160 112V165H241V225", x: 241, y: 193 } },
      },
    },
    edges: [{ from: "manual", to: "usb", label: "節へ分割" }, { from: "manual", to: "wifi", label: "属性を対応" }],
  },
  "design-study-migration-timeline": {
    title: "仮想設計：事前移行から本番切替の判定まで",
    intro: "事前移行中も原本は更新されます。T0以降の差分を反映・確認してから切替を判断します。",
    description: "準備、T0時点の抽出、節分割と候補生成、製品担当者レビュー、整合性確認、CS事前利用、差分抽出、差分移行、切替判定の順。事前利用中の第3版への改訂は差分移行で取り込みます。",
    nodes: [
      { id: "prepare", label: "切替2か月前の準備", kind: "decision", description: "対象範囲、責任者、レビュー期間、CSの事前利用、切替条件を決めます。" },
      { id: "extract", label: "既存文書の抽出", kind: "system", description: "基準時点T0の文書A（第2版）と属性を対象一覧へ記録します。" },
      { id: "transform", label: "節分割・候補生成", kind: "ai", description: "節AにUSB、節Bに無線LANの候補を付け、未承認として保存します。" },
      { id: "review", label: "担当者レビュー", kind: "human", description: "製品担当者が対象版の本文と候補を照合し、修正・承認します。" },
      { id: "reconcile", label: "整合性確認", kind: "decision", description: "元文書と節の対応、本文・版・属性を照合し、問い合わせによる検索を確認します。" },
      { id: "trial", label: "CS部の事前利用", kind: "human", description: "回答と有人引継ぎから業務を再開できるか試します。この間に原本が第3版へ変わる例を想定します。" },
      { id: "changes", label: "差分抽出", kind: "system", description: "T0以降の追加・改訂・削除・承認変更を抽出します。第3版を取りこぼさないことを確認します。" },
      { id: "delta", label: "差分移行", kind: "system", description: "変更版を変換し、必要なレビューと検索データへの反映・照合を行います。" },
      { id: "gate", label: "本番切替判定", kind: "decision", description: "最終差分、承認、検索検証、CSの準備と切戻し条件を確認し、切替か延期を判断します。実施結果ではありません。" },
    ],
    rows: [["prepare"], ["extract"], ["transform"], ["review"], ["reconcile"], ["trial"], ["changes"], ["delta"], ["gate"]],
    layouts: verticalLayouts(["prepare", "extract", "transform", "review", "reconcile", "trial", "changes", "delta", "gate"]),
    edges: [
      { from: "prepare", to: "extract", label: "" }, { from: "extract", to: "transform", label: "" },
      { from: "transform", to: "review", label: "" }, { from: "review", to: "reconcile", label: "" },
      { from: "reconcile", to: "trial", label: "" }, { from: "trial", to: "changes", label: "T0以降" },
      { from: "changes", to: "delta", label: "" }, { from: "delta", to: "gate", label: "確認後" },
    ],
  },
  "design-study-security-boundary": {
    title: "仮想設計：公開承認済みの文書だけを顧客向け経路へ渡す",
    intro: "同じ症状を扱うFAQと社内報告書でも、顧客向けに渡せる範囲は異なります。対象外の文書は連携段階で除きます。",
    description: "既存製品情報システムから公開可否と対象版の承認を確認し、公開承認済み文書だけをRAG検索用DBへ連携します。社内向け報告書・未承認・区分未設定は連携しません。取得権限を限定した生成AIが公開根拠で回答し、根拠不足は有人へ引き継ぎます。",
    nodes: [
      { id: "source", label: "製品情報システム", kind: "knowledge", description: "Printer-Aの公開FAQ faq-001 / v2と社内報告書report-001 / v2が混在する原本です。CSは権限内で調査します。" },
      { id: "permission", label: "公開・承認確認", kind: "decision", description: "文書連携処理が文書ID・対象版・公開区分・承認状態を確認し、抽出する本文と承認対象を照合します。" },
      { id: "blocked", label: "対象外は除外", kind: "system", description: "report-001、未承認、区分未設定は除外します。この経路から顧客向けAIへ渡しません。" },
      { id: "approved", label: "承認済みを連携", kind: "system", description: "faq-001 / v2の公開が承認された本文だけを連携し、節分割・属性確認を経て検索用データにします。" },
      { id: "index", label: "RAG検索用DB", kind: "knowledge", description: "顧客向けの公開用索引です。適合する製品・版・環境の根拠を検索します。" },
      { id: "ai", label: "生成AI", kind: "ai", description: "検索サービスは公開用DBの読取りだけを許可され、AIへ社内原本の資格情報や任意の取得経路を渡しません。" },
      { id: "answer", label: "顧客への回答", kind: "system", description: "公開根拠に基づいて案内します。十分な根拠がない場合や専門判断が必要な場合はCSへ引き継ぎます。" },
    ],
    layouts: securityLayouts(),
    edges: [
      { from: "source", to: "permission", label: "" },
      { from: "permission", to: "blocked", label: "" },
      { from: "permission", to: "approved", label: "許可のみ" },
      { from: "approved", to: "index", label: "" },
      { from: "index", to: "ai", label: "公開根拠" },
      { from: "ai", to: "answer", label: "" },
    ],
  },
  "design-study-lifecycle-update": {
    title: "仮想設計：文書改訂の差分を確認し、承認した一式へ切り替える",
    intro: "ファームウェア更新で無線LAN手順を改訂する例です。変更のないUSB節は再利用し、変更節だけを確認します。",
    description: "manual-001の改訂を検知し、変更のないsection-001は承認済み属性を再利用します。変更されたsection-002だけをAI判定と担当者確認へ回し、承認後に同じ版の本文と属性を検索DBへ反映します。",
    nodes: [
      { id: "detect", label: "改訂を検知", kind: "system", description: "manual-001 / v3を前回の有効版v2と比較します。文書版と製品の対応版数は別項目です。" },
      { id: "diff", label: "変更された節を選ぶ", kind: "decision", description: "USBのsection-001は変更なしとして承認済み属性を再利用します。無線LAN手順が変わったsection-002を確認対象へ回します。" },
      { id: "candidate", label: "候補・判定の作成", kind: "ai", description: "section-002の適用版の修正候補、または修正不要の判定理由を未承認で保存します。" },
      { id: "review", label: "担当者の承認", kind: "human", description: "変更のあるsection-002の差分、前後の本文、候補を照合します。修正不要と返った場合も確認・承認します。" },
      { id: "prepare", label: "一式の反映準備", kind: "system", description: "v3の本文・属性・承認・索引をそろえて整合性を確認します。別サービス間の同時更新は仮定しません。" },
      { id: "activate", label: "検索先の切替", kind: "knowledge", description: "承認済みv3を更新後のファームウェア向けに使います。有効なv2は更新前向けに区別し、失効した根拠は使いません。" },
    ],
    layouts: verticalLayouts(["detect", "diff", "candidate", "review", "prepare", "activate"]),
    edges: [
      { from: "detect", to: "diff", label: "" }, { from: "diff", to: "candidate", label: "" },
      { from: "candidate", to: "review", label: "未承認" }, { from: "review", to: "prepare", label: "承認後" },
      { from: "prepare", to: "activate", label: "整合確認後" },
    ],
  },
};
