"""Render author-created explanatory SVGs; standard library only."""
from pathlib import Path
from html import escape

OUT=Path(__file__).resolve().parents[1]/'public/diagrams/ai-math-connections'
OUT.mkdir(parents=True,exist_ok=True)
PALETTES={
 'light':('#f5f9f7','#ffffff','#163d34','#477d6c','#415d55'),
 'dark':('#152326','#203438','#e2f0eb','#9bcebc','#becfc9'),
}
FIGURES={
 'lm-policy':('回答を作る処理と学習の更新',[
  ('入力と接頭辞を状態へ',['例：入力「2+3は？」']),
  ('方策から次トークンを選ぶ',['モデルの重み → 選択確率']),
  ('回答が完了したら採点',['「5」→ 1 ／「6」→ 0']),
  ('報酬と対数確率の勾配',['期待報酬の更新方向を推定']),
  ('学習工程で重みを更新',['次の生成の確率が変わる']),
 ]),
 'lm-scaling':('LLMの学習と利用へ予算を配る',[
  ('学習前：規模と読む量を選ぶ',['重みの数 N ／ トークン数 D']),
  ('学習：予測・損失・重み更新',['予算 C ≈ κND の下で反復']),
  ('同じ条件で予測損失を比較',['経験式 L(N,D) で配分を検討']),
  ('利用：重みを固定して生成',['推論トークン需要 U に費用']),
  ('総費用まで含めて選び直す',['低い損失 ≠ 能力の保証']),
 ]),
}
for name,(title,steps) in FIGURES.items():
 for mode,(bg,surface,ink,accent,muted) in PALETTES.items():
  parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">本文のAI処理と数式の対応を示す人工的な説明図。特定製品の実装図や実測ではない。</desc><rect width="480" height="640" fill="{bg}"/><g font-family="system-ui,sans-serif" fill="{ink}">',f'<text x="240" y="36" text-anchor="middle" font-size="23">{escape(title)}</text>']
  for i,(heading,lines) in enumerate(steps):
   y=60+i*108
   parts.append(f'<rect x="24" y="{y}" width="432" height="85" rx="8" fill="{surface}" stroke="{accent}" stroke-width="2"/>')
   parts.append(f'<text x="240" y="{y+32}" text-anchor="middle" font-size="22">{escape(heading)}</text>')
   for j,line in enumerate(lines):
    parts.append(f'<text x="240" y="{y+62+j*25}" text-anchor="middle" font-size="21" fill="{muted}">{escape(line)}</text>')
   if i<4:
    parts.append(f'<path d="M240 {y+87}V{y+105}m-6-7 6 7 6-7" stroke="{accent}" stroke-width="2" fill="none"/>')
  parts.append(f'<text x="240" y="624" text-anchor="middle" font-size="20" fill="{muted}">対応を理解する模式図・実測ではない</text></g></svg>')
  (OUT/f'{name}-{mode}.svg').write_text(''.join(parts),encoding='utf-8')
