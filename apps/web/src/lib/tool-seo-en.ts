import type { ToolId } from '@convertsite/contracts';
import type { ToolSeoData } from './tool-seo';

export const toolSeoMapEn: Record<ToolId, ToolSeoData> = {
  "pdf-to-word": {
    "id": "pdf-to-word",
    "title": "PDF to Word",
    "metaTitle": "PDF to Word | DoctorConverter",
    "metaDescription": "Convert text-based PDFs into editable Word documents. Open the DOCX and check headings, columns, tables and page breaks.",
    "h1": "PDF to Word",
    "lead": "Convert text-based PDFs into editable Word documents.",
    "keywords": ["pdf to word", "pdf to docx", "convert pdf to word free", "edit pdf in word"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Select Convert to Word." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the DOCX and check headings, columns, tables and page breaks.",
    "faqs": [
      { "question": "Can I convert scanned PDFs to Word?", "answer": "This tool requires selectable text. Extract text (OCR) can create TXT from scanned pages for use in Word; it does not reconstruct the page layout." }
    ],
    "relatedTools": ["word-to-pdf", "pdf-to-excel", "compress-pdf", "ocr"]
  },
  "word-to-pdf": {
    "id": "word-to-pdf",
    "title": "Word to PDF",
    "metaTitle": "Word to PDF | DoctorConverter",
    "metaDescription": "Convert a DOCX document to PDF. Open the PDF and check fonts, tables and page breaks.",
    "h1": "Word to PDF",
    "lead": "Convert a DOCX document to PDF.",
    "keywords": ["word to pdf", "docx to pdf", "convert word to pdf free", "save word as pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose a DOCX file." },
      { "title": "Start processing", "description": "Select Convert to PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF and check fonts, tables and page breaks.",
    "faqs": [
      { "question": "Can I upload DOC or macro-enabled Word files?", "answer": "Only DOCX is accepted. Office files containing macros, embedded executable content or external links are rejected." }
    ],
    "relatedTools": ["pdf-to-word", "merge-pdf", "compress-pdf"]
  },
  "merge-pdf": {
    "id": "merge-pdf",
    "title": "Merge PDF",
    "metaTitle": "Merge PDF | DoctorConverter",
    "metaDescription": "Combine PDF files in the order you choose. Open the PDF and check the document order and first/last pages.",
    "h1": "Merge PDF",
    "lead": "Combine PDF files in the order you choose.",
    "keywords": ["merge pdf", "combine pdf", "combine pdf files into one", "join pdf", "merge pdf free no watermark"],
    "steps": [
      { "title": "Choose files", "description": "Choose the PDFs to combine." },
      { "title": "Start processing", "description": "Add at least two PDFs. Drag files or use the up/down buttons to set the order, then select Merge PDFs." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF and check the document order and first/last pages.",
    "faqs": [
      { "question": "How do I change the file order?", "answer": "Use the up/down buttons or drag files in the list. To change individual pages, use Edit PDF pages." }
    ],
    "relatedTools": ["compress-pdf", "edit-pdf-pages", "images-to-pdf"]
  },
  "compress-pdf": {
    "id": "compress-pdf",
    "title": "Compress PDF",
    "metaTitle": "Compress PDF | DoctorConverter",
    "metaDescription": "Try to reduce a PDF file’s size. Compare the downloaded file size with the source and the destination’s upload limit.",
    "h1": "Compress PDF",
    "lead": "Try to reduce a PDF file’s size.",
    "keywords": ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf", "make pdf smaller"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Select Compress PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Compare the downloaded file size with the source and the destination’s upload limit.",
    "faqs": [
      { "question": "Why did the file not get smaller?", "answer": "The tool optimizes the PDF’s internal structure without downsampling scanned images. Already optimized files may not shrink; the original file is returned in that case." }
    ],
    "relatedTools": ["merge-pdf", "edit-pdf-pages", "pdf-to-images"]
  },
  "pdf-to-excel": {
    "id": "pdf-to-excel",
    "title": "PDF to Excel",
    "metaTitle": "PDF to Excel | DoctorConverter",
    "metaDescription": "Export detected PDF tables to Excel worksheets. Open the XLSX and compare tables, rows, columns and numeric values with the source.",
    "h1": "PDF to Excel",
    "lead": "Export detected PDF tables to Excel worksheets.",
    "keywords": ["pdf to excel", "pdf to xlsx", "extract table from pdf", "convert pdf table to excel", "bank statement pdf to excel"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Select Export to Excel." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the XLSX and compare tables, rows, columns and numeric values with the source.",
    "faqs": [
      { "question": "Are the exported cells formulas?", "answer": "Cells are written as text that does not execute formulas. Check number and date formats before calculating. Each detected table becomes a separate worksheet." }
    ],
    "relatedTools": ["excel-to-pdf", "pdf-to-word", "ocr"]
  },
  "pdf-to-md": {
    "id": "pdf-to-md",
    "title": "PDF to Markdown",
    "metaTitle": "PDF to Markdown | DoctorConverter",
    "metaDescription": "Convert a text-based PDF into Markdown with headings, lists, tables and links. Images are delivered as downsampled WebP in a ZIP.",
    "h1": "PDF to Markdown",
    "lead": "Convert a text-based PDF into a Markdown file.",
    "keywords": ["pdf to markdown", "pdf to md", "convert pdf to markdown", "pdf to md converter"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Select Convert to Markdown." },
      { "title": "Download the result", "description": "Download the ZIP and check document.md and the WebP images." }
    ],
    "resultCheck": "Open document.md and compare headings, tables and links with the source. Images are separate WebP files.",
    "faqs": [
      { "question": "Can I convert scanned PDFs to Markdown?", "answer": "This tool requires selectable text and does not include OCR. Use Extract text (OCR) for scanned pages." }
    ],
    "relatedTools": ["ocr", "pdf-to-word", "pdf-to-excel"]
  },
  "excel-to-pdf": {
    "id": "excel-to-pdf",
    "title": "Excel to PDF",
    "metaTitle": "Excel to PDF | DoctorConverter",
    "metaDescription": "Convert XLSX worksheets to PDF. Open the PDF and check for clipped columns, orientation and page breaks.",
    "h1": "Excel to PDF",
    "lead": "Convert XLSX worksheets to PDF.",
    "keywords": ["excel to pdf", "xlsx to pdf", "convert spreadsheet to pdf", "save excel as pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose an XLSX file." },
      { "title": "Start processing", "description": "Choose all worksheets or only the first, then select Convert to PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF and check for clipped columns, orientation and page breaks.",
    "faqs": [
      { "question": "Why is my table split across pages?", "answer": "The source workbook’s print area, scale and page settings affect the result. Adjust them in the source file and convert again if needed." }
    ],
    "relatedTools": ["pdf-to-excel", "word-to-pdf", "compress-pdf"]
  },
  "pptx-to-pdf": {
    "id": "pptx-to-pdf",
    "title": "PowerPoint to PDF",
    "metaTitle": "PowerPoint to PDF | DoctorConverter",
    "metaDescription": "Convert a PPTX presentation to PDF. Open the PDF and check slide count, images, fonts and table layouts.",
    "h1": "PowerPoint to PDF",
    "lead": "Convert a PPTX presentation to PDF.",
    "keywords": ["powerpoint to pdf", "convert pptx to pdf", "pptx to pdf online free", "slides to pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PPTX file." },
      { "title": "Start processing", "description": "Select Convert to PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF and check slide count, images, fonts and table layouts.",
    "faqs": [
      { "question": "Are animations and hidden slides exported?", "answer": "PDF pages are static and do not play animations. Hidden slides may be omitted. Check that all slides you need are present." }
    ],
    "relatedTools": ["word-to-pdf", "excel-to-pdf", "pdf-to-word"]
  },
  "pdf-to-images": {
    "id": "pdf-to-images",
    "title": "PDF to JPG / PNG",
    "metaTitle": "PDF to JPG / PNG | DoctorConverter",
    "metaDescription": "Export PDF pages as JPG or PNG images. Download the image or ZIP and check the selected pages and text readability.",
    "h1": "PDF to JPG / PNG",
    "lead": "Export PDF pages as JPG or PNG images.",
    "keywords": ["pdf to jpg", "pdf to png", "convert pdf to image", "pdf page to picture", "pdf to jpg high quality"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Choose JPG/PNG, image quality and an optional page range, then select Create images." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Download the image or ZIP and check the selected pages and text readability.",
    "faqs": [
      { "question": "What does image quality change?", "answer": "Standard uses 100 DPI and High uses 150 DPI. The output’s long edge is also limited. A higher setting cannot create detail missing from the source." }
    ],
    "relatedTools": ["images-to-pdf", "compress-pdf", "edit-pdf-pages"]
  },
  "images-to-pdf": {
    "id": "images-to-pdf",
    "title": "JPG / PNG to PDF",
    "metaTitle": "JPG / PNG to PDF | DoctorConverter",
    "metaDescription": "Combine JPG and PNG images into one PDF. Open the PDF and check image order, orientation and size on the page.",
    "h1": "JPG / PNG to PDF",
    "lead": "Combine JPG and PNG images into one PDF.",
    "keywords": ["jpg to pdf", "png to pdf", "image to pdf", "photos to pdf", "combine images into pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose JPG or PNG images." },
      { "title": "Start processing", "description": "Order the images, choose page size and orientation, then select Create PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF and check image order, orientation and size on the page.",
    "faqs": [
      { "question": "How are transparent PNGs and phone photos handled?", "answer": "Transparent areas become white. Photo orientation metadata is applied; check the resulting page orientations." }
    ],
    "relatedTools": ["pdf-to-images", "merge-pdf", "compress-pdf"]
  },
  "edit-pdf-pages": {
    "id": "edit-pdf-pages",
    "title": "Edit PDF pages",
    "metaTitle": "Edit PDF pages | DoctorConverter",
    "metaDescription": "Reorder, rotate, split or remove PDF pages. Open the PDF or ZIP and check page order, rotations and removed pages.",
    "h1": "Edit PDF pages",
    "lead": "Reorder, rotate, split or remove PDF pages.",
    "keywords": ["split pdf", "extract pages from pdf", "delete pdf pages", "rotate pdf", "reorder pdf pages"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Select and arrange pages, choose the output format, then select Save pages." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF or ZIP and check page order, rotations and removed pages.",
    "faqs": [
      { "question": "Can I get a separate PDF for each page?", "answer": "Choose “One PDF per page (ZIP)” in the output setting. Keep at least one page. This tool does not edit the text within pages." }
    ],
    "relatedTools": ["merge-pdf", "compress-pdf", "pdf-to-images"]
  },
  "page-numbers": {
    "id": "page-numbers",
    "title": "Add page numbers",
    "metaTitle": "Add page numbers | DoctorConverter",
    "metaDescription": "Add the page number and total page count to a PDF. Open the first and last pages and check that numbers do not overlap the content.",
    "h1": "Add page numbers",
    "lead": "Add the page number and total page count to a PDF.",
    "keywords": ["add page numbers to pdf", "number pdf pages", "pdf page numbering", "bates numbering"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Choose the position, then select Add page numbers." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the first and last pages and check that numbers do not overlap the content.",
    "faqs": [
      { "question": "Can I customize the number format?", "answer": "Numbers use “page / total”. Choose bottom center, bottom right or top right. A custom starting number is not available." }
    ],
    "relatedTools": ["edit-pdf-pages", "merge-pdf", "watermark-pdf"]
  },
  "watermark-pdf": {
    "id": "watermark-pdf",
    "title": "Add watermark",
    "metaTitle": "Add watermark | DoctorConverter",
    "metaDescription": "Add a text watermark to PDF pages. Open the PDF and check the watermark, characters and document readability.",
    "h1": "Add watermark",
    "lead": "Add a text watermark to PDF pages.",
    "keywords": ["add watermark to pdf", "pdf watermark online", "stamp pdf confidential", "draft watermark pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Enter the watermark text, then select Add watermark." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF and check the watermark, characters and document readability.",
    "faqs": [
      { "question": "Can I watermark only selected pages?", "answer": "A diagonal watermark is added to every page. Page selection and image watermarks are not supported. Text that does not fit or contains unsupported characters is rejected." }
    ],
    "relatedTools": ["page-numbers", "protect-pdf", "compress-pdf"]
  },
  "protect-pdf": {
    "id": "protect-pdf",
    "title": "Encrypt PDF",
    "metaTitle": "Encrypt PDF | DoctorConverter",
    "metaDescription": "Set a password required to open a PDF. Close and reopen the downloaded PDF to check that your password works.",
    "h1": "Encrypt PDF",
    "lead": "Set a password required to open a PDF.",
    "keywords": ["protect pdf", "encrypt pdf", "password protect pdf online", "lock pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Enter a password, then select Encrypt PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Close and reopen the downloaded PDF to check that your password works.",
    "faqs": [
      { "question": "Can I recover a forgotten password?", "answer": "Keep the password yourself. This tool does not provide password recovery; retain a copy of the source file." }
    ],
    "relatedTools": ["unlock-pdf", "compress-pdf", "merge-pdf"]
  },
  "unlock-pdf": {
    "id": "unlock-pdf",
    "title": "Remove PDF password",
    "metaTitle": "Remove PDF password | DoctorConverter",
    "metaDescription": "Remove protection from a PDF whose password you know. Reopen the downloaded PDF and check that it no longer asks for a password.",
    "h1": "Remove PDF password",
    "lead": "Remove protection from a PDF whose password you know.",
    "keywords": ["unlock pdf", "remove pdf password", "pdf password remover", "decrypt pdf"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Enter the current password, then select Remove password." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Reopen the downloaded PDF and check that it no longer asks for a password.",
    "faqs": [
      { "question": "Can I use this without knowing the password?", "answer": "No. The correct current password is required. A missing or wrong password prevents processing." }
    ],
    "relatedTools": ["protect-pdf", "merge-pdf", "compress-pdf"]
  },
  "ocr": {
    "id": "ocr",
    "title": "Extract text (OCR)",
    "metaTitle": "Extract text (OCR) | DoctorConverter",
    "metaDescription": "Extract text from a PDF or image into a TXT file. Open the TXT and compare names, numbers and accented characters with the source.",
    "h1": "Extract text (OCR)",
    "lead": "Extract text from a PDF or image into a TXT file.",
    "keywords": ["ocr online", "image to text", "scanned pdf to text", "extract text from image", "copy text from pdf scan"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF, JPG or PNG file." },
      { "title": "Start processing", "description": "Choose the document language, then select Extract text." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the TXT and compare names, numbers and accented characters with the source.",
    "faqs": [
      { "question": "Does this produce Word or a searchable PDF?", "answer": "This tool produces plain TXT only. Open or paste it in Word to edit. To add text to the original PDF, use Make PDF searchable." }
    ],
    "relatedTools": ["pdf-to-word", "pdf-to-excel", "pdf-to-images"]
  },
  "pdf-to-pdf-ocr": {
    "id": "pdf-to-pdf-ocr",
    "title": "Make PDF searchable (OCR)",
    "metaTitle": "Make PDF searchable (OCR) | DoctorConverter",
    "metaDescription": "Add selectable, searchable text to a scanned PDF. Open the PDF, search for a word and select text. Compare recognized text with the image.",
    "h1": "Make PDF searchable (OCR)",
    "lead": "Add selectable, searchable text to a scanned PDF.",
    "keywords": ["make pdf searchable", "ocr pdf online", "add text layer to pdf", "scanned pdf to searchable pdf", "ocr pdf converter"],
    "steps": [
      { "title": "Choose files", "description": "Choose a PDF file." },
      { "title": "Start processing", "description": "Choose the document language, then select Create searchable PDF." },
      { "title": "Download the result", "description": "Download the result from the same browser session when processing finishes." }
    ],
    "resultCheck": "Open the PDF, search for a word and select text. Compare recognized text with the image.",
    "faqs": [
      { "question": "How does this differ from Extract text (OCR)?", "answer": "This tool adds text to a PDF containing the page images. Extract text (OCR) produces a separate TXT file. Applying OCR to pages that already contain text may create duplicate text layers." }
    ],
    "relatedTools": ["ocr", "pdf-to-word", "pdf-to-images"]
  }
};
