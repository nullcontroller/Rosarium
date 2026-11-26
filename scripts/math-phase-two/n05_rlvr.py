"""Fixed group, local score gradient; NOT a full GRPO training run."""
import json
import math
from common import softmax, gradient, close, kl


def run():
    p=[.4,.4,.2]
    z=list(map(math.log,p))
    samples=[0,1,0,2]
    rows=[]
    for name,r in [('correct',[1,0,1,0]),('wrong-verifier',[0,1,0,0]),('constant',[1,1,1,1])]:
        mean=sum(r)/len(r)
        std=math.sqrt(sum((v-mean)**2 for v in r)/len(r))
        a=[(v-mean)/std for v in r] if std>0 else [0.]*len(r)
        # Derivative of old-policy ratio surrogate, at theta=old; A fixed.
        f=lambda zz: sum(aa*softmax(zz)[s]/p[s] for aa,s in zip(a,samples))/4
        analytic=[sum(aa*((s==j)-p[j]) for aa,s in zip(a,samples))/4 for j in range(3)]
        numeric=gradient(f,z)
        for u,v in zip(analytic,numeric): close(u,v,1e-8)
        updated=softmax([zz+.4*g for zz,g in zip(z,analytic)])
        rows.append(dict(condition=name,rewards=r,mean=mean,std=std,advantage=a,gradient=analytic,policy=updated))
    assert rows[0]['policy'][0]>p[0]>rows[1]['policy'][0]
    for u,v in zip(rows[2]['policy'],p):close(u,v)
    ref=[.2,.5,.3]
    kvals=[b/a-math.log(b/a)-1 for a,b in zip(p,ref)]
    expected=sum(a*k for a,k in zip(p,kvals))
    old_expected=sum(a*k for a,k in zip([.8,.1,.1],kvals))
    close(expected,kl(p,ref))
    assert abs(old_expected-expected)>.01
    return dict(article='N05',passed=True,rows=rows,kl_exact=kl(p,ref),kl_on_current=expected,kl_on_different_behavior=old_expected)


if __name__ == '__main__':
    print(json.dumps(run(),ensure_ascii=False,indent=2))
