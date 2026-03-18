

## Whiteboard Enhancements: Delete, Connectors, Rounded Rectangles

### 1. Delete selected shapes (Delete/Backspace)

- Add `selectedShapeId` state to track which shape is selected
- In Move tool mousedown, set `selectedShapeId` on hit
- Draw a selection indicator (dashed border) around the selected shape in `renderAll`
- Add a `keydown` event listener on the canvas container (make it focusable with `tabIndex={0}`) that listens for Delete/Backspace, removes the selected shape from `shapes[]`, pushes undo, and saves
- Clicking empty space or switching tools clears selection

### 2. Connectors between shapes

Add a new data type and drawing tool for connectors:

```ts
interface Connector {
  id: string;
  fromShapeId: string;
  toShapeId: string;
  color: string;
}
```

- Store `connectors: Connector[]` alongside `shapes` in state and persistence
- When Move tool is active and a shape is hovered/selected, render small "+" circles at the shape's edge midpoints (right, bottom, left, top) as connector anchors — drawn in `renderAll`
- Clicking a "+" anchor starts a connector drag: track `connectingFrom: { shapeId, anchorSide }` state
- During drag, draw a temporary arrow line from the anchor point to the cursor
- On mouseup, hit-test if cursor is over another shape — if yes, create a `Connector` linking the two shapes; if no, cancel
- `renderAll` draws connectors as arrow lines between the edge midpoints of the connected shapes (calculating the closest edge pair or using center-to-center with edge intersection)
- Connectors move automatically when shapes are dragged (since they reference shape IDs, not coordinates)
- Delete/Backspace also works on connectors if one is selected

### 3. Rounded rectangle corners (7px radius)

- In `drawShape`, replace `ctx.fillRect(...)` for rectangles with `ctx.beginPath(); ctx.roundRect(x, y, w, h, 7); ctx.fill();`
- `roundRect` is well-supported in modern browsers

### File changes

**`src/components/documents/Whiteboard.tsx`** — all changes in this single file:
- Add `Connector` interface, `connectors` state, `selectedShapeId` state, `connectingFrom` state
- Update `WhiteboardData` to include `connectors`
- Update `parseInitialData` to restore connectors
- Update `renderAll` to draw connectors, selection highlight, and connector anchor "+" icons on hovered/selected shapes
- Update `handleMouseDown` to detect clicks on "+" anchors and start connector drag
- Update `handleMouseMove` to handle connector drag preview
- Update `handleMouseUp` to finalize connector creation
- Add keydown handler for Delete/Backspace to remove selected shape (and its connectors) or selected connector
- Change rectangle drawing to use `roundRect` with 7px radius
- Make canvas container focusable (`tabIndex={0}`)

