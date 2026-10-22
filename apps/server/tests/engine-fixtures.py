import sys
import runpy
import zipfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from docx import Document
from openpyxl import Workbook
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

directory = Path(sys.argv[1])
directory.mkdir(exist_ok=True, parents=True)
runpy.run_path(str(Path(__file__).with_name("layout-fixture.py")))["create_layout_fixture"](directory)
font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
pdfmetrics.registerFont(TTFont("FixtureFont", font_path))
pdf = canvas.Canvas(str(directory / "table.pdf"))
pdf.setFont("FixtureFont", 16)
pdf.drawString(40, 760, "Türkçe Rapor: İstanbul")
xs, ys = [40, 180, 280, 430], [700, 675, 650, 625]
for x in xs:
    pdf.line(x, ys[-1], x, ys[0])
for y in ys:
    pdf.line(xs[0], y, xs[-1], y)
rows = [["Ürün", "Adet", "Not"], ["Kalem", "12", "=1+1"], ["Defter", "7", "İstanbul"]]
pdf.setFont("FixtureFont", 11)
for r, row in enumerate(rows):
    for c, value in enumerate(row):
        pdf.drawString(xs[c] + 5, ys[r] - 17, value)
pdf.save()
pdf = canvas.Canvas(str(directory / "pages.pdf"))
for index, width in enumerate([300, 400, 500], 1):
    pdf.setPageSize((width, 500))
    pdf.setFont("FixtureFont", 18)
    pdf.drawString(30, 450, f"SAYFA {index}")
    pdf.showPage()
pdf.save()
image = Image.new("RGB", (1800, 650), "white")
draw = ImageDraw.Draw(image)
font = ImageFont.truetype(font_path, 64)
for index, text in enumerate(["MERHABA DUNYA", "İstanbul Türkiye", "BELGE TESTI 2026"]):
    draw.text((80, 60 + index * 150), text, fill="black", font=font)
image.save(directory / "text.png")
image.save(directory / "text.jpg", quality=95)
pdf = canvas.Canvas(str(directory / "scanned.pdf"), pagesize=(900, 325))
pdf.drawImage(str(directory / "text.png"), 0, 0, 900, 325)
pdf.save()
document = Document()
document.add_heading("Türkçe Belge", 0)
document.add_paragraph("Merhaba İstanbul. Şifre çözümü değil, dönüşüm testi.")
document.add_table(rows=1, cols=2).rows[0].cells[0].text = "Kalem"
document.save(directory / "document.docx")
workbook = Workbook()
first = workbook.active
first.title = "Birinci"
first.append(["Ürün", "Adet"])
first.append(["İstanbul Kalem", 12])
second = workbook.create_sheet("İkinci")
second.append(["İkinci Sayfa", 2026])
for sheet in workbook:
    sheet.page_setup.fitToWidth = 1
    sheet.page_setup.fitToHeight = 1
    sheet.sheet_properties.pageSetUpPr.fitToPage = True
workbook.save(directory / "workbook.xlsx")
with zipfile.ZipFile(directory / "document.docx") as source:
    for bad, addition in [("macro.docx", "word/vbaProject.bin"), ("traversal.docx", "../escape.xml")]:
        with zipfile.ZipFile(directory / bad, "w", zipfile.ZIP_DEFLATED) as target:
            for name in source.namelist():
                target.writestr(name, source.read(name))
            target.writestr(addition, "unsafe fixture")
workbook.active["A1"].hyperlink = "https://example.com"
workbook.save(directory / "external.xlsx")
Image.new("RGB", (12000, 1)).save(directory / "wide.png")
