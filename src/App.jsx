import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  ShieldCheck,
  Moon,
  Sun,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import {
  formatText,
  cleanAndFormatText,
  defaultFormatOptions,
  SAMPLE_TEMPLATES
} from './utils/formatter';
import {
  exportDocumentToPdf,
  triggerBrowserPrint
} from './utils/pdfExport';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Editor and Document state
  const [documentTitle, setDocumentTitle] = useState('Executive Product Sync');
  const [rawText, setRawText] = useState(SAMPLE_TEMPLATES.meetingNotes);
  const [originalRawText, setOriginalRawText] = useState(SAMPLE_TEMPLATES.meetingNotes);

  // Formatting Engine Options
  const [formatOptions, setFormatOptions] = useState(defaultFormatOptions);

  // Typography Settings
  const [typography, setTypography] = useState({
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: '1.5',
    paragraphSpacing: '0.85rem'
  });

  // Page Setup Settings
  const [pageSetup, setPageSetup] = useState({
    pageSize: 'a4',
    orientation: 'portrait',
    marginMm: 20,
    runningHeader: 'Insta Document • Antigravity Systems',
    pageNumbering: 'right'
  });

  // Formatted Output State (debounced)
  const [formattedState, setFormattedState] = useState(() => formatText(rawText, formatOptions));

  // PDF Export Status
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const paperRef = useRef(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-time Debounced Formatting (<150ms delay for high responsiveness)
  useEffect(() => {
    const handler = setTimeout(() => {
      const result = formatText(rawText, formatOptions);
      setFormattedState(result);
    }, 90);

    return () => clearTimeout(handler);
  }, [rawText, formatOptions]);

  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  };

  // Actions
  const handleCleanAndFormat = () => {
    const cleaned = cleanAndFormatText(rawText);
    setRawText(cleaned);
    showToast('✨ Cleaned whitespace, normalized quotes, and formatted lists!');
  };

  const handleResetToRaw = () => {
    setRawText(originalRawText);
    showToast('Document reverted to initial raw input.');
  };

  const handleLoadTemplate = (templateContent, templateName) => {
    setRawText(templateContent);
    setOriginalRawText(templateContent);
    setDocumentTitle(templateName);
    showToast(`Loaded ${templateName} template.`);
  };

  const handleExportPdf = async () => {
    if (!paperRef.current) return;
    setIsExporting(true);
    setExportProgress(10);
    setExportStatusText('Preparing...');

    try {
      await exportDocumentToPdf(
        paperRef.current,
        {
          title: documentTitle || 'Document',
          pageSize: pageSetup.pageSize,
          orientation: pageSetup.orientation,
          marginMm: pageSetup.marginMm
        },
        (progress, status) => {
          setExportProgress(progress);
          setExportStatusText(status);
        }
      );
      showToast('🎉 PDF generated and downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF generation encountered an issue. You can also use the "Print" button for native vector PDF.');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportStatusText('');
      }, 1000);
    }
  };

  const handleBrowserPrint = () => {
    triggerBrowserPrint();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* Top Application Header */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 shadow-xs">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-base">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Insta Text to PDF</span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                v1.0 Pro
              </span>
            </h1>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400">
              Intelligent auto-formatting engine &bull; Real-time vector preview
            </p>
          </div>
        </div>

        {/* Center / Privacy Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>100% Client-Side &bull; Zero Server Uploads</span>
        </div>

        {/* Right Header Utilities */}
        <div className="flex items-center space-x-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Customizable Toolbar & Tabs */}
      <Toolbar
        formatOptions={formatOptions}
        setFormatOptions={setFormatOptions}
        typography={typography}
        setTypography={setTypography}
        pageSetup={pageSetup}
        setPageSetup={setPageSetup}
        onCleanAndFormat={handleCleanAndFormat}
        onResetToRaw={handleResetToRaw}
        onLoadTemplate={handleLoadTemplate}
        onExportPdf={handleExportPdf}
        onBrowserPrint={handleBrowserPrint}
        isExporting={isExporting}
        exportProgress={exportProgress}
        exportStatusText={exportStatusText}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative">
        {/* Left Panel: Editor & Stats */}
        <section className="h-full overflow-hidden editor-panel">
          <Editor
            rawText={rawText}
            setRawText={setRawText}
            stats={formattedState.stats}
            documentTitle={documentTitle}
            setDocumentTitle={setDocumentTitle}
          />
        </section>

        {/* Right Panel: Realistic Live A4/Letter Preview */}
        <section className="h-full overflow-hidden">
          <Preview
            htmlContent={formattedState.htmlContent}
            typography={typography}
            pageSetup={pageSetup}
            documentTitle={documentTitle}
            formatOptions={formatOptions}
            onBrowserPrint={handleBrowserPrint}
            paperRef={paperRef}
          />
        </section>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
