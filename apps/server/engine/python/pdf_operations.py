import shutil
from common import input_path, pdf_pages, run, page_plan, pack_outputs


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
