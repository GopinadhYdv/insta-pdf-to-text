import React, { useState } from 'react';
import {
  Wand2,
  Type,
  Layout,
  Sliders,
  FileText,
  RotateCcw,
  Sparkles,
  Download,
  Printer,
  ChevronDown,
  Check,
  AlignLeft,
  Heading,
  Bold,
  ListFilter,
  Indent,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../utils/formatter';

export default function Toolbar({
  formatOptions,
  setFormatOptions,
  typography,
  setTypography,
  pageSetup,
  setPageSetup,
  onCleanAndFormat,
  onResetToRaw,
  onLoadTemplate,
  onExportPdf,
  onBrowserPrint,
  isExporting,
  exportProgress,
  exportStatusText
}) {
  const [activeTab, setActiveTab] = useState('formatting'); // 'formatting' | 'typography' | 'page'

  const fontOptions = [
    { id: 'Inter', label: 'Inter (Sans)', family: 'font-sans' },
    { id: 'Merriweather', label: 'Merriweather (Serif)', family: 'font-serif' },
    { id: 'JetBrains Mono', label: 'JetBrains Mono (Code)', family: 'font-mono' },
    { id: 'Roboto', label: 'Roboto (Modern)', family: 'font-roboto' },
  ];

  const lineHeightOptions = [
    { label: 'Compact', value: '1.25' },
    { label: 'Normal', value: '1.5' },
    { label: 'Relaxed', value: '1.75' },
    { label: 'Double', value: '2.0' },
  ];

  const marginPresets = [
    { label: 'Narrow', value: 10 },
    { label: 'Normal', value: 20 },
    { label: 'Wide', value: 25 },
  ];

  const toggleFormat = (key) => {
    setFormatOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Bar: Tabs & Quick Action Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 py-2.5">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('formatting')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'formatting'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Format</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'typography'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Typography</span>
          </button>

          <button
            onClick={() => setActiveTab('page')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'page'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Page Setup</span>
          </button>
        </div>

        {/* Presets & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Templates Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Load Sample Notes
              </div>
              <button
                onClick={() => onLoadTemplate(SAMPLE_TEMPLATES.meetingNotes, 'Meeting Notes')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition"
              >
                📋 Executive Meeting Notes
              </button>
              <button
                onClick={() => onLoadTemplate(SAMPLE_TEMPLATES.projectProposal, 'Project Proposal')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition"
              >
                🚀 Technical Proposal
              </button>
              <button
                onClick={() => onLoadTemplate(SAMPLE_TEMPLATES.academicAbstract, 'Academic Abstract')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition"
              >
                🎓 Academic Abstract
              </button>
            </div>
          </div>

          {/* Clean & Format Button */}
          <button
            onClick={onCleanAndFormat}
            title="Trim whitespace, balance quotes, fix spacing and list tokens"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Clean & Format</span>
          </button>

          {/* Reset to Raw */}
          <button
            onClick={onResetToRaw}
            title="Revert document to original unformatted input"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Native Print / Vector Export */}
          <button
            onClick={onBrowserPrint}
            title="Print or Save as PDF via native browser dialog (100% Vector Text)"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Primary Download PDF Button */}
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm transition-all ${
              isExporting
                ? 'bg-indigo-400 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-500/20'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{exportStatusText || 'Exporting...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Panel: Detailed Controls based on Active Tab */}
      <div className="bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5">
        {/* TAB 1: Auto-Formatting Controls */}
        {activeTab === 'formatting' && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs">
            {/* Auto Headings Group */}
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Heading className="w-3.5 h-3.5 text-indigo-500" />
                Headings:
              </span>
              <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formatOptions.autoHeadings}
                  onChange={() => toggleFormat('autoHeadings')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="text-slate-600 dark:text-slate-300">Auto Detect</span>
              </label>

              {formatOptions.autoHeadings && (
                <>
                  <label className="inline-flex items-center space-x-1 cursor-pointer select-none text-slate-500 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={formatOptions.promoteAllCapHeadings}
                      onChange={() => toggleFormat('promoteAllCapHeadings')}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                    />
                    <span>ALL CAPS</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer select-none text-slate-500 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={formatOptions.promoteNumberedHeadings}
                      onChange={() => toggleFormat('promoteNumberedHeadings')}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                    />
                    <span>Numbered / Roman</span>
                  </label>
                </>
              )}
            </div>

            {/* Smart Bolding Group */}
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Bold className="w-3.5 h-3.5 text-indigo-500" />
                Auto-Bold:
              </span>
              <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formatOptions.boldTermsBeforeColon}
                  onChange={() => toggleFormat('boldTermsBeforeColon')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="text-slate-600 dark:text-slate-300">Before Colons</span>
              </label>
              <label className="inline-flex items-center space-x-1 cursor-pointer select-none text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={formatOptions.boldLeadingBulletWords}
                  onChange={() => toggleFormat('boldLeadingBulletWords')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                />
                <span>Lead Bullets</span>
              </label>
              <label className="inline-flex items-center space-x-1 cursor-pointer select-none text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={formatOptions.boldDates}
                  onChange={() => toggleFormat('boldDates')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                />
                <span>Dates</span>
              </label>
              <label className="inline-flex items-center space-x-1 cursor-pointer select-none text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={formatOptions.boldMilestoneTags}
                  onChange={() => toggleFormat('boldMilestoneTags')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                />
                <span>[Tags]</span>
              </label>
            </div>

            {/* Paragraph & Spacing Group */}
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formatOptions.academicIndent}
                  onChange={() => toggleFormat('academicIndent')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Indent className="w-3 h-3 text-slate-400" />
                  Academic Indent (1.5rem)
                </span>
              </label>

              <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formatOptions.normalizeLists}
                  onChange={() => toggleFormat('normalizeLists')}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="text-slate-600 dark:text-slate-300">Clean Bullets</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: Typography Controls */}
        {activeTab === 'typography' && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs">
            {/* Font Family Selector */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Font:</span>
              <select
                value={typography.fontFamily}
                onChange={(e) => setTypography(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {fontOptions.map(font => (
                  <option key={font.id} value={font.id} className="dark:bg-slate-800">
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Font Size Slider */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Size:</span>
              <input
                type="range"
                min="10"
                max="18"
                step="1"
                value={typography.fontSize}
                onChange={(e) => setTypography(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-20 accent-indigo-600 cursor-pointer"
              />
              <span className="w-8 text-right font-mono text-slate-600 dark:text-slate-300">
                {typography.fontSize}pt
              </span>
            </div>

            {/* Line Height Selector */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Line Height:</span>
              <div className="flex items-center space-x-1">
                {lineHeightOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTypography(prev => ({ ...prev, lineHeight: opt.value }))}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                      typography.lineHeight === opt.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paragraph Spacing Slider */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Paragraph Gap:</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.25"
                value={parseFloat(typography.paragraphSpacing)}
                onChange={(e) => setTypography(prev => ({ ...prev, paragraphSpacing: `${e.target.value}rem` }))}
                className="w-20 accent-indigo-600 cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-slate-600 dark:text-slate-300">
                {typography.paragraphSpacing}
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: Page Setup & Layout Controls */}
        {activeTab === 'page' && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs">
            {/* Page Size & Orientation */}
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Paper:</span>
              <select
                value={pageSetup.pageSize}
                onChange={(e) => setPageSetup(prev => ({ ...prev, pageSize: e.target.value }))}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="a4" className="dark:bg-slate-800">A4 (210 × 297 mm)</option>
                <option value="letter" className="dark:bg-slate-800">US Letter (8.5 × 11 in)</option>
              </select>

              <select
                value={pageSetup.orientation}
                onChange={(e) => setPageSetup(prev => ({ ...prev, orientation: e.target.value }))}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="portrait" className="dark:bg-slate-800">Portrait</option>
                <option value="landscape" className="dark:bg-slate-800">Landscape</option>
              </select>
            </div>

            {/* Margins */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Margins:</span>
              <div className="flex items-center space-x-1">
                {marginPresets.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => setPageSetup(prev => ({ ...prev, marginMm: preset.value }))}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                      pageSetup.marginMm === preset.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label} ({preset.value}mm)
                  </button>
                ))}
              </div>
            </div>

            {/* Running Header Input */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Header:</span>
              <input
                type="text"
                placeholder="Recurring document header..."
                value={pageSetup.runningHeader}
                onChange={(e) => setPageSetup(prev => ({ ...prev, runningHeader: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
              />
            </div>

            {/* Page Numbering */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Footer Number:</span>
              <select
                value={pageSetup.pageNumbering}
                onChange={(e) => setPageSetup(prev => ({ ...prev, pageNumbering: e.target.value }))}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="right" className="dark:bg-slate-800">Right-aligned</option>
                <option value="center" className="dark:bg-slate-800">Centered</option>
                <option value="none" className="dark:bg-slate-800">None</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar when exporting */}
      {isExporting && (
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${exportProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
