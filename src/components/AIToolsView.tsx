import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Languages, 
  UserCheck, 
  Send, 
  BookOpen, 
  CheckCheck, 
  Copy, 
  Download, 
  AlertCircle, 
  Check, 
  RefreshCw,
  Upload
} from 'lucide-react';
import { 
  summarizeDocument, 
  chatWithDocument, 
  translateDocument, 
  analyzeResume, 
  rewriteDocument, 
  checkGrammar, 
  generateCornellNotes,
  AIChatMessage
} from '../utils/aiClient';
import { downloadFile } from '../utils/pdfEngine';

interface AIToolsViewProps {
  initialToolId?: string;
}

export const AIToolsView: React.FC<AIToolsViewProps> = ({ 
  initialToolId = 'ai-pdf-summarizer' 
}) => {
  const [activeTool, setActiveTool] = useState(initialToolId);

  // Common input document text
  const [inputText, setInputText] = useState(
`SERVICES AND MASTER COLLABORATION AGREEMENT
This agreement is entered into as of October 24, between Apex Industries Inc. ("Client") and Quantum Systems Ltd. ("Service Provider").
1. SCOPE OF SERVICES: The Service Provider will implement an automated, client-side document processing infrastructure, delivering high-fidelity optical OCR, multi-page scanning with quadrilateral perspective correction, and privacy-first local memory execution.
2. FEES AND COMPENSATION: The Client agrees to compensate the Service Provider at a milestone rate of $45,000 upon successful completion of User Acceptance Testing (UAT).
3. DATA PRIVACY & COMPLIANCE: Zero documents or personally identifiable customer files will be retained on cloud databases without express encryption and user consent.
4. TERM AND TERMINATION: This Agreement remains effective for twelve (12) consecutive months, renewable by mutual written consent.`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tool specific configurations
  const [summaryFormat, setSummaryFormat] = useState<'executive' | 'bullets' | 'action_items'>('executive');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [targetJobRole, setTargetJobRole] = useState('Senior Full-Stack Engineer / Product Architect');
  const [rewriteStyle, setRewriteStyle] = useState<'executive' | 'academic' | 'persuasive' | 'concise' | 'simplified'>('executive');

  // Chat with PDF state
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am ready to answer any questions or clarify terms regarding your document.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Handle uploading text file or extracting text
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setInputText(text);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage('Could not read text file.');
    }
  };

  // Run AI Task
  const handleRunAi = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please provide document text to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResultText('');

    try {
      let output = '';
      switch (activeTool) {
        case 'ai-pdf-summarizer':
          output = await summarizeDocument(inputText, summaryFormat);
          break;
        case 'ai-document-translator':
          output = await translateDocument(inputText, targetLang);
          break;
        case 'ai-resume-analyzer':
          output = await analyzeResume(inputText, targetJobRole);
          break;
        case 'ai-writing-assistant':
          output = await rewriteDocument(inputText, rewriteStyle);
          break;
        case 'ai-grammar-checker':
          output = await checkGrammar(inputText);
          break;
        case 'ai-notes-generator':
          output = await generateCornellNotes(inputText);
          break;
        default:
          output = await summarizeDocument(inputText, 'executive');
      }
      setResultText(output);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'AI request failed. Please verify GEMINI_API_KEY is configured in Settings > Secrets.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send Chat message
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const reply = await chatWithDocument(inputText, chatHistory, userMsg);
      setChatHistory((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to get chat response.');
    } finally {
      setIsLoading(false);
    }
  };

  const aiToolsNav = [
    { id: 'ai-pdf-summarizer', name: 'Document Summarizer', icon: FileText },
    { id: 'chat-with-pdf', name: 'Chat with Document', icon: MessageSquare },
    { id: 'ai-document-translator', name: 'Document Translator', icon: Languages },
    { id: 'ai-resume-analyzer', name: 'Resume & ATS Analyzer', icon: UserCheck },
    { id: 'ai-writing-assistant', name: 'Tone Rewriter', icon: Sparkles },
    { id: 'ai-grammar-checker', name: 'Grammar & Clarity', icon: CheckCheck },
    { id: 'ai-notes-generator', name: 'Cornell Notes Maker', icon: BookOpen },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Doxlio Tools</span>
          <span>/</span>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">AI Document Intelligence</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          AI Document Intelligence & Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Powered by Gemini 3.8 Flash via secure server-side proxy. In-depth summarization, multilingual translation, ATS auditing, and conversational Q&A.
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {aiToolsNav.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                setErrorMessage(null);
                setResultText('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                activeTool === t.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.name}
            </button>
          );
        })}
      </div>

      {/* CHAT WITH DOCUMENT INTERFACE */}
      {activeTool === 'chat-with-pdf' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Context Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Document Grounding Context
              </h3>
              <label className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                Upload Text/PDF
                <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={16}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or upload document text here..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-slate-500">
              {inputText.length} characters loaded for grounding.
            </p>
          </div>

          {/* Interactive Chat Thread */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Conversational Document Q&A
            </h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-8 bg-blue-600 text-white font-medium'
                      : 'mr-8 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    {msg.role === 'user' ? 'You' : 'Doxlio AI'}
                  </span>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="p-3 mr-8 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  Analyzing document text...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about contract terms, deadlines, numbers, obligations..."
                className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* STANDARD DUAL COLUMN AI WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Text & Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Source Document Content
              </h3>
              <label className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                Upload File
                <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              rows={11}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste document text or write draft..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {/* Tool specific parameters */}
            {activeTool === 'ai-pdf-summarizer' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Summary Format:</span>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {(['executive', 'bullets', 'action_items'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSummaryFormat(fmt)}
                      className={`px-3 py-1 rounded-md capitalize transition-colors ${
                        summaryFormat === fmt ? 'bg-white dark:bg-slate-900 text-teal-600 font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {fmt.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTool === 'ai-document-translator' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Target Language:</span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Arabic', 'Russian', 'Hindi'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            {activeTool === 'ai-resume-analyzer' && (
              <div className="space-y-1 text-xs">
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Target Role / Job Title:</label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
                />
              </div>
            )}

            {activeTool === 'ai-writing-assistant' && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Tone & Style:</span>
                <select
                  value={rewriteStyle}
                  onChange={(e) => setRewriteStyle(e.target.value as any)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white capitalize"
                >
                  {['executive', 'academic', 'persuasive', 'concise', 'simplified'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleRunAi}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Processing with Gemini AI...' : 'Generate AI Analysis'}
            </button>
          </div>

          {/* Right: AI Output Display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  AI Intelligence Output
                </h3>
                {resultText && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resultText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 text-xs bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{errorMessage}</p>
                    <p className="text-[11px] opacity-80">
                      Ensure your API key is configured in the AI Studio environment.
                    </p>
                  </div>
                </div>
              )}

              {resultText ? (
                <div className="max-h-[400px] overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-text">
                  {resultText}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Sparkles className="w-10 h-10 mb-2 opacity-30 text-teal-500" />
                  <p className="text-xs font-medium">Click "Generate AI Analysis" to run Gemini 3.8 Flash.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Zero document storage. All summaries and translations are generated dynamically.
                  </p>
                </div>
              )}
            </div>

            {resultText && (
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => downloadFile(resultText, 'Doxlio_AI_Report.txt', 'text/plain')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .txt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
