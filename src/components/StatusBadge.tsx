import type { ProjectStatus, PhaseStatus } from "../types";

const statusConfig: Record<ProjectStatus | PhaseStatus, { label: string; className: string }> = {
  planning: { label: "Planering", className: "bg-blue-100 text-blue-700" },
  "in-progress": { label: "Pågår", className: "bg-amber-100 text-amber-700" },
  done: { label: "Klar", className: "bg-emerald-100 text-emerald-700" },
  upcoming: { label: "Kommande", className: "bg-slate-100 text-slate-500" },
  active: { label: "Aktiv", className: "bg-amber-100 text-amber-700" },
};

export function StatusBadge({
  status,
  onClick,
}: {
  status: ProjectStatus | PhaseStatus;
  onClick?: () => void;
}) {
  const config = statusConfig[status];

  if (onClick) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium active:scale-95 transition-transform ${config.className}`}
      >
        {config.label} ›
      </button>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
