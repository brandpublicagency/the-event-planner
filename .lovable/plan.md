

## Replace Whiteboard with Node-Based Layout Builder

Complete rewrite of `src/components/documents/Whiteboard.tsx` — replacing the canvas-based drawing tool with a DOM+SVG node-based diagram tool.

### Architecture

**No more `<canvas>`**. The entire system becomes:
- A `<div>` container with dot-grid CSS background (pannable via transform/translate)
- DOM nodes (`<div>` cards) for each node, absolutely positioned and draggable
- An `<svg>` overlay for connection lines (bezier curves)

**Data model:**
```ts
interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;  // default 120
  height: number; // default 60
  label: string;
}

interface Connection {
  id: string;
  fromNodeId: string;
  fromSide: "top" | "right" | "bottom" | "left";
  toNodeId: string;
  toSide: "top" | "right" | "bottom" | "left";
}

interface LayoutData {
  nodes: LayoutNode[];
  connections: Connection[];
}
```

### Nodes (DOM-based)

- White cards: `bg-white border border-gray-200 shadow-sm rounded-lg` absolutely positioned
- Default ~120×60px
- Label: `<span>` shown by default, click to replace with `<input>` for inline editing, commit on blur/Enter
- Draggable via mousedown on the card → mousemove updates x/y → mouseup finalizes
- Selected state: blue ring (`ring-2 ring-blue-400`)
- On hover/select: show 4 small handle dots (8px filled circles, `bg-blue-400 border-2 border-white`) at edge midpoints, positioned via absolute CSS

### Connections (SVG overlay)

- Full-size `<svg>` overlaid on the canvas with `pointer-events: none` (handles get `pointer-events: auto`)
- Click a handle dot on one node → sets `connectingFrom` state → mousemove draws a temp bezier to cursor → mouseup on another handle creates a `Connection`
- Bezier curves using `<path>` with cubic bezier: control points offset ~80px in the direction of the anchor side
- Stroke: `#CBD5E1`, `stroke-width: 1.5`, no arrowheads, no fill
- Selected connection: `stroke: #3b82f6`, `stroke-width: 2`
- Hit-testing connections for selection: invisible wider stroke `<path>` with `stroke-width: 12` and `pointer-events: stroke`

### Canvas (pannable)

- Outer container: `overflow: hidden`, fixed height (500px)
- Inner container: translated by `panOffset` state (`transform: translate(x, y)`)
- Panning: mousedown on empty space (not a node) → track drag → update panOffset
- Dot-grid: CSS `radial-gradient` background on the inner container — matches existing style (light gray dots on white, ~20px spacing)

### Toolbar (minimal, top)

- `+ Add Node` — creates a new node at center of visible area (accounting for pan offset)
- `🗑 Delete` — removes selected node (and its connections) or selected connection
- `↩ Undo` — pops from undo stack (snapshots of `{nodes, connections}`, max 20)
- `⬇ Export PNG` — uses `html-to-image` or `html2canvas` — actually we should use the existing approach: render to a temporary canvas. Since we're DOM-based now, we'll use the `toPng` from a simple approach: create a canvas, draw the dot grid, draw connections as lines, draw node rects with text. This keeps it dependency-free.

No color pickers, no shape selectors.

### Persistence

Same pattern — `onSave(JSON.stringify(layoutData))` debounced. Parse `initialData` on mount. Backward-compatible: if initialData is old format (has `shapes` key), start fresh.

### Export PNG

Since we're moving away from canvas, for PNG export we'll render programmatically to a temporary offscreen `<canvas>`: draw dot grid, draw bezier connections, draw rounded white rects with text labels. Same download trick.

### Files Changed

**`src/components/documents/Whiteboard.tsx`** — full rewrite (~400 lines, simpler than current 905 lines):
- `LayoutNode`, `Connection`, `LayoutData` interfaces
- React state: `nodes`, `connections`, `selectedNodeId`, `selectedConnectionId`, `connectingFrom`, `panOffset`, `undoStack`
- DOM rendering: map nodes to absolutely-positioned divs with inline edit
- SVG overlay for connections (bezier paths)
- Panning via mousedown/move on container
- Minimal toolbar with 4 buttons
- Undo stack, delete handler, export PNG
- Debounced save via `onSave` prop (unchanged interface)

No changes needed to `DocumentEditor.tsx` or `useDocumentState.ts` — the `Whiteboard` component keeps the same props interface (`initialData`, `onSave`).

