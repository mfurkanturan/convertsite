from PIL import Image, ImageOps
from common import input_path, pdf_pages, render_page, run, EngineError


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
