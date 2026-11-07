import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

// --- INVOICE GENERATOR ---
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  taxRate: number; // percentage
  discount: number; // percentage
  currency: string;
  notes: string;
}

export function generateInvoicePDF(data: InvoiceData): Uint8Array {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header accent
  doc.setFillColor(37, 99, 235); // Doxlio Blue
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text('INVOICE', 40, 56);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Invoice #${data.invoiceNumber || 'INV-001'}`, 40, 72);
  doc.text(`Issue Date: ${data.invoiceDate}`, 40, 86);
  doc.text(`Due Date: ${data.dueDate}`, 40, 100);

  // From block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('BILLED BY:', 40, 134);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(data.fromName || 'Your Business Name', 40, 148);
  doc.text(data.fromEmail || 'billing@business.com', 40, 162);
  doc.text(data.fromAddress || '123 Commerce Way, Suite 100', 40, 176);

  // Client block
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('BILLED TO:', 320, 134);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(data.clientName || 'Client Name', 320, 148);
  doc.text(data.clientEmail || 'client@company.com', 320, 162);
  doc.text(data.clientAddress || '456 Client Boulevard', 320, 176);

  // Table header
  let y = 220;
  doc.setFillColor(241, 245, 249);
  doc.rect(40, y, pageWidth - 80, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('DESCRIPTION', 50, y + 16);
  doc.text('QTY', 340, y + 16);
  doc.text('RATE', 410, y + 16);
  doc.text('AMOUNT', 490, y + 16);

  // Items
  y += 32;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  let subtotal = 0;
  data.items.forEach((item) => {
    const itemTotal = item.quantity * item.rate;
    subtotal += itemTotal;

    doc.text(item.description || 'Service or item', 50, y);
    doc.text(item.quantity.toString(), 345, y);
    doc.text(`${data.currency} ${item.rate.toFixed(2)}`, 410, y);
    doc.text(`${data.currency} ${itemTotal.toFixed(2)}`, 490, y);

    // Line divider
    doc.setDrawColor(241, 245, 249);
    doc.line(40, y + 8, pageWidth - 40, y + 8);
    y += 24;
  });

  // Calculations
  const discountAmount = subtotal * (data.discount / 100);
  const taxable = subtotal - discountAmount;
  const taxAmount = taxable * (data.taxRate / 100);
  const total = taxable + taxAmount;

  y += 16;
  const summaryX = 360;
  doc.setFontSize(10);
  doc.text('Subtotal:', summaryX, y);
  doc.text(`${data.currency} ${subtotal.toFixed(2)}`, 490, y);
  y += 18;

  if (data.discount > 0) {
    doc.text(`Discount (${data.discount}%):`, summaryX, y);
    doc.text(`-${data.currency} ${discountAmount.toFixed(2)}`, 490, y);
    y += 18;
  }

  if (data.taxRate > 0) {
    doc.text(`Tax (${data.taxRate}%):`, summaryX, y);
    doc.text(`${data.currency} ${taxAmount.toFixed(2)}`, 490, y);
    y += 18;
  }

  // Total bar
  doc.setFillColor(238, 242, 255);
  doc.rect(summaryX - 10, y - 6, 205, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text('Total Due:', summaryX, y + 14);
  doc.text(`${data.currency} ${total.toFixed(2)}`, 490, y + 14);

  // Notes
  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('PAYMENT TERMS & NOTES:', 40, y + 50);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(data.notes, 40, y + 65, { maxWidth: 300 });
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

// --- RESUME BUILDER ---
export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: { role: string; company: string; period: string; details: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: string[];
}

export function generateResumePDF(data: ResumeData): Uint8Array {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  let y = 50;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(data.fullName || 'Alex Morgan', margin, y);
  y += 20;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(37, 99, 235);
  doc.text(data.jobTitle || 'Senior Software Engineer', margin, y);
  y += 16;

  // Contact line
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const contacts = [data.email, data.phone, data.location].filter(Boolean).join('  |  ');
  doc.text(contacts || 'alex@example.com  |  +1 (555) 019-2834  |  San Francisco, CA', margin, y);
  y += 16;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
  y += 24;

  // Summary
  if (data.summary) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(data.summary, doc.internal.pageSize.getWidth() - margin * 2);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 13 + 16;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('EXPERIENCE', margin, y);
    y += 16;

    data.experience.forEach((exp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(exp.role, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(exp.period, doc.internal.pageSize.getWidth() - margin, y, { align: 'right' });
      y += 13;

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(71, 85, 105);
      doc.text(exp.company, margin, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const splitDetails = doc.splitTextToSize(exp.details, doc.internal.pageSize.getWidth() - margin * 2);
      doc.text(splitDetails, margin, y);
      y += splitDetails.length * 12 + 12;
    });
    y += 8;
  }

  // Education
  if (data.education && data.education.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('EDUCATION', margin, y);
    y += 16;

    data.education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text(edu.degree, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(edu.year, doc.internal.pageSize.getWidth() - margin, y, { align: 'right' });
      y += 13;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(edu.school, margin, y);
      y += 16;
    });
    y += 8;
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('SKILLS & COMPETENCIES', margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(data.skills.join('  •  '), margin, y, { maxWidth: doc.internal.pageSize.getWidth() - margin * 2 });
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

// --- CERTIFICATE MAKER ---
export interface CertificateData {
  recipientName: string;
  courseTitle: string;
  awardText: string;
  date: string;
  issuerName: string;
  issuerRole: string;
}

export function generateCertificatePDF(data: CertificateData): Uint8Array {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Outer decorative border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(4);
  doc.rect(25, 25, w - 50, h - 50);

  // Inner thin border
  doc.setDrawColor(147, 197, 253);
  doc.setLineWidth(1);
  doc.rect(32, 32, w - 64, h - 64);

  // Badge icon simulation
  doc.setFillColor(37, 99, 235);
  doc.circle(w / 2, 85, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('★', w / 2, 90, { align: 'center' });

  // Certificate Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATE OF ACHIEVEMENT', w / 2, 145, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('THIS IS PROUDLY PRESENTED TO', w / 2, 175, { align: 'center' });

  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(37, 99, 235);
  doc.text(data.recipientName || 'Johnathan Doe', w / 2, 220, { align: 'center' });

  // Underline
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1.5);
  doc.line(w / 2 - 160, 230, w / 2 + 160, 230);

  // Award description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  const awardMsg = data.awardText || 'for successfully completing the specialized professional program in';
  doc.text(awardMsg, w / 2, 260, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(data.courseTitle || 'Advanced Document Architecture & Security', w / 2, 290, { align: 'center' });

  // Signatures & Date
  const sigY = 410;

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(data.date || new Date().toLocaleDateString(), 140, sigY);
  doc.line(80, sigY + 5, 200, sigY + 5);
  doc.text('DATE ISSUED', 140, sigY + 18, { align: 'center' });

  // Issuer Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(data.issuerName || 'Dr. Eleanor Vance', w - 140, sigY, { align: 'center' });
  doc.line(w - 200, sigY + 5, w - 80, sigY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(data.issuerRole || 'Executive Program Director', w - 140, sigY + 18, { align: 'center' });

  return new Uint8Array(doc.output('arraybuffer'));
}

// --- QR CODE GENERATION ---
export async function generateQRCodeDataUrl(
  text: string,
  options?: { darkColor?: string; lightColor?: string; width?: number }
): Promise<string> {
  return await QRCode.toDataURL(text || 'https://doxlio.com', {
    width: options?.width || 320,
    margin: 2,
    color: {
      dark: options?.darkColor || '#0f172a',
      light: options?.lightColor || '#ffffff',
    },
  });
}

// --- BARCODE GENERATION ---
export function generateBarcodeDataUrl(
  text: string,
  format: 'CODE128' | 'EAN13' | 'UPC' = 'CODE128'
): string {
  const canvas = document.createElement('canvas');
  try {
    JsBarcode(canvas, text || 'DOXLIO-2026', {
      format: format,
      lineColor: '#0f172a',
      width: 2.5,
      height: 80,
      displayValue: true,
      font: 'monospace',
      fontSize: 14,
      background: '#ffffff',
      margin: 10,
    });
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Barcode generation fallback:', err);
    // Draw simple fallback pattern
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 240;
      canvas.height = 100;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 240, 100);
      ctx.fillStyle = '#0f172a';
      ctx.font = '12px monospace';
      ctx.fillText('INVALID CODE FORMAT', 30, 50);
    }
    return canvas.toDataURL('image/png');
  }
}
