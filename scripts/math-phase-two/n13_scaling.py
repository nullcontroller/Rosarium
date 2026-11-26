"""Synthetic coefficients, no fitted LLM performance. Optional --csv PATH."""
import csv
import json
import math
import sys
from common import golden, close


def loss(n,d,A=1.,B=1.,alpha=.5,beta=.5):
    return 1+A/n**alpha+B/d**beta


def run():
    rows=[]
    for C in [100,400,1600]:
        n_star=math.sqrt(C)
        u=golden(lambda u:loss(math.exp(u),C/math.exp(u)),-8,12)
        n=math.exp(u)
        assert abs(n/n_star-1)<1e-6
        close(loss(n,C/n),loss(n_star,n_star))
        h=1e-4
        f=lambda u:loss(math.exp(u),C/math.exp(u))
        derivative=(f(math.log(n_star)+h)-f(math.log(n_star)-h))/(2*h)
        curvature=(f(u+h)-2*f(u)+f(u-h))/h**2
        close(derivative,0,1e-8)
        assert curvature>0
        rows.append(dict(C=C,N_analytic=n_star,N_numeric=n,D=C/n,loss=loss(n,C/n)))
    # Unequal exponents and coefficients, independent minimization.
    A,B,alpha,beta,C,kappa=2.,3.,.3,.6,900.,6.
    K=C/kappa
    exact=(alpha*A/(beta*B)*K**beta)**(1/(alpha+beta))
    numeric=math.exp(golden(lambda u:loss(math.exp(u),K/math.exp(u),A,B,alpha,beta),-10,15))
    assert abs(numeric/exact-1)<1e-6
    # Fixed TOTAL budget with repeated inference: D=400/N-10.
    f=lambda n:loss(n,400/n-10)
    n=golden(f,.0001,39.9999)
    d=400/n-10
    close(n*d+10*n,400)
    assert n<20 and d>20
    return dict(article='N13',passed=True,training=rows,unequal_exponents=dict(analytic=exact,numeric=numeric),total_cost=dict(N=n,D=d,loss=f(n),training_cost=n*d,inference_cost=10*n))


if __name__ == '__main__':
    if '--csv' in sys.argv:
        path=sys.argv[sys.argv.index('--csv')+1]
        with open(path,'w',newline='',encoding='utf-8') as out:
            writer=csv.writer(out);writer.writerow(['N','D','synthetic_loss'])
            for i in range(41):
                for j in range(41):
                    n,d=10**(i/20),10**(j/20)
                    writer.writerow([n,d,loss(n,d)])
    print(json.dumps(run(),ensure_ascii=False,indent=2))
