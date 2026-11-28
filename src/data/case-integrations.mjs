/** Approved source/successor relation and compatibility mapping for the integrated Book. */
const bookId = "cases/asset-management-app-a-architecture";
const developmentId = `${bookId}/development-management`;
const qualityId = `${bookId}/review-and-quality`;
export const caseIntegrationPlans = [
  {
    sourceId: "cases/ai-development-management",
    bookId,
    successorId: developmentId,
    reason: "同一の個人開発経験を、方式設計・開発管理・品質保証・運用保守を扱うBookへ統合したため。元記事の開発管理に関する知見は第6章を中心に継承する。",
    compatibility: {
      from: "/cases/ai-development-management/",
      to: `/${developmentId}/#開発管理を委任する目的`,
      disposition: "簡素化",
      fragments: {
        "1-開発の背景と目的": `/${bookId}/requirements/#従来の資産管理`,
        "2-開発したシステム": `/${bookId}/requirements/#機能要求`,
        "3-人間chatgptcodexの責任分界": `/${developmentId}/#人間chatgptcodexの責任分界`,
        "4-実利用を起点とするアジャイルな開発サイクル": `/${qualityId}/#レビュー担当ごとに評価する成果物を変える`,
        "5-人間の判断がボトルネックになる構造": `/${developmentId}/#人間の判断がボトルネックになる構造`,
        "6-aiへ委ねる管理と人間が保持する判断": `/${developmentId}/#人間chatgptcodexの責任分界`,
        "7-品質とデータの保全": `/${qualityId}/#人間レビューでは動作するシステムを使う`,
        "8-異なるシステムへ適用した開発プロセス": `/${developmentId}/#実利用を起点とする短い改善サイクル`,
        "9-開発を通じて得た知見": `/${developmentId}/#実利用を起点とする短い改善サイクル`,
      },
    },
  },
];

/** Inputs have already been filtered for visibility and independent personal cases. */
export function integratedPersonalCases(entries) {
  const visible = new Set(entries.map(entry => entry.id));
  const sources = new Set(caseIntegrationPlans.filter(plan => visible.has(plan.bookId)).map(plan => plan.sourceId));
  return entries.filter(entry => !sources.has(entry.id));
}

export function integrationPreview(sourceId, visibleIds, review) {
  return review ? caseIntegrationPlans.find(plan => plan.sourceId === sourceId && visibleIds.has(plan.bookId) && visibleIds.has(plan.successorId)) : undefined;
}
