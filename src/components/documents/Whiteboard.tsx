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
  Undo2,
  Trash2,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = "rectangle" | "circle" | "arrow" | "text";

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

export function Whiteboard({ initialData, onSave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("rectangle");
  const [activeColor, setActiveColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const hasInitializedRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext("2d") ?? null;
  }, []);

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

  const pushUndo = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    undoStackRef.current.push(data);
    if (undoStackRef.current.length > MAX_UNDO) {
      undoStackRef.current.shift();
    }
    setCanUndo(true);
  }, [getCtx]);

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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    drawDotGrid(ctx, w, CANVAS_HEIGHT);

    if (initialData && !hasInitializedRef.current) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, CANVAS_HEIGHT);
        hasInitializedRef.current = true;
      };
      img.src = initialData;
    } else {
      hasInitializedRef.current = true;
    }
  }, [drawDotGrid, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(initCanvas, 50);
    return () => clearTimeout(timer);
  }, [isOpen, initCanvas]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, initCanvas]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) onSave(canvas.toDataURL("image/png"));
    }, 1500);
  }, [onSave]);

  const getCanvasPos = (e: React.MouseEvent): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "text") {
      const pos = getCanvasPos(e);
      const text = prompt("Enter text:");
      if (!text) return;
      pushUndo();
      const ctx = getCtx();
      if (!ctx) return;
      ctx.save();
      ctx.font = "14px sans-serif";
      ctx.fillStyle = activeColor;
      ctx.fillText(text, pos.x, pos.y);
      ctx.restore();
      debouncedSave();
      return;
    }
    pushUndo();
    setIsDrawing(true);
    setStartPos(getCanvasPos(e));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos) return;
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Restore last undo state for rubber-band preview
    const lastState = undoStackRef.current[undoStackRef.current.length - 1];
    if (lastState) {
      ctx.putImageData(lastState, 0, 0);
    }

    const cur = getCanvasPos(e);
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 2;

    if (activeTool === "rectangle") {
      ctx.strokeRect(startPos.x, startPos.y, cur.x - startPos.x, cur.y - startPos.y);
    } else if (activeTool === "circle") {
      const rx = Math.abs(cur.x - startPos.x) / 2;
      const ry = Math.abs(cur.y - startPos.y) / 2;
      const cx = startPos.x + (cur.x - startPos.x) / 2;
      const cy = startPos.y + (cur.y - startPos.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (activeTool === "arrow") {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(cur.x, cur.y);
      ctx.stroke();
      // Arrowhead
      const angle = Math.atan2(cur.y - startPos.y, cur.x - startPos.x);
      const headLen = 12;
      ctx.beginPath();
      ctx.moveTo(cur.x, cur.y);
      ctx.lineTo(cur.x - headLen * Math.cos(angle - Math.PI / 6), cur.y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(cur.x, cur.y);
      ctx.lineTo(cur.x - headLen * Math.cos(angle + Math.PI / 6), cur.y - headLen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }
    ctx.restore();
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPos(null);
      debouncedSave();
    }
  };

  const handleUndo = () => {
    const ctx = getCtx();
    if (!ctx || undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop()!;
    ctx.putImageData(prev, 0, 0);
    setCanUndo(undoStackRef.current.length > 0);
    debouncedSave();
  };

  const handleClear = () => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    pushUndo();
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    const w = canvas.width / dpr;
    drawDotGrid(ctx, w, CANVAS_HEIGHT);
    ctx.restore();
    debouncedSave();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "event-layout.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const toolButtons: { tool: Tool; icon: React.ReactNode; label: string }[] = [
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
            <div ref={containerRef} className="w-full rounded-md overflow-hidden border border-border">
              <canvas
                ref={canvasRef}
                className="cursor-crosshair block"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
