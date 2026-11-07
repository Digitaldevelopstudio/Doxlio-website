import React, { useState, useEffect } from 'react';
import { 
  Stamp, 
  Receipt, 
  FileBadge, 
  Award, 
  QrCode, 
  Barcode, 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { 
  InvoiceData, 
  generateInvoicePDF, 
  ResumeData, 
  generateResumePDF, 
  CertificateData, 
  generateCertificatePDF, 
  generateQRCodeDataUrl, 
  generateBarcodeDataUrl 
} from '../utils/generators';
import { downloadFile } from '../utils/pdfEngine';

interface ProductivityGeneratorsViewProps {
  initialToolId?: string;
}

export const ProductivityGeneratorsView: React.FC<ProductivityGeneratorsViewProps> = ({ 
  initialToolId = 'resume-builder' 
}) => {
  const [activeTool, setActiveTool] = useState(initialToolId);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. INVOICE STATE
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: 'INV-2026-089',
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    fromName: 'Apex Document Design Studio',
    fromEmail: 'billing@apexstudio.io',
    fromAddress: '100 Montgomery St, Suite 1800, San Francisco, CA',
    clientName: 'Global Logistics Corp',
    clientEmail: 'accounts@globallogistics.com',
    clientAddress: '500 Enterprise Way, Chicago, IL',
    items: [
      { id: '1', description: 'Enterprise Architecture & OCR Pipeline Integration', quantity: 1, rate: 3500 },
      { id: '2', description: 'High-Fidelity Document Scanning Mobile UI', quantity: 1, rate: 2200 },
      { id: '3', description: 'Cross-browser Performance & Privacy Hardening', quantity: 1, rate: 1100 },
    ],
    taxRate: 8.5,
    discount: 5,
    currency: '$',
    notes: 'Payment is due within 14 calendar days via ACH direct wire or international credit card. Thank you for your partnership.',
  });

  // 2. RESUME STATE
  const [resume, setResume] = useState<ResumeData>({
    fullName: 'Alex Vance',
    jobTitle: 'Lead Software Architect & Product Engineer',
    email: 'alex.vance@doxlio.com',
    phone: '+1 (415) 890-4321',
    location: 'San Francisco, CA',
    summary: 'Senior full-stack systems engineer with 8+ years architecting client-side high-throughput web applications, computer vision pipelines, and resilient SaaS platforms.',
    experience: [
      {
        role: 'Principal Frontend Architect',
        company: 'Vanguard Systems',
        period: '2023 - Present',
        details: 'Architected client-side document processing engine delivering <150ms perspective warp transformations. Spearheaded 0-data retention privacy roadmap.',
      },
      {
        role: 'Senior Software Engineer',
        company: 'Starlight Cloud Infrastructure',
        period: '2020 - 2023',
        details: 'Built distributed web tooling processing 4M monthly PDF exports. Optimized bundle sizes by 42% through lazy modular architecture.',
      },
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        school: 'University of California, Berkeley',
        year: '2016 - 2020',
      },
    ],
    skills: ['TypeScript', 'React 19', 'Canvas 2D / WebGL', 'Computer Vision', 'PDF Specification', 'Node.js', 'System Architecture'],
  });

  // 3. CERTIFICATE STATE
  const [certificate, setCertificate] = useState<CertificateData>({
    recipientName: 'Sarah Jenkins',
    courseTitle: 'Executive Document Security & Zero-Trust Architecture',
    awardText: 'in recognition of exceptional mastery and successful completion of the intensive program in',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    issuerName: 'Dr. Michael Chen',
    issuerRole: 'Global Standards Board Chairman',
  });

  // 4. QR CODE STATE
  const [qrText, setQrText] = useState('https://doxlio.com');
  const [qrDarkColor, setQrDarkColor] = useState('#0f172a');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    generateQRCodeDataUrl(qrText, { darkColor: qrDarkColor }).then(setQrDataUrl);
  }, [qrText, qrDarkColor]);

  // 5. BARCODE STATE
  const [barcodeText, setBarcodeText] = useState('DOXLIO-8942');
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'EAN13' | 'UPC'>('CODE128');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState('');

  useEffect(() => {
    const url = generateBarcodeDataUrl(barcodeText, barcodeFormat);
    setBarcodeDataUrl(url);
  }, [barcodeText, barcodeFormat]);

  // 6. TEXT TO SPEECH (TTS) STATE
  const [ttsText, setTtsText] = useState(
    'Doxlio is a complete document productivity platform. Every document, one smart place. Your confidential files are processed locally inside your browser memory for total privacy.'
  );
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsVoices, setTtsVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setTtsVoices(v);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTtsPlay = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    if (ttsVoices[selectedVoiceIndex]) {
      utterance.voice = ttsVoices[selectedVoiceIndex];
    }
    utterance.onend = () => setTtsPlaying(false);
    utterance.onerror = () => setTtsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setTtsPlaying(true);
  };

  const handleTtsStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setTtsPlaying(false);
  };

  // Export handlers
  const handleDownloadInvoice = () => {
    const pdf = generateInvoicePDF(invoice);
    downloadFile(pdf, `Invoice_${invoice.invoiceNumber}.pdf`);
    setSuccessMessage('Professional Invoice PDF generated and downloaded!');
  };

  const handleDownloadResume = () => {
    const pdf = generateResumePDF(resume);
    downloadFile(pdf, `Resume_${resume.fullName.replace(/\s+/g, '_')}.pdf`);
    setSuccessMessage('ATS-optimized Resume PDF generated and downloaded!');
  };

  const handleDownloadCertificate = () => {
    const pdf = generateCertificatePDF(certificate);
    downloadFile(pdf, `Certificate_${certificate.recipientName.replace(/\s+/g, '_')}.pdf`);
    setSuccessMessage('Official Certificate of Achievement downloaded!');
  };

  const toolsList = [
    { id: 'resume-builder', name: 'Resume Builder', icon: FileBadge },
    { id: 'invoice-generator', name: 'Invoice Generator', icon: Receipt },
    { id: 'certificate-maker', name: 'Certificate Maker', icon: Award },
    { id: 'qr-code-generator', name: 'QR Code Generator', icon: QrCode },
    { id: 'barcode-generator', name: 'Barcode Generator', icon: Barcode },
    { id: 'text-to-speech', name: 'Text to Speech (TTS)', icon: Volume2 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Doxlio Tools</span>
          <span>/</span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">Business Generators</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Stamp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Business Document & Productivity Generators
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Instant PDF generation for invoices, resumes, certificates, barcodes, and QR codes.
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {toolsList.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                setSuccessMessage(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                activeTool === t.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.name}
            </button>
          );
        })}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 mb-6">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. RESUME BUILDER */}
      {/* ==================================================== */}
      {activeTool === 'resume-builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal & Contact Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400">Full Name:</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Target Role Title:</label>
                <input
                  type="text"
                  value={resume.jobTitle}
                  onChange={(e) => setResume({ ...resume, jobTitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Email Address:</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => setResume({ ...resume, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Phone Number:</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400">Executive Summary:</label>
              <textarea
                rows={3}
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400">Skills (comma separated):</label>
              <input
                type="text"
                value={resume.skills.join(', ')}
                onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map((s) => s.trim()) })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
              />
            </div>

            <button
              onClick={handleDownloadResume}
              className="w-full py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Generate & Download ATS-Friendly Resume PDF
            </button>
          </div>

          {/* Real-time Document Preview Card */}
          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner flex flex-col justify-between">
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-md space-y-4 max-h-[500px] overflow-y-auto">
              <div className="border-b pb-3">
                <h2 className="text-xl font-bold text-slate-900">{resume.fullName}</h2>
                <p className="text-xs font-semibold text-blue-600">{resume.jobTitle}</p>
                <p className="text-[10px] text-slate-500 mt-1">{resume.email} | {resume.phone} | {resume.location}</p>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-[11px] uppercase tracking-wider block">Summary</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{resume.summary}</p>
              </div>
              <div className="text-xs space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider block">Experience</span>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="text-[11px]">
                    <div className="flex justify-between font-semibold">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="text-slate-400">{exp.period}</span>
                    </div>
                    <p className="text-slate-600 text-[10px]">{exp.details}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-4">
              Formatted according to standard Harvard and modern ATS typography.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. INVOICE GENERATOR */}
      {/* ==================================================== */}
      {activeTool === 'invoice-generator' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400">Invoice Number:</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Issue Date:</label>
                <input
                  type="date"
                  value={invoice.invoiceDate}
                  onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Due Date:</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Sender (Your Business):</span>
                <input
                  type="text"
                  placeholder="Business Name"
                  value={invoice.fromName}
                  onChange={(e) => setInvoice({ ...invoice, fromName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
                <input
                  type="email"
                  placeholder="Billing Email"
                  value={invoice.fromEmail}
                  onChange={(e) => setInvoice({ ...invoice, fromEmail: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Recipient (Client Details):</span>
                <input
                  type="text"
                  placeholder="Client / Company Name"
                  value={invoice.clientName}
                  onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
                <input
                  type="email"
                  placeholder="Client Email"
                  value={invoice.clientEmail}
                  onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Itemized Line Items</span>
              <div className="space-y-2">
                {invoice.items.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => {
                        const next = [...invoice.items];
                        next[idx].description = e.target.value;
                        setInvoice({ ...invoice, items: next });
                      }}
                      className="flex-3 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => {
                        const next = [...invoice.items];
                        next[idx].quantity = parseFloat(e.target.value) || 0;
                        setInvoice({ ...invoice, items: next });
                      }}
                      className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => {
                        const next = [...invoice.items];
                        next[idx].rate = parseFloat(e.target.value) || 0;
                        setInvoice({ ...invoice, items: next });
                      }}
                      className="w-28 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-right font-mono"
                    />
                    <span className="w-24 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        if (invoice.items.length > 1) {
                          setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== idx) });
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setInvoice({
                    ...invoice,
                    items: [
                      ...invoice.items,
                      { id: Date.now().toString(), description: 'Additional consulting or deliverable', quantity: 1, rate: 500 },
                    ],
                  });
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Item
              </button>
            </div>

            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Formal PDF Invoice
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. CERTIFICATE MAKER */}
      {/* ==================================================== */}
      {activeTool === 'certificate-maker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Certificate Fields</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400">Recipient Name:</label>
                <input
                  type="text"
                  value={certificate.recipientName}
                  onChange={(e) => setCertificate({ ...certificate, recipientName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Course / Award Title:</label>
                <input
                  type="text"
                  value={certificate.courseTitle}
                  onChange={(e) => setCertificate({ ...certificate, courseTitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400">Signatory Authority / Issuer:</label>
                <input
                  type="text"
                  value={certificate.issuerName}
                  onChange={(e) => setCertificate({ ...certificate, issuerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
            </div>

            <button
              onClick={handleDownloadCertificate}
              className="w-full py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Download High-Resolution Certificate PDF
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="border-4 border-blue-600 p-8 rounded-xl bg-white text-slate-900 shadow-md w-full max-w-sm space-y-3">
              <Award className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Certificate of Achievement</h4>
              <p className="text-[10px] text-slate-400">PRESENTED TO</p>
              <p className="text-base font-bold text-blue-600">{certificate.recipientName}</p>
              <p className="text-[11px] text-slate-600 font-medium">{certificate.courseTitle}</p>
              <div className="pt-4 border-t text-[10px] text-slate-500">
                Issued by {certificate.issuerName}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. QR CODE & BARCODE GENERATOR */}
      {/* ==================================================== */}
      {(activeTool === 'qr-code-generator' || activeTool === 'barcode-generator') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeTool === 'qr-code-generator' ? 'QR Code Content' : 'Barcode Settings'}
            </h3>

            {activeTool === 'qr-code-generator' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400">Target URL or Text:</label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400">QR Code Color:</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="color"
                      value={qrDarkColor}
                      onChange={(e) => setQrDarkColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-xs">{qrDarkColor}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400">Barcode Text / SKU:</label>
                  <input
                    type="text"
                    value={barcodeText}
                    onChange={(e) => setBarcodeText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400">Standard Symbology:</label>
                  <select
                    value={barcodeFormat}
                    onChange={(e) => setBarcodeFormat(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                  >
                    <option value="CODE128">CODE128 (Standard Logistics & Docs)</option>
                    <option value="EAN13">EAN-13 (Retail International)</option>
                    <option value="UPC">UPC (North America Retail)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                const targetUrl = activeTool === 'qr-code-generator' ? qrDataUrl : barcodeDataUrl;
                downloadFile(targetUrl, `Doxlio_${activeTool}.png`, 'image/png');
                setSuccessMessage('Code downloaded in high resolution!');
              }}
              className="w-full py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download High-Res PNG
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
            {activeTool === 'qr-code-generator' ? (
              qrDataUrl && (
                <div className="p-4 bg-white rounded-2xl shadow-md">
                  <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 object-contain" />
                </div>
              )
            ) : (
              barcodeDataUrl && (
                <div className="p-4 bg-white rounded-2xl shadow-md">
                  <img src={barcodeDataUrl} alt="Barcode" className="max-w-full h-auto object-contain" />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. TEXT TO SPEECH (TTS) */}
      {/* ==================================================== */}
      {activeTool === 'text-to-speech' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Document Text-to-Speech Audio Reader</h3>
            <p className="text-xs text-slate-500 mt-0.5">Listen to articles, contracts, and scanned text read out loud with natural inflection.</p>
          </div>

          <textarea
            rows={5}
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Voice:</span>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value))}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs max-w-xs"
              >
                {ttsVoices.map((v, i) => (
                  <option key={i} value={i}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={ttsPlaying ? handleTtsStop : handleTtsPlay}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-colors flex items-center gap-2 ${
                  ttsPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {ttsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {ttsPlaying ? 'Pause Audio' : 'Play Speech'}
              </button>
              {ttsPlaying && (
                <button
                  onClick={handleTtsStop}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5" /> Stop
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
