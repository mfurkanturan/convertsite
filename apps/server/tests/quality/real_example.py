"""Private, opt-in local comparison; prints no document text or identifying metadata."""
import json
import sys
from pathlib import Path
from run import execute
from evaluate import accuracy, pdf_text, docx_text

root=Path('/audit')
case={'id':'pdf-to-word/local-example','tool':'pdf-to-word','inputs':['source.pdf'],'options':{},'error':None,'expect':{'content':True,'layout':True}}
result=execute(case,root,root,'repeat-1')
result.pop('signature',None)
result['privacy']='local-only; no public report, database, external conversion API or Git fixture contains the document'
result['reference_limit']='Normalized sequence accuracy is sensitive to geometric versus logical reading order in real multi-column documents; not a standalone data-loss verdict.'
if (root/'previous.docx').exists():
    sys.path.insert(0,'/source/engine/python')
    from validation import inspect_office
    try:
        inspect_office(root/'previous.docx','docx')
        result['previous_raw_sequence_accuracy']=accuracy(pdf_text(root/'source.pdf'),docx_text(root/'previous.docx'))
    except Exception:
        result['previous_comparison']='rejected by current Office safety inspection; not rendered or bypassed'
(root/'result.json').write_text(json.dumps(result,indent=2))
print('Private local comparison saved under .qa/engine-real; document contents were not printed.')
