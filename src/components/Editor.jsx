import React, { useState } from 'react';
import {
  FileEdit,
  Copy,
  Check,
  Trash2,
  Clock,
  BookOpen,
  Hash,
  Layers,
  FileCode,
  RotateCcw
} from 'lucide-react';

export default function Editor({
  rawText,
  setRawText,
  stats,
  documentTitle,
  setDocumentTitle
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    if (rawText && window.confirm('Are you sure you want to clear the editor?')) {
      setRawText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Editor Header: Title Input & Quick Actions */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center space-x-2 flex-1 max-w-sm mr-2">
          <FileEdit className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Untitled Document..."
            className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:ring-0 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 py-0.5 px-1 transition"
          />
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy raw text to clipboard"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition flex items-center gap-1 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            title="Clear editor contents"
            disabled={!rawText}
            className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea Area */}
      <div className="relative flex-1 p-3 overflow-hidden flex flex-col">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`Paste unformatted notes, meeting minutes, or rough thoughts here...

Example:
EXECUTIVE SUMMARY
Project launch scheduled for 2026-10-01.
Note: All security reviews are fully approved.

Key Deliverables:
- Design Tokens: Finished
- Client PDF Vector Engine: Completed
- Offline Documentation: In review`}
          className="w-full flex-1 resize-none bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 font-mono text-sm leading-relaxed p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 selection:bg-indigo-500 selection:text-white transition"
          spellCheck="false"
        />
      </div>

      {/* Stats Footer Bar */}
      <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
        <div className="flex items-center space-x-3.5">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.words}</span> words
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.chars}</span> chars
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.paragraphs}</span> paragraphs
          </span>
        </div>

        <div className="flex items-center space-x-3.5">
          <span className="flex items-center gap-1" title="Estimated reading time at 200 words/min">
            <Clock className="w-3 h-3 text-indigo-500" />
            <span>~{stats.readingTimeMin} min read</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="flex items-center gap-1" title="Estimated standard pages">
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>~{stats.estimatedPages} {stats.estimatedPages === 1 ? 'page' : 'pages'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
