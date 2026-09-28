import { formatText, cleanAndFormatText, calculateStats, defaultFormatOptions } from '../src/utils/formatter.js';

console.log('Testing formatter.js...');

// Test 1: Auto-Headings Detection
const sampleInput = `PROJECT ROADMAP
1. Introduction
This is the intro text without colon.

Section II: Architecture Details
Here is some architectural specification.

Important Notice:
- Task A: Completed on 2026-09-28
- [URGENT] Fix memory footprint before launch`;

const formatted = formatText(sampleInput, defaultFormatOptions);

console.log('--- Formatted Markdown Output ---');
console.log(formatted.formattedMarkdown);

// Assertions
if (!formatted.formattedMarkdown.includes('# PROJECT ROADMAP')) {
  throw new Error('Failed to promote ALL CAPS to H1');
}
if (!formatted.formattedMarkdown.includes('## 1. Introduction')) {
  throw new Error('Failed to promote numbered heading to H2');
}
if (!formatted.formattedMarkdown.includes('## Section II: Architecture Details')) {
  throw new Error('Failed to promote Roman numeral section to H2');
}
if (!formatted.formattedMarkdown.includes('**Important Notice:**')) {
  throw new Error('Failed to bold term before colon');
}
if (!formatted.formattedMarkdown.includes('**2026-09-28**')) {
  throw new Error('Failed to bold date');
}
if (!formatted.formattedMarkdown.includes('**[URGENT]**')) {
  throw new Error('Failed to bold milestone tag');
}

// Test 2: Clean and Format
const messyInput = `Hello    World  .   This is messy   \n\n\n\n• Item 1\n* Item 2`;
const cleaned = cleanAndFormatText(messyInput);
console.log('--- Cleaned Output ---');
console.log(cleaned);

if (cleaned.includes('\n\n\n')) {
  throw new Error('Failed to collapse 3+ empty lines');
}
if (!cleaned.includes('- Item 1') || !cleaned.includes('- Item 2')) {
  throw new Error('Failed to normalize bullet characters to -');
}

// Test 3: Stats
const stats = calculateStats(sampleInput);
console.log('--- Stats ---', stats);
if (stats.words === 0 || stats.chars === 0) {
  throw new Error('Failed to calculate stats');
}

console.log('All formatter unit tests passed successfully!');
