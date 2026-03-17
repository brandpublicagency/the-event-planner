

## Whiteboard for Event Layout Planning

A canvas-based drawing tool added below the document body in `DocumentEditor.tsx`, persisted as a base64 PNG string inside the existing `DocumentContent` type.

### Changes

**1. New component: `src/components/documents/Whiteboard.tsx`**

The main whiteboard component containing:
- A collapsible `Card` with "Whiteboard" header (using existing Collapsible from shadcn)
- A `<canvas>` element (~500px tall, full width) with a dot-grid background drawn via canvas
- Floating toolbar with: Rectangle, Circle, Arrow/Line, Text, Color picker (6 colors), Undo, Clear All, Download PNG
- State machine tracking current tool, color, and drawing actions
- All drawing via native Canvas 2D API — no new dependencies
- `onSave` callback that fires `canvas.toDataURL()` to parent

Drawing logic:
- Shapes drawn on mousedown→mousemove→mouseup (rubber-band preview)
- Text tool: click to place, prompt or inline input for label
- Undo stack: array of canvas snapshots (ImageData), pop to restore
- Clear all: confirmation dialog using existing `AlertDialog`
- Dot grid: drawn once as background layer, preserved on clear

**2. Update `src/types/document.ts`**

Add optional `whiteboard` field to `DocumentContent`:
```ts
export interface DocumentContent {
  type: "doc";
  html: string;
  text: string;
  whiteboard?: string; // base64 PNG
}
```

**3. Update `src/components/documents/DocumentEditor.tsx`**

- Import and render `<Whiteboard>` below `<DocumentContent>` inside the scrollable area
- Pass the current whiteboard data from `document.content.whiteboard` as initial state
- On whiteboard save, call `saveDocument` with the updated content including the base64 string

**4. Update `src/hooks/useDocumentState.ts`**

- Accept optional `whiteboard` string in `saveDocument` options
- Merge it into the `DocumentContent` object before saving

### Architecture notes

- Canvas snapshots for undo are kept in-memory (capped at ~20 steps)
- Whiteboard data persists in the same `content` JSON column — no schema migration needed
- The dot-grid background is redrawn on canvas resize/clear so it's always present
- Download button uses `canvas.toDataURL()` → anchor download trick (same pattern as `exportDocument` in `documentUtils.ts`)

