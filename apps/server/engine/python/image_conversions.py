from PIL import Image, ImageOps
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from common import input_path, pdf_pages, page_plan, pack_outputs, render_page


def pdf_to_images(inputs, options, directory):
    source = input_path(inputs[0])
    plan = page_plan(options.get("pages", ""), pdf_pages(source))
    kind = options.get("format", "jpg")
    paths = []
    for index, number in enumerate(plan):
        rendered = render_page(source, number, directory, options.get("dpi", 100), kind)
        output = directory / f"gorsel-{index + 1:03d}.{kind}"
        rendered.rename(output)
        paths.append(output)
    return pack_outputs(paths, directory)


def images_to_pdf(inputs, options, directory):
    output = directory / "result.pdf"
    pdf = canvas.Canvas(str(output), pageCompression=1)
    for item in inputs:
        with Image.open(input_path(item)) as original:
            image = ImageOps.exif_transpose(original)
            if image.mode in ("RGBA", "LA") or "transparency" in image.info:
                rgba = image.convert("RGBA")
                image = Image.new("RGB", rgba.size, "white")
                image.paste(rgba, mask=rgba.getchannel("A"))
            else:
                image = image.convert("RGB")
            if options.get("size", "a4") == "image":
                factor = min(0.75, 1440 / max(image.size))
                width, height = image.width * factor, image.height * factor
                margin = 0
            else:
                width, height = landscape(A4) if options.get("orientation") == "landscape" else A4
                margin = 24
            pdf.setPageSize((width, height))
            scale = min((width - 2 * margin) / image.width, (height - 2 * margin) / image.height)
            w, h = image.width * scale, image.height * scale
            pdf.drawImage(ImageReader(image), (width - w) / 2, (height - h) / 2, w, h)
            pdf.showPage()
    pdf.save()
    return output, "pdf"
