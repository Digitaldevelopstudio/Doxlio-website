import { Point, QuadCorners, FilterPreset, FilterSettings } from '../types';

/**
 * Detects document edges and corners from a canvas.
 * Analyzes luminance gradients and edge contrasts to find a quadrilateral document boundary.
 * Defaults to an inset quad if the surface has low contrast.
 */
export function detectDocumentCorners(
  canvas: HTMLCanvasElement
): QuadCorners {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx || width < 10 || height < 10) {
    return getDefaultCorners(width, height);
  }

  try {
    // Downscale for fast edge detection analysis
    const sampleW = 200;
    const sampleH = Math.round((height / width) * sampleW);
    const offscreen = document.createElement('canvas');
    offscreen.width = sampleW;
    offscreen.height = sampleH;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return getDefaultCorners(width, height);

    offCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
    const imgData = offCtx.getImageData(0, 0, sampleW, sampleH);
    const data = imgData.data;

    // Convert to grayscale
    const gray = new Uint8Array(sampleW * sampleH);
    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }

    // Sobel gradient magnitude
    const edges = new Uint8Array(sampleW * sampleH);
    for (let y = 1; y < sampleH - 1; y++) {
      for (let x = 1; x < sampleW - 1; x++) {
        const idx = y * sampleW + x;
        const gx =
          -1 * gray[idx - sampleW - 1] + 1 * gray[idx - sampleW + 1] +
          -2 * gray[idx - 1] + 2 * gray[idx + 1] +
          -1 * gray[idx + sampleW - 1] + 1 * gray[idx + sampleW + 1];
        const gy =
          -1 * gray[idx - sampleW - 1] - 2 * gray[idx - sampleW] - 1 * gray[idx - sampleW + 1] +
           1 * gray[idx + sampleW - 1] + 2 * gray[idx + sampleW] + 1 * gray[idx + sampleW + 1];
        edges[idx] = Math.min(255, Math.hypot(gx, gy));
      }
    }

    // Scan inward from 4 directions to find high gradient transitions
    const margin = Math.round(sampleW * 0.05);
    const threshold = 45;

    let minX = sampleW, maxX = 0, minY = sampleH, maxY = 0;
    let foundEdge = false;

    for (let y = margin; y < sampleH - margin; y++) {
      for (let x = margin; x < sampleW - margin; x++) {
        if (edges[y * sampleW + x] > threshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          foundEdge = true;
        }
      }
    }

    // If edges enclose at least 25% of area, map to full canvas coordinates
    if (foundEdge && (maxX - minX) > sampleW * 0.4 && (maxY - minY) > sampleH * 0.4) {
      const scaleX = width / sampleW;
      const scaleY = height / sampleH;
      const padX = (maxX - minX) * 0.02;
      const padY = (maxY - minY) * 0.02;

      return {
        tl: { x: Math.max(0, (minX - padX) * scaleX), y: Math.max(0, (minY - padY) * scaleY) },
        tr: { x: Math.min(width, (maxX + padX) * scaleX), y: Math.max(0, (minY - padY) * scaleY) },
        br: { x: Math.min(width, (maxX + padX) * scaleX), y: Math.min(height, (maxY + padY) * scaleY) },
        bl: { x: Math.max(0, (minX - padX) * scaleX), y: Math.min(height, (maxY + padY) * scaleY) },
      };
    }
  } catch (err) {
    console.warn('Auto edge detection fallback triggered:', err);
  }

  return getDefaultCorners(width, height);
}

export function getDefaultCorners(width: number, height: number): QuadCorners {
  const padX = width * 0.08;
  const padY = height * 0.08;
  return {
    tl: { x: padX, y: padY },
    tr: { x: width - padX, y: padY },
    br: { x: width - padX, y: height - padY },
    bl: { x: padX, y: height - padY },
  };
}

/**
 * Computes standard 8 handles from 4 quadrilateral corners:
 * 4 corners + 4 edge midpoints
 */
export function getEightHandles(corners: QuadCorners) {
  const { tl, tr, br, bl } = corners;
  return {
    tl,
    tc: { x: (tl.x + tr.x) / 2, y: (tl.y + tr.y) / 2 },
    tr,
    rc: { x: (tr.x + br.x) / 2, y: (tr.y + br.y) / 2 },
    br,
    bc: { x: (br.x + bl.x) / 2, y: (br.y + bl.y) / 2 },
    bl,
    lc: { x: (bl.x + tl.x) / 2, y: (bl.y + tl.y) / 2 },
  };
}

/**
 * Solves standard 8-parameter 3x3 projective transformation matrix H:
 * Maps unit/destination square [0..W, 0..H] back into quadrilateral source points (backward mapping).
 */
function getProjectiveMatrix(
  src: QuadCorners,
  dstW: number,
  dstH: number
): number[] | null {
  // Destination points: (0,0), (dstW,0), (dstW,dstH), (0,dstH)
  // Mapping (x_dst, y_dst) -> (x_src, y_src)
  const x0 = 0, y0 = 0;
  const x1 = dstW, y1 = 0;
  const x2 = dstW, y2 = dstH;
  const x3 = 0, y3 = dstH;

  const u0 = src.tl.x, v0 = src.tl.y;
  const u1 = src.tr.x, v1 = src.tr.y;
  const u2 = src.br.x, v2 = src.br.y;
  const u3 = src.bl.x, v3 = src.bl.y;

  // Build linear 8x8 system for homography
  const A: number[][] = [];
  const B: number[] = [];

  const pts = [
    { x: x0, y: y0, u: u0, v: v0 },
    { x: x1, y: y1, u: u1, v: v1 },
    { x: x2, y: y2, u: u2, v: v2 },
    { x: x3, y: y3, u: u3, v: v3 },
  ];

  for (let i = 0; i < 4; i++) {
    const { x, y, u, v } = pts[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    B.push(v);
  }

  // Gaussian elimination
  const n = 8;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    const tempA = A[i]; A[i] = A[maxRow]; A[maxRow] = tempA;
    const tempB = B[i]; B[i] = B[maxRow]; B[maxRow] = tempB;

    if (Math.abs(A[i][i]) < 1e-12) return null; // Singular

    for (let k = i + 1; k < n; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
      B[k] -= factor * B[i];
    }
  }

  const h = new Array(8);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * h[j];
    }
    h[i] = (B[i] - sum) / A[i][i];
  }

  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

/**
 * Executes true perspective warp transformation (homography)
 * Rectifies skewed quadrilateral into a clean orthogonal rectangle.
 */
export function perspectiveWarp(
  sourceCanvas: HTMLCanvasElement,
  corners: QuadCorners,
  targetWidth?: number,
  targetHeight?: number
): HTMLCanvasElement {
  const { tl, tr, br, bl } = corners;

  // Calculate destination dimensions based on average edge lengths
  const topW = Math.hypot(tr.x - tl.x, tr.y - tl.y);
  const botW = Math.hypot(br.x - bl.x, br.y - bl.y);
  const leftH = Math.hypot(bl.x - tl.x, bl.y - tl.y);
  const rightH = Math.hypot(br.x - tr.x, br.y - tr.y);

  const dstW = Math.round(targetWidth || Math.max(topW, botW, 400));
  const dstH = Math.round(targetHeight || Math.max(leftH, rightH, 500));

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = dstW;
  outputCanvas.height = dstH;
  const outCtx = outputCanvas.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });

  if (!outCtx || !srcCtx) return outputCanvas;

  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;
  const srcImgData = srcCtx.getImageData(0, 0, srcW, srcH);
  const srcData = srcImgData.data;

  const outImgData = outCtx.createImageData(dstW, dstH);
  const outData = outImgData.data;

  const H = getProjectiveMatrix(corners, dstW, dstH);

  if (!H) {
    // Fallback simple draw
    outCtx.drawImage(sourceCanvas, 0, 0, dstW, dstH);
    return outputCanvas;
  }

  // Backward mapping with bilinear interpolation
  const [h0, h1, h2, h3, h4, h5, h6, h7, h8] = H;

  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      const denom = h6 * x + h7 * y + h8;
      if (Math.abs(denom) < 1e-8) continue;

      const u = (h0 * x + h1 * y + h2) / denom;
      const v = (h3 * x + h4 * y + h5) / denom;

      if (u >= 0 && u < srcW - 1 && v >= 0 && v < srcH - 1) {
        const u0 = Math.floor(u);
        const v0 = Math.floor(v);
        const u1 = u0 + 1;
        const v1 = v0 + 1;

        const du = u - u0;
        const dv = v - v0;

        const w00 = (1 - du) * (1 - dv);
        const w10 = du * (1 - dv);
        const w01 = (1 - du) * dv;
        const w11 = du * dv;

        const idx00 = (v0 * srcW + u0) * 4;
        const idx10 = (v0 * srcW + u1) * 4;
        const idx01 = (v1 * srcW + u0) * 4;
        const idx11 = (v1 * srcW + u1) * 4;

        const outIdx = (y * dstW + x) * 4;

        outData[outIdx]     = Math.round(srcData[idx00] * w00 + srcData[idx10] * w10 + srcData[idx01] * w01 + srcData[idx11] * w11);
        outData[outIdx + 1] = Math.round(srcData[idx00 + 1] * w00 + srcData[idx10 + 1] * w10 + srcData[idx01 + 1] * w01 + srcData[idx11 + 1] * w11);
        outData[outIdx + 2] = Math.round(srcData[idx00 + 2] * w00 + srcData[idx10 + 2] * w10 + srcData[idx01 + 2] * w01 + srcData[idx11 + 2] * w11);
        outData[outIdx + 3] = 255;
      }
    }
  }

  outCtx.putImageData(outImgData, 0, 0);
  return outputCanvas;
}

/**
 * Applies CamScanner-grade enhancement filters and adjustments:
 * - Magic Color: adaptive contrast, white paper flattening, ink deepening
 * - Document: clean paper background whitening, high text contrast
 * - Black & White: adaptive threshold binarization
 * - Grayscale: clean optical grayscale
 * - Lighten: shadow removal
 * - Auto Enhance: histogram expansion
 * - Brightness, Contrast, and Sharpness (unsharp mask convolution)
 */
export function applyEnhancement(
  sourceCanvas: HTMLCanvasElement,
  settings: FilterSettings
): HTMLCanvasElement {
  const { preset, brightness, contrast, sharpness } = settings;
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Preset transformation
  switch (preset) {
    case 'grayscale': {
      for (let i = 0; i < data.length; i += 4) {
        const g = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        data[i] = g;
        data[i + 1] = g;
        data[i + 2] = g;
      }
      break;
    }
    case 'bw': {
      // Adaptive threshold binarization
      for (let i = 0; i < data.length; i += 4) {
        const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = g < 138 ? 0 : 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
      break;
    }
    case 'magic': {
      // CamScanner Magic Color: boost white paper to pure white, deep ink saturation
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Non-linear gamma for paper background lift
        if (lum > 145) {
          const factor = 1 + (lum - 145) / 110 * 0.45;
          r = Math.min(255, r * factor);
          g = Math.min(255, g * factor);
          b = Math.min(255, b * factor);
        } else {
          // Deepen dark text
          const factor = 0.85;
          r = r * factor;
          g = g * factor;
          b = b * factor;
        }

        // Slight saturation boost for colored stamps/signatures
        const avg = (r + g + b) / 3;
        r = Math.min(255, Math.max(0, avg + (r - avg) * 1.35));
        g = Math.min(255, Math.max(0, avg + (g - avg) * 1.35));
        b = Math.min(255, Math.max(0, avg + (b - avg) * 1.35));

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      break;
    }
    case 'document': {
      // High contrast document mode
      for (let i = 0; i < data.length; i += 4) {
        let lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum > 130) {
          lum = Math.min(255, 200 + (lum - 130) * 0.6);
        } else {
          lum = Math.max(0, lum * 0.7);
        }
        data[i] = lum;
        data[i + 1] = lum;
        data[i + 2] = lum;
      }
      break;
    }
    case 'lighten': {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.25 + 15);
        data[i + 1] = Math.min(255, data[i + 1] * 1.25 + 15);
        data[i + 2] = Math.min(255, data[i + 2] * 1.25 + 15);
      }
      break;
    }
    case 'auto': {
      // Auto histogram stretch
      let minLum = 255, maxLum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum < minLum) minLum = lum;
        if (lum > maxLum) maxLum = lum;
      }
      const range = Math.max(1, maxLum - minLum);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, ((data[i] - minLum) / range) * 255));
        data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - minLum) / range) * 255));
        data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - minLum) / range) * 255));
      }
      break;
    }
    case 'enhance':
    case 'color_enhance': {
      // Contrast and saturation enhancement
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        const avg = (r + g + b) / 3;
        // Boost contrast around midpoint 128
        r = Math.min(255, Math.max(0, 128 + (r - 128) * 1.35));
        g = Math.min(255, Math.max(0, 128 + (g - 128) * 1.35));
        b = Math.min(255, Math.max(0, 128 + (b - 128) * 1.35));
        // Saturate colors
        r = Math.min(255, Math.max(0, avg + (r - avg) * 1.4));
        g = Math.min(255, Math.max(0, avg + (g - avg) * 1.4));
        b = Math.min(255, Math.max(0, avg + (b - avg) * 1.4));
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      break;
    }

    default:
      break;
  }

  // 2. Brightness & Contrast
  if (brightness !== 0 || contrast !== 0) {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + brightness));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + brightness));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + brightness));
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 3. Sharpness Convolution (3x3 Unsharp Mask)
  if (sharpness > 0) {
    const sharpCanvas = document.createElement('canvas');
    sharpCanvas.width = width;
    sharpCanvas.height = height;
    const sharpCtx = sharpCanvas.getContext('2d');
    if (sharpCtx) {
      const srcPixels = ctx.getImageData(0, 0, width, height);
      const dstPixels = sharpCtx.createImageData(width, height);
      const src = srcPixels.data;
      const dst = dstPixels.data;

      const strength = sharpness * 0.45;
      const center = 1 + 4 * strength;
      const edge = -strength;

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;

          for (let c = 0; c < 3; c++) {
            const val =
              center * src[idx + c] +
              edge * src[((y - 1) * width + x) * 4 + c] +
              edge * src[((y + 1) * width + x) * 4 + c] +
              edge * src[(y * width + (x - 1)) * 4 + c] +
              edge * src[(y * width + (x + 1)) * 4 + c];
            dst[idx + c] = Math.min(255, Math.max(0, Math.round(val)));
          }
          dst[idx + 3] = src[idx + 3];
        }
      }
      sharpCtx.putImageData(dstPixels, 0, 0);
      return sharpCanvas;
    }
  }

  return canvas;
}

/**
 * Rotates a canvas by 90, 180, or 270 degrees.
 */
export function rotateCanvas(
  sourceCanvas: HTMLCanvasElement,
  angleDegrees: number
): HTMLCanvasElement {
  const norm = ((angleDegrees % 360) + 360) % 360;
  if (norm === 0) return sourceCanvas;

  const output = document.createElement('canvas');
  if (norm === 90 || norm === 270) {
    output.width = sourceCanvas.height;
    output.height = sourceCanvas.width;
  } else {
    output.width = sourceCanvas.width;
    output.height = sourceCanvas.height;
  }

  const ctx = output.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.translate(output.width / 2, output.height / 2);
  ctx.rotate((norm * Math.PI) / 180);
  ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);

  return output;
}

/**
 * Loads image from data URL into an HTMLCanvasElement
 */
export function imageToCanvas(dataUrl: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        reject(new Error('Canvas context unavailable'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

const TESS_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
let tessPromise: Promise<void> | null = null;

function loadTesseract(): Promise<void> {
  if ((window as any).Tesseract) return Promise.resolve();
  if (!tessPromise) {
    tessPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = TESS_URL;
      s.onload = () => resolve();
      s.onerror = () => {
        tessPromise = null;
        reject(new Error('Could not load the OCR engine. Check your internet connection.'));
      };
      document.head.appendChild(s);
    });
  }
  return tessPromise;
}

/**
 * Real client-side OCR using Tesseract.js (loaded on demand from a CDN).
 * lang: eng, urd, ara, hin, fra, spa, deu. Language data downloads on first use.
 */
export async function extractOcrText(
  canvas: HTMLCanvasElement,
  lang: string = 'eng',
  onProgress?: (p: number) => void
): Promise<string> {
  await loadTesseract();
  const T = (window as any).Tesseract;
  const worker = await T.createWorker(lang, 1, {
    logger: (m: any) => {
      if (onProgress && typeof m.progress === 'number') onProgress(m.progress);
    },
  });
  try {
    const { data } = await worker.recognize(canvas);
    const text = String(data.text || '').trim();
    return text || 'No text was found in this image.';
  } finally {
    await worker.terminate();
  }
}
