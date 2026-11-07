import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Layers, 
  Scissors, 
  Minimize2, 
  Image, 
  FilePlus, 
  PenTool, 
  Stamp, 
  Grid, 
  RotateCw, 
  Trash2, 
  Lock, 
  FileCode, 
  Upload, 
  Download, 
  Eye, 
  Check, 
  AlertCircle,
  Plus,
  Eraser
} from 'lucide-react';
import { 
  mergePDFs, 
  splitPDF, 
  rotatePDF, 
  deletePDFPages, 
  addWatermarkToPDF, 
  signPDF, 
  updatePDFMetadata, 
  createPDFFromImages, 
  downloadFile,
  getPDFInfo 
} from '../utils/pdfEngine';

interface PDFToolsViewProps {
  initialToolId?: string;
}

export const PDFToolsView: React.FC<PDFToolsViewProps> = ({ initialToolId = 'pdf-merger' }) => {
  const [activeTool, setActiveTool] = useState<string>(initialToolId);

  // File states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfBuffers, setPdfBuffers] = useState<ArrayBuffer[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PDF Metadata & Page Info
  const [pdfInfo, setPdfInfo] = useState<{
    pageCount: number;
    title: string;
    author: string;
    subject: string;
    keywords: string;
  } | null>(null);

  // Tool specific inputs
  const [splitPagesText, setSplitPagesText] = useState('1');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState(45);
  const [rotateAngle, setRotateAngle] = useState(90);
  const [deletePagesText, setDeletePagesText] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaAuthor, setMetaAuthor] = useState('');
  const [metaSubject, setMetaSubject] = useState('');
  const [protectPassword, setProtectPassword] = useState('');

  // Signature Pad state
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw');
  const [sigTypedName, setSigTypedName] = useState('Alex Morgan');
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigPageNumber, setSigPageNumber] = useState(1);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    setErrorMessage(null);
    setSuccessMessage(null);

    const buffers: ArrayBuffer[] = [];
    for (const f of files) {
      const buf = await f.arrayBuffer();
      buffers.push(buf);
    }
    setPdfBuffers(buffers);

    // If first file is PDF, inspect metadata
    if (buffers.length > 0 && files[0].type.includes('pdf')) {
      const info = await getPDFInfo(buffers[0]);
      setPdfInfo(info);
      setMetaTitle(info.title);
      setMetaAuthor(info.author);
      setMetaSubject(info.subject);
    }
  };

  // ----------------------------------------------------
  // TOOL ACTIONS
  // ----------------------------------------------------

  // 1. Merge PDFs
  const handleMerge = async () => {
    if (pdfBuffers.length < 2) {
      setErrorMessage('Please upload at least 2 PDF files to merge.');
      return;
    }
    try {
      setIsProcessing(true);
      const merged = await mergePDFs(pdfBuffers);
      downloadFile(merged, 'Doxlio_Merged_Document.pdf');
      setSuccessMessage('Successfully merged files into one PDF!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to merge PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Split PDF
  const handleSplit = async () => {
    if (pdfBuffers.length === 0) {
      setErrorMessage('Please upload a PDF file first.');
      return;
    }
    try {
      setIsProcessing(true);
      // Parse ranges like "1, 2-4, 6"
      const pagesToExtract: number[] = [];
      const parts = splitPagesText.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map((v) => parseInt(v.trim()));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) pagesToExtract.push(i);
          }
        } else {
          const num = parseInt(trimmed);
          if (!isNaN(num)) pagesToExtract.push(num);
        }
      }

      const uniqueSorted = Array.from(new Set(pagesToExtract)).sort((a, b) => a - b);
      if (uniqueSorted.length === 0) {
        setErrorMessage('Please enter valid page numbers to extract (e.g. 1, 2-3).');
        return;
      }

      const splitDoc = await splitPDF(pdfBuffers[0], uniqueSorted);
      downloadFile(splitDoc, `Doxlio_Split_Pages_${uniqueSorted.join('_')}.pdf`);
      setSuccessMessage(`Extracted ${uniqueSorted.length} page(s) successfully!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Add Watermark
  const handleWatermark = async () => {
    if (pdfBuffers.length === 0) {
      setErrorMessage('Please upload a PDF file to watermark.');
      return;
    }
    try {
      setIsProcessing(true);
      const watermarked = await addWatermarkToPDF(pdfBuffers[0], watermarkText, {
        opacity: watermarkOpacity,
        rotation: watermarkRotation,
      });
      downloadFile(watermarked, 'Doxlio_Watermarked_Document.pdf');
      setSuccessMessage('Watermark added to every page successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add watermark.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Rotate PDF
  const handleRotate = async () => {
    if (pdfBuffers.length === 0) {
      setErrorMessage('Please upload a PDF file to rotate.');
      return;
    }
    try {
      setIsProcessing(true);
      const rotated = await rotatePDF(pdfBuffers[0], -1, rotateAngle);
      downloadFile(rotated, 'Doxlio_Rotated_Document.pdf');
      setSuccessMessage(`Document pages rotated by ${rotateAngle}°!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to rotate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Delete Pages
  const handleDeletePages = async () => {
    if (pdfBuffers.length === 0) {
      setErrorMessage('Please upload a PDF file first.');
      return;
    }
    try {
      setIsProcessing(true);
      const toDelete = deletePagesText
        .split(',')
        .map((p) => parseInt(p.trim()))
        .filter((n) => !isNaN(n));

      if (toDelete.length === 0) {
        setErrorMessage('Please specify page numbers to remove (e.g. 2, 4).');
        return;
      }

      const trimmed = await deletePDFPages(pdfBuffers[0], toDelete);
      downloadFile(trimmed, 'Doxlio_Trimmed_Document.pdf');
      setSuccessMessage(`Pages ${toDelete.join(', ')} removed successfully!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. Sign PDF
  const handleSign = async () => {
    if (pdfBuffers.length === 0) {
      setErrorMessage('Please upload a PDF file to sign.');
      return;
    }
    try {
      setIsProcessing(true);
      let sigDataUrl = '';

      if (sigMode === 'draw') {
        const canvas = sigCanvasRef.current;
        if (!canvas) throw new Error('Signature canvas not available');
        sigDataUrl = canvas.toDataURL('image/png');
      } else {
        // Create cursive typed signature on offscreen canvas
        const offscreen = document.createElement('canvas');
        offscreen.width = 400;
        offscreen.height = 120;
        const ctx = offscreen.getContext('2d');
        if (ctx) {
          ctx.font = 'italic 38px "Plus Jakarta Sans", cursive, sans-serif';
          ctx.fillStyle = '#1e3a8a';
          ctx.fillText(sigTypedName || 'Alex Morgan', 20, 75);
          sigDataUrl = offscreen.toDataURL('image/png');
        }
      }

      const signed = await signPDF(pdfBuffers[0], sigDataUrl, {
        pageNumber: sigPageNumber,
        x: 100,
        y: 120,
        width: 180,
        height: 60,
      });

      downloadFile(signed, 'Doxlio_Signed_Document.pdf');
      setSuccessMessage('Signature applied to document page successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Update Metadata
  const handleMetadata = async () => {
    if (pdfBuffers.length === 0) {
      setErrorMessage('Please upload a PDF file.');
      return;
    }
    try {
      setIsProcessing(true);
      const updated = await updatePDFMetadata(pdfBuffers[0], {
        title: metaTitle,
        author: metaAuthor,
        subject: metaSubject,
      });
      downloadFile(updated, 'Doxlio_Updated_Metadata.pdf');
      setSuccessMessage('PDF metadata updated successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 8. Image to PDF
  const handleImageToPDF = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select image files (JPG, PNG, WebP) to convert to PDF.');
      return;
    }
    try {
      setIsProcessing(true);
      const imageItems = [];
      for (const file of selectedFiles) {
        const url = URL.createObjectURL(file);
        imageItems.push({ dataUrl: url, width: 1200, height: 1600 });
      }
      const pdf = createPDFFromImages(imageItems, 'a4');
      downloadFile(pdf, 'Doxlio_Images_Document.pdf');
      setSuccessMessage('Images combined into PDF document!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to convert images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Signature canvas drawing handlers
  const startSigDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawSig = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopSigDraw = () => {
    setIsDrawing(false);
  };

  const clearSigCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const pdfToolsNav = [
    { id: 'pdf-merger', name: 'Merge PDF', icon: Layers },
    { id: 'pdf-splitter', name: 'Split PDF', icon: Scissors },
    { id: 'sign-pdf', name: 'Sign PDF', icon: PenTool },
    { id: 'add-watermark', name: 'Watermark', icon: Stamp },
    { id: 'rotate-pdf', name: 'Rotate Pages', icon: RotateCw },
    { id: 'delete-pdf-pages', name: 'Delete Pages', icon: Trash2 },
    { id: 'jpg-to-pdf', name: 'Image to PDF', icon: FilePlus },
    { id: 'pdf-metadata-editor', name: 'Edit Metadata', icon: FileCode },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Doxlio Tools</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">PDF Tools Suite</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Complete Client-Side PDF Tools
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Merge, split, sign, rotate, and watermark documents in-memory. Zero file uploads to external servers.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {pdfToolsNav.map((t) => {
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
        {/* Left: File Upload & File Info Box */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              Select Documents
            </h3>

            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Choose PDF or Image Files
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Drag and drop or browse from device
              </span>
              <input
                type="file"
                multiple={activeTool === 'pdf-merger' || activeTool === 'jpg-to-pdf'}
                accept={activeTool === 'jpg-to-pdf' ? 'image/*' : 'application/pdf,image/*'}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Selected Files ({selectedFiles.length})
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {selectedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Metadata Summary */}
            {pdfInfo && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pages:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{pdfInfo.pageCount}</span>
                </div>
                {pdfInfo.title && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Title:</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{pdfInfo.title}</span>
                  </div>
                )}
                {pdfInfo.author && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Author:</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{pdfInfo.author}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Tool Controls Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Feedback Notifications */}
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

            {/* 1. MERGE PDF */}
            {activeTool === 'pdf-merger' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">PDF Merger</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Combine two or more PDF documents into a clean, unified file.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p>• Upload 2 or more files using the left selector.</p>
                  <p>• The files will be stitched sequentially in memory without loss of formatting.</p>
                </div>
                <button
                  onClick={handleMerge}
                  disabled={isProcessing || pdfBuffers.length < 2}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  {isProcessing ? 'Merging Documents...' : `Merge ${pdfBuffers.length} PDF Files`}
                </button>
              </div>
            )}

            {/* 2. SPLIT PDF */}
            {activeTool === 'pdf-splitter' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">PDF Splitter</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Extract individual pages or specified page ranges into a new PDF.</p>
                </div>
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Page Numbers to Extract (e.g. 1, 2-4, 6):
                  </label>
                  <input
                    type="text"
                    value={splitPagesText}
                    onChange={(e) => setSplitPagesText(e.target.value)}
                    placeholder="1, 2-3, 5"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500">
                    Total pages available: {pdfInfo?.pageCount || 1}
                  </span>
                </div>
                <button
                  onClick={handleSplit}
                  disabled={isProcessing || pdfBuffers.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  {isProcessing ? 'Extracting Pages...' : 'Split & Download Selected Pages'}
                </button>
              </div>
            )}

            {/* 3. SIGN PDF */}
            {activeTool === 'sign-pdf' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive PDF Signature</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Draw your handwritten signature or generate a signature font to place on any page.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSigMode('draw')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${sigMode === 'draw' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Draw Signature
                  </button>
                  <button
                    onClick={() => setSigMode('type')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${sigMode === 'type' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Type Name
                  </button>
                </div>

                {sigMode === 'draw' ? (
                  <div className="space-y-2">
                    <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
                      <canvas
                        ref={sigCanvasRef}
                        width={450}
                        height={120}
                        onMouseDown={startSigDraw}
                        onMouseMove={drawSig}
                        onMouseUp={stopSigDraw}
                        onMouseLeave={stopSigDraw}
                        className="w-full h-28 cursor-crosshair touch-none"
                      />
                      <button
                        onClick={clearSigCanvas}
                        className="absolute bottom-2 right-2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] flex items-center gap-1 font-semibold"
                      >
                        <Eraser className="w-3 h-3" /> Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400">Full Signature Name:</label>
                    <input
                      type="text"
                      value={sigTypedName}
                      onChange={(e) => setSigTypedName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Place on Page:</span>
                  <input
                    type="number"
                    min="1"
                    max={pdfInfo?.pageCount || 99}
                    value={sigPageNumber}
                    onChange={(e) => setSigPageNumber(parseInt(e.target.value) || 1)}
                    className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center font-mono"
                  />
                  <span className="text-slate-400">of {pdfInfo?.pageCount || 1}</span>
                </div>

                <button
                  onClick={handleSign}
                  disabled={isProcessing || pdfBuffers.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  {isProcessing ? 'Applying Signature...' : 'Stamp Signature & Download PDF'}
                </button>
              </div>
            )}

            {/* 4. ADD WATERMARK */}
            {activeTool === 'add-watermark' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Add PDF Watermark</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Stamp diagonal text across all pages to protect confidentiality.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Watermark Text:</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white mt-1 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                        <span>Opacity:</span>
                        <span className="font-mono">{Math.round(watermarkOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                        <span>Rotation Angle:</span>
                        <span className="font-mono">{watermarkRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        step="15"
                        value={watermarkRotation}
                        onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWatermark}
                  disabled={isProcessing || pdfBuffers.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Stamp className="w-4 h-4" />
                  {isProcessing ? 'Watermarking Document...' : 'Apply Watermark to PDF'}
                </button>
              </div>
            )}

            {/* 5. ROTATE PDF */}
            {activeTool === 'rotate-pdf' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Rotate PDF Pages</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Correct upside-down or sideways pages in your document.</p>
                </div>

                <div className="flex items-center gap-3">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setRotateAngle(deg)}
                      className={`flex-1 py-3 text-xs font-semibold rounded-xl border transition-colors ${
                        rotateAngle === deg
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      +{deg}° Clockwise
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRotate}
                  disabled={isProcessing || pdfBuffers.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  {isProcessing ? 'Rotating Pages...' : `Rotate All Pages by ${rotateAngle}°`}
                </button>
              </div>
            )}

            {/* 6. DELETE PAGES */}
            {activeTool === 'delete-pdf-pages' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete PDF Pages</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Remove specific unwanted pages while preserving the rest.</p>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Pages to Remove (comma separated, e.g. 2, 5):
                  </label>
                  <input
                    type="text"
                    value={deletePagesText}
                    onChange={(e) => setDeletePagesText(e.target.value)}
                    placeholder="2, 5"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <button
                  onClick={handleDeletePages}
                  disabled={isProcessing || pdfBuffers.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isProcessing ? 'Stripping Pages...' : 'Delete Pages & Download'}
                </button>
              </div>
            )}

            {/* 7. JPG / IMAGE TO PDF */}
            {activeTool === 'jpg-to-pdf' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Image to PDF Converter</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Turn JPG, PNG, and WebP images into a standardized multi-page PDF.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                  <p>• {selectedFiles.length} Image(s) selected.</p>
                  <p>• Automatically formats to standard A4 dimensions with clean margins.</p>
                </div>

                <button
                  onClick={handleImageToPDF}
                  disabled={isProcessing || selectedFiles.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <FilePlus className="w-4 h-4" />
                  {isProcessing ? 'Converting Images...' : `Convert ${selectedFiles.length} Images to PDF`}
                </button>
              </div>
            )}

            {/* 8. EDIT METADATA */}
            {activeTool === 'pdf-metadata-editor' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">PDF Metadata Editor</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update title, author, and subject properties stored in the PDF document.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400">Document Title:</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400">Author:</label>
                    <input
                      type="text"
                      value={metaAuthor}
                      onChange={(e) => setMetaAuthor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400">Subject / Description:</label>
                    <input
                      type="text"
                      value={metaSubject}
                      onChange={(e) => setMetaSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleMetadata}
                  disabled={isProcessing || pdfBuffers.length === 0}
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <FileCode className="w-4 h-4" />
                  {isProcessing ? 'Updating Properties...' : 'Save Updated PDF Metadata'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
