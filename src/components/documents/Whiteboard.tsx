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

interface WhiteboardData {
  shapes: Shape[];
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

interface WhiteboardProps {
  initialData?: string;
  onSave: (dataUrl: string) => void;
}

let shapeIdCounter = 0;
const genId = () => `s_${Date.now()}_${++shapeIdCounter}`;

function parseInitialData(data?: string): Shape[] {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data) as WhiteboardData;
    if (parsed.shapes && Array.isArray(parsed.shapes)) return parsed.shapes;
  } catch {
    // Legacy PNG string — cannot restore shapes
  }
  return [];
}

export function Whiteboard({ initialData, onSave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("rectangle");
  const [activeColor, setActiveColor] = useState("#000000");

  const [shapes, setShapes] = useState<Shape[]>(() => parseInitialData(initialData));
  const undoStackRef = useRef<Shape[][]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  // Move state
  const [dragShapeId, setDragShapeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
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
    shapes.forEach(s => drawShape(ctx, s));
    if (previewShape) drawShape(ctx, previewShape);

    ctx.restore();
  }, [shapes, previewShape, drawDotGrid, drawShape]);

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

  // Re-render whenever shapes or preview change
  useEffect(() => {
    if (!isOpen || !hasInitializedRef.current) return;
    renderAll();
  }, [isOpen, renderAll]);

  // ---- Persistence ----

  const debouncedSave = useCallback((currentShapes: Shape[]) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const data: WhiteboardData = {
        shapes: currentShapes,
        png: canvas.toDataURL("image/png"),
      };
      onSave(JSON.stringify(data));
    }, 1500);
  }, [onSave]);

  // ---- Undo ----

  const pushUndo = useCallback((current: Shape[]) => {
    undoStackRef.current.push(JSON.parse(JSON.stringify(current)));
    if (undoStackRef.current.length > MAX_UNDO) undoStackRef.current.shift();
    setCanUndo(true);
  }, []);

  const handleUndo = () => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop()!;
    setShapes(prev);
    setCanUndo(undoStackRef.current.length > 0);
    debouncedSave(prev);
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

  // ---- Mouse handlers ----

  const getCanvasPos = (e: React.MouseEvent): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);

    // If currently editing text, commit it first
    if (editingShape) {
      commitText();
    }

    if (activeTool === "move") {
      const hit = hitTest(pos.x, pos.y);
      if (hit) {
        pushUndo(shapes);
        setDragShapeId(hit.id);
        setDragOffset({ x: pos.x - hit.x, y: pos.y - hit.y });
      }
      return;
    }

    if (activeTool === "text") {
      pushUndo(shapes);
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
    pushUndo(shapes);
    setIsDrawing(true);
    setDrawStart(pos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);

    if (activeTool === "move" && dragShapeId) {
      setShapes(prev => prev.map(s =>
        s.id === dragShapeId ? { ...s, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y } : s
      ));
      return;
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
    if (activeTool === "move" && dragShapeId) {
      setDragShapeId(null);
      debouncedSave(shapes);
      return;
    }

    if (isDrawing && previewShape) {
      const newShape: Shape = { ...previewShape, id: genId() };
      const next = [...shapes, newShape];
      setShapes(next);
      setPreviewShape(null);
      setIsDrawing(false);
      setDrawStart(null);
      debouncedSave(next);
    } else {
      setIsDrawing(false);
      setDrawStart(null);
      setPreviewShape(null);
    }
  };

  // ---- Text editing ----

  const commitText = () => {
    if (!editingShape) return;
    const text = textValue.trim();
    if (!text) {
      // Remove empty text shape
      setShapes(prev => prev.filter(s => s.id !== editingShape.id));
    } else {
      setShapes(prev => prev.map(s =>
        s.id === editingShape.id ? { ...s, text, width: text.length * 8 } : s
      ));
    }
    setEditingShape(null);
    setTextValue("");
    debouncedSave(shapes);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitText();
    }
  };

  // ---- Actions ----

  const handleClear = () => {
    pushUndo(shapes);
    setShapes([]);
    debouncedSave([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "event-layout.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

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
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
