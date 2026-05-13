import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Trash2, Plus, Download } from "lucide-react";
import { useProjects, deleteProject, updateProject, cycleProjectStatus } from "../data/store";
import { StatusBadge } from "../components/StatusBadge";
import { EditableText } from "../components/EditableText";
import { TemplatePicker } from "../components/TemplatePicker";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export function HomePage() {
  const projects = useProjects();
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const { canInstall, install } = useInstallPrompt();

  return (
    <div className="px-4 pt-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Projekt</h1>
          <p className="text-sm text-slate-500">Alla projekt</p>
        </div>
        {canInstall && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-wood-600 text-white text-sm font-medium active:bg-wood-700 transition-colors"
          >
            <Download size={16} />
            Installera app
          </button>
        )}
      </div>

      <div className="space-y-3">
        {projects.map((project) => {
          const totalPhases = project.phases.length;
          const donePhases = project.phases.filter((p) => p.status === "done").length;

          return (
            <div
              key={project.id}
              className="relative bg-white rounded-xl p-4 pr-10 shadow-sm border border-slate-100 cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <EditableText
                      value={project.name}
                      onSave={(v) => updateProject(project.id, { name: v })}
                      className="text-lg font-semibold text-slate-800"
                    />
                    <StatusBadge status={project.status} onClick={() => cycleProjectStatus(project.id)} />
                  </div>
                  <EditableText
                    value={project.description}
                    onSave={(v) => updateProject(project.id, { description: v })}
                    className="text-sm text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    {donePhases}/{totalPhases} faser klara
                  </p>
                </div>
                <ChevronRight size={20} className="text-slate-300 mt-1 shrink-0" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Ta bort "${project.name}"?`)) deleteProject(project.id);
                }}
                className="absolute top-3 right-10 p-1.5 rounded-lg bg-white text-red-400 shadow-sm border border-slate-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-500 active:bg-slate-50 transition-colors"
        >
          <Plus size={18} />
          Nytt projekt
        </button>
      </div>

      {showPicker && (
        <TemplatePicker
          onClose={() => setShowPicker(false)}
          onCreated={(projectId) => navigate(`/project/${projectId}`)}
        />
      )}
    </div>
  );
}
