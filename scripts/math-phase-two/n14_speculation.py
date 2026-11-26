"""Exact enumeration plus seeded Monte Carlo; no language models are run."""
import json
import math
import random
from common import close


def categorical(rng,p):
    u=rng.random()
    for i,v in enumerate(p):
        u-=v
        if u<=0:return i
    return len(p)-1


def repair(p,q):
    mass=[max(a-b,0) for a,b in zip(p,q)]
    total=sum(mass)
    return [a/total for a in mass] if total>0 else None


def exact(p,q):
    accepted=[min(a,b) for a,b in zip(p,q)]
    alpha=sum(accepted)
    r=repair(p,q)
    final=[a+(1-alpha)*b for a,b in zip(accepted,r)] if r else accepted
    for u,v in zip(final,p):close(u,v,1e-12)
    return dict(p=p,q=q,acceptance=[min(1,a/b) if b>0 else None for a,b in zip(p,q)],alpha=alpha,repair=r,final=final)


def sample(rng,p,q):
    x=categorical(rng,q)
    return x if rng.random()<=min(1,p[x]/q[x]) else categorical(rng,repair(p,q))


def run():
    p,q=[.5,.3,.2],[.2,.5,.3]
    row=exact(p,q)
    for pp,qq in [([.5,.5],[.5,.5]),([1.,0.],[0.,1.]),([.2,.8],[0.,1.])]:exact(pp,qq)
    seed=20261126
    rng=random.Random(seed)
    n=200000; counts=[0]*3
    for _ in range(n):counts[sample(rng,p,q)]+=1
    observed=[v/n for v in counts]
    assert max(abs(a-b) for a,b in zip(observed,p))<.005
    # Conditional TWO-token Target and Draft. After first rejection discard
    # all suffix proposals, restart. Full acceptance adds bonus unless length=2.
    def target(prefix):return [.6,.4] if not prefix else ([.9,.1] if prefix[0]==0 else [.2,.8])
    def draft(prefix):return [.3,.7] if not prefix else ([.4,.6] if prefix[0]==0 else [.8,.2])
    def sequence():
        prefix=[]
        while len(prefix)<2:
            proposal=[];qs=[];ps=[]
            for _ in range(min(2,2-len(prefix))):
                history=prefix+proposal
                qq=draft(history);pp=target(history)
                qs.append(qq);ps.append(pp);proposal.append(categorical(rng,qq))
            rejected=False
            for x,pp,qq in zip(proposal,ps,qs):
                if rng.random()<=min(1,pp[x]/qq[x]):prefix.append(x)
                else:
                    prefix.append(categorical(rng,repair(pp,qq)))
                    rejected=True
                    break
            if not rejected and len(prefix)<2:prefix.append(categorical(rng,target(prefix)))
        return prefix[0]*2+prefix[1]
    n2=100000;seq=[0]*4
    for _ in range(n2):seq[sequence()]+=1
    true=[.6*.9,.6*.1,.4*.2,.4*.8]
    observed2=[v/n2 for v in seq]
    assert max(abs(a-b) for a,b in zip(observed2,true))<.008
    costs=[]
    for alpha,td,tv,to in [(.8,.05,1.2,.1),(.3,.2,1.5,.1)]:
        tokens=sum(alpha**j for j in range(5))
        close(tokens,(1-alpha**5)/(1-alpha))
        costs.append(dict(alpha=alpha,draft=td,verification=tv,overhead=to,tokens=tokens,speed=tokens/(4*td+tv+to)))
    assert costs[0]['speed']>1>costs[1]['speed']
    return dict(article='N14',passed=True,seed=seed,exact=row,n=n,observed=observed,tolerance=.005,hoeffding_union_bound=6*math.exp(-2*n*.005**2),conditional_sequence=dict(n=n2,target=true,observed=observed2,tolerance=.008),synthetic_costs=costs)


if __name__ == '__main__':
    print(json.dumps(run(),ensure_ascii=False,indent=2))
