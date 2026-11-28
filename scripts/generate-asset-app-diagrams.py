"""Anonymous eight-chapter Book diagrams; source management and runtime are distinct."""
from pathlib import Path
from html import escape
DEST=Path(__file__).resolve().parents[1]/'public/diagrams/asset-management-app-a-architecture'
DIAGRAMS={
'scope':('対応範囲の決定',[('日常の管理負担を減らす','システム化の目的'),('費用・保守性・安全性','設計上の制約'),('対応する業務を選ぶ','管理・計算に責務を限定'),('要求と方式を決める','必要な機能と運用を設計')]),
'architecture':('管理場所と実行場所',[('Windows・Android','共通Web UI／PWA'),('Tailscale Serve','非公開接続・HTTPS'),('Windows PC','正本データ・計算・定期処理'),('Google Drive','ソース一式を100MB以内で管理')]),
'price-decision':('価格取得方式の決定',[('場中価格を検討','検討した手段では有料API'),('相場終了後の価格を採用','追加費用と保守負担を抑制'),('17時に取得','取得失敗が多かった'),('即時確認の要求を見直す','終了直後の確認は求めない'),('夜間処理へ変更','現行設定は04:00 JST')]),
'monthly-input':('月末の入力業務',[('固定額は事前登録','繰り返し利用する情報'),('変動額は月末入力','その月の金額を利用者が確認'),('未入力なら月末に通知','月末にスマートフォンへ'),('収支と資産状態を確認','収入と利用金額の差額')]),
'monthly-backup':('月末バックアップ',[('月末の記録を保存','バックアップを開始'),('保存内容を検証','失敗時は既存分を保持'),('外付けHDDへ保存','未接続時は退避・再試行'),('成功後に古い分を削除','最新3回分を保持')])}
def svg(name,title,rows,dark):
 bg,fill,ink,muted,accent=('#14221e','#20392f','#edf5ef','#c5d8cd','#9ad1ad') if dark else ('#f7faf8','#edf4ee','#18392b','#405d4c','#326448')
 gap=100 if len(rows)==5 else 120
 items=[f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600" role="img" aria-labelledby="title desc">',f'<title id="title">{escape(title)}</title>','<desc id="desc">業務上の役割と設計判断を整理する。</desc>',f'<rect width="480" height="600" rx="12" fill="{bg}"/>',f'<text x="24" y="32" fill="{muted}" font-family="sans-serif" font-size="22">{escape(title)}</text>']
 for i,(a,b) in enumerate(rows):
  y=56+i*gap
  items.extend([f'<rect x="20" y="{y}" width="440" height="76" rx="9" fill="{fill}" stroke="{accent}" stroke-width="2"/>',f'<text x="240" y="{y+30}" text-anchor="middle" fill="{ink}" font-family="sans-serif" font-size="24" font-weight="600">{escape(a)}</text>',f'<text x="240" y="{y+59}" text-anchor="middle" fill="{muted}" font-family="sans-serif" font-size="22">{escape(b)}</text>'])
  if i<len(rows)-1:
   end=56+(i+1)*gap-9
   if name=='architecture' and i==2:
    items.extend([f'<path d="M240 {end} V{y+85}" fill="none" stroke="{accent}" stroke-width="2" stroke-dasharray="4 4"/>',f'<path d="M235 {y+91} L240 {y+84} L245 {y+91}" fill="none" stroke="{accent}"/>',f'<text x="255" y="{y+103}" fill="{muted}" font-family="sans-serif" font-size="22">コード反映</text>'])
   elif name=='monthly-input':
    items.append(f'<path d="M60 {y+98} H420" fill="none" stroke="{accent}" stroke-dasharray="3 5"/>')
   else:items.extend([f'<path d="M240 {y+79} V{end}" fill="none" stroke="{accent}" stroke-width="2"/>',f'<path d="M235 {end-5} L240 {end+2} L245 {end-5}" fill="none" stroke="{accent}"/>'])
 return '\n'.join(items+['</svg>'])+'\n'
if __name__=='__main__':
 DEST.mkdir(parents=True,exist_ok=True)
 for name,(title,rows) in DIAGRAMS.items():
  for theme in ['light','dark']:(DEST/f'{name}-{theme}.svg').write_text(svg(name,title,rows,theme=='dark'),encoding='utf-8')
 print('Generated 5 paired diagrams; existing development diagrams unchanged')
