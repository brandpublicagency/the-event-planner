import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Undo2, Download, Circle, Copy } from "lucide-react";

// --- Data model ---
type NodeShape = "rectangle" | "pill";

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  shape: NodeShape;
}

type Side = "top" | "right" | "bottom" | "left";

interface Connection {
  id: string;
  fromNodeId: string;
  fromSide: Side;
  toNodeId: string;
  toSide: Side;
  label?: string;
}

interface LayoutData {
  nodes: LayoutNode[];
  connections: Connection[];
}

interface WhiteboardProps {
  initialData?: string;
  onSave?: (data: string) => void;
}

const DEFAULT_RECT_W = 120;
const DEFAULT_RECT_H = 60;
const DEFAULT_PILL_W = 140;
const DEFAULT_PILL_H = 48;
const HANDLE_SIZE = 6;
const RESIZE_HANDLE_SIZE = 6;
const SIDES: Side[] = ["top", "right", "bottom", "left"];
type Corner = "tl" | "tr" | "bl" | "br";
const CORNERS: Corner[] = ["tl", "tr", "bl", "br"];

function getHandlePos(node: LayoutNode, side: Side): { x: number; y: number } {
  switch (side) {
    case "top": return { x: node.x + node.width / 2, y: node.y };
    case "bottom": return { x: node.x + node.width / 2, y: node.y + node.height };
    case "left": return { x: node.x, y: node.y + node.height / 2 };
    case "right": return { x: node.x + node.width, y: node.y + node.height / 2 };
  }
}

function bezierPath(from: { x: number; y: number }, fromSide: Side, to: { x: number; y: number }, toSide: Side): string {
  const offset = 80;
  const dir: Record<Side, { dx: number; dy: number }> = {
    top: { dx: 0, dy: -offset },
    bottom: { dx: 0, dy: offset },
    left: { dx: -offset, dy: 0 },
    right: { dx: offset, dy: 0 },
  };
  const c1 = { x: from.x + dir[fromSide].dx, y: from.y + dir[fromSide].dy };
  const c2 = { x: to.x + dir[toSide].dx, y: to.y + dir[toSide].dy };
  return `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}

function bezierMidpoint(from: { x: number; y: number }, fromSide: Side, to: { x: number; y: number }, toSide: Side): { x: number; y: number } {
  const offset = 80;
  const dir: Record<Side, { dx: number; dy: number }> = {
    top: { dx: 0, dy: -offset },
    bottom: { dx: 0, dy: offset },
    left: { dx: -offset, dy: 0 },
    right: { dx: offset, dy: 0 },
  };
  const c1 = { x: from.x + dir[fromSide].dx, y: from.y + dir[fromSide].dy };
  const c2 = { x: to.x + dir[toSide].dx, y: to.y + dir[toSide].dy };
  const t = 0.5;
  const mt = 1 - t;
  return {
    x: mt * mt * mt * from.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * to.x,
    y: mt * mt * mt * from.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * to.y,
  };
}

function parseInitialData(raw?: string): LayoutData {
  if (!raw) return { nodes: [], connections: [] };
  try {
    const parsed = JSON.parse(raw);
    if (parsed.nodes && Array.isArray(parsed.nodes)) {
      return {
        nodes: parsed.nodes.map((n: any) => ({ ...n, shape: n.shape || "rectangle" })),
        connections: Array.isArray(parsed.connections) ? parsed.connections : [],
      };
    }
  } catch {}
  return { nodes: [], connections: [] };
}

function minDims(shape: NodeShape): { w: number; h: number } {
  return shape === "pill" ? { w: DEFAULT_PILL_W, h: DEFAULT_PILL_H } : { w: DEFAULT_RECT_W, h: DEFAULT_RECT_H };
}

export function Whiteboard({ initialData, onSave }: WhiteboardProps) {
  const initial = useMemo(() => parseInitialData(initialData), [initialData]);
  const [nodes, setNodes] = useState<LayoutNode[]>(initial.nodes);
  const [connections, setConnections] = useState<Connection[]>(initial.connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingConnId, setEditingConnId] = useState<string | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<LayoutData[]>([]);

  const dragging = useRef<{ nodeId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizing = useRef<{ nodeId: string; corner: Corner; startX: number; startY: number; origX: number; origY: number; origW: number; origH: number; shape: NodeShape } | null>(null);
  const panning = useRef<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; side: Side } | null>(null);
  const [connectCursor, setConnectCursor] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const nodesRef = useRef(nodes);
  const connectionsRef = useRef(connections);
  const selectedNodeIdRef = useRef(selectedNodeId);
  const selectedConnIdRef = useRef(selectedConnId);
  const editingNodeIdRef = useRef(editingNodeId);
  const undoStackRef = useRef(undoStack);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { connectionsRef.current = connections; }, [connections]);
  useEffect(() => { selectedNodeIdRef.current = selectedNodeId; }, [selectedNodeId]);
  useEffect(() => { selectedConnIdRef.current = selectedConnId; }, [selectedConnId]);
  useEffect(() => { editingNodeIdRef.current = editingNodeId; }, [editingNodeId]);
  useEffect(() => { undoStackRef.current = undoStack; }, [undoStack]);

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), { nodes: structuredClone(nodesRef.current), connections: structuredClone(connectionsRef.current) }]);
  }, []);

  useEffect(() => {
    if (!onSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave(JSON.stringify({ nodes, connections }));
    }, 1000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [nodes, connections, onSave]);

  const addNode = useCallback((shape: NodeShape = "rectangle") => {
    pushUndo();
    const isRect = shape === "rectangle";
    const w = isRect ? DEFAULT_RECT_W : DEFAULT_PILL_W;
    const h = isRect ? DEFAULT_RECT_H : DEFAULT_PILL_H;
    const cx = (containerRef.current?.clientWidth || 600) / 2 - panOffset.x - w / 2;
    const cy = 200 - panOffset.y;
    setNodes(prev => [...prev, { id: uuid(), x: cx, y: cy, width: w, height: h, label: "Node", shape }]);
  }, [pushUndo, panOffset]);

  const deleteSelected = useCallback(() => {
    const selNode = selectedNodeIdRef.current;
    const selConn = selectedConnIdRef.current;
    if (selNode) {
      pushUndo();
      setNodes(prev => prev.filter(n => n.id !== selNode));
      setConnections(prev => prev.filter(c => c.fromNodeId !== selNode && c.toNodeId !== selNode));
      setSelectedNodeId(null);
    } else if (selConn) {
      pushUndo();
      setConnections(prev => prev.filter(c => c.id !== selConn));
      setSelectedConnId(null);
    }
  }, [pushUndo]);

  const undo = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) return;
    const last = stack[stack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setNodes(last.nodes);
    setConnections(last.connections);
    setSelectedNodeId(null);
    setSelectedConnId(null);
  }, []);

  const exportPng = useCallback(() => {
    const n = nodesRef.current;
    const c = connectionsRef.current;
    if (n.length === 0) return;
    const padding = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    n.forEach(nd => {
      minX = Math.min(minX, nd.x);
      minY = Math.min(minY, nd.y);
      maxX = Math.max(maxX, nd.x + nd.width);
      maxY = Math.max(maxY, nd.y + nd.height);
    });
    const w = maxX - minX + padding * 2;
    const h = maxY - minY + padding * 2;
    const canvas = document.createElement("canvas");
    canvas.width = w * 2; canvas.height = h * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e2e8f0";
    for (let gx = 0; gx < w; gx += 20) for (let gy = 0; gy < h; gy += 20) {
      ctx.beginPath(); ctx.arc(gx, gy, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    const offset = 80;
    const dirMap: Record<Side, { dx: number; dy: number }> = {
      top: { dx: 0, dy: -offset }, bottom: { dx: 0, dy: offset },
      left: { dx: -offset, dy: 0 }, right: { dx: offset, dy: 0 },
    };
    c.forEach(conn => {
      const fromNode = n.find(nd => nd.id === conn.fromNodeId);
      const toNode = n.find(nd => nd.id === conn.toNodeId);
      if (!fromNode || !toNode) return;
      const from = getHandlePos({ ...fromNode, x: fromNode.x - minX + padding, y: fromNode.y - minY + padding }, conn.fromSide);
      const to = getHandlePos({ ...toNode, x: toNode.x - minX + padding, y: toNode.y - minY + padding }, conn.toSide);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.bezierCurveTo(from.x + dirMap[conn.fromSide].dx, from.y + dirMap[conn.fromSide].dy, to.x + dirMap[conn.toSide].dx, to.y + dirMap[conn.toSide].dy, to.x, to.y);
      ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 1.5; ctx.stroke();
      if (conn.label) {
        const mid = bezierMidpoint(from, conn.fromSide, to, conn.toSide);
        ctx.font = "11px system-ui, sans-serif";
        const tw = ctx.measureText(conn.label).width;
        ctx.fillStyle = "#fff";
        ctx.fillRect(mid.x - tw / 2 - 4, mid.y - 8, tw + 8, 16);
        ctx.fillStyle = "#64748B";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(conn.label, mid.x, mid.y);
      }
    });
    n.forEach(nd => {
      const nx = nd.x - minX + padding, ny = nd.y - minY + padding;
      const radius = nd.shape === "pill" ? nd.height / 2 : 12;
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#E2E8F0"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(nx, ny, nd.width, nd.height, radius); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1E293B"; ctx.font = "13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(nd.label, nx + nd.width / 2, ny + nd.height / 2, nd.width - 16);
    });
    const a = document.createElement("a");
    a.download = "layout.png"; a.href = canvas.toDataURL("image/png"); a.click();
  }, []);

  const onContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains("layout-canvas-inner")) return;
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setEditingConnId(null);
    if (connectingFrom) { setConnectingFrom(null); setConnectCursor(null); return; }
    panning.current = { startX: e.clientX, startY: e.clientY, origPanX: panOffset.x, origPanY: panOffset.y };
  }, [connectingFrom, panOffset]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (resizing.current) {
      const r = resizing.current;
      const dx = e.clientX - r.startX;
      const dy = e.clientY - r.startY;
      const min = minDims(r.shape);
      setNodes(prev => prev.map(n => {
        if (n.id !== r.nodeId) return n;
        let newX = r.origX, newY = r.origY, newW = r.origW, newH = r.origH;
        if (r.corner === "br") { newW = Math.max(min.w, r.origW + dx); newH = Math.max(min.h, r.origH + dy); }
        else if (r.corner === "bl") { newW = Math.max(min.w, r.origW - dx); newH = Math.max(min.h, r.origH + dy); newX = r.origX + r.origW - newW; }
        else if (r.corner === "tr") { newW = Math.max(min.w, r.origW + dx); newH = Math.max(min.h, r.origH - dy); newY = r.origY + r.origH - newH; }
        else if (r.corner === "tl") { newW = Math.max(min.w, r.origW - dx); newH = Math.max(min.h, r.origH - dy); newX = r.origX + r.origW - newW; newY = r.origY + r.origH - newH; }
        return { ...n, x: newX, y: newY, width: newW, height: newH };
      }));
    } else if (dragging.current) {
      const dx = e.clientX - dragging.current.startX;
      const dy = e.clientY - dragging.current.startY;
      const id = dragging.current.nodeId;
      const ox = dragging.current.origX;
      const oy = dragging.current.origY;
      setNodes(prev => prev.map(n => n.id === id ? { ...n, x: ox + dx, y: oy + dy } : n));
    } else if (panning.current) {
      setPanOffset({
        x: panning.current.origPanX + (e.clientX - panning.current.startX),
        y: panning.current.origPanY + (e.clientY - panning.current.startY),
      });
    } else if (connectingFrom && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setConnectCursor({ x: e.clientX - rect.left - panOffset.x, y: e.clientY - rect.top - panOffset.y });
    }
  }, [connectingFrom, panOffset]);

  const onMouseUp = useCallback(() => {
    dragging.current = null;
    panning.current = null;
    resizing.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingNodeIdRef.current) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteSelected, undo]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent, nodeId: string, side: Side) => {
    e.stopPropagation();
    if (connectingFrom) {
      if (connectingFrom.nodeId !== nodeId) {
        const exists = connectionsRef.current.some(c =>
          (c.fromNodeId === connectingFrom.nodeId && c.toNodeId === nodeId) ||
          (c.fromNodeId === nodeId && c.toNodeId === connectingFrom.nodeId)
        );
        if (!exists) {
          pushUndo();
          setConnections(prev => [...prev, {
            id: uuid(),
            fromNodeId: connectingFrom.nodeId,
            fromSide: connectingFrom.side,
            toNodeId: nodeId,
            toSide: side,
          }]);
        }
      }
      setConnectingFrom(null);
      setConnectCursor(null);
    } else {
      setConnectingFrom({ nodeId, side });
      const node = nodesRef.current.find(n => n.id === nodeId)!;
      const pos = getHandlePos(node, side);
      setConnectCursor(pos);
    }
  }, [connectingFrom, pushUndo]);

  const onNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (editingNodeIdRef.current === nodeId) return;
    e.stopPropagation();
    if (connectingFrom) return;
    pushUndo();
    setSelectedNodeId(nodeId);
    setSelectedConnId(null);
    setEditingConnId(null);
    const node = nodesRef.current.find(n => n.id === nodeId)!;
    dragging.current = { nodeId, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y };
  }, [connectingFrom, pushUndo]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent, nodeId: string, corner: Corner) => {
    e.stopPropagation();
    pushUndo();
    const node = nodesRef.current.find(n => n.id === nodeId)!;
    resizing.current = { nodeId, corner, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y, origW: node.width, origH: node.height, shape: node.shape };
  }, [pushUndo]);

  const startEdit = useCallback((nodeId: string) => {
    setEditingNodeId(nodeId);
    setSelectedNodeId(nodeId);
  }, []);

  const commitEdit = useCallback((nodeId: string, newLabel: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, label: newLabel || "Node" } : n));
    setEditingNodeId(null);
  }, []);

  const onConnectionClick = useCallback((e: React.MouseEvent, connId: string) => {
    e.stopPropagation();
    setSelectedConnId(connId);
    setSelectedNodeId(null);
  }, []);

  const onConnectionDblClick = useCallback((e: React.MouseEvent, connId: string) => {
    e.stopPropagation();
    setEditingConnId(connId);
    setSelectedConnId(connId);
    setSelectedNodeId(null);
  }, []);

  const commitConnLabel = useCallback((connId: string, label: string) => {
    setConnections(prev => prev.map(c => c.id === connId ? { ...c, label: label || undefined } : c));
    setEditingConnId(null);
  }, []);

  const tempLine = useMemo(() => {
    if (!connectingFrom || !connectCursor) return null;
    const node = nodes.find(n => n.id === connectingFrom.nodeId);
    if (!node) return null;
    const from = getHandlePos(node, connectingFrom.side);
    return bezierPath(from, connectingFrom.side, connectCursor, "left");
  }, [connectingFrom, connectCursor, nodes]);

  const hasSelection = selectedNodeId || selectedConnId;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <span>Layout Builder</span>
        <span className="text-[10px]">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="border-t border-border">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/30">
            <Button variant="ghost" size="sm" onClick={() => addNode("rectangle")} className="gap-1 text-xs h-7">
              <Plus className="h-3.5 w-3.5" /> Add Node
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNode("pill")} className="gap-1 text-xs h-7">
              <Circle className="h-3.5 w-3.5" /> Add Pill
            </Button>
            <Button variant="ghost" size="sm" onClick={deleteSelected} disabled={!hasSelection} className="gap-1 text-xs h-7">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={undo} disabled={undoStack.length === 0} className="gap-1 text-xs h-7">
              <Undo2 className="h-3.5 w-3.5" /> Undo
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={exportPng} disabled={nodes.length === 0} className="gap-1 text-xs h-7">
              <Download className="h-3.5 w-3.5" /> PNG
            </Button>
          </div>

          <div
            ref={containerRef}
            className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ height: 500 }}
            onMouseDown={onContainerMouseDown}
          >
            <div
              className="layout-canvas-inner absolute"
              style={{
                width: 4000,
                height: 4000,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                backgroundImage: "radial-gradient(circle, hsl(var(--border)) 0.8px, transparent 0.8px)",
                backgroundSize: "20px 20px",
              }}
              onMouseDown={onContainerMouseDown}
            >
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                {connections.map(c => {
                  const fromNode = nodes.find(n => n.id === c.fromNodeId);
                  const toNode = nodes.find(n => n.id === c.toNodeId);
                  if (!fromNode || !toNode) return null;
                  const from = getHandlePos(fromNode, c.fromSide);
                  const to = getHandlePos(toNode, c.toSide);
                  const d = bezierPath(from, c.fromSide, to, c.toSide);
                  const isSelected = selectedConnId === c.id;
                  const mid = bezierMidpoint(from, c.fromSide, to, c.toSide);
                  return (
                    <g key={c.id}>
                      <path d={d} fill="none" stroke="transparent" strokeWidth={14} style={{ pointerEvents: "stroke", cursor: "pointer" }} onMouseDown={(e) => onConnectionClick(e, c.id)} onDoubleClick={(e) => onConnectionDblClick(e, c.id)} />
                      <path d={d} fill="none" stroke={isSelected ? "hsl(var(--foreground))" : "#CBD5E1"} strokeWidth={isSelected ? 2 : 1.5} style={{ pointerEvents: "none" }} />
                      {c.label && editingConnId !== c.id && (
                        <>
                          <rect x={mid.x - (c.label.length * 3.5) - 4} y={mid.y - 8} width={c.label.length * 7 + 8} height={16} rx={3} fill="hsl(var(--background))" stroke="#E2E8F0" strokeWidth={0.5} style={{ pointerEvents: "none" }} />
                          <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="#64748B" style={{ pointerEvents: "none", fontFamily: "system-ui, sans-serif" }}>{c.label}</text>
                        </>
                      )}
                    </g>
                  );
                })}
                {tempLine && (
                  <path d={tempLine} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="6 4" style={{ pointerEvents: "none" }} />
                )}
              </svg>

              {/* Connection label editor */}
              {editingConnId && (() => {
                const conn = connections.find(c => c.id === editingConnId);
                if (!conn) return null;
                const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                const toNode = nodes.find(n => n.id === conn.toNodeId);
                if (!fromNode || !toNode) return null;
                const from = getHandlePos(fromNode, conn.fromSide);
                const to = getHandlePos(toNode, conn.toSide);
                const mid = bezierMidpoint(from, conn.fromSide, to, conn.toSide);
                return (
                  <input
                    autoFocus
                    defaultValue={conn.label || ""}
                    className="absolute bg-background border border-border rounded px-2 py-0.5 text-[11px] text-center outline-none z-30"
                    style={{ left: mid.x - 50, top: mid.y - 12, width: 100 }}
                    onBlur={(e) => commitConnLabel(editingConnId, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitConnLabel(editingConnId, (e.target as HTMLInputElement).value);
                      if (e.key === "Escape") setEditingConnId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                );
              })()}

              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const showHandles = isSelected || connectingFrom !== null;
                const isPill = node.shape === "pill";
                return (
                  <div
                    key={node.id}
                    className="absolute flex items-center justify-center cursor-move transition-shadow group"
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      minHeight: node.height,
                      background: "#FFFFFF",
                      border: isSelected ? "1.5px solid #1E293B" : "1px solid #E2E8F0",
                      borderRadius: isPill ? 9999 : 12,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                      zIndex: isSelected ? 10 : 1,
                    }}
                    onMouseDown={(e) => onNodeMouseDown(e, node.id)}
                    onDoubleClick={() => startEdit(node.id)}
                  >
                    {editingNodeId === node.id ? (
                      <textarea
                        autoFocus
                        defaultValue={node.label}
                        className="w-full text-center bg-transparent outline-none border-none resize-none px-3 py-2"
                        style={{ fontSize: 13, color: "#1E293B", fontFamily: "inherit", lineHeight: "1.4", minHeight: node.height - 8 }}
                        onBlur={(e) => commitEdit(node.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitEdit(node.id, (e.target as HTMLTextAreaElement).value); }
                          if (e.key === "Escape") setEditingNodeId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="select-none px-3 py-2 text-center"
                        style={{ fontSize: 13, color: "#1E293B", wordBreak: "break-word", whiteSpace: "pre-wrap", lineHeight: "1.4" }}
                      >{node.label}</span>
                    )}

                    {/* Connection handles */}
                    {showHandles && SIDES.map(side => {
                      const pos = side === "top" ? { left: "50%", top: -HANDLE_SIZE / 2, transform: "translateX(-50%)" }
                        : side === "bottom" ? { left: "50%", bottom: -HANDLE_SIZE / 2, transform: "translateX(-50%)" }
                        : side === "left" ? { top: "50%", left: -HANDLE_SIZE / 2, transform: "translateY(-50%)" }
                        : { top: "50%", right: -HANDLE_SIZE / 2, transform: "translateY(-50%)" };
                      return (
                        <div
                          key={side}
                          className="absolute rounded-full cursor-crosshair z-20 hover:scale-150 transition-transform"
                          style={{ ...pos, width: HANDLE_SIZE, height: HANDLE_SIZE, background: "#94A3B8" }}
                          onMouseDown={(e) => onHandleMouseDown(e, node.id, side)}
                        />
                      );
                    })}

                    {/* Resize corner handles */}
                    {isSelected && CORNERS.map(corner => {
                      const cPos = corner === "tl" ? { left: -RESIZE_HANDLE_SIZE / 2, top: -RESIZE_HANDLE_SIZE / 2, cursor: "nwse-resize" }
                        : corner === "tr" ? { right: -RESIZE_HANDLE_SIZE / 2, top: -RESIZE_HANDLE_SIZE / 2, cursor: "nesw-resize" }
                        : corner === "bl" ? { left: -RESIZE_HANDLE_SIZE / 2, bottom: -RESIZE_HANDLE_SIZE / 2, cursor: "nesw-resize" }
                        : { right: -RESIZE_HANDLE_SIZE / 2, bottom: -RESIZE_HANDLE_SIZE / 2, cursor: "nwse-resize" };
                      return (
                        <div
                          key={corner}
                          className="absolute z-20 bg-foreground"
                          style={{ ...cPos, width: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE, borderRadius: 1 }}
                          onMouseDown={(e) => onResizeMouseDown(e, node.id, corner)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
