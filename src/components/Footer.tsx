import React from 'react';
import { ShieldCheck, Lock, ArrowUpRight, Download } from 'lucide-react';
import { DoxlioLogo } from './DoxlioLogo';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenSitemap: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSitemap }) => {
  return (
    <footer className="bg-[#0B1220] text-slate-300 border-t border-slate-800">
      {/* Privacy Guarantee Banner */}
      <div className="bg-[#080d17] border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Upload Privacy Architecture:</strong> Your documents, PDFs, crops, and scans are processed locally in your browser memory.
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Free to use — no sign-up required</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <button 
              onClick={() => onNavigate('/')}
              className="flex items-center text-left focus:outline-none mb-4 group cursor-pointer transition-transform active:scale-[0.98]"
              aria-label="Doxlio Home"
            >
              <DoxlioLogo size="md" inverted={true} />
            </button>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              Every document. One smart place. A globally competitive, privacy-first productivity platform featuring mobile document scanning, PDF tools, file converters, AI document intelligence, and professional business generators.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Designed for professionals, students, and enterprises worldwide.</p>
              <p>100% Client-Side Processing for standard document tools.</p>
            </div>
          </div>

          {/* Scanner & PDF Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Scanner & PDF
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/tool/document-scanner')} className="hover:text-white transition-colors cursor-pointer">
                  Document Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/pdf-merger')} className="hover:text-white transition-colors cursor-pointer">
                  PDF Merger
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/pdf-splitter')} className="hover:text-white transition-colors cursor-pointer">
                  PDF Splitter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/sign-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Sign PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/add-watermark')} className="hover:text-white transition-colors cursor-pointer">
                  Add Watermark
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/pdf-compressor')} className="hover:text-white transition-colors cursor-pointer">
                  PDF Compressor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/pdf-organizer')} className="hover:text-white transition-colors cursor-pointer">
                  Organize PDF Pages
                </button>
              </li>
            </ul>
          </div>

          {/* AI & Converters */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              AI & Converters
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/tool/ai-pdf-summarizer')} className="hover:text-white transition-colors cursor-pointer">
                  AI PDF Summarizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/chat-with-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Chat with PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/ai-resume-analyzer')} className="hover:text-white transition-colors cursor-pointer">
                  AI Resume & ATS Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/ocr-image-to-text')} className="hover:text-white transition-colors cursor-pointer">
                  OCR Image to Text
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/image-compressor')} className="hover:text-white transition-colors cursor-pointer">
                  Image Compressor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/word-to-pdf')} className="hover:text-white transition-colors cursor-pointer">
                  Word to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Business & Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/tool/resume-builder')} className="hover:text-white transition-colors cursor-pointer">
                  Resume & CV Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/cover-letter-builder')} className="hover:text-white transition-colors cursor-pointer">
                  Cover Letter Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/invoice-generator')} className="hover:text-white transition-colors cursor-pointer">
                  Invoice Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer">
                  About Doxlio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={onOpenSitemap} className="hover:text-white transition-colors text-blue-400 cursor-pointer">
                  XML Sitemap
                </button>
              </li>
              <li>
                <a 
                  href={`${import.meta.env.BASE_URL || '/'}Doxlio-Platform-Final.zip`.replace('//', '/')} 
                  download="Doxlio-Platform-Final.zip"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                  title="Download complete ready-to-deploy Doxlio platform (.ZIP)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Doxlio Platform (.ZIP)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Doxlio. All rights reserved. Every document. One smart place.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/disclaimer')} className="hover:text-slate-400 transition-colors cursor-pointer">
              Disclaimer
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/guides')} className="hover:text-slate-400 transition-colors cursor-pointer">
              User Guides
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/tools')} className="hover:text-slate-400 transition-colors cursor-pointer">
              Site Directory
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
