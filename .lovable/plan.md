

## Fix: Print with Images/Links, Image Upload, Drag-and-Drop, and Autosave

### Root Cause Analysis

**Image upload / drag-and-drop / print images all fail for the same reason**: The `taskmanager-files` Supabase bucket is set to `public = false`. The code uses `getPublicUrl()` which generates a URL like `https://...supabase.co/storage/v1/object/public/taskmanager-files/...`, but since the bucket is private, these URLs return 404. Upload succeeds (RLS policies allow it), but the resulting image URL is broken.

Additionally, `allowed_mime_types` on the bucket is `[image/png, image/jpg, image/jpeg, application/pdf]` -- this blocks formats like `image/gif`, `image/webp`, `image/svg+xml`.

**Print not showing images**: The hidden iframe loads the HTML but images point to private bucket URLs that return 404. Also, print fires immediately without waiting for images to load.

**Print not showing link previews**: The stored HTML contains `<div url="..." data-link-preview=""></div>` -- empty divs because the actual content is rendered by React at runtime. The print iframe just gets empty divs.

**Autosave**: Not implemented. User wants a fixed interval save.

---

### Changes

#### 1. SQL Migration -- Make bucket public and allow all image types

```sql
UPDATE storage.buckets 
SET public = true, allowed_mime_types = NULL
WHERE id = 'taskmanager-files';
```

This fixes image upload, drag-and-drop, and image display in print/export in one step.

#### 2. `src/components/documents/DocumentActions.tsx` -- Fix print and link previews

- Before printing, pre-process the HTML:
  - Replace `<div data-link-preview="" url="..."></div>` divs with styled link cards showing the URL
  - Wait for all `<img>` elements to load before calling `print()`
- Add `onload` handler that waits for images, then prints

#### 3. `src/components/documents/DocumentEditor.tsx` -- Add autosave

- Add a `useEffect` with `setInterval` (every 30 seconds) that:
  - Checks if editor content has changed since last save (compare against a ref)
  - Calls `saveDocument({ showToast: false })` silently
  - Shows a subtle "Autosaved" indicator

#### 4. `src/utils/exportUtils.ts` -- Fix PDF and DOCX export

- **PDF**: Add `useCORS: true` to html2canvas config (already present), but also wait for images to load before rendering. Pre-process link preview divs same as print.
- **DOCX**: Currently strips all formatting into plain text. Improve to parse HTML headings, paragraphs, lists, bold/italic into proper docx elements.

#### 5. `src/components/documents/ImageUploadButton.tsx` -- Better error handling

- Add toast with actual error message from Supabase instead of generic "Failed to upload image"
- Log the full error object for debugging

#### 6. `src/components/documents/DocumentEditor.tsx` -- Fix drag-and-drop error handling

- Add user-facing toast notifications on drop/paste upload failure instead of silent `console.error`

### File Summary

| File | Change |
|------|--------|
| SQL migration | Make `taskmanager-files` bucket public, remove mime type restriction |
| `DocumentActions.tsx` | Pre-process link previews for print, wait for images to load |
| `DocumentEditor.tsx` | Add 30-second autosave interval with change detection |
| `exportUtils.ts` | Fix PDF image loading, improve DOCX HTML-to-docx parsing |
| `ImageUploadButton.tsx` | Better error messages |
| `DocumentEditor.tsx` | Add toast on drag-and-drop upload failure |

