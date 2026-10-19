// Compatibility for published Book headings after local editing.
export const bookChapterLegacyFragments: Record<string, Record<string, string>> = {
  "cases/customer-support-ai-dx/executive-summary": {
    "方式設計の到達点": "cases/customer-support-ai-dx/executive-summary#設計と評価の進め方"
  },
  "cases/customer-support-ai-dx/responsibility-boundary": {
    "support-detail-customer": "cases/customer-support-ai-dx/stopping-conditions#support-detail-customer",
    "support-detail-knowledge": "cases/customer-support-ai-dx/stopping-conditions#support-detail-knowledge",
    "support-detail-rag": "cases/customer-support-ai-dx/stopping-conditions#support-detail-rag",
    "support-detail-genai": "cases/customer-support-ai-dx/stopping-conditions#support-detail-genai",
    "support-detail-decision": "cases/customer-support-ai-dx/stopping-conditions#support-detail-decision",
    "support-detail-human": "cases/customer-support-ai-dx/stopping-conditions#support-detail-human",
    "support-detail-response": "cases/customer-support-ai-dx/stopping-conditions#support-detail-response",
    "support-detail-feedback": "cases/customer-support-ai-dx/stopping-conditions#support-detail-feedback",
    "support-dx-flow": "cases/customer-support-ai-dx/stopping-conditions#support-dx-flow",
    "support-dx-flow-title": "cases/customer-support-ai-dx/stopping-conditions#support-dx-flow-title",
    "検索対象の適格性と自動回答の許可を分ける": "cases/customer-support-ai-dx/stopping-conditions#検索対象の適格性と自動回答の許可を分ける",
    "問い合わせごとに実行権限を変える": "cases/customer-support-ai-dx/responsibility-boundary#問い合わせごとに回答の責任を分ける"
  },
  "cases/customer-support-ai-dx/design-principles": {
    "9-導入後の評価と改善まで設計する": "cases/customer-support-ai-dx/design-principles#9-評価で見つかった問題を方式改善へ戻す",
    "7-技術的実現可能性と業務成立性を段階的に確認する": "cases/customer-support-ai-dx/design-principles#7-フィージビリティ確認と業務上の評価を分ける"
  },
  "foundations/ai-business-design/delegation-and-responsibility": {
    "第1章aiに仕事を任せても責任は消えない": "foundations/ai-business-design/delegation-and-responsibility#第01章aiに仕事を任せても責任は消えない"
  },
  "foundations/ai-business-design/explainable-delegation": {
    "第4章説明できない仕事をaiに任せてはいけない": "foundations/ai-business-design/explainable-delegation#第04章説明できない仕事をaiに任せてはいけない"
  },
  "cases/customer-support-ai-dx/knowledge-design": {
    "方式判断機種を絞ってから検索する": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "機種以外の適合性とナレッジ運用": "cases/customer-support-ai-dx/knowledge-design#参照資料を継続して管理する",
    "意味の近さは回答根拠の適合性ではない": "cases/customer-support-ai-dx/knowledge-design#文書とメタデータを整備する",
    "横断検索の前に揃えるもの": "cases/customer-support-ai-dx/knowledge-design#文書とメタデータを整備する",
    "文書の適格性と回答項目の許可": "cases/customer-support-ai-dx/knowledge-design#検索対象の適格性と回答許可を分ける",
    "参照資料を回答に使える条件で分ける": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "回答生成の前に検索対象を制御する": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "文書の分割と検索結果の順位付けを設計する": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "矛盾と廃止を通常系として扱う": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "参照資料を継続して管理する": "cases/customer-support-ai-dx/knowledge-design#参照資料を継続して管理する",
    "semantic-similarityは回答資格ではない": "cases/customer-support-ai-dx/knowledge-design#検索対象の適格性と回答許可を分ける",
    "knowledge-sourceを回答資格で分ける": "cases/customer-support-ai-dx/knowledge-design#検索対象の適格性と回答許可を分ける",
    "retrievalを段階化する": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "chunkとrankingを文書構造に合わせる": "cases/customer-support-ai-dx/knowledge-design#対象に合う文書の中でベクトル検索する",
    "knowledgeを運用対象にする": "cases/customer-support-ai-dx/knowledge-design#参照資料を継続して管理する"
  },
  "cases/customer-support-ai-dx": {
    "代表設計事例の要点": "cases/customer-support-ai-dx#このbookについて",
    "数値と設計事例の位置付け": "cases/customer-support-ai-dx#このbookについて",
    "全体アーキテクチャ": "cases/customer-support-ai-dx/responsibility-boundary#システムの全体構成",
    "要件分析から開発検証運用への流れ": "cases/customer-support-ai-dx/executive-summary#担当範囲と事例の主題",
    "業務背景現行システム与えられた要求": "cases/customer-support-ai-dx/why-ai#現行業務と与えられた要求",
    "業務背景資料与えられた要求": "cases/customer-support-ai-dx/why-ai#現行業務と与えられた要求",
    "業務要求から必要なシステム能力へ": "cases/customer-support-ai-dx/responsibility-boundary#システム要件と機能分担",
    "システム方式と機能間の依存関係": "cases/customer-support-ai-dx/responsibility-boundary#システム要件と機能分担",
    "システム方式の改善と業務適用への見込み": "cases/customer-support-ai-dx/poc-metadata-improvement#103-月750件への適用から業務改善の見込みを判断する",
    "読み方到達点と限界": "cases/customer-support-ai-dx#このbookについて",
    "support-detail-customer": "cases/customer-support-ai-dx/stopping-conditions#support-detail-customer",
    "support-detail-knowledge": "cases/customer-support-ai-dx/stopping-conditions#support-detail-knowledge",
    "support-detail-rag": "cases/customer-support-ai-dx/stopping-conditions#support-detail-rag",
    "support-detail-genai": "cases/customer-support-ai-dx/stopping-conditions#support-detail-genai",
    "support-detail-decision": "cases/customer-support-ai-dx/stopping-conditions#support-detail-decision",
    "support-detail-human": "cases/customer-support-ai-dx/stopping-conditions#support-detail-human",
    "support-detail-response": "cases/customer-support-ai-dx/stopping-conditions#support-detail-response",
    "support-detail-feedback": "cases/customer-support-ai-dx/stopping-conditions#support-detail-feedback"
  },
  "cases/customer-support-ai-dx/poc-evaluation": {
    "本格開発前に基本動作を確認する": "cases/customer-support-ai-dx/poc-evaluation#本格開発前に3機能の実現可能性を確認する",
    "本格開発前に技術的な実現可能性を確認する": "cases/customer-support-ai-dx/poc-evaluation#本格開発前に3機能の実現可能性を確認する",
    "検証した3機能": "cases/customer-support-ai-dx/poc-evaluation#確認した3機能",
    "技術的な実現見込みを本格開発へつなぐ": "cases/customer-support-ai-dx/poc-evaluation#本格開発前に3機能の実現可能性を確認する"
  }
};
