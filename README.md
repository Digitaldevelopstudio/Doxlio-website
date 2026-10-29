# Doxlio multi-page website package

Includes 14 dedicated tool pages, 8 article pages, shared CSS/JavaScript, privacy/terms/contact pages, robots.txt and a sitemap listing 26 URLs.

## Upload
1. Extract this ZIP.
2. Open the existing Doxlio-website GitHub repository.
3. First use Code → Download ZIP to back up your current version.
4. Upload all extracted files and folders to repository root, preserving tools/, articles/ and assets/.
5. Commit changes and wait for GitHub Pages to publish.
6. Submit https://digitaldevelopstudio.github.io/Doxlio-website/sitemap.xml in Google Search Console.

## Included
Homepage, 14 tool pages, 8 guide pages, privacy/terms/contact starter pages, shared stylesheet/scripts, sitemap and robots.txt.

## Important limitations
- Contact page is a placeholder; add a real monitored contact method before launch.
- Privacy and terms are starter text; review for your business and jurisdiction.
- Tools load third-party libraries from CDNs and need internet.
- Urdu Nastaliq OCR may be inaccurate and needs real sample testing.
- PDF-to-text extracts selectable text only; scanned PDFs need OCR.
- Word-to-PDF extracts text and does not preserve complex layout/tables/images.
- PDF-to-JPG exports one page at a time. Resume and cover letter are simple text PDFs.
- Compression, searchable OCR PDFs, AI backend, accounts, payments, subscriptions and ads are not implemented.
- Never place secret API keys in frontend JavaScript.
- URLs are configured for the current GitHub Pages project URL. Update canonicals/sitemap if URL changes.
- Test all tools in-browser before calling the deployment complete.


## Version 2 update
- OCR now offers multiple language choices and tries grayscale and thresholded image variants. Recognition quality depends on the scan and language model; Urdu Nastaliq and some Arabic/Hindi fonts can still be inaccurate.
- Resume Builder now includes three layouts, optional profile photo, PDF preview, and a separate Save PDF action.
- Cover Letter Builder now includes three layouts, PDF preview, and a separate Save PDF action.
- Homepage cards use small custom SVG illustrations; policy, contact, and guide pages include a visual banner.
- This is a static GitHub Pages site. Test each tool after deployment and check the browser console if a CDN library fails to load.


## Version 4 scanner workflow
- Added a dedicated Document Scanner page with live camera capture (HTTPS permission required), image import, multi-page thumbnails, page ordering/removal, crop sliders, rotate, brightness/contrast filters, multi-page PDF export, image export, and English OCR text download.
- Automatic document-corner detection and perspective correction are not included; crop is manual via percentage sliders.
- Camera access depends on browser/device permission and GitHub Pages HTTPS. Image import is the fallback.
- Resume and cover letter now use an on-page HTML preview before PDF save; the resume PDF photo layout reserves space for the profile image.
- JavaScript syntax check passed; hardware camera behavior and all exports still require live device testing.
