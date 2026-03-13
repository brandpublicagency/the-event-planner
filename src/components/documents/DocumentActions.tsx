
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, Printer, Trash2
} from "lucide-react";
import { Document } from '@/types/document';
import { exportAsPdf, exportAsDocx } from '@/utils/exportUtils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Editor } from '@tiptap/react';

export interface DocumentActionsProps {
  document: Document;
  content?: string;
  editor?: Editor | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Pre-process HTML for print/export:
 * - Replace empty link-preview divs with styled cards
 */
function preprocessHtmlForPrint(html: string): string {
  const container = window.document.createElement('div');
  container.innerHTML = html;

  // Replace link-preview nodes (empty divs with url attr)
  container.querySelectorAll('[data-link-preview]').forEach(el => {
    const url = el.getAttribute('url') || el.getAttribute('href') || '';
    if (!url) { el.remove(); return; }
    const card = window.document.createElement('div');
    card.style.cssText = 'border:1px solid #ddd;border-radius:6px;padding:10px 14px;margin:8px 0;background:#f9f9f9;';
    card.innerHTML = `<a href="${url}" style="color:#2563eb;text-decoration:underline;word-break:break-all;font-size:11pt;">${url}</a>`;
    el.replaceWith(card);
  });

  return container.innerHTML;
}

/**
 * Wait for all images inside an element to load (or fail), with a timeout.
 */
function waitForImages(root: HTMLElement, timeoutMs = 5000): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  if (imgs.length === 0) return Promise.resolve();

  return new Promise(resolve => {
    let settled = 0;
    const total = imgs.length;
    const done = () => { settled++; if (settled >= total) resolve(); };
    const timer = setTimeout(resolve, timeoutMs);

    imgs.forEach(img => {
      if (img.complete) { done(); return; }
      img.onload = () => done();
      img.onerror = () => done();
    });

    // Clear timer if all resolved early
    const check = setInterval(() => {
      if (settled >= total) { clearTimeout(timer); clearInterval(check); }
    }, 100);
  });
}

export function DocumentActions({ 
  document, 
  content,
  editor,
  onDelete,
}: DocumentActionsProps) {
  const getContent = () => editor?.getHTML() || content || '';

  const handlePrint = async () => {
    const rawHtml = getContent();
    if (!rawHtml) return;

    const processedHtml = preprocessHtmlForPrint(rawHtml);

    const iframe = window.document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    window.document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.write(`<!DOCTYPE html><html><head><title>${document.title}</title><style>
      @page { size: A4; margin: 1cm; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12pt; line-height: 1.6; color: #000; }
      h1 { font-size: 20pt; font-weight: 600; margin: 0 0 0.5em; }
      h2 { font-size: 16pt; font-weight: 600; margin: 0.8em 0 0.3em; }
      h3 { font-size: 14pt; font-weight: 600; margin: 0.6em 0 0.25em; }
      p { margin: 0.35em 0; }
      ul { list-style-type: disc; padding-left: 1.5em; }
      ol { list-style-type: decimal; padding-left: 1.5em; }
      li { margin: 0.2em 0; }
      blockquote { border-left: 3px solid #333; padding-left: 1em; margin: 0.5em 0; font-style: italic; color: #555; }
      table { border-collapse: collapse; width: 100%; margin: 1em 0; }
      th, td { border: 1px solid #ccc; padding: 0.4em 0.6em; text-align: left; }
      th { background-color: #f5f5f5; font-weight: 600; }
      code { background: #f0f0f0; padding: 0.1em 0.3em; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
      pre { background: #1a1a1a; color: #f0f0f0; padding: 0.75em 1em; border-radius: 6px; overflow-x: auto; margin: 0.5em 0; }
      pre code { background: none; color: inherit; padding: 0; }
      hr { border: none; border-top: 1px solid #ddd; margin: 1em 0; }
      img { max-width: 100%; height: auto; }
      mark { background-color: #fef08a; padding: 0.1em 0.15em; border-radius: 2px; }
      ul[data-type="taskList"] { list-style: none; padding-left: 0; }
      ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; }
      a { color: #2563eb; text-decoration: underline; }
    </style></head><body><h1>${document.title}</h1>${processedHtml}</body></html>`);
    doc.close();

    // Wait for images to load before printing
    await waitForImages(doc.body);

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => window.document.body.removeChild(iframe), 1000);
  };

  const handleExportAsPdf = () => {
    const html = getContent();
    if (html) exportAsPdf(preprocessHtmlForPrint(html), document.title);
  };

  const handleExportAsDocx = () => {
    const html = getContent();
    if (html) exportAsDocx(preprocessHtmlForPrint(html), document.title);
  };

  const hasContent = !!editor || !!content;

  return (
    <div className="flex items-center gap-1.5">
      {hasContent && (
        <Button 
          size="default" 
          variant="outline" 
          onClick={handlePrint}
          className="p-2 h-9 w-9"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="sr-only">Print</span>
        </Button>
      )}
      
      {hasContent && (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="default" variant="outline" className="p-2 h-9 w-9">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only">Export</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={handleExportAsPdf}>PDF</Button>
              <Button size="sm" onClick={handleExportAsDocx}>DOCX</Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      {onDelete && (
        <Button size="default" variant="outline" onClick={onDelete} className="p-2 h-9 w-9 text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </div>
  );
}
