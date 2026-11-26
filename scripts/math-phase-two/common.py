"""Python >=3.10; standard library only. All examples are synthetic."""
import math


def softmax(z):
    e = [math.exp(x - max(z)) for x in z]
    return [x / sum(e) for x in e]


def kl(p, q):
    return sum(a * math.log(a / b) for a, b in zip(p, q) if a > 0)


def close(a, b, tol=1e-10):
    assert abs(a - b) <= tol, (a, b, tol)


def gradient(f, z, h=1e-5):
    out = []
    for j in range(len(z)):
        left, right = z.copy(), z.copy()
        left[j] -= h
        right[j] += h
        out.append((f(right) - f(left)) / (2 * h))
    return out


def golden(f, left, right, steps=160):
    # Works on a bracket containing a unimodal minimum. No analytic gradient used.
    ratio = (math.sqrt(5) - 1) / 2
    c, d = right - ratio * (right-left), left + ratio * (right-left)
    fc, fd = f(c), f(d)
    for _ in range(steps):
        if fc < fd:
            right, d, fd = d, c, fc
            c = right-ratio*(right-left)
            fc = f(c)
        else:
            left, c, fc = c, d, fd
            d = left+ratio*(right-left)
            fd = f(d)
    return (left+right)/2
