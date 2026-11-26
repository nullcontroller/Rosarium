"""R2: independent finite checks for norms, parallel work/depth, search bounds, SAT stopping."""
import itertools,json,math,platform

def run():
    # Same L1 mass, different support count: L1 is not a count.
    vectors=[(.7,.1),(.8,0.)]
    l1=[sum(abs(x) for x in v) for v in vectors];counts=[sum(x!=0 for x in v) for v in vectors]
    assert math.isclose(l1[0],l1[1],abs_tol=1e-12) and counts==[2,1]
    # Adjacent level-by-level binary reduction, count every combine independently.
    trees=[]
    for n in range(1,66):
        width=n;levels=[]
        while width>1:
            levels.append(width//2);width=(width+1)//2
        work=sum(levels);depth=len(levels)
        assert work==n-1
        assert depth==(n-1).bit_length()
        trees.append(dict(n=n,combines=work,parallel_depth=depth,peak_parallel_combines=max(levels,default=0),sequential_combine_steps=work))
    bounds=[]
    for b in range(1,6):
        for d in range(9):
            # Explicit traversal count versus closed form, not only formula transcription.
            pending=[0];visited=0
            while pending:
                level=pending.pop();visited+=1
                if level<d:pending.extend([level+1]*b)
            closed=d+1 if b==1 else (b**(d+1)-1)//(b-1)
            assert visited==sum(b**j for j in range(d+1))==closed
            if b>=2:assert closed<=2*b**d
            bounds.append(dict(branching=b,depth=d,nodes=visited))
    # Artificial SAT predicates: same 2^m search space, distinct termination positions.
    m=4;assignments=list(itertools.product((False,True),repeat=m))
    def enumerate_until(predicate):
        checked=0
        for values in assignments:
            checked+=1
            if predicate(values):return True,checked
        return False,checked
    cases={name:enumerate_until(f) for name,f in [('first',lambda v:not any(v)),('last',lambda v:all(v)),('unsatisfiable',lambda v:v[0] and not v[0])]}
    assert cases=={'first':(True,1),'last':(True,16),'unsatisfiable':(False,16)}
    return {'passed':True,'python':platform.python_version(),'dependencies':'standard library only','randomness':'none','tolerance':1e-12,'l1_values':l1,'nonzero_counts':counts,'parallel_trees':trees,'search_bounds':bounds,'sat_termination':cases,'scope':'Finite artificial examples; no measured parallel speed, LLM or proof-assistant execution.'}

if __name__=='__main__':print(json.dumps(run(),ensure_ascii=False,indent=2))
