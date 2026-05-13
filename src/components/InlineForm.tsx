import { useState, useRef, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";

interface InlineFormProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  buttonLabel?: string;
}

export function InlineForm({ placeholder, onSubmit, buttonLabel = "Lägg till" }: InlineFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 active:bg-slate-50 transition-colors"
      >
        <Plus size={18} />
        {buttonLabel}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-wood-300 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none placeholder:text-slate-400"
      />
      <button onClick={handleSubmit} className="p-1.5 rounded-lg bg-wood-600 text-white">
        <Check size={16} />
      </button>
      <button onClick={() => { setOpen(false); setValue(""); }} className="p-1.5 rounded-lg bg-slate-100 text-slate-400">
        <X size={16} />
      </button>
    </div>
  );
}

interface MultiFieldFormProps {
  fields: { key: string; placeholder: string; type?: string }[];
  onSubmit: (values: Record<string, string>) => void;
  buttonLabel?: string;
}

export function MultiFieldForm({ fields, onSubmit, buttonLabel = "Lägg till" }: MultiFieldFormProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) firstRef.current?.focus();
  }, [open]);

  function handleSubmit() {
    const firstVal = values[fields[0].key]?.trim();
    if (!firstVal) return;
    onSubmit(values);
    setValues({});
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 active:bg-slate-50 transition-colors"
      >
        <Plus size={18} />
        {buttonLabel}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl p-3 border border-wood-300 shadow-sm space-y-2">
      {fields.map((field, i) => (
        <input
          key={field.key}
          ref={i === 0 ? firstRef : undefined}
          type={field.type ?? "text"}
          value={values[field.key] ?? ""}
          onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-wood-500/30"
        />
      ))}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} className="flex-1 py-2 rounded-lg bg-wood-600 text-white text-sm font-medium">
          Spara
        </button>
        <button onClick={() => { setOpen(false); setValues({}); }} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-500 text-sm">
          Avbryt
        </button>
      </div>
    </div>
  );
}
