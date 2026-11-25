---
title: "Career"
seo_title: "Career | 立林裕太朗のソフトウェア開発・保守とAI活用"
summary: "立林裕太朗の専門性、技術的バックグラウンド、代表実績と担当範囲、今後のキャリアを紹介します。詳細な経歴・資格・スキルセットはLinkedInにまとめています。"
layer: career
status: stable
last_updated: "2026-11-26"
source:
  type: repository
  url: https://github.com/nullcontroller/Rosarium/blob/master/src/content/career/overview.md
  commit: "ae8d6b5be128f332ba6a7be4e158cde1f8a937d4"
published_at: "2026-09-23"
publication_date_basis: fallback
---

## 何をする人か

**既存ソフトウェアの問題を調べ、仕様と変更影響を確認し、設計・改修・検証につなぐエンジニアです。** 要件整理から実装・評価までを経験してきました。AIにはコードや資料の探索を支援させ、根拠の確認と技術的な判断は自分で行います。

## 現在の専門性

- **既存システムの理解・保守・改善：** コード・仕様・動作を照合し、仮説と根拠、互換性、異常系、変更影響を確認します。
- **要件定義・システム設計：** 要求と制約を整理し、処理方式と責任分担、品質・評価条件を具体化します。
- **AIの業務適用：** 調査に必要な情報へアクセスできるAI環境を選び、探索・比較を支援させます。AI・検索・人間の役割と停止条件を設計します。

## 技術的バックグラウンド

2016年から、C# / .NETによるWindows向け業務ユーティリティの開発・保守に従事しています。外部システム連携を含む複数のユーティリティで、要件整理、設計、実装、評価、保守を経験してきました。

長期保守では、ソースコード、仕様書、UI、実動作を突き合わせ、現行仕様と依存関係を把握してきました。Pythonは調査・検証、自動化、AI活用に使用しています。

複数チームが関わる開発のプロジェクト推進・PMも経験し、全体影響、品質課題、優先順位、関係者調整を扱ってきました。

## 代表実績・設計事例

実務事例の成果・担当・評価条件を示します。背景、技術方式、判断過程は各事例で確認できます。

<div class="career-case-grid">
<section class="career-case" aria-labelledby="career-support" data-career-case="customer-support-ai-dx">
<p class="career-domain">専門領域：要件定義・システム設計</p>
<h3 id="career-support">顧客サポートDX</h3>
<dl>
<dt>主要成果</dt><dd class="career-result"><strong>PoC回答正答率72％から96％へ改善し、目標達成。</strong></dd>
<dt>担当内容</dt><dd>業務要求の整理、RAG管理システムの設計・構築、検索対象制御、評価方式の設計を担当しました。</dd>
<dt>評価条件・制約</dt><dd>本番運用での業務効果は未測定です。</dd>
</dl>
<p class="career-case-link"><a href="/cases/customer-support-ai-dx/">顧客サポートDXの詳細を見る</a></p>
</section>
<section class="career-case" aria-labelledby="career-investigation" data-career-case="ai-technical-investigation">
<p class="career-domain">専門領域：品質保証・障害解析</p>
<h3 id="career-investigation">複数のソフトウェアにまたがる障害調査</h3>
<dl>
<dt>主要成果</dt><dd class="career-result"><strong>メモリリーク解消。</strong><span>著者本人の稼働工数：2人日。</span></dd>
<dt>担当内容</dt><dd>仮説検証、コード調査、原因候補の評価、修正案の提案を担当しました。</dd>
<dt>評価条件・制約</dt><dd>担当チームが修正・効果検証を実施しました。工数削減効果は不明です。</dd>
</dl>
<p class="career-case-link"><a href="/cases/ai-technical-investigation/">障害調査の詳細を見る</a></p>
</section>
<section class="career-case" aria-labelledby="career-maintenance" data-career-case="three-ai-maintenance">
<p class="career-domain">専門領域：保守設計・内製化</p>
<h3 id="career-maintenance">レガシーソフトウェアの保守・改修</h3>
<dl>
<dt>主要成果</dt><dd class="career-result"><strong>開発期間約7割短縮。</strong></dd>
<dt>担当内容</dt><dd>要件整理から設計・実装・単体テストまで内製し、外部委託を不要にしました。</dd>
<dt>評価条件・制約</dt><dd>当初想定期間との比較です。AI単独の効果ではありません。</dd>
</dl>
<p class="career-case-link"><a href="/cases/three-ai-maintenance/">レガシー保守・改修の詳細を見る</a></p>
</section>
<section class="career-case" aria-labelledby="career-specification" data-career-case="specification-debt-review">
<p class="career-domain">専門領域：仕様管理・品質保証</p>
<h3 id="career-specification">仕様書の横断レビュー</h3>
<dl>
<dt>主要成果</dt><dd class="career-result"><strong>約40件の問題を確認し、レビュー・修正を約3時間で完了。</strong></dd>
<dt>担当内容</dt><dd>仕様書と現行コードの横断照合及び修正判断を担当しました。</dd>
<dt>評価条件・制約</dt><dd>従来手法との工数削減率は未評価です。約3時間は移行などの準備を含む全工程の所要時間ではありません。</dd>
</dl>
<p class="career-case-link"><a href="/cases/specification-debt-review/">仕様書レビューの詳細を見る</a></p>
</section>
</div>

## 仕事で重視すること

- **要求と方式を混同しない。**
  業務目標を技術名に置き換えず、必要な機能・品質・運用条件を定義したうえで方式を選びます。
- **AIの出力と判断責任を分ける。**
  AIには探索・比較・候補生成を任せても、根拠確認、採否判断、変更の承認は適切な人間の工程に残します。
- **作って終わりにしない。**
  現行システムの制約、Knowledgeの更新、保守・運用、評価を含めて、継続して扱える構造を重視します。

<span id="今後広げたい判断領域" aria-hidden="true"></span>
<span id="希望するrole" aria-hidden="true"></span>

## 目指すキャリア

私は、ITストラテジストとシステムアーキテクトの双方の専門性を究めたいと考えています。

ITストラテジストとして、経営や業務の課題を捉え、どのような価値を生み出すべきか、何をシステム化すべきか、どこに投資すべきかを判断する。

システムアーキテクトとして、その構想を具体的なシステム要件へ落とし込み、技術方式、アーキテクチャ、品質、保守性、運用までを設計する。

構想と実現の双方を理解し、事業価値につながるシステムを設計できる技術者を目指しています。システム企画・IT戦略・価値発見は、これから広げたい領域として区別しています。

**要件整理、AIの業務適用、既存システムの改善を継続的に担う技術専門職**を志向しています。
一つのシステムやサービスに継続して関わり、要件・方式・実装・評価・運用をつなぐ働き方が希望です。

**職歴・在籍期間・資格・詳細なスキルセットは[LinkedInプロフィール](https://www.linkedin.com/in/%E8%A3%95%E5%A4%AA%E6%9C%97-%E7%AB%8B%E6%9E%97-99076b352/)を参照してください。**
