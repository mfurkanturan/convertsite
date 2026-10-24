"""Run with scripts/audit-engines.mjs in a networkless, resource-limited container."""
import argparse
import hashlib
import concurrent.futures
import importlib.metadata
import json
import os
import platform
import re
import shutil
import signal
import subprocess
import time
import uuid
from pathlib import Path
from fixtures import generate, performance_input
from scenarios import cases, TOOLS
from evaluate import evaluate

PYTHON='/opt/docly-python/bin/python'
MAIN=Path(__file__).parents[2]/'engine/python/main.py'


def working_bytes(directory):
    total=0
    for folder, _, names in os.walk(directory):
        for name in names:
            try: total+=(Path(folder)/name).stat().st_size
            except FileNotFoundError: pass  # LibreOffice removes its own cache while sampled.
    return total


def execute(case, corpus, root, label, inspect=True):
    work=Path('/tmp/docly-quality')/case['tool']/case['id'].split('/')[-1]/label
    if work.exists(): shutil.rmtree(work)
    work.mkdir(parents=True,exist_ok=True)
    data=root/'data'; data.mkdir(exist_ok=True)
    inputs=[]
    for name in case['inputs']:
        identifier=str(uuid.uuid4()); shutil.copyfile(corpus/name,data/(identifier+'.pdf'))
        inputs.append({'id':identifier,'kind':Path(name).suffix[1:]})
    limit=50 if case['tool'] in ['pdf-to-word','pdf-to-excel'] else 20 if case['tool']=='ocr' else 30 if case['tool']=='pdf-to-images' else 300
    payload={'tool':case['tool'],'inputs':inputs,'options':case['options'],'directory':str(work),'maxPages':limit}
    environment={**os.environ,'DOCLY_DATA_DIR':str(data),'HOME':'/tmp','LANG':'C.UTF-8','OMP_THREAD_LIMIT':'1','PYTHONDONTWRITEBYTECODE':'1'}
    start=time.monotonic(); peak=0; tmp_peak=0; status=None; usage=None; timed_out=False
    with (work/'stdout.tmp').open('wb') as out, (work/'stderr.tmp').open('wb') as err:
        entry=Path(__file__).with_name('trace_main.py') if case.get('trace') else MAIN
        child=subprocess.Popen(['/usr/bin/prlimit','--as=2147483648','--cpu=80','--fsize=41943040','--nofile=256','--',PYTHON,'-B',str(entry)],stdin=subprocess.PIPE,stdout=out,stderr=err,env=environment,start_new_session=True)
        child.stdin.write(json.dumps(payload).encode('utf-8'))
        child.stdin.close()
        while True:
            waited,status,usage=os.wait4(child.pid,os.WNOHANG)
            peak=max(peak,working_bytes(work))
            tmp_peak=max(tmp_peak,working_bytes(Path('/tmp')))
            if waited: child.returncode=os.waitstatus_to_exitcode(status); break
            if time.monotonic()-start>90:
                timed_out=True; os.killpg(child.pid,signal.SIGKILL)
                _,status,usage=os.wait4(child.pid,0); child.returncode=os.waitstatus_to_exitcode(status); break
            time.sleep(.05)
    elapsed=time.monotonic()-start
    if child.returncode:
        try: os.killpg(child.pid,signal.SIGKILL)
        except ProcessLookupError: pass
    stdout=(work/'stdout.tmp').read_text(errors='replace'); stderr=(work/'stderr.tmp').read_text(errors='replace')
    (work/'stdout.tmp').unlink(); (work/'stderr.tmp').unlink()
    for item in inputs: (data/(item['id']+'.pdf')).unlink(missing_ok=True)
    match=re.search(r'DOCLY_ERROR:([A-Z_]+)',stderr)
    error='PROCESSING_TIMEOUT' if timed_out else match[1] if match else 'ENGINE_FAILED' if child.returncode else None
    result={'case':case['id'],'tool':case['tool'],'label':label,'seconds':elapsed,'cpu_seconds':usage.ru_utime+usage.ru_stime,'child_maxrss_kib':usage.ru_maxrss,'sampled_working_bytes_peak':peak,'sampled_container_tmpfs_bytes_peak':tmp_peak,'error':error,'expected_error':case['error'],'checks':{},'unmeasured':[]}
    result['input_bytes']=sum((corpus/name).stat().st_size for name in case['inputs'])
    result['input_count']=len(case['inputs'])
    if case.get('trace'): result['diagnostics']=re.findall(r'AUDIT_FAILURE:[^\n]+',stderr)
    if case['error']:
        result['checks']={'expected_error':error==case['error']}; result['passed']=error==case['error']; result['supported_output']=False
    elif error:
        result['passed']=False; result['supported_output']=False
    else:
        try:
            artifact=json.loads(stdout.strip().splitlines()[-1]); output=Path(artifact['path'])
            result['output_bytes']=output.stat().st_size; result['kind']=artifact['kind']; result['supported_output']=True
            if inspect: result.update(evaluate(case,output,artifact['kind'],corpus,work))
            else: result['passed']=True; result['unmeasured']=['performance_only_no_quality_verdict']
        except Exception as failure:
            result.update(passed=False,validator_error=type(failure).__name__,unmeasured=['validator_failed'])
    # Production runs in tmpfs, not in a Windows bind mount. Copy evidence only after measurement.
    if label=='repeat-1':
        evidence=root/'artifacts'/case['tool']/case['id'].split('/')[-1]/label
        if evidence.exists(): shutil.rmtree(evidence)
        shutil.copytree(work,evidence)
    shutil.rmtree(work)
    return result


def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--root',default='/audit'); parser.add_argument('--repeats',type=int,default=3); parser.add_argument('--tools',nargs='*'); parser.add_argument('--performance',action='store_true'); parser.add_argument('--performance-only',action='store_true'); parser.add_argument('--replace-tools',action='store_true'); parser.add_argument('--trace-offices',action='store_true')
    args=parser.parse_args(); root=Path(args.root); root.mkdir(parents=True,exist_ok=True)
    corpus=generate(root/'corpus')
    for name in ['plain','unicode','table','borderless','rotated','multipage','landscape','merged']:
        subprocess.run(['/usr/bin/qpdf',str(corpus/(name+'.pdf')),'--encrypt','AuditSecret123','AuditSecret123','256','--',str(corpus/('encrypted-'+name+'.pdf'))],check=True)
    selected=[c for c in cases() if not args.tools or c['tool'] in args.tools]
    (root/'manifest.json').write_text(json.dumps(cases(),indent=2,ensure_ascii=False))
    environment={'python':platform.python_version(),'platform':platform.platform(),'packages':{p:importlib.metadata.version(p) for p in ['pdf2docx','PyMuPDF','pdfplumber','python-docx','openpyxl','Pillow','reportlab']},'repeats':args.repeats,'measurement_notes':['child_maxrss is wait4 high-water RSS including reaped descendants, not a sampled concurrent process-tree sum','working_bytes_peak is sampled at 50ms; very short peaks may be missed','first-in-batch is not proof of OS disk-cache coldness','only checked gates can pass; unmeasured gates prevent production-quality certification']}
    environment['engine_source_sha256']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in MAIN.parent.glob('*.py')}
    environment['native']={}
    for native in ['qpdf','pdftoppm','libreoffice','tesseract']:
        version=subprocess.run(['/usr/bin/'+native,'--version' if native!='pdftoppm' else '-v'],capture_output=True,text=True)
        environment['native'][native]=(version.stdout+version.stderr).splitlines()[:1]
    (root/'environment.json').write_text(json.dumps(environment,indent=2))
    output=root/'results.jsonl'; summaries={}
    if not args.performance_only:
        retained=[]
        if args.replace_tools and output.exists(): retained=[line for line in output.read_text().splitlines() if json.loads(line)['tool'] not in {c['tool'] for c in selected}]
        output.write_text('\n'.join(retained)+ ('\n' if retained else ''))
    for case in ([] if args.performance_only else selected):
        if args.trace_offices and case['tool'] in ['word-to-pdf','excel-to-pdf','pptx-to-pdf']: case['trace']=True
        runs=[]
        for repeat in range(args.repeats):
            row=execute(case,corpus,root,f'repeat-{repeat+1}'); runs.append(row)
            with output.open('a') as f: f.write(json.dumps(row,ensure_ascii=False)+'\n')
        signatures={r.get('signature',r.get('error')) for r in runs}
        summaries[case['id']]={'tool':case['tool'],'all_checked_gates_pass':all(r['passed'] for r in runs),'consistent':len(signatures)==1,'unmeasured':sorted(set(g for r in runs for g in r['unmeasured']))}
        print(case['id'], 'PASS' if summaries[case['id']]['all_checked_gates_pass'] else 'FAIL',flush=True)
    if not args.performance_only:
        recorded=[json.loads(line) for line in output.read_text().splitlines() if line]
        for spec in cases():
            runs=[r for r in recorded if r['case']==spec['id']]
            summaries[spec['id']]={'tool':spec['tool'],'runs':len(runs),'all_checked_gates_pass':len(runs)==args.repeats and all(r['passed'] for r in runs),'consistent':bool(runs) and len({r.get('signature',r.get('error')) for r in runs})==1,'unmeasured':sorted({g for r in runs for g in r['unmeasured']})}
        (root/'summary.json').write_text(json.dumps(summaries,indent=2,ensure_ascii=False))
    if args.performance or args.performance_only:
        # Three representative loads per tool; actual input dimensions are recorded, not called near-limit blindly.
        with (root/'performance.jsonl').open('w') as f:
            for tool in [t for t in TOOLS if not args.tools or t in args.tools]:
                base=next(c for c in selected if c['tool']==tool and not c['error'])
                for tier in ['small','medium','near']:
                    c={**base,'id':tool+'/perf-'+tier}
                    c['inputs'],c['options'],units=performance_input(tool,tier,corpus,base)
                    for repeat in range(6):
                        r=execute(c,corpus,root,f'perf-{tier}-{repeat}',False); r.update(tier=tier,units=units,unscaled_tier=False,first_in_batch=repeat==0)
                        f.write(json.dumps(r)+'\n'); f.flush()
                    # Same workload under two concurrent processes; container budget remains shared.
                    with concurrent.futures.ThreadPoolExecutor(2) as pool:
                        rows=list(pool.map(lambda i: execute(c,corpus,root,f'concurrent-{tier}-{i}',False),range(2)))
                    for r in rows: r.update(tier=tier,concurrency=2,unscaled_tier=c.get('unscaled_tier',False)); f.write(json.dumps(r)+'\n')
                    f.flush(); print('PERF',tool,tier,flush=True)
    cgroup={}
    for name in ['memory.peak','memory.events','pids.peak','cpu.stat']:
        path=Path('/sys/fs/cgroup')/name
        if path.exists(): cgroup[name]=path.read_text().strip()
    (root/('cgroup-performance.json' if args.performance_only else 'cgroup-quality.json')).write_text(json.dumps(cgroup,indent=2))


if __name__=='__main__': main()
