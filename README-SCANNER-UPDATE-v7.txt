DOXLIO SCANNER UPDATE v7
Replace these three files in your GitHub repo:
- tools/document-scanner.html
- assets/tools.js
- assets/style.css
Backup first. Update includes six touch/mouse handles (4 corners + 2 side handles) and a single rotate button. Auto edge detection still depends on OpenCV.js CDN loading and cannot guarantee detection on every photo; manually adjust if it fails. Please test camera, crop, rotation and PDF export on phone and desktop before production.
