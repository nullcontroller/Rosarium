# 投稿思想の既存知識への統合（2026-10-06）

## 判断
新規記事は作成しない。価値から対象・役割・Architectureを決め、実装・導入・定着・評価・改善・統合・終了までを設計する、という考えを既存の責務へ分けて補強する。

| 対象 | 判断・統合内容 |
| --- | --- |
| essays/ai-roles-beyond-fde | 専門性分化は既存。作る費用・依頼範囲の変化、引き渡し後の持続性、顧客の改善能力、Architecture/Enablementは不足。OBSOLETEと原文を維持し日付付き追記。 |
| essays/dx-and-value | 価値起点は既存。削減時間の顧客理解・判断・企画・改善・学習・創造への再配分を補強。 |
| foundations/ai-business-design | 責任分界と業務全体の評価は既存。価値再配分と導入・定着・評価・改善・統合・終了の循環を補強。source.metadataの原本紹介は変更しない。 |
| essays/what-not-to-build-with-ai | 作らない判断の正本。生成能力の普及→維持対象の増加→選択・維持・終了判断の価値、という因果を明確化。 |
| essays/it-strategy-and-not-building | IT戦略・資源配分と維持/廃止責任を維持。AIによる構築費用低下との接続だけ追記し、詳細は上記へリンク。 |
| essays/legacy-change-and-retirement | 変更容易性と段階的廃止が既に明確。変更しない。 |
| software-engineering/code-generation-and-work-design | 設計支援の実務に役割がある。実装価値を否定するように読める原文を日付付き追記で見直し、Lifecycle全体の評価へ接続。原文は保持。 |
| practices/adoption-governance | 導入・評価・例外運用は既存。組織内の改善能力、定着の評価、統合・終了の見直し条件を補強。 |
| career/overview | 企画から評価・改善・統合・終了まで既に説明済み。長文化しない。 |
| About | Knowledge Lifecycleの理念の正本として改訂・関係のつなぎ直しを明確化。可視化の方針を一か所だけ追記。 |
| Garden Notes | 理念はAboutへ参照し、内容統合の読者向け記録を1件追加。 |

## 重複とLifecycle
what-not-to-build-with-aiとit-strategy-and-not-buildingは「作らない判断」で重なるが、前者はAIによる生成能力と選択、後者はIT戦略の資源配分・維持/廃止費用を担う。legacy記事は既存資産の変更容易性と段階移行に集中する。今回の補強で役割が完全に重複した記事はなく、Lifecycle変更候補なし。FDEは旧考察としてOBSOLETEを維持し、新しい追記を現在の正式な職種分類として扱わない。

## 外部情報と原本
Gartner一次ソース（2026-09-29）は確認済み。70%/2028の記述は将来予測として明示し、FDE消滅の根拠にはしない。
https://www.gartner.com/en/newsroom/press-releases/2026-09-29-gartner-predicts-70-percent-of-enterprises-will-abandon-agentic-ai-built-by-vendor-forward-deployed-engineering-by-2028

FDEとコード生成記事は回収本文のhash検証対象。原文checksum・source snapshot・source metadata・公開日を変更せず、追記境界・日付・理由・追記checksumを回収記録へ追加。検証は原文と追記を別々に行い、両方の改変を検出する。

UI/CSS、URL、slug、title、Lifecycle、公開・検索・SEO方針に変更なし。本文・About見出し・更新日・最新Garden Notesは依頼による内容更新。

## 最終検証
- npm run check: 123 files、0 errors / warnings / hints。content provenance / content health成功。
- npm test: 37成功。原文・追記の改変、日付不一致、marker重複、理由欠落を検出する回帰テスト3件を追加。
- npm run build: 138 HTML pages、96 Pagefind対象、7394 local links/assets。全既存監査成功（index、Lifecycle、Navigation、公開サイト、brand assets、accessibility、performance、SEO、GA4、最終更新、TOC）。
- 最初のindex監査は更新日を旧値2026-10-04に固定していたため停止。記事metadata.last_updatedとの一致を検証する形へ修正し、最終buildの全監査成功を確認。
- 98 content recordsのtitle / slug / 公開日 / status / lifecycle / 出典 / 分類 / series等をHEADと比較して一致。148 output routes/file inventory一致。
- UI/CSS/component/layout/configへの変更なし。Careerとlegacy-change-and-retirementは内容も変更なし。
- 11ページ × 1920×1080 / 1440×900 / 375×812 / 430×932 × dark/lightの88条件で、横overflowなし・本文とsidebar重なりなし・Desktop/Mobile共通TOC・anchor/active動作正常。最新Garden Notesの日付とFDEのobsolete metadataを確認。client errorなし。実機確認は未実施。

## Garden Notesから本文へのリンク（追加要件）
2026-10-06の既存entryの4変更項目へ、今回改訂した7コンテンツのidを追加。同じ記事はentry内で1回だけ参照する。
GrowthEntryがcontent metadataから正式titleを取得し、共通url helperで内部URLを生成するため、HomeとGarden Notes詳細で表示名・遷移先を二重管理しない。
過去の文字列形式の記録も維持。今後の新規Article/Case/Book、大幅改訂、統合先の正本はtextとcontentIdsを持つ形式を使用し、CSS/UI/refactor/metadata/typo等の変更には記事リンクを追加しない。
CSS・構造・4項目表示・同日1件は維持。誤った内部id、未公開コンテンツ、同日重複entry、同一entry内の重複リンクは検証で失敗させる。
check: 0 errors/warnings/hints。test: 40成功。buildと全既存監査成功。
HomeとGarden Notes詳細を1920/1440/375/430、dark/lightの16条件で確認。112回の記事タイトルクリックが正しい内部URLとh1へ遷移。7リンクの一致・重複なし・横overflowなし。実機確認は未実施。
