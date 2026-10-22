"""Synthetic typography, image, columns and page-break regression fixture."""
from pathlib import Path
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def create_layout_fixture(directory):
    for name, filename in [("Carlito", "Regular"), ("Carlito-Bold", "Bold"), ("Carlito-Italic", "Italic")]:
        pdfmetrics.registerFont(TTFont(name, f"/usr/share/fonts/truetype/crosextra/Carlito-{filename}.ttf"))
    image = Image.new("RGB", (160, 160), "#3564F4")
    ImageDraw.Draw(image).ellipse((30, 30, 130, 130), fill="white")
    logo = directory / "layout-logo.png"
    image.save(logo)
    pdf = canvas.Canvas(str(directory / "layout.pdf"), pagesize=(595.28, 841.89))
    pdf.setFont("Carlito-Bold", 24)
    pdf.drawString(55, 770, "Deniz Örnek")
    pdf.drawImage(str(logo), 485, 737, 55, 55)
    pdf.setFont("Carlito-Italic", 12)
    pdf.drawString(55, 744, "Yazılım Mühendisi")
    pdf.setFont("Carlito", 11)
    pdf.setFillColorRGB(.1, .35, .65)
    pdf.drawString(55, 721, "example.com")
    pdf.linkURL("https://example.com", (55, 719, 117, 734))
    pdf.setFillColorRGB(0, 0, 0)
    for section in range(5):
        top = 675 - section * 122
        pdf.setFont("Carlito-Bold", 14)
        pdf.drawString(55, top, f"Deneyim {section + 1}")
        pdf.setFont("Carlito", 11)
        for line in range(5):
            pdf.drawString(72, top - 25 - line * 16, f"Çözüm {section + 1}.{line + 1}: İstanbul için güvenilir belge işleme sistemleri geliştirdi.")
    pdf.showPage()
    for left, label in [(55, "Sol"), (315, "Sağ")]:
        pdf.setFont("Carlito-Bold", 16)
        pdf.drawString(left, 770, f"{label} Sütun")
        pdf.setFont("Carlito", 11)
        for line in range(15):
            pdf.drawString(left, 740 - line * 20, f"{label} bölüm satır {line + 1}: Türkçe içerik.")
    pdf.save()
