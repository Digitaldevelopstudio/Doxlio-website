export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callGeminiApi(
  prompt: string,
  systemInstruction?: string,
  taskType?: string
): Promise<string> {
  const response = await fetch('/api/gemini/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemInstruction, taskType }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to communicate with AI document assistant.');
  }

  return data.text;
}

export async function summarizeDocument(
  docText: string,
  format: 'executive' | 'bullets' | 'action_items' = 'executive'
): Promise<string> {
  const prompt = `Please analyze the following document text and produce a high-level ${format} summary:
  
=== DOCUMENT START ===
${docText}
=== DOCUMENT END ===

Provide:
1. One-paragraph Executive Overview
2. Top 5 Key Takeaways (bulleted)
3. Action Items & Next Steps (if applicable)`;

  return await callGeminiApi(
    prompt,
    'You are Doxlio AI Document Analyst. Provide crisp, professional, high-density analysis without unnecessary conversational fluff.',
    'summary'
  );
}

export async function chatWithDocument(
  docText: string,
  history: AIChatMessage[],
  userQuestion: string
): Promise<string> {
  const historySnippet = history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `Context Document:
${docText.slice(0, 8000)}

Recent Conversation:
${historySnippet}

User Question: ${userQuestion}

Answer accurately based strictly on the document context. If the document doesn't contain the answer, explicitly state so.`;

  return await callGeminiApi(
    prompt,
    'You are a rigorous document analysis assistant. Always cite facts and numbers directly from the provided text.',
    'chat'
  );
}

export async function translateDocument(
  docText: string,
  targetLanguage: string
): Promise<string> {
  const prompt = `Translate the following document content into fluent, professional ${targetLanguage}, preserving all structure, headings, lists, and numbers:

${docText}`;

  return await callGeminiApi(
    prompt,
    `You are a certified professional document translator specializing in exact terminology and native fluency in ${targetLanguage}.`,
    'translate'
  );
}

export async function analyzeResume(
  resumeText: string,
  targetJobDescription?: string
): Promise<string> {
  const prompt = `Perform an in-depth ATS and recruiter evaluation on the following candidate resume:

RESUME CONTENT:
${resumeText}

${targetJobDescription ? `TARGET ROLE / JOB DESCRIPTION:\n${targetJobDescription}` : ''}

Provide a structured report with:
1. Estimated ATS Match Score (0 - 100)
2. Executive Impression & Tone
3. High-Impact Strengths (with specific examples)
4. Critical Gaps & Missing Keywords
5. Line-by-Line Recommended Revisions (quantifiable impact improvements)`;

  return await callGeminiApi(
    prompt,
    'You are an executive talent recruiter and expert ATS algorithm auditor.',
    'resume_analysis'
  );
}

export async function rewriteDocument(
  docText: string,
  style: 'executive' | 'academic' | 'persuasive' | 'concise' | 'simplified'
): Promise<string> {
  const prompt = `Rewrite the following text in an expert ${style.toUpperCase()} style. Enhance vocabulary, eliminate redundancy, and ensure high clarity:

${docText}`;

  return await callGeminiApi(
    prompt,
    'You are a master editor and business communications architect.',
    'rewrite'
  );
}

export async function checkGrammar(docText: string): Promise<string> {
  const prompt = `Review the following text for grammar, punctuation, spelling, syntax, and readability:

${docText}

Format your output as:
1. Overall Clarity Score (0 - 100)
2. Specific Corrections Identified (Original -> Correction -> Rule/Reason)
3. Polished, Final Corrected Version`;

  return await callGeminiApi(
    prompt,
    'You are a senior proofreader and grammatical perfectionist.',
    'grammar'
  );
}

export async function generateCornellNotes(docText: string): Promise<string> {
  const prompt = `Transform the following document into structured Cornell Notes:

${docText}

Format:
- CUES / KEYWORDS (Left column questions & keywords)
- DETAILED NOTES (Main body concepts, formulas, definitions)
- SUMMARY (2-3 sentence core synthesis at the bottom)
- QUIZ QUESTIONS (3 self-test questions)`;

  return await callGeminiApi(
    prompt,
    'You are an academic learning specialist and Cornell note-taking expert.',
    'notes'
  );
}
