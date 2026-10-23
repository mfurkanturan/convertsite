"""Profile experiments only; never changes production settings."""
import json
import statistics
import subprocess
import time
from pathlib import Path
from PIL import Image
import pdfplumber
from evaluate import accuracy

root=Path('/audit'); corpus=root/'corpus'; work=root/'candidates'; work.mkdir(exist_ok=True)
results=[]
expected='MERHABA DUNYA İstanbul Türkiye BELGE TESTI 2026'
for filename in ['text.png','blur.png','skew.png','rotate.png','small.png']:
    for profile,dpi,psm in [('baseline',150,3),('scale-300',300,3),('orientation',150,1)]:
        path=work/f'{Path(filename).stem}-{profile}.png'
        with Image.open(corpus/filename) as im:
            if dpi==300: im=im.resize((im.width*2,im.height*2))
            im.convert('L').save(path)
        runs=[]
        for repeat in range(3):
            started=time.monotonic()
            result=subprocess.run(['/usr/bin/tesseract',str(path),'stdout','-l','tur','--dpi',str(dpi),'--psm',str(psm)],capture_output=True,timeout=35)
            runs.append({'seconds':time.monotonic()-started,'accuracy':accuracy(expected,result.stdout.decode('utf-8',errors='replace')),'exit':result.returncode})
        results.append({'tool':'ocr','fixture':filename,'profile':profile,'runs':runs,'median_seconds':statistics.median(r['seconds'] for r in runs),'min_accuracy':min(r['accuracy'] for r in runs)})
for name in ['table.pdf','borderless.pdf','merged.pdf']:
    for profile,settings in [('baseline',{}),('text-strategy',{'vertical_strategy':'text','horizontal_strategy':'text'})]:
        started=time.monotonic()
        with pdfplumber.open(corpus/name) as pdf:
            tables=[table for page in pdf.pages for table in page.extract_tables(settings)]
        results.append({'tool':'pdf-to-excel','fixture':name,'profile':profile,'seconds':time.monotonic()-started,'tables':tables,'note':'Detection alone does not prove cell accuracy or merged-cell fidelity.'})
protected=root/'artifacts/protect-pdf/plain/repeat-1/protected.pdf'
if protected.exists():
    encrypted=subprocess.run(['/usr/bin/qpdf',str(protected),'--is-encrypted'],capture_output=True).returncode==0
    opens=subprocess.run(['/usr/bin/qpdf','--password=AuditSecret123','--check',str(protected)],capture_output=True).returncode==0
    results.append({'tool':'protect-pdf','profile':'native-diagnostic','encrypted_artifact_written':encrypted,'known_password_opens_artifact':opens,'note':'A valid intermediate artifact does not mean the application published a successful result.'})
unlocked=work/'native-unlocked.pdf'
decryption=subprocess.run(['/usr/bin/qpdf','--password=AuditSecret123',str(corpus/'encrypted-plain.pdf'),'--decrypt',str(unlocked)],capture_output=True)
results.append({'tool':'unlock-pdf','profile':'native-diagnostic','native_decryption_success':decryption.returncode==0})
impress=subprocess.run(['/usr/bin/dpkg-query','-W','-f=${Status}','libreoffice-impress'],capture_output=True,text=True)
results.append({'tool':'pptx-to-pdf','profile':'package-diagnostic','impress_installed':impress.returncode==0 and 'install ok installed' in impress.stdout})
(root/'candidates.json').write_text(json.dumps(results,indent=2,ensure_ascii=False))
print('Profile experiments recorded; production configuration unchanged.')
