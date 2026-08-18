"use client";
import { useState, useTransition, useEffect } from "react";
import type { CMSPageSection } from "@/lib/cms-types";
import { actionUpdatePagesConfig, actionGetPagesConfig } from "../actions";
import { Save, Check, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

const SECTION_TYPES = [
  { value: "trust-features", label: "Trust Features Bar (GMP, Cold-Chain, Guarantee)" },
  { value: "featured", label: "Featured Medical Supplies Grid" },
  { value: "circles", label: "Explore By Department Circles" },
  { value: "top-selling", label: "Top Institutional Demand Grid" },
  { value: "deal", label: "Clinical Spotlight / Highlight Equipment" },
  { value: "mini-lists", label: "Mini Lists (New Formulations, Top Rated, Best Sellers)" },
  { value: "new", label: "New Clinical Arrivals" },
  { value: "category", label: "Specific Department Grid" },
];

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<CMSPageSection[]>([]);
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    actionGetPagesConfig().then(cfg => setSections([...cfg.sections].sort((a, b) => a.order - b.order)));
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = () => {
    startT(async () => {
      await actionUpdatePagesConfig({ sections });
      flash("Homepage section layout saved successfully!");
    });
  };

  const update = (i: number, field: keyof CMSPageSection, value: string | boolean | number) => {
    const updated = [...sections];
    updated[i] = { ...updated[i], [field]: value } as CMSPageSection;
    setSections(updated);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const updated = [...sections];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setSections(updated.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const remove = (i: number) => {
    setSections(sections.filter((_, j) => j !== i).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const add = () => {
    setSections([...sections, {
      id: `section-${Date.now()}`, title: "New Medical Section", type: "category",
      categoryId: "medicines", visible: true, order: sections.length + 1,
    }]);
  };

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Layout Builder</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Homepage Sections</h1>
          <p className="text-slate-400 text-xs mt-0.5">Control section visibility, titles, ordering, and product modules</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={add}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors uppercase tracking-wider"
          >
            <Plus size={14} /> Add Section
          </button>
          <button
            onClick={save}
            disabled={pending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
          >
            {pending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            Save Layout
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      <div className="space-y-3">
        {sections.map((s, i) => (
          <div
            key={s.id}
            className={`bg-[#0E1526] border rounded-2xl p-4 transition-all ${
              s.visible ? "border-slate-800" : "border-slate-800/40 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-slate-500 hover:text-white disabled:opacity-20 text-xs p-1"
                >▲</button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === sections.length - 1}
                  className="text-slate-500 hover:text-white disabled:opacity-20 text-xs p-1"
                >▼</button>
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <input
                    value={s.title}
                    onChange={e => update(i, "title", e.target.value)}
                    className="bg-transparent text-white font-bold text-xs outline-none border-b border-transparent focus:border-[#0072CE] transition-all w-full py-0.5"
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{s.id}</p>
                </div>

                <div>
                  <select
                    value={s.type}
                    onChange={e => update(i, "type", e.target.value)}
                    className={inputCls}
                  >
                    {SECTION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => update(i, "visible", !s.visible)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      s.visible
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {s.visible ? "Visible" : "Hidden"}
                  </button>

                  <button
                    onClick={() => remove(i)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
