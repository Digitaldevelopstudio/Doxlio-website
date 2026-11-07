import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Zap, 
  HelpCircle, 
  Mail, 
  Send, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ArrowRight, 
  FileText, 
  Camera, 
  Sparkles, 
  Layers, 
  Download,
  X,
  FileCode
} from 'lucide-react';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../utils/toolsData';
import { ToolItem } from '../types';

// ==========================================
// ALL TOOLS DIRECTORY
// ==========================================
export const AllToolsPage: React.FC<{ onSelectTool: (path: string) => void }> = ({ onSelectTool }) => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');

  const filterTools = () => {
    let list = ALL_TOOLS;
    if (selectedCat === 'scanner_pdf') {
      list = ALL_TOOLS.filter((t) => t.category === 'scanner' || t.category === 'pdf');
    } else if (selectedCat === 'ai') {
      list = ALL_TOOLS.filter((t) => t.category === 'ai');
    } else if (selectedCat === 'image_office') {
      list = ALL_TOOLS.filter((t) => t.category === 'image' || t.category === 'office');
    } else if (selectedCat === 'business') {
      list = ALL_TOOLS.filter((t) => t.category === 'productivity');
    }

    if (!search.trim()) return list;
    const query = search.toLowerCase();
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tagline.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const filtered = filterTools();

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore All Document Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Complete suite of 40+ professional document productivity utilities. Processed locally in your browser with zero document retention.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#11192d] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', name: 'All Tools' },
            { id: 'scanner_pdf', name: 'Scanner & PDF' },
            { id: 'ai', name: 'AI Document Intelligence' },
            { id: 'image_office', name: 'Image & Office Tools' },
            { id: 'business', name: 'Business & Generators' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tools by keyword..."
          className="w-full sm:w-64 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.path)}
            className="flex flex-col text-left p-5 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                {tool.isPopular && (
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {tool.tagline}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>{tool.id === 'document-scanner' ? 'Open Scanner' : 'Open Tool'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// ABOUT US PAGE
// ==========================================
export const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Every document. One smart place.
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Doxlio was engineered with a radical proposition: provide enterprise-grade document productivity without forcing users to sacrifice privacy, pay subscriptions, or upload confidential files to unfamiliar servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Client-Side Execution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our computer vision, PDF manipulating, and rendering pipelines run strictly inside your browser memory using WebAssembly and Canvas 2D.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <Zap className="w-8 h-8 text-blue-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Latency</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No upload queues, no bandwidth throttling. Files process immediately on your CPU and GPU with zero network bottlenecks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <Sparkles className="w-8 h-8 text-teal-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Gemini 3.8 Intelligence</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When you choose to summarize or translate, requests are securely proxied with zero document logging or retention.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CONTACT US PAGE
// ==========================================
export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback & Suggestions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Doxlio Team</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Have a question, feedback, or enterprise inquiry? Send us a message directly.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-center space-y-2 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold">Message Received!</h3>
            <p className="text-xs">Thank you for reaching out to Doxlio. We will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Your Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Email Address:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold">Inquiry Topic:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
              >
                <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Enterprise Partnership">Enterprise Partnership</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold">Message:</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ==========================================
// PRIVACY POLICY & TERMS
// ==========================================
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-6 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy & Client-Side Guarantee</h1>
      <p className="text-slate-500">Effective Date: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Core Privacy Tenet: Local Processing First</h2>
        <p>
          At Doxlio, privacy is not a marketing setting—it is the foundational architecture of our platform. For all standard document scanning, perspective correction, PDF merging, splitting, watermarking, signing, and image conversions, your files never leave your device. All image and byte operations occur in temporary client-side memory (RAM).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">2. No Account or Sign-Up Required</h2>
        <p>
          Doxlio requires zero user accounts, passwords, or personal credentials. You can use any tool without creating a profile or linking third-party identity providers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Artificial Intelligence Features</h2>
        <p>
          When you explicitly use an AI feature (such as the AI Document Summarizer or Chat with PDF), only the text snippet you provide is securely sent through encrypted HTTPS to the Gemini API proxy to generate your requested analysis. Doxlio never stores, sells, or trains models on your document content.
        </p>
      </section>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-6 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
      <p className="text-slate-500">Effective Date: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Doxlio (doxlio.com), you agree to be bound by these terms. Doxlio is provided free of charge for personal, educational, and commercial productivity.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Intellectual Property & Ownership</h2>
        <p>
          You retain 100% ownership, copyright, and title to any document, image, or scan you process using Doxlio. We claim zero rights or ownership over your content.
        </p>
      </section>
    </div>
  );
};

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-6 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Legal & Security Disclaimer</h1>
      <p>
        While Doxlio enforces strict client-side encryption and processing standards, digital documents generated using free automated templates (including contracts and certificates) are provided as general informational frameworks. For binding legal contracts or regulated compliance filings, always consult certified legal counsel.
      </p>
    </div>
  );
};

// ==========================================
// FAQ ACCORDION PAGE
// ==========================================
export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Doxlio really free to use without signing up?',
      a: 'Yes, 100%. You can scan multi-page documents, merge PDFs, generate invoices, create QR codes, and run optical OCR with zero fees and no account creation required.',
    },
    {
      q: 'How does the CamScanner-inspired document scanner work in browser?',
      a: 'The scanner accesses your mobile or desktop webcam with permission. When you capture a document, our computer vision engine computes luminance gradients to detect paper boundaries, places 8 precision handles for adjustment, and applies mathematical homography unwarping to rectify skew.',
    },
    {
      q: 'Are my private documents and contracts uploaded to remote servers?',
      a: 'No! All standard tools (merging, splitting, watermarking, signing, rotating, cropping, enhancing) run exclusively in your browser memory. Your files are never stored or logged on remote servers.',
    },
    {
      q: 'How do the AI Document Tools work?',
      a: 'Our AI tools utilize Gemini 3.8 Flash via a server-side proxy route. When you request a summary or translation, the text is processed in-flight and returned directly to your screen with zero persistence.',
    },
    {
      q: 'Can I export multi-page scans directly to PDF?',
      a: 'Yes. You can scan multiple pages sequentially, reorder or rotate them, and download them together as a standard high-definition A4 or US Letter PDF.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Everything you need to know about Doxlio's tools and security architecture.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
            >
              <span>{faq.q}</span>
              {openIndex === idx ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// GUIDES / BLOG PAGE
// ==========================================
export const GuidesPage: React.FC<{ onSelectTool: (path: string) => void }> = ({ onSelectTool }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Document Productivity Guides & Best Practices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Learn how to get pristine scans, bypass ATS resume filters, and secure sensitive documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <Camera className="w-6 h-6 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            How to Get Studio-Quality Document Scans with Your Phone
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Discover lighting techniques, contrast backgrounds, and how Doxlio's 8-handle crop and Magic Color filter remove shadows and sharpen text.
          </p>
          <button
            onClick={() => onSelectTool('/tool/document-scanner')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-2"
          >
            Open Scanner <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            The Zero-Upload Guide to PDF Privacy & Redaction
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Why uploading confidential NDAs and financial statements to cloud converters is dangerous, and how local in-browser memory execution eliminates exposure.
          </p>
          <button
            onClick={() => onSelectTool('/tool/pdf-merger')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-2"
          >
            Try Client-Side PDF Tools <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// XML SITEMAP MODAL
// ==========================================
export const SitemapModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://doxlio.com/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${ALL_TOOLS.map((t) => `  <url>
    <loc>https://doxlio.com${t.path}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-600" />
            XML Sitemap (sitemap.xml)
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <textarea
          readOnly
          rows={12}
          value={sitemapXml}
          className="w-full p-3 font-mono text-[11px] rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 resize-none"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              const blob = new Blob([sitemapXml], { type: 'application/xml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sitemap.xml';
              a.click();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download sitemap.xml
          </button>
        </div>
      </div>
    </div>
  );
};
