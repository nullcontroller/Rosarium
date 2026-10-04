# Career統合監査（2026-10-04）

## 分類と役割

| 元の内容 | 判断 |
| --- | --- |
| Careerの仕事の射程、AI適用の判断、人間の責任、変更・統合・終了、今後の志向 | Careerへ残し、重複した言い換えを削減 |
| Detailsの開発・保守・要件分析・プロジェクト推進・生成AI / RAGと現在の仕事のつながり | 「経験と現在の仕事のつながり」へ短く統合 |
| DetailsのSelected Workと両ページのCase紹介 | Casesを正本としCareerから削除 |
| DetailsのWhat I Do、Design Perspective、Career Directionの反復 | Careerの該当主題へ整理 |
| Rosariumの実装・継続実践説明 | Aboutや実装と重複するため削除 |
| 職歴・所属・資格の詳細 | LinkedInを正本とし案内1件のみ維持 |

Careerは人物・仕事観、Casesは実践の証拠、LinkedInは客観的な経歴を扱う。
新しい成果・数値・担当範囲は追加していない。

## 廃止と互換性

公開Details本文をContent Collectionから削除。原文は出典照合のためdocs/historyへ非公開資料として移し、既存の移行マニフェストに記録。
旧URLはGitHub Pagesの静的HTML転送（meta refreshとlocation.replace）でCareerへ移動する。HTTP 301ではない。
旧URLはnoindex、canonicalはCareer。sitemapと公開内部リンクからDetailsを除外。

## 文章量

frontmatter、HTMLタグ、リンクURL、Markdown装飾、空白を除いた概算で、旧2ページ 3602文字から新Career 974文字へ削減（約73%減）。
