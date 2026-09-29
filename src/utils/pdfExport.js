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
    pageSize = 'a4',
    orientation = 'portrait',
    marginMm = 10,
    exportMode = 'html2pdf'
  } = config;

  const sanitizedTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'InstaDoc';
  const filename = `${sanitizedTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

  onProgress(15, 'Preparing document structure...');

  // --- START FIX FOR HTML2CANVAS CUTOFF & DOUBLE MARGINS ---
  // To prevent html2canvas from miscalculating the bounding box due to CSS transforms (zoom),
  // and to prevent double margins (screen padding + PDF margin), we manipulate the live DOM
  // right before capture, then restore it.
  const parentWithScale = targetElement.parentElement;
  const originalTransform = parentWithScale ? parentWithScale.style.transform : '';
  const originalTransition = parentWithScale ? parentWithScale.style.transition : '';
  
  const originalPadding = targetElement.style.padding;
  const originalWidth = targetElement.style.width;
  const originalShadow = targetElement.style.boxShadow;
  const originalBorder = targetElement.style.border;
  const originalMinHeight = targetElement.style.minHeight;

  // Calculate exact content width (Paper - Margins)
  const isA4 = pageSize === 'a4';
  const isPortrait = orientation === 'portrait';
  const paperWidthMm = isA4 ? (isPortrait ? 210 : 297) : (isPortrait ? 215.9 : 279.4);
  const contentWidthMm = paperWidthMm - (marginMm * 2);

  try {
    // 1. Force 100% scale and exact content width
    if (parentWithScale) {
      parentWithScale.style.transition = 'none';
      parentWithScale.style.transform = 'scale(1)';
    }

    targetElement.style.padding = '0';
    targetElement.style.width = `${contentWidthMm}mm`;
    targetElement.style.minHeight = 'auto'; // let it flow naturally
    targetElement.style.boxShadow = 'none';
    targetElement.style.border = 'none';

    // Wait for the browser to reflow layout synchronously
    await new Promise(r => setTimeout(r, 100));

    if (exportMode === 'vector') {
      onProgress(35, 'Generating vector document layout...');
      const doc = new jsPDF({ orientation: orientation, unit: 'mm', format: pageSize.toLowerCase() });
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
        margin: marginMm,
        autoPaging: 'text',
        width: contentWidthMm,
        windowWidth: targetElement.scrollWidth || 1024
      });
      return filename;
    }

    // Default html2pdf export
    onProgress(30, 'Calculating page geometries...');

    const opt = {
      margin: marginMm,
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 },
      enableLinks: true,
      html2canvas: {
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: targetElement.scrollWidth + 50 // pad slightly to prevent wrap bug
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
    await html2pdf().set(opt).from(targetElement).save();
    
    onProgress(100, 'Complete!');
    fireSuccessConfetti();

    return filename;
  } catch (error) {
    console.error('PDF export failed:', error);
    onProgress(0, 'Export failed');
    throw error;
  } finally {
    // 2. Restore all UI styles instantly
    if (parentWithScale) {
      parentWithScale.style.transform = originalTransform;
      // Small delay before restoring transition so the snap back is instant
      setTimeout(() => {
        if (parentWithScale) parentWithScale.style.transition = originalTransition;
      }, 50);
    }
    targetElement.style.padding = originalPadding;
    targetElement.style.width = originalWidth;
    targetElement.style.minHeight = originalMinHeight;
    targetElement.style.boxShadow = originalShadow;
    targetElement.style.border = originalBorder;
  }
}
