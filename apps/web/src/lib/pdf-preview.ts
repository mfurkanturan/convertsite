import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker via CDN matching the installed pdfjs-dist version
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface PdfPagePreview {
  pageNumber: number; // 1-indexed
  dataUrl: string;
  width: number;
  height: number;
  rotation: number;
}

const cMapUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`;
const standardFontDataUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`;

/**
 * Render a single page of a PDF file to a base64 JPEG data URL.
 */
export async function renderPdfPage(
  file: File,
  pageIndex = 1,
  targetWidth = 240
): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl,
      cMapPacked: true,
      standardFontDataUrl,
    });
    const pdf = await loadingTask.promise;
    if (pageIndex > pdf.numPages) return null;

    const page = await pdf.getPage(pageIndex);
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.max(0.2, targetWidth / viewport.width);
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(scaledViewport.width);
    canvas.height = Math.round(scaledViewport.height);

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return null;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport: scaledViewport,
      canvas,
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.82);
  } catch (err) {
    console.error('PDF page render error:', err);
    return null;
  }
}

/**
 * Extract all pages of a PDF as visual thumbnails for reordering.
 */
export async function renderAllPdfPages(
  file: File,
  targetWidth = 240
): Promise<PdfPagePreview[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl,
      cMapPacked: true,
      standardFontDataUrl,
    });
    const pdf = await loadingTask.promise;
    const results: PdfPagePreview[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const scale = Math.max(0.2, targetWidth / viewport.width);
      const scaledViewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(scaledViewport.width);
      canvas.height = Math.round(scaledViewport.height);

      const context = canvas.getContext('2d', { alpha: false });
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          canvas,
        }).promise;

        results.push({
          pageNumber: i,
          dataUrl: canvas.toDataURL('image/jpeg', 0.82),
          width: scaledViewport.width,
          height: scaledViewport.height,
          rotation: 0,
        });
      }
    }

    return results;
  } catch (err) {
    console.error('PDF all pages render error:', err);
    return [];
  }
}
