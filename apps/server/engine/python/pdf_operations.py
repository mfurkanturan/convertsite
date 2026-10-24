import os
import shutil
from watermark import apply_watermark
from common import input_path, pdf_pages, pdf_encrypted, qpdf_password, run, page_plan, pack_outputs, EngineError


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
    # qpdf --encrypt has no stdin channel, so the password goes through an @-argument file (0600, job directory, always removed).
    argfile = directory / ".qpdf-args"
    try:
        fd = os.open(argfile, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write("\n".join(["--encrypt", password, password, "256", "--"]) + "\n")
        run("/usr/bin/qpdf", [source, f"@{argfile}", output])
    finally:
        argfile.unlink(missing_ok=True)
    return output, "pdf"


def unlock_pdf(inputs, options, directory):
    source = input_path(inputs[0])
    output = directory / "unlocked.pdf"
    password = options.get("password")
    if pdf_encrypted(source):
        if not password:
            raise EngineError("WRONG_PASSWORD")
        qpdf_password(password, source, "--decrypt", output)
    else:
        run("/usr/bin/qpdf", [source, "--decrypt", output])
    return output, "pdf"


def watermark_pdf(inputs, options, directory):
    output = directory / "watermarked.pdf"
    apply_watermark(input_path(inputs[0]), output, (options.get("watermarkText") or "CONFIDENTIAL").strip())
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
