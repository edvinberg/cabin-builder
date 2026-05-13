import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useLearnings, addLearning, deleteLearning } from "../data/store";
import type { LearningCategory } from "../types";
import { MultiFieldForm } from "../components/InlineForm";

const categories: { key: LearningCategory | "all"; label: string }[] = [
  { key: "all", label: "Alla" },
  { key: "grund", label: "Grund" },
  { key: "stomme", label: "Stomme" },
  { key: "tak", label: "Tak" },
  { key: "isolering", label: "Isolering" },
  { key: "el", label: "El" },
  { key: "vvs", label: "VVS" },
  { key: "verktyg", label: "Verktyg" },
  { key: "övrigt", label: "Övrigt" },
];

const categoryColors: Record<LearningCategory, string> = {
  grund: "bg-orange-100 text-orange-700",
  stomme: "bg-blue-100 text-blue-700",
  tak: "bg-purple-100 text-purple-700",
  isolering: "bg-pink-100 text-pink-700",
  el: "bg-yellow-100 text-yellow-700",
  vvs: "bg-cyan-100 text-cyan-700",
  verktyg: "bg-slate-100 text-slate-700",
  övrigt: "bg-gray-100 text-gray-700",
};

const categoryKeys: LearningCategory[] = ["grund", "stomme", "tak", "isolering", "el", "vvs", "verktyg", "övrigt"];

export function LearningsPage() {
  const learnings = useLearnings();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory | "all">("all");

  const filtered = learnings.filter((l) => {
    const matchesSearch =
      search === "" ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.body.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Lärdomar</h1>
      <p className="text-sm text-slate-500 mb-4">Saker vi lärt oss</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Sök lärdomar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-wood-500/30 focus:border-wood-500"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === key
                ? "bg-wood-600 text-white"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Learnings list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 py-8 text-center">
            {search ? "Inga lärdomar matchade sökningen" : "Inga lärdomar ännu"}
          </p>
        )}
        {filtered.map((learning) => (
          <div
            key={learning.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-semibold text-slate-800">{learning.title}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[learning.category]}`}>
                  {learning.category}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Ta bort "${learning.title}"?`)) deleteLearning(learning.id);
                  }}
                  className="p-1 rounded text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{learning.body}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              {learning.projectName && <span>{learning.projectName}</span>}
              <span>{learning.createdAt}</span>
            </div>
          </div>
        ))}

        <MultiFieldForm
          fields={[
            { key: "title", placeholder: "Titel (t.ex. 'Förborra i lärkträ')" },
            { key: "body", placeholder: "Vad lärde vi oss? Detaljer..." },
            { key: "category", placeholder: "Kategori (grund, stomme, tak, isolering, el, vvs, verktyg, övrigt)" },
          ]}
          onSubmit={(v) => {
            const cat = categoryKeys.includes(v.category as LearningCategory)
              ? (v.category as LearningCategory)
              : "övrigt";
            addLearning({
              title: v.title,
              body: v.body ?? "",
              category: cat,
              projectId: null,
            });
          }}
          buttonLabel="Ny lärdom"
        />
      </div>
    </div>
  );
}
