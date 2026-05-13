import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useProject, addPhase, deletePhase, cyclePhaseStatus, cycleProjectStatus, updateProject, updatePhase, addProjectImage, deleteProjectImage } from "../data/store";
import { StatusBadge } from "../components/StatusBadge";
import { EditableText } from "../components/EditableText";
import { MultiFieldForm } from "../components/InlineForm";
import { ImageGrid } from "../components/ImageGrid";

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProject(projectId!);
  const navigate = useNavigate();

  if (!project) {
    return <div className="p-4 text-slate-500">Projektet hittades inte</div>;
  }

  return (
    <div className="px-4 pt-4">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-wood-600 mb-4">
        <ArrowLeft size={16} />
        Tillbaka
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <EditableText
            value={project.name}
            onSave={(v) => updateProject(project.id, { name: v })}
            className="text-2xl font-bold text-slate-800"
          />
          <StatusBadge status={project.status} onClick={() => cycleProjectStatus(project.id)} />
        </div>
        <EditableText
          value={project.description}
          onSave={(v) => updateProject(project.id, { description: v })}
          className="text-sm text-slate-500"
        />
      </div>

      {/* Project images */}
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Bilder & ritningar</h2>
      <div className="mb-6">
        <ImageGrid
          images={project.images}
          onAddImage={(dataUrl, caption, isDrawing) => addProjectImage(project.id, dataUrl, caption, isDrawing)}
          onDeleteImage={(imageId) => deleteProjectImage(project.id, imageId)}
        />
      </div>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Faser</h2>

      <div className="space-y-2">
        {project.phases.map((phase, index) => {
          const totalSteps = phase.steps.length;
          const doneSteps = phase.steps.filter((s) => s.done).length;
          const progress = totalSteps > 0 ? (doneSteps / totalSteps) * 100 : 0;

          return (
            <div
              key={phase.id}
              className="relative bg-white rounded-xl p-4 pr-10 shadow-sm border border-slate-100 cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => navigate(`/project/${project.id}/phase/${phase.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-400">Fas {index + 1}</span>
                    <StatusBadge status={phase.status} onClick={() => cyclePhaseStatus(phase.id)} />
                  </div>
                  <EditableText
                    value={phase.name}
                    onSave={(v) => updatePhase(phase.id, { name: v })}
                    className="text-base font-semibold text-slate-800 mb-0.5"
                  />
                  <EditableText
                    value={phase.description}
                    onSave={(v) => updatePhase(phase.id, { description: v })}
                    className="text-sm text-slate-500"
                  />

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      {doneSteps === totalSteps && totalSteps > 0 ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <Circle size={14} />
                      )}
                      {doneSteps}/{totalSteps} steg
                    </span>
                    <span>{phase.materials.length} material</span>
                    {phase.images.length > 0 && <span>{phase.images.length} bilder</span>}
                  </div>

                  {totalSteps > 0 && (
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-wood-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <ChevronRight size={20} className="text-slate-300 mt-1 shrink-0" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Ta bort fas "${phase.name}"?`)) deletePhase(phase.id);
                }}
                className="absolute top-3 right-10 p-1.5 rounded-lg bg-white text-red-400 shadow-sm border border-slate-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}

        <MultiFieldForm
          fields={[
            { key: "name", placeholder: "Fasnamn (t.ex. Grund, Stomme, Tak)" },
            { key: "description", placeholder: "Kort beskrivning" },
          ]}
          onSubmit={(v) => addPhase(project.id, v.name, v.description ?? "")}
          buttonLabel="Ny fas"
        />
      </div>
    </div>
  );
}
