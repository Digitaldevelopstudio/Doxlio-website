DOXLIO DOCUMENT SCANNER — CAMSCANNER-STYLE WORKFLOW UPDATE

This patch updates ONLY these files:
- tools/document-scanner.html
- assets/tools.js
- assets/style.css

What changed:
1. Camera opens as a full-screen scanner view (not a half-height card), with rear-camera preference, shutter, gallery shortcut, page button, and a capture flash animation.
2. Captured/imported image opens in a dedicated crop screen.
3. Four draggable corner handles can be moved by finger on mobile or mouse on desktop.
4. Auto detect edges button uses OpenCV.js from docs.opencv.org when available. If detection fails or the CDN is unavailable, move the four corners manually.
5. Next performs a perspective transform to straighten the selected quadrilateral into a rectangular page, then applies Original/Lighten/Enhance/B&W/Grayscale plus brightness and contrast.
6. Scanned pages appear as document previews with page thumbnails and remove controls; multiple pages can be captured/imported sequentially and exported as one PDF.
7. OCR remains browser-side using Tesseract.js English data. It produces editable text, but recognition accuracy depends on focus, lighting, font and page quality. OCR is not guaranteed to be exact; proofread before use.
8. Flash/torch is enabled only on devices whose camera exposes torch support.

UPLOAD:
1. Back up the current GitHub repository first.
2. Extract this ZIP.
3. Replace the three files at the exact same paths in your repository root.
4. Commit changes and wait for GitHub Pages to publish.
5. Open the scanner on HTTPS, allow camera permission, and test on both mobile and desktop.

IMPORTANT LIMITATIONS / TESTS:
- OpenCV.js is a large third-party CDN download and auto-edge detection depends on that CDN loading and the document having clear edges. Manual corner adjustment remains available.
- Perspective correction is applied after the user confirms the four corners; this is not a guarantee of automatic CamScanner-equivalent detection.
- Tesseract OCR here uses English only. Urdu/Arabic OCR language packs and their accuracy are not included in this patch.
- Camera access requires HTTPS and permission. Some browsers/devices may not support torch.
- JavaScript syntax was checked with Node. Real device camera, touch, OpenCV detection, OCR and PDF export still need live testing on the deployed GitHub Pages site.
- assets/tools.js and assets/style.css are shared by other tools. Keep the backup and test the other tools after replacing them.
