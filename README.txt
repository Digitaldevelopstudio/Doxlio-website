DOXLIO DOCUMENT SCANNER UPDATE v3

This patch updates ONLY the Document Scanner page and its shared assets.
Files:
- tools/document-scanner.html
- assets/tools.js
- assets/style.css

Before upload:
1. Back up your GitHub repository.
2. Extract this ZIP.
3. Replace the three files at the same paths in the repository.
4. Commit changes and test on HTTPS on mobile and desktop.

Changes:
- Direct crop selection overlay on the image: drag the box to move it and drag corner handles to resize (touch + mouse Pointer Events).
- Scan capture shows a short scanning overlay before the captured page opens in the editor.
- Apply crop/filter creates the actual cropped image used by preview, image download, OCR and PDF.
- OCR uses page-segmentation mode 6, 300 DPI hint, and line-based output when available.

Limitations:
- This is manual crop selection, not automatic document-edge detection or perspective correction.
- OCR still depends on Tesseract language data and image quality. Urdu/Arabic language packs may be large or unavailable from the CDN; validate with real samples before relying on results.
- JavaScript syntax was checked with Node. Live camera, touch hardware, PDF rendering and OCR accuracy have NOT been end-to-end tested in your GitHub Pages deployment.
- assets/tools.js and assets/style.css are shared by other tools; retain your backup in case another tool's styling or behavior changes.
