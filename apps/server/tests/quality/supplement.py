"""First-repeat pixel and placement evidence; does not replace three-repeat gate results."""
import io
import json
from pathlib import Path
import fitz
from PIL import Image, ImageOps, ImageChops, ImageStat

root=Path('/audit'); corpus=root/'corpus'
manifest=json.loads((root/'manifest.json').read_text())
rows=[]
for case in manifest:
    if case['error']: continue
    tool=case['tool']
    if tool not in ['images-to-pdf','pdf-to-images','page-numbers','watermark-pdf']: continue
    work=root/'artifacts'/tool/case['id'].split('/')[-1]/'repeat-1'
    record={'case':case['id'],'scope':'first_repeat_only','checks':{},'metrics':{}}
    try:
        if tool=='images-to-pdf':
            doc=fitz.open(work/'result.pdf'); record['checks']['page_count']=len(doc)==len(case['inputs'])
            for i,name in enumerate(case['inputs']):
                page=doc[i]; xref=page.get_images()[0][0]
                with Image.open(corpus/name) as original:
                    expected=ImageOps.exif_transpose(original)
                    if expected.mode in ['RGBA','LA']:
                        rgba=expected.convert('RGBA'); expected=Image.new('RGB',rgba.size,'white'); expected.paste(rgba,mask=rgba.getchannel('A'))
                    else: expected=expected.convert('RGB')
                    with Image.open(io.BytesIO(doc.extract_image(xref)['image'])) as actual:
                        equal=expected.size==actual.size and ImageChops.difference(expected,actual.convert('RGB')).getbbox() is None
                    rect=page.get_image_rects(xref)[0]
                    record['checks'][f'image_{i+1}_pixels']=equal
                    record['checks'][f'image_{i+1}_unclipped']=page.rect.contains(rect)
                    record['checks'][f'image_{i+1}_aspect']=abs(rect.width/rect.height-expected.width/expected.height)<.003
        elif tool=='pdf-to-images':
            doc=fitz.open(corpus/case['inputs'][0]); paths=sorted(work.glob('gorsel-*'))
            record['checks']['page_count']=len(paths)==len(doc)
            for i,path in enumerate(paths):
                page=doc[i]; scale=min(case['options']['dpi']/72,3000/max(page.rect.width,page.rect.height))
                pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
                reference=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
                with Image.open(path) as source:
                    actual=source.convert('RGB')
                    record['checks'][f'page_{i+1}_dpi']=abs(actual.width-reference.width)<=1 and abs(actual.height-reference.height)<=1
                    # No rescaling: white-pad at most one renderer-rounding pixel.
                    size=(max(actual.width,reference.width),max(actual.height,reference.height))
                    a=Image.new('RGB',size,'white'); a.paste(reference); b=Image.new('RGB',size,'white'); b.paste(actual)
                    diff=ImageChops.difference(a,b); diff.save(work/f'independent-diff-{i+1}.png')
                    reference.save(work/f'independent-source-{i+1}.png')
                    record['metrics'][f'page_{i+1}_pixel_error']=sum(ImageStat.Stat(diff).mean)/765
                    boxa=ImageOps.invert(a.convert('L')).point(lambda n:255 if n>30 else 0).getbbox()
                    boxb=ImageOps.invert(b.convert('L')).point(lambda n:255 if n>30 else 0).getbbox()
                    record['checks'][f'page_{i+1}_ink_bounds']=boxa==boxb or bool(boxa and boxb and max(abs(x-y) for x,y in zip(boxa,boxb))<=3)
        else:
            path=work/('numbered.pdf' if tool=='page-numbers' else 'watermarked.pdf')
            doc=fitz.open(path)
            for i,page in enumerate(doc):
                expected=f'{i+1} / {len(doc)}' if tool=='page-numbers' else case['options']['watermarkText']
                spans=[s for block in page.get_text('dict')['blocks'] if 'lines' in block for line in block['lines'] for s in line['spans'] if s['text']==expected]
                record['checks'][f'page_{i+1}_text']=bool(spans)
                boxes=[fitz.Rect(s['bbox'])*page.rotation_matrix for s in spans]
                record['checks'][f'page_{i+1}_unclipped']=bool(boxes) and all(page.rect.contains(box) for box in boxes)
                if tool=='page-numbers':
                    position=case['options']['pageNumberPosition']
                    record['checks'][f'page_{i+1}_position']=any((box.y1<50 if position=='top-right' else box.y0>page.rect.height-50) and (box.x0>page.rect.width-100 if position!='bottom-center' else abs((box.x0+box.x1)/2-page.rect.width/2)<page.rect.width*.05) for box in boxes)
                page.get_pixmap(matrix=fitz.Matrix(1,1)).save(str(work/f'overlay-preview-{i+1}.png'))
        record['passed']=bool(record['checks']) and all(record['checks'].values())
    except Exception as error: record.update(passed=False,validator_error=type(error).__name__)
    rows.append(record)
(root/'supplement.json').write_text(json.dumps(rows,indent=2))
print('Supplemental first-repeat checks:',len(rows))
