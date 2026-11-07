import React, { useState } from 'react';
import { 
  Camera, 
  Layers, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Scissors, 
  PenTool, 
  Stamp, 
  Receipt, 
  QrCode, 
  FileSearch, 
  Edit3, 
  ChevronRight,
  Lock,
  RotateCw,
  Award,
  FileBadge,
  Send,
  Minimize2,
  Image as ImageIcon,
  HelpCircle,
  FileCheck,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { ALL_TOOLS } from '../utils/toolsData';
import { ToolItem } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

type TabCategory = 'all' | 'scanner_pdf' | 'ai' | 'image_office' | 'business';

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map tools to the 4 strict requested categories
  const filterToolsByCategory = (category: TabCategory): ToolItem[] => {
    switch (category) {
      case 'scanner_pdf':
        return ALL_TOOLS.filter((t) => t.category === 'scanner' || t.category === 'pdf');
      case 'ai':
        return ALL_TOOLS.filter((t) => t.category === 'ai');
      case 'image_office':
        return ALL_TOOLS.filter((t) => t.category === 'image' || t.category === 'office');
      case 'business':
        return ALL_TOOLS.filter((t) => t.category === 'productivity');
      case 'all':
      default:
        return ALL_TOOLS;
    }
  };

  const displayedTools = filterToolsByCategory(activeTab).filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tagline.toLowerCase().includes(query) ||
      t.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  const getToolIcon = (iconName: string, category: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Minimize2':
        return <Minimize2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Stamp':
        return <Stamp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'FileBadge':
        return <FileBadge className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* ==================================================== */}
      {/* 1. ORIGINAL DOXLIO BRAND HERO SECTION                */}
      {/* ==================================================== */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-[#F8FAFC] via-white to-slate-100/40 dark:from-[#0B1220] dark:via-[#101828] dark:to-[#0B1220]">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
          <div className="w-[600px] h-[350px] bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-violet-500/20 rounded-full blur-3xl mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                <span>Free to use — no sign-up required</span>
              </div>

              {/* Exact Requested Headline with Two-Color Typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Every document.{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent block sm:inline">
                  One smart place.
                </span>
              </h1>

              {/* Exact Requested Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Your complete document workspace for scanning, editing, converting, organizing, and creating documents — powered by intelligent AI tools.
              </p>

              {/* Dedicated Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('/tool/document-scanner')}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Scanning</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('tools-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore All Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators Strip */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Client-Side Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Zero Lag Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>No Account Required</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Column: Original Doxlio Workspace Interactive Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    Doxlio All-In-One Workspace
                  </span>
                </div>

                {/* 4 Pillars Preview Grid */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  {/* Pillar 1: Scanner & PDF */}
                  <div 
                    onClick={() => onNavigate('/tool/document-scanner')}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Scanner & PDF
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        8-Point Crop & Merge
                      </div>
                    </div>
                  </div>

                  {/* Pillar 2: AI Intelligence */}
                  <div 
                    onClick={() => onNavigate('/tool/ai-pdf-summarizer')}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 hover:border-violet-500 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                        AI Intelligence
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Gemini Document Audit
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3: Image & Office */}
                  <div 
                    onClick={() => onNavigate('/tool/image-compressor')}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        Image & Office
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Word, Excel & Resizing
                      </div>
                    </div>
                  </div>

                  {/* Pillar 4: Business Suite */}
                  <div 
                    onClick={() => onNavigate('/tool/resume-builder')}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileBadge className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Career & Business
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Resume & Invoices
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dedicated Scanner Action Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                      Ready to scan documents?
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Auto edge detection & crisp PDF export
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('/tool/document-scanner')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Scanner</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. INTERACTIVE TOOLS DIRECTORY & CATEGORIES          */}
      {/* ==================================================== */}
      <section id="tools-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Document Tools Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a category or search over 40+ professional document productivity tools.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. merge, resume, ocr)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192d] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* 4 Strict Requested Categories + All Tools */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', name: 'All Tools' },
            { id: 'scanner_pdf', name: 'Scanner & PDF' },
            { id: 'ai', name: 'AI Document Intelligence' },
            { id: 'image_office', name: 'Image & Office Tools' },
            { id: 'business', name: 'Business & Document Generators' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as TabCategory)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-[#11192d] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Professional Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedTools.slice(0, 16).map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.path)}
              className="group text-left p-5 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/80 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {getToolIcon(tool.icon, tool.category)}
                  </div>
                  {tool.isPopular && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>{tool.id === 'document-scanner' ? 'Open Scanner' : 'Open Tool'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* View All Button */}
        {displayedTools.length > 16 && (
          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('/tools')}
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>View All {ALL_TOOLS.length} Tools in Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* ==================================================== */}
      {/* 3. CAREER & BUSINESS SUITE SPOTLIGHT                 */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
                <FileBadge className="w-3.5 h-3.5" />
                <span>Career Suite & Professional Documents</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Resume & Cover Letter Builders
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Land top career opportunities with ATS-tested layouts, profile photo positioning, Gemini AI writing assistance, and pixel-perfect A4 PDF export.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('/tool/resume-builder')}
                className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileBadge className="w-3.5 h-3.5" />
                Resume Builder
              </button>
              <button
                onClick={() => onNavigate('/tool/cover-letter-builder')}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Cover Letter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Resume Builder Card */}
            <div 
              onClick={() => onNavigate('/tool/resume-builder')}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileBadge className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full">
                  3 Templates • Photo Upload
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Professional Resume & CV Builder
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Design a polished resume with custom profile photos, multiple templates (Modern, Executive, Minimal), experience entries, skill tags, languages, and instant A4 PDF download.
                </p>
              </div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open Resume Builder <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Cover Letter Builder Card */}
            <div 
              onClick={() => onNavigate('/tool/cover-letter-builder')}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-violet-500 hover:shadow-md transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/80 px-2.5 py-0.5 rounded-full">
                  AI-Assisted Writing
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                  Dedicated Cover Letter Builder
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Draft compelling, role-tailored cover letters that match your resume style. Includes hiring manager info, live letter preview, AI writing assistance with Gemini, and PDF export.
                </p>
              </div>
              <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                Open Cover Letter Builder <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. WHY CHOOSE DOXLIO (VALUE PILLARS)                 */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Professionals Choose Doxlio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered from first principles for global users who demand speed, privacy, and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Server Uploads</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Standard PDFs and scans never touch a remote server. Execution happens strictly in your browser RAM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant Latency</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No uploading huge files over slow internet. Client-side WebAssembly processes pages instantaneously.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">All-in-One Powerhouse</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Scanner, PDF suite, converters, generators, and AI in a single unified interface without switching apps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Subscriptions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Completely free to use with no account creation, no credit card prompts, and no sneaky paywalls.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. HOW IT WORKS                                      */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 dark:bg-[#11192d] rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How Doxlio Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Three streamlined steps to effortless document productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs space-y-3 border border-slate-200/80 dark:border-slate-800">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Choose a Tool or Open Camera</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Open the mobile document scanner or select from over 40+ specialized PDF and image tools.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs space-y-3 border border-slate-200/80 dark:border-slate-800">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Adjust & Enhance in Memory</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fine-tune 8 crop handles, apply perspective warp, sign contracts, or configure watermark options.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xs space-y-3 border border-slate-200/80 dark:border-slate-800">
              <span className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Export & Share Instantly</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download pristine multi-page PDFs, images, or extracted OCR text with zero watermark stamps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
