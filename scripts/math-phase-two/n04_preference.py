"""Finite candidates; exact identities, finite differences and simplex grid."""
import json
import math
from common import close, kl, gradient


def run():
    ref, reward = [.5,.3,.2], [1.,0.,-1.]
    rows = []
    for beta in [.5,1.,2.]:
        w=[q*math.exp(r/beta) for q,r in zip(ref,reward)]
        Z=sum(w)
        p=[a/Z for a in w]
        recovered=[beta*math.log(a/b)+beta*math.log(Z) for a,b in zip(p,ref)]
        for a,b in zip(recovered,reward): close(a,b)
        margin=beta*(math.log(p[0]/ref[0])-math.log(p[1]/ref[1]))
        close(margin,1)
        dpo=math.log1p(math.exp(-margin))
        F=lambda q:sum(a*r for a,r in zip(q,reward))-beta*kl(q,ref)
        for q in [[.2,.5,.3],ref,p]:
            close(F(q),beta*math.log(Z)-beta*kl(q,p))
        rows.append(dict(beta=beta,policy=p,preference=1/(1+math.exp(-margin)),kl=kl(p,ref),dpo_loss=dpo))
        if beta==1:
            best=(-math.inf,None)
            for i in range(1,500):
                for j in range(1,500-i):
                    q=[i/500,j/500,1-(i+j)/500]
                    if F(q)>best[0]: best=(F(q),q)
            assert F(p)-best[0]<1e-5
            grid=dict(step=.002,policy=best[1],objective_gap=F(p)-best[0])
    numeric=gradient(lambda z: math.log1p(math.exp(-z[0])),[.7])[0]
    close(numeric,1/(1+math.exp(-.7))-1,1e-8)
    return dict(article='N04',passed=True,rows=rows,initial_loss=math.log(2),grid=grid,margin_gradient=numeric)


if __name__ == '__main__':
    print(json.dumps(run(),ensure_ascii=False,indent=2))
