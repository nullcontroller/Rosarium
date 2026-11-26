"""Generate repository-native SVGs from verified artificial data."""
from pathlib import Path
from html import escape
from verify import icl, ssm, diffusion

OUT=Path(__file__).resolve().parents[2]/'public/diagrams/math-phase-three'
OUT.mkdir(parents=True,exist_ok=True)
COLORS={'light':('#f5f9f7','#fff','#163d34','#477d6c','#415d55'), 'dark':('#152326','#203438','#e2f0eb','#9bcebc','#becfc9')}
FLOWS={
'icl-context':('例示を入力へ、重みは固定',[
('指示のみ → Zero-shot','例なしで回答の分布を計算'),
('指示＋一例 → One-shot','例：「楽しい → 肯定」'),
('指示＋少数例 → Few-shot','例の規則・形式を手掛かりに'),
('同じ重みで文脈を参照','Attention → 回答の分布'),
('追加学習とは分ける','学習では損失から重みを更新')]),
'moe-routing':('同じFFNか、選んだExpertか',[
('Dense：全トークン','共通のFFNで表現を変換'),
('MoE：入力 → Router','スコアを計算し Top-k を選択'),
('選ばれたExpertだけ実行','例：4個のうち2個を選ぶ'),
('出力を重み付きで合成','正規化の有無は方式で異なる'),
('残る費用も数える','共通層・重み保持・通信・偏り')]),
'ssm-structure':('過去を参照するか、集約するか',[
('Attention：過去の表現','Key・Valueを保持して参照'),
('SSM：入力 x と前状態 h','更新して次の状態へ渡す'),
('状態から出力を読む','履歴全体の原文保存ではない'),
('LTI：固定の更新規則','展開すると畳み込みになる'),
('Selective：入力で規則を変化','一般には固定核を使い回せない')]),
'diffusion-generation':('文章を確定する順序を変える',[
('自己回帰：左から確定','猫 → 猫 が → 猫 が 眠る'),
('マスク型：複数位置を未確定','[M] [M] [M] から復元'),
('文脈を読み、各位置を予測','猫 [M] [M] → 猫 が 眠る'),
('学習：壊した文を復元','順方向のノイズと逆過程'),
('推論：復元を反復する','更新回数と一回の費用を数える')]),
}

for mode,(bg,surface,ink,accent,muted) in COLORS.items():
 def text(x,y,value,size=22,color=None,anchor='middle'):
  return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" fill="{color or ink}">{escape(value)}</text>'
 def begin(title,height):
  return [f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="{height}" viewBox="0 0 480 {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">本文の条件を限定した説明図。実モデルの性能測定ではない。</desc><rect width="480" height="{height}" fill="{bg}"/><g font-family="system-ui,sans-serif">',text(240,35,title,23)]
 def save(name,parts,height):
  parts+=[text(240,height-15,'模式図・人工例 / 実測性能ではない',18,muted),'</g></svg>']
  (OUT/f'{name}-{mode}.svg').write_text(''.join(parts),encoding='utf-8')
 for name,(title,steps) in FLOWS.items():
  parts=begin(title,650)
  if name in ('moe-routing','ssm-structure','diffusion-generation'):
   def panel(y,height,label,lines):
    parts.append(f'<rect x="20" y="{y}" width="440" height="{height}" rx="8" fill="{surface}" stroke="{accent}" stroke-width="2"/>')
    parts.append(text(240,y+34,label,23))
    for j,line in enumerate(lines):parts.append(text(240,y+75+j*35,line,21,muted))
   if name=='moe-routing':
    panel(60,150,'Dense：共通のFFN',['全トークン → 同じFFN → 出力','比較対象を固定して費用を数える'])
    panel(240,305,'MoE：一部のExpertを選ぶ',['入力 → Router → Top-k 選択','E0 ✓　E1 ✓　E2 −　E3 −','選択した2個だけを計算','→ 重み付き合成 → 出力','正規化の有無は方式で異なる'])
    parts.append(text(240,590,'共通層・全重み保持・通信は残る',21))
   elif name=='ssm-structure':
    panel(60,180,'Attention：過去を参照',['現在のQuery → 過去のKey/Value','参照の重み → 値の集約 → 出力','生成中は過去のKVを保持する'])
    panel(270,225,'SSM：状態を更新',['入力 x ＋ 前状態 h → 次状態 h','次状態から出力を読む','履歴全体の原文保存ではない','LTIなら固定の核へ展開できる'])
    parts.append(text(240,550,'Selective：入力で更新規則を変える',21))
    parts.append(text(240,585,'一般には固定核を使い回せない',21,muted))
   else:
    panel(60,180,'自己回帰：接頭辞から次へ',['猫 → 猫 が → 猫 が 眠る','左から確定し、次の条件へ戻す','逐次依存を持つ生成'])
    panel(270,225,'マスク型：未確定位置を復元',['[M] [M] [M] → 猫 [M] [M]','→ 猫 が 眠る（模式例）','学習：壊した文から内容を予測','生成：復元器を反復して使う'])
    parts.append(text(240,550,'並列更新できる ≠ 必ず高速',21))
    parts.append(text(240,585,'更新回数 × 一回の計算費用も比較',21,muted))
   save(name,parts,650)
   continue
  for i,(head,line) in enumerate(steps):
   y=60+i*110
   parts += [f'<rect x="20" y="{y}" width="440" height="87" rx="8" fill="{surface}" stroke="{accent}" stroke-width="2"/>',text(240,y+33,head),text(240,y+66,line,20,muted)]
   if i<4:parts+=[f'<path d="M240 {y+89}v18m-6-7 6 7 6-7" stroke="{accent}" stroke-width="2" fill="none"/>']
  save(name,parts,650)
 parts=begin('例示で変わる、タスクAの確率',500)
 for i,row in enumerate(icl()['posterior_rows']):
  y=90+i*115;p=row['posterior'][0]
  parts += [text(28,y,f"{row['examples']}例：P(A) = {p:.3f}",22,anchor='start'),f'<rect x="28" y="{y+16}" width="424" height="30" fill="{surface}" stroke="{accent}"/><rect x="28" y="{y+16}" width="{424*p}" height="30" fill="{accent}"/>',text(28,y+78,f"次の回答1の確率 = {row['probability_answer_1']:.3f}",20,muted,anchor='start')]
 save('icl-posterior',parts,500)
 parts=begin('4トークンの割当を比較する',500)
 for group,(label,values) in enumerate([('集中したTop-1',[4,0,0,0]),('分散させた対照条件',[1,1,1,1])]):
  top=70+group*195;parts+=[text(240,top,label)]
  for e,v in enumerate(values):
   x=55+e*105;parts += [f'<rect x="{x}" y="{top+120-v*22}" width="54" height="{max(v*22,1)}" fill="{accent}"/>',text(x+27,top+143,f'E{e}: {v}',19)]
 save('moe-load',parts,500)
 parts=begin('一入力の寄与はどう残るか',500)
 kernels=ssm()['memory_kernels']
 for index,(a,values) in enumerate(kernels.items()):
  points=' '.join(f'{45+j*48},{350-v*235}' for j,v in enumerate(values))
  parts += [f'<polyline points="{points}" stroke="{accent if index==0 else muted}" stroke-width="3" fill="none"'+(' stroke-dasharray="9 5"' if index else '')+'/>',text(240,65+index*28,f'a={a} '+('実線' if index==0 else '破線'),20)]
 average=[(a+b)/2 for a,b in zip(kernels['0.5'],kernels['0.9'])]
 points=' '.join(f'{45+j*48},{350-v*235}' for j,v in enumerate(average))
 parts += [f'<polyline points="{points}" stroke="{ink}" stroke-width="2" stroke-dasharray="2 5" fill="none"/>',text(240,118,'二状態の平均：点線',20)]
 parts += [f'<path d="M45 105V350H445" fill="none" stroke="{ink}"/>',text(240,388,'経過した位置差 ℓ：0 → 8',20),text(240,424,'二状態では両方の減衰を保持できる',20,muted)]
 save('ssm-memory',parts,500)
 parts=begin('マスクして壊し、逆確率で戻す',500)
 for i,(label,values) in enumerate(zip(['完成データ','1段マスク','全マスク'],diffusion()['marginals'])):
  y=85+i*120;parts += [text(240,y,label),text(240,y+35,' / '.join(f'{name}: {v:.1f}' for name,v in zip(['A','B','M'],values)),22,muted)]
  if i<2:parts+=[text(240,y+82,'↓ 順方向   ↑ oracle逆過程',20)]
 save('diffusion-mask',parts,500)
print(f'Generated {len(list(OUT.glob("*.svg")))} SVG assets')
