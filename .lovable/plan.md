

## Whiteboard: Inline Text + Drag-to-Move

The current pixel-based (ImageData) approach cannot support moving shapes or inline text editing. This requires a fundamental shift to a **retained-mode architecture** where shapes are stored as objects and the canvas is re-rendered from that list on every change.

### Architecture Change

Replace the ImageData undo stack and direct pixel drawing with:

**Shape data model:**
```ts
type ShapeType = "rectangle" | "circle" | "arrow" | "text";

interface Shape {
  id: string;
  type: ShapeType;
  x: number; y: number;
  width: number; height: number;
  color: string;
  text?: string; // for text shapes
}
```

**State:**
- `shapes: Shape[]` — the source of truth
- `undoStack: Shape[][]` — snapshots of shapes array (max 20)
- `selectedShapeId: string | null` — for drag-to-move
- `editingShapeId: string | null` — for inline text input

**Render loop:** A single `renderAll()` function iterates `shapes` and draws each to canvas (dot grid first, then shapes in order). Called after every state change.

### Tool Behaviors

1. **Rectangle / Circle / Arrow** — unchanged drag-to-create, but now creates a `Shape` object pushed to `shapes[]`. Rubber-band preview draws a temporary shape during drag without adding to state.

2. **Text** — click on canvas creates a text shape at that position. An HTML `<input>` overlay is positioned exactly over the click point (using absolute positioning relative to the canvas container). On blur/Enter, the typed text is stored in the shape and rendered on canvas. No more `prompt()`.

3. **Move tool (new)** — add a `Move` tool (lucide `Move` icon) to the toolbar. When active:
   - MouseDown: hit-test shapes in reverse order (topmost first) to find which shape is under cursor. Select it.
   - MouseDrag: update selected shape's x/y.
   - MouseUp: finalize position, push undo, save.

### Hit Testing

- Rectangle: point-in-rect check
- Circle: point-in-ellipse check  
- Arrow: distance-to-line-segment < threshold
- Text: point-in-bounding-box (measure text width/height)

### Inline Text Input

An absolutely-positioned `<input>` element overlaid on the canvas container. Styled to be transparent/minimal so it looks like typing directly on the canvas. On commit (Enter/blur), the input is hidden and the text is drawn via canvas `fillText`.

### Persistence

No change needed — `renderAll()` produces the same canvas, and `toDataURL()` still captures it for saving. The shapes array itself doesn't need to be persisted (the PNG snapshot is sufficient). However, to support editing shapes after reload, we should also serialize the `shapes[]` array into the whiteboard data. We can store a JSON object `{ png: string, shapes: Shape[] }` instead of a raw PNG string, with backward compatibility for existing plain PNG strings.

### Changes Summary

**`src/components/documents/Whiteboard.tsx`** — Full rewrite:
- Shape data model and state management
- `renderAll()` function replacing direct draw calls
- Move tool with hit-testing
- Inline text input overlay (HTML input positioned over canvas)
- Undo stack stores `Shape[]` snapshots instead of `ImageData`
- All existing tools (rect, circle, arrow, text) adapted to shape-based model

**`src/types/document.ts`** — Update `whiteboard` field type comment (now accepts JSON string with shapes + PNG, backward-compatible)

