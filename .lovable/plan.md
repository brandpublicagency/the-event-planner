

## Whiteboard Refinements: Pill Nodes, Text Wrapping, Visual Polish, Resize, Connection Labels

### 1. Data Model Updates

Add `shape` and `label` fields to `Connection`:

```ts
interface LayoutNode {
  // existing fields...
  shape: "rectangle" | "pill"; // NEW — default "rectangle" for backward compat
}

interface Connection {
  // existing fields...
  label?: string; // NEW — optional text label on the connection
}
```

Update `parseInitialData` to default `shape: "rectangle"` for existing nodes missing the field.

### 2. Pill Node Type

- Add `+ Add Pill` button in toolbar (uses `Circle` lucide icon or similar)
- Pill defaults: `width: 140, height: 48, shape: "pill"`
- Pill rendering: same `<div>` card but with `borderRadius: 9999px` instead of `12px`
- All behavior identical to rectangle nodes (drag, edit, connect, select, delete)

### 3. Text Wrapping & Auto-Height

- Replace `<input>` with `<textarea>` for editing (or use a `contentEditable` div)
- Display label: remove `truncate`, add `text-center break-words` with `wordBreak: "break-word"`, `whiteSpace: "pre-wrap"`
- Use a hidden measuring div or `ResizeObserver` to auto-grow node height based on text content
- Simpler approach: use `contentEditable` `<div>` for both display and edit modes — on double-click it becomes editable, on blur it commits. This naturally wraps and sizes.
- Actually simplest: keep the two-mode approach but use a `<textarea>` that auto-resizes, and for display use a `<span>` with `whitespace-pre-wrap` and no truncation. After edit, measure the text and update node height (min 60px rect / 48px pill).
- Node height in style uses `minHeight` instead of fixed `height`, letting content grow.

### 4. Visual Style Refinements

- Node cards: `background: #FFFFFF`, `border: 1px solid #E2E8F0`, `borderRadius: 12px` (rect) or `9999px` (pill)
- Box shadow: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- Font: `fontSize: 13px`, `color: #1E293B`, centered, sans-serif (app default)
- Selected state: `border: 1.5px solid #1E293B` — remove the blue ring, use a clean dark border
- Connection handles: `width: 6px, height: 6px`, filled `#94A3B8`, no border, only visible on hover/select

### 5. Node Resizing via Corner Handles

- When a node is selected, show 4 small resize handles at corners (small squares, ~6px)
- On mousedown on a resize handle, track which corner and start resizing
- On mousemove, update node width/height (and potentially x/y for top-left corners)
- Enforce minimum dimensions (120×60 rect, 140×48 pill)
- Store resize drag state in a ref similar to the existing `dragging` ref

### 6. Connection Labels

- Double-click a connection line to start editing its label
- Show a small `<input>` positioned at the midpoint of the bezier curve
- On commit, store `label` in the `Connection` object
- Render labels as SVG `<text>` at the bezier midpoint (calculate using cubic bezier formula at t=0.5)
- Labels styled: `fontSize: 11px`, `fill: #64748B`, white background rect behind text for readability

### 7. PNG Export Updates

- Update export to handle pill shapes (use `roundRect` with large radius for pills)
- Render connection labels in export
- Use correct border/shadow colors

### File Changes

**`src/components/documents/Whiteboard.tsx`** — single file, all changes:
- Update interfaces (`shape` on node, `label` on connection)
- Add `addPill` callback and toolbar button
- Restyle node cards (border, shadow, radius, font, selected state, handles)
- Replace text display/edit to support wrapping and auto-height
- Add resize handle rendering and drag logic
- Add connection label editing (double-click) and rendering (SVG text at bezier midpoint)
- Update `parseInitialData` for backward compat
- Update `exportPng` for pills and connection labels

