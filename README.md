# Insta Text to PDF Tool 📄✨

> Transform plain text and unstructured notes into publication-grade, formatted documents and vector-sharp PDFs in real-time — 100% client-side with zero server latency or data collection.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)

---

## 🌟 Key Features

- **Intelligent Auto-Formatting Engine**:
  - **Auto-Headings Detection**: Promotes ALL CAPS lines, numbered outlines (`1. Introduction`), Roman numerals (`Section I:`), and standalone unpunctuated lines into structured headings.
  - **Smart Auto-Bolding**: Automatically bolds terms before colons (`Note:`, `Important:`), leading bullet keywords, ISO/written dates, and milestone tags (`[URGENT]`, `[MILESTONE]`, `[DONE]`).
  - **Spacing & Paragraph Normalization**: Collapses excessive blank lines, formats list tokens (`-`, `*`, `•`), and supports academic/novel first-line indentation (`1.5rem`).
- **Live Paper Preview**:
  - Accurate physical dimensions for **A4** (210 × 297 mm) and **US Letter** (8.5 × 11 in) in Portrait and Landscape.
  - Customizable margins, running headers, and page footers.
  - Interactive zoom (50% to 150%) and fullscreen viewing mode.
- **Dual-Engine PDF Export**:
  - **Direct PDF Download**: Client-side high-DPI PDF generation with real-time multi-stage progress indication.
  - **Browser Native Print**: Clean CSS `@media print` rules with orphan/widow prevention (`break-inside: avoid`) for 100% vector-sharp selectable text.
- **100% Client-Side Privacy**: Zero server uploads, zero network telemetry, total confidentiality.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/GopinadhYdv/insta-pdf-to-text.git

# Navigate to project directory
cd insta-pdf-to-text

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running locally at `http://127.0.0.1:5173/`.

### Building for Production

```bash
npm run build
```

The optimized static assets will be output to the `dist/` directory, ready for deployment on Vercel, Netlify, or GitHub Pages.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Markdown / Text Engine**: Marked + Custom Regex Tokenizer
- **PDF Engines**: jsPDF & html2pdf.js + CSS Print Engine

---

## 📄 License

MIT License. Free for personal and commercial use.
