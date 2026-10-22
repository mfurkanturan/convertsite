import json
import os
import re
import subprocess
import zipfile
from pathlib import Path

MAX_OUTPUT = 40 * 1024 * 1024
# Set by the engine process runner from DATA_DIR; /data is the isolated compose mount.
DATA_DIR = Path(os.environ.get("DOCLY_DATA_DIR", "/data"))


class EngineError(Exception):
    pass


def run(command, arguments, accepted=(0,)):
    result = subprocess.run([command, *map(str, arguments)], capture_output=True,
                            timeout=35, check=False)
    if result.returncode not in accepted:
        raise EngineError("INVALID_DOCUMENT")
    return result.stdout.decode("utf-8", errors="replace")


def input_path(item):
    if not re.fullmatch(r"[0-9a-fA-F-]{36}", item["id"]):
        raise EngineError("INVALID_DOCUMENT")
    return DATA_DIR / (item["id"] + ".pdf")


def pdf_pages(path):
    run("/usr/bin/qpdf", [path, "--is-encrypted"], accepted=(2,))
    run("/usr/bin/qpdf", [path, "--check"])
    pages = int(run("/usr/bin/qpdf", [path, "--show-npages"]).strip())
    if not 1 <= pages <= 300:
        raise EngineError("LIMIT_EXCEEDED")
    return pages


def page_plan(expression, total):
    if not expression:
        return list(range(1, total + 1))
    if not re.fullmatch(r"[1-9]\d*(?:-[1-9]\d*)?(?:\s*,\s*[1-9]\d*(?:-[1-9]\d*)?)*", expression):
        raise EngineError("INVALID_OPTIONS")
    result = []
    for part in expression.split(","):
        bounds = [int(n) for n in part.strip().split("-")]
        if any(n < 1 or n > total for n in bounds):
            raise EngineError("INVALID_OPTIONS")
        first, last = bounds[0], bounds[-1]
        step = 1 if first <= last else -1
        result.extend(range(first, last + step, step))
        if len(result) > 300:
            raise EngineError("LIMIT_EXCEEDED")
    return result


def pack_outputs(paths, directory, force_zip=False):
    if not paths or sum(path.stat().st_size for path in paths) > MAX_OUTPUT:
        raise EngineError("LIMIT_EXCEEDED")
    if len(paths) == 1 and not force_zip:
        return paths[0], paths[0].suffix[1:]
    output = directory / "result.zip"
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in paths:
            archive.write(path, path.name)
    return output, "zip"


def render_page(source, number, directory, dpi=150, kind="png"):
    info = run("/usr/bin/pdfinfo", ["-f", number, "-l", number, source])
    dimensions = re.search(r"(?:Page\s+\d+\s+size|Page size):\s+([\d.]+) x ([\d.]+)", info)
    limit = []
    if not dimensions or max(map(float, dimensions.groups())) * dpi / 72 > 3000:
        limit = ["-scale-to", "3000"]
    prefix = directory / f"sayfa-{number:03d}"
    run("/usr/bin/pdftoppm", ["-f", number, "-l", number, "-singlefile", "-r", dpi,
                            *limit, "-png" if kind == "png" else "-jpeg", source, prefix])
    path = prefix.with_suffix(".png" if kind == "png" else ".jpg")
    if path.stat().st_size > MAX_OUTPUT:
        raise EngineError("LIMIT_EXCEEDED")
    return path
