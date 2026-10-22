import type { Scenario } from './scenarios';

// Global long-tail landing pages. Pairs point to the Turkish equivalent for hreflang.
export const enScenarios: Scenario[] = [
  // ——— Students & exams ———
  {
    slug: 'combine-lecture-notes-for-exams',
    pair: 'vize-final-notlari-birlestirme',
    group: 'student',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'edit-pdf-pages'],
    title: 'Combine Lecture Slides and Notes into One PDF for Finals',
    metaTitle: 'Combine Lecture Slides into One PDF – Free Study Notes Merger',
    metaDescription: 'Merge weekly lecture slides, notes and past papers into one PDF before midterms and finals. Set the order, no sign-up, free download.',
    lead: 'Collect a whole semester of lecture slides, handouts and past exam papers into a single PDF, so revision week is about studying, not searching for files.',
    queries: ['combine lecture slides for finals', 'merge lecture notes into one pdf', 'combine pdf notes for exam', 'merge past papers pdf', 'study notes one pdf', 'combine slides into one pdf'],
    sections: [
      { heading: 'Why one PDF for exam season?', body: [
        'Slides uploaded week by week to Canvas, Moodle or Blackboard end up scattered across downloads folders and devices. One PDF opens on any tablet, searches instantly with Ctrl+F and prints in one go.',
        'You decide the order: week 1, week 2, and so on, with past papers at the end for practice.',
      ] },
      { heading: 'Too big to handle?', body: [
        'A full semester of slides can get heavy. After merging, run Compress PDF to shrink it, and drop title slides or duplicates with Edit PDF pages.',
      ] },
    ],
    steps: [
      { title: 'Add your notes', text: 'Drop up to 20 PDF slide decks and handouts into the box above.' },
      { title: 'Set the order', text: 'Use the arrows to put weeks in order and past papers last.' },
      { title: 'Merge and download', text: 'Click “Merge PDFs” and download your single study file.' },
    ],
    tips: [
      'Prefix file names with numbers (01-week.pdf, 02-week.pdf) to sort them faster.',
      'Turn photos of handwritten notes into a PDF with JPG to PDF first, then merge.',
      'The total limit is 300 pages; split very long courses into two files.',
    ],
    faqs: [
      { q: 'How many files can I combine?', a: 'Up to 20 PDFs and 300 pages in total per merge, with 10 MB per file.' },
      { q: 'Will the slide order change?', a: 'No. The output follows exactly the order you set in the list.' },
      { q: 'Are my notes shared with anyone?', a: 'No. Files are only reachable from your session and are deleted automatically when they expire.' },
      { q: 'Does it work on a phone or iPad?', a: 'Yes, it runs in any modern mobile browser with no app to install.' },
    ],
  },
  {
    slug: 'lecture-slides-pdf-to-word',
    pair: 'ders-slayti-pdf-word-cevirme',
    group: 'student',
    tool: 'pdf-to-word',
    tools: ['pdf-to-word', 'ocr', 'merge-pdf'],
    title: 'Convert Lecture Slides and PDF Notes to Word',
    metaTitle: 'Lecture Slides PDF to Word – Edit Read-Only Notes for Free',
    metaDescription: 'Turn read-only lecture slides and PDF notes into editable Word documents. Highlight, summarize and add your own notes. Free PDF to DOCX converter.',
    lead: 'Professors often share notes you cannot type into. Convert them to Word so you can build your own summary, highlight key points and add comments.',
    queries: ['lecture slides pdf to word', 'edit lecture notes pdf', 'convert read only pdf to word', 'pdf notes to docx', 'study notes pdf editable', 'convert powerpoint pdf to word'],
    sections: [
      { heading: 'Why convert to Word?', body: [
        'PDF is great for reading but awkward for studying. In Word you can copy headings into a summary, delete what you already know and add color-coded notes.',
        'The converter rebuilds fonts, tables, images and columns into an editable DOCX. Very dense slide designs may shift slightly; text and structure are kept.',
      ] },
      { heading: 'Scanned or photocopied notes', body: [
        'Scanned pages contain no selectable text. Run Extract text (OCR) first, then paste the text into Word.',
      ] },
    ],
    steps: [
      { title: 'Upload the PDF', text: 'Choose the slide deck or notes PDF (up to 50 pages).' },
      { title: 'Convert', text: 'Click “Start conversion”; text, tables and images go into a DOCX.' },
      { title: 'Study in Word', text: 'Open the file in Word or Google Docs and add your notes.' },
    ],
    tips: [
      'Password-protected PDFs cannot be opened; ask for an unprotected copy.',
      'Split long textbooks into chapters with Edit PDF pages and convert each one.',
    ],
    faqs: [
      { q: 'Can it open “locked” PDFs?', a: 'Read-only PDFs you cannot edit convert fine. PDFs that need a password to open are not supported.' },
      { q: 'How many pages can I convert?', a: 'PDF to Word handles up to 50 pages per file.' },
      { q: 'Can I open the result in Google Docs?', a: 'Yes, the DOCX opens in Google Docs, Pages and LibreOffice.' },
    ],
  },
  {
    slug: 'homework-photos-to-pdf',
    pair: 'odev-fotograflarini-pdf-yapma',
    group: 'student',
    tool: 'images-to-pdf',
    tools: ['images-to-pdf', 'compress-pdf', 'merge-pdf'],
    title: 'Turn Homework Photos into One PDF',
    metaTitle: 'Homework Photos to PDF – Scan Handwritten Pages with Your Phone',
    metaDescription: 'Snap handwritten homework with your phone and turn the JPG/PNG photos into one ordered PDF for Canvas, Google Classroom or Moodle. Free.',
    lead: 'Photograph your handwritten assignment, put the pages in order and submit a single clean PDF to Canvas, Google Classroom, Teams or Moodle.',
    queries: ['homework photos to pdf', 'scan homework to pdf with phone', 'jpg to pdf for assignment', 'handwritten notes to pdf', 'combine photos into one pdf', 'canvas assignment pdf upload'],
    sections: [
      { heading: 'Why teachers ask for a PDF', body: [
        'Separate photos get mixed up and pages go missing. A single PDF keeps the order fixed, opens everywhere and is accepted by every learning platform.',
        'JPG to PDF centers each photo on an A4 page or keeps the original photo size; choose landscape for sideways pages.',
      ] },
    ],
    steps: [
      { title: 'Pick your photos', text: 'Choose up to 20 JPG or PNG photos.' },
      { title: 'Order and adjust', text: 'Arrange pages, pick A4 or image size and orientation.' },
      { title: 'Download the PDF', text: 'Download one PDF and upload it to your class.' },
    ],
    tips: [
      'Shoot in daylight from straight above with the page on a flat surface.',
      'If a page ends up sideways, rotate it later with Edit PDF pages.',
    ],
    faqs: [
      { q: 'Are iPhone HEIC photos supported?', a: 'JPG and PNG are supported today. On iPhone, set Settings > Camera > Formats to “Most Compatible” to save photos as JPG.' },
      { q: 'Is there a size limit per image?', a: 'Each image can be up to 10 MB and 25 megapixels, which covers normal phone photos.' },
    ],
  },
  {
    slug: 'thesis-pdf-to-word',
    pair: 'tez-makale-pdf-word-cevirme',
    group: 'student',
    tool: 'pdf-to-word',
    tools: ['pdf-to-word', 'edit-pdf-pages', 'ocr'],
    title: 'Convert a Thesis or Research Paper PDF to Word',
    metaTitle: 'Thesis PDF to Word – Convert Research Papers to Editable DOCX',
    metaDescription: 'Convert your thesis, dissertation draft or research paper from PDF to Word. Keep tables, figures and two-column layouts and keep editing. Free.',
    lead: 'Lost the Word file of your thesis or paper? Convert the PDF back into an editable document instead of retyping it.',
    queries: ['thesis pdf to word', 'dissertation pdf to docx', 'research paper pdf to word', 'two column pdf to word', 'academic paper editable', 'convert journal article to word'],
    sections: [
      { heading: 'What is preserved?', body: [
        'Headings, paragraphs, tables, figures and two-column journal layouts are rebuilt, so references and table contents survive.',
        'Equation-heavy pages and unusual fonts may differ; review those sections after converting.',
      ] },
      { heading: 'Longer than 50 pages?', body: [
        'PDF to Word handles 50 pages per run. Split long theses into chapters with Edit PDF pages (e.g. 1-45, 46-90) and convert each part.',
      ] },
    ],
    steps: [
      { title: 'Split if needed', text: 'Cut documents longer than 50 pages into page ranges.' },
      { title: 'Convert to Word', text: 'Upload the PDF and start the conversion.' },
      { title: 'Review', text: 'Check tables and equations, then keep writing.' },
    ],
    tips: ['Apply Word heading styles after conversion to rebuild the table of contents automatically.'],
    faqs: [
      { q: 'Are citations kept?', a: 'They come through as text, not as live reference-manager fields.' },
      { q: 'Do tables stay tables?', a: 'Yes, detected tables become editable Word tables.' },
    ],
  },
  // ——— Legal ———
  {
    slug: 'court-filing-pdf-compressor',
    pair: 'uyap-pdf-boyutu-kucultme',
    group: 'legal',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'edit-pdf-pages', 'merge-pdf'],
    title: 'Compress PDFs for Court E-Filing Size Limits',
    metaTitle: 'Court Filing PDF Compressor – Meet E-Filing File Size Limits',
    metaDescription: 'Shrink motions, briefs and exhibit PDFs that exceed court e-filing size limits. Compress losslessly, or split into parts. Free, no sign-up.',
    lead: 'E-filing portal rejecting your exhibit as too large? Compress it without losing legibility, or split it into separately filed parts.',
    queries: ['court filing pdf compressor', 'reduce pdf size for e-filing', 'e-filing file size limit pdf', 'compress exhibits pdf', 'shrink legal pdf', 'pacer pdf too large'],
    sections: [
      { heading: 'Why filings get too big', body: [
        'Scanned exhibit binders, high-resolution photos and combined attachments grow quickly, and most e-filing systems cap the size of each upload.',
        'Compress PDF rewrites and recompresses the file losslessly; text, signatures and stamps stay sharp. Text-based PDFs exported from Word shrink the most.',
      ] },
      { heading: 'If compression is not enough: split', body: [
        'Image-only scans gain less from lossless compression. Split the exhibit into page ranges with Edit PDF pages and file the parts as separate attachments.',
        'Whenever possible, export documents straight from Word instead of printing and scanning them.',
      ] },
    ],
    steps: [
      { title: 'Upload the PDF', text: 'Choose the brief, motion or exhibit that was rejected.' },
      { title: 'Compress', text: 'Optimize it in one click and see the new size.' },
      { title: 'Split if needed', text: 'Still too large? Split by page range and file separately.' },
    ],
    tips: [
      'Scanning at 200–300 DPI in grayscale keeps exhibits small from the start.',
      'Check your court’s local rules for per-file limits and exhibit naming.',
    ],
    faqs: [
      { q: 'Will compression make the document harder to read?', a: 'No. Optimization is lossless; text, signatures and seals are unchanged.' },
      { q: 'Why did my file not shrink?', a: 'Already optimized or image-only files have little to gain; split the document instead.' },
      { q: 'Is client material kept confidential?', a: 'Files are only reachable from your session, expire automatically and can be deleted immediately after the job.' },
    ],
  },
  {
    slug: 'merge-legal-exhibits',
    pair: 'dilekce-delil-listesi-birlestirme',
    group: 'legal',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'word-to-pdf'],
    title: 'Merge a Pleading and Its Exhibits into One PDF',
    metaTitle: 'Merge Exhibits into One PDF – Combine Pleadings and Attachments',
    metaDescription: 'Combine a complaint, motion or brief with its exhibit list and numbered exhibits into one ordered PDF. Free online PDF merger for legal documents.',
    lead: 'Put the pleading, exhibit index and Exhibits A, B, C… in the order the court expects, in a single file.',
    queries: ['merge exhibits into one pdf', 'combine legal documents pdf', 'combine motion and exhibits', 'exhibit binder pdf', 'merge attachments into one pdf'],
    sections: [
      { heading: 'Order matters', body: [
        'Judges and clerks review faster when the pleading is followed by the exhibit index and exhibits in sequence. The merged output follows exactly the order in your list.',
        'Draft in Word? Convert it with Word to PDF first, then merge it with the scanned exhibits.',
      ] },
    ],
    steps: [
      { title: 'Add documents', text: 'Select the pleading, index and exhibits.' },
      { title: 'Order exhibits', text: 'Move files into Exhibit A, B, C order.' },
      { title: 'Merge', text: 'Download one PDF; compress it if it is too large.' },
    ],
    tips: ['Prefix file names (00-motion, 01-exhibit-a) for faster ordering.'],
    faqs: [
      { q: 'Are signed, scanned pages preserved?', a: 'Yes. Merging does not alter pages, so signatures and stamps stay as they are.' },
      { q: 'How many documents can I merge?', a: '20 files and 300 pages per merge.' },
    ],
  },
  {
    slug: 'scanned-document-to-text',
    pair: 'taranmis-mahkeme-karari-metne-cevirme',
    group: 'legal',
    tool: 'ocr',
    tools: ['ocr', 'pdf-to-word', 'edit-pdf-pages'],
    title: 'Copy Text from a Scanned PDF or Photo (OCR)',
    metaTitle: 'Copy Text from Scanned PDF – Free Online OCR (English & Turkish)',
    metaDescription: 'Extract text from scanned PDFs, court orders, reports and photos with OCR. Copy quotes into your documents. Free online OCR, no sign-up.',
    lead: 'Cannot select the text in a scanned order, report or letter? Run OCR to turn the image into plain text you can copy and quote.',
    queries: ['copy text from scanned pdf', 'scanned pdf to text', 'ocr pdf online free', 'image to text', 'extract text from photo', 'pdf text not selectable'],
    sections: [
      { heading: 'What OCR does', body: [
        'Scanned documents are pictures, so their words cannot be selected or searched. OCR (optical character recognition) reads those images and returns plain text.',
        'Choose English, Turkish or both. The output is a TXT file; layout is not kept, but the text is ready to paste anywhere.',
      ] },
    ],
    steps: [
      { title: 'Upload', text: 'Choose a scanned PDF (up to 20 pages) or a photo.' },
      { title: 'Pick the language', text: 'English, Turkish or both.' },
      { title: 'Get the text', text: 'Download the TXT file and copy what you need.' },
    ],
    tips: [
      'Extract only the pages you need with Edit PDF pages before running OCR.',
      'Skewed or low-resolution scans reduce accuracy; 300 DPI works best.',
    ],
    faqs: [
      { q: 'Does it read handwriting?', a: 'OCR is built for printed text; handwriting accuracy is low.' },
      { q: 'How many pages?', a: 'Up to 20 pages per PDF.' },
    ],
  },
  // ——— Visa & official forms ———
  {
    slug: 'visa-application-documents-one-pdf',
    pair: 'vize-evraklari-tek-pdf-birlestirme',
    group: 'visa',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'images-to-pdf', 'compress-pdf'],
    title: 'Combine Visa Application Documents into One PDF',
    metaTitle: 'Combine Visa Documents into One PDF – Passport, Hotel, Flight',
    metaDescription: 'Merge passport copy, hotel booking, flight reservation, bank statements and insurance into one PDF for Schengen, UK or US visa uploads. Free.',
    lead: 'Collect your passport copy, hotel booking, flight itinerary, bank statements and travel insurance into one well-ordered file for the visa portal.',
    queries: ['combine visa documents into one pdf', 'visa application documents pdf', 'merge passport and hotel booking pdf', 'schengen visa documents upload', 'vfs global upload documents pdf'],
    sections: [
      { heading: 'A clean file for online applications', body: [
        'Many visa centers ask you to upload documents per category and in a fixed order. One PDF per category keeps you within upload limits and helps the officer review quickly.',
        'Photographed documents? Convert them with JPG to PDF first, then merge.',
      ] },
      { heading: 'A typical order', body: [
        'Application form → passport pages → travel insurance → flight reservation → accommodation → bank statements → employer or school letter. Follow your consulate’s checklist if it differs.',
      ] },
    ],
    steps: [
      { title: 'Gather documents', text: 'Select PDFs; convert photos to PDF first.' },
      { title: 'Follow the checklist', text: 'Arrange files in the order your consulate asks for.' },
      { title: 'Merge and check', text: 'Download one PDF; compress it if the portal has a size limit.' },
    ],
    tips: ['Name files “Firstname-Lastname-Category.pdf” to avoid mix-ups.'],
    faqs: [
      { q: 'Are my passport scans safe?', a: 'They are only reachable from your session, expire automatically and can be deleted right after the job.' },
      { q: 'Can I mix photos and PDFs?', a: 'Convert photos with JPG to PDF first, then merge everything.' },
    ],
  },
  {
    slug: 'compress-pdf-for-visa-upload',
    pair: 'konsolosluk-dosya-boyutu-kucultme',
    group: 'visa',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'edit-pdf-pages', 'images-to-pdf'],
    title: 'Compress PDFs for Visa and Government Upload Limits',
    metaTitle: 'Compress PDF for Visa Upload – Reduce File Size for Online Forms',
    metaDescription: 'Visa portal or government form rejecting your PDF? Reduce the file size losslessly and remove extra pages to get under the upload limit. Free.',
    lead: 'Portal says the file is too large? Compress the PDF, remove extra pages and get under the limit.',
    queries: ['compress pdf for visa upload', 'reduce pdf size for online application', 'pdf too large to upload', 'government form pdf size limit', 'compress pdf under 1mb'],
    sections: [
      { heading: 'What makes documents big', body: [
        'Phone photos converted at full resolution and color scans of bank statements are the usual culprits.',
        'Try lossless Compress PDF first. If that is not enough, remove blank backs and ad pages with Edit PDF pages.',
      ] },
    ],
    steps: [
      { title: 'Upload', text: 'Choose the oversized document.' },
      { title: 'Compress', text: 'Optimize and check the new size.' },
      { title: 'Trim pages', text: 'Remove unneeded pages for extra savings.' },
    ],
    tips: ['Scanning in grayscale produces much smaller files than color.'],
    faqs: [
      { q: 'Will quality drop?', a: 'No, lossless optimization keeps text and stamps fully legible.' },
    ],
  },
  {
    slug: 'compress-pdf-for-email',
    group: 'office',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'edit-pdf-pages', 'merge-pdf'],
    title: 'Compress a PDF to Send by Email',
    metaTitle: 'Compress PDF for Email – Make Attachments Small Enough to Send',
    metaDescription: 'PDF too big for Gmail or Outlook attachments? Compress it losslessly, or split it into smaller parts, and send it as an email attachment. Free.',
    lead: 'Gmail and Outlook cap attachment sizes. Compress your PDF or split it into parts so it goes through as a normal attachment.',
    queries: ['compress pdf for email', 'pdf too large to email', 'reduce pdf size for gmail', 'outlook attachment too large pdf', 'shrink pdf to send'],
    sections: [
      { heading: 'Two ways to get under the limit', body: [
        'Compress PDF optimizes the file without changing its content. If it is still too large, split it with Edit PDF pages and send the parts in separate emails.',
      ] },
    ],
    steps: [
      { title: 'Upload', text: 'Choose the PDF you want to send.' },
      { title: 'Compress', text: 'Optimize it and check the result size.' },
      { title: 'Send', text: 'Attach the smaller file to your email.' },
    ],
    tips: ['Remove cover pages and blank pages before sending large reports.'],
    faqs: [
      { q: 'Does it change the content?', a: 'No, the content and layout stay the same.' },
    ],
  },
  // ——— Jobs & resumes ———
  {
    slug: 'compress-resume-under-2mb',
    pair: 'cv-pdf-boyutu-kucultme',
    group: 'career',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'word-to-pdf', 'edit-pdf-pages'],
    title: 'Compress Your Resume PDF Under 2 MB',
    metaTitle: 'Compress Resume PDF Under 2MB – Shrink Your CV for Job Portals',
    metaDescription: 'Job portal rejecting your resume? Shrink your CV PDF for LinkedIn, Indeed, Workday and email applications. Keeps layout and ATS-readable text. Free.',
    lead: 'Designed resume too heavy for the job portal? Compress the PDF, or re-export it from Word, and get it under the size limit.',
    queries: ['compress resume under 2mb', 'reduce cv pdf size', 'resume pdf too large', 'shrink resume for linkedin', 'workday resume file size', 'indeed resume upload size'],
    sections: [
      { heading: 'Why resumes get heavy', body: [
        'High-resolution headshots, graphics exported from design tools like Canva and embedded fonts inflate file size.',
        'Compress PDF optimizes the file losslessly. Re-exporting a Word resume with Word to PDF often gives the smallest result.',
      ] },
    ],
    steps: [
      { title: 'Upload your resume', text: 'Choose your CV PDF.' },
      { title: 'Compress', text: 'Optimize it and see the new size.' },
      { title: 'Apply', text: 'Upload the smaller PDF to the job portal.' },
    ],
    tips: ['Resize your photo before placing it in the resume; 400×500 px is plenty.'],
    faqs: [
      { q: 'Will my design change?', a: 'No. Layout, fonts and colors stay the same.' },
      { q: 'Can ATS software still read it?', a: 'Yes. Compression does not change the text, so ATS parsing works as before.' },
    ],
  },
  {
    slug: 'edit-old-resume-pdf-in-word',
    pair: 'eski-cv-word-cevirme',
    group: 'career',
    tool: 'pdf-to-word',
    tools: ['pdf-to-word', 'word-to-pdf'],
    title: 'Edit an Old Resume PDF in Word',
    metaTitle: 'Convert Resume PDF to Word – Update an Old CV Without Retyping',
    metaDescription: 'Only have your resume as a PDF? Convert it to Word, add your new role and skills, then export a fresh PDF. Free resume PDF to DOCX.',
    lead: 'Lost the original Word file? Convert your old resume PDF to Word, update it and export a clean new PDF.',
    queries: ['convert resume pdf to word', 'edit resume pdf', 'update old cv pdf', 'cv pdf to docx', 'canva resume to word'],
    sections: [
      { heading: 'Update, then export again', body: [
        'PDF to Word rebuilds tables and two-column resume layouts. After editing, use Word to PDF to produce an application-ready PDF.',
      ] },
    ],
    steps: [
      { title: 'Convert', text: 'Turn your resume PDF into Word.' },
      { title: 'Update', text: 'Add new experience and skills.' },
      { title: 'Export', text: 'Save the final version with Word to PDF.' },
    ],
    tips: ['Text boxes from design tools may arrive as separate boxes; edit text inside them.'],
    faqs: [
      { q: 'Is my photo kept?', a: 'Yes, images are carried into the Word document.' },
    ],
  },
  {
    slug: 'combine-resume-and-cover-letter',
    pair: 'cv-diploma-sertifika-tek-pdf',
    group: 'career',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'images-to-pdf', 'compress-pdf'],
    title: 'Combine Your Resume, Cover Letter and Certificates into One PDF',
    metaTitle: 'Combine Resume and Cover Letter into One PDF – Free',
    metaDescription: 'Job portal allows only one upload? Merge your cover letter, resume, transcripts and certificates into a single PDF in the right order.',
    lead: 'When the application form takes a single file, put your cover letter, resume, transcript and certificates into one PDF.',
    queries: ['combine resume and cover letter into one pdf', 'merge cv and certificates', 'one pdf job application', 'combine transcript and resume', 'merge cover letter pdf'],
    sections: [
      { heading: 'The right order makes a first impression', body: [
        'Suggested order: cover letter → resume → degree → transcript → certificates → references. Convert photographed certificates with JPG to PDF first.',
      ] },
    ],
    steps: [
      { title: 'Select documents', text: 'Upload your resume and supporting documents.' },
      { title: 'Order them', text: 'Put the cover letter and resume first.' },
      { title: 'Merge', text: 'Download one PDF and attach it to your application.' },
    ],
    tips: ['If the merged file is large, run Compress PDF.'],
    faqs: [
      { q: 'How many documents can I add?', a: '20 files and 300 pages per merge.' },
    ],
  },
  {
    slug: 'resume-word-to-pdf',
    pair: 'word-cv-pdf-yapma',
    group: 'career',
    tool: 'word-to-pdf',
    tools: ['word-to-pdf', 'compress-pdf', 'merge-pdf'],
    title: 'Convert Your Word Resume to PDF',
    metaTitle: 'Resume Word to PDF – Convert Your CV from DOCX to PDF Free',
    metaDescription: 'Send a resume that looks the same on every device. Convert your Word CV to PDF in seconds and avoid broken layouts. Free DOCX to PDF.',
    lead: 'A DOCX resume can look different on a recruiter’s computer. Send a PDF so your layout stays exactly as designed.',
    queries: ['resume word to pdf', 'convert cv docx to pdf', 'save resume as pdf', 'docx to pdf free', 'word to pdf without losing formatting'],
    sections: [
      { heading: 'Why send a PDF', body: [
        'Word files render differently depending on the version and installed fonts. PDF locks the layout across devices.',
      ] },
    ],
    steps: [
      { title: 'Upload the DOCX', text: 'Choose your resume Word file.' },
      { title: 'Convert', text: 'Start the conversion.' },
      { title: 'Check', text: 'Open the PDF and review page breaks.' },
    ],
    tips: ['Macro-enabled (.docm) or externally linked documents are not supported; save as a normal .docx.'],
    faqs: [
      { q: 'Are .doc files supported?', a: '.docx is supported; save older .doc files as .docx in Word first.' },
    ],
  },
  // ——— Accounting & finance ———
  {
    slug: 'bank-statement-to-excel',
    pair: 'banka-ekstresi-excel-aktarma',
    group: 'finance',
    tool: 'pdf-to-excel',
    tools: ['pdf-to-excel', 'merge-pdf', 'ocr'],
    title: 'Convert a Bank Statement PDF to Excel',
    metaTitle: 'Bank Statement to Excel – Convert PDF Statements to XLSX Free',
    metaDescription: 'Extract transaction tables from bank and credit card statement PDFs into Excel. Filter, total and categorize spending. Free PDF to Excel converter.',
    lead: 'Pull the transaction tables from your online-banking PDF statement into Excel so you can filter, total and categorize spending.',
    queries: ['bank statement to excel', 'convert bank statement pdf to excel', 'credit card statement to excel', 'pdf statement to csv', 'bank transactions to spreadsheet', 'pdf table to excel'],
    sections: [
      { heading: 'Which statements work?', body: [
        'Digital PDFs downloaded from online banking (with selectable text) work best: each detected table becomes its own Excel sheet.',
        'Paper statements that were scanned contain no table structure; use OCR to get their text instead. Cell values come through as text and no formula is ever executed.',
      ] },
      { heading: 'Next steps in Excel', body: [
        'Convert the amount column to numbers with Text to Columns or VALUE(), then build a PivotTable to see spending by category.',
      ] },
    ],
    steps: [
      { title: 'Upload the statement', text: 'Choose the PDF from your bank (up to 50 pages).' },
      { title: 'Convert to Excel', text: 'Tables are detected and exported to XLSX.' },
      { title: 'Analyze', text: 'Filter, sort and total in Excel.' },
    ],
    tips: ['Merge monthly statements first, then convert in one go (mind the 50-page limit).'],
    faqs: [
      { q: 'Do scanned statements work?', a: 'No. Tables are only detected in digital PDFs; use OCR for scanned text.' },
      { q: 'Are formulas safe?', a: 'Yes. Cells are imported as text and nothing from the PDF is executed.' },
    ],
  },
  {
    slug: 'invoice-pdf-to-excel',
    pair: 'pdf-fatura-excel-aktarma',
    group: 'finance',
    tool: 'pdf-to-excel',
    tools: ['pdf-to-excel', 'merge-pdf'],
    title: 'Convert Invoice PDFs to Excel',
    metaTitle: 'Invoice PDF to Excel – Extract Line Items into a Spreadsheet',
    metaDescription: 'Extract invoice line items, quantities and totals from PDF invoices into Excel. Stop retyping supplier invoices. Free PDF to Excel.',
    lead: 'Stop retyping supplier invoices: export the line-item tables (item, quantity, unit price, tax) straight to Excel.',
    queries: ['invoice pdf to excel', 'extract invoice line items', 'pdf invoice to spreadsheet', 'purchase order pdf to excel', 'pdf table extraction'],
    sections: [
      { heading: 'What gets extracted', body: [
        'The line-item table and table-shaped totals are detected. Free text outside tables (addresses, notes) is not exported.',
      ] },
    ],
    steps: [
      { title: 'Upload the invoice', text: 'Choose the PDF invoice.' },
      { title: 'Export', text: 'Line-item tables go to XLSX.' },
      { title: 'Reconcile', text: 'Merge the data into your bookkeeping sheet.' },
    ],
    tips: ['Merge several invoices into one PDF first to export them together.'],
    faqs: [
      { q: 'Why “no table found”?', a: 'Scanned invoices or layouts without table structure cannot be detected.' },
    ],
  },
  {
    slug: 'merge-monthly-invoices',
    pair: 'e-arsiv-faturalari-birlestirme',
    group: 'finance',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'pdf-to-excel'],
    title: 'Merge Monthly Invoices and Receipts into One PDF',
    metaTitle: 'Merge Invoices into One PDF – Monthly Receipts for Your Accountant',
    metaDescription: 'Combine a month of invoices, receipts and expense reports into one PDF for your accountant or expense claim. Free, no sign-up.',
    lead: 'Send your accountant or expense system one tidy file with every invoice and receipt from the month.',
    queries: ['merge invoices into one pdf', 'combine receipts into one pdf', 'expense report receipts pdf', 'monthly invoices pdf', 'combine bills pdf'],
    sections: [
      { heading: 'Month-end routine', body: [
        'Merging invoices in date order makes review faster. Snap paper receipts with your phone and add them via JPG to PDF.',
      ] },
    ],
    steps: [
      { title: 'Select invoices', text: 'Upload the month’s invoice PDFs.' },
      { title: 'Sort by date', text: 'Arrange files chronologically.' },
      { title: 'Merge', text: 'Send one PDF to your accountant.' },
    ],
    tips: ['More than 20 invoices? Merge in two batches, then merge the two results.'],
    faqs: [
      { q: 'Does merging affect invoice validity?', a: 'Pages are not altered, but keep the original files for record-keeping requirements.' },
    ],
  },
  {
    slug: 'combine-tax-documents',
    group: 'finance',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'images-to-pdf', 'compress-pdf'],
    title: 'Combine Tax Documents into One PDF',
    metaTitle: 'Combine Tax Documents into One PDF – Forms, Receipts, Statements',
    metaDescription: 'Gather tax forms, receipts, donation letters and statements into one PDF to send to your tax preparer. Free online PDF merger.',
    lead: 'Hand your tax preparer a single, ordered PDF with forms, statements and receipts instead of dozens of attachments.',
    queries: ['combine tax documents into one pdf', 'merge tax forms pdf', 'send documents to accountant pdf', 'tax receipts one pdf', 'combine w2 and 1099 pdf'],
    sections: [
      { heading: 'Group by type', body: [
        'A clear order (income forms → deductions → receipts → prior-year return) saves your preparer time. Photos of paper receipts can be added with JPG to PDF.',
      ] },
    ],
    steps: [
      { title: 'Collect files', text: 'Upload forms, statements and receipts.' },
      { title: 'Order by category', text: 'Put income documents first, then deductions.' },
      { title: 'Merge', text: 'Download one PDF and send it to your preparer.' },
    ],
    tips: ['Compress the merged file if your preparer’s portal has an upload limit.'],
    faqs: [
      { q: 'Are my tax documents stored?', a: 'Only temporarily and only for your session; they expire automatically and can be deleted right away.' },
    ],
  },
  // ——— Office & everyday tasks ———
  {
    slug: 'extract-and-rotate-pdf-pages',
    pair: 'pdf-sayfa-ayirma-dondurme',
    group: 'office',
    tool: 'edit-pdf-pages',
    tools: ['edit-pdf-pages', 'merge-pdf', 'compress-pdf'],
    title: 'Extract, Delete and Rotate PDF Pages',
    metaTitle: 'Extract PDF Pages, Delete or Rotate Pages – Free Online',
    metaDescription: 'Pull specific pages out of a PDF, delete pages you do not need, fix upside-down scans or save every page as its own PDF. Free and online.',
    lead: 'Need just the signed page from a long contract, or to fix pages scanned upside down? Type the page range and keep only what you need.',
    queries: ['extract pages from pdf', 'delete pages from pdf', 'rotate pdf pages', 'split pdf into pages', 'reorder pdf pages', 'fix upside down pdf'],
    sections: [
      { heading: 'How to write a page range', body: [
        'Type “3, 1-2” and the output is page 3 followed by pages 1 and 2; pages you leave out are removed. Rotation applies to the selected pages.',
        'Choose “One PDF per page (ZIP)” to get every page as a separate PDF.',
      ] },
    ],
    steps: [
      { title: 'Upload', text: 'Choose the PDF.' },
      { title: 'Enter pages', text: 'e.g. 5-8 or 3, 1-2; pick a rotation if needed.' },
      { title: 'Download', text: 'Get one PDF or a ZIP.' },
    ],
    tips: ['Fix a few upside-down pages by rotating just those, then merge them back.'],
    faqs: [
      { q: 'Is my original changed?', a: 'No, a new file is created.' },
      { q: 'How long can the document be?', a: 'Up to 300 pages.' },
    ],
  },
  {
    slug: 'pdf-pages-to-jpg-for-social',
    pair: 'pdf-sayfalarini-jpg-yapma',
    group: 'office',
    tool: 'pdf-to-images',
    tools: ['pdf-to-images', 'edit-pdf-pages'],
    title: 'Turn PDF Pages into JPG or PNG Images',
    metaTitle: 'PDF to JPG – Turn Pages into Images for Instagram & Websites',
    metaDescription: 'Convert PDF pages into high-quality JPG or PNG images to share menus, flyers, slides and posters on Instagram, WhatsApp or your website.',
    lead: 'Turn a menu, flyer, slide deck or poster PDF into shareable images; one page comes back as an image, several pages as a ZIP.',
    queries: ['pdf to jpg', 'convert pdf page to image', 'pdf to instagram post', 'pdf to png high quality', 'menu pdf to jpg', 'slides to images'],
    sections: [
      { heading: 'JPG or PNG?', body: [
        'JPG gives smaller files for photo-heavy pages. PNG is sharper for text, logos and line art. “High” quality renders at 150 DPI for extra detail.',
      ] },
    ],
    steps: [
      { title: 'Upload', text: 'Choose a PDF of up to 30 pages.' },
      { title: 'Pick format and pages', text: 'Choose JPG/PNG, quality and an optional page range.' },
      { title: 'Download', text: 'Get a single image or a ZIP.' },
    ],
    tips: ['Only need the cover for Instagram? Enter “1” in the pages field.'],
    faqs: [
      { q: 'Why is the output a ZIP?', a: 'When several pages are selected, all images are bundled into one ZIP.' },
    ],
  },
  {
    slug: 'excel-quote-to-pdf',
    pair: 'excel-teklif-bordro-pdf-yapma',
    group: 'office',
    tool: 'excel-to-pdf',
    tools: ['excel-to-pdf', 'merge-pdf', 'compress-pdf'],
    title: 'Convert an Excel Quote, Price List or Timesheet to PDF',
    metaTitle: 'Excel to PDF – Send Quotes, Price Lists and Timesheets as PDF',
    metaDescription: 'Convert Excel quotes, price lists, timesheets and reports into client-ready PDFs. All worksheets or just the first. Free XLSX to PDF.',
    lead: 'Share your quote or price list as a PDF so formulas, column widths and formatting look exactly right for the client.',
    queries: ['excel to pdf', 'convert quote spreadsheet to pdf', 'price list excel to pdf', 'timesheet to pdf', 'xlsx to pdf free'],
    sections: [
      { heading: 'Which sheets are exported?', body: [
        'Export all worksheets or only the first. The layout follows the print settings saved in Excel.',
      ] },
    ],
    steps: [
      { title: 'Upload the XLSX', text: 'Choose your Excel file.' },
      { title: 'Pick sheets', text: 'All worksheets or the first only.' },
      { title: 'Send the PDF', text: 'Share it with your client.' },
    ],
    tips: ['Set Page Layout > Fit to “1 page wide” in Excel to avoid split columns.'],
    faqs: [
      { q: 'Are macro files supported?', a: 'Files with macros, embedded objects or external links are rejected for security.' },
    ],
  },
];
