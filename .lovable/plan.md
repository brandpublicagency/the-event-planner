

## Fix: Build Error, Print, and Download Buttons

### Issues

1. **Build error**: `@tiptap/extension-color` is imported in `editorExtensions.ts` but not installed as a dependency.
2. **Print**: Opens a new tab instead of triggering the print dialog directly. The `window.open('', '_blank')` approach is being blocked or showing content in a tab. Fix: use `'_blank'` but with empty features string to force a popup, or better yet, use an iframe approach that triggers print without showing a visible tab.
3. **Download buttons**: Only PDF and DOCX needed (remove HTML option). The popover with 3 buttons should be replaced with just 2 buttons, or a simpler dropdown.

### Changes

**Install missing dependency**
- Add `@tiptap/extension-color` package.

**`src/components/documents/DocumentActions.tsx`**
- Fix print: Use a hidden iframe instead of `window.open` to avoid opening a visible tab. Create an iframe, write the styled HTML into it, call `contentWindow.print()`, then remove it.
- Remove HTML export button, keep only PDF and DOCX.
- Ensure `getContent()` calls `editor?.getHTML()` at click time (already does via the helper).

**Print approach (hidden iframe)**:
```typescript
const handlePrint = () => {
  const html = getContent();
  if (!html) return;
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.write(`<!DOCTYPE html><html><head>
    <style>@page { size: A4; margin: 1cm; } body { font-family: sans-serif; ... }</style>
  </head><body><h1>${document.title}</h1>${html}</body></html>`);
  doc.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  setTimeout(() => document.body.removeChild(iframe), 1000);
};
```

**Download buttons**: Replace the Popover with two inline icon buttons or a simpler popover with just PDF and DOCX options.

### File Summary

| File | Change |
|------|--------|
| `editorExtensions.ts` | No change needed (package install fixes build) |
| `DocumentActions.tsx` | Fix print (hidden iframe), remove HTML button, keep PDF + DOCX |
| Package install | Add `@tiptap/extension-color` |

