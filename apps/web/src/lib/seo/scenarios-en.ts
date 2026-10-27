import type { Scenario } from './scenarios';

export const enScenarios: Scenario[] = [
  {
    "slug": "combine-lecture-notes-for-exams",
    "pair": "vize-final-notlari-birlestirme",
    "group": "student",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "edit-pdf-pages"],
    "title": "Combine Lecture Slides and Notes into One PDF for Finals",
    "metaTitle": "Combine Lecture Slides and Notes into One PDF for Finals | DoctorConverter",
    "metaDescription": "Combine weekly lecture notes, slides and past papers into one PDF in your chosen order.",
    "lead": "Combine weekly lecture notes, slides and past papers into one PDF in your chosen order.",
    "queries": ["combine lecture slides for finals", "merge lecture notes into one pdf", "combine pdf notes for exam", "merge past papers pdf", "study notes one pdf", "combine slides into one pdf"],
    "sections": [
      {
        "heading": "Why one PDF for exam season?",
        "body": [
          "Slides uploaded week by week to Canvas, Moodle or Blackboard end up scattered across downloads folders and devices. One PDF opens on any tablet, can search a text-based PDF with Ctrl+F and prints in one go.",
          "You decide the order: week 1, week 2, and so on, with past papers at the end for practice."
        ]
      },
      {
        "heading": "Too big to handle?",
        "body": ["A full semester of slides can get heavy. After merging, run Compress PDF to shrink it, and drop title slides or duplicates with Edit PDF pages."]
      }
    ],
    "steps": [
      { "title": "Add your notes", "text": "Drop up to 20 PDF slide decks and handouts into the box above." },
      { "title": "Set the order", "text": "Use the arrows to put weeks in order and past papers last." },
      { "title": "Merge and download", "text": "Click “Merge PDFs” and download your single study file." }
    ],
    "tips": [
      "Prefix file names with numbers (01-week.pdf, 02-week.pdf) to sort them faster.",
      "Turn photos of handwritten notes into a PDF with JPG to PDF first, then merge.",
      "Check the current total page limit in the tool panel and split long courses into parts."
    ],
    "faqs": [
      { "q": "How many files can I combine?", "a": "The tool panel shows the current file, size and page limits reported by the server. Check them before processing." },
      { "q": "Will the slide order change?", "a": "No. The output follows exactly the order you set in the list." }
    ]
  },
  {
    "slug": "lecture-slides-pdf-to-word",
    "pair": "ders-slayti-pdf-word-cevirme",
    "group": "student",
    "tool": "pdf-to-word",
    "tools": ["pdf-to-word", "ocr", "merge-pdf"],
    "title": "Convert Lecture Slides and PDF Notes to Word",
    "metaTitle": "Convert Lecture Slides and PDF Notes to Word | DoctorConverter",
    "metaDescription": "Export text-based lecture slides and notes to Word, check the result and add your own notes.",
    "lead": "Export text-based lecture slides and notes to Word, check the result and add your own notes.",
    "queries": ["lecture slides pdf to word", "edit lecture notes pdf", "convert read only pdf to word", "pdf notes to docx", "study notes pdf editable", "convert powerpoint pdf to word"],
    "sections": [
      {
        "heading": "Why convert to Word?",
        "body": [
          "PDF is great for reading but awkward for studying. In Word you can copy headings into a summary, delete what you already know and add color-coded notes.",
          "The converter rebuilds fonts, tables, images and columns into an editable DOCX. Dense designs can produce text, table and layout errors; compare the result with the source."
        ]
      },
      {
        "heading": "Scanned or photocopied notes",
        "body": ["Scanned pages contain no selectable text. Run Extract text (OCR) first, then paste the text into Word."]
      }
    ],
    "steps": [
      { "title": "Upload the PDF", "text": "Choose the slide deck or notes PDF (check the current page limit in the tool panel)." },
      { "title": "Convert", "text": "Click “Convert to Word”; text, tables and images go into a DOCX." },
      { "title": "Study in Word", "text": "Open the file in Word or Google Docs and add your notes." }
    ],
    "tips": ["Password-protected PDFs cannot be opened; ask for an unprotected copy.", "Split long textbooks into chapters with Edit PDF pages and convert each one."],
    "faqs": [
      { "q": "Can it open “locked” PDFs?", "a": "Read-only PDFs you cannot edit convert fine. PDFs that need a password to open are not supported." },
      { "q": "How many pages can I convert?", "a": "The tool panel shows the current file, size and page limits reported by the server. Check them before processing." },
      { "q": "Can I open the result in Google Docs?", "a": "Yes, the DOCX opens in Google Docs, Pages and LibreOffice." }
    ]
  },
  {
    "slug": "homework-photos-to-pdf",
    "pair": "odev-fotograflarini-pdf-yapma",
    "group": "student",
    "tool": "images-to-pdf",
    "tools": ["images-to-pdf", "compress-pdf", "merge-pdf"],
    "title": "Turn Homework Photos into One PDF",
    "metaTitle": "Turn Homework Photos into One PDF | DoctorConverter",
    "metaDescription": "Order your homework photos and create one PDF for submission.",
    "lead": "Order your homework photos and create one PDF for submission.",
    "queries": ["homework photos to pdf", "scan homework to pdf with phone", "jpg to pdf for assignment", "handwritten notes to pdf", "combine photos into one pdf", "canvas assignment pdf upload"],
    "sections": [
      {
        "heading": "Why teachers ask for a PDF",
        "body": [
          "Separate photos get mixed up and pages go missing. A single PDF keeps the order fixed, opens everywhere and is accepted by every learning platform.",
          "JPG to PDF centers each photo on an A4 page or keeps the original photo size; choose landscape for sideways pages."
        ]
      }
    ],
    "steps": [
      { "title": "Pick your photos", "text": "Choose up to 20 JPG or PNG photos." },
      { "title": "Order and adjust", "text": "Arrange pages, pick A4 or image size and orientation." },
      { "title": "Download the PDF", "text": "Download one PDF and upload it to your class." }
    ],
    "tips": ["Shoot in daylight from straight above with the page on a flat surface.", "If a page ends up sideways, rotate it later with Edit PDF pages."],
    "faqs": [
      { "q": "Is there a size limit per image?", "a": "Check the current size limit in the tool panel. Images also have pixel and edge-length limits; phone photos may exceed them." }
    ]
  },
  {
    "slug": "thesis-pdf-to-word",
    "pair": "tez-makale-pdf-word-cevirme",
    "group": "student",
    "tool": "pdf-to-word",
    "tools": ["pdf-to-word", "edit-pdf-pages", "ocr"],
    "title": "Convert a Thesis or Research Paper PDF to Word",
    "metaTitle": "Convert a Thesis or Research Paper PDF to Word | DoctorConverter",
    "metaDescription": "Export a text-based thesis or paper to Word. Compare tables, equations and page layout with the source.",
    "lead": "Export a text-based thesis or paper to Word. Compare tables, equations and page layout with the source.",
    "queries": ["thesis pdf to word", "dissertation pdf to docx", "research paper pdf to word", "two column pdf to word", "academic paper editable", "convert journal article to word"],
    "sections": [
      {
        "heading": "What is preserved?",
        "body": [
          "Headings, paragraphs, tables and figures are rebuilt as editable Word content. Two-column pages are attempted, but reading order and positions can differ from the PDF, so check references and table contents.",
          "Equation-heavy pages and unusual fonts may differ; review those sections after converting."
        ]
      },
      {
        "heading": "Over the current page limit?",
        "body": ["Check the current PDF to Word page limit in the tool panel. Split long theses into chapters with Edit PDF pages (e.g. 1-45, 46-90) and convert each part."]
      }
    ],
    "steps": [
      { "title": "Split if needed", "text": "Split documents exceeding the panel’s page limit into ranges." },
      { "title": "Convert to Word", "text": "Upload the PDF and start the conversion." },
      { "title": "Review", "text": "Check tables and equations, then keep writing." }
    ],
    "tips": ["Apply Word heading styles after conversion to rebuild the table of contents automatically."],
    "faqs": [
      { "q": "Are citations kept?", "a": "They come through as text, not as live reference-manager fields." },
      { "q": "Do tables stay tables?", "a": "Yes, detected tables become editable Word tables." }
    ]
  },
  {
    "slug": "court-filing-pdf-compressor",
    "pair": "uyap-pdf-boyutu-kucultme",
    "group": "legal",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "edit-pdf-pages", "merge-pdf"],
    "title": "Compress PDFs for Court E-Filing Size Limits",
    "metaTitle": "Compress PDFs for Court E-Filing Size Limits | DoctorConverter",
    "metaDescription": "Try reducing the PDF size before e-filing; split it by page range if it remains too large.",
    "lead": "Try reducing the PDF size before e-filing; split it by page range if it remains too large.",
    "queries": ["court filing pdf compressor", "reduce pdf size for e-filing", "e-filing file size limit pdf", "compress exhibits pdf", "shrink legal pdf", "pacer pdf too large"],
    "sections": [
      {
        "heading": "Why filings get too big",
        "body": [
          "Scanned exhibit binders, high-resolution photos and combined attachments grow quickly, and most e-filing systems cap the size of each upload.",
          "Compress PDF optimizes the file’s internal structure without downsampling images. The reduction depends on the file; a smaller output is not guaranteed."
        ]
      },
      {
        "heading": "If compression is not enough: split",
        "body": [
          "Image-only scans gain less from lossless compression. Split the exhibit into page ranges with Edit PDF pages and file the parts as separate attachments.",
          "Whenever possible, export documents straight from Word instead of printing and scanning them."
        ]
      }
    ],
    "steps": [
      { "title": "Upload the PDF", "text": "Choose the brief, motion or exhibit that was rejected." },
      { "title": "Compress", "text": "Optimize it in one click and see the new size." },
      { "title": "Split if needed", "text": "Still too large? Split by page range and file separately." }
    ],
    "tips": ["Scanning at 200–300 DPI in grayscale keeps exhibits small from the start.", "Check your court’s local rules for per-file limits and exhibit naming."],
    "faqs": [
      { "q": "Will compression make the document harder to read?", "a": "The tool optimizes PDF structure without downsampling images. Check text, signatures and seals in the output." },
      { "q": "Why did my file not shrink?", "a": "Already optimized or image-only files have little to gain; split the document instead." }
    ]
  },
  {
    "slug": "merge-legal-exhibits",
    "pair": "dilekce-delil-listesi-birlestirme",
    "group": "legal",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "word-to-pdf"],
    "title": "Merge a Pleading and Its Exhibits into One PDF",
    "metaTitle": "Merge a Pleading and Its Exhibits into One PDF | DoctorConverter",
    "metaDescription": "Combine the pleading, exhibit index and attachments in the required order.",
    "lead": "Combine the pleading, exhibit index and attachments in the required order.",
    "queries": ["merge exhibits into one pdf", "combine legal documents pdf", "combine motion and exhibits", "exhibit binder pdf", "merge attachments into one pdf"],
    "sections": [
      {
        "heading": "Order matters",
        "body": [
          "Judges and clerks review faster when the pleading is followed by the exhibit index and exhibits in sequence. The merged output follows exactly the order in your list.",
          "Draft in Word? Convert it with Word to PDF first, then merge it with the scanned exhibits."
        ]
      }
    ],
    "steps": [
      { "title": "Add documents", "text": "Select the pleading, index and exhibits." },
      { "title": "Order exhibits", "text": "Move files into Exhibit A, B, C order." },
      { "title": "Merge", "text": "Download one PDF; compress it if it is too large." }
    ],
    "tips": ["Prefix file names (00-motion, 01-exhibit-a) for faster ordering."],
    "faqs": [
      { "q": "Are signed, scanned pages preserved?", "a": "Yes. Merging does not alter pages, so signatures and stamps stay as they are." },
      { "q": "How many documents can I merge?", "a": "The tool panel shows the current file, size and page limits reported by the server. Check them before processing." }
    ]
  },
  {
    "slug": "scanned-document-to-text",
    "pair": "taranmis-mahkeme-karari-metne-cevirme",
    "group": "legal",
    "tool": "ocr",
    "tools": ["ocr", "pdf-to-word", "edit-pdf-pages"],
    "title": "Copy Text from a Scanned PDF or Photo (OCR)",
    "metaTitle": "Copy Text from a Scanned PDF or Photo (OCR) | DoctorConverter",
    "metaDescription": "Extract text from a scanned document with OCR. Compare it with the original before quoting it.",
    "lead": "Extract text from a scanned document with OCR. Compare it with the original before quoting it.",
    "queries": ["copy text from scanned pdf", "scanned pdf to text", "ocr pdf online free", "image to text", "extract text from photo", "pdf text not selectable"],
    "sections": [
      {
        "heading": "What OCR does",
        "body": [
          "Scanned documents are pictures, so their words cannot be selected or searched. OCR (optical character recognition) reads those images and returns plain text.",
          "Choose one or two of the available languages. The output is a TXT file; layout is not kept, but the text is ready to paste anywhere."
        ]
      }
    ],
    "steps": [
      { "title": "Upload", "text": "Choose a scanned PDF (up to 20 pages) or a photo." },
      { "title": "Pick the language", "text": "One or two of the available languages." },
      { "title": "Get the text", "text": "Download the TXT file and copy what you need." }
    ],
    "tips": ["Extract only the pages you need with Edit PDF pages before running OCR.", "Skewed or low-resolution scans reduce accuracy; 300 DPI works best."],
    "faqs": [
      { "q": "Does it read handwriting?", "a": "OCR is built for printed text; handwriting accuracy is low." },
      { "q": "How many pages?", "a": "The tool panel shows the current file, size and page limits reported by the server. Check them before processing." }
    ]
  },
  {
    "slug": "visa-application-documents-one-pdf",
    "pair": "vize-evraklari-tek-pdf-birlestirme",
    "group": "visa",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "images-to-pdf", "compress-pdf"],
    "title": "Combine Visa Application Documents into One PDF",
    "metaTitle": "Combine Visa Application Documents into One PDF | DoctorConverter",
    "metaDescription": "Combine the documents requested for your application in the specified order.",
    "lead": "Combine the documents requested for your application in the specified order.",
    "queries": ["combine visa documents into one pdf", "visa application documents pdf", "merge passport and hotel booking pdf", "schengen visa documents upload", "vfs global upload documents pdf"],
    "sections": [
      {
        "heading": "A clean file for online applications",
        "body": [
          "Many visa centers ask you to upload documents per category and in a fixed order. One PDF per category keeps you within upload limits and helps the officer review quickly.",
          "Photographed documents? Convert them with JPG to PDF first, then merge."
        ]
      },
      {
        "heading": "A typical order",
        "body": [
          "Application form → passport pages → travel insurance → flight reservation → accommodation → bank statements → employer or school letter. Follow your consulate’s checklist if it differs."
        ]
      }
    ],
    "steps": [
      { "title": "Gather documents", "text": "Select PDFs; convert photos to PDF first." },
      { "title": "Follow the checklist", "text": "Arrange files in the order your consulate asks for." },
      { "title": "Merge and check", "text": "Download one PDF; compress it if the portal has a size limit." }
    ],
    "tips": ["Name files “Firstname-Lastname-Category.pdf” to avoid mix-ups."],
    "faqs": [
      { "q": "Are my passport scans safe?", "a": "They are only reachable from your session, expire automatically and can be deleted right after the job." },
      { "q": "Can I mix photos and PDFs?", "a": "Convert photos with JPG to PDF first, then merge everything." }
    ]
  },
  {
    "slug": "compress-pdf-for-visa-upload",
    "pair": "konsolosluk-dosya-boyutu-kucultme",
    "group": "visa",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "edit-pdf-pages", "images-to-pdf"],
    "title": "Compress PDFs for Visa and Government Upload Limits",
    "metaTitle": "Compress PDFs for Visa and Government Upload Limits | DoctorConverter",
    "metaDescription": "Try compressing the PDF. If it remains too large, remove extra pages or split the document.",
    "lead": "Try compressing the PDF. If it remains too large, remove extra pages or split the document.",
    "queries": ["compress pdf for visa upload", "reduce pdf size for online application", "pdf too large to upload", "government form pdf size limit", "compress pdf under 1mb"],
    "sections": [
      {
        "heading": "What makes documents big",
        "body": [
          "Phone photos converted at full resolution and color scans of bank statements are the usual culprits.",
          "Try lossless Compress PDF first. If that is not enough, remove blank backs and ad pages with Edit PDF pages."
        ]
      }
    ],
    "steps": [
      { "title": "Upload", "text": "Choose the oversized document." },
      { "title": "Compress", "text": "Optimize and check the new size." },
      { "title": "Trim pages", "text": "Remove unneeded pages for extra savings." }
    ],
    "tips": ["Scanning in grayscale produces much smaller files than color."],
    "faqs": [
      { "q": "Will quality drop?", "a": "Images are not downsampled. Check text and stamps in the output before using it." }
    ]
  },
  {
    "slug": "compress-pdf-for-email",
    "group": "office",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "edit-pdf-pages", "merge-pdf"],
    "title": "Compress a PDF to Send by Email",
    "metaTitle": "Compress a PDF to Send by Email | DoctorConverter",
    "metaDescription": "Try reducing your PDF size before emailing it; check the attachment limit of your email service.",
    "lead": "Try reducing your PDF size before emailing it; check the attachment limit of your email service.",
    "queries": ["compress pdf for email", "pdf too large to email", "reduce pdf size for gmail", "outlook attachment too large pdf", "shrink pdf to send"],
    "sections": [
      {
        "heading": "Two ways to get under the limit",
        "body": ["Compress PDF optimizes the file without changing its content. If it is still too large, split it with Edit PDF pages and send the parts in separate emails."]
      }
    ],
    "steps": [
      { "title": "Upload", "text": "Choose the PDF you want to send." },
      { "title": "Compress", "text": "Optimize it and check the result size." },
      { "title": "Send", "text": "Attach the smaller file to your email." }
    ],
    "tips": ["Remove cover pages and blank pages before sending large reports."],
    "faqs": [
      { "q": "Does it change the content?", "a": "The tool optimizes PDF structure without downsampling images. Check the output before using it." }
    ]
  },
  {
    "slug": "compress-resume-under-2mb",
    "pair": "cv-pdf-boyutu-kucultme",
    "group": "career",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "word-to-pdf", "edit-pdf-pages"],
    "title": "Reduce Your Resume PDF Size",
    "metaTitle": "Reduce Your Resume PDF Size | DoctorConverter",
    "metaDescription": "Try reducing your resume PDF size and compare the result with the application site’s limit.",
    "lead": "Try reducing your resume PDF size and compare the result with the application site’s limit.",
    "queries": ["compress resume under 2mb", "reduce cv pdf size", "resume pdf too large", "shrink resume for linkedin", "workday resume file size", "indeed resume upload size"],
    "sections": [
      {
        "heading": "Why resumes get heavy",
        "body": [
          "High-resolution headshots, graphics exported from design tools like Canva and embedded fonts inflate file size.",
          "Compress PDF optimizes the file losslessly. If you have the Word source, you can also export it again and compare the output size."
        ]
      }
    ],
    "steps": [
      { "title": "Upload your resume", "text": "Choose your CV PDF." },
      { "title": "Compress", "text": "Optimize it and see the new size." },
      { "title": "Apply", "text": "Upload the smaller PDF to the job portal." }
    ],
    "tips": ["Resize your photo before placing it in the resume; 400×500 px is plenty."],
    "faqs": [
      { "q": "Will my design change?", "a": "The tool does not downsample images. Check the layout, fonts and colors before submitting." },
      { "q": "Can ATS software still read it?", "a": "Yes. Compression does not change the text, so ATS parsing works as before." }
    ]
  },
  {
    "slug": "edit-old-resume-pdf-in-word",
    "pair": "eski-cv-word-cevirme",
    "group": "career",
    "tool": "pdf-to-word",
    "tools": ["pdf-to-word", "word-to-pdf"],
    "title": "Edit an Old Resume PDF in Word",
    "metaTitle": "Edit an Old Resume PDF in Word | DoctorConverter",
    "metaDescription": "Export your old resume PDF to Word, check its layout and update your experience and details.",
    "lead": "Export your old resume PDF to Word, check its layout and update your experience and details.",
    "queries": ["convert resume pdf to word", "edit resume pdf", "update old cv pdf", "cv pdf to docx", "canva resume to word"],
    "sections": [
      {
        "heading": "Update, then export again",
        "body": ["PDF to Word rebuilds tables and tries to rebuild two-column resume layouts; check the column order and positions in the result. After editing, use Word to PDF to produce an application-ready PDF."]
      }
    ],
    "steps": [
      { "title": "Convert", "text": "Turn your resume PDF into Word." },
      { "title": "Update", "text": "Add new experience and skills." },
      { "title": "Export", "text": "Save the final version with Word to PDF." }
    ],
    "tips": ["Text boxes from design tools may arrive as separate boxes; edit text inside them."],
    "faqs": [
      { "q": "Is my photo kept?", "a": "Yes, images are carried into the Word document." }
    ]
  },
  {
    "slug": "combine-resume-and-cover-letter",
    "pair": "cv-diploma-sertifika-tek-pdf",
    "group": "career",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "images-to-pdf", "compress-pdf"],
    "title": "Combine Your Resume, Cover Letter and Certificates into One PDF",
    "metaTitle": "Combine Your Resume, Cover Letter and Certificates into One PDF | DoctorConverter",
    "metaDescription": "Combine your resume, cover letter and certificates when an application accepts one file.",
    "lead": "Combine your resume, cover letter and certificates when an application accepts one file.",
    "queries": ["combine resume and cover letter into one pdf", "merge cv and certificates", "one pdf job application", "combine transcript and resume", "merge cover letter pdf"],
    "sections": [
      {
        "heading": "The right order makes a first impression",
        "body": ["Suggested order: cover letter → resume → degree → transcript → certificates → references. Convert photographed certificates with JPG to PDF first."]
      }
    ],
    "steps": [
      { "title": "Select documents", "text": "Upload your resume and supporting documents." },
      { "title": "Order them", "text": "Put the cover letter and resume first." },
      { "title": "Merge", "text": "Download one PDF and attach it to your application." }
    ],
    "tips": ["If the merged file is large, run Compress PDF."],
    "faqs": [
      { "q": "How many documents can I add?", "a": "The tool panel shows the current file, size and page limits reported by the server. Check them before processing." }
    ]
  },
  {
    "slug": "resume-word-to-pdf",
    "pair": "word-cv-pdf-yapma",
    "group": "career",
    "tool": "word-to-pdf",
    "tools": ["word-to-pdf", "compress-pdf", "merge-pdf"],
    "title": "Convert Your Word Resume to PDF",
    "metaTitle": "Convert Your Word Resume to PDF | DoctorConverter",
    "metaDescription": "Convert your DOCX resume to PDF and check fonts and page breaks before sending it.",
    "lead": "Convert your DOCX resume to PDF and check fonts and page breaks before sending it.",
    "queries": ["resume word to pdf", "convert cv docx to pdf", "save resume as pdf", "docx to pdf free"],
    "sections": [
      {
        "heading": "Why send a PDF",
        "body": ["Word files render differently depending on the version and installed fonts. PDF fixes the page layout; check the conversion before sharing."]
      }
    ],
    "steps": [
      { "title": "Upload the DOCX", "text": "Choose your resume Word file." },
      { "title": "Convert", "text": "Select Convert to PDF." },
      { "title": "Check", "text": "Open the PDF and review page breaks." }
    ],
    "tips": ["Macro-enabled (.docm) or externally linked documents are not supported; save as a normal .docx."],
    "faqs": [
      { "q": "Are .doc files supported?", "a": ".docx is supported; save older .doc files as .docx in Word first." }
    ]
  },
  {
    "slug": "bank-statement-to-excel",
    "pair": "banka-ekstresi-excel-aktarma",
    "group": "finance",
    "tool": "pdf-to-excel",
    "tools": ["pdf-to-excel", "merge-pdf", "ocr"],
    "title": "Convert a Bank Statement PDF to Excel",
    "metaTitle": "Convert a Bank Statement PDF to Excel | DoctorConverter",
    "metaDescription": "Export detected tables from a digital bank statement to Excel and compare amounts with the source.",
    "lead": "Export detected tables from a digital bank statement to Excel and compare amounts with the source.",
    "queries": ["bank statement to excel", "convert bank statement pdf to excel", "credit card statement to excel", "pdf statement to csv", "bank transactions to spreadsheet", "pdf table to excel"],
    "sections": [
      {
        "heading": "Which statements work?",
        "body": [
          "Digital PDFs downloaded from online banking (with selectable text) work best: each detected table becomes its own Excel sheet.",
          "Paper statements that were scanned contain no table structure; use OCR to get their text instead. Cell values come through as text and no formula is ever executed."
        ]
      },
      {
        "heading": "Next steps in Excel",
        "body": ["Convert the amount column to numbers with Text to Columns or VALUE(), then build a PivotTable to see spending by category."]
      }
    ],
    "steps": [
      { "title": "Upload the statement", "text": "Choose the PDF from your bank (check the current page limit in the tool panel)." },
      { "title": "Convert to Excel", "text": "Tables are detected and exported to XLSX." },
      { "title": "Analyze", "text": "Filter, sort and total in Excel." }
    ],
    "tips": ["Merge monthly statements first, then convert in one go (check the current page limit in the tool panel)."],
    "faqs": [
      { "q": "Do scanned statements work?", "a": "No. Tables are only detected in digital PDFs; use OCR for scanned text." },
      { "q": "Are formulas safe?", "a": "Yes. Cells are imported as text and nothing from the PDF is executed." }
    ]
  },
  {
    "slug": "invoice-pdf-to-excel",
    "pair": "pdf-fatura-excel-aktarma",
    "group": "finance",
    "tool": "pdf-to-excel",
    "tools": ["pdf-to-excel", "merge-pdf"],
    "title": "Convert Invoice PDFs to Excel",
    "metaTitle": "Convert Invoice PDFs to Excel | DoctorConverter",
    "metaDescription": "Export detected invoice tables to Excel and check quantities and totals.",
    "lead": "Export detected invoice tables to Excel and check quantities and totals.",
    "queries": ["invoice pdf to excel", "extract invoice line items", "pdf invoice to spreadsheet", "purchase order pdf to excel", "pdf table extraction"],
    "sections": [
      {
        "heading": "What gets extracted",
        "body": ["Detected line-item tables and table-shaped totals are exported. Free text outside tables (addresses, notes) is not exported."]
      }
    ],
    "steps": [
      { "title": "Upload the invoice", "text": "Choose the PDF invoice." },
      { "title": "Export", "text": "Line-item tables go to XLSX." },
      { "title": "Reconcile", "text": "Merge the data into your bookkeeping sheet." }
    ],
    "tips": ["Merge several invoices into one PDF first to export them together."],
    "faqs": [
      { "q": "Why “no table found”?", "a": "Scanned invoices or layouts without table structure cannot be detected." }
    ]
  },
  {
    "slug": "merge-monthly-invoices",
    "pair": "e-arsiv-faturalari-birlestirme",
    "group": "finance",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "pdf-to-excel"],
    "title": "Merge Monthly Invoices and Receipts into One PDF",
    "metaTitle": "Merge Monthly Invoices and Receipts into One PDF | DoctorConverter",
    "metaDescription": "Combine monthly invoices and receipts into one PDF in date order.",
    "lead": "Combine monthly invoices and receipts into one PDF in date order.",
    "queries": ["merge invoices into one pdf", "combine receipts into one pdf", "expense report receipts pdf", "monthly invoices pdf", "combine bills pdf"],
    "sections": [
      {
        "heading": "Month-end routine",
        "body": ["Merging invoices in date order makes review faster. Snap paper receipts with your phone and add them via JPG to PDF."]
      }
    ],
    "steps": [
      { "title": "Select invoices", "text": "Upload the month’s invoice PDFs." },
      { "title": "Sort by date", "text": "Arrange files chronologically." },
      { "title": "Merge", "text": "Send one PDF to your accountant." }
    ],
    "tips": ["More than 20 invoices? Merge in two batches, then merge the two results."],
    "faqs": [
      { "q": "Does merging affect invoice validity?", "a": "Pages are not altered, but keep the original files for record-keeping requirements." }
    ]
  },
  {
    "slug": "combine-tax-documents",
    "group": "finance",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "images-to-pdf", "compress-pdf"],
    "title": "Combine Tax Documents into One PDF",
    "metaTitle": "Combine Tax Documents into One PDF | DoctorConverter",
    "metaDescription": "Combine the requested tax documents in one PDF and keep the source files.",
    "lead": "Combine the requested tax documents in one PDF and keep the source files.",
    "queries": ["combine tax documents into one pdf", "merge tax forms pdf", "send documents to accountant pdf", "tax receipts one pdf", "combine w2 and 1099 pdf"],
    "sections": [
      {
        "heading": "Group by type",
        "body": ["A clear order (income forms → deductions → receipts → prior-year return) saves your preparer time. Photos of paper receipts can be added with JPG to PDF."]
      }
    ],
    "steps": [
      { "title": "Collect files", "text": "Upload forms, statements and receipts." },
      { "title": "Order by category", "text": "Put income documents first, then deductions." },
      { "title": "Merge", "text": "Download one PDF and send it to your preparer." }
    ],
    "tips": ["Compress the merged file if your preparer’s portal has an upload limit."],
    "faqs": [
      { "q": "Are my tax documents stored?", "a": "Only temporarily and only for your session; they expire automatically and can be deleted right away." }
    ]
  },
  {
    "slug": "extract-and-rotate-pdf-pages",
    "pair": "pdf-sayfa-ayirma-dondurme",
    "group": "office",
    "tool": "edit-pdf-pages",
    "tools": ["edit-pdf-pages", "merge-pdf", "compress-pdf"],
    "title": "Extract, Delete and Rotate PDF Pages",
    "metaTitle": "Extract, Delete and Rotate PDF Pages | DoctorConverter",
    "metaDescription": "Select, reorder or rotate the PDF pages you need and download a new file.",
    "lead": "Select, reorder or rotate the PDF pages you need and download a new file.",
    "queries": ["extract pages from pdf", "delete pages from pdf", "rotate pdf pages", "split pdf into pages", "reorder pdf pages", "fix upside down pdf"],
    "sections": [
      {
        "heading": "How to write a page range",
        "body": [
          "Type “3, 1-2” and the output is page 3 followed by pages 1 and 2; pages you leave out are removed. Rotation applies to the selected pages.",
          "Choose “One PDF per page (ZIP)” to get every page as a separate PDF."
        ]
      }
    ],
    "steps": [
      { "title": "Upload", "text": "Choose the PDF." },
      { "title": "Enter pages", "text": "e.g. 5-8 or 3, 1-2; pick a rotation if needed." },
      { "title": "Download", "text": "Get one PDF or a ZIP." }
    ],
    "tips": ["Fix a few upside-down pages by rotating just those, then merge them back."],
    "faqs": [
      { "q": "Is my original changed?", "a": "No, a new file is created." },
      { "q": "How long can the document be?", "a": "Up to 300 pages." }
    ]
  },
  {
    "slug": "pdf-pages-to-jpg-for-social",
    "pair": "pdf-sayfalarini-jpg-yapma",
    "group": "office",
    "tool": "pdf-to-images",
    "tools": ["pdf-to-images", "edit-pdf-pages"],
    "title": "Turn PDF Pages into JPG or PNG Images",
    "metaTitle": "Turn PDF Pages into JPG or PNG Images | DoctorConverter",
    "metaDescription": "Export PDF pages as JPG or PNG. Multiple pages download in a ZIP file.",
    "lead": "Export PDF pages as JPG or PNG. Multiple pages download in a ZIP file.",
    "queries": ["pdf to jpg", "convert pdf page to image", "pdf to instagram post", "pdf to png high quality", "menu pdf to jpg", "slides to images"],
    "sections": [
      {
        "heading": "JPG or PNG?",
        "body": ["JPG gives smaller files for photo-heavy pages. PNG is sharper for text, logos and line art. “High” quality renders at 150 DPI for extra detail."]
      }
    ],
    "steps": [
      { "title": "Upload", "text": "Choose a PDF of within the current limit shown in the tool panel." },
      { "title": "Pick format and pages", "text": "Choose JPG/PNG, quality and an optional page range." },
      { "title": "Download", "text": "Get a single image or a ZIP." }
    ],
    "tips": ["Only need the cover for Instagram? Enter “1” in the pages field."],
    "faqs": [
      { "q": "Why is the output a ZIP?", "a": "When several pages are selected, all images are bundled into one ZIP." }
    ]
  },
  {
    "slug": "excel-quote-to-pdf",
    "pair": "excel-teklif-bordro-pdf-yapma",
    "group": "office",
    "tool": "excel-to-pdf",
    "tools": ["excel-to-pdf", "merge-pdf", "compress-pdf"],
    "title": "Convert an Excel Quote, Price List or Timesheet to PDF",
    "metaTitle": "Convert an Excel Quote, Price List or Timesheet to PDF | DoctorConverter",
    "metaDescription": "Export an Excel quote, price list or timesheet to PDF, then check columns and page breaks.",
    "lead": "Export an Excel quote, price list or timesheet to PDF, then check columns and page breaks.",
    "queries": ["excel to pdf", "convert quote spreadsheet to pdf", "price list excel to pdf", "timesheet to pdf", "xlsx to pdf free"],
    "sections": [
      {
        "heading": "Which sheets are exported?",
        "body": ["Export all worksheets or only the first. The layout follows the print settings saved in Excel."]
      }
    ],
    "steps": [
      { "title": "Upload the XLSX", "text": "Choose your Excel file." },
      { "title": "Pick sheets", "text": "All worksheets or the first only." },
      { "title": "Send the PDF", "text": "Share it with your client." }
    ],
    "tips": ["Set Page Layout > Fit to “1 page wide” in Excel to avoid split columns."],
    "faqs": [
      { "q": "Are macro files supported?", "a": "Files with macros, embedded objects or external links are rejected for security." }
    ]
  }
];
