

## Plan: Fix Document Editor Crash + Add Image Upload from Device

### Root Cause of Crash

Both `MentionNode` (name: `'mention'`) and `MentionExtension` (name: `'mention'`) are registered in `editorExtensions.ts`. TipTap throws a fatal error on duplicate extension names, crashing the entire `DocumentEditor` component.

### Fix 1: Resolve Duplicate Extension Name

**File: `src/components/documents/extensions/MentionNode.ts`**
- Rename the node from `'mention'` to `'mentionNode'` — update `name`, `parseHTML` tag selector, and any references.

OR (simpler, less breakage risk):

**File: `src/components/documents/editorExtensions.ts`**
- Remove `MentionExtension` from the extensions array since `MentionNode` already handles mention rendering. The `MentionExtension` adds suggestion/click/tooltip plugins for the same `'mention'` name — these need to be consolidated.
- Best approach: Rename `MentionExtension` to `'mentionSuggestion'` in `src/components/documents/extensions/mention/index.ts` so both can coexist.

### Fix 2: Add Image Upload from Device

**Approach**: Add a file input that uploads images to the existing `taskmanager-files` Supabase storage bucket, then inserts the public URL into the editor.

**New file: `src/components/documents/ImageUploadButton.tsx`**
- Renders a hidden `<input type="file" accept="image/*">` triggered by the toolbar button
- On file select: uploads to `taskmanager-files` bucket via Supabase storage SDK
- On success: calls `editor.chain().focus().setImage({ src: publicUrl }).run()`

**File: `src/components/documents/EditorToolbar.tsx`**
- Replace the `window.prompt('Enter image URL')` image button with the new `ImageUploadButton` component
- Keep URL option as fallback (dropdown with "Upload" and "From URL")

**File: `src/components/documents/SlashCommandExtension.ts`**
- Update the `/image` slash command to trigger a file picker instead of `window.prompt`
- Use a custom event or callback pattern so the slash command can open the file dialog

### Fix 3: Minor Improvements

**File: `src/components/documents/extensions/DragHandle.ts`**
- The drag handle uses `document.body.appendChild` which may leak on hot-reload. Add cleanup in `destroy()` (already present, just verify).

### Summary of Changes

| File | Change |
|------|--------|
| `src/components/documents/extensions/mention/index.ts` | Rename extension to `'mentionSuggestion'` |
| `src/components/documents/ImageUploadButton.tsx` | **New** — file upload component using Supabase storage |
| `src/components/documents/EditorToolbar.tsx` | Replace prompt-based image insert with upload button |
| `src/components/documents/SlashCommandExtension.ts` | Update `/image` command to trigger file picker |
| `src/components/documents/DocumentEditor.tsx` | No changes needed (already correct) |

