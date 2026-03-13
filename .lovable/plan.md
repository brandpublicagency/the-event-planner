

## Plan: Fix Build Errors + Add Drag-and-Drop Blocks & Keyboard Shortcuts Overlay

### Build Fixes (must do first)

**Error 1: CSS @import order**
`@import "./toast.css"` on line 6 of `src/index.css` must come before `@tailwind` directives. Move it to line 1.

**Error 2: `@tiptap/extension-image` v3.20.1 incompatible**
v3.x requires `ResizableNodeView` not exported by the installed `@tiptap/core` (v2.x). Downgrade `@tiptap/extension-image` to `^2.10.3` to match all other TipTap packages. Also downgrade `@tiptap/extension-placeholder` from `^3.20.1` to `^2.10.3` and `@tiptap/extension-table` from `^3.20.1` to `^2.10.3` for consistency.

---

### Feature 1: Drag-and-Drop Block Reordering

Add a drag handle (⠿ grip icon) that appears on hover to the left of each top-level block (paragraph, heading, list, table, etc.).

**Approach**: Create a TipTap plugin using `Plugin` + `Decoration` that:
- Detects mouse position over top-level nodes
- Shows a drag handle element positioned to the left of the hovered block
- Uses native HTML5 drag-and-drop on the handle to reorder blocks via ProseMirror transactions

**Files**:
| File | Action |
|------|--------|
| `src/components/documents/extensions/DragHandle.ts` | **New** — ProseMirror plugin that renders drag handles and handles drag events |
| `src/components/documents/editorExtensions.ts` | Register the DragHandle extension |
| `src/index.css` | Add drag handle styles (positioning, hover visibility, cursor) |

**Behavior**:
- Hovering a block shows a ⠿ icon in the left gutter
- Dragging the handle picks up the entire block node
- Dropping between blocks reorders them via ProseMirror node manipulation
- Subtle drop indicator line shown between blocks during drag

---

### Feature 2: Keyboard Shortcuts Overlay

A modal/dialog that appears when pressing `Cmd+/` (or `Ctrl+/`) showing all available shortcuts.

**Files**:
| File | Action |
|------|--------|
| `src/components/documents/KeyboardShortcutsOverlay.tsx` | **New** — Dialog component listing shortcuts grouped by category |
| `src/components/documents/DocumentEditor.tsx` | Add `useEffect` for `Cmd+/` listener, render overlay |

**Shortcut categories**:
- **Text Formatting**: Cmd+B (Bold), Cmd+I (Italic), Cmd+U (Underline), Cmd+Shift+H (Highlight), Cmd+E (Code)
- **Structure**: Cmd+Shift+1/2/3 (Headings), Cmd+Shift+7 (Numbered List), Cmd+Shift+8 (Bullet List), Cmd+Shift+9 (Task List)
- **Insert**: / (Slash commands), Cmd+K (Link)
- **General**: Cmd+Z (Undo), Cmd+Shift+Z (Redo), Cmd+S (Save)

**Design**: Clean modal with grouped rows, each showing the action name and a styled `<kbd>` element for the key combo. Matches the app's design system.

---

### Summary of all file changes

| File | Action |
|------|--------|
| `package.json` | Downgrade 3 TipTap extension versions |
| `src/index.css` | Fix @import order, add drag handle styles |
| `src/components/documents/extensions/DragHandle.ts` | **New** — drag handle ProseMirror plugin |
| `src/components/documents/editorExtensions.ts` | Register DragHandle extension |
| `src/components/documents/KeyboardShortcutsOverlay.tsx` | **New** — shortcuts modal |
| `src/components/documents/DocumentEditor.tsx` | Add Cmd+/ listener + overlay + Cmd+S save shortcut |

