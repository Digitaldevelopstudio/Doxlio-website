import React from 'react';

/**
 * Doxlio Document Scanner.
 * The scanner is a self-contained page (public/scanner.html): camera, 8-handle crop,
 * perspective correction, filters, multi-page review, PDF/JPG export and OCR.
 */
export function ScannerView() {
  const src = `${import.meta.env.BASE_URL}scanner.html`;
  return (
    <div className="w-full" style={{ height: 'calc(100vh - 72px)', minHeight: 560 }}>
      <iframe
        title="Doxlio Document Scanner"
        src={src}
        allow="camera; fullscreen; clipboard-write"
        className="w-full h-full border-0"
      />
    </div>
  );
}

export default ScannerView;
