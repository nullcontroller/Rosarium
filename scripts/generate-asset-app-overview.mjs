import fs from 'node:fs';
const root='public/diagrams/asset-management-app-a-architecture';
const palettes={light:{bg:'#f5f7f1',surface:'#f5f7f1',ink:'#243439',muted:'#4a6057',line:'#9eafa4',accent:'#145b4f',soft:'#d8e6dc'},dark:{bg:'#1c282c',surface:'#1c282c',ink:'#e3ece8',muted:'#a6b9ba',line:'#3c5052',accent:'#92d5c1',soft:'#263c38'}};
const icons={pc:'M2 3h28v19H2z M16 22v7 M8 29h16',folder:'M2 8h11l4 4h13v17H2z M2 8V4h11l4 4',globe:'M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28 M2 16h28 M16 2c-9 8-9 20 0 28 M16 2c9 8 9 20 0 28',disk:'M5 3h22l4 25H1z M7 21h18 M8 25h1 M13 25h1',clock:'M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28 M16 7v10l6 4',data:'M3 7c0-7 26-7 26 0s-26 7-26 0 M3 7v19c0 7 26 7 26 0V7 M3 17c0 7 26 7 26 0'};
function draw(mode,mobile){const p=palettes[mode],W=mobile?480:1040,H=mobile?1530:930;let a=[];
 const text=(x,y,s,size=24,weight=400,color=p.ink)=>a.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}">${s}</text>`);
 const lines=(x,y,ss,size=24,step=34)=>ss.forEach((s,i)=>text(x,y+i*step,s,size));
 const box=(x,y,w,h,title,icon,emphasis=false)=>{a.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${emphasis?p.soft:p.surface}" stroke="${emphasis?p.accent:p.line}" stroke-width="${emphasis?2.5:1.5}"/>`);a.push(`<path transform="translate(${x+18} ${y+18})" d="${icons[icon]}" fill="none" stroke="${p.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);text(x+62,y+43,title,24,600);};
 const arrow=d=>a.push(`<path d="${d}" fill="none" stroke="${p.accent}" stroke-width="2" marker-end="url(#arrow)"/>`);
 text(24,42,'資産管理アプリA',mobile?28:30,700,p.accent);if(!mobile)text(345,42,'システム全体構成',28,600);
 if(mobile){
  box(20,72,440,150,'利用環境','pc');lines(42,150,['Windows PC・Android','ブラウザー／PWA']);
  arrow('M240 270 V294');text(36,255,'Tailscale経由の非公開アクセス',24,400,p.accent);
  box(20,304,440,286,'Windows PC｜実行環境','pc',true);text(42,390,'資産管理アプリA',28,700);text(42,428,'Python Webアプリケーション',24);lines(42,473,['資産評価・集計／収支管理','データ保存／自動処理']);a.push(`<rect x="40" y="535" width="400" height="38" rx="6" fill="${p.surface}"/>`);text(56,562,'金融データの正本を保持',24,600,p.accent);
  box(20,632,440,156,'外部市場情報','globe');lines(42,709,['無料の公開データ・相場終了後の価格','アプリが夜間に自動取得'],23);
  box(20,818,440,188,'Google Drive｜ソース管理','folder');lines(42,899,['アプリのソースファイル一式','場所を問わずアクセス','ソース管理領域は100MB以内'],24);
  box(20,1036,440,190,'外付けHDD｜バックアップ','disk');lines(42,1116,['アプリから毎月末に自動保存','最新3回分を保持','古いバックアップは自動削除']);
  box(20,1256,440,170,'アプリの自動処理','clock');lines(42,1338,['夜間の価格取得／月末バックアップ','変動額が未入力なら月末に通知'],23);
  text(24,1480,'利用条件：PCの稼働・ネットワーク接続',23,400,p.muted);
 }else{
  box(24,160,270,215,'利用環境','pc');lines(44,246,['Windows PC','Android','ブラウザー／PWA']);
  arrow('M300 280 H374');text(299,242,'Tailscale',19,600,p.accent);text(300,319,'非公開接続',18,400,p.muted);
  box(384,160,330,430,'Windows PC','pc',true);text(406,261,'資産管理アプリA',26,700);lines(406,304,['Pythonによる','Webアプリケーション'],23);lines(406,397,['資産評価・集計','収支管理','データ保存・自動処理'],25,40);a.push(`<rect x="400" y="520" width="298" height="48" rx="6" fill="${p.surface}"/>`);text(413,551,'金融データの正本',25,600,p.accent);
  box(772,160,244,205,'外部市場情報','globe');lines(790,246,['無料の公開データ','相場終了後の価格','夜間に自動取得'],23);arrow('M766 280 H724');
  box(24,450,270,230,'アプリの自動処理','clock');lines(44,537,['夜間の価格取得','月末バックアップ','変動額が未入力なら','月末に通知'],23,35);
  box(772,450,244,245,'外付けHDD','disk');lines(790,537,['毎月末に自動保存','最新3回分を保持','古いバックアップ','は自動削除'],23,36);arrow('M720 520 H762');
  box(384,680,330,195,'Google Drive','folder');lines(406,761,['ソースファイル一式を管理','場所を問わずアクセス','管理領域は100MB以内'],23);arrow('M549 670 V600');text(567,640,'コード反映',21,400,p.muted);
  text(24,915,'利用条件：Windows PCの稼働とネットワーク接続',24,400,p.muted);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">資産管理アプリAのシステム全体構成</title><desc id="desc">端末はTailscale経由でWindows PCのアプリへ接続する。金融データの正本はPCが保持し、Google Driveは100MB以内のソース管理に使用する。夜間に価格を取得し、月末には外付けHDDへバックアップする。</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${p.accent}"/></marker></defs><rect width="${W}" height="${H}" rx="12" fill="${p.bg}"/><g font-family="'Yu Gothic UI','Yu Gothic',system-ui,sans-serif">${a.join('\n')}</g></svg>\n`;
}
for(const mode of ['light','dark'])for(const mobile of [false,true])fs.writeFileSync(`${root}/architecture-${mobile?'mobile-':''}${mode}.svg`,draw(mode,mobile));
