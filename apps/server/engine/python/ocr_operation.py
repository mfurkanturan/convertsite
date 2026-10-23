import csv
import os
from PIL import Image, ImageOps
from common import input_path, pdf_pages, render_page, run, EngineError

DEJAVU_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def extract_text(inputs, options, directory):
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
        run("/usr/bin/tesseract", [prepared, prefix, "-l", options.get("language", "tur"), "--dpi", "150", "--psm", "3"])
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
    language = options.get("language", "tur")
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
                baseline = top + fontsize
                try:
                    page.insert_text(fitz.Point(left, baseline), text, fontsize=fontsize,
                                     fontname="DejaVu" if fontfile else "helv", fontfile=fontfile, render_mode=3)
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
