(() => {
  const $ = (id) => document.getElementById(id);
  const toast = (message) => {
    const el = $("toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
  };
  $("year").textContent = new Date().getFullYear();

  const toolButtons = document.querySelectorAll("[data-open]");
  const panes = document.querySelectorAll(".tool-pane");
  const welcome = $("workspace-welcome");
  const title = $("workspace-title");
  const subtitle = $("workspace-subtitle");
  const toolTitles = {
    "text-pdf": ["Text to PDF", "Create a downloadable PDF from text."],
    "text-image": ["Text to Image", "Create a PNG image from your text."],
    "ocr": ["Image to Text (OCR)", "Extract text from an image using OCR."],
    "image-resize": ["Image Resizer & Compressor", "Resize and export an image."],
    "image-pdf": ["Image to PDF", "Create a PDF from one image."]
  };
  function openTool(name) {
    if (!toolTitles[name]) return;
    welcome.hidden = true;
    panes.forEach(p => p.hidden = true);
    $("pane-" + name).hidden = false;
    title.textContent = toolTitles[name][0];
    subtitle.textContent = toolTitles[name][1] + " Processing happens locally where supported.";
    $("workspace").scrollIntoView({behavior:"smooth", block:"start"});
  }
  toolButtons.forEach(btn => btn.addEventListener("click", () => openTool(btn.dataset.open)));
  document.querySelectorAll("[data-planned]").forEach(btn => btn.addEventListener("click", () => toast(btn.dataset.planned + " is planned for a future release.")));

  const search = $("tool-search");
  let activeFilter = "all";
  function filterTools() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll(".tool-card").forEach(card => {
      const categories = card.dataset.category.split(" ");
      const match = (!query || (card.dataset.search + " " + card.textContent).toLowerCase().includes(query))
        && (activeFilter === "all" || categories.includes(activeFilter));
      card.hidden = !match; if (match) shown++;
    });
    $("empty-state").hidden = shown !== 0;
  }
  search.addEventListener("input", filterTools);
  document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b === btn));
    filterTools();
  }));

  function safeName(value, fallback) {
    const clean = (value || "").trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 70);
    return clean || fallback;
  }
  function status(id, message, kind="") {
    const el = $(id); el.textContent = message; el.className = "status" + (kind ? " " + kind : "");
  }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) return reject(new Error("Please choose a valid image file."));
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not open this image.")); };
      img.src = url;
    });
  }
  function canvasBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not create the output file.")), type, quality));
  }

  $("make-pdf").addEventListener("click", () => {
    const text = $("pdf-text").value.trim();
    if (!text) return status("pdf-status", "Please enter some text first.", "error");
    if (!window.jspdf || !window.jspdf.jsPDF) return status("pdf-status", "PDF library did not load. Check your internet connection and try again.", "error");
    try {
      const { jsPDF } = window.jspdf; const doc = new jsPDF({unit:"mm", format:"a4"});
      const lines = doc.splitTextToSize(text, 175);
      let y = 20;
      lines.forEach(line => { if (y > 280) { doc.addPage(); y = 20; } doc.text(line, 17, y); y += 7; });
      doc.save(safeName($("pdf-filename").value, "my-document") + ".pdf");
      status("pdf-status", "Your PDF download should begin now.", "success");
    } catch (e) { status("pdf-status", "Could not create the PDF: " + e.message, "error"); }
  });

  $("make-text-image").addEventListener("click", () => {
    const text = $("image-text").value.trim();
    if (!text) return status("text-image-status", "Please enter some text first.", "error");
    const [w,h] = $("text-image-size").value.split("x").map(Number);
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d"); ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,w,h);
    const pad = Math.round(w * .09); const maxWidth = w - pad*2; let fontSize = Math.min(52, Math.round(w/22));
    ctx.fillStyle = "#17233e"; ctx.textBaseline = "top";
    function wrapLines(size) {
      ctx.font = `600 ${size}px Arial, sans-serif`; const result = [];
      text.split(/\n/).forEach(paragraph => {
        if (!paragraph) { result.push(""); return; }
        let line = "";
        paragraph.split(/\s+/).forEach(word => {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > maxWidth && line) { result.push(line); line = word; } else line = test;
        });
        result.push(line);
      });
      return result;
    }
    let lines = wrapLines(fontSize);
    while (lines.length * fontSize * 1.5 > h - pad*2 && fontSize > 16) { fontSize -= 2; lines = wrapLines(fontSize); }
    ctx.font = `600 ${fontSize}px Arial, sans-serif`; ctx.fillStyle = "#17233e";
    const lineHeight = fontSize * 1.5; const totalHeight = lines.length * lineHeight;
    let y = Math.max(pad, (h-totalHeight)/2);
    lines.forEach(line => { ctx.fillText(line, pad, y, maxWidth); y += lineHeight; });
    canvas.toBlob(blob => {
      if (!blob) return status("text-image-status", "Could not create image.", "error");
      downloadBlob(blob, "doxlio-text-image.png"); status("text-image-status", "PNG created and downloaded.", "success");
    }, "image/png");
  });

  $("quality-value").textContent = $("resize-quality").value + "%";
  $("resize-quality").addEventListener("input", () => $("quality-value").textContent = $("resize-quality").value + "%");
  $("resize-image").addEventListener("click", async () => {
    const file = $("resize-file").files[0];
    if (!file) return status("resize-status", "Choose an image first.", "error");
    status("resize-status", "Processing image…");
    try {
      const img = await loadImage(file);
      let w = parseInt($("resize-width").value, 10); let h = parseInt($("resize-height").value, 10);
      if (!w && !h) { w = img.naturalWidth; h = img.naturalHeight; }
      else if (w && !h) h = Math.round(img.naturalHeight * w / img.naturalWidth);
      else if (!w && h) w = Math.round(img.naturalWidth * h / img.naturalHeight);
      if (!w || !h || w > 6000 || h > 6000) throw new Error("Choose dimensions from 1 to 6000 pixels.");
      const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if ($("resize-format").value === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0,0,w,h); }
      ctx.drawImage(img, 0, 0, w, h);
      const type = $("resize-format").value; const quality = Number($("resize-quality").value)/100;
      const blob = await canvasBlob(canvas, type, quality);
      downloadBlob(blob, safeName(file.name.replace(/\.[^.]+$/, ""), "image") + (type === "image/png" ? ".png" : ".jpg"));
      status("resize-status", `Done: ${w} × ${h} pixels.`, "success");
    } catch (e) { status("resize-status", e.message || "Could not process image.", "error"); }
  });

  $("make-image-pdf").addEventListener("click", async () => {
    const file = $("image-pdf-file").files[0];
    if (!file) return status("image-pdf-status", "Choose an image first.", "error");
    if (!window.jspdf || !window.jspdf.jsPDF) return status("image-pdf-status", "PDF library did not load. Check your connection.", "error");
    status("image-pdf-status", "Creating PDF…");
    try {
      const img = await loadImage(file);
      const {jsPDF} = window.jspdf;
      const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
      const doc = new jsPDF({orientation, unit:"mm", format:"a4"});
      const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight(), margin = 8;
      const ratio = Math.min((pageW-margin*2)/img.naturalWidth, (pageH-margin*2)/img.naturalHeight);
      const w = img.naturalWidth*ratio, h = img.naturalHeight*ratio;
      const canvas = document.createElement("canvas"); canvas.width=img.naturalWidth; canvas.height=img.naturalHeight;
      canvas.getContext("2d").drawImage(img,0,0);
      const data = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", .92);
      doc.addImage(data, file.type === "image/png" ? "PNG" : "JPEG", (pageW-w)/2, (pageH-h)/2, w, h);
      doc.save(safeName($("image-pdf-name").value, "image-document")+".pdf");
      status("image-pdf-status", "PDF created and downloaded.", "success");
    } catch(e) { status("image-pdf-status", e.message || "Could not create PDF.", "error"); }
  });

  $("run-ocr").addEventListener("click", async () => {
    const file = $("ocr-file").files[0];
    if (!file) return status("ocr-status", "Choose an image first.", "error");
    if (!window.Tesseract) return status("ocr-status", "OCR library did not load. Check your connection and try again.", "error");
    const lang = $("ocr-language").value;
    status("ocr-status", "Loading OCR engine and language data… This may take a moment.");
    $("run-ocr").disabled = true;
    try {
      const worker = await window.Tesseract.createWorker(lang, 1, {logger: m => {
        if (m.status === "recognizing text") status("ocr-status", `Recognizing text… ${Math.round((m.progress || 0)*100)}%`);
        else if (m.status) status("ocr-status", m.status + "…");
      }});
      const result = await worker.recognize(file);
      await worker.terminate();
      $("ocr-result").value = (result.data.text || "").trim();
      status("ocr-status", $("ocr-result").value ? "Text extraction complete." : "No readable text found. Try a clearer image.", $("ocr-result").value ? "success" : "error");
    } catch(e) { status("ocr-status", "OCR failed: " + (e.message || "Please try another image."), "error"); }
    finally { $("run-ocr").disabled = false; }
  });
  $("copy-ocr").addEventListener("click", async () => {
    const value = $("ocr-result").value;
    if (!value) return toast("There is no extracted text to copy.");
    try { await navigator.clipboard.writeText(value); toast("Text copied."); }
    catch(e) { $("ocr-result").select(); document.execCommand("copy"); toast("Text copied if clipboard permission was granted."); }
  });
  $("download-ocr").addEventListener("click", () => {
    const value = $("ocr-result").value;
    if (!value) return toast("There is no extracted text to download.");
    downloadBlob(new Blob([value], {type:"text/plain;charset=utf-8"}), "doxlio-extracted-text.txt");
  });
})();