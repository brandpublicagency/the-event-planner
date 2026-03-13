

## Plan: Enhanced Document Editor with Slash Commands, Tables, and Rich Formatting

### Overview
Upgrade the TipTap editor with slash commands (Notion-style `/` menu), table support, image insertion, improved typography, task lists, text alignment, color, and a floating bubble toolbar — transforming it into a polished, modern editing experience.

### New TipTap Extensions to Install
- `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header` — full table support
- `@tiptap/extension-image` — image insertion (URL-based)
- `@tiptap/extension-text-align` — text alignment (left, center, right, justify)
- `@tiptap/extension-placeholder` — "Type '/' for commands..." placeholder text
- `@tiptap/extension-task-list`, `@tiptap/extension-task-item` — checkbox task lists
- `@tiptap/extension-color`, `@tiptap/extension-text-style` — text color
- `@tiptap/extension-typography` — smart quotes, dashes, ellipsis auto-replacement

### 1. Slash Command Menu (`SlashCommandMenu.tsx`)
- New extension built on `@tiptap/suggestion` (already installed)
- Typing `/` opens a floating dropdown with categorized commands:
  - **Basic**: Text, Heading 1/2/3, Bullet List, Numbered List, Task List, Quote, Divider
  - **Media**: Image (prompts for URL), Link Preview, Code Block
  - **Advanced**: Table (inserts 3x3), Highlight, Callout
- Keyboard navigation (arrow keys, Enter to select, Esc to close)
- Filter by typing after `/` (e.g., `/tab` shows "Table")
- Renders as a popover anchored to cursor position

### 2. Update `editorExtensions.ts`
- Add all new extensions (Table, Image, TextAlign, Placeholder, TaskList, Color, Typography)
- Configure Placeholder with "Type '/' for commands..."
- Register the slash command suggestion extension

### 3. Floating Bubble Toolbar (`BubbleToolbar.tsx`)
- Replace the static top toolbar with a TipTap `BubbleMenu` that appears on text selection
- Contains: Bold, Italic, Underline, Strikethrough, Code, Link, Highlight, Text Color, Alignment
- Compact, dark-themed bar (like Notion's) floating above selected text
- Keep the static toolbar as well but make it more minimal — just structural items (heading selector, list toggles)

### 4. Enhanced Static Toolbar (`EditorToolbar.tsx`)
- Restructure into grouped sections:
  - **Block type dropdown**: Paragraph / H1 / H2 / H3 selector
  - **Insert group**: Table, Image, Divider, Code Block
  - **Text formatting**: remains as icon buttons
- Add table controls (add/delete row/column) that appear contextually when cursor is in a table

### 5. Table Styles (CSS)
- Add ProseMirror table styles to `index.css`:
  - Bordered cells, header row styling, hover effects on cells
  - Resize handles, selected cell highlighting
  - Consistent with the app's design tokens

### 6. Image Handling
- Toolbar button opens a dialog to enter image URL
- Image renders inline with resize handles (drag corners)
- Slash command `/image` triggers the same dialog

### 7. Editor Styles Update (`index.css`)
- Enhanced prose styles: better heading sizes, spacing, list indentation
- Table styles (borders, padding, header backgrounds)
- Task list checkbox styles
- Placeholder text styling
- Callout/blockquote styling with colored left border
- Image styles (max-width, border-radius, centering)

### Files Changed
| File | Action |
|------|--------|
| `package.json` | Add 9 new TipTap extensions |
| `src/components/documents/editorExtensions.ts` | Register all new extensions + slash command |
| `src/components/documents/SlashCommandMenu.tsx` | **New** — slash command dropdown component |
| `src/components/documents/SlashCommandExtension.ts` | **New** — TipTap suggestion extension for `/` |
| `src/components/documents/BubbleToolbar.tsx` | **New** — floating selection toolbar |
| `src/components/documents/EditorToolbar.tsx` | Restructure with block type dropdown + insert group |
| `src/components/documents/DocumentEditor.tsx` | Add BubbleToolbar, update toolbar placement |
| `src/components/documents/DocumentContent.tsx` | Minor class updates |
| `src/index.css` | Add table, task list, placeholder, image styles |

### Interaction Flow
1. User types `/` → slash command menu appears at cursor
2. User types to filter → menu narrows results
3. User selects command → block inserted, menu closes
4. User selects text → bubble toolbar appears with formatting options
5. Static toolbar remains at top for structural operations (headings, tables, images)

