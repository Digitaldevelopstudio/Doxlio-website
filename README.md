# Doxlio starter website

A responsive, static website starter for an all-in-one document tools project.

## Working in this starter
- Text to PDF
- Text to PNG image
- Image to text (OCR; language data/library loaded from a third party)
- Image resize/compress/export as JPG or PNG
- Image to PDF
- Search and category filters
- Responsive landing page and tool workspace

## Planned placeholders (not yet working)
PDF to Text, Word to PDF, CV & Cover Letter Builder. These are clearly labelled as planned in the UI.

## Upload to GitHub Pages
1. Create a **new repository just for Doxlio**, for example `doxlio-website`.
2. For a GitHub Free account, make the repository public if you want to use GitHub Pages.
3. Upload `index.html`, `styles.css`, `app.js`, `robots.txt`, and `README.md` from this folder to the repository root. You can also upload the complete folder contents using GitHub's web interface.
4. Open **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
6. Wait for the published URL to appear on the Pages screen. It will usually be `https://YOUR-USERNAME.github.io/doxlio-website/`.
7. Open the URL on a phone and laptop and test each available tool.

## Important limitations
- This is a front-end starter, not a complete 28-tool production platform.
- It uses CDN libraries for PDF generation and OCR, so an internet connection is needed for those features.
- OCR runs in the browser and language files may take time to load. Tesseract.js does not directly support PDF OCR; OCR of PDFs needs a PDF-to-image rendering step.
- Word conversion, PDF merge/split/compression, AI tools, CV builder, accounts, subscriptions, ads, analytics, and backend APIs are not implemented yet.
- Do not put secret API keys in frontend JavaScript. Any paid AI API should be called through a backend.
- Before public launch, replace `hello@example.com`, add a real privacy policy/contact page, test outputs on multiple devices, and review third-party library licences and privacy.
- GitHub Pages is best for static prototypes. GitHub documents restrictions for sites primarily directed at running a business or commercial SaaS. Before monetizing this service, review current GitHub Pages terms and consider a static host/backend architecture suitable for a commercial service.
- Do not add a custom domain until you have purchased and verified it. When ready, configure the domain in GitHub Pages Settings and follow your registrar's DNS instructions.
