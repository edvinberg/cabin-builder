import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckSquare,
  Square,
  Package,
  StickyNote,
  ExternalLink,
  ShoppingCart,
  Check,
  Trash2,
  ImageIcon,
} from "lucide-react";
import {
  useProject,
  toggleStep,
  toggleMaterialPurchased,
  addStep,
  deleteStep,
  addMaterial,
  deleteMaterial,
  addNote,
  deleteNote,
  addLink,
  deleteLink,
  addPhaseImage,
  deletePhaseImage,
} from "../data/store";
import { InlineForm, MultiFieldForm } from "../components/InlineForm";
import { ImageGrid } from "../components/ImageGrid";

type Tab = "steps" | "materials" | "notes" | "links" | "images";

const tabs: { key: Tab; label: string; icon: typeof CheckSquare }[] = [
  { key: "steps", label: "Steg", icon: CheckSquare },
  { key: "materials", label: "Material", icon: Package },
  { key: "notes", label: "Noteringar", icon: StickyNote },
  { key: "links", label: "Länkar", icon: ExternalLink },
  { key: "images", label: "Bilder", icon: ImageIcon },
];

export function PhasePage() {
  const { projectId, phaseId } = useParams<{ projectId: string; phaseId: string }>();
  const project = useProject(projectId!);
  const [activeTab, setActiveTab] = useState<Tab>("steps");

  if (!project) return <div className="p-4 text-slate-500">Projektet hittades inte</div>;

  const phase = project.phases.find((p) => p.id === phaseId);
  if (!phase) return <div className="p-4 text-slate-500">Fasen hittades inte</div>;

  const doneSteps = phase.steps.filter((s) => s.done).length;

  return (
    <div className="px-4 pt-4">
      <Link
        to={`/project/${projectId}`}
        className="inline-flex items-center gap-1 text-sm text-wood-600 mb-4"
      >
        <ArrowLeft size={16} />
        {project.name}
      </Link>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">{phase.name}</h1>
        <p className="text-sm text-slate-500 mt-1">{phase.description}</p>
        {phase.steps.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {doneSteps}/{phase.steps.length} steg klara
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-4 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Steps */}
      {activeTab === "steps" && (
        <div className="space-y-1">
          {phase.steps.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">Inga steg ännu</p>
          )}
          {phase.steps.map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-3 w-full text-left p-3 rounded-lg bg-white border border-slate-100 group cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => toggleStep(phase.id, step.id)}
            >
              {step.done ? (
                <CheckSquare size={20} className="text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <Square size={20} className="text-slate-300 mt-0.5 shrink-0" />
              )}
              <span className={`flex-1 text-sm ${step.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {step.text}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteStep(phase.id, step.id); }}
                className="p-1 rounded text-red-400 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <InlineForm
            placeholder="Nytt steg..."
            onSubmit={(text) => addStep(phase.id, text)}
            buttonLabel="Lägg till steg"
          />
        </div>
      )}

      {/* Materials */}
      {activeTab === "materials" && (
        <div className="space-y-2">
          {phase.materials.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">Inga material ännu</p>
          )}
          {phase.materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-lg p-3 border border-slate-100 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${mat.purchased ? "text-slate-400 line-through" : "text-slate-800"}`}>
                    {mat.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-500">
                    <span>{mat.quantity} {mat.unit}</span>
                    {mat.dimensions && <span>{mat.dimensions}</span>}
                    <span>{mat.costPerUnit} kr/{mat.unit}</span>
                    <span className="font-medium text-slate-600">
                      = {Math.round(mat.quantity * mat.costPerUnit)} kr
                    </span>
                  </div>
                  {mat.notes && (
                    <p className="text-xs text-slate-400 mt-1">{mat.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => deleteMaterial(phase.id, mat.id)}
                    className="p-2 rounded-lg text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => toggleMaterialPurchased(phase.id, mat.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      mat.purchased
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {mat.purchased ? <Check size={18} /> : <ShoppingCart size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {phase.materials.length > 0 && (
            <div className="bg-wood-50 rounded-lg p-3 border border-wood-200">
              <div className="flex justify-between text-sm">
                <span className="text-wood-700 font-medium">Total kostnad</span>
                <span className="text-wood-800 font-semibold">
                  {phase.materials
                    .reduce((sum, m) => sum + m.quantity * m.costPerUnit, 0)
                    .toLocaleString("sv-SE")}{" "}
                  kr
                </span>
              </div>
            </div>
          )}

          <MultiFieldForm
            fields={[
              { key: "name", placeholder: "Materialnamn" },
              { key: "quantity", placeholder: "Antal", type: "number" },
              { key: "unit", placeholder: "Enhet (st, m, m², pkt)" },
              { key: "dimensions", placeholder: "Dimensioner (t.ex. 45x145mm)" },
              { key: "costPerUnit", placeholder: "Pris per enhet (kr)", type: "number" },
              { key: "notes", placeholder: "Anteckning (valfritt)" },
            ]}
            onSubmit={(v) =>
              addMaterial(phase.id, {
                name: v.name,
                quantity: Number(v.quantity) || 0,
                unit: v.unit ?? "st",
                dimensions: v.dimensions ?? "",
                costPerUnit: Number(v.costPerUnit) || 0,
                notes: v.notes ?? "",
              })
            }
            buttonLabel="Lägg till material"
          />
        </div>
      )}

      {/* Notes */}
      {activeTab === "notes" && (
        <div className="space-y-2">
          {phase.notes.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">Inga noteringar ännu</p>
          )}
          {phase.notes.map((note) => (
            <div
              key={note.id}
              className="bg-amber-50 rounded-lg p-3 border border-amber-200 group flex items-start gap-2"
            >
              <p className="text-sm text-amber-900 flex-1">{note.text}</p>
              <button
                onClick={() => deleteNote(phase.id, note.id)}
                className="p-1 rounded text-red-400 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <InlineForm
            placeholder="Ny notering..."
            onSubmit={(text) => addNote(phase.id, text)}
            buttonLabel="Lägg till notering"
          />
        </div>
      )}

      {/* Links */}
      {activeTab === "links" && (
        <div className="space-y-2">
          {phase.links.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">Inga länkar ännu</p>
          )}
          {phase.links.map((link) => (
            <div key={link.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-100 group">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <ExternalLink size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm text-blue-600 font-medium truncate">{link.title}</span>
              </a>
              <button
                onClick={() => deleteLink(phase.id, link.id)}
                className="p-1 rounded text-red-400 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <MultiFieldForm
            fields={[
              { key: "title", placeholder: "Länktitel" },
              { key: "url", placeholder: "URL (https://...)" },
            ]}
            onSubmit={(v) => addLink(phase.id, v.title, v.url)}
            buttonLabel="Lägg till länk"
          />
        </div>
      )}

      {/* Images */}
      {activeTab === "images" && (
        <ImageGrid
          images={phase.images}
          onAddImage={(dataUrl, caption, isDrawing) => addPhaseImage(phase.id, dataUrl, caption, isDrawing)}
          onDeleteImage={(imageId) => deletePhaseImage(phase.id, imageId)}
        />
      )}
    </div>
  );
}
