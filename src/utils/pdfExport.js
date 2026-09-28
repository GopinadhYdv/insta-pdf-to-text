import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

/**
 * Triggers browser confetti animation on successful PDF generation
 */
export function fireSuccessConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']
    });
  } catch (e) {
    // Non-fatal if canvas-confetti fails
  }
}

/**
 * Page dimensions in millimeters
 */
export const PAGE_DIMENSIONS = {
  a4: {
    portrait: { width: 210, height: 297 },
    landscape: { width: 297, height: 210 }
  },
  letter: {
    portrait: { width: 215.9, height: 279.4 },
    landscape: { width: 279.4, height: 215.9 }
  }
};

/**
 * Triggers native browser Print-to-PDF with clean @media print styles
 * Native browser print guarantees 100% vector-sharp selectable text
 */
export function triggerBrowserPrint() {
  window.print();
}

/**
 * Exports DOM element to high-resolution PDF client-side
 * @param {HTMLElement|string} element - DOM element or selector to export
 * @param {Object} config - Document layout configuration
 * @param {Function} onProgress - Progress status callback (percent, statusText)
 */
export async function exportDocumentToPdf(element, config = {}, onProgress = () => {}) {
  const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
  
  if (!targetElement) {
    throw new Error('Export target element not found in DOM.');
  }

  const {
    title = 'Document',
    pageSize = 'a4', // 'a4' or 'letter'
    orientation = 'portrait', // 'portrait' or 'landscape'
    marginMm = 20, // margin in millimeters
    exportMode = 'html2pdf' // 'html2pdf' | 'vector'
  } = config;

  const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'InstaDoc';
  const filename = `${sanitizedTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

  onProgress(15, 'Preparing document structure...');

  // Wait brief tick for rendering to settle
  await new Promise(r => setTimeout(r, 60));

  try {
    if (exportMode === 'vector') {
      // Direct jsPDF Vector Mode with selectable text
      onProgress(35, 'Generating vector document layout...');
      
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize.toLowerCase()
      });

      onProgress(65, 'Rendering vector typography & elements...');

      await doc.html(targetElement, {
        callback: function (pdfDoc) {
          onProgress(90, 'Finalizing PDF output...');
          pdfDoc.save(filename);
          onProgress(100, 'Download complete!');
          fireSuccessConfetti();
        },
        x: marginMm,
        y: marginMm,
        margin: [marginMm, marginMm, marginMm, marginMm],
        autoPaging: 'text',
        width: orientation === 'portrait' ? (pageSize === 'a4' ? 210 - 2 * marginMm : 215.9 - 2 * marginMm) : (pageSize === 'a4' ? 297 - 2 * marginMm : 279.4 - 2 * marginMm),
        windowWidth: targetElement.offsetWidth || 800
      });

      return filename;
    }

    // Default High-DPI html2pdf.js export mode
    onProgress(30, 'Calculating page geometries...');

    // Margin mapping [top, left, bottom, right] in mm
    const margins = [marginMm, marginMm, marginMm, marginMm];

    const opt = {
      margin: margins,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2.5, // 2.5x scale for sharp text rendering
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: pageSize.toLowerCase(),
        orientation: orientation,
        compress: true
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['h1', 'h2', 'h3', 'h4', 'li', 'blockquote', 'tr', '.avoid-break']
      }
    };

    onProgress(55, 'Rendering high-resolution pages...');
    
    // Create html2pdf worker
    const worker = html2pdf().set(opt).from(targetElement);

    // Track internal promise progression
    await worker.toPdf().get('pdf').then((pdf) => {
      onProgress(85, 'Assembling PDF stream...');
    });

    onProgress(95, 'Downloading PDF...');
    await worker.save();

    onProgress(100, 'Complete!');
    fireSuccessConfetti();

    return filename;
  } catch (error) {
    console.error('PDF export failed:', error);
    onProgress(0, 'Export failed');
    throw error;
  }
}
