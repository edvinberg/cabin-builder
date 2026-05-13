import { useRef, useEffect, useState, useCallback } from "react";
import { Undo2, Trash2, Check, X } from "lucide-react";

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

const COLORS = ["#1e293b", "#dc2626", "#2563eb", "#16a34a", "#d97706"];
const SIZES = [2, 4, 8];

export function DrawingCanvas({ onSave, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(SIZES[1]);
  const [history, setHistory] = useState<ImageData[]>([]);

  const getCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return { canvas, ctx };
  }, []);

  useEffect(() => {
    const result = getCanvas();
    if (!result) return;
    const { canvas, ctx } = result;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, [getCanvas]);

  function saveState() {
    const result = getCanvas();
    if (!result) return;
    const { canvas, ctx } = result;
    setHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }

  function getPos(e: React.TouchEvent | React.MouseEvent): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  }

  function startDraw(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    const result = getCanvas();
    if (!result) return;
    const { ctx } = result;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  }

  function draw(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    if (!pos) return;
    const result = getCanvas();
    if (!result) return;
    const { ctx } = result;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
  }

  function undo() {
    if (history.length <= 1) return;
    const result = getCanvas();
    if (!result) return;
    const { ctx } = result;
    const newHistory = history.slice(0, -1);
    const prev = newHistory[newHistory.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(newHistory);
  }

  function clearCanvas() {
    const result = getCanvas();
    if (!result) return;
    const { canvas, ctx } = result;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  }

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <button onClick={onClose} className="p-1 text-slate-500">
          <X size={24} />
        </button>
        <span className="text-sm font-semibold text-slate-700">Rita skiss</span>
        <button onClick={handleSave} className="p-1.5 rounded-lg bg-wood-600 text-white">
          <Check size={20} />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white safe-area-pb">
        {/* Colors */}
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                color === c ? "border-slate-800 scale-110" : "border-slate-200"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Sizes */}
        <div className="flex gap-2 items-center">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setLineWidth(s)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                lineWidth === s ? "bg-slate-200" : ""
              }`}
            >
              <div
                className="rounded-full bg-slate-800"
                style={{ width: s + 4, height: s + 4 }}
              />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button onClick={undo} className="p-2 rounded-lg text-slate-500 active:bg-slate-100">
            <Undo2 size={20} />
          </button>
          <button onClick={clearCanvas} className="p-2 rounded-lg text-red-500 active:bg-red-50">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
