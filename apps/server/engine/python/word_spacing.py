"""Line pitch repair for pdf2docx paragraphs.

pdf2docx estimates relative line spacing as block_height / (rows * font_line_height), which treats the last row as
if it were followed by spacing too. Two rows 30 pt apart came out as 1.5 (21 pt) instead of about 2.14. The pitch
between row tops is known from the source geometry, so use it directly.
"""
MIN_RATIO = 0.8


def source_pitch_ratio(block):
    horizontal = block.is_horizontal_text
    idx = 1 if horizontal else 0
    rows = block.lines.group_by_physical_rows()
    if len(rows) < 2:
        return None
    tops = [min(line.bbox[idx] for line in row) for row in rows]
    heights = [max(span.line_height for line in row for span in line.spans if hasattr(span, 'line_height')) for row in rows]
    pitch = (tops[-1] - tops[0]) / (len(rows) - 1)
    standard = sum(heights) / len(heights)
    if standard <= 0 or pitch <= 0:
        return None
    return max(pitch / standard, MIN_RATIO)


_installed = False


def install():
    # Patches the library once per process; the engine process runs one conversion and exits.
    global _installed
    if _installed:
        return
    from pdf2docx.image.ImageSpan import ImageSpan
    from pdf2docx.text.TextBlock import TextBlock
    original = TextBlock.parse_relative_line_spacing

    def parse_relative_line_spacing(self):
        original(self)
        if any(isinstance(span, ImageSpan) for line in self.lines for span in line.spans):
            return
        try:
            measured = source_pitch_ratio(self)
        except (AttributeError, ValueError):
            measured = None
        if measured is not None:
            self.line_space = measured

    TextBlock.parse_relative_line_spacing = parse_relative_line_spacing
    _installed = True
