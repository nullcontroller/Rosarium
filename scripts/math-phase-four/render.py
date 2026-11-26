from pathlib import Path
from html import escape
OUT=Path('public/diagrams/math-phase-four');OUT.mkdir(exist_ok=True,parents=True)
C={'light':('#f5f9f7','#ffffff','#163d34','#477d6c','#415d55'),'dark':('#152326','#203438','#e2f0eb','#9bcebc','#becfc9')}
flows={
'interpretation-flow':('内部を観測し、介入で確かめる', [('言語モデルの入力と出力','例：首都を答える文脈'),('活性化を観測する','相関だけで原因とは決めない'),('SAEで表現を近似する','疎な特徴と再構成誤差を調べる'),('成分を置換・除去する','対照条件の出力変化を比較する'),('条件付きの証拠を評価する','全判断の完全な説明ではない')]),
'computation-contract':('どの計算条件を比べるか', [('入力：長さ n のトークン列','固定長のテストか、長さ一般か'),('モデル：層 L・幅 d・精度 b','Attention・位置表現も定義する'),('中間生成：k(n) 回の更新','重み更新とは異なる計算の反復'),('記憶：参照できる窓 W(n)','外部記憶・位置カウンターも区別'),('最終回答を出力する','表現可能・学習可能・汎化は別')]),
'proof-pipeline':('生成と検査の責務を分ける', [('人間：問題と前提を形式化','現実の要求との対応を確認'),('AI：証明候補を生成する','中間目標・規則の選択を提案'),('記号的な検査器で確認する','構文・参照・規則・目標を照合'),('不受理 → 候補を再検討','受理 → 指定体系での証明'),('人間：保証の範囲を確認','前提・公理・検査実装への信頼')]),
'proof-steps':('既に得られた式から次へ進む', [('前提 P と P → Q','どちらも前提の一覧から引用'),('モーダスポネンスを適用','P と P → Q から Q を得る'),('得られた Q と前提 Q → R','以前の行だけを参照する'),('もう一度、同じ規則を適用','Q と Q → R から R を得る'),('最後の式が目標 R と一致','自然な文章だけでは受理しない')]),
}
for mode,(bg,panel,ink,accent,muted) in C.items():
 def txt(x,y,s,size=22,color=None):return f'<text x="{x}" y="{y}" text-anchor="middle" fill="{color or ink}" font-size="{size}">{escape(s)}</text>'
 def begin(title):return [f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">本文の条件に限定した模式図と人工計算例。実モデルの性能測定ではない。</desc><rect width="480" height="640" fill="{bg}"/><g font-family="system-ui,sans-serif">',txt(240,36,title,23)]
 def box(parts,y,label,detail):
  parts.append(f'<rect x="20" y="{y}" width="440" height="84" rx="8" fill="{panel}" stroke="{accent}" stroke-width="2"/>');parts.extend([txt(240,y+32,label),txt(240,y+64,detail,20,muted)])
 def save(name,p):
  p.extend([txt(240,623,'説明用の模式図・人工例',18,muted),'</g></svg>']);(OUT/f'{name}-{mode}.svg').write_text(''.join(p),encoding='utf-8')
 for name,(title,steps) in flows.items():
  p=begin(title)
  for i,(label,detail) in enumerate(steps):
   y=60+i*108;box(p,y,label,detail)
   if i<4:p.append(txt(240,y+103,'↓',23,accent))
  save(name,p)
 p=begin('相関と介入の効果を分ける')
 box(p,65,'観測では u = v','出力との相関は、どちらも 1')
 box(p,175,'人工 readout：M = 2u − 0.5','clean (1,1)：1.5 ／ corrupt (0,0)：−0.5')
 p.append(txt(240,300,'置換による回復比 R',23))
 for y,label,val in [(340,'u を置換',1),(425,'v を置換',0)]:
  p.append(txt(110,y,label,21));p.append(f'<rect x="205" y="{y-23}" width="225" height="28" fill="{panel}" stroke="{accent}"/>')
  if val:p.append(f'<rect x="205" y="{y-23}" width="225" height="28" fill="{accent}"/>')
  p.append(txt(315,y+35,f'R = {val}',21))
 p.extend([txt(240,535,'観測相関が同じでも効果は異なる',21),txt(240,573,'この人工因果グラフの条件に限る',20,muted)]);save('patching-comparison',p)
 p=begin('3状態を、入力順に更新する')
 box(p,65,'初期状態 0 ／ 入力 abba','a：循環　b：0 と 1 を交換')
 p.append(txt(240,215,'0 → 1 → 0 → 1 → 2',29));p.append(txt(240,255,'a　　 b　　 b　　 a',22,muted))
 box(p,300,'直列に状態を更新','前の状態から次へ：n 段')
 box(p,410,'遷移関数を木状に合成','結合則を使う：O(log n) 段')
 p.extend([txt(240,545,'順序は交換できない',22),txt(240,580,'ab → 0　／　ba → 2',22,muted)]);save('state-composition',p)
print('Generated 12 SVGs (6 figures × 2 themes)')
