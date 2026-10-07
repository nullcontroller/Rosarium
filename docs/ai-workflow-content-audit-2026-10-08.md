# AI業務設計の問いと説明の所有範囲（2026-10-08）

authoring-guide.md、content-maintenance.mdと対象11ページを全文監査。content-update-policy.mdは現在存在しない。追加で教育ページとBook入口も本文を確認した。

## 統合判断

`practices/ai-generation-and-work-completion` は `foundations/ai-business-design/evaluating-business-efficiency` へMERGE。

両者の問いは「AI導入で業務全体は効率化したか」で一致する。主張・具体例・評価方法・結論を比較すると、生成後の確認コスト、レビュー可能性、理解、合意、手戻りが共通する。実務経験だけを別ページへ置くより、原則と具体例を同じ章で読む方が自然。数値的な重複率は測定していない。

独自情報の移管確認：要件のMarkdown化、本人の理解不足と読み手への形式不足、設計レビューでの手戻り、Markdownの中間形式としての有用性、図表化の説明・自己理解への利用、自分の言葉で説明する5問、改善後の6工程を第2章に保持。60分対100分は説明用の仮例で、実測効果は主張しない。

## 問いと主な説明ページ

| 問い | ページ | 所有する説明 |
|---|---|---|
| Q1 責任は誰が持つか | Book第1章 delegation-and-responsibility | 作業と責任の分離、承認・移管の入口 |
| Q1a 人間へどう制御を戻すか | evaluation-hitl/responsibility-and-hitl | 状態・権限・承認・例外・監視・訂正。定義済みの確率と処理能力モデル |
| Q2 業務全体は効率化したか | Book第2章 evaluating-business-efficiency | 実務経験、レビューしやすさ、理解・説明・合意、総工数と経過時間、確認コスト、改善後の業務 |
| Q3 どこまで任せるか | foundations/applicability-and-delegation | 価値・リスク・検証可能性・可逆性・権限・復旧と委任レベル |
| Q4 どんな情報が必要か | Book第3章 asking-versus-delegating | 一般知識と組織固有の知識、RAGの限界、情報不足時の確認経路。資格学習の経験を保持 |
| Q5 いつ任せず止めるか | Book第4章 explainable-delegation | 根拠不足・矛盾・影響不明時の停止と役割縮小 |
| Q5a 判断する人をどう育てるか | Book第5章 human-judgment-capability | 判断難度、基礎知識、知識・情報・時間・権限、教育と運用からの学習 |
| Q6 使いこなすとはどんな状態か | practices/ai-adoption-and-effective-use | 全体像と各設計への入口。詳細手順を繰り返さない |
| Q7 なぜ能力が広がりにくいか | essays/ai-use-and-operation | 技術と組織の速度差、技能の差を隠す出力、能力共有という原因分析 |
| Q8 どう改善・終了を選ぶか | practices/adoption-governance | 試行・観察・再評価・担当者・継続/縮小/統合/終了と引き継ぎ |
| Q9 どう教えて学習を確かめるか | practices/education-and-capability | 原則と実践の教育設計、採用・棄却・保留を説明する練習、教材の更新 |

各ページで問いを理解するための短い前提は残すが、同じ説明の詳述は繰り返さない。Bookは責任→効率→必要情報→任せない条件→人間判断の既存章順を維持し、最終章から運用へ接続。総論から同じ問いの順で辿れる。

## 削減した重複と表現

- 第1章の確認コスト表を削減し、責任と承認の説明に集中。
- 委任設計の停止条件リストを第4章へ送り、委任費用式と5分対60分の仮例を削除。判断軸の日本語表へ変更。
- 第4章の責任定義・確認者の詳細条件・効率の再説明を対応する説明ページへ接続。
- 第3章の効率の再説明と結論反復、第5章の委任判断の詳述・結論反復・未掲載の次章予告を整理。
- 総論の情報・承認・権限・運用の詳細説明を、読者の問いと本文リンクへ置き換え。
- 教育ページの第5章相当の詳述を短い参照へ置き換え、教育と練習の設計に集中。
- Reviewability、Human Verification、Recovery、Process Redesign等は日本語で説明。HITL詳細の識別子・定義済みモデルは保持。計測量が定義されていない最終足し算は文章化。
- 原因分析のSkill Gap等は日本語化。問いと主張、公開日を維持。

## URL・記録・公開範囲

旧公開URLは既存のSite + meta refresh + location.replace + 通常リンク方式で第2章へ転送。noindex、転送先canonical、右補助領域なし。通常一覧・検索・sitemap・feedでは第2章へ集約。公開本文に編集・移行事情を載せない。

10月8日のGarden Notesは1entryでREVISED。「AI業務設計に関する記事を10件改訂」と件数を表示し、各記事の具体的な改訂内容は記事末尾の更新履歴に表示する。廃止した独立記事の「新規公開」は残さない。10月7日の事実に基づく新規公開・改訂の区別は変更しない。

既存Lifecycle・章タイトル・章順・URL・元公開日・source snapshotは保持。復旧台帳では総論の旧checksumと改訂理由・履歴を残し、元snapshotは変更しない。新記事の旧本文はGit履歴から追跡可能。

## 対象外を維持する理由

コード評価は実装の採用基準、コスト経路はモデルの実行経路、Knowledge関連は情報取得の詳細、仕様書レビューCaseは根拠探索と人間の変更判断を扱う。問いが異なるため、今回の経験を重複して追加しない。Bookの既存図・UI・theme・GA4は変更しない。

## 残る検証課題

実務経験の導入前後の所要時間は未測定。仮例から効果を推定しない。実運用で測定結果を得た場合に、同じ品質・完成条件で再評価する。編集上の完成と、実務効果の実証は区別する。

## 最終検証結果

- npm run check：125 Astro files、errors/warnings/hints 0。
- npm test：40件成功。
- npm run build：141 HTML、7,607 local links/assets、118 sitemap URLs、孤立ページ0。Lifecycle・SEO・GA4・日付・TOC・accessibility・performance監査成功。
- Pagefind：98ページ。合意形成の検索で第2章を確認、旧独立記事は検索結果へ出ない。
- Chrome：1920×1080、1440×900、375×812、430×932 × Dark/Lightの128ページ確認。横スクロールなし、目次アンカー有効、10月8日の10個の改訂項目はHome/詳細とも独立リンク。
- 第1章→第2章→第3章→第4章→第5章→運用の本文リンクを操作確認。
- 旧URLのJavaScript有効/無効双方の転送、noindex・canonical・meta refreshを確認。
- 改訂した既存12ページのtitle/lifecycle/status/published_at/source/series/orderは変更前と一致。
- 対象本文の同じh2/h3見出し、100文字以上の同一長文段落なし。原則を理解するための短い前提の共有は許容。
- 機密チェック：社名・製品名・人名・正式会議名・実コード・内部ファイル名を実務経験へ追加していない。実測でない時間を仮例と明記。
