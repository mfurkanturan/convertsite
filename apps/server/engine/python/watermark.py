import math
import os
from common import EngineError
from font_support import font_for_text

FONT_FILE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
ANGLE = math.radians(35)
MAX_FONT = 44
MIN_FONT = 10
MARGIN = 0.9
COLOR = (0.75, 0.2, 0.2)


def load_font(font_file):
    import fitz
    try:
        return fitz.Font(fontfile=font_file)
    except Exception:
        raise EngineError("ENGINE_UNAVAILABLE")


def font_size(font, text, width, height):
    # Largest size (<= MAX_FONT) whose rotated bounding box fits the visible page with a margin.
    unit = font.text_length(text, fontsize=1)
    line = 1.2
    cos, sin = math.cos(ANGLE), math.sin(ANGLE)
    box_w = unit * cos + line * sin
    box_h = unit * sin + line * cos
    size = min(MAX_FONT, width * MARGIN / box_w, height * MARGIN / box_h)
    if size < MIN_FONT:
        raise EngineError("INVALID_OPTIONS")
    return size


def stamp_page(page, font, font_file, text):
    import fitz
    visible = page.rect  # CropBox with page rotation applied
    size = font_size(font, text, visible.width, visible.height)
    length = font.text_length(text, fontsize=size)
    cos, sin = math.cos(ANGLE), math.sin(ANGLE)
    center = fitz.Point(visible.width / 2, visible.height / 2)
    # Baseline start in visible coordinates (y grows downwards); the text rises to the right.
    start = fitz.Point(center.x - cos * length / 2 + sin * size * 0.35, center.y + sin * length / 2 + cos * size * 0.35)
    origin = start * page.derotation_matrix
    # Rotate the glyphs by the visible angle plus the page rotation so they read upright on a rotated page.
    turn = fitz.Matrix(math.degrees(ANGLE) + page.rotation)
    font_name = "DocWatermark_" + os.path.basename(font_file).split(".")[0]
    page.insert_text(origin, text, fontsize=size, fontname=font_name, fontfile=font_file,
                     color=COLOR, fill_opacity=0.35, morph=(origin, turn), rotate=0)


def apply_watermark(source, output, text):
    import fitz
    font_file = font_for_text(text) or FONT_FILE
    font = load_font(font_file)
    if any(not font.has_glyph(ord(ch)) for ch in text):
        raise EngineError("INVALID_OPTIONS")
    with fitz.open(source) as doc:
        for page in doc:
            stamp_page(page, font, font_file, text)
        doc.save(output)
