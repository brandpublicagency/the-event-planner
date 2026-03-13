
Goal: fix 3 runtime issues in the document editor and then run the exact end-to-end checks you requested (`/`, `@`, image upload, autosave).

What I verified from the code + runtime data:
1) `@` mentions currently require at least 2 characters (`query.length < 2`), so typing just `@` or `@a` shows nothing.
2) Images are still broken because uploads are being sent with a global `Content-Type: application/json` header in `src/integrations/supabase/client.ts`.  
   - This forces storage uploads to save malformed multipart payloads instead of real image bytes.
   - I confirmed recent files in `storage.objects` still have `mimetype=application/json`.
3) Autosave logic is interval-only (30s) and can be unreliable for active editing sessions; it is not update-driven.
4) I could not execute your requested browser interaction test in the agent browser because that session is currently on `/login` (not authenticated).

Implementation plan:

1) Fix mention behavior (`@`) and slash separation (`/`)
- File: `src/components/documents/extensions/mention/MentionSuggestion.tsx`
  - Change minimum query threshold from 2 to 1 (or allow empty query with “top results”).
  - Keep trigger as `char: '@'`.
  - Restrict mention results to the “search” entities you want (events + tasks), removing document-editing command overlap.
- File: `src/components/documents/slashCommandSuggestion.ts`
  - Make trigger explicit (`char: '/'`) and keep a dedicated plugin key.
- File: `src/components/documents/SlashCommandExtension.ts`
  - Ensure slash suggestion config merges explicitly (no ambiguity from partial objects), so slash remains editing-only.

2) Fix image rendering root cause (global headers)
- File: `src/integrations/supabase/client.ts`
  - Remove global `'Content-Type': 'application/json'` header.
  - Keep only safe global headers (e.g., `X-Client-Info`) and let Supabase SDK set per-request content types.
- File: `src/components/documents/ImageUploadButton.tsx`
  - Add upload options with `contentType: file.type` (this path still misses it today).
- Keep existing `contentType` in:
  - `src/components/documents/DocumentEditor.tsx` (drop/paste)
  - `src/components/documents/ImageUploadListener.tsx` (slash/command upload)

3) Make autosave reliable and observable
- File: `src/components/documents/DocumentEditor.tsx`
  - Replace pure 30s polling with debounced autosave on editor updates (e.g., 1–2s after last edit).
  - Keep a slower fallback interval (optional) as safety.
  - Track dirty state and avoid marking “last saved” before a successful mutation.
- File: `src/hooks/useDocumentState.ts`
  - Return save success/failure from `saveDocument`.
  - Stabilize save callback and ensure failed saves do not advance the “already saved” marker.

4) End-to-end validation (after implementation)
- `/` test: typing `/` shows only document-editing commands.
- `@` test: typing `@` + one character returns event/task results.
- Image tests:
  - Toolbar upload
  - Slash-triggered upload
  - Paste / drag-drop
  - Confirm image renders immediately and after page reload.
  - Confirm `storage.objects.metadata->>'mimetype'` is `image/*`, not `application/json`.
- Autosave test:
  - Edit content, wait debounce window, reload, verify persisted.
  - Confirm `documents.updated_at` advances shortly after typing (without pressing Save).

Notes:
- Previously broken images (already stored as malformed JSON/multipart objects) will still be broken; they must be re-uploaded after the upload fix.
- Once authenticated in preview, I can run the full interactive verification flow exactly as requested.
