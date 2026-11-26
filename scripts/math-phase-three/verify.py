"""Artificial mathematical checks, Python >=3.10, standard library only.
Run from repository root: python scripts/math-phase-three/verify.py
No model weights, APIs, GPU measurements, or training are involved.
"""
import itertools
import json
import math
import platform
import random
from fractions import Fraction as F

SEED = 20261126
TOL = 1e-10


def close(a, b, tol=TOL):
    assert abs(a-b) <= tol, (a, b, tol)


def softmax(xs):
    es = [math.exp(x-max(xs)) for x in xs]
    return [e/sum(es) for e in es]


def dot(a, b):
    return sum(x*y for x, y in zip(a, b))


def icl():
    likelihoods = [(F(9, 10), F(1, 10))]*2
    rows = []
    posterior = [0.5, 0.5]
    for m in range(3):
        ls = [math.prod(row[z] for row in likelihoods[:m]) for z in range(2)]
        masses = [F(1, 2)*v for v in ls]
        exact = [v/sum(masses) for v in masses]
        for z in range(2):
            close(posterior[z], float(exact[z]))
        prediction = F(9, 10)*exact[0]+F(1, 10)*exact[1]
        rows.append(dict(examples=m, likelihood=list(map(float, ls)), posterior=list(map(float, exact)), probability_answer_1=float(prediction)))
        if m < 2:
            weights = [posterior[z]*float(likelihoods[m][z]) for z in range(2)]
            posterior = [v/sum(weights) for v in weights]
    close(rows[1]['probability_answer_1'], .82)
    close(rows[2]['probability_answer_1'], 73/82)
    # Independent permutation check with unequal observations.
    def update(obs):
        p = [.5, .5]
        for l in obs:
            w = [p[z]*l[z] for z in range(2)]
            p = [v/sum(w) for v in w]
        return p
    obs = [(.9, .1), (.2, .8), (.7, .3)]
    for perm in itertools.permutations(obs):
        for a, b in zip(update(obs), update(perm)):
            close(a, b)
    X, y, w = [[1., 2.], [-1., .5], [2., -1.]], [1., -2., .5], [.3, -.2]
    def loss(v):
        return sum((dot(x, v)-target)**2 for x, target in zip(X, y))/(2*len(X))
    gradient = [sum(x[j]*(dot(x, w)-target) for x, target in zip(X, y))/len(X) for j in range(2)]
    for j, g in enumerate(gradient):
        wp, wm = w.copy(), w.copy()
        wp[j] += 1e-5
        wm[j] -= 1e-5
        close(g, (loss(wp)-loss(wm))/(2e-5), 1e-9)
    eta, query = .2, [.5, -1.]
    w1 = [eta*sum(x[j]*target for x, target in zip(X, y))/len(X) for j in range(2)]
    attention_prediction = eta*sum(dot(query, x)*target for x, target in zip(X, y))/len(X)
    close(dot(query, w1), attention_prediction)
    return dict(passed=True, posterior_rows=rows, finite_difference_gradient=gradient, linear_attention_prediction=attention_prediction, excludes='No trained Transformer or commercial LLM is reproduced.')


def moe():
    logits = list(map(math.log, [4, 3, 2, 1]))
    p = softmax(logits)
    for a, b in zip(p, [.4, .3, .2, .1]):
        close(a, b)
    experts = [2., 4., -2., 0.]
    def route(scores, k, normalize=True):
        probs = softmax(scores)
        chosen = sorted(range(4), key=lambda e: (-scores[e], e))[:k]
        den = sum(probs[e] for e in chosen) if normalize else 1.
        return chosen, [probs[e]/den for e in chosen]
    outputs = {}
    for k in (1, 2):
        chosen, weights = route(logits, k)
        selected_softmax = softmax([logits[e] for e in chosen])
        for a, b in zip(weights, selected_softmax):
            close(a, b)
        outputs[f'top{k}'] = sum(g*experts[e] for e, g in zip(chosen, weights))
    close(outputs['top1'], 2.)
    close(outputs['top2'], 20/7)
    chosen, weights = route(logits, 1, False)
    outputs['top1_without_renormalization'] = sum(g*experts[e] for e, g in zip(chosen, weights))
    close(outputs['top1_without_renormalization'], .8)
    scores = [[4,3,2,1],[4,1,3,2],[4,2,1,3],[4,3,1,2]]
    def loads(rows, k):
        return [sum(e in route(s,k)[0] for s in rows) for e in range(4)]
    assert loads(scores,1)==[4,0,0,0]
    assert loads(scores,2)==[4,2,1,1]
    balanced = [[4 if e==t else 0 for e in range(4)] for t in range(4)]
    assert loads(balanced,1)==[1,1,1,1]
    lam, E, T = .01, 4, 4
    def aux(rows):
        Freq=[v/T for v in loads(rows,1)]
        P=[sum(softmax(s)[e] for s in rows)/T for e in range(E)]
        return lam*E*dot(Freq,P)
    # Analytic derivative for one score, holding top-1 assignments fixed.
    Freq=[v/T for v in loads(scores,1)]
    pr=softmax(scores[0])
    j=1
    analytic=lam*E/T*sum(Freq[e]*pr[e]*((1 if e==j else 0)-pr[j]) for e in range(E))
    plus,minus=[s.copy() for s in scores],[s.copy() for s in scores]
    plus[0][j]+=1e-5
    minus[0][j]-=1e-5
    close(analytic,(aux(plus)-aux(minus))/(2e-5),1e-9)
    # Capacity 1, explicitly defined dropping policy, no rerouting.
    assigned=loads(scores,1)
    accepted=[min(1,v) for v in assigned]
    assert sum(assigned)-sum(accepted)==3
    d,h,k=2,3,1
    costs=dict(single_dense=4*d*h, sparse_with_router=4*k*d*h+2*E*d, all_experts_with_router=4*E*d*h+2*E*d)
    assert costs==dict(single_dense=24,sparse_with_router=40,all_experts_with_router=112)
    return dict(passed=True,router_probabilities=p,outputs=outputs,top1_load=loads(scores,1),top2_load=loads(scores,2),balanced_load=loads(balanced,1),auxiliary_loss_unbalanced=aux(scores),auxiliary_loss_balanced=aux(balanced),aux_gradient=analytic,dropped=3,theoretical_flops=costs,excludes='No balancing training, GPU speedup, or LLM quality experiment.')


def ssm():
    x=[1.,0.,2.,0.]
    def recurrence(a, values):
        h=0.
        result=[]
        for v in values:
            h=a*h+v
            result.append(h)
        return result
    outputs={}
    for a in (.5,.9):
        ys=recurrence(a,x)
        conv=[sum(a**(t-j)*x[j] for j in range(t+1)) for t in range(len(x))]
        for u,v in zip(ys,conv): close(u,v)
        outputs[str(a)]=ys
    rng=random.Random(SEED)
    randx=[rng.uniform(-1,1) for _ in range(30)]
    for a in (.2,.8,1.01):
        ys=recurrence(a,randx)
        for t,v in enumerate(ys):close(v,sum(a**(t-j)*randx[j] for j in range(t+1)))
    two=[(a+b)/2 for a,b in zip(outputs['0.5'],outputs['0.9'])]
    for t,v in enumerate(two):close(v,sum((.5**(t-j)+.9**(t-j))/2*x[j] for j in range(t+1)))
    A,B,dt=-.7,1.3,.4
    barA=math.exp(A*dt)
    barB=math.expm1(A*dt)/A*B
    # Midpoint quadrature is independent of the closed-form integral.
    count=10000
    quadrature=sum(math.exp(A*(i+.5)*dt/count) for i in range(count))*dt/count*B
    close(barB,quadrature,1e-9)
    close(sum(1. for _ in range(count))*dt/count*B,dt*B)
    def compose(later, earlier):
        a2,b2=later; a1,b1=earlier
        return a2*a1,a2*b1+b2
    pairs=[(.2,1.),(.7,-.3),(.9,2.)]
    for a,b in zip(compose(pairs[2],compose(pairs[1],pairs[0])),compose(compose(pairs[2],pairs[1]),pairs[0])):close(a,b)
    def tree_reduce(ps):
        if len(ps)==1:return ps[0]
        mid=len(ps)//2
        return compose(tree_reduce(ps[mid:]),tree_reduce(ps[:mid]))
    gates=[.8 if v>0 else .1 for v in x]
    pairs=[(1-g,g*v) for g,v in zip(gates,x)]
    h=0.; selective=[]
    for i,(a,b) in enumerate(pairs):
        h=a*h+b;selective.append(h)
        close(h,tree_reduce(pairs[:i+1])[1])
    return dict(passed=True,scalar_outputs=outputs,two_state_outputs=two,zoh=[barA,barB],quadrature=quadrature,selective_gates=gates,selective_states=selective,memory_kernels={str(a):[a**j for j in range(9)] for a in (.5,.9)},excludes='No full Mamba/S4 model, arbitrary matrix exponential, or real language quality test.')


def diffusion():
    initial=[.6,.4,0.]
    def qmat(beta):return [[1-beta,0.,beta],[0.,1-beta,beta],[0.,0.,1.]]
    def multiply(v,M):return [sum(v[i]*M[i][j] for i in range(3)) for j in range(3)]
    def marginal_and_reverse(betas):
        ms=[initial]; matrices=[]
        for b in betas:
            Q=qmat(b);matrices.append(Q);ms.append(multiply(ms[-1],Q))
        Rs=[]
        for t,Q in enumerate(matrices):
            R=[]
            for j in range(3):
                if ms[t+1][j]>0:R.append([ms[t][i]*Q[i][j]/ms[t+1][j] for i in range(3)])
                else:R.append([1.,0.,0.]) # Arbitrary on a zero-mass conditioning event.
            Rs.append(R)
        v=ms[-1]
        for R in reversed(Rs):v=multiply(v,R)
        for a,b in zip(v,initial):close(a,b)
        return ms,matrices,Rs
    ms,Qs,Rs=marginal_and_reverse([.5,1.])
    for row in ms:close(sum(row),1.)
    for Q in Qs:
        for row in Q:close(sum(row),1.)
    # Enumerate paths independently of the matrix-multiplication recursion.
    path_marginal=[0.,0.,0.]
    for a,b,c in itertools.product(range(3),repeat=3):
        path_marginal[c]+=initial[a]*Qs[0][a][b]*Qs[1][b][c]
    for a,b in zip(path_marginal,ms[-1]):close(a,b)
    four,_,_=marginal_and_reverse([.25,1/3,.5,1.])
    # Learned-reverse stand-in: deliberately prescribed, not trained.
    # w1=1, w2=.5; inconsistent estimates across noise times make ELBO non-tight.
    R1=[[1,0,0],[0,1,0],[.7,.3,0]]
    R2=[[1,0,0],[0,1,0],[.4,.1,.5]]
    model_probability_A=sum(R2[2][b]*R1[b][0] for b in range(3))
    close(model_probability_A,.75)
    qpaths=[(b,c,Qs[0][0][b]*Qs[1][b][c]) for b,c in itertools.product(range(3),repeat=2)]
    elbo=0.;gap=0.
    for b,c,qp in qpaths:
        if qp==0:continue
        joint=(1. if c==2 else 0.)*R2[c][b]*R1[b][0]
        assert joint>0
        elbo+=qp*math.log(joint/qp)
        gap+=qp*math.log(qp/(joint/model_probability_A))
    close(math.log(model_probability_A)-elbo,gap)
    assert gap>0
    q_reverse_A=[.5,0.,.5]
    transition_kl=sum(q*math.log(q/p) for q,p in zip(q_reverse_A,R2[2]) if q)
    reconstruction=-sum(Qs[0][0][b]*math.log(R1[b][0]) for b in range(3) if Qs[0][0][b])
    close(-elbo,transition_kl+reconstruction)
    # Local masked KL versus weighted cross entropy.
    w,r=.5,.8
    local_kl=w*math.log(w/(w*r))+(1-w)*math.log((1-w)/(1-w))
    close(local_kl,-w*math.log(r))
    return dict(passed=True,states=['A','B','M'],forward_matrices=Qs,marginals=ms,oracle_reverse=Rs,four_step_marginals=four,artificial_model_probability_A=model_probability_A,log_likelihood=math.log(model_probability_A),elbo=elbo,posterior_KL_gap=gap,negative_elbo_decomposition=transition_kl+reconstruction,local_mask_KL=local_kl,excludes='Reverse probabilities are prescribed or Bayes-oracle values, not learned neural outputs.')


if __name__=='__main__':
    report=dict(python=platform.python_version(),dependencies='standard library only',seed=SEED,default_absolute_tolerance=TOL,finite_difference_step=1e-5,gradient_absolute_tolerance=1e-9,quadrature_absolute_tolerance=1e-9,systems={name:fn() for name,fn in [('N07',icl),('N09',moe),('N10',ssm),('N11',diffusion)]})
    print(json.dumps(report,ensure_ascii=False,indent=2,allow_nan=False))
