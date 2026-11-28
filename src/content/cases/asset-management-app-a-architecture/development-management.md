---
title: "06. 生成AIへの開発管理の委任"
summary: "5日間の開発で、人間・ChatGPT・Codexの役割を分け、開発管理をAIへ委ねた。判断待ちの構造と実利用からの改善を説明する。"
layer: "publication"
kind: "case"
section: "cases"
case_context: "personal"
case_specialty: "システム方式設計・システムアーキテクチャ"
status: "published"
public: true
lifecycle: "active"
published_at: "2026-11-28"
last_updated: "2026-11-28"
entry_points: ["ai"]
tags: ["個人開発", "システム方式設計", "運用設計"]
series: "asset-management-app-a-architecture"
series_title: "個人資産管理Webアプリの設計と開発 ― 低コスト・低保守負担を目指したシステム構築"
order: 6
---

## この章の問い

生成AIで実装を進めやすくなったとき、人間の判断待ちが開発を制約することをどう防ぐか。

## 開発管理を委任する目的

ChatGPTとCodexを活用し、資産管理アプリAを5日間で開発した。重視したのはコード生成だけでなく、開発管理の大部分をAIへ委ね、人間が重要な意思決定に集中できる役割分担である。

## 人間・ChatGPT・Codexの責任分界

|担い手|担当したこと|
|---|---|
|人間（私）|目的・制約の設定、重要な意思決定、最終承認|
|ChatGPT|要求整理、設計、実装指示、品質レビュー、改善管理|
|Codex|実装、テスト、修正|

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/asset-management-app-a-architecture/development-responsibility-light.svg" alt="人間は目的・制約・重要判断、ステージングでの評価、最終承認を担う。ChatGPTは要求整理・指示とレビューZIPの確認を担い、Codexは実装・テストと二つの成果物の用意を担う" width="440" height="630" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/asset-management-app-a-architecture/development-responsibility-dark.svg" alt="人間は目的・制約・重要判断、ステージングでの評価、最終承認を担う。ChatGPTは要求整理・指示とレビューZIPの確認を担い、Codexは実装・テストと二つの成果物の用意を担う" width="440" height="630" loading="lazy" />
  <figcaption>開発における責任分界。破線は人間、太線はAI支援を表す。工程の順序ではなく、担当する責務と確認対象を示す。</figcaption>
</figure>

## 人間の判断がボトルネックになる構造

AIによって実装が高速化しても、人間がすべての指示、レビュー、修正判断を担うと、実装の前後に判断待ちが集まる可能性がある。そこで、通常の開発管理をAIへ委ね、目的や制約に影響する重要な判断と最終承認を私が担う構成にした。

<figure class="diagram diagram-static">
  <img class="diagram-light" src="/diagrams/ai-development-management/bottleneck-light.svg" alt="全作業を人間が管理する構造では実装の前後に指示・レビュー・修正判断が集中する。通常管理をAIへ委任する構造では要求・実装指示・レビューをAIが支援し、人間は目的・重要判断・最終承認を保持する" width="440" height="864" loading="lazy" />
  <img class="diagram-dark" src="/diagrams/ai-development-management/bottleneck-dark.svg" alt="全作業を人間が管理する構造では実装の前後に指示・レビュー・修正判断が集中する。通常管理をAIへ委任する構造では要求・実装指示・レビューをAIが支援し、人間は目的・重要判断・最終承認を保持する" width="440" height="864" loading="lazy" />
  <figcaption>判断のボトルネックと委任の比較。上段は比較用の構造、下段は今回の役割分担を整理した概念図。人間は目的・重要判断・最終承認を保持する。</figcaption>
</figure>

## 実利用を起点とする短い改善サイクル

実際にアプリを使って問題や改善点を見つけ、ChatGPTが要求と実装指示へ整理する。Codexが実装・テストを行い、レビューの結果に応じて修正する。この短いサイクルを繰り返し、実利用で得た気づきを次の改善へつなげた。

同様の方式をRosariumの開発・運用保守にも適用している。システムの用途が異なっても、要求整理、実装指示、レビュー、改善という作業のつなぎ方を共通化している。

## 次の論点

[第7章：レビュー方式と品質保証](/cases/asset-management-app-a-architecture/review-and-quality/)へ進む。
