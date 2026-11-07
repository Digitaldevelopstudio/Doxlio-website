# Doxlio
Full-stack document platform: React + Vite frontend, Express backend (`server.ts`).

## Deploy on Render
1. Push this folder to your GitHub repo (`Digitaldevelopstudio/Doxlio-website`).
2. Render -> New -> Blueprint (uses `render.yaml`) or Web Service: Build `npm install --include=dev && npm run build`, Start `npm start`.
3. Add environment variable `GEMINI_API_KEY` (AI tools). Without it only AI tools show a clear error.
4. Check `https://YOUR-APP.onrender.com/api/health`.
The site is served from the domain root, so no base-path setup is needed.

## Local
`npm install` then `npm run dev` (http://localhost:3000). Production: `npm run build && npm start`.

## GitHub Pages
Not suitable: it cannot run `server.ts` (AI). If you only want the static part, build with `VITE_BASE_PATH=/Doxlio-website/`.

## Scanner
`public/scanner.html` is a standalone page (camera, 8-handle crop, perspective warp, 8 filters, multi-page, PDF/print/JPG, OCR) embedded by `ScannerView.tsx`.

## OCR
Real Tesseract.js (loaded from a CDN on first use) in the scanner, image-to-text and scanner export.
