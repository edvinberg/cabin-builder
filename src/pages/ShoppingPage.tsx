import { ShoppingCart, Check } from "lucide-react";
import { useProjects, getAllUnpurchasedMaterials, toggleMaterialPurchased } from "../data/store";

export function ShoppingPage() {
  useProjects(); // subscribe to changes
  const items = getAllUnpurchasedMaterials();

  const grouped = items.reduce(
    (acc, item) => {
      const key = `${item.projectName} — ${item.phaseName}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, typeof items>,
  );

  const totalCost = items.reduce(
    (sum, item) => sum + item.material.quantity * item.material.costPerUnit,
    0,
  );

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Inköpslista</h1>
        <ShoppingCart size={22} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-500 mb-6">
        {items.length} saker att köpa
      </p>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Check size={48} className="mx-auto text-emerald-400 mb-3" />
          <p className="text-sm text-slate-500">Allt är inköpt!</p>
        </div>
      )}

      {Object.entries(grouped).map(([group, groupItems]) => (
        <div key={group} className="mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            {group}
          </h2>
          <div className="space-y-2">
            {groupItems.map(({ material, phaseId }) => (
              <div
                key={material.id}
                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-100"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-800">{material.name}</h3>
                  <div className="flex flex-wrap gap-x-3 text-xs text-slate-500 mt-0.5">
                    <span>{material.quantity} {material.unit}</span>
                    {material.dimensions && <span>{material.dimensions}</span>}
                    <span>{Math.round(material.quantity * material.costPerUnit)} kr</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleMaterialPurchased(phaseId, material.id)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-400 active:bg-emerald-100 active:text-emerald-600 transition-colors shrink-0"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="bg-wood-50 rounded-xl p-4 border border-wood-200 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-wood-700 font-medium">Total att köpa</span>
            <span className="text-wood-800 font-bold text-lg">
              {totalCost.toLocaleString("sv-SE")} kr
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
