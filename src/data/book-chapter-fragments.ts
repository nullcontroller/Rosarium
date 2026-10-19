// Compatibility for published Book headings after local editing.
export const bookChapterLegacyFragments: Record<string, Record<string, string>> = {
  "foundations/ai-business-design/delegation-and-responsibility": {
    "第1章aiに仕事を任せても責任は消えない": "第01章aiに仕事を任せても責任は消えない"
  },
  "foundations/ai-business-design/explainable-delegation": {
    "第4章説明できない仕事をaiに任せてはいけない": "第04章説明できない仕事をaiに任せてはいけない"
  },
  "cases/customer-support-ai-dx/knowledge-design": {
    "方式判断機種を絞ってから検索する": "対象に合う文書の中でベクトル検索する",
    "機種以外の適合性とナレッジ運用": "参照資料を継続して管理する",
    "意味の近さは回答根拠の適合性ではない": "文書とメタデータを整備する",
    "横断検索の前に揃えるもの": "文書とメタデータを整備する",
    "文書の適格性と回答項目の許可": "検索対象の適格性と回答許可を分ける",
    "参照資料を回答に使える条件で分ける": "対象に合う文書の中でベクトル検索する",
    "回答生成の前に検索対象を制御する": "対象に合う文書の中でベクトル検索する",
    "文書の分割と検索結果の順位付けを設計する": "対象に合う文書の中でベクトル検索する",
    "矛盾と廃止を通常系として扱う": "対象に合う文書の中でベクトル検索する",
    "参照資料を継続して管理する": "参照資料を継続して管理する",
    "semantic-similarityは回答資格ではない": "検索対象の適格性と回答許可を分ける",
    "knowledge-sourceを回答資格で分ける": "検索対象の適格性と回答許可を分ける",
    "retrievalを段階化する": "対象に合う文書の中でベクトル検索する",
    "chunkとrankingを文書構造に合わせる": "対象に合う文書の中でベクトル検索する",
    "knowledgeを運用対象にする": "参照資料を継続して管理する"
  }
};
