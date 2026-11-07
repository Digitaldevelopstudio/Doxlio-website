import React, { useState, useRef } from 'react';
import { 
  Send, 
  Download, 
  Printer, 
  Sparkles, 
  RotateCcw, 
  Eye, 
  Edit3, 
  User, 
  Building2, 
  FileText, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Layout, 
  Palette,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { callGeminiApi } from '../utils/aiClient';

export interface CoverLetterData {
  applicant: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  recipient: {
    managerName: string;
    managerTitle: string;
    companyName: string;
    department: string;
    companyAddress: string;
  };
  job: {
    targetTitle: string;
    jobCode: string;
    jobDescription: string;
  };
  letter: {
    date: string;
    salutation: string;
    opening: string;
    body: string;
    closing: string;
    signOff: string;
  };
}

const SAMPLE_COVER_LETTER: CoverLetterData = {
  applicant: {
    fullName: 'Alexander Vance',
    jobTitle: 'Senior Systems Architect & Engineering Lead',
    email: 'alex.vance@example.com',
    phone: '+1 (415) 890-2341',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexandervance',
  },
  recipient: {
    managerName: 'Sarah Jenkins',
    managerTitle: 'VP of Platform Architecture',
    companyName: 'Acro Technologies',
    department: 'Infrastructure & Cloud Engineering',
    companyAddress: '450 Mission Street, Suite 900, San Francisco, CA',
  },
  job: {
    targetTitle: 'Principal Distributed Systems Architect',
    jobCode: 'REQ-2026-894',
    jobDescription: 'Seeking a principal architect to lead client-side web application resilience, distributed document processing, and zero-trust security pipelines.',
  },
  letter: {
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    salutation: 'Dear Ms. Jenkins and the Engineering Leadership Team,',
    opening: 'I am writing to express my enthusiastic interest in the Principal Distributed Systems Architect position at Acro Technologies. Having spent the last nine years architecting high-throughput client-side productivity applications and zero-retention cloud pipelines, I have closely followed Acro’s technical milestones in scalable enterprise infrastructure.',
    body: 'In my current role as Principal Software Architect at Quantum Document Cloud, I spearheaded the deployment of an in-browser document processing pipeline that reduced external server payload processing by 82% while preserving client-side memory safety for over 4 million monthly active enterprise users. Prior to that at Apex Data Labs, I led a cross-functional team of 14 staff engineers to build distributed optical ingestion tools handling 6M daily files with 99.98% uptime.\n\nAcro’s focus on low-latency document processing and zero-trust architecture aligns directly with my engineering philosophy. My deep expertise across TypeScript, WebAssembly, and client-side cryptography positions me to immediately deliver tangible technical impact to your core roadmap.',
    closing: 'I would welcome the opportunity to discuss how my technical leadership and systems architecture experience can accelerate Acro Technologies’ engineering objectives. Thank you very much for your time and thoughtful consideration.',
    signOff: 'Sincerely,',
  },
};

export const CoverLetterBuilderView: React.FC = () => {
  const [data, setData] = useState<CoverLetterData>(SAMPLE_COVER_LETTER);
  const [template, setTemplate] = useState<'modern' | 'executive' | 'minimal'>('modern');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [zoomLevel, setZoomLevel] = useState(100);

  // AI Generation State
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Handle AI Drafting
  const handleAiDraft = async () => {
    setIsAiGenerating(true);
    setAiError(null);
    setAiSuccess(false);

    try {
      const prompt = `Write a compelling, professional, customized cover letter for the following candidate:

CANDIDATE:
Name: ${data.applicant.fullName}
Title: ${data.applicant.jobTitle}
Contact: ${data.applicant.email} | ${data.applicant.phone}

TARGET COMPANY & ROLE:
Company: ${data.recipient.companyName}
Hiring Manager: ${data.recipient.managerName} (${data.recipient.managerTitle})
Target Role: ${data.job.targetTitle}
Job Context / Requirements: ${data.job.jobDescription || 'Senior leadership role demanding excellence, reliability, and innovation.'}

Generate the letter formatted with:
1. Opening hook paragraph
2. Body paragraphs demonstrating quantifiable achievements and company alignment
3. Confident closing paragraph with call to action.

Return only the body text of the letter without placeholder headers.`;

      const generated = await callGeminiApi(
        prompt,
        'You are an executive career advisor and master cover letter writer. Produce high-impact, persuasive prose without generic clichés.',
        'cover_letter'
      );

      if (generated) {
        // Split or set into body
        setData((prev) => ({
          ...prev,
          letter: {
            ...prev.letter,
            body: generated.trim(),
          },
        }));
        setAiSuccess(true);
        setTimeout(() => setAiSuccess(false), 3000);
      }
    } catch (err: any) {
      setAiError(err.message || 'AI generation failed. Please verify GEMINI_API_KEY is configured.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      handlePrint();
      return;
    }

    const previewHtml = previewRef.current?.innerHTML || '';
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.applicant.fullName} - Cover Letter</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background: #fff; }
            .print-wrapper { width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box; }
          </style>
          ${styles}
        </head>
        <body>
          <div class="print-wrapper">${previewHtml}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Doxlio Tools</span>
            <span>/</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Cover Letter Builder</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Professional Cover Letter Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create tailored, beautifully formatted cover letters with live preview, AI assistance, and A4 PDF export.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setData(SAMPLE_COVER_LETTER)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Load sample cover letter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Load Sample
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'edit'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Letter Details
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================== */}
        {/* LEFT COLUMN: EDIT DETAILS FORM */}
        {/* ==================================================== */}
        <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Template & Color Selector Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-slate-900 dark:text-white">Style:</span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  {(['modern', 'executive', 'minimal'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`px-3 py-1 rounded-md capitalize font-semibold transition-colors ${
                        template === t
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Accent:</span>
                <div className="flex items-center gap-1.5">
                  {['#0f766e', '#2563eb', '#4f46e5', '#7c3aed', '#0f172a'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        accentColor === color ? 'scale-115 border-white ring-2 ring-teal-500' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Drafting Card */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/40 dark:to-blue-950/40 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                AI Cover Letter Assistant (Gemini 3.8)
              </span>
              <button
                onClick={handleAiDraft}
                disabled={isAiGenerating}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Drafting Letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Draft with AI
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-300">
              Generates a tailored, persuasive body matching your role and target company description.
            </p>
            {aiSuccess && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Cover letter drafted successfully!
              </p>
            )}
            {aiError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {aiError}
              </p>
            )}
          </div>

          {/* Applicant Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Applicant Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Your Full Name:</label>
                <input
                  type="text"
                  value={data.applicant.fullName}
                  onChange={(e) => setData({ ...data, applicant: { ...data.applicant, fullName: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Professional Title:</label>
                <input
                  type="text"
                  value={data.applicant.jobTitle}
                  onChange={(e) => setData({ ...data, applicant: { ...data.applicant, jobTitle: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Email:</label>
                <input
                  type="email"
                  value={data.applicant.email}
                  onChange={(e) => setData({ ...data, applicant: { ...data.applicant, email: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Phone:</label>
                <input
                  type="text"
                  value={data.applicant.phone}
                  onChange={(e) => setData({ ...data, applicant: { ...data.applicant, phone: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Company & Recipient Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Recipient & Company
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Hiring Manager Name:</label>
                <input
                  type="text"
                  value={data.recipient.managerName}
                  onChange={(e) => setData({ ...data, recipient: { ...data.recipient, managerName: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Company Name:</label>
                <input
                  type="text"
                  value={data.recipient.companyName}
                  onChange={(e) => setData({ ...data, recipient: { ...data.recipient, companyName: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Target Job Title:</label>
                <input
                  type="text"
                  value={data.job.targetTitle}
                  onChange={(e) => setData({ ...data, job: { ...data.job, targetTitle: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Job Description / Requirements snippet:</label>
                <textarea
                  rows={2}
                  value={data.job.jobDescription}
                  onChange={(e) => setData({ ...data, job: { ...data.job, jobDescription: e.target.value } })}
                  placeholder="Paste key requirements or role focus..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Cover Letter Content
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Salutation:</label>
                <input
                  type="text"
                  value={data.letter.salutation}
                  onChange={(e) => setData({ ...data, letter: { ...data.letter, salutation: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Opening Paragraph:</label>
                <textarea
                  rows={3}
                  value={data.letter.opening}
                  onChange={(e) => setData({ ...data, letter: { ...data.letter, opening: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 resize-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Body Content (Impact & Achievements):</label>
                <textarea
                  rows={6}
                  value={data.letter.body}
                  onChange={(e) => setData({ ...data, letter: { ...data.letter, body: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Closing Paragraph:</label>
                <textarea
                  rows={2}
                  value={data.letter.closing}
                  onChange={(e) => setData({ ...data, letter: { ...data.letter, closing: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: LIVE REAL-TIME COVER LETTER PREVIEW */}
        {/* ==================================================== */}
        <div className={`lg:col-span-6 sticky top-20 ${mobileTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-slate-200/80 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-inner flex flex-col items-center">
            {/* Preview Toolbar */}
            <div className="w-full flex items-center justify-between mb-4 text-xs text-slate-600 dark:text-slate-400 px-2">
              <span className="font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-teal-600" /> Live Letterhead Preview
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoomLevel((z) => Math.max(70, z - 10))} className="p-1 hover:text-teal-600">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px]">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel((z) => Math.min(130, z + 10))} className="p-1 hover:text-teal-600">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Letter Sheet Container */}
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 w-full max-w-[595px]"
            >
              <div
                ref={previewRef}
                className="w-full bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 min-h-[842px] text-left leading-relaxed text-xs border border-slate-200"
                style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
              >
                {/* Modern Template */}
                {template === 'modern' && (
                  <div className="space-y-6">
                    {/* Modern Top Letterhead */}
                    <div className="border-b pb-6" style={{ borderColor: `${accentColor}30` }}>
                      <h2 className="text-2xl font-extrabold text-slate-950">
                        {data.applicant.fullName}
                      </h2>
                      <p className="text-sm font-bold" style={{ color: accentColor }}>
                        {data.applicant.jobTitle}
                      </p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        {[data.applicant.email, data.applicant.phone, data.applicant.location].filter(Boolean).join(' • ')}
                      </div>
                    </div>

                    {/* Date & Recipient Block */}
                    <div className="space-y-3 pt-2 text-[11px]">
                      <p className="text-slate-500 font-medium">{data.letter.date}</p>
                      <div className="text-slate-800 leading-tight">
                        <p className="font-bold">{data.recipient.managerName}</p>
                        <p className="text-slate-600">{data.recipient.managerTitle}</p>
                        <p className="font-semibold text-slate-900">{data.recipient.companyName}</p>
                        <p className="text-slate-500">{data.recipient.companyAddress}</p>
                      </div>
                    </div>

                    {/* Subject line */}
                    <div className="pt-2">
                      <p className="font-bold text-[11px]" style={{ color: accentColor }}>
                        RE: Application for {data.job.targetTitle} {data.job.jobCode ? `(${data.job.jobCode})` : ''}
                      </p>
                    </div>

                    {/* Letter Body */}
                    <div className="space-y-3 text-[11px] text-slate-700 leading-relaxed">
                      <p className="font-semibold text-slate-900">{data.letter.salutation}</p>
                      <p>{data.letter.opening}</p>
                      <p className="whitespace-pre-line">{data.letter.body}</p>
                      <p>{data.letter.closing}</p>
                    </div>

                    {/* Sign-off */}
                    <div className="pt-4 space-y-3 text-[11px]">
                      <p>{data.letter.signOff}</p>
                      <div className="pt-2">
                        <p className="font-bold text-slate-950">{data.applicant.fullName}</p>
                        <p className="text-slate-500 text-[10px]">{data.applicant.jobTitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Executive Template */}
                {template === 'executive' && (
                  <div className="space-y-6">
                    <div className="text-center border-b-2 pb-5 space-y-1" style={{ borderColor: accentColor }}>
                      <h2 className="text-3xl font-serif font-bold text-slate-950">
                        {data.applicant.fullName}
                      </h2>
                      <p className="text-xs uppercase tracking-widest font-bold" style={{ color: accentColor }}>
                        {data.applicant.jobTitle}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {[data.applicant.email, data.applicant.phone, data.applicant.location].filter(Boolean).join('  |  ')}
                      </p>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-700">
                      <div>
                        <p className="font-bold text-slate-900">{data.recipient.managerName}</p>
                        <p>{data.recipient.managerTitle}</p>
                        <p className="font-semibold">{data.recipient.companyName}</p>
                      </div>
                      <p className="text-slate-500">{data.letter.date}</p>
                    </div>

                    <p className="font-serif font-bold text-[11px] underline">
                      Application for {data.job.targetTitle}
                    </p>

                    <div className="space-y-3 text-[11px] text-slate-700 leading-relaxed">
                      <p className="font-bold">{data.letter.salutation}</p>
                      <p>{data.letter.opening}</p>
                      <p className="whitespace-pre-line">{data.letter.body}</p>
                      <p>{data.letter.closing}</p>
                    </div>

                    <div className="pt-4 space-y-3 text-[11px]">
                      <p>{data.letter.signOff}</p>
                      <p className="font-serif font-bold text-slate-950">{data.applicant.fullName}</p>
                    </div>
                  </div>
                )}

                {/* Minimal Template */}
                {template === 'minimal' && (
                  <div className="space-y-5 font-sans text-slate-900">
                    <div className="flex justify-between items-start border-b pb-4">
                      <div>
                        <h2 className="text-xl font-bold">{data.applicant.fullName}</h2>
                        <p className="text-[11px] text-slate-600">{data.applicant.jobTitle}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        <p>{data.applicant.email}</p>
                        <p>{data.applicant.phone}</p>
                        <p>{data.letter.date}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-800 leading-tight">
                      <p className="font-bold">{data.recipient.managerName}</p>
                      <p>{data.recipient.companyName}</p>
                    </div>

                    <div className="space-y-3 text-[11px] text-slate-700 leading-relaxed">
                      <p className="font-bold">{data.letter.salutation}</p>
                      <p>{data.letter.opening}</p>
                      <p className="whitespace-pre-line">{data.letter.body}</p>
                      <p>{data.letter.closing}</p>
                    </div>

                    <div className="pt-4 text-[11px]">
                      <p>{data.letter.signOff}</p>
                      <p className="font-bold mt-2">{data.applicant.fullName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
