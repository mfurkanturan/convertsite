import { PDFDocument, StandardFonts } from 'pdf-lib';
export async function pdfFixture(width = 300, label = 'Synthetic fixture', pages = 1): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let index = 0; index < pages; index++) pdf.addPage([width, 500]).drawText(label, { x: 20, y: 450, font, size: 14 });
  return Buffer.from(await pdf.save());
}
export function multipart(bytes: Buffer, filename = 'fixture.pdf', mime = 'application/pdf') {
  const boundary = 'docly-test-boundary';
  return { payload: Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`),
    bytes, Buffer.from(`\r\n--${boundary}--\r\n`),
  ]), contentType: `multipart/form-data; boundary=${boundary}` };
}
