"""Book diagrams: abstract, anonymous, single-direction paths; no user data."""
from pathlib import Path
from html import escape

DEST = Path(__file__).resolve().parents[1] / 'public/diagrams/asset-management-app-a-architecture'
# Each row is a step or a layer. A divider is not an unlabelled process edge.
DIAGRAMS = {
    'requirements': [('管理負担を減らす', '最上位の要求'), ('有料サービスを使わない', '場中更新を行わない'), ('PC集約・共通Web UI', '正本と処理を一つにする'), ('検証・自動処理・復旧', '必要な品質を守る')],
    'architecture': [('Windows・Android', '共通のブラウザー／PWA'), ('Tailscale Serve', '非公開接続・HTTPS終端'), ('Python HTTP・業務計算', '入力検証・アクセス確認'), ('正本と定期ワーカー', '価格取得は外部公表データへ'), ('JSON・Markdown／外部ZIP', '世代保存とバックアップ')],
    'data-model': [('保有明細と資産', '識別子・数量・価格単位'), ('価格・現金・目標・予定', '異なる意味のモデル'), ('日次・月次の確定履歴', '元世代とデータ時点'), ('予測設定／ストレス設定', '別の問いを別に保存'), ('ランタイム状態は別領域', 'ジョブ進行・診断ログ')],
    'persistence': [('最新revisionを確認', 'ロック内で候補を検証'), ('新しい世代へ書く', 'flush・fsync'), ('manifestと読戻し検証', '内容ハッシュを照合'), ('正本manifestを置換', '保存の確定点'), ('確定状態を再計算', '成功応答後にUIを更新')],
    'save-failure': [('旧manifest → 旧世代', '現在の正本を変更しない'), ('新世代を準備', '旧世代と別のファイル'), ('置換前に失敗', '候補は正本にしない'), ('旧manifest → 旧世代', '直前の確定状態を保持')],
    'market-data': [('公式の公表データ', 'HTML・CSV・XML・ZIP'), ('期限とサイズを検査', '共通HTTP処理'), ('識別子・単位・日付', '提供元別に解析・検証'), ('最新正本へ価格を適用', 'ここで保存ロックを取得'), ('新世代へ保存', '保有数量は取得結果で上書きしない')],
    'price-states': [('取得・解析・検証', 'HTTP成功だけでは確定しない'), ('有効：適用して記録', '同値でも基準日を確認'), ('未公表・休場：待機', '公表周期と営業日を確認'), ('通信・解析失敗：記録', '再試行まで有効価格を維持')],
    'financial-consistency': [('保有数量 × 単位付き価格', 'まず実評価額を求める'), ('実績と予定を分離', '未実現予定は実績から除く'), ('目標と実績を比較', '同じ分母で差を評価'), ('予測とストレスを分離', '年次更新と単年ショック')],
    'scheduled-jobs': [('対象日・未完了を読む', '永続化したジョブ状態'), ('実行条件を確認', '時刻・営業日・公表周期'), ('取得と検証', '外部通信は正本ロック外'), ('完了・待機を保存', '次回試行と対象を残す'), ('記録・次回の判定', '再起動後も状態を参照')],
    'access': [('本人の限定端末', '私設ネットワークの入口'), ('Tailscale Serve', 'HTTPS終端・転送'), ('ループバックのアプリ', '転送元・本人・端末を確認'), ('書込みAPI／静的許可リスト', 'Origin等の確認・秘密領域は配信しない')],
    'pwa-update': [('アプリの版を確認', '配信資源の内容ハッシュ'), ('編集中・保存中は待機', '無条件の再読込みを避ける'), ('閲覧状態を保持して更新', '金融データはサーバーが正本'), ('ネットワークから取得', '古い金融キャッシュへ戻さない')],
    'backup': [('確定世代からZIP作成', 'ローカル一時退避'), ('CRC・ハッシュ・内容検証', '未接続時は状態を残し再試行'), ('外部媒体へ保存・読戻し', '正式名への確定後に成功'), ('成功後に世代整理', '新方式の検証済み最新3世代')],
    'restore': [('利用者の確認・revision', '復元対象を検証'), ('現行の正本を保護', 'まず保護コピーを作る'), ('ZIPと内容を再検証', '接続設定は無条件に適用しない'), ('新世代として復元', '過去ファイルの単純上書きにしない')],
    'operations': [('作業ソースと状態を保全', '金融データとコードを分離'), ('隔離検証・対象差分確認', '本番データを試験で置換しない'), ('対象ソースのみ手動反映', '必要なら既存手順で再起動'), ('ヘルス・経路・版を確認', 'プロセス存在だけで成功にしない')],
}
NON_FLOW = {'data-model', 'price-states', 'financial-consistency'}
LABELS = {
    'requirements':'要求と方式', 'architecture':'システム全体構成',
    'data-model':'論理データモデル', 'persistence':'保存の確定点',
    'save-failure':'置換前の失敗', 'market-data':'価格取得と適用',
    'price-states':'価格観測の分類', 'financial-consistency':'実績と予定の区分',
    'scheduled-jobs':'定期処理の追跡', 'access':'アクセス制御',
    'pwa-update':'アプリ版の更新', 'backup':'外部バックアップ',
    'restore':'正本の復元', 'operations':'ソースの反映',
}

def svg(name, rows, dark):
    bg, fill, ink, muted, accent = ('#14221e','#20392f','#edf5ef','#c5d8cd','#9ad1ad') if dark else ('#f7faf8','#edf4ee','#18392b','#405d4c','#326448')
    n=len(rows); top=56; gap=100 if n==5 else 120; box=76
    items=[f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600" role="img" aria-labelledby="title desc">', f'<title id="title">{escape(LABELS[name])}</title>', '<desc id="desc">各段に要素または工程と、その役割を示す。</desc>',f'<rect width="480" height="600" rx="12" fill="{bg}"/>',f'<text x="24" y="32" fill="{muted}" font-family="sans-serif" font-size="22">{escape(LABELS[name])}</text>']
    for i,(a,b) in enumerate(rows):
        y=top+i*gap
        items += [f'<rect x="20" y="{y}" width="440" height="{box}" rx="9" fill="{fill}" stroke="{accent}" stroke-width="2"/>',f'<text x="240" y="{y+30}" text-anchor="middle" fill="{ink}" font-family="sans-serif" font-size="24" font-weight="600">{escape(a)}</text>',f'<text x="240" y="{y+59}" text-anchor="middle" fill="{muted}" font-family="sans-serif" font-size="22">{escape(b)}</text>']
        if i<n-1:
            mid=y+box+(gap-box)/2
            if name not in NON_FLOW:
                items += [f'<path d="M240 {y+box+3} V{top+(i+1)*gap-9}" fill="none" stroke="{accent}" stroke-width="2"/>',f'<path d="M235 {top+(i+1)*gap-14} L240 {top+(i+1)*gap-7} L245 {top+(i+1)*gap-14}" fill="none" stroke="{accent}" stroke-width="2"/>']
            else: items += [f'<path d="M60 {mid} H420" fill="none" stroke="{accent}" stroke-dasharray="3 5"/>']
    return '\n'.join(items+['</svg>'])+'\n'

if __name__=='__main__':
    DEST.mkdir(parents=True,exist_ok=True)
    for name,rows in DIAGRAMS.items():
        for theme in ['light','dark']:(DEST/f'{name}-{theme}.svg').write_text(svg(name,rows,theme=='dark'),encoding='utf-8')
    print(f'Generated {len(DIAGRAMS)} diagrams in Light/Dark')
