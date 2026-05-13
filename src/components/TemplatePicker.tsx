import { useState } from "react";
import { X, FileText, Check } from "lucide-react";
import { projectTemplates, type ProjectTemplate } from "../data/templates";
import { addProject, addProjectFromTemplate } from "../data/store";

interface TemplatePickerProps {
  onClose: () => void;
  onCreated: (projectId: string) => void;
}

export function TemplatePicker({ onClose, onCreated }: TemplatePickerProps) {
  const [selected, setSelected] = useState<"empty" | ProjectTemplate | null>(null);
  const [name, setName] = useState("");

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;

    let projectId: string | undefined;
    if (selected === "empty") {
      projectId = addProject(trimmed, "");
    } else if (selected) {
      projectId = addProjectFromTemplate(selected, trimmed);
    }
    if (projectId) {
      onCreated(projectId);
      onClose();
    }
  }

  const totalSteps = (t: ProjectTemplate) =>
    t.phases.reduce((sum, p) => sum + p.steps.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-t-2xl p-5 pb-8 safe-area-pb animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {!selected ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Nytt projekt</h2>
              <button onClick={onClose} className="p-1 text-slate-400">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-2">
              {/* Empty project */}
              <button
                onClick={() => setSelected("empty")}
                className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-left active:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <FileText size={20} className="text-slate-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Tomt projekt</h3>
                  <p className="text-xs text-slate-500">Börja från scratch</p>
                </div>
              </button>

              {/* Templates */}
              {projectTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => { setSelected(template); setName(template.name); }}
                  className="flex items-center gap-3 w-full p-4 rounded-xl bg-wood-50 border border-wood-200 text-left active:bg-wood-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-wood-200 flex items-center justify-center text-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800">{template.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{template.description}</p>
                    <p className="text-xs text-wood-600 mt-0.5">
                      {template.phases.length} faser, {totalSteps(template)} steg
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                {selected === "empty" ? "Nytt tomt projekt" : `Ny ${selected.name}`}
              </h2>
              <button onClick={() => { setSelected(null); setName(""); }} className="p-1 text-slate-400">
                <X size={22} />
              </button>
            </div>

            {selected !== "empty" && (
              <div className="mb-4 p-3 rounded-lg bg-wood-50 border border-wood-200">
                <p className="text-xs text-wood-700">
                  Skapar projekt med {selected.phases.length} faser: {selected.phases.map((p) => p.name).join(", ")}
                </p>
              </div>
            )}

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              placeholder="Projektnamn"
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-wood-500/30 focus:border-wood-500 mb-3"
            />

            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-wood-600 text-white text-sm font-semibold disabled:opacity-40 active:bg-wood-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Skapa projekt
            </button>
          </>
        )}
      </div>
    </div>
  );
}
