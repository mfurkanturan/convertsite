import json
import sys
import fitz

# Reports the rendered red watermark bounding box (as page fractions), embedded fonts and extracted text of page 1.
doc = fitz.open(sys.argv[1])
page = doc[0]
pixmap = page.get_pixmap(dpi=72)
points = [(x, y) for y in range(0, pixmap.height, 2) for x in range(0, pixmap.width, 2)
          if pixmap.pixel(x, y)[0] > pixmap.pixel(x, y)[1] + 40]
box = None
if points:
    xs, ys = [p[0] for p in points], [p[1] for p in points]
    box = [min(xs) / pixmap.width, min(ys) / pixmap.height, max(xs) / pixmap.width, max(ys) / pixmap.height]
print(json.dumps({"box": box, "fonts": [font[3] for font in page.get_fonts()], "text": page.get_text(), "pages": len(doc)}))
