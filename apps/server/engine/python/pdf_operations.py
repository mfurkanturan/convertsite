import shutil
from common import input_path, pdf_pages, run, page_plan, pack_outputs, EngineError


def merge_pdf(inputs, options, directory):
    output = directory / "result.pdf"
    arguments = ["--empty", "--pages"]
    for item in inputs:
        arguments.extend([input_path(item), "1-z"])
    run("/usr/bin/qpdf", [*arguments, "--", output])
    return output, "pdf"


def compress_pdf(inputs, options, directory):
    source = input_path(inputs[0])
    output = directory / "result.pdf"
    run("/usr/bin/qpdf", ["--object-streams=generate", "--recompress-flate", "--compression-level=9", source, output])
    if output.stat().st_size >= source.stat().st_size:
        shutil.copyfile(source, output)
    return output, "pdf"


def edit_pdf(inputs, options, directory):
    source = input_path(inputs[0])
    plan = page_plan(options.get("pages", ""), pdf_pages(source))
    selected = directory / "selected.pdf"
    run("/usr/bin/qpdf", [source, "--pages", source, ",".join(map(str, plan)), "--", selected])
    rotation = options.get("rotation", 0)
    if rotation:
        rotated = directory / "rotated.pdf"
        run("/usr/bin/qpdf", [selected, f"--rotate=+{rotation}:1-z", rotated])
        selected = rotated
    if options.get("mode", "pdf") == "pdf":
        return selected, "pdf"
    paths = []
    for index in range(1, len(plan) + 1):
        output = directory / f"sayfa-{index:03d}.pdf"
        run("/usr/bin/qpdf", [selected, "--pages", selected, index, "--", output])
        paths.append(output)
    return pack_outputs(paths, directory, force_zip=True)


def protect_pdf(inputs, options, directory):
    source = input_path(inputs[0])
    output = directory / "protected.pdf"
    password = options.get("password")
    if not password:
        raise EngineError("INVALID_OPTIONS")
    run("/usr/bin/qpdf", [source, "--encrypt", password, password, "256", "--", output])
    return output, "pdf"


def unlock_pdf(inputs, options, directory):
    source = input_path(inputs[0])
    output = directory / "unlocked.pdf"
    password = options.get("password")
    arguments = []
    if password:
        arguments.append(f"--password={password}")
    arguments.extend(["--decrypt", source, output])
    run("/usr/bin/qpdf", arguments)
    return output, "pdf"


def watermark_pdf(inputs, options, directory):
    import fitz
    source = input_path(inputs[0])
    output = directory / "watermarked.pdf"
    text = (options.get("watermarkText") or "CONFIDENTIAL").strip()
    doc = fitz.open(source)
    for page in doc:
        rect = page.rect
        p = fitz.Point(rect.width * 0.15, rect.height * 0.5)
        try:
            m = fitz.Matrix(-35)
            page.insert_text(p, text, fontsize=38, fontname="helv", color=(0.75, 0.2, 0.2), fill_opacity=0.35, morph=(p, m))
        except Exception:
            page.insert_textbox(rect, f"\n\n\n{text}", fontsize=44, fontname="helv", color=(0.75, 0.2, 0.2), fill_opacity=0.35, align=fitz.TEXT_ALIGN_CENTER)
    doc.save(output)
    doc.close()
    return output, "pdf"


def add_page_numbers(inputs, options, directory):
    import fitz
    source = input_path(inputs[0])
    output = directory / "numbered.pdf"
    position = options.get("pageNumberPosition", "bottom-center")
    doc = fitz.open(source)
    total = len(doc)
    for idx, page in enumerate(doc, 1):
        rect = page.rect
        text = f"{idx} / {total}"
        if position == "bottom-right":
            point = fitz.Point(rect.width - 80, rect.height - 25)
        elif position == "top-right":
            point = fitz.Point(rect.width - 80, 30)
        else:
            point = fitz.Point(rect.width / 2 - 20, rect.height - 25)
        page.insert_text(point, text, fontsize=10, fontname="helv", color=(0.3, 0.3, 0.3))
    doc.save(output)
    doc.close()
    return output, "pdf"
