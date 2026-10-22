"""OOXML compatibility repairs for the layout converter's flow output."""
import hashlib
import io
from copy import deepcopy
from PIL import Image
from docx.oxml import OxmlElement
from docx.oxml.ns import qn


def explicit_column_breaks(document):
    # Writer treats nextColumn section starts as new pages. Use a column break
    # within the existing section, which both Word and Writer understand.
    sections = list(document.element.iter(qn('w:sectPr')))
    for index in range(len(sections) - 1, 0, -1):
        section, previous = sections[index], sections[index - 1]
        kind = section.find(qn('w:type'))
        if kind is None or kind.get(qn('w:val')) != 'nextColumn':
            continue
        previous_columns = previous.find(qn('w:cols'))
        columns = section.find(qn('w:cols'))
        if columns is None or previous_columns is None:
            continue
        if columns.attrib != previous_columns.attrib:
            continue
        parent = previous.getparent()
        paragraph = parent.getparent()
        run, br = OxmlElement('w:r'), OxmlElement('w:br')
        br.set(qn('w:type'), 'column')
        run.append(br)
        paragraph.append(run)
        spacing = parent.find(qn('w:spacing'))
        if spacing is None:
            spacing = OxmlElement('w:spacing')
            parent.append(spacing)
        for name, value in [('before', '0'), ('after', '0'), ('line', '1'), ('lineRule', 'exact')]:
            spacing.set(qn('w:' + name), value)
        previous_type = previous.find(qn('w:type'))
        if previous_type is None:
            section.remove(kind)
        else:
            kind.set(qn('w:val'), previous_type.get(qn('w:val')))
        parent.remove(previous)


def pixel_key(blob):
    with Image.open(io.BytesIO(blob)) as image:
        if image.width * image.height > 25_000_000:
            return None
        return image.size, hashlib.sha256(image.convert('RGBA').tobytes()).digest()


def positioned_images(document, source):
    # Match decoded pixels, not image order: tables/crops can reorder images.
    locations = {}
    for page in source:
        for block in page.get_text('dict')['blocks']:
            if block['type'] == 1:
                key = pixel_key(block['image'])
                if key:
                    locations.setdefault(key, []).append(block['bbox'])
    for inline in list(document.element.iter(qn('wp:inline'))):
        blip = next(inline.iter(qn('a:blip')), None)
        if blip is None:
            continue
        part = document.part.related_parts.get(blip.get(qn('r:embed')))
        if part is None:
            continue
        choices = locations.get(pixel_key(part.blob))
        if not choices:
            continue
        x0, y0, x1, y1 = choices.pop(0)
        anchor = OxmlElement('wp:anchor')
        for name, value in dict(distT=0, distB=0, distL=0, distR=0, simplePos=0,
                                relativeHeight=1, behindDoc=0, locked=0,
                                layoutInCell=1, allowOverlap=1).items():
            anchor.set(name, str(value))
        simple = OxmlElement('wp:simplePos')
        simple.set('x', '0')
        simple.set('y', '0')
        anchor.append(simple)
        for axis, offset in [('H', x0), ('V', y0)]:
            position, value = OxmlElement('wp:position' + axis), OxmlElement('wp:posOffset')
            position.set('relativeFrom', 'page')
            value.text = str(round(offset * 12700))
            position.append(value)
            anchor.append(position)
        anchor.append(deepcopy(inline.find(qn('wp:extent'))))
        anchor.append(OxmlElement('wp:wrapNone'))
        for name in ['wp:docPr', 'wp:cNvGraphicFramePr', 'a:graphic']:
            child = inline.find(qn(name))
            if child is not None:
                anchor.append(deepcopy(child))
        inline.getparent().replace(inline, anchor)
