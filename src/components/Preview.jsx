import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  RotateCw,
  Printer,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function Preview({
  htmlContent,
  typography,
  pageSetup,
  documentTitle,
  formatOptions,
  onBrowserPrint,
  paperRef
}) {
  const [zoomLevel, setZoomLevel] = useState(100); // 50 to 150%
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Map font families to CSS font classes
  const fontClassMap = {
    'Inter': 'font-sans',
    'Merriweather': 'font-serif',
    'JetBrains Mono': 'font-mono',
    'Roboto': 'font-roboto'
  };

  const currentFontClass = fontClassMap[typography.fontFamily] || 'font-sans';

  // Physical page dimensions in millimeters
  const isA4 = pageSetup.pageSize === 'a4';
  const isPortrait = pageSetup.orientation === 'portrait';

  // Base mm dimensions
  const widthMm = isA4
    ? (isPortrait ? 210 : 297)
    : (isPortrait ? 215.9 : 279.4);
  const heightMm = isA4
    ? (isPortrait ? 297 : 210)
    : (isPortrait ? 279.4 : 215.9);

  // Scale handling for zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 10));
  const handleResetZoom = () => setZoomLevel(100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full bg-slate-200/70 dark:bg-slate-950/80 relative overflow-hidden transition-colors ${
        isFullscreen ? 'p-4' : ''
      }`}
    >
      {/* Top Preview Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Live Document Preview
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
            {pageSetup.pageSize.toUpperCase()} &bull; {pageSetup.orientation}
          </span>
        </div>

        {/* Zoom & Screen Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleZoomOut}
            title="Zoom out"
            className="p-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset zoom to 100%"
            className="text-xs font-mono px-2 py-1 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {zoomLevel}%
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom in"
            className="p-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            className="p-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Scrollable Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start preview-wrapper">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="pb-16"
        >
          {/* Realistic Physical Sheet */}
          <div
            id="pdf-document-root"
            ref={paperRef}
            className={`paper-page bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300/60 dark:border-slate-700 relative transition-all ${currentFontClass} ${
              formatOptions.academicIndent ? 'academic-indent' : ''
            }`}
            style={{
              width: `${widthMm}mm`,
              minHeight: `${heightMm}mm`,
              padding: `${pageSetup.marginMm}mm`,
              fontSize: `${typography.fontSize}pt`,
              lineHeight: typography.lineHeight,
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)'
            }}
          >
            {/* Running Header */}
            {pageSetup.runningHeader && (
              <div
                className="running-header pb-3 mb-6 border-b border-slate-200 text-slate-400 text-[10px] tracking-wider uppercase flex justify-between items-center select-none"
                style={{ marginTop: `-${pageSetup.marginMm / 2}mm` }}
              >
                <span>{pageSetup.runningHeader}</span>
                <span className="font-mono">{new Date().toISOString().slice(0, 10)}</span>
              </div>
            )}

            {/* Rendered HTML Content */}
            {htmlContent ? (
              <div
                className="formatted-doc prose max-w-none text-slate-900 selection:bg-indigo-100"
                style={{
                  '--p-gap': typography.paragraphSpacing
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <div className="py-24 text-center text-slate-300 select-none">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
                <p className="text-sm font-medium text-slate-400">Your formatted document will appear here</p>
                <p className="text-xs text-slate-400 mt-1">Start typing or select a template from the toolbar</p>
              </div>
            )}

            {/* Page Footer / Page Numbering */}
            <div className="running-footer pt-3 mt-8 border-t border-slate-100 text-slate-400 text-[10px] select-none grid grid-cols-3 items-center">
              <span className="justify-self-start font-semibold tracking-wider">SIGMA</span>
              {pageSetup.pageNumbering === 'center' && (
                <span className="justify-self-center">Page 1 of 1</span>
              )}
              {pageSetup.pageNumbering === 'right' && (
                <span className="justify-self-end">Page 1 of 1</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
