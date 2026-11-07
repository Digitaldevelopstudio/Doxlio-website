import React, { useState } from 'react';
import { DoxlioLogo } from './DoxlioLogo';
import { 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Camera, 
  Sparkles, 
  FileText, 
  Layers, 
  Briefcase, 
  FileBadge,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Brand Identity / Wordmark */}
          <button 
            onClick={() => handleNav('/')}
            className="flex items-center text-left focus:outline-none group shrink-0 cursor-pointer transition-transform active:scale-[0.98]"
            aria-label="Doxlio Home"
          >
            <DoxlioLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {/* Tools Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                className={`flex items-center gap-1.5 py-2 px-2.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer ${
                  toolsDropdownOpen ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-900' : ''
                }`}
              >
                <span>Browse Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 p-3 rounded-2xl bg-white dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <button
                    onClick={() => handleNav('/tool/document-scanner')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Scanner & PDF
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        Camera auto-crop, merge, split, sign & compress
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('/tool/ai-pdf-summarizer')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                        AI Document Intelligence
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        Summarize, chat with PDF & ATS resume analysis
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('/tool/image-compressor')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        Image & Office Tools
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        Word, Excel, background remover & converters
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('/tool/resume-builder')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileBadge className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Business & Generators
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        Resume, cover letter, invoice & certificates
                      </div>
                    </div>
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleNav('/tools')}
                      className="w-full py-2 px-3 text-center text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore all 40+ tools</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/tool/document-scanner')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                currentRoute === '/tool/document-scanner' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              Scanner
            </button>

            <button
              onClick={() => handleNav('/tool/pdf-merger')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                currentRoute.startsWith('/tool/pdf') ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              PDF Tools
            </button>

            <button
              onClick={() => handleNav('/tool/ai-pdf-summarizer')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                currentRoute.startsWith('/tool/ai') ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              AI Suite
            </button>

            <button
              onClick={() => handleNav('/tool/resume-builder')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                currentRoute === '/tool/resume-builder' || currentRoute === '/tool/cover-letter-builder' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              Career Suite
            </button>

            <button
              onClick={() => handleNav('/tools')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                currentRoute === '/tools' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              All Tools
            </button>
          </nav>

          {/* Action Header Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Search tools (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNav('/tools')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95 transition cursor-pointer"
            >
              <span>Explore Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => handleNav('/tool/document-scanner')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left cursor-pointer"
              >
                <Camera className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Scanner</div>
                <div className="text-[10px] text-slate-500">Camera & crop</div>
              </button>

              <button
                onClick={() => handleNav('/tool/pdf-merger')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">PDF Tools</div>
                <div className="text-[10px] text-slate-500">Merge, split, sign</div>
              </button>

              <button
                onClick={() => handleNav('/tool/ai-pdf-summarizer')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-violet-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">AI Suite</div>
                <div className="text-[10px] text-slate-500">Summarize & chat</div>
              </button>

              <button
                onClick={() => handleNav('/tool/resume-builder')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left cursor-pointer"
              >
                <FileBadge className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Career Suite</div>
                <div className="text-[10px] text-slate-500">Resume & letters</div>
              </button>
            </div>

            <div className="flex flex-col space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => handleNav('/tools')}
                className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
              >
                All 40+ Document Tools
              </button>
              <button
                onClick={() => handleNav('/about')}
                className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
              >
                About Doxlio
              </button>
              <button
                onClick={() => handleNav('/guides')}
                className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
              >
                User Guides
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
