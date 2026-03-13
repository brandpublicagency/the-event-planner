

## Fix: Images not rendering + Slash/Mention overlap

### Issue 1: Images upload but don't render

**Root cause confirmed**: Files are being uploaded with `mimetype: application/json` instead of their actual image type. Verified by querying `storage.objects` metadata — all three uploaded images show `mimetype: application/json`. The browser receives the file as JSON, so it can't render it as an image.

The upload calls in `DocumentEditor.tsx` (drag-and-drop + paste handlers) and `ImageUploadListener.tsx` don't pass `contentType` to `supabase.storage.upload()`, so Supabase infers incorrectly.

**Fix**: Pass `{ contentType: file.type }` as the third argument to every `.upload()` call:
- `DocumentEditor.tsx` — two places (drop handler ~line 51, paste handler ~line 82)
- `ImageUploadListener.tsx` — one place (~line 32)

### Issue 2: `/` triggers both slash commands and mention search

**Root cause**: The `MentionSuggestion.tsx` file was updated to `char: '@'` but likely needs a rebuild to take effect. To ensure the change is picked up, I'll also add a `pluginKey` to the `slashCommandSuggestion.ts` to guarantee no plugin key collision, and update the placeholder text to reflect both triggers.

**Changes**:
- `slashCommandSuggestion.ts` — Add explicit `pluginKey` to prevent any collision
- `editorExtensions.ts` — Update placeholder to `"Type '/' for commands, '@' to mention..."`
- `MentionSuggestion.tsx` — Confirm `char: '@'` and add a comment for clarity

### File Summary

| File | Change |
|------|--------|
| `DocumentEditor.tsx` | Add `{ contentType: file.type }` to both upload calls |
| `ImageUploadListener.tsx` | Add `{ contentType: file.type }` to upload call |
| `slashCommandSuggestion.ts` | Add explicit `pluginKey` |
| `editorExtensions.ts` | Update placeholder text |

