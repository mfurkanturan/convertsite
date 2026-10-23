import json
import sys
from pathlib import Path
from common import EngineError, MAX_OUTPUT, pdf_pages
from validation import inspect_input, inspect_office
from pdf_operations import (
    merge_pdf, edit_pdf, compress_pdf,
    protect_pdf, unlock_pdf, watermark_pdf, add_page_numbers
)
from image_conversions import pdf_to_images, images_to_pdf
from text_conversions import pdf_to_excel
from word_conversion import pdf_to_word
from office_conversions import office_to_pdf
from ocr_operation import extract_text, make_searchable_pdf

OPERATIONS = {
    "merge-pdf": merge_pdf,
    "edit-pdf-pages": edit_pdf,
    "compress-pdf": compress_pdf,
    "pdf-to-images": pdf_to_images,
    "images-to-pdf": images_to_pdf,
    "pdf-to-word": pdf_to_word,
    "pdf-to-excel": pdf_to_excel,
    "word-to-pdf": office_to_pdf,
    "excel-to-pdf": office_to_pdf,
    "pptx-to-pdf": office_to_pdf,
    "protect-pdf": protect_pdf,
    "unlock-pdf": unlock_pdf,
    "page-numbers": add_page_numbers,
    "watermark-pdf": watermark_pdf,
    "ocr": extract_text,
    "pdf-to-pdf-ocr": make_searchable_pdf,
}


def main():
    request = json.loads(sys.argv[1])
    counts = [inspect_input(item) for item in request["inputs"]]
    if request["tool"] == "inspect":
        print(json.dumps({"pages": counts[0]}))
        return
    if sum(counts) > request["maxPages"]:
        raise EngineError("LIMIT_EXCEEDED")
    output, kind = OPERATIONS[request["tool"]](request["inputs"], request["options"], Path(request["directory"]))
    if not output.is_file() or not 0 < output.stat().st_size <= MAX_OUTPUT:
        raise EngineError("LIMIT_EXCEEDED")
    pages = pdf_pages(output) if kind == "pdf" else sum(counts)
    if kind in ("docx", "xlsx"):
        inspect_office(output, kind)
    print(json.dumps({"path": str(output), "kind": kind, "pages": pages}))


try:
    main()
except EngineError as error:
    print("DOCLY_ERROR:" + str(error), file=sys.stderr)
    sys.exit(2)
except Exception:
    print("DOCLY_ERROR:INVALID_DOCUMENT", file=sys.stderr)
    sys.exit(2)
