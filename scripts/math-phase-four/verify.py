"""Phase four: exact finite examples and numerical cross-checks, no LLM or proof assistant."""
import itertools,json,math,platform,random
SEED=20261126
TOL=1e-10

def close(a,b,tol=TOL):
    assert math.isclose(a,b,rel_tol=0,abs_tol=tol),(a,b,tol)

def interpretability():
    D=((1.,-.5,-.5),(0.,math.sqrt(3)/2,-math.sqrt(3)/2))
    def decode(z):return [sum(row[j]*z[j] for j in range(3)) for row in D]
    def encode(h):return [max(0.,sum(D[i][j]*h[i] for i in range(2))) for j in range(3)]
    sparse=[]
    for j in range(3):
        z=[float(k==j) for k in range(3)];h=decode(z);z_hat=encode(h)
        for a,b in zip(z,z_hat):close(a,b)
        sparse.append(dict(feature=j,activation=h,recovered=z_hat))
    dense=decode([1.,1.,1.]);zero=decode([0.,0.,0.])
    for a,b in zip(dense,zero):close(a,b)
    # Fixed identity decoder: independent exhaustive grid minimization vs KKT solution.
    h=[.8,.2];lam=.2
    analytic=[max(x-lam/2,0) for x in h]
    grid=[]
    for x in h:
        f=min((i/1000 for i in range(1001)),key=lambda z:(x-z)**2+lam*z)
        grid.append(f)
    for a,b in zip(analytic,grid):close(a,b)
    objective=sum((x-z)**2+lam*z for x,z in zip(h,analytic));close(objective,.18)
    for x,z in zip(h,analytic):close(2*(z-x)+lam,0.)
    # Separate transparent causal graph. Observational covariance is not intervention.
    rows=[(float(i%2),float(i%2)) for i in range(20)]
    def readout(u,v):return 2*u-.5
    y=[readout(u,v) for u,v in rows]
    def corr(a,b):
        ma=sum(a)/len(a);mb=sum(b)/len(b)
        return sum((x-ma)*(z-mb) for x,z in zip(a,b))/math.sqrt(sum((x-ma)**2 for x in a)*sum((z-mb)**2 for z in b))
    correlations=[corr([r[j] for r in rows],y) for j in range(2)]
    for v in correlations:close(v,1.)
    clean=readout(1,1);corrupt=readout(0,0)
    patches=[readout(1,0),readout(0,1)]
    recovery=[(v-corrupt)/(clean-corrupt) for v in patches]
    assert recovery==[1.,0.]
    return dict(passed=True,one_sparse_recovery=sparse,dense_collision=dense,sae_identity_solution=analytic,grid_solution=grid,sae_objective=objective,observational_correlations=correlations,clean=clean,corrupt=corrupt,patched_logits=patches,recovery=recovery,scope='Fixed artificial dictionaries and readout, not trained SAEs or measured LLM explanations.')

def computation():
    functions={'a':(1,2,0),'b':(1,0,2)}
    def direct(word):
        state=0;trace=[state]
        for symbol in word:state=functions[symbol][state];trace.append(state)
        return state,trace
    def compose(later,earlier):return tuple(later[earlier[q]] for q in range(3))
    def reduce_tree(items):
        if not items:return (0,1,2)
        if len(items)==1:return items[0]
        mid=len(items)//2
        return compose(reduce_tree(items[mid:]),reduce_tree(items[:mid]))
    def mat_vec(symbol,vector):
        return [sum(int(functions[symbol][j]==i)*vector[j] for j in range(3)) for i in range(3)]
    checked=0
    for n in range(9):
        for word in itertools.product('ab',repeat=n):
            state,_=direct(word);v=[1,0,0]
            for symbol in word:v=mat_vec(symbol,v)
            assert v==[int(i==state) for i in range(3)]
            assert reduce_tree([functions[s] for s in word])[0]==state
            checked+=1
    assert direct('ab')[0]==0 and direct('ba')[0]==2
    # Parity by a depth-three threshold/AND/OR construction, not an Attention theorem.
    parity_cases=0
    for n in range(11):
        for bits in itertools.product((0,1),repeat=n):
            total=sum(bits);threshold=lambda k:int(total>=k)
            result=any(threshold(k) and not threshold(k+1) for k in range(1,n+1,2))
            assert int(result)==total%2;parity_cases+=1
    b=3;n=10
    encodings=[round((2**b-1)*i/(n-1)) for i in range(n)]
    assert len(set(encodings))<=2**b<n
    return dict(passed=True,automaton_cases=checked,parity_cases=parity_cases,trace_abba=direct('abba')[1],ab_final=direct('ab')[0],ba_final=direct('ba')[0],three_bit_position_codes=encodings,distinct_codes=len(set(encodings)),scope='Finite automata/composition/threshold identities only; not a simulation of a Transformer or proof of cited complexity theorems.')

P,Q,R='p','q','r'
def imp(a,b):return ('imp',a,b)
def evaluate(formula,assignment):
    if isinstance(formula,str):return assignment[formula]
    op,*args=formula
    if op=='imp':return not evaluate(args[0],assignment) or evaluate(args[1],assignment)
    if op=='not':return not evaluate(args[0],assignment)
    raise ValueError('Unsupported connective')

def check_proof(premises,goal,lines):
    derived=[]
    for line in lines:
        if not isinstance(line,(tuple,list)) or not line:return False
        rule=line[0]
        if rule=='premise':
            if len(line)!=2:return False
            i=line[1]
            if type(i) is not int or not 0<=i<len(premises):return False
            derived.append(premises[i])
        elif rule=='mp':
            if len(line)!=3:return False
            i,j=line[1:]
            if any(type(k) is not int or not 0<=k<len(derived) for k in (i,j)):return False
            antecedent,conditional=derived[i],derived[j]
            if not isinstance(conditional,tuple) or len(conditional)!=3 or conditional[0]!='imp' or conditional[1]!=antecedent:return False
            derived.append(conditional[2])
        else:return False
    return bool(derived) and derived[-1]==goal

def dpll(clauses):
    # Integer signed literals; an empty list of clauses is True, empty clause False.
    clauses=[set(c) for c in clauses]
    if any(not c for c in clauses):return False
    if not clauses:return True
    unit=next((next(iter(c)) for c in clauses if len(c)==1),None)
    lit=unit if unit is not None else next(iter(clauses[0]))
    def assign(l):return [c-{-l} for c in clauses if l not in c]
    if dpll(assign(lit)):return True
    return False if unit is not None else dpll(assign(-lit))

def formal():
    premises=[P,imp(P,Q),imp(Q,R)]
    certificate=[('premise',0),('premise',1),('premise',2),('mp',0,1),('mp',3,2)]
    assert check_proof(premises,R,certificate)
    for bad in [[()], [('mp',0)], [('premise',)], [[None]], [('premise',-1)],certificate[:-1],[('premise',0),('mp',0,99)],[('premise',1),('premise',0),('mp',0,1)]]:assert not check_proof(premises,R,bad)
    candidates=[('unjustified goal',[('premise',0)]),('forward reference',[('mp',3,2)]),('valid MP certificate',certificate)]
    verdicts=[{'candidate':name,'accepted':check_proof(premises,R,proof)} for name,proof in candidates]
    satisfying=[];counterexamples=[]
    for values in itertools.product((False,True),repeat=3):
        a=dict(zip((P,Q,R),values))
        if all(evaluate(f,a) for f in premises):satisfying.append(a);assert evaluate(R,a)
        if evaluate(imp(P,Q),a) and not evaluate(imp(Q,P),a):counterexamples.append(a)
    assert counterexamples
    clauses=[[-1,2],[-2,3],[1],[-3]];assert not dpll(clauses)
    rng=random.Random(SEED);checked=0
    for _ in range(300):
        cnf=[[rng.choice([-1,1])*rng.randint(1,4) for _ in range(rng.randrange(4))] for _ in range(rng.randrange(7))]
        brute=any(all(any((values[abs(l)-1] if l>0 else not values[abs(l)-1]) for l in clause) for clause in cnf) for values in itertools.product((False,True),repeat=4))
        assert dpll(cnf)==brute;checked+=1
    # Deliberately inconsistent premises entail everything semantically; not real-world validity.
    inconsistent=[P,('not',P)]
    assert not any(all(evaluate(f,dict(zip((P,Q,R),v))) for f in inconsistent) for v in itertools.product((False,True),repeat=3))
    return dict(passed=True,candidate_verdicts=verdicts,certificate=certificate,premise_models=satisfying,invalid_converse_counterexample=counterexamples[0],entailment_cnf_unsatisfiable=True,dpll_truth_table_cases=checked,scope='Exact finite propositional checker and SAT cross-check. No Lean/Z3 execution, no full first-order prover, no formal verification of Python itself.')

if __name__=='__main__':
    print(json.dumps(dict(python=platform.python_version(),dependencies='standard library only',seed=SEED,absolute_tolerance=TOL,grid_step=.001,results={'N08':interpretability(),'N15':computation(),'N16':formal()}),ensure_ascii=False,indent=2,allow_nan=False))
