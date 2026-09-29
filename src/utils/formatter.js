import { marked } from 'marked';

// Configure marked with sensible defaults
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Default formatting options
 */
export const defaultFormatOptions = {
  // Headings
  autoHeadings: true,
  promoteAllCapHeadings: true,
  promoteNumberedHeadings: true,
  promoteShortUnpunctuated: true,
  
  // Bolding
  boldTermsBeforeColon: true,
  boldLeadingBulletWords: true,
  boldDates: true,
  boldMilestoneTags: true,
  
  // Lists
  normalizeLists: true,
  
  // Spacing & Paragraphs
  normalizeSpacing: true,
  academicIndent: false,
  lineHeight: '1.5', // '1.25', '1.5', '1.75', '2.0'
  paragraphSpacing: '1rem', // '0.5rem' to '2.0rem'
};

/**
 * Intelligent Auto-Formatting Engine
 * Takes raw input text and applies formatting rules based on selected options.
 * Returns { formattedMarkdown, htmlContent, stats }
 */
export function formatText(rawText, options = defaultFormatOptions) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      formattedMarkdown: '',
      htmlContent: '',
      stats: calculateStats('')
    };
  }

  let text = rawText;

  // 1. Spacing & Paragraph Normalization
  if (options.normalizeSpacing) {
    // Standardize CRLF to LF
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Collapse 3+ consecutive empty lines into uniform paragraph breaks (two newlines)
    text = text.replace(/\n{3,}/g, '\n\n');
    // Trim trailing whitespace on lines
    text = text.split('\n').map(line => line.trimEnd()).join('\n');
  }

  // 2. Line by line processing for Headings and Lists
  const lines = text.split('\n');
  const processedLines = [];

  // Roman numeral regex pattern
  const romanNumeralRegex = /^(?:Section|Chapter|Part)?\s*([IVXLCDM]+)[\.:\-\s]+(.+)$/i;
  // Numbered heading pattern like "1. Introduction" or "1.1 Architecture" or "2) Overview"
  const numberedHeadingRegex = /^(\d+(\.\d+)*)[\.\)\:\-\s]+([A-Z][\w\s\-,/]+)$/;
  // Milestone tag pattern
  const milestoneTagRegex = /(\[(?:URGENT|MILESTONE|TODO|DONE|IN PROGRESS|PRIORITY|HIGH|MEDIUM|LOW|CRITICAL|ACTION)\])/gi;
  // Common date patterns (e.g. 2026-09-28, Sep 28 2026, 28th October 2026, Q3 2026)
  const dateRegex = /\b(?:(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2})|(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})|(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:,)?\s+\d{4})|(?:Q[1-4]\s+\d{4}))\b/g;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Check if line already has markdown heading syntax
    const isExplicitHeading = /^(#{1,6})\s+/.test(trimmed);

    // Skip empty lines
    if (!trimmed) {
      processedLines.push('');
      continue;
    }

    // List and Bullet formatting
    if (options.normalizeLists && !isExplicitHeading) {
      // Normalize common bullet characters (*, +, •, -, –) to standard markdown dash
      if (/^[\*\+•–]\s+/.test(trimmed)) {
        line = trimmed.replace(/^[\*\+•–]\s+/, '- ');
      }
    }

    // Auto-Headings Detection
    if (options.autoHeadings && !isExplicitHeading) {
      const isBulletOrList = /^([*\-+•–]|\d+[\.\)])\s+/.test(trimmed);
      const endsWithPunctuation = /[.,;:!?]$/.test(trimmed);
      const isShort = trimmed.length > 2 && trimmed.length < 65;
      // Lines like "Date: value", "Author: name" — skip as heading candidates
      const isMetadataLine = /^[A-Za-z\s]{2,30}:\s+\S/.test(trimmed);

      // Check ALL CAPS Heading (at least 4 letters, no lower case letters, standalone short line)
      const isAllCaps = options.promoteAllCapHeadings &&
        isShort &&
        !endsWithPunctuation &&
        !isBulletOrList &&
        !isMetadataLine &&
        /^[A-Z0-9\s\-_–—:]{4,}$/.test(trimmed) &&
        /[A-Z]{2,}/.test(trimmed); // require at least 2 consecutive caps

      // Check Roman Numeral Heading
      const romanMatch = options.promoteNumberedHeadings && trimmed.match(romanNumeralRegex);

      // Check Numbered Heading
      const numberedMatch = options.promoteNumberedHeadings && trimmed.match(numberedHeadingRegex);

      // Check Short Unpunctuated standalone title
      // Requires: capital start, at least 2 words OR single word >= 5 chars, blank lines around it
      const wordCount = trimmed.split(/\s+/).length;
      const isShortUnpunctuated = options.promoteShortUnpunctuated &&
        isShort &&
        !endsWithPunctuation &&
        !isBulletOrList &&
        !isMetadataLine &&
        (wordCount >= 2 || trimmed.length >= 5) &&
        /^[A-Z]/.test(trimmed) && // Starts with capital letter
        (i === 0 || lines[i - 1].trim() === '') && // Preceded by empty line or top of file
        (i === lines.length - 1 || lines[i + 1].trim() === ''); // Followed by empty line or EOF

      if (isAllCaps) {
        // Promote to H1 or H2 depending on length
        const level = trimmed.length < 35 ? '# ' : '## ';
        line = `${level}${trimmed}`;
      } else if (romanMatch) {
        line = `## ${trimmed}`;
      } else if (numberedMatch) {
        // "1. Introduction" -> H2, "1.1 Overview" -> H3
        const dots = (numberedMatch[1].match(/\./g) || []).length;
        const prefix = dots > 0 ? '### ' : '## ';
        line = `${prefix}${trimmed}`;
      } else if (isShortUnpunctuated) {
        // If it's the very first line of doc, make it H1; otherwise H2
        const level = (i === 0 || (i === 1 && lines[0].trim() === '')) ? '# ' : '## ';
        line = `${level}${trimmed}`;
      }
    }

    // Smart Auto-Bolding
    // Check if line is not a heading
    if (!line.trim().startsWith('#')) {
      // 1. Bold terms before colons — only at start of line or after bullet dash
      //    e.g. "Note: ..." or "- Key: ..." but NOT mid-sentence "hello: world"
      if (options.boldTermsBeforeColon) {
        // Match label-style: start of line OR after "- ", then 1-4 words, then colon
        line = line.replace(/^(-\s+)?([A-Z][A-Za-z0-9\s\/\-]{1,30}):(?!\/\/|\d)/, (match, dash, label) => {
          return `${dash || ''}**${label}:**`;
        });
      }

      // 2. Bold leading bullet words if enabled and not already bolded
      if (options.boldLeadingBulletWords && /^-\s+/.test(line)) {
        // If the bullet starts with 1-3 words followed by a colon or hyphen:
        line = line.replace(/^(-\s+)(?![\*#])([A-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z0-9]+){0,2})(:|(\s+-\s+))/, '$1**$2**$3');
      }

      // 3. Bold Milestone tags
      if (options.boldMilestoneTags) {
        line = line.replace(milestoneTagRegex, '**$1**');
      }

      // 4. Bold Dates
      if (options.boldDates) {
        line = line.replace(dateRegex, (match) => {
          // Avoid double bolding
          return `**${match}**`;
        });
      }

      // Cleanup any accidental double asterisks (e.g. ****Term:****)
      line = line.replace(/\*{4,}/g, '**');
    }

    processedLines.push(line);
  }


  const formattedMarkdown = processedLines.join('\n');

  // Convert markdown to clean HTML via marked
  let htmlContent = '';
  try {
    htmlContent = marked.parse(formattedMarkdown);
  } catch (err) {
    console.error('Markdown parse error:', err);
    htmlContent = `<p>${escapeHtml(formattedMarkdown)}</p>`;
  }

  // Calculate statistics
  const stats = calculateStats(rawText, formattedMarkdown);

  return {
    formattedMarkdown,
    htmlContent,
    stats
  };
}

/**
 * Helper to escape raw HTML
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Calculates document metrics (words, chars, estimated reading time, pages)
 */
export function calculateStats(rawText, formattedText = '') {
  const text = rawText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  
  // Average reading speed: 200 words per minute
  const readingTimeMin = Math.ceil(words / 200) || 1;
  
  // Estimated pages: ~350-400 words per standard single-spaced A4 page
  const estimatedPages = Math.max(1, Math.ceil(words / 380));

  return {
    words,
    chars,
    charsNoSpaces,
    paragraphs,
    readingTimeMin,
    estimatedPages
  };
}

/**
 * Clean & Format One-Click Preset:
 * Trims whitespace, balances quotes, formats bullets, collapses excessive blanks.
 */
export function cleanAndFormatText(text) {
  if (!text) return '';
  
  let cleaned = text;

  // Standardize line breaks
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Trim trailing whitespace on each line
  cleaned = cleaned.split('\n').map(l => l.trimEnd()).join('\n');

  // Collapse 3+ empty lines to 2
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Normalize bullet points (*, +, •, –, —) to '-'
  cleaned = cleaned.replace(/^[\t ]*[•*+–—]\s+/gm, '- ');

  // Fix irregular spacing after punctuation (e.g., "Hello .World" -> "Hello. World")
  cleaned = cleaned.replace(/\s+([.,;:!?])/g, '$1');
  cleaned = cleaned.replace(/([.,;:!?])(?=[A-Za-z])/g, '$1 ');

  // Clean double spaces inside lines (excluding markdown double space at line end)
  cleaned = cleaned.split('\n').map(line => {
    return line.replace(/[ \t]{2,}/g, ' ');
  }).join('\n');

  // Fix unmatched straight quotes or normalize smart quotes to standard clean quotes
  cleaned = cleaned.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

  return cleaned.trim();
}

/**
 * Sample Templates
 */
export const SAMPLE_TEMPLATES = {
  meetingNotes: `EXECUTIVE PRODUCT SYNC
Date: September 28, 2026
Location: Virtual Conference Room A
Attendees: Alex Rivera (Lead Architect), Sarah Chen (Product), Marcus Vance (Design)

1. Executive Summary
The primary objective of today's session is to review the release roadmap for Insta Text to PDF Tool. All stakeholders agreed on finalizing the client-side vector export pipeline before Q4 2026.

2. Key Discussion Items
Current Performance: Real-time debounced preview renders in under 50ms with zero server latency.
Security Policy: Zero-telemetry posture verified. No user text or generated PDF ever leaves the browser.
Typography Engine: High-fidelity print styles implemented with custom font families including Inter, Merriweather, and JetBrains Mono.

3. Action Items & Deliverables
- [URGENT] Sarah Chen: Finalize end-to-end documentation for offline usage by 2026-10-05.
- [MILESTONE] Marcus Vance: Deliver updated high-contrast accessibility themes by 2026-10-12.
- [DONE] Alex Rivera: Implement vector PDF export with selectable text and automatic page-break calculations.

4. Next Steps
Review meeting scheduled for 2026-10-15 at 10:00 AM.
Note: Please ensure all team pull requests are merged prior to code freeze.`,

  projectProposal: `PROJECT PROPOSAL: VECTOR DOCUMENT ENGINE
Author: SIGMA
Status: Approved for Production
Target Release: Q4 2026

I. Project Vision
In an era prioritizing user privacy and zero-trust computing, modern document workflows must execute entirely on device. The Insta Text to PDF Tool provides instant, intelligent normalization of unstructured thoughts into presentation-grade deliverables.

II. Architecture & Design Principles
Local-First Architecture: 100% in-browser computation utilizing Web Workers and React rendering trees.
Intelligent Typography: Automatic detection of hierarchical headings, terms preceding colons, and chronological tags.
Page-Break Integrity: Sophisticated CSS print page-break heuristics preventing orphaned headers or split bullet hierarchies.

III. Technical Milestones
- Milestone 1: Regex tokenizer and real-time formatting pipeline [DONE]
- Milestone 2: Multi-page physical A4 canvas preview with accurate shadow boundaries [DONE]
- Milestone 3: High-resolution client-side vector PDF generation [IN PROGRESS]
- Milestone 4: Offline PWA manifest and local storage persistence [TODO]

IV. Compliance & Privacy
Data Retention: None. All inputs remain strictly ephemeral within local browser memory.
Encryption: Client-side sandbox isolation enforced by standard browser runtime security.`,

  academicAbstract: `ANALYSIS OF CLIENT-SIDE COMPILATION PIPELINES FOR TEXT RENDERING
Lead Researcher: Dr. Elena Rostova
Department of Computer Science, University of Technology
Published: 2026-09-28

Abstract
Client-side web applications have achieved unprecedented execution performance through modern WebAssembly and optimized JavaScript runtime engines. This paper examines the algorithmic latency of regular-expression document normalizers paired with real-time vector document compilation.

Section 1: Introduction
Traditional document transformation pipelines required asynchronous network transmission to remote server instances running headless rendering engines. This paradigm introduces latency overhead and compromises user confidentiality.

Section 2: Empirical Evaluation
Throughput Benchmark: Client-side processing achieved sub-15ms parsing latency for 50,000-character corpora.
Memory Overhead: Resident heap usage remained constant below 35 megabytes during continuous real-time debouncing.
Vector Selectability: Generated documents preserved full glyph coordinate tables, enabling native search and text selection.

Section 3: Conclusion
Decentralized, in-browser compilation represents a viable, highly performant replacement for server-dependent document engines.`,
};
