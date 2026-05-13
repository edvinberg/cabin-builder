import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  onDelete?: () => void;
  className?: string;
}

export function EditableText({ value, onSave, onDelete, className = "" }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setEditing(false); setDraft(value); }
          }}
          className="flex-1 px-2 py-1 text-sm bg-white border border-wood-300 rounded-md outline-none focus:ring-2 focus:ring-wood-500/30"
        />
        <button onClick={handleSave} className="p-1 rounded bg-wood-600 text-white">
          <Check size={14} />
        </button>
        <button onClick={() => { setEditing(false); setDraft(value); }} className="p-1 rounded bg-slate-100 text-slate-400">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-1 ${className}`}>
      <span className="flex-1 min-w-0">{value}</span>
      <button
        onClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true); }}
        className="p-1 rounded text-slate-400 shrink-0"
      >
        <Pencil size={14} />
      </button>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded text-red-400 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
