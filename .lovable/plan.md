

## Fix: Separate `/` (slash commands) from `@` (mentions)

The problem is that `MentionSuggestionConfig` in `src/components/documents/extensions/mention/MentionSuggestion.tsx` uses `char: '/'` — the same trigger character as the slash command menu. Both menus appear when typing `/`.

### Change

**`src/components/documents/extensions/mention/MentionSuggestion.tsx`** — Change `char: '/'` to `char: '@'` on line 8. This makes the mention search (events, tasks, documents, users) trigger on `@` instead of `/`.

That's the only change needed. The slash command extension already has its own `char: '/'` configured in `slashCommandSuggestion.ts`, so after this fix:
- `/` → slash command menu (text formatting, headings, lists, etc.)
- `@` → mention search (events, tasks, documents, users)

