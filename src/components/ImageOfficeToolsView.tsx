import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Minimize, 
  Maximize2, 
  FileSearch, 
  Wand2, 
  ArrowRightLeft, 
  Edit3, 
  Table, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  AlertCircle,
  FileText,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { imageToCanvas, extractOcrText } from '../utils/cvEngine';
import { downloadFile } from '../utils/pdfEngine';
import { jsPDF } from 'jspdf';

interface ImageOfficeToolsViewProps {
  initialToolId?: string;
}

export const ImageOfficeToolsView: React.FC<ImageOfficeToolsViewProps> = ({ 
  initialToolId = 'image-compressor' 
}) => {
  const [activeTool, setActiveTool] = useState(initialToolId);

  // Common file states
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileCanvas, setFileCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Image Compressor
  const [quality, setQuality] = useState(0.75);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number>(0);

  // Image Resizer
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // OCR Image to Text
  const [extractedText, setExtractedText] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Background Remover
  const [bgRemovedUrl, setBgRemovedUrl] = useState('');

  // Rich Text Document Editor
  const [editorTitle, setEditorTitle] = useState('Meeting Notes & Project Brief');
  const [editorContent, setEditorContent] = useState(
`Executive Overview
The quarterly objectives have been achieved ahead of schedule.

Key Milestones:
• Document security compliance audit completed
• Client-side optical pipeline launched with zero data logging
• System response latency under 120ms

Action Items:
1. Distribute signed agreement to stakeholders
2. Finalize internationalized translation documentation`
  );

  // Spreadsheet CSV Viewer
  const [csvData, setCsvData] = useState<string[][]>([
    ['Item', 'Category', 'Units', 'Unit Price ($)', 'Total ($)'],
    ['Executive Desk', 'Furniture', '2', '450.00', '900.00'],
    ['Monitor 27-inch', 'Electronics', '4', '280.00', '1120.00'],
    ['Ergonomic Chair', 'Furniture', '3', '320.00', '960.00'],
    ['Mechanical Keyboard', 'Accessories', '5', '85.00', '425.00'],
  ]);
  const [csvSearch, setCsvSearch] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (selected.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const url = evt.target?.result as string;
        setFileDataUrl(url);
        const canvas = await imageToCanvas(url);
        setFileCanvas(canvas);
        setResizeWidth(canvas.width);
        setResizeHeight(canvas.height);
        setAspectRatio(canvas.width / canvas.height);

        // Precompute initial compression
        updateCompression(canvas, quality);
      };
      reader.readAsDataURL(selected);
    } else if (selected.name.endsWith('.csv') || selected.type.includes('csv')) {
      const text = await selected.text();
      parseCSVText(text);
    }
  };

  const updateCompression = (canvas: HTMLCanvasElement, q: number) => {
    const compUrl = canvas.toDataURL('image/jpeg', q);
    setCompressedDataUrl(compUrl);
    // Rough estimate of byte length from base64
    const approxBytes = Math.round((compUrl.length - 23) * 0.75);
    setCompressedSize(approxBytes);
  };

  const parseCSVText = (rawText: string) => {
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const rows = lines.map((line) => line.split(',').map((cell) => cell.trim().replace(/^["']|["']$/g, '')));
    if (rows.length > 0) {
      setCsvData(rows);
      setSuccessMessage(`Loaded ${rows.length} rows from CSV file.`);
    }
  };

  // 1. Download Compressed Image
  const handleDownloadCompressed = () => {
    if (!compressedDataUrl) return;
    downloadFile(compressedDataUrl, 'Doxlio_Compressed_Image.jpg', 'image/jpeg');
    setSuccessMessage('Compressed image downloaded successfully!');
  };

  // 2. Resize Image
  const handleResize = () => {
    if (!fileCanvas) return;
    const canvas = document.createElement('canvas');
    canvas.width = resizeWidth;
    canvas.height = resizeHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(fileCanvas, 0, 0, resizeWidth, resizeHeight);
    const resizedUrl = canvas.toDataURL('image/png');
    downloadFile(resizedUrl, `Doxlio_Resized_${resizeWidth}x${resizeHeight}.png`, 'image/png');
    setSuccessMessage('Resized image downloaded successfully!');
  };

  // 3. OCR Image to Text
  const handleExtractOcr = async () => {
    if (!fileCanvas) {
      setErrorMessage('Please upload an image file first.');
      return;
    }
    setIsProcessing(true);
    try {
      const text = await extractOcrText(fileCanvas);
      setExtractedText(text);
      setSuccessMessage('Text extracted successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'OCR failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Background Remover (Client-Side Luminance & Alpha thresholding)
  const handleRemoveBackground = () => {
    if (!fileCanvas) {
      setErrorMessage('Please upload an image first.');
      return;
    }
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = fileCanvas.width;
      canvas.height = fileCanvas.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(fileCanvas, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample 4 corners to estimate background color
      const sampleIndices = [0, (canvas.width - 1) * 4, (canvas.height - 1) * canvas.width * 4];
      let bgR = 0, bgG = 0, bgB = 0;
      sampleIndices.forEach((idx) => {
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR = Math.round(bgR / sampleIndices.length);
      bgG = Math.round(bgG / sampleIndices.length);
      bgB = Math.round(bgB / sampleIndices.length);

      const threshold = 40;
      for (let i = 0; i < data.length; i += 4) {
        const diff = Math.hypot(data[i] - bgR, data[i + 1] - bgG, data[i + 2] - bgB);
        if (diff < threshold) {
          data[i + 3] = 0; // Transparent
        } else if (diff < threshold + 20) {
          data[i + 3] = Math.round(((diff - threshold) / 20) * 255); // Feathered
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const resultUrl = canvas.toDataURL('image/png');
      setBgRemovedUrl(resultUrl);
      downloadFile(resultUrl, 'Doxlio_Transparent_Background.png', 'image/png');
      setSuccessMessage('Background removed and transparent PNG downloaded!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Background removal error.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Convert PNG to JPG / JPG to PNG
  const handleConvertFormat = (targetFormat: 'image/jpeg' | 'image/png') => {
    if (!fileCanvas) {
      setErrorMessage('Please upload an image first.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = fileCanvas.width;
    canvas.height = fileCanvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(fileCanvas, 0, 0);

    const ext = targetFormat === 'image/jpeg' ? 'jpg' : 'png';
    const convertedUrl = canvas.toDataURL(targetFormat, 0.95);
    downloadFile(convertedUrl, `Doxlio_Converted.${ext}`, targetFormat);
    setSuccessMessage(`Converted successfully to .${ext}!`);
  };

  // 6. Export Word Document to PDF
  const handleExportEditorPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(editorTitle || 'Document', 40, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(editorContent, doc.internal.pageSize.getWidth() - 80);
    doc.text(split, 40, 85);

    const pdfBuffer = new Uint8Array(doc.output('arraybuffer'));
    downloadFile(pdfBuffer, `${(editorTitle || 'Document').replace(/\s+/g, '_')}.pdf`);
    setSuccessMessage('Exported document as high-quality PDF!');
  };

  const toolsList = [
    { id: 'image-compressor', name: 'Image Compressor', icon: Minimize },
    { id: 'image-resizer', name: 'Image Resizer', icon: Maximize2 },
    { id: 'ocr-image-to-text', name: 'OCR Photo to Text', icon: FileSearch },
    { id: 'background-remover', name: 'Background Remover', icon: Wand2 },
    { id: 'png-to-jpg', name: 'PNG ↔ JPG Converter', icon: ArrowRightLeft },
    { id: 'word-editor', name: 'Document & Word Editor', icon: Edit3 },
    { id: 'excel-viewer', name: 'CSV & Spreadsheet Viewer', icon: Table },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Doxlio Tools</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Image & Office Tools</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Image Processing & Office Suite
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          High-performance in-browser compression, OCR, background removal, and rich document editing.
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {toolsList.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                setSuccessMessage(null);
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                activeTool === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: File Upload Panel (hidden for word-editor) */}
        {activeTool !== 'word-editor' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                Upload Input File
              </h3>

              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeTool === 'excel-viewer' ? 'Upload CSV File' : 'Upload Image (JPG, PNG, WebP)'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  100% processed locally on your machine
                </span>
                <input
                  type="file"
                  accept={activeTool === 'excel-viewer' ? '.csv,text/csv' : 'image/*'}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900 dark:text-white truncate">
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Original Size:</span>
                    <span className="font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  {fileCanvas && (
                    <div className="flex justify-between text-slate-500">
                      <span>Dimensions:</span>
                      <span className="font-mono">{fileCanvas.width} × {fileCanvas.height} px</span>
                    </div>
                  )}
                </div>
              )}

              {fileDataUrl && activeTool !== 'excel-viewer' && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-2 flex items-center justify-center max-h-48">
                  <img
                    src={fileDataUrl}
                    alt="File Preview"
                    className="max-h-44 object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Workspace / Active Tool Controls */}
        <div className={activeTool === 'word-editor' ? 'lg:col-span-3' : 'lg:col-span-2'}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Feedback notifications */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-xs bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. IMAGE COMPRESSOR */}
            {activeTool === 'image-compressor' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Image Compressor</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reduce JPG/PNG file sizes drastically without sacrificing perceptible clarity.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    <span>Quality Level:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.95"
                    step="0.05"
                    value={quality}
                    onChange={(e) => {
                      const q = parseFloat(e.target.value);
                      setQuality(q);
                      if (fileCanvas) updateCompression(fileCanvas, q);
                    }}
                    className="w-full accent-blue-600"
                  />
                </div>

                {compressedSize > 0 && file && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block">Original Size:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Compressed Output:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {(compressedSize / 1024).toFixed(1)} KB (-{Math.max(0, Math.round((1 - compressedSize / file.size) * 100))}%)
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownloadCompressed}
                  disabled={!compressedDataUrl}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed Image
                </button>
              </div>
            )}

            {/* 2. IMAGE RESIZER */}
            {activeTool === 'image-resizer' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Image Resizer</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Scale images to exact pixel dimensions with aspect ratio protection.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400">Width (pixels):</label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => {
                        const w = parseInt(e.target.value) || 1;
                        setResizeWidth(w);
                        if (lockAspect) setResizeHeight(Math.round(w / aspectRatio));
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400">Height (pixels):</label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => {
                        const h = parseInt(e.target.value) || 1;
                        setResizeHeight(h);
                        if (lockAspect) setResizeWidth(Math.round(h * aspectRatio));
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Dimension Presets */}
                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Dimension Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Instagram Square (1080×1080)', w: 1080, h: 1080 },
                      { label: 'Passport Photo (600×600)', w: 600, h: 600 },
                      { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
                      { label: 'Avatar / Icon (512×512)', w: 512, h: 512 },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setResizeWidth(p.w);
                          setResizeHeight(p.h);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px]"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleResize}
                  disabled={!fileCanvas}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  Resize & Download Image
                </button>
              </div>
            )}

            {/* 3. OCR PHOTO TO TEXT */}
            {activeTool === 'ocr-image-to-text' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">OCR Image to Text</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recognize and extract printed text from photos, documents, and screenshots.</p>
                </div>

                <button
                  onClick={handleExtractOcr}
                  disabled={isProcessing || !fileCanvas}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <FileSearch className="w-4 h-4" />
                  {isProcessing ? 'Analyzing Image & Optical OCR...' : 'Extract Text from Image'}
                </button>

                {extractedText && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Extracted Document Text:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(extractedText);
                          setCopiedText(true);
                          setTimeout(() => setCopiedText(false), 2000);
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedText ? 'Copied!' : 'Copy to Clipboard'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={extractedText}
                      className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 resize-none focus:outline-none"
                    />
                    <button
                      onClick={() => downloadFile(extractedText, 'Doxlio_OCR_Result.txt', 'text/plain')}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download as .txt
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. BACKGROUND REMOVER */}
            {activeTool === 'background-remover' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Background Remover</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Client-side color boundary cutout to produce clean transparent PNGs.
                  </p>
                </div>

                <button
                  onClick={handleRemoveBackground}
                  disabled={isProcessing || !fileCanvas}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  {isProcessing ? 'Isolating Background...' : 'Remove Background & Download PNG'}
                </button>
              </div>
            )}

            {/* 5. FORMAT CONVERTER */}
            {activeTool === 'png-to-jpg' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Format Converter (PNG ↔ JPG)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Convert between lossless PNG and lightweight JPG formats.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleConvertFormat('image/jpeg')}
                    disabled={!fileCanvas}
                    className="py-3 px-4 rounded-xl border border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition-colors"
                  >
                    Convert to JPG
                  </button>
                  <button
                    onClick={() => handleConvertFormat('image/png')}
                    disabled={!fileCanvas}
                    className="py-3 px-4 rounded-xl border border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
                  >
                    Convert to PNG
                  </button>
                </div>
              </div>
            )}

            {/* 6. WORD & DOCUMENT EDITOR */}
            {activeTool === 'word-editor' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Online Document & Word Editor</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Write, draft, and format documents with instant PDF and text export.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportEditorPDF}
                      className="px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export to PDF
                    </button>
                    <button
                      onClick={() => downloadFile(editorContent, `${editorTitle}.txt`, 'text/plain')}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Export Text
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Document Title"
                    className="w-full text-base font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                  <textarea
                    rows={12}
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Type your document content here..."
                    className="w-full p-4 text-xs font-sans rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 7. CSV & SPREADSHEET VIEWER */}
            {activeTool === 'excel-viewer' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Spreadsheet & CSV Viewer</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Inspect, filter, and review tabular datasets without desktop spreadsheet software.</p>
                  </div>
                  <input
                    type="text"
                    value={csvSearch}
                    onChange={(e) => setCsvSearch(e.target.value)}
                    placeholder="Filter rows..."
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 max-w-xs"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-80">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                        {csvData[0]?.map((header, i) => (
                          <th key={i} className="p-2.5 whitespace-nowrap">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {csvData
                        .slice(1)
                        .filter((row) => !csvSearch || row.some((cell) => cell.toLowerCase().includes(csvSearch.toLowerCase())))
                        .map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 whitespace-nowrap font-mono">{cell}</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => {
                    const csvContent = csvData.map((r) => r.join(',')).join('\n');
                    downloadFile(csvContent, 'Doxlio_Exported_Sheet.csv', 'text/csv');
                    setSuccessMessage('Clean CSV downloaded!');
                  }}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Clean CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
