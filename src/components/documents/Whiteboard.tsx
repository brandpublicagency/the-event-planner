import { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Square,
  Circle,
  ArrowRight,
  Type,
  Move,
  Undo2,
  Trash2,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = "rectangle" | "circle" | "arrow" | "text" | "move";

interface Shape {
  id: string;
  type: "rectangle" | "circle" | "arrow" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

interface Connector {
  id: string;
  fromShapeId: string;
  toShapeId: string;
  color: string;
}

interface WhiteboardData {
  shapes: Shape[];
  connectors?: Connector[];
  png?: string;
}

const COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#ffffff", label: "White" },
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#22c55e", label: "Green" },
  { value: "#3b82f6", label: "Blue" },
];

const CANVAS_HEIGHT = 500;
const MAX_UNDO = 20;
const DOT_SPACING = 20;
const DOT_RADIUS = 1;
const ANCHOR_RADIUS = 8;
const ANCHOR_HIT_RADIUS = 12;
const RECT_RADIUS = 7;

interface WhiteboardProps {
  initialData?: string;
  onSave: (dataUrl: string) => void;
}

let shapeIdCounter = 0;
const genId = (prefix = "s") => `${prefix}_${Date.now()}_${++shapeIdCounter}`;

interface UndoSnapshot {
  shapes: Shape[];
  connectors: Connector[];
}

function parseInitialData(data?: string): { shapes: Shape[]; connectors: Connector[] } {
  if (!data) return { shapes: [], connectors: [] };
  try {
    const parsed = JSON.parse(data) as WhiteboardData;
    return {
      shapes: Array.isArray(parsed.shapes) ? parsed.shapes : [],
      connectors: Array.isArray(parsed.connectors) ? parsed.connectors : [],
    };
  } catch {
    return { shapes: [], connectors: [] };
  }
}

type AnchorSide = "top" | "right" | "bottom" | "left";

function getShapeCenter(s: Shape): { x: number; y: number } {
  if (s.type === "text") {
    const tw = (s.text?.length || 1) * 8;
    return { x: s.x + tw / 2, y: s.y + 9 };
  }
  if (s.type === "arrow") {
    return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
  }
  return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
}

function getAnchorPoints(s: Shape): Record<AnchorSide, { x: number; y: number }> {
  const c = getShapeCenter(s);
  let hw: number, hh: number;

  if (s.type === "text") {
    const tw = (s.text?.length || 1) * 8;
    hw = tw / 2;
    hh = 9;
  } else if (s.type === "arrow") {
    hw = Math.abs(s.width) / 2;
    hh = Math.abs(s.height) / 2;
  } else {
    hw = Math.abs(s.width) / 2;
    hh = Math.abs(s.height) / 2;
  }

  return {
    top: { x: c.x, y: c.y - hh },
    bottom: { x: c.x, y: c.y + hh },
    left: { x: c.x - hw, y: c.y },
    right: { x: c.x + hw, y: c.y },
  };
}

function getClosestAnchors(from: Shape, to: Shape): { from: { x: number; y: number }; to: { x: number; y: number } } {
  const fa = getAnchorPoints(from);
  const ta = getAnchorPoints(to);
  const sides: AnchorSide[] = ["top", "right", "bottom", "left"];
  let bestDist = Infinity;
  let bestFrom = fa.right;
  let bestTo = ta.left;

  for (const fs of sides) {
    for (const ts of sides) {
      const dx = fa[fs].x - ta[ts].x;
      const dy = fa[fs].y - ta[ts].y;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        bestFrom = fa[fs];
        bestTo = ta[ts];
      }
    }
  }
  return { from: bestFrom, to: bestTo };
}

export function Whiteboard({ initialData, onSave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("rectangle");
  const [activeColor, setActiveColor] = useState("#000000");

  const initialParsed = parseInitialData(initialData);
  const [shapes, setShapes] = useState<Shape[]>(initialParsed.shapes);
  const [connectors, setConnectors] = useState<Connector[]>(initialParsed.connectors);
  const undoStackRef = useRef<UndoSnapshot[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  // Move state
  const [dragShapeId, setDragShapeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Connector dragging state
  const [connectingFrom, setConnectingFrom] = useState<{ shapeId: string } | null>(null);
  const [connectingCursor, setConnectingCursor] = useState<{ x: number; y: number } | null>(null);

  // Hovered shape (for showing anchors)
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);

  // Text editing state
  const [editingShape, setEditingShape] = useState<{ id: string; x: number; y: number } | null>(null);
  const [textValue, setTextValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedRef = useRef(false);

  // ---- Canvas drawing ----

  const drawDotGrid = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#d1d5db";
    for (let x = DOT_SPACING; x < w; x += DOT_SPACING) {
      for (let y = DOT_SPACING; y < h; y += DOT_SPACING) {
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;

    if (shape.type === "rectangle") {
      const x = Math.min(shape.x, shape.x + shape.width);
      const y = Math.min(shape.y, shape.y + shape.height);
      const w = Math.abs(shape.width);
      const h = Math.abs(shape.height);
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, RECT_RADIUS);
      ctx.fill();
    } else if (shape.type === "circle") {
      const rx = Math.abs(shape.width) / 2;
      const ry = Math.abs(shape.height) / 2;
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape.type === "arrow") {
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const angle = Math.atan2(shape.height, shape.width);
      const headLen = 12;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (shape.type === "text" && shape.text) {
      ctx.font = "14px sans-serif";
      ctx.fillText(shape.text, shape.x, shape.y + 14);
    }
  }, []);

  const drawConnectorLine = useCallback((ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }, color: string, isSelected: boolean) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = isSelected ? 3 : 2;
    if (isSelected) {
      ctx.setLineDash([6, 3]);
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrowhead
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 10;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }, []);

  const drawSelectionIndicator = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);

    const pad = 4;
    if (shape.type === "rectangle") {
      const x = Math.min(shape.x, shape.x + shape.width) - pad;
      const y = Math.min(shape.y, shape.y + shape.height) - pad;
      const w = Math.abs(shape.width) + pad * 2;
      const h = Math.abs(shape.height) + pad * 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, RECT_RADIUS + 2);
      ctx.stroke();
    } else if (shape.type === "circle") {
      const rx = Math.abs(shape.width) / 2 + pad;
      const ry = Math.abs(shape.height) / 2 + pad;
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "text") {
      const tw = (shape.text?.length || 1) * 8;
      ctx.strokeRect(shape.x - pad, shape.y - pad, tw + pad * 2, 18 + pad * 2);
    } else if (shape.type === "arrow") {
      // Just highlight the line thicker — already handled by selection state
    }

    ctx.setLineDash([]);
  }, []);

  const drawAnchorPoints = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    const anchors = getAnchorPoints(shape);
    const sides: AnchorSide[] = ["top", "right", "bottom", "left"];

    for (const side of sides) {
      const pt = anchors[side];
      // Outer circle
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, ANCHOR_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Plus icon
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      const s = 3.5;
      ctx.beginPath();
      ctx.moveTo(pt.x - s, pt.y);
      ctx.lineTo(pt.x + s, pt.y);
      ctx.moveTo(pt.x, pt.y - s);
      ctx.lineTo(pt.x, pt.y + s);
      ctx.stroke();
    }
  }, []);

  const renderAll = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.clientWidth;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawDotGrid(ctx, w, CANVAS_HEIGHT);

    // Draw connectors
    connectors.forEach(conn => {
      const fromShape = shapes.find(s => s.id === conn.fromShapeId);
      const toShape = shapes.find(s => s.id === conn.toShapeId);
      if (fromShape && toShape) {
        const pts = getClosestAnchors(fromShape, toShape);
        drawConnectorLine(ctx, pts.from, pts.to, conn.color, conn.id === selectedConnectorId);
      }
    });

    // Draw shapes
    shapes.forEach(s => drawShape(ctx, s));
    if (previewShape) drawShape(ctx, previewShape);

    // Selection indicator
    if (selectedShapeId) {
      const sel = shapes.find(s => s.id === selectedShapeId);
      if (sel) drawSelectionIndicator(ctx, sel);
    }

    // Anchor points on hovered or selected shape (only in move mode)
    if (activeTool === "move") {
      const anchorTargetId = hoveredShapeId || selectedShapeId;
      if (anchorTargetId) {
        const target = shapes.find(s => s.id === anchorTargetId);
        if (target) drawAnchorPoints(ctx, target);
      }
    }

    // Connector drag preview
    if (connectingFrom && connectingCursor) {
      const fromShape = shapes.find(s => s.id === connectingFrom.shapeId);
      if (fromShape) {
        const anchors = getAnchorPoints(fromShape);
        // Find closest anchor to cursor for origin
        const sides: AnchorSide[] = ["top", "right", "bottom", "left"];
        let bestPt = anchors.right;
        let bestD = Infinity;
        for (const side of sides) {
          const dx = anchors[side].x - connectingCursor.x;
          const dy = anchors[side].y - connectingCursor.y;
          const d = dx * dx + dy * dy;
          if (d < bestD) { bestD = d; bestPt = anchors[side]; }
        }
        drawConnectorLine(ctx, bestPt, connectingCursor, activeColor, false);
      }
    }

    ctx.restore();
  }, [shapes, connectors, previewShape, drawDotGrid, drawShape, drawConnectorLine, drawSelectionIndicator, drawAnchorPoints, selectedShapeId, selectedConnectorId, hoveredShapeId, activeTool, connectingFrom, connectingCursor, activeColor]);

  // ---- Canvas setup ----

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.clientWidth;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    hasInitializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      initCanvas();
      renderAll();
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen, initCanvas, renderAll]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      initCanvas();
      renderAll();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, initCanvas, renderAll]);

  useEffect(() => {
    if (!isOpen || !hasInitializedRef.current) return;
    renderAll();
  }, [isOpen, renderAll]);

  // ---- Persistence ----

  const debouncedSave = useCallback((currentShapes: Shape[], currentConnectors: Connector[]) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const data: WhiteboardData = {
        shapes: currentShapes,
        connectors: currentConnectors,
        png: canvas.toDataURL("image/png"),
      };
      onSave(JSON.stringify(data));
    }, 1500);
  }, [onSave]);

  // ---- Undo ----

  const pushUndo = useCallback((currentShapes: Shape[], currentConnectors: Connector[]) => {
    undoStackRef.current.push({
      shapes: JSON.parse(JSON.stringify(currentShapes)),
      connectors: JSON.parse(JSON.stringify(currentConnectors)),
    });
    if (undoStackRef.current.length > MAX_UNDO) undoStackRef.current.shift();
    setCanUndo(true);
  }, []);

  const handleUndo = () => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop()!;
    setShapes(prev.shapes);
    setConnectors(prev.connectors);
    setSelectedShapeId(null);
    setSelectedConnectorId(null);
    setCanUndo(undoStackRef.current.length > 0);
    debouncedSave(prev.shapes, prev.connectors);
  };

  // ---- Hit testing ----

  const hitTest = (x: number, y: number): Shape | null => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      if (s.type === "rectangle") {
        const sx = Math.min(s.x, s.x + s.width);
        const sy = Math.min(s.y, s.y + s.height);
        const sw = Math.abs(s.width);
        const sh = Math.abs(s.height);
        if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) return s;
      } else if (s.type === "circle") {
        const cx = s.x + s.width / 2;
        const cy = s.y + s.height / 2;
        const rx = Math.abs(s.width) / 2;
        const ry = Math.abs(s.height) / 2;
        if (rx > 0 && ry > 0) {
          const dx = (x - cx) / rx;
          const dy = (y - cy) / ry;
          if (dx * dx + dy * dy <= 1) return s;
        }
      } else if (s.type === "arrow") {
        const x1 = s.x, y1 = s.y, x2 = s.x + s.width, y2 = s.y + s.height;
        const len = Math.sqrt(s.width * s.width + s.height * s.height);
        if (len === 0) continue;
        const dist = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / len;
        const t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (len * len);
        if (dist < 8 && t >= 0 && t <= 1) return s;
      } else if (s.type === "text") {
        const tw = (s.text?.length || 1) * 8;
        if (x >= s.x && x <= s.x + tw && y >= s.y && y <= s.y + 18) return s;
      }
    }
    return null;
  };

  const hitTestConnector = (x: number, y: number): Connector | null => {
    for (let i = connectors.length - 1; i >= 0; i--) {
      const conn = connectors[i];
      const fromShape = shapes.find(s => s.id === conn.fromShapeId);
      const toShape = shapes.find(s => s.id === conn.toShapeId);
      if (!fromShape || !toShape) continue;
      const pts = getClosestAnchors(fromShape, toShape);
      const x1 = pts.from.x, y1 = pts.from.y, x2 = pts.to.x, y2 = pts.to.y;
      const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      if (len === 0) continue;
      const dist = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / len;
      const t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (len * len);
      if (dist < 8 && t >= 0 && t <= 1) return conn;
    }
    return null;
  };

  const hitTestAnchor = (x: number, y: number): { shapeId: string; side: AnchorSide } | null => {
    const targetId = hoveredShapeId || selectedShapeId;
    if (!targetId) return null;
    const shape = shapes.find(s => s.id === targetId);
    if (!shape) return null;

    const anchors = getAnchorPoints(shape);
    const sides: AnchorSide[] = ["top", "right", "bottom", "left"];
    for (const side of sides) {
      const dx = x - anchors[side].x;
      const dy = y - anchors[side].y;
      if (dx * dx + dy * dy <= ANCHOR_HIT_RADIUS * ANCHOR_HIT_RADIUS) {
        return { shapeId: shape.id, side };
      }
    }
    return null;
  };

  // ---- Mouse handlers ----

  const getCanvasPos = (e: React.MouseEvent): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);

    // Focus the wrapper for keyboard events
    wrapperRef.current?.focus();

    if (editingShape) {
      commitText();
    }

    if (activeTool === "move") {
      // Check anchor hit first (for connector creation)
      const anchorHit = hitTestAnchor(pos.x, pos.y);
      if (anchorHit) {
        pushUndo(shapes, connectors);
        setConnectingFrom({ shapeId: anchorHit.shapeId });
        setConnectingCursor(pos);
        return;
      }

      const hit = hitTest(pos.x, pos.y);
      if (hit) {
        setSelectedShapeId(hit.id);
        setSelectedConnectorId(null);
        pushUndo(shapes, connectors);
        setDragShapeId(hit.id);
        setDragOffset({ x: pos.x - hit.x, y: pos.y - hit.y });
      } else {
        // Check connector hit
        const connHit = hitTestConnector(pos.x, pos.y);
        if (connHit) {
          setSelectedConnectorId(connHit.id);
          setSelectedShapeId(null);
        } else {
          setSelectedShapeId(null);
          setSelectedConnectorId(null);
        }
      }
      return;
    }

    if (activeTool === "text") {
      pushUndo(shapes, connectors);
      const id = genId();
      const newShape: Shape = {
        id, type: "text", x: pos.x, y: pos.y,
        width: 0, height: 18, color: activeColor, text: "",
      };
      setShapes(prev => [...prev, newShape]);
      setEditingShape({ id, x: pos.x, y: pos.y });
      setTextValue("");
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // Shape drawing
    pushUndo(shapes, connectors);
    setIsDrawing(true);
    setDrawStart(pos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);

    // Connector dragging
    if (connectingFrom) {
      setConnectingCursor(pos);
      return;
    }

    if (activeTool === "move" && dragShapeId) {
      setShapes(prev => prev.map(s =>
        s.id === dragShapeId ? { ...s, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y } : s
      ));
      return;
    }

    // Hover detection for anchor display (move tool only)
    if (activeTool === "move" && !dragShapeId) {
      const hit = hitTest(pos.x, pos.y);
      setHoveredShapeId(hit?.id || null);
    }

    if (!isDrawing || !drawStart) return;

    const preview: Shape = {
      id: "_preview",
      type: activeTool as "rectangle" | "circle" | "arrow",
      x: drawStart.x,
      y: drawStart.y,
      width: pos.x - drawStart.x,
      height: pos.y - drawStart.y,
      color: activeColor,
    };
    setPreviewShape(preview);
  };

  const handleMouseUp = () => {
    // Connector drag end
    if (connectingFrom && connectingCursor) {
      const hit = hitTest(connectingCursor.x, connectingCursor.y);
      if (hit && hit.id !== connectingFrom.shapeId) {
        const newConn: Connector = {
          id: genId("c"),
          fromShapeId: connectingFrom.shapeId,
          toShapeId: hit.id,
          color: activeColor,
        };
        const nextConnectors = [...connectors, newConn];
        setConnectors(nextConnectors);
        debouncedSave(shapes, nextConnectors);
      }
      setConnectingFrom(null);
      setConnectingCursor(null);
      return;
    }

    if (activeTool === "move" && dragShapeId) {
      setDragShapeId(null);
      debouncedSave(shapes, connectors);
      return;
    }

    if (isDrawing && previewShape) {
      const newShape: Shape = { ...previewShape, id: genId() };
      const next = [...shapes, newShape];
      setShapes(next);
      setPreviewShape(null);
      setIsDrawing(false);
      setDrawStart(null);
      debouncedSave(next, connectors);
    } else {
      setIsDrawing(false);
      setDrawStart(null);
      setPreviewShape(null);
    }
  };

  // ---- Keyboard handler (Delete/Backspace) ----

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (editingShape) return; // Don't intercept text editing

    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();

      if (selectedShapeId) {
        pushUndo(shapes, connectors);
        const nextShapes = shapes.filter(s => s.id !== selectedShapeId);
        const nextConnectors = connectors.filter(c => c.fromShapeId !== selectedShapeId && c.toShapeId !== selectedShapeId);
        setShapes(nextShapes);
        setConnectors(nextConnectors);
        setSelectedShapeId(null);
        debouncedSave(nextShapes, nextConnectors);
      } else if (selectedConnectorId) {
        pushUndo(shapes, connectors);
        const nextConnectors = connectors.filter(c => c.id !== selectedConnectorId);
        setConnectors(nextConnectors);
        setSelectedConnectorId(null);
        debouncedSave(shapes, nextConnectors);
      }
    }
  }, [selectedShapeId, selectedConnectorId, shapes, connectors, pushUndo, debouncedSave, editingShape]);

  // ---- Text editing ----

  const commitText = () => {
    if (!editingShape) return;
    const text = textValue.trim();
    if (!text) {
      setShapes(prev => prev.filter(s => s.id !== editingShape.id));
    } else {
      setShapes(prev => prev.map(s =>
        s.id === editingShape.id ? { ...s, text, width: text.length * 8 } : s
      ));
    }
    setEditingShape(null);
    setTextValue("");
    debouncedSave(shapes, connectors);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitText();
    }
  };

  // ---- Actions ----

  const handleClear = () => {
    pushUndo(shapes, connectors);
    setShapes([]);
    setConnectors([]);
    setSelectedShapeId(null);
    setSelectedConnectorId(null);
    debouncedSave([], []);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "event-layout.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Clear selection when switching tools
  useEffect(() => {
    if (activeTool !== "move") {
      setSelectedShapeId(null);
      setSelectedConnectorId(null);
      setHoveredShapeId(null);
    }
  }, [activeTool]);

  // ---- Toolbar ----

  const toolButtons: { tool: Tool; icon: React.ReactNode; label: string }[] = [
    { tool: "move", icon: <Move className="h-4 w-4" />, label: "Move" },
    { tool: "rectangle", icon: <Square className="h-4 w-4" />, label: "Rectangle" },
    { tool: "circle", icon: <Circle className="h-4 w-4" />, label: "Circle" },
    { tool: "arrow", icon: <ArrowRight className="h-4 w-4" />, label: "Arrow" },
    { tool: "text", icon: <Type className="h-4 w-4" />, label: "Text" },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Whiteboard
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            {/* Toolbar */}
            <div className="flex items-center gap-1 flex-wrap mb-2">
              {toolButtons.map(({ tool, icon, label }) => (
                <Button
                  key={tool}
                  variant={activeTool === tool ? "default" : "ghost"}
                  size="icon"
                  title={label}
                  onClick={() => setActiveTool(tool)}
                >
                  {icon}
                </Button>
              ))}

              <div className="w-px h-5 bg-border mx-1" />

              {COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.label}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform",
                    activeColor === c.value ? "border-foreground scale-110" : "border-border"
                  )}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setActiveColor(c.value)}
                />
              ))}

              <div className="w-px h-5 bg-border mx-1" />

              <Button variant="ghost" size="icon" title="Undo" onClick={handleUndo} disabled={!canUndo}>
                <Undo2 className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="Clear all">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear whiteboard?</AlertDialogTitle>
                    <AlertDialogDescription>This will erase everything on the canvas. This action can be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear}>Clear</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="ghost" size="icon" title="Download as PNG" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Canvas */}
            <div
              ref={wrapperRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="outline-none"
            >
              <div ref={containerRef} className="w-full rounded-md overflow-hidden border border-border relative">
                <canvas
                  ref={canvasRef}
                  className={cn(
                    "block",
                    activeTool === "move" ? "cursor-grab" : "cursor-crosshair"
                  )}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                {editingShape && (
                  <input
                    ref={inputRef}
                    type="text"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={handleTextKeyDown}
                    onBlur={commitText}
                    className="absolute bg-transparent border-none outline-none text-sm"
                    style={{
                      left: `${editingShape.x}px`,
                      top: `${editingShape.y}px`,
                      color: activeColor,
                      font: "14px sans-serif",
                      minWidth: "60px",
                    }}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
