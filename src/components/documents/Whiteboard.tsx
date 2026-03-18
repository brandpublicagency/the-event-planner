import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Undo2, Download } from "lucide-react";

// --- Data model ---
interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

type Side = "top" | "right" | "bottom" | "left";

interface Connection {
  id: string;
  fromNodeId: string;
  fromSide: Side;
  toNodeId: string;
  toSide: Side;
}

interface LayoutData {
  nodes: LayoutNode[];
  connections: Connection[];
}

interface WhiteboardProps {
  initialData?: string;
  onSave?: (data: string) => void;
}

const DEFAULT_W = 120;
const DEFAULT_H = 60;
const HANDLE_R = 5;
const SIDES: Side[] = ["top", "right", "bottom", "left"];

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

function parseInitialData(raw?: string): LayoutData {
  if (!raw) return { nodes: [], connections: [] };
  try {
    const parsed = JSON.parse(raw);
    if (parsed.nodes && Array.isArray(parsed.nodes)) {
      return {
        nodes: parsed.nodes,
        connections: Array.isArray(parsed.connections) ? parsed.connections : [],
      };
    }
  } catch {}
  return { nodes: [], connections: [] };
}

export function Whiteboard({ initialData, onSave }: WhiteboardProps) {
  const initial = useMemo(() => parseInitialData(initialData), [initialData]);
  const [nodes, setNodes] = useState<LayoutNode[]>(initial.nodes);
  const [connections, setConnections] = useState<Connection[]>(initial.connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<LayoutData[]>([]);

  const dragging = useRef<{ nodeId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const panning = useRef<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; side: Side } | null>(null);
  const [connectCursor, setConnectCursor] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Refs for latest state in event handlers
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

  // Debounced save
  useEffect(() => {
    if (!onSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave(JSON.stringify({ nodes, connections }));
    }, 1000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [nodes, connections, onSave]);

  const addNode = useCallback(() => {
    pushUndo();
    const cx = (containerRef.current?.clientWidth || 600) / 2 - panOffset.x - DEFAULT_W / 2;
    const cy = 200 - panOffset.y;
    setNodes(prev => [...prev, { id: uuid(), x: cx, y: cy, width: DEFAULT_W, height: DEFAULT_H, label: "Node" }]);
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
    for (let x = 0; x < w; x += 20) for (let y = 0; y < h; y += 20) {
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    c.forEach(conn => {
      const fromNode = n.find(nd => nd.id === conn.fromNodeId);
      const toNode = n.find(nd => nd.id === conn.toNodeId);
      if (!fromNode || !toNode) return;
      const from = getHandlePos({ ...fromNode, x: fromNode.x - minX + padding, y: fromNode.y - minY + padding }, conn.fromSide);
      const to = getHandlePos({ ...toNode, x: toNode.x - minX + padding, y: toNode.y - minY + padding }, conn.toSide);
      const offset = 80;
      const dir: Record<Side, { dx: number; dy: number }> = {
        top: { dx: 0, dy: -offset }, bottom: { dx: 0, dy: offset },
        left: { dx: -offset, dy: 0 }, right: { dx: offset, dy: 0 },
      };
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.bezierCurveTo(from.x + dir[conn.fromSide].dx, from.y + dir[conn.fromSide].dy, to.x + dir[conn.toSide].dx, to.y + dir[conn.toSide].dy, to.x, to.y);
      ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 1.5; ctx.stroke();
    });
    n.forEach(nd => {
      const nx = nd.x - minX + padding, ny = nd.y - minY + padding;
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(nx, ny, nd.width, nd.height, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#374151"; ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(nd.label, nx + nd.width / 2, ny + nd.height / 2, nd.width - 16);
    });
    const a = document.createElement("a");
    a.download = "layout.png"; a.href = canvas.toDataURL("image/png"); a.click();
  }, []);

  // Container mouse down: deselect or start panning
  const onContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains("layout-canvas-inner")) return;
    setSelectedNodeId(null);
    setSelectedConnId(null);
    if (connectingFrom) { setConnectingFrom(null); setConnectCursor(null); return; }
    panning.current = { startX: e.clientX, startY: e.clientY, origPanX: panOffset.x, origPanY: panOffset.y };
  }, [connectingFrom, panOffset]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current) {
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
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  // Keyboard
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
    const node = nodesRef.current.find(n => n.id === nodeId)!;
    dragging.current = { nodeId, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y };
  }, [connectingFrom, pushUndo]);

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
            <Button variant="ghost" size="sm" onClick={addNode} className="gap-1 text-xs h-7">
              <Plus className="h-3.5 w-3.5" /> Add Node
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
                  return (
                    <g key={c.id}>
                      <path d={d} fill="none" stroke="transparent" strokeWidth={14} style={{ pointerEvents: "stroke", cursor: "pointer" }} onMouseDown={(e) => onConnectionClick(e, c.id)} />
                      <path d={d} fill="none" stroke={isSelected ? "hsl(var(--primary))" : "#CBD5E1"} strokeWidth={isSelected ? 2 : 1.5} style={{ pointerEvents: "none" }} />
                    </g>
                  );
                })}
                {tempLine && (
                  <path d={tempLine} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="6 4" style={{ pointerEvents: "none" }} />
                )}
              </svg>

              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const showHandles = isSelected || connectingFrom !== null;
                return (
                  <div
                    key={node.id}
                    className={`absolute flex items-center justify-center bg-background border shadow-sm rounded-lg cursor-move transition-shadow ${
                      isSelected ? "ring-2 ring-primary border-primary/30 shadow-md" : "border-border hover:shadow-md"
                    }`}
                    style={{ left: node.x, top: node.y, width: node.width, height: node.height, zIndex: isSelected ? 10 : 1 }}
                    onMouseDown={(e) => onNodeMouseDown(e, node.id)}
                    onDoubleClick={() => startEdit(node.id)}
                  >
                    {editingNodeId === node.id ? (
                      <input
                        autoFocus
                        defaultValue={node.label}
                        className="w-full text-center text-xs font-mono bg-transparent outline-none border-none text-foreground px-1"
                        onBlur={(e) => commitEdit(node.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(node.id, (e.target as HTMLInputElement).value);
                          if (e.key === "Escape") setEditingNodeId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-xs font-mono text-foreground select-none truncate px-2">{node.label}</span>
                    )}

                    {showHandles && SIDES.map(side => {
                      const pos = side === "top" ? { left: "50%", top: -HANDLE_R, transform: "translateX(-50%)" }
                        : side === "bottom" ? { left: "50%", bottom: -HANDLE_R, transform: "translateX(-50%)" }
                        : side === "left" ? { top: "50%", left: -HANDLE_R, transform: "translateY(-50%)" }
                        : { top: "50%", right: -HANDLE_R, transform: "translateY(-50%)" };
                      return (
                        <div
                          key={side}
                          className="absolute w-2.5 h-2.5 rounded-full bg-primary border-2 border-background cursor-crosshair z-20 hover:scale-125 transition-transform"
                          style={{ ...pos }}
                          onMouseDown={(e) => onHandleMouseDown(e, node.id, side)}
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
