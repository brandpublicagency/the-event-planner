

## Fix: Print Only Document Content on A4 with 1cm Margins

### Problem
The current `useReactToPrint` approach prints via the browser's print dialog, which captures UI chrome and doesn't reliably enforce A4 with 1cm margins. The `printRef` points to `DocumentContent`'s wrapper div which includes click handlers and flex styling not suited for print.

### Solution
Replace `useReactToPrint` with a custom print approach: open a new window containing only the editor's HTML content, with an inline `@page` rule enforcing A4 size and 1cm margins, then trigger `window.print()`.

### Changes

**`src/components/documents/DocumentActions.tsx`**
- Remove `useReactToPrint` import and hook
- Remove `printRef` prop (no longer needed)
- Replace print handler with a function that:
  1. Gets the editor HTML from the `content` prop
  2. Opens a new window with a full HTML document containing:
     - `@page { size: A4; margin: 1cm; }` CSS rule
     - Basic typography styles matching the editor (font, headings, lists, blockquotes, tables)
     - The document title as an `<h1>` followed by the content HTML
  3. Calls `window.print()` then closes the window

**`src/components/documents/DocumentEditor.tsx`**
- Remove `contentRef` (no longer needed for printing)
- Remove `printRef` prop from `<DocumentActions>`
- Ensure `content={editor?.getHTML()}` is still passed (already is)

**`src/styles/print.css`**
- Can be simplified/removed since printing now happens in a separate window with its own styles

### Key snippet
```typescript
const handlePrint = () => {
  if (!content) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html><head><title>${document.title}</title>
    <style>
      @page { size: A4; margin: 1cm; }
      body { font-family: sans-serif; font-size: 12pt; line-height: 1.6; color: #000; }
      h1 { font-size: 18pt; } h2 { font-size: 16pt; } h3 { font-size: 14pt; }
      /* ... table, list, blockquote styles */
    </style></head>
    <body><h1>${document.title}</h1>${content}</body></html>
  `);
  printWindow.document.close();
  printWindow.onload = () => { printWindow.print(); printWindow.close(); };
};
```

