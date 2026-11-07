import { useEffect } from 'react';
import { ALL_TOOLS } from '../utils/toolsData';

interface SEOHeadProps {
  currentRoute: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ currentRoute }) => {
  useEffect(() => {
    let title = 'Doxlio – Every document. One smart place.';
    let description = 'Doxlio is a free, privacy-first all-in-one document productivity suite. Scan documents with auto-crop, edit and merge PDFs, run OCR, convert files, and leverage AI analysis. No sign-up required.';

    if (currentRoute === '/tools') {
      title = 'All Document Tools – Doxlio';
      description = 'Explore 40+ free document productivity tools including mobile scanner, PDF merger, splitter, OCR, image converters, and AI analysis.';
    } else if (currentRoute === '/about') {
      title = 'About Us – Doxlio Document Productivity';
      description = 'Learn about Doxlio’s zero-upload client-side privacy architecture and our mission to provide universal document productivity without fees.';
    } else if (currentRoute === '/contact') {
      title = 'Contact Us – Doxlio';
      description = 'Get in touch with the Doxlio engineering and support team. Send inquiries, feedback, or report issues.';
    } else if (currentRoute === '/faq') {
      title = 'Frequently Asked Questions – Doxlio';
      description = 'Answers to common questions regarding Doxlio document scanning, client-side memory privacy, PDF security, and AI capabilities.';
    } else if (currentRoute === '/guides') {
      title = 'Document Guides & Tutorials – Doxlio';
      description = 'Guides on mobile document scanning techniques, PDF encryption, ATS-optimized resumes, and OCR accuracy.';
    } else if (currentRoute === '/tool/resume-builder') {
      title = 'Professional Resume & CV Builder – Doxlio | Free ATS Templates & PDF Export';
      description = 'Build professional, ATS-compliant resumes with photo upload, positioning, 3 modern templates, live preview, and A4 PDF export. Free — no sign-up required.';
    } else if (currentRoute === '/tool/cover-letter-builder') {
      title = 'Professional Cover Letter Builder – Doxlio | Free Templates, AI Drafting & PDF';
      description = 'Create tailored, beautifully formatted cover letters with live preview, AI assistance via Gemini 3.8, and A4 PDF export. Free to use.';
    } else if (currentRoute.startsWith('/tool/')) {
      const toolId = currentRoute.replace('/tool/', '');
      const tool = ALL_TOOLS.find((t) => t.id === toolId);
      if (tool) {
        title = `${tool.name} – Free Online Document Tool | Doxlio`;
        description = `${tool.tagline}. ${tool.description} Free to use — no sign-up required.`;
      }
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG title & description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, [currentRoute]);

  return null;
};
