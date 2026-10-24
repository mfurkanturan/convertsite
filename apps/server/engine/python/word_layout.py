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


def trim_line_break_spaces(document):
    # pdf2docx writes "line text " + <w:br/>. When the line fills the text width, Writer wraps the trailing
    # space and the break adds a second, empty line, doubling the line pitch.
    for run in document.element.iter(qn('w:r')):
        following = run.getnext()
        if following is None or following.tag != qn('w:r'):
            continue
        children = list(following)
        if len(children) != 1 or children[0].tag != qn('w:br') or children[0].get(qn('w:type')) not in (None, 'textWrapping'):
            continue
        texts = run.findall(qn('w:t'))
        if texts and texts[-1].text and texts[-1].text != texts[-1].text.rstrip(' '):
            texts[-1].text = texts[-1].text.rstrip(' ')


def table_grids(document):
    # pdf2docx writes the right cell widths (w:tcW) but equal w:tblGrid columns. Writer lays out a fixed
    # table from the grid, so every column moved. Rebuild the grid from the cell edges of all rows.
    for table in document.element.iter(qn('w:tbl')):
        rows = table.findall(qn('w:tr'))
        grid = table.find(qn('w:tblGrid'))
        if not rows or grid is None:
            continue
        layouts = []
        for row in rows:
            position, cells = 0, []
            for cell in row.findall(qn('w:tc')):
                properties = cell.find(qn('w:tcPr'))
                width = properties.find(qn('w:tcW')) if properties is not None else None
                if width is None or width.get(qn('w:type')) != 'dxa':
                    cells = None
                    break
                end = position + int(width.get(qn('w:w')))
                cells.append((cell, position, end))
                position = end
            if cells is None:
                layouts = None
                break
            layouts.append(cells)
        if not layouts:
            continue
        edges = []
        for value in sorted({edge for cells in layouts for _, start, end in cells for edge in (start, end)}):
            if not edges or value - edges[-1] > 20:  # 1 pt tolerance between rows
                edges.append(value)
        columns = [b - a for a, b in zip(edges, edges[1:])]
        if not columns:
            continue
        def index(value):
            return min(range(len(edges)), key=lambda i: abs(edges[i] - value))
        for cells in layouts:
            for cell, start, end in cells:
                count = max(1, index(end) - index(start))
                properties = cell.find(qn('w:tcPr'))
                span = properties.find(qn('w:gridSpan'))
                if count == 1 and span is not None:
                    properties.remove(span)
                elif count > 1:
                    if span is None:
                        span = OxmlElement('w:gridSpan')
                        properties.find(qn('w:tcW')).addnext(span)
                    span.set(qn('w:val'), str(count))
        # Writer outdents a table by its default cell margin; the cells carry their own explicit padding.
        properties = table.find(qn('w:tblPr'))
        if properties is not None and properties.find(qn('w:tblCellMar')) is None:
            margins = OxmlElement('w:tblCellMar')
            for side in ('left', 'right'):
                edge = OxmlElement('w:' + side)
                edge.set(qn('w:w'), '0')
                edge.set(qn('w:type'), 'dxa')
                margins.append(edge)
            properties.append(margins)
        for column in list(grid):
            grid.remove(column)
        for width in columns:
            column = OxmlElement('w:gridCol')
            column.set(qn('w:w'), str(width))
            grid.append(column)


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
