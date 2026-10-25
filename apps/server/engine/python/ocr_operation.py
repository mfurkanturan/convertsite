import csv
import os
import re
import subprocess
from PIL import Image, ImageOps
from common import input_path, pdf_pages, render_page, run, EngineError
from font_support import font_for_text

DEJAVU_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
_installed_languages = None


def requested_language(options):
    global _installed_languages
    language = options.get("language", "tur")
    parts = language.split("+")
    if (len(parts) > 2 or len(set(parts)) != len(parts) or
            any(not re.fullmatch(r"[a-z0-9_]{3,20}", part) for part in parts)):
        raise EngineError("INVALID_OPTIONS")
    if _installed_languages is None:
        result = subprocess.run(["/usr/bin/tesseract", "--list-langs"], capture_output=True,
                                text=True, timeout=10, check=False)
        if result.returncode:
            raise EngineError("ENGINE_UNAVAILABLE")
        _installed_languages = set(result.stdout.splitlines()[1:])
    if any(part not in _installed_languages or part == "osd" for part in parts):
        raise EngineError("INVALID_OPTIONS")
    return "+".join(parts)


def extract_text(inputs, options, directory):
    language = requested_language(options)
    item = inputs[0]
    source = input_path(item)
    total = pdf_pages(source) if item["kind"] == "pdf" else 1
    texts = []
    for number in range(1, total + 1):
        raster = render_page(source, number, directory, 150, "png") if item["kind"] == "pdf" else source
        prepared = directory / "ocr-input.png"
        with Image.open(raster) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            image.thumbnail((3000, 3000))
            ImageOps.autocontrast(image.convert("L")).save(prepared)
        prefix = directory / f"text-{number}"
        run("/usr/bin/tesseract", [prepared, prefix, "-l", language, "--dpi", "150", "--psm", "3"])
        texts.append(prefix.with_suffix(".txt").read_text(encoding="utf-8").strip())
        if raster != source:
            raster.unlink(missing_ok=True)
    text = "\n\f\n".join(texts)
    if not text.strip():
        raise EngineError("NO_TEXT")
    output = directory / "result.txt"
    output.write_text(text, encoding="utf-8")
    return output, "txt"


def make_searchable_pdf(inputs, options, directory):
    import fitz
    item = inputs[0]
    source = input_path(item)
    total = pdf_pages(source)
    language = requested_language(options)
    dpi = 300
    fontfile = DEJAVU_SANS if os.path.isfile(DEJAVU_SANS) else None
    doc = fitz.open(source)
    any_text = False
    for number in range(1, total + 1):
        raster = render_page(source, number, directory, dpi, "png")
        prefix = directory / f"ocr-{number}"
        run("/usr/bin/tesseract", [raster, prefix, "-l", language, "--dpi", dpi, "--psm", "3", "tsv"])
        page = doc[number - 1]
        with Image.open(raster) as image:
            img_w, img_h = image.size
        rect = page.rect
        scale_x = rect.width / img_w if img_w else 1.0
        scale_y = rect.height / img_h if img_h else 1.0
        tsv_path = prefix.with_suffix(".tsv")
        lines = {}
        with open(tsv_path, encoding="utf-8", newline="") as handle:
            for row in csv.DictReader(handle, delimiter="\t"):
                if row.get("level") != "5":
                    continue
                text = (row.get("text") or "").strip()
                if not text:
                    continue
                try:
                    left = float(row["left"]) * scale_x
                    top = float(row["top"]) * scale_y
                    height = float(row["height"]) * scale_y
                except (KeyError, ValueError):
                    continue
                fontsize = max(1.0, height)
                line_id = (row.get("block_num"), row.get("par_num"), row.get("line_num"))
                lines.setdefault(line_id, []).append((int(row.get("word_num") or 0), left, top, fontsize, text))
        for words in lines.values():
            for index, (_, left, top, fontsize, word) in enumerate(words):
                try:
                    word_font = font_for_text(word) or fontfile
                    font_name = "OCR_" + os.path.basename(word_font).split(".")[0] if word_font else "helv"
                    # A trailing space preserves word boundaries when separate OCR boxes are extracted as PDF text.
                    text = word + (" " if index < len(words) - 1 else "")
                    page.insert_text(fitz.Point(left, top + fontsize), text, fontsize=fontsize,
                                     fontname=font_name, fontfile=word_font, render_mode=3)
                    any_text = True
                except Exception:
                    continue
        raster.unlink(missing_ok=True)
        tsv_path.unlink(missing_ok=True)
    if not any_text:
        doc.close()
        raise EngineError("NO_TEXT")
    output = directory / "result.pdf"
    doc.save(output)
    doc.close()
    return output, "pdf"
