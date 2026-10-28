"""Convert a text-based PDF to Markdown, extracting embedded images as downsampled WebP."""
import zipfile
import pymupdf
from PIL import Image
from common import EngineError, input_path

# find_tables() otherwise prints a stdout recommendation that would corrupt
# the JSON result read back by the engine gateway.
pymupdf.no_recommend_layout()

MAX_CHARS = 1_000_000
MAX_IMAGE_DIM = 1600
WEBP_QUALITY = 80
BOLD = 16
ITALIC = 2
BULLETS = ("•", "-", "–", "—", "·")


def to_rgb_pixmap(document, xref):
    try:
        pixmap = pymupdf.Pixmap(document, xref)
    except Exception:
        return None
    if pixmap.width < 1 or pixmap.height < 1:
        return None
    if pixmap.n != 3 or pixmap.alpha:
        pixmap = pymupdf.Pixmap(pymupdf.csRGB, pixmap)
    return pixmap


def save_image(pixmap, directory, page_no, index):
    try:
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    except Exception:
        return None
    image.thumbnail((MAX_IMAGE_DIM, MAX_IMAGE_DIM))
    name = f"page-{page_no:02d}-img-{index:02d}.webp"
    try:
        image.save(directory / name, "WEBP", quality=WEBP_QUALITY, method=6)
    except Exception:
        # WebP support may be missing in this Pillow build; fall back to PNG.
        name = f"page-{page_no:02d}-img-{index:02d}.png"
        image.save(directory / name, "PNG")
    return name


def body_font_size(page):
    weights = {}
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                text = span["text"].strip()
                if text:
                    key = round(span["size"], 1)
                    weights[key] = weights.get(key, 0) + len(text)
    return max(weights, key=weights.get) if weights else 11.0


def inline_markdown(spans):
    parts = []
    for span in spans:
        text = span["text"]
        if not text:
            continue
        stripped = text.rstrip()
        trailing = text[len(stripped):]
        if span["flags"] & BOLD:
            stripped = f"**{stripped}**"
        if span["flags"] & ITALIC:
            stripped = f"*{stripped}*"
        parts.append(stripped + trailing)
    return "".join(parts)


def line_markdown(line, body):
    spans = line["spans"]
    raw = "".join(span["text"] for span in spans).strip()
    if not raw:
        return ""
    max_size = max((span["size"] for span in spans), default=0)
    if max_size >= body * 1.5:
        return "# " + raw
    if max_size >= body * 1.25:
        return "## " + raw
    leading = ""
    for marker in BULLETS:
        if raw.startswith(marker):
            leading = marker
            break
    content = inline_markdown(spans).strip()
    if leading:
        content = content[len(leading):].strip()
        return "- " + content
    return content


def text_block_markdown(block, body):
    lines = []
    for line in block.get("lines", []):
        rendered = line_markdown(line, body)
        if rendered:
            lines.append(rendered)
    return "\n".join(lines)


def clean_cell(value):
    if value is None:
        return ""
    return str(value).replace("\n", " ").replace("|", "\\|").strip()


def table_markdown(table):
    rows = [list(row) for row in table.extract()]
    if not rows:
        return ""
    width = max(len(row) for row in rows)
    rows = [row + [""] * (width - len(row)) for row in rows]
    while rows and not any(clean_cell(cell) for cell in rows[-1]):
        rows.pop()
    if not rows:
        return ""
    while width > 0 and all(not clean_cell(row[width - 1]) for row in rows):
        for row in rows:
            row.pop()
        width -= 1
    header = rows[0]
    lines = [
        "| " + " | ".join(clean_cell(cell) for cell in header) + " |",
        "| " + " | ".join("---" for _ in header) + " |",
    ]
    for row in rows[1:]:
        lines.append("| " + " | ".join(clean_cell(cell) for cell in row) + " |")
    return "\n".join(lines)


def pdf_to_markdown(inputs, options, directory):
    item = inputs[0]
    source = input_path(item)
    document = pymupdf.open(source)
    try:
        if not any(page.get_text().strip() for page in document):
            raise EngineError("NO_TEXT")
        pages = []
        seen_xrefs = set()
        image_index = 0
        text_chars = 0
        for page_no, page in enumerate(document, 1):
            body = body_font_size(page)
            try:
                tables = page.find_tables().tables
            except Exception:
                tables = []
            table_bboxes = [pymupdf.Rect(table.bbox) for table in tables]
            items = []
            for block in page.get_text("dict")["blocks"]:
                if block.get("type") != 0:
                    continue
                bbox = pymupdf.Rect(block["bbox"])
                if any(bbox in region for region in table_bboxes):
                    continue
                rendered = text_block_markdown(block, body)
                if rendered:
                    items.append((bbox.y0, rendered))
            for table in tables:
                rendered = table_markdown(table)
                if rendered:
                    items.append((table.bbox[1], rendered))
            for image in page.get_images(full=True):
                xref = image[0]
                if xref in seen_xrefs:
                    continue
                seen_xrefs.add(xref)
                pixmap = to_rgb_pixmap(document, xref)
                if pixmap is None:
                    continue
                image_index += 1
                name = save_image(pixmap, directory, page_no, image_index)
                if not name:
                    continue
                try:
                    rects = page.get_image_rects(xref)
                    top = rects[0].y0 if rects else float("inf")
                except Exception:
                    top = float("inf")
                items.append((top, f"![](./{name})"))
            items.sort(key=lambda entry: entry[0])
            markdown = "\n\n".join(rendered for _, rendered in items)
            text_chars += len(markdown)
            if text_chars > MAX_CHARS:
                raise EngineError("LIMIT_EXCEEDED")
            if markdown:
                pages.append(markdown)
        markdown_path = directory / "document.md"
        markdown_path.write_text("\n\n---\n\n".join(pages), encoding="utf-8")
    finally:
        document.close()

    output = directory / "result.zip"
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.write(markdown_path, "document.md")
        for path in sorted(directory.iterdir()):
            if path.suffix in (".webp", ".png"):
                archive.write(path, path.name)
    return output, "zip"
