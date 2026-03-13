

## Fix: Print, Image Upload, and Drag-and-Drop Images

### Issues Found

1. **Print button**: `content={editor?.getHTML()}` is evaluated at render time (line 145 of DocumentEditor.tsx). When the user clicks Print, the `content` prop holds the stale value from the last render -- which can be empty if the editor hadn't re-rendered. The fix is to pass the `editor` instance to `DocumentActions` and call `editor.getHTML()` at click time.

2. **Image upload button**: The `ImageUploadButton` component uploads to Supabase storage bucket `taskmanager-files`. The button itself looks correct in code. The issue is likely that the Supabase upload fails silently or the popup blocker prevents the file picker. Will add better error logging, but the main fix is ensuring the upload flow works. The component code looks structurally fine -- need to verify the bucket exists and is accessible.

3. **Drag-and-drop images**: TipTap's Image extension does not handle file drops by default. Need to add `handleDrop` and `handlePaste` handlers to `editorProps` in the editor config that intercept dropped/pasted image files, upload them to Supabase, and insert them.

### Changes

**`src/components/documents/DocumentActions.tsx`**
- Add optional `editor` prop (type `Editor | null`)
- In `handlePrint`, get content from `editor?.getHTML()` at click time instead of relying on the `content` prop
- Same for export handlers -- use `editor?.getHTML()` as fallback

**`src/components/documents/DocumentEditor.tsx`**
- Pass `editor={editor}` to `DocumentActions`
- Remove `content={editor?.getHTML()}` (no longer needed, or keep as fallback)

**`src/components/documents/editorExtensions.ts`** (or in `DocumentEditor.tsx` editorProps)
- Add `handleDrop` to `editorProps` that:
  1. Checks if dropped data contains image files
  2. Uploads each image to Supabase `taskmanager-files` bucket
  3. Inserts the image at the drop position
- Add `handlePaste` for pasted images (same logic)

### File Summary

| File | Change |
|------|--------|
| `DocumentActions.tsx` | Accept `editor` prop; call `getHTML()` at click time |
| `DocumentEditor.tsx` | Pass `editor` to `DocumentActions` |
| `DocumentEditor.tsx` | Add `handleDrop` and `handlePaste` in `editorProps` for image drag-and-drop upload |

