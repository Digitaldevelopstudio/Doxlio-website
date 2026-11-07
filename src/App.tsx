import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ScannerView } from './components/ScannerView';
import { PDFToolsView } from './components/PDFToolsView';
import { ImageOfficeToolsView } from './components/ImageOfficeToolsView';
import { AIToolsView } from './components/AIToolsView';
import { ProductivityGeneratorsView } from './components/ProductivityGeneratorsView';
import { ResumeBuilderView } from './components/ResumeBuilderView';
import { CoverLetterBuilderView } from './components/CoverLetterBuilderView';
import { 
  AllToolsPage, 
  AboutPage, 
  ContactPage, 
  PrivacyPolicyPage, 
  TermsPage, 
  DisclaimerPage, 
  FAQPage, 
  GuidesPage, 
  SitemapModal 
} from './components/StaticPages';
import { SearchModal } from './components/SearchModal';
import { SEOHead } from './components/SEOHead';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

// Detect deployment base path (e.g. '/Doxlio-website' on GitHub Pages or '' on root domains)
const getBasePath = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

// Normalize browser pathname into internal application route ('/', '/tools', '/tool/document-scanner', etc.)
export const normalizeRoute = (rawPath: string): string => {
  let path = rawPath || '/';

  // Support GitHub Pages SPA redirect query strings (e.g., ?/tools or ?p=/tools)
  if (path.includes('?')) {
    const search = path.substring(path.indexOf('?'));
    const urlParams = new URLSearchParams(search);
    const redirectParam = urlParams.get('p') || urlParams.get('route');
    if (redirectParam) {
      path = redirectParam;
    } else if (search.startsWith('?/')) {
      path = search.substring(1);
    }
  }

  // Remove full origin if passed
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      path = new URL(path).pathname;
    } catch {
      // ignore
    }
  }

  // Strip configured base path if present
  const base = getBasePath();
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }

  // Strip repository subpath (case-insensitive for GitHub Pages)
  if (path.toLowerCase().startsWith('/doxlio-website')) {
    path = path.replace(/^\/doxlio-website/i, '');
  }

  // Strip trailing query/hash
  path = path.split('?')[0].split('#')[0];

  // Guarantee clean leading slash
  if (!path || path === '') {
    path = '/';
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // Normalize away trailing slash for subpaths
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path;
};

// Format internal application route into browser URL including deployment base path
export const formatRouteForBrowser = (route: string): string => {
  const normalized = normalizeRoute(route);
  const base = getBasePath();
  if (!base) return normalized;
  return normalized === '/' ? `${base}/` : `${base}${normalized}`;
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return normalizeRoute(window.location.pathname + window.location.search);
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('doxlio_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('doxlio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('doxlio_theme', 'light');
    }
  }, [darkMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizeRoute(window.location.pathname + window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    const normalized = normalizeRoute(route);
    const targetUrl = formatRouteForBrowser(normalized);
    if (normalized !== currentRoute) {
      window.history.pushState({}, '', targetUrl);
      setCurrentRoute(normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Determine which page/view to render
  const renderContent = () => {
    // 1. Home
    if (currentRoute === '/') {
      return (
        <HomePage 
          onNavigate={handleNavigate} 
          onOpenSearch={() => setIsSearchOpen(true)} 
        />
      );
    }

    // 2. All Tools
    if (currentRoute === '/tools') {
      return <AllToolsPage onSelectTool={handleNavigate} />;
    }

    // 3. Document Scanner (Flagship) - supports both /tool/document-scanner and aliases
    if (
      currentRoute === '/tool/document-scanner' ||
      currentRoute === '/document-scanner' ||
      currentRoute === '/scanner'
    ) {
      return <ScannerView />;
    }

    // 4. Dedicated Resume & Cover Letter Builders (Direct URL aliases)
    if (currentRoute === '/resume-builder' || currentRoute === '/tool/resume-builder') {
      return <ResumeBuilderView />;
    }
    if (currentRoute === '/cover-letter-builder' || currentRoute === '/tool/cover-letter-builder') {
      return <CoverLetterBuilderView />;
    }

    // 4. PDF Suite Tools
    const pdfToolIds = [
      'pdf-merger',
      'pdf-splitter',
      'pdf-compressor',
      'pdf-to-jpg',
      'jpg-to-pdf',
      'sign-pdf',
      'add-watermark',
      'pdf-organizer',
      'rotate-pdf',
      'delete-pdf-pages',
      'protect-pdf',
      'pdf-metadata-editor',
    ];
    if (currentRoute.startsWith('/tool/')) {
      const toolId = currentRoute.replace('/tool/', '');

      if (pdfToolIds.includes(toolId)) {
        return <PDFToolsView initialToolId={toolId} />;
      }

      // 5. Image & Office Tools
      const imageOfficeToolIds = [
        'image-compressor',
        'image-resizer',
        'ocr-image-to-text',
        'background-remover',
        'png-to-jpg',
        'jpg-to-png',
        'word-to-pdf',
        'pdf-to-word',
        'word-editor',
        'excel-viewer',
        'csv-to-excel',
      ];
      if (imageOfficeToolIds.includes(toolId)) {
        return <ImageOfficeToolsView initialToolId={toolId} />;
      }

      // 6. AI Document Tools
      const aiToolIds = [
        'ai-pdf-summarizer',
        'chat-with-pdf',
        'ai-document-translator',
        'ai-resume-analyzer',
        'ai-writing-assistant',
        'ai-grammar-checker',
        'ai-notes-generator',
        'ai-cover-letter',
      ];
      if (aiToolIds.includes(toolId)) {
        return <AIToolsView initialToolId={toolId} />;
      }

      // 7. Dedicated Resume & Cover Letter Builders
      if (toolId === 'resume-builder') {
        return <ResumeBuilderView />;
      }
      if (toolId === 'cover-letter-builder') {
        return <CoverLetterBuilderView />;
      }

      // 8. Productivity & Business Generators
      const productivityToolIds = [
        'invoice-generator',
        'quotation-generator',
        'contract-generator',
        'certificate-maker',
        'id-card-maker',
        'qr-code-generator',
        'barcode-generator',
        'text-to-speech',
      ];
      if (productivityToolIds.includes(toolId)) {
        return <ProductivityGeneratorsView initialToolId={toolId} />;
      }
    }

    // 8. Static Pages
    if (currentRoute === '/about') return <AboutPage />;
    if (currentRoute === '/contact') return <ContactPage />;
    if (currentRoute === '/privacy-policy' || currentRoute === '/privacy') return <PrivacyPolicyPage />;
    if (currentRoute === '/terms' || currentRoute === '/terms-of-service') return <TermsPage />;
    if (currentRoute === '/disclaimer') return <DisclaimerPage />;
    if (currentRoute === '/faq') return <FAQPage />;
    if (currentRoute === '/guides') return <GuidesPage onSelectTool={handleNavigate} />;

    // 9. 404 Fallback
    return (
      <div className="w-full max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page or Tool Not Found</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The document tool or URL you requested does not exist or has moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleNavigate('/')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </button>
          <button
            onClick={() => handleNavigate('/tools')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Browse All Tools
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1220] dark:text-slate-100 transition-colors selection:bg-[#2563EB] selection:text-white">
      {/* Dynamic SEO metadata updater */}
      <SEOHead currentRoute={currentRoute} />

      {/* Navigation Top Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Command Palette Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleNavigate}
      />

      {/* XML Sitemap Inspector Modal */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
      />
    </div>
  );
}
