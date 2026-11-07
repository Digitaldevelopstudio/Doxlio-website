import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine port: dev server runs on port 3000 in AI Studio; in production (Render, VPS), uses process.env.PORT
function getPort(): number {
  const portArgIdx = process.argv.findIndex((arg) => arg === '--port' || arg === '-p');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  if (process.env.PORT) {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 3000;
}

const port = getPort();

app.use(express.json({ limit: '25mb' }));

// Server-side Gemini AI setup
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Document Processing Route
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, taskType } = req.body;

    if (!process.env.GEMINI_API_KEY || !ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in the server environment.',
        details: 'Please set GEMINI_API_KEY in Settings > Secrets or the .env file.'
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body.' });
    }

    const defaultSystemInstruction = 
      'You are Doxlio AI, an expert document intelligence and productivity assistant. Provide direct, highly accurate, structured, and polished output. Never hallucinate or add preamble unless requested.';

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || defaultSystemInstruction,
      },
    });

    return res.json({
      text: response.text || '',
      taskType: taskType || 'general',
    });
  } catch (error: any) {
    console.error('Gemini API Server Error:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while generating content with Gemini.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Doxlio Document Platform',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Setup Vite dev server or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      base: '/',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Doxlio full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
