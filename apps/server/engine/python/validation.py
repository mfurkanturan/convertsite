import re
import stat
import zipfile
import warnings
from defusedxml import ElementTree
from PIL import Image
from common import EngineError, input_path, pdf_pages

Image.MAX_IMAGE_PIXELS = 25_000_000


def inspect_image(path, kind):
    with warnings.catch_warnings():
        warnings.simplefilter("error", Image.DecompressionBombWarning)
        with Image.open(path) as image:
            expected = {"png": "PNG", "jpg": "JPEG"}[kind]
            if image.format != expected or image.width * image.height > 25_000_000 or max(image.size) > 10000:
                raise EngineError("LIMIT_EXCEEDED")
            image.verify()
        with Image.open(path) as image:
            if getattr(image, "n_frames", 1) != 1:
                raise EngineError("UNSUPPORTED_FORMAT")
            image.load()
    return 1


def inspect_office(path, kind):
    with zipfile.ZipFile(path) as archive:
        entries = archive.infolist()
        names = [entry.filename for entry in entries]
        if len(entries) > 2000 or len(set(names)) != len(names) or sum(entry.file_size for entry in entries) > 40 * 1024 * 1024:
            raise EngineError("LIMIT_EXCEEDED")
        if kind == "docx":
            required = "word/document.xml"
        elif kind == "xlsx":
            required = "xl/workbook.xml"
        else:
            required = "ppt/presentation.xml"
        if required not in names or "[Content_Types].xml" not in names:
            raise EngineError("INVALID_DOCUMENT")
        cells = 0
        for entry in entries:
            name = entry.filename
            if name.startswith("/") or ".." in name.split("/") or "\\" in name or ":" in name or stat.S_ISLNK(entry.external_attr >> 16) or entry.flag_bits & 1:
                raise EngineError("INVALID_DOCUMENT")
            if entry.file_size > 20 * 1024 * 1024 or re.search(r"vba|embeddings|\.bin$|externalLinks", name, re.I):
                raise EngineError("UNSUPPORTED_FORMAT")
            if name.endswith((".xml", ".rels")):
                content = archive.read(entry)
                root = ElementTree.fromstring(content)
                if b"macroEnabled" in content or b"vbaProject" in content:
                    raise EngineError("UNSUPPORTED_FORMAT")
                for node in root.iter():
                    if node.get("TargetMode", "").lower() == "external":
                        raise EngineError("UNSUPPORTED_FORMAT")
                    if node.tag.endswith("}c"):
                        cells += 1
                    if node.tag.endswith("}f") and re.search(r"WEBSERVICE|DDE\(|HYPERLINK|\[", node.text or "", re.I):
                        raise EngineError("UNSUPPORTED_FORMAT")
                    if cells > 200000:
                        raise EngineError("LIMIT_EXCEEDED")
        if kind == "pptx":
            return pptx_slides(archive, set(names))
    return 0


def pptx_slides(archive, names):
    # Count slides through presentation relationships, not loose slide XML parts.
    relation = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    presentation = ElementTree.fromstring(archive.read("ppt/presentation.xml"))
    ids = [node.get(relation) for node in presentation.iter() if node.tag.endswith("}sldId")]
    if "ppt/_rels/presentation.xml.rels" not in names or not ids:
        raise EngineError("INVALID_DOCUMENT")
    relations = ElementTree.fromstring(archive.read("ppt/_rels/presentation.xml.rels"))
    targets = {node.get("Id"): node.get("Target", "") for node in relations.iter() if node.tag.endswith("}Relationship")}
    for rid in ids:
        target = targets.get(rid, "")
        part = target.lstrip("/") if target.startswith("/") else "ppt/" + target
        if not target or part not in names:
            raise EngineError("INVALID_DOCUMENT")
    if len(ids) > 300:
        raise EngineError("LIMIT_EXCEEDED")
    return len(ids)


def inspect_input(item, password=None, encrypted_ok=False):
    path = input_path(item)
    if path.stat().st_size <= 0 or path.stat().st_size > 20 * 1024 * 1024:
        raise EngineError("LIMIT_EXCEEDED")
    kind = item["kind"]
    inspectors = {"pdf": lambda: pdf_pages(path, password, encrypted_ok), "jpg": lambda: inspect_image(path, kind),
                  "png": lambda: inspect_image(path, kind), "docx": lambda: inspect_office(path, kind),
                  "xlsx": lambda: inspect_office(path, kind), "pptx": lambda: inspect_office(path, kind)}
    if kind not in inspectors:
        raise EngineError("UNSUPPORTED_FORMAT")
    return inspectors[kind]()
