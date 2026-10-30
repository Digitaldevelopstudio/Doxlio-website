Doxlio Resume Builder patch

Included files:
- tools/resume-builder.html (the page entry)
- assets/tools.js (shared tool logic; resume-builder branch updated)
- assets/style.css (shared styling; resume contact/photo controls improved)

Upload instructions:
1. Back up the GitHub repository first.
2. Replace only the matching files at the same paths.
3. Commit and test Resume Builder on mobile.

Important: assets/tools.js and assets/style.css are shared by multiple tools. The changes are scoped to the resume builder, but back up first. This patch removes the photo-count selector and supports one profile photo with drag-to-adjust crop and sliders. PDF export is still browser-generated; test the resulting PDF on your own device before relying on it.
