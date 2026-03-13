

## Plan: Click-anywhere-to-type in Document Editor

### Problem
Clicking in the empty space below the editor content does nothing — the editor doesn't receive focus, so users can't start typing.

### Solution
Make the scrollable content area act as a click target. When clicking empty space (not on existing editor content), focus the editor at the end.

### Changes

**`src/components/documents/DocumentContent.tsx`**
- Expand the `document-content` wrapper to fill remaining height (`min-h-[500px] flex-1 cursor-text`)
- Add an `onClick` handler on the outer div: if the click target is the wrapper itself (not editor content), call `editor.commands.focus('end')`

**`src/components/documents/DocumentEditor.tsx`**
- Add `cursor-text` to the scrollable container div so it visually indicates it's editable space
- Add an `onClick` on the padded wrapper that focuses the editor at `'end'` when clicking below content

