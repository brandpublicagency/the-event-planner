

## Plan: Move document actions to header, make editor full-width

### Current State
- `DocumentsContainer` renders a `Header` with just a "Library" back button
- `DocumentEditor` has its own internal toolbar bar (line 108-136) with category selector, save button, print/download/delete actions
- Editor content is constrained to `max-w-3xl mx-auto` (line 145)

### Changes

**1. `DocumentEditor.tsx`**
- Remove the top bar (lines 108-136) containing category, save, and document actions
- Remove `max-w-3xl mx-auto` constraint from the content wrapper — make it full width with comfortable padding
- Export the action-related state/props so the parent can render them

**2. `DocumentsContainer.tsx`**
- Move category selector, save button, and document actions into the `Header`'s right side (via `children` or `secondaryAction`)
- `DocumentEditor` needs to expose its document state upward — simplest approach: lift the action rendering into `DocumentsContainer` by having `DocumentEditor` accept an `onReady` callback or by extracting document state into `DocumentsContainer`

**Better approach**: Have `DocumentEditor` render the header actions itself via a React portal or simply pass them up. Simplest: move the entire `Header` rendering inside `DocumentEditor` so it has access to document state, and remove the Header from `DocumentsContainer`.

### Final Approach
- **`DocumentsContainer`**: Remove the `Header` wrapper, let `DocumentEditor` handle everything
- **`DocumentEditor`**: Render the `Header` internally with:
  - Left: "Library" back button
  - Right: CategorySelector + SaveButton + DocumentActions (print, download, delete)
- Remove the internal border-b toolbar bar
- Remove `max-w-3xl mx-auto` from editor content area, use full width with padding

