"""Run all five independent examples: python scripts/math-phase-two/verify.py"""
import json
import platform
from n03_policy import run as n03
from n04_preference import run as n04
from n05_rlvr import run as n05
from n13_scaling import run as n13
from n14_speculation import run as n14

print(json.dumps(dict(python=platform.python_version(),dependencies='standard library only',synthetic=True,results=[f() for f in [n03,n04,n05,n13,n14]]),ensure_ascii=False,indent=2))
