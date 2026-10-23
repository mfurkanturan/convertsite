"""Opt-in diagnostics: only exception type/location/executable/exit, never document data."""
import runpy
import sys
from pathlib import Path

engine=Path(__file__).parents[2]/'engine/python'
sys.path.insert(0,str(engine))
def trace(frame,event,arg):
    if event=='exception' and Path(frame.f_code.co_filename).parent==engine:
        exception=arg[0].__name__
        result=frame.f_locals.get('result')
        executable=Path(str(frame.f_locals.get('command',''))).name
        print(f'AUDIT_FAILURE:{Path(frame.f_code.co_filename).name}:{frame.f_lineno}:{exception}:{executable}:{getattr(result,"returncode","")}',file=sys.stderr)
    return trace
sys.settrace(trace)
runpy.run_path(str(engine/'main.py'),run_name='__main__')
