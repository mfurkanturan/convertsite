"""Reconstruct editable Word layout from PDF geometry, rather than plain text."""
import logging
from docx import Document
from docx.oxml.ns import qn
from common import EngineError, input_path
from word_layout import explicit_column_breaks, positioned_images


def remove_external_links(document):
    # Keep styled link text, without creating active external Office relationships.
    # Uploaded Office documents are subject to the same external-link policy.
    for part in document.part.package.parts:
        external = {key for key, relation in part.rels.items() if relation.is_external}
        if not external:
            continue
        root = getattr(part, "element", None)
        if root is None:
            raise EngineError("INVALID_DOCUMENT")
        for link in list(root.iter(qn("w:hyperlink"))):
            if link.get(qn("r:id")) not in external:
                continue
            parent = link.getparent()
            position = parent.index(link)
            for child in list(link):
                # pdf2docx nests hyperlinks inside an already styled w:r.
                # A w:r inside another w:r is invalid and disappears in Writer.
                content = list(child) if parent.tag == qn("w:r") and child.tag == qn("w:r") else [child]
                for element in content:
                    if parent.tag == qn("w:r") and element.tag == qn("w:rPr"):
                        continue
                    parent.insert(position, element)
                    position += 1
            parent.remove(link)
        for key in external:
            part.drop_rel(key)


def pdf_to_word(inputs, options, directory):
    # Lazy import keeps the layout engine's native dependencies out of other tools.
    import pymupdf
    from pdf2docx import Converter

    source = input_path(inputs[0])
    with pymupdf.open(source) as pdf:
        characters = sum(len(page.get_text()) for page in pdf)
    if characters > 1_000_000:
        raise EngineError("LIMIT_EXCEEDED")
    if not characters:
        raise EngineError("NO_TEXT")

    output = directory / "result.docx"
    # The converter uses the root logger for progress; never log document content.
    logging.disable(logging.CRITICAL)
    converter = Converter(str(source))
    try:
        # Keep physical line breaks so short column lines cannot merge and overflow.
        converter.convert(str(output), multi_processing=False, ignore_page_error=False,
                          line_break_width_ratio=1.0)
    finally:
        converter.close()
    document = Document(output)
    remove_external_links(document)
    explicit_column_breaks(document)
    with pymupdf.open(source) as pdf:
        positioned_images(document, pdf)
    document.save(output)
    return output, "docx"
