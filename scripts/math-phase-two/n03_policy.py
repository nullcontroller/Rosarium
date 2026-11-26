"""Run: python scripts/math-phase-two/n03_policy.py. No random draws."""
import json
import math
from common import close, gradient


def run():
    sigmoid = lambda z: 1/(1+math.exp(-z))
    rows = []
    for theta in [-2., 0., 1.2]:
        p = sigmoid(theta)
        analytic = p*(1-p)
        # Enumerate the two actions, independently of differentiating J.
        enumerated = p * 1 * (1-p) + (1-p)*0*(-p)
        numeric = gradient(lambda z: sigmoid(z[0]), [theta])[0]
        close(analytic, enumerated)
        close(analytic, numeric, 1e-8)
        for b in [0, 0.5, 3.]:
            close(p*(1-b)*(1-p)+(1-p)*(0-b)*(-p), analytic)
        rows.append(dict(theta=theta,p=p,analytic=analytic,numeric=numeric))
    p = .5
    variances = {}
    for b in [0, .5]:
        g = [(1-b)*(1-p), (0-b)*(-p)]
        mean = p*g[0]+(1-p)*g[1]
        variances[str(b)] = p*(g[0]-mean)**2+(1-p)*(g[1]-mean)**2
    close(variances['0'], .0625)
    close(variances['0.5'], 0)
    theta = 0.
    trajectory = []
    for step in range(21):
        p = sigmoid(theta)
        trajectory.append(dict(step=step,theta=theta,p=p))
        theta += p*(1-p)
    assert all(b['p']>a['p'] for a,b in zip(trajectory,trajectory[1:]))
    # Importance sampling identity at a fixed state.
    old, new, reward = [.8,.2], [.3,.7], [0.,2.]
    close(sum(o*n/o*r for o,n,r in zip(old,new,reward)),sum(n*r for n,r in zip(new,reward)))
    clip = lambda rho,a: min(rho*a, max(.8,min(1.2,rho))*a)
    close(clip(1.5,1),1.2)
    close(clip(.5,-1),-.8)
    return dict(article='N03',passed=True,tolerance_gradient=1e-8,gradients=rows,variance=variances,updates=trajectory)


if __name__ == '__main__':
    print(json.dumps(run(),ensure_ascii=False,indent=2))
