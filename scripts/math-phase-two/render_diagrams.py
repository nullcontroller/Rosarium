"""Rebuild repo-native SVGs. No raster images or external plotting packages."""
import html
import math
import sys
from pathlib import Path

OUT=Path(__file__).resolve().parents[2]/'public/diagrams/math-phase-two'
if '--output' in sys.argv:
    OUT=Path(sys.argv[sys.argv.index('--output')+1])
OUT.mkdir(parents=True,exist_ok=True)
PALETTES={
    'light':dict(bg='#f5f9f7',surface='#ffffff',ink='#163d34',accent='#477d6c',muted='#415d55',second='#805b28'),
    'dark':dict(bg='#152326',surface='#203438',ink='#e2f0eb',accent='#9bcebc',muted='#becfc9',second='#e4c28c'),
}


def svg(name,mode,title,height,draw):
    c=PALETTES[mode]
    markup=f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="{height}" viewBox="0 0 480 {height}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(title)}</title><desc id="desc">説明用の模式図。本文の定義と成立条件を参照。</desc><rect width="480" height="{height}" fill="{c["bg"]}"/><g font-family="system-ui,sans-serif" fill="{c["ink"]}">{draw(c)}</g></svg>'
    (OUT/f'{name}-{mode}.svg').write_text(markup,encoding='utf-8')


def text(x,y,s,size=22,anchor='middle',color=None):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}"'+(f' fill="{color}"' if color else '')+'>'+html.escape(s)+'</text>'


def box(c,y,lines,x=24,w=432,h=70):
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{c["surface"]}" stroke="{c["accent"]}" stroke-width="2"/>'
    for j,line in enumerate(lines):s+=text(x+w/2,y+(h/2-5 if len(lines)==2 else h/2+8)+j*27,line)
    return s


def arrow(c,y1,y2,x=240):
    return f'<path d="M{x} {y1}V{y2}m-6-7 6 7 6-7" stroke="{c["accent"]}" stroke-width="2" fill="none"/>'


flows={
 'policy':('報酬から方策更新へ',560,[['方策 π から行動を生成'],['収益 G − 基準 b'],['score ∇ log π と掛ける'],['標本平均で方策を更新'],['独立に目的・挙動を評価']]),
 'rlvr':('グループを使った報酬評価',650,[['同じ問題 → G 個の回答'],['検証器 v で報酬を計算'],['平均・標準偏差で相対化'],['分散 0 は明示的に処理'],['クリップ項 ＋ 参照への KL'],['未使用の問題で評価']]),
}
for name,(title,height,steps) in flows.items():
 for mode in PALETTES:
    def draw(c):
        s=text(240,35,title,24)
        for i,lines in enumerate(steps):
            y=57+i*94;s+=box(c,y,lines)
            if i<len(steps)-1:s+=arrow(c,y+72,y+91)
        return s+text(240,height-12,'実モデルの性能測定ではない',19,color=c['muted'])
    svg(name,mode,title,height,draw)

for mode in PALETTES:
 def preference(c):
    s=text(240,36,'同じ比較から、二つの学習経路',24)
    s+=box(c,60,['入力 x と回答対 (勝ち・負け)'])
    s+=text(130,170,'RLHF',24)+text(350,170,'DPO',24)
    for x,lines in [(20,[['報酬モデルを','比較から学習'],['生成を採点し','方策を更新']]),(250,[['方策と参照の','対数確率比'],['比較の損失を','直接最小化']])]:
        for i,ls in enumerate(lines):
            y=195+i*125;s+=box(c,y,ls,x=x,w=210,h=95)
            if i==0:s+=arrow(c,y+97,y+120,x=x+105)
    s+=box(c,470,['比較モデル・支持集合が前提','選好 ≠ 真偽・安全性'],h=100)
    return s+text(240,625,'学習経路が無条件に等価とは限らない',20,color=c['muted'])
 svg('preference',mode,'RLHFとDPOの構造',650,preference)

 def speculation(c):
    s=text(240,36,'受理と補正で分布を保存',24)
    s+=box(c,60,['Draft 分布 q → 提案 x'])+arrow(c,132,159)
    s+=box(c,163,['Target p と比較','a(x) = min(1, p(x) / q(x))'],h=100)
    s+=text(126,300,'受理',22)+text(353,300,'棄却',22)
    s+=box(c,321,['提案 x を','そのまま採用'],x=20,w=210,h=100)
    s+=box(c,321,['不足 (p − q)₊','から引き直す'],x=250,w=210,h=100)
    s+=arrow(c,423,468,x=125)+arrow(c,423,468,x=355)
    s+=box(c,480,['受理質量 ＋ 補正質量 = p','棄却後の提案接頭辞は捨てる'],h=100)
    return s+text(240,625,'分布の一致 ≠ 同一シードの出力一致',20,color=c['muted'])
 svg('speculation',mode,'投機的復号の受理と補正',650,speculation)

 def clip(c):
    s=text(240,35,'PPO：単項のクリップ目的',24)
    for i,a in enumerate([1,-1]):
        y0=100+i*180
        s+=text(240,y0-20,'Advantage = '+str(a),22)
        s+=f'<path d="M60 {y0+110}H440M60 {y0}V{y0+120}" stroke="{c["muted"]}" fill="none"/>'
        pts=[]
        for j in range(101):
            rho=j/50
            val=min(rho*a,max(.8,min(1.2,rho))*a)
            y=y0+110-val*70 if a>0 else y0+10-val*45
            pts.append(f'{60+rho*180:.2f},{y:.2f}')
        s+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="{c["accent"]}" stroke-width="3"/>'
        s+=text(60,y0+145,'0',18)+text(240,y0+145,'1',18)+text(420,y0+145,'2',18)
    return s+text(240,461,'横軸：確率比 ρ ／ ε = 0.2',20)+text(240,495,'KL の厳密な上限制約ではない',21)
 svg('policy-clip',mode,'PPOの正負Advantageとクリップ',520,clip)

 def scaling(c):
    s=text(240,32,'人工損失 L = 1 + N⁻½ + D⁻½',22)
    # Log10 N/D each in [0,2]. Color is loss, axes are not linear.
    for i in range(32):
        for j in range(32):
            n=10**((i+.5)/16);d=10**((j+.5)/16)
            value=1+n**-.5+d**-.5
            light=90-35*(value-1.2)/1.8 if mode=='light' else 22+30*(value-1.2)/1.8
            s+=f'<rect x="{75+i*10}" y="{380-(j+1)*10}" width="10.2" height="10.2" fill="hsl(160 22% {light:.2f}%)"/>'
    for power,label in [(0,'1'),(1,'10'),(2,'100')]:
        pos=75+power*160
        s+=text(pos,409,label,20)+text(58,386-power*160,label,20,anchor='end')
    for C,dash in [(100,''),(400,'7 4'),(1600,'2 4')]:
        pts=[]
        for i in range(201):
            n=10**(i/100);d=C/n
            if 1<=d<=100:pts.append(f'{75+160*math.log10(n):.2f},{380-160*math.log10(d):.2f}')
        s+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="{c["ink"]}" stroke-width="2" stroke-dasharray="{dash}"/>'
        n=math.sqrt(C);x=75+160*math.log10(n);y=380-160*math.log10(n)
        s+=f'<circle cx="{x}" cy="{y}" r="6" fill="{c["second"]}" stroke="{c["surface"]}" stroke-width="2"/>'
    s+=text(240,445,'N（横）・D（縦）：対数軸',21)
    for i,(label,dash) in enumerate([('C = 100',''),('C = 400','7 4'),('C = 1600','2 4')]):
        y=477+i*27
        s+=f'<path d="M75 {y-7}h45" stroke="{c["ink"]}" stroke-width="2" stroke-dasharray="{dash}"/>'+text(140,y,label,20,anchor='start')
    return s+text(365,500,'● 最適点',20,color=c['second'])+text(355,535,'淡色ほど低損失' if mode=='light' else '暗色ほど低損失',18)
 svg('scaling',mode,'損失曲面と等計算量線',570,scaling)

print('Rebuilt 12 SVG files (6 diagrams, Light/Dark)')
