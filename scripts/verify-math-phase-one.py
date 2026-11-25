"""Python 3 standard library only. Run: python scripts/verify-math-phase-one.py"""
import math, random, json, sys
from pathlib import Path

def softmax(z):
 m=max(z);e=[math.exp(v-m) for v in z];return [v/sum(e) for v in e]
def ce(p,q):return -sum(a*math.log(b) for a,b in zip(p,q) if a)
def entropy(p):return ce(p,p)
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def attention(q,k,v,causal=False):
 a=[];o=[]
 for i,row in enumerate(q):
  scores=[dot(row,col)/math.sqrt(len(row)) if not causal or j<=i else -math.inf for j,col in enumerate(k)]
  weights=softmax(scores);a.append(weights);o.append([sum(weights[j]*v[j][c] for j in range(len(k))) for c in range(len(v[0]))])
 return a,o
results={};p=[.75,.25];q=[.5,.5];kl=sum(a*math.log(a/b) for a,b in zip(p,q));assert abs(ce(p,q)-entropy(p)-kl)<1e-14
z=[.2,-.1,.7];p=[.2,.3,.5];q=softmax(z);errors=[]
for i in range(3):
 plus=z.copy();minus=z.copy();plus[i]+=1e-5;minus[i]-=1e-5
 errors.append(abs((ce(p,softmax(plus))-ce(p,softmax(minus)))/2e-5-(q[i]-p[i])))
assert max(errors)<1e-9
results['N01']={'toy_entropy':entropy([.75,.25]),'toy_cross_entropy':math.log(2),'toy_kl':kl,'gradient_max_abs_error':max(errors)}
rows=[]
for t in [.5,1.,2.]:
 z=[2.,1.,0.];q=softmax([v/t for v in z]);mu=dot(q,z);var=sum(a*(b-mu)**2 for a,b in zip(q,z));h=1e-5
 fd=(entropy(softmax([v/(t+h) for v in z]))-entropy(softmax([v/(t-h) for v in z])))/(2*h)
 assert abs(fd-var/t**3)<1e-7
 rows.append({'T':t,'p':q,'dH_formula':var/t**3,'dH_finite_difference':fd})
q=softmax([2,1,0]);top=softmax([2,1]);assert abs(sum(q[:2])-.9099694268296196)<1e-12
results['temperature']={'entropy_derivatives':rows,'top_p_08':[top[0],top[1],0]}
q=[[1.,0.],[0.,1.]];v=[[10.,0.],[0.,20.]];a,o=attention(q,q,v);ca,co=attention(q,q,v,True)
assert abs(o[0][0]-6.697615493266569)<1e-12 and co[0]==[10.,0.]
perm=[1,0];pa,po=attention([q[i] for i in perm],[q[i] for i in perm],[v[i] for i in perm]);assert all(abs(po[i][j]-o[perm[i]][j])<1e-12 for i in range(2) for j in range(2))
rng=random.Random(20261126);n=40000;dk=16;samples=[sum(rng.gauss(0,1)*rng.gauss(0,1) for j in range(dk)) for i in range(n)];mean=sum(samples)/n;variance=sum((s-mean)**2 for s in samples)/n;assert abs(variance/dk-1)<.04
results['N02']={'weights':a,'outputs':o,'causal_outputs':co,'variance_experiment':{'seed':20261126,'n':n,'d_k':dk,'dot_variance':variance,'scaled_variance':variance/dk,'assumption':'独立な標準正規の人工例。学習済みQ/Kの実測ではない'}}
rng=random.Random(20261126);n=100000;k=4;p=.2;s=.6;available=selected=0
for i in range(n):
 a=any([rng.random()<p for j in range(k)]);available+=a;selected+=a and rng.random()<s
expected=1-(1-p)**k;assert abs(available/n-expected)<.006 and abs(selected/n-expected*s)<.006
results['N06']={'independent_oracle':expected,'selection_theory':expected*s,'oracle_simulation':available/n,'selected_simulation':selected/n,'trials':n,'seed':20261126,'scope':'独立候補と人工選択器の検算。LLM実験ではない'}
# Same budget, different allocation, with exact decimal/rational verification.
from fractions import Fraction
budget=12
allocations={'A':{'k':6,'generation_cost':1,'verification_cost':1},'B':{'k':3,'generation_cost':1,'verification_cost':3}}
budget_rows=[]
for label,sb in [('strong_verifier',Fraction(9,10)),('modest_verifier',Fraction(6,10))]:
 row={'scenario':label,'budget':budget,'candidate_success_probability':.2,'allocations':{}}
 for name,cfg in allocations.items():
  cost=cfg['k']*(cfg['generation_cost']+cfg['verification_cost']);assert cost==budget
  selection=Fraction(1,2) if name=='A' else sb
  oracle=1-Fraction(4,5)**cfg['k'];success=oracle*selection
  row['allocations'][name]={**cfg,'total_cost':cost,'conditional_selection_success':float(selection),'oracle_success':float(oracle),'selected_success':float(success)}
 row['winner']=max(row['allocations'],key=lambda x:row['allocations'][x]['selected_success']);budget_rows.append(row)
assert budget_rows[0]['winner']=='B' and budget_rows[1]['winner']=='A'
assert abs(budget_rows[0]['allocations']['A']['selected_success']-.368928)<1e-12
assert abs(budget_rows[0]['allocations']['B']['selected_success']-.4392)<1e-12
assert abs(budget_rows[1]['allocations']['B']['selected_success']-.2928)<1e-12
results['N06']['same_budget_comparison']=budget_rows
results['N06']['budget_scope']='Artificial fixed costs and conditional selection success, not measured LLM performance.'

def online(scores,values):
 m=scores[0];l=1.;u=values[0].copy()
 for score,value in zip(scores[1:],values[1:]):
  nm=max(m,score);a=math.exp(m-nm);b=math.exp(score-nm);l=a*l+b;u=[a*x+b*y for x,y in zip(u,value)];m=nm
 return [x/l for x in u]
rng=random.Random(20261126);err=0.
for trial in range(100):
 scores=[rng.uniform(-1000,1000) for _ in range(17)];values=[[rng.uniform(-3,3) for _ in range(3)] for _ in scores];w=softmax(scores);ref=[sum(a*v[j] for a,v in zip(w,values)) for j in range(3)];got=online(scores,values);err=max(err,max(abs(x-y) for x,y in zip(ref,got)))
assert err<1e-12
results['N12']={'online_softmax_max_abs_error':err,'random_cases':100,'matrix_mib':{str(n):n*n*2/2**20 for n in [4096,8192]},'scope':'CPU標準浮動小数点の同値性検算。GPU速度測定なし'}
A={'a','b'};C={'a','c'};assert C-A=={'c'} and A-C=={'b'};results['guardrail']={'false_accept':sorted(C-A),'false_reject':sorted(A-C),'sound':C<=A,'complete':A<=C}
# Marginals alone allow independence, positive dependence or negative dependence.
joint_cases=[]
for joint in [0.,.06,.2]:
 cells=[joint,.2-joint,.3-joint,.5+joint];assert min(cells)>=0 and abs(sum(cells)-1)<1e-12
 assert abs(cells[0]+cells[1]-.2)<1e-12 and abs(cells[0]+cells[2]-.3)<1e-12
 joint_cases.append({'m1':.2,'m2':.3,'joint':joint,'product':.06,'conditional_covariance':joint-.06})
results['guardrail']['joint_miss_cases']=joint_cases
losses=[2.,5.,0.,0.];assert sum(losses)/4==2*.5+3*.25
results['guardrail']['additive_loss_with_overlap']={'realized_losses':losses,'expectation':sum(losses)/4,'linearity_rhs':2*.5+3*.25}
results['guardrail']['binary_mapping']={'accept':'accept_original','reject':'do_not_accept_original','repair':'do_not_accept_original','escalate':'do_not_accept_original'}
assert abs(.7+.3-1)<1e-12;results['hallucination']={'toy_target_wrong':.7,'toy_target_correct':.3,'claim':'訓練分布一致はこの人工例の真偽を保証しない'}
results['hallucination']['iid_claim_model']={'p':.95,'all_correct_10':.95**10,'at_least_one_error_10':1-.95**10,'scope':'Fixed p, independent identical claims. Not an empirical statement about length.'}
for fixed_p in [0.,.95,1.]:
 for claims in [1,10]:assert abs(((1-fixed_p**(claims+1))-(1-fixed_p**claims))-fixed_p**claims*(1-fixed_p))<1e-12
assert abs(.4*.3-.12)<1e-12;results['conditional_probability']={'chain_rule_example':.4*.3,'scope':'P(A)=0.4、P(B|A)=0.3という人工例'}
print(json.dumps({'python':sys.version,'checks':'8項目成功','results':results},ensure_ascii=False,indent=2))
