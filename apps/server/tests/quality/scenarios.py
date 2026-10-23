"""Explicit expected behavior; expected failures never count as supported conversions."""
TOOLS = ['pdf-to-word', 'pdf-to-excel', 'ocr', 'compress-pdf', 'word-to-pdf', 'excel-to-pdf', 'pptx-to-pdf', 'pdf-to-images', 'images-to-pdf', 'merge-pdf', 'edit-pdf-pages', 'protect-pdf', 'unlock-pdf', 'page-numbers', 'watermark-pdf']


def cases():
    result = []
    def add(tool, name, inputs, options=None, error=None, **expect):
        result.append(dict(id=f'{tool}/{name}', tool=tool, inputs=inputs, options=options or {}, error=error, expect=expect))
    pdfs = ['plain', 'unicode', 'table', 'borderless', 'rotated', 'multipage', 'landscape', 'merged']
    for name in ['plain', 'unicode', 'table', 'layout', 'rotated', 'multipage', 'landscape', 'scanned']:
        add('pdf-to-word', name, [name+'.pdf'], error='NO_TEXT' if name == 'scanned' else None, content=True, layout=True)
    for name in ['plain','unicode','table','borderless','rotated','multi-table','landscape','merged']:
        # Deliberately require successful extraction of both ruled and borderless tables.
        add('pdf-to-excel', name, [name+'.pdf'], error=None if name in ['table', 'borderless', 'merged','multi-table'] else 'NO_TABLES', table=True)
    for name, language in [('text.png','tur'), ('english.jpg','eng'), ('scanned.pdf','tur+eng'), ('blur.png','tur'), ('skew.png','tur'), ('rotate.png','tur'), ('small.png','tur'), ('blank.pdf','tur')]:
        add('ocr', name, [name], {'language': language}, error='NO_TEXT' if name == 'blank.pdf' else None, ocr=True)
    for tool in ['compress-pdf', 'merge-pdf', 'edit-pdf-pages', 'protect-pdf', 'unlock-pdf', 'page-numbers', 'watermark-pdf', 'pdf-to-images', 'images-to-pdf']:
        for i, name in enumerate(pdfs):
            inputs = [name+'.pdf']; options = {}; expect = {'content': True}; error=None
            if tool == 'merge-pdf': inputs.append('pages.pdf'); expect['pages'] = [1, 3 if name == 'multipage' else 1]
            if tool == 'edit-pdf-pages':
                inputs = ['pages.pdf']; options = {'pages': ['1','3,1','1-3','3-1','2','1,1','1,3','2,1'][i], 'rotation': [0,90,180,270,0,0,90,0][i], 'mode':'zip' if i == 7 else 'pdf'}
                expect = {'selection': options['pages'], 'rotation': options['rotation']}
            if tool == 'protect-pdf': options = {'password': ['AuditSecret123', 'şifre2026'][i % 2]}; expect = {'encrypted':True}
            if tool == 'unlock-pdf': inputs = ['encrypted-'+name+'.pdf']; options={'password': 'AuditSecret123'}; expect={'unlocked':True, 'source':name+'.pdf'}
            if tool == 'watermark-pdf': options={'watermarkText': ['CONFIDENTIAL','GİZLİ ŞİRKET ÖĞÜT'][i % 2]}; expect={'overlay': options['watermarkText']}
            if tool == 'page-numbers': options={'pageNumberPosition':['bottom-center','bottom-right','top-right'][i % 3]}; expect={'numbers':True}
            if tool == 'pdf-to-images': options={'format':'jpg' if i % 2 else 'png','dpi':100 if i % 2 else 150}; expect={'raster':True}
            if tool == 'images-to-pdf':
                inputs = [[ 'text.png'], ['text.jpg'], ['text.png','text.jpg'], ['small.png'], ['exif.jpg'], ['transparent.png'], ['wide.png'], ['skew.png']][i]
                options={'size':'image' if i % 2 else 'a4','orientation':'landscape' if i % 3 else 'portrait'}; expect={'image_pages':len(inputs)}
                if i==6: error='LIMIT_EXCEEDED'
            add(tool, name, inputs, options, error=error, **expect)
    for tool, ext in [('word-to-pdf','docx'), ('excel-to-pdf','xlsx'), ('pptx-to-pdf','pptx')]:
        for i in range(8):
            add(tool, f'office-{i}', [f'office-{i}.{ext}'], {'sheets':'first' if i % 2 else 'all'} if ext == 'xlsx' else {}, office=ext)
    assert len(result) == 120 and all(sum(c['tool'] == t for c in result) == 8 for t in TOOLS)
    return result
