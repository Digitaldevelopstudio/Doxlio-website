DOXLIO: Resume Builder + Document Scanner patch

Files to replace in the repository:
- tools/resume-builder.html
- tools/document-scanner.html
- assets/tools.js
- assets/style.css

Important: assets/tools.js and assets/style.css are shared by other tools, so make a backup first. This patch adds OCR language choices (including Arabic and Urdu) to the scanner OCR control and improves resume photo size and contact-field presentation. OCR accuracy still depends on trained language data, scan quality, and the browser/CDN. Automatic perspective correction is not included.

After uploading, test: resume photo from camera/gallery, photo size and shape, preview and PDF; scanner camera/import, crop sliders, filters, PDF, OCR in English/Arabic/Urdu. This patch has JavaScript syntax checked but has not been tested on your live GitHub Pages site or on physical mobile devices.
