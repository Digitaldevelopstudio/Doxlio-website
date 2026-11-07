import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { MetaData } from '../types';

/**
 * Merges multiple PDF files into one single PDF.
 */
export async function mergePDFs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Splits a PDF document by extracting specified 1-based page numbers.
 */
export async function splitPDF(
  pdfBuffer: ArrayBuffer,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  const zeroBasedIndices = pageNumbers
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < srcPdf.getPageCount());

  const copiedPages = await newPdf.copyPages(srcPdf, zeroBasedIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Rotates pages in a PDF document.
 * If pageIndex is -1, rotates all pages.
 */
export async function rotatePDF(
  pdfBuffer: ArrayBuffer,
  pageIndex: number,
  rotationAngle: number // e.g. 90, 180, 270
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pageCount = pdf.getPageCount();

  if (pageIndex === -1) {
    for (let i = 0; i < pageCount; i++) {
      const page = pdf.getPage(i);
      page.setRotation(degrees((page.getRotation().angle + rotationAngle) % 360));
    }
  } else if (pageIndex >= 0 && pageIndex < pageCount) {
    const page = pdf.getPage(pageIndex);
    page.setRotation(degrees((page.getRotation().angle + rotationAngle) % 360));
  }

  return await pdf.save();
}

/**
 * Deletes specified 1-based page numbers from a PDF.
 */
export async function deletePDFPages(
  pdfBuffer: ArrayBuffer,
  pagesToDelete: number[]
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const deleteSet = new Set(pagesToDelete.map((p) => p - 1));

  const keepIndices = [];
  for (let i = 0; i < totalPages; i++) {
    if (!deleteSet.has(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages from the document.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, keepIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Adds custom text watermark diagonally across pages.
 */
export async function addWatermarkToPDF(
  pdfBuffer: ArrayBuffer,
  watermarkText: string,
  options?: {
    opacity?: number;
    fontSize?: number;
    color?: { r: number; g: number; b: number };
    rotation?: number;
  }
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  const opacity = options?.opacity ?? 0.28;
  const fontSize = options?.fontSize ?? 48;
  const rot = options?.rotation ?? 45;
  const color = options?.color ?? { r: 0.8, g: 0.1, b: 0.1 };

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(watermarkText, {
      x: (width - textWidth) / 2,
      y: (height - textHeight) / 2,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rot),
    });
  }

  return await pdf.save();
}

/**
 * Places signature image onto a specific PDF page.
 */
export async function signPDF(
  pdfBuffer: ArrayBuffer,
  signaturePngDataUrl: string,
  placement: {
    pageNumber: number; // 1-based
    x: number;
    y: number;
    width: number;
    height: number;
  }
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pngImage = await pdf.embedPng(signaturePngDataUrl);

  const pageIndex = Math.max(0, Math.min(placement.pageNumber - 1, pdf.getPageCount() - 1));
  const page = pdf.getPage(pageIndex);

  page.drawImage(pngImage, {
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height,
  });

  return await pdf.save();
}

/**
 * Updates PDF metadata (Title, Author, Subject, Keywords).
 */
export async function updatePDFMetadata(
  pdfBuffer: ArrayBuffer,
  meta: MetaData
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });

  if (meta.title !== undefined) pdf.setTitle(meta.title);
  if (meta.author !== undefined) pdf.setAuthor(meta.author);
  if (meta.subject !== undefined) pdf.setSubject(meta.subject);
  if (meta.keywords !== undefined) pdf.setKeywords(meta.keywords);
  pdf.setModificationDate(new Date());

  return await pdf.save();
}

/**
 * Creates a multi-page PDF from a list of image data URLs.
 */
export function createPDFFromImages(
  images: { dataUrl: string; width: number; height: number }[],
  pageSize: 'a4' | 'letter' = 'a4'
): Uint8Array {
  // A4 dimensions in mm: 210 x 297
  // Letter dimensions in mm: 215.9 x 279.4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pageSize,
  });

  const pageW = pageSize === 'a4' ? 210 : 215.9;
  const pageH = pageSize === 'a4' ? 297 : 279.4;
  const margin = 10;
  const usableW = pageW - margin * 2;
  const usableH = pageH - margin * 2;

  images.forEach((img, idx) => {
    if (idx > 0) doc.addPage();

    const imgAspect = img.width / img.height;
    const pageAspect = usableW / usableH;

    let renderW = usableW;
    let renderH = usableH;
    let offsetX = margin;
    let offsetY = margin;

    if (imgAspect > pageAspect) {
      // Fit to width
      renderH = usableW / imgAspect;
      offsetY = margin + (usableH - renderH) / 2;
    } else {
      // Fit to height
      renderW = usableH * imgAspect;
      offsetX = margin + (usableW - renderW) / 2;
    }

    doc.addImage(img.dataUrl, 'JPEG', offsetX, offsetY, renderW, renderH);
  });

  const pdfOutput = doc.output('arraybuffer');
  return new Uint8Array(pdfOutput);
}

/**
 * Downloads a Uint8Array or Blob as a file in the browser.
 */
export function downloadFile(
  data: Uint8Array | Blob | string,
  filename: string,
  mimeType = 'application/pdf'
) {
  let blob: Blob;
  if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType });
  } else if (data instanceof Uint8Array) {
    blob = new Blob([data as unknown as BlobPart], { type: mimeType });
  } else {
    blob = data;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Reads basic PDF details (page count, title, author) without external servers.
 */
export async function getPDFInfo(pdfBuffer: ArrayBuffer) {
  try {
    const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'Untitled Document',
      author: pdf.getAuthor() || 'Unknown Author',
      subject: pdf.getSubject() || '',
      keywords: pdf.getKeywords() || '',
      creationDate: pdf.getCreationDate()?.toLocaleDateString() || '',
    };
  } catch (err: any) {
    return {
      pageCount: 1,
      title: 'Document',
      author: 'Unknown',
      subject: '',
      keywords: '',
      creationDate: '',
      error: err?.message,
    };
  }
}
