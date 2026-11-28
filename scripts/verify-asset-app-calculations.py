"""Independent fictional examples. Standard library only; never reads app data."""
import hashlib
import io
import json
import math
import os
import platform
import tempfile
import zipfile
from decimal import Decimal as D, localcontext
from fractions import Fraction as F
from pathlib import Path

results=[]
def check(name,actual,expected):
    assert math.isclose(float(actual),float(expected),rel_tol=1e-12,abs_tol=1e-9),(name,actual,expected)
    results.append({'name':name,'actual':str(actual),'independentExpected':str(expected),'pass':True})

check('cross-rate',F(180)/F('1.2'),D(180)/D('1.2'))
check('unit-valuation',F(25000,10000)*12000,D(25000)*D('1.2'))
check('foreign-valuation',200*150,D(200)*D(150))
check('actual-total',1060000-60000,sum([F(300000),F(200000),F(500000)]))
check('allocation-target',F(1000000)*F('0.4'),D(400000))
check('allocation-shortfall',F(1000000)*F('0.4')-350000,D(50000))
check('boundary-price',(F(50000)-10000)/20,D(2000))
check('weighted-rate',F('0.6')*F('0.04')+F('0.4')*F('0.01'),D('0.028'))
r=F('0.028'); initial=F(1000000); deposit=F(120000)
gain=(initial+deposit/2)*r
check('annual-gain',gain,D(29680))
check('year-end-assets',initial+deposit+gain,D(1149680))
for years in [1,5,20]:
    a=initial
    for _ in range(years):a=a+deposit+(a+deposit/2)*r
    # Solve A_(t+1)=(1+r)A_t + D(1+r/2) independently.
    factor=(1+r)**years
    closed=initial*factor+deposit*(1+r/2)*(factor-1)/r
    check(f'annual-recursion-v-closed-{years}',a,closed)
check('zero-return',initial+20*deposit,D(3400000))
values=[300000,200000,500000];shocks=[F('-0.2'),F('0.1'),F(0)]
change=sum(v*s for v,s in zip(values,shocks))
after=sum(F(v)*(1+s) for v,s in zip(values,shocks))
check('stress-change',change,D(-40000))
check('stress-after',after,D(960000))
check('stress-rate',change/sum(values),D('-0.04'))
assert after==sum(values)+change
# Demonstration of commit visibility, not the app's full crash/durability protocol.
with tempfile.TemporaryDirectory() as tmp:
    p=Path(tmp);old=b'{"fictional":1}';new=b'{"fictional":2}'
    (p/'v1.json').write_bytes(old)
    (p/'manifest.json').write_text('v1.json')
    (p/'v2.json').write_bytes(new)
    assert (p/(p/'manifest.json').read_text()).read_bytes()==old
    (p/'manifest.tmp').write_text('v2.json')
    os.replace(p/'manifest.tmp',p/'manifest.json')
    assert (p/(p/'manifest.json').read_text()).read_bytes()==new
    assert hashlib.sha256(new).digest()!=hashlib.sha256(old).digest()
results.append({'name':'generation-model-precommit-failure-and-commit','pass':True,'scope':'toy model only; no OS crash or power-failure simulation'})
payload=b'{"fictional":true,"value":123}'
archive=io.BytesIO()
with zipfile.ZipFile(archive,'w') as z:z.writestr('snapshot.json',payload)
with zipfile.ZipFile(io.BytesIO(archive.getvalue())) as z:
    assert z.testzip() is None
    restored=z.read('snapshot.json')
    assert json.loads(restored)==json.loads(payload)
    assert hashlib.sha256(restored).digest()==hashlib.sha256(payload).digest()
    assert hashlib.sha256(restored+b'x').digest()!=hashlib.sha256(payload).digest()
results.append({'name':'fictional-backup-integrity-roundtrip','pass':True,'scope':'in-memory ZIP; no private backup or physical drive'})
print(json.dumps({'python':platform.python_version(),'dependencies':'standard library only','seed':'none; deterministic','tolerance':{'relative':1e-12,'absolute':1e-9},'conditions':'fictional values only; nonnegative quantities and positive units, rates and denominators; fixed target boundary; constant annual return and deposit for closed form','notTested':['real assets','app performance','OS crash','physical recovery','prediction accuracy'],'results':results,'passed':len(results)},ensure_ascii=False,indent=2))
