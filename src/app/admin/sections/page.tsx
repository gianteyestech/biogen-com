"use client";
import { useState, useTransition, useEffect } from "react";
import type { CMSPageSection } from "@/lib/cms-types";
import { actionUpdatePagesConfig, actionGetPagesConfig } from "../actions";
import { Save, Check, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

const SECTION_TYPES = [
  { value: "trust-features", label: "Trust Features Bar (Shipping, Support, Guarantee)" },
  { value: "featured", label: "Featured Products Grid" },
  { value: "circles", label: "Shop By Category Circles" },
  { value: "top-selling", label: "Top Selling Products Grid" },
  { value: "deal", label: "Deal of the Day Highlight" },
  { value: "mini-lists", label: "Mini Lists (New, Top Rated, Best Sellers)" },
  { value: "new", label: "New Arrivals (isNew flag)" },
  { value: "category", label: "Specific Category Grid" },
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
      flash("Page sections saved!");
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
      id: `section-${Date.now()}`, title: "New Section", type: "category",
      categoryId: "almonds", visible: true, order: sections.length + 1,
    }]);
  };

  const inputCls = "w-full px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-[#C9A84C] transition-all";

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Page Sections</h1>
          <p className="text-gray-400 text-sm mt-0.5">Control homepage product sections order & visibility</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#222] hover:bg-[#2a2a2a] transition-colors">
            <Plus size={15} /> Add Section
          </button>
          <button onClick={save} disabled={pending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#0D0D0D] disabled:opacity-60"
            style={{ background: goldGrad }}>
            {pending ? <span className="w-4 h-4 border-2 border-[#0D0D0D]/40 border-t-[#0D0D0D] rounded-full animate-spin" /> : <Save size={15} />}
            Save
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-green-950/50 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      <div className="space-y-3">
        {sections.map((s, i) => (
          <div key={s.id} className={`bg-[#181818] border rounded-2xl p-4 transition-all ${s.visible ? "border-[#C9A84C]/10" : "border-gray-700/30 opacity-60"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0}
                  className="text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors p-0.5">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === sections.length - 1}
                  className="text-gray-600 hover:text-gray-300 disabled:opacity-20 transition-colors p-0.5">▼</button>
              </div>
              <GripVertical size={14} className="text-gray-700" />
              <span className="text-xs font-bold text-gray-600 w-5">{i + 1}</span>
              <div className="flex-1">
                <input value={s.title} onChange={e => update(i, "title", e.target.value)}
                  className="bg-transparent text-white font-bold text-sm outline-none border-b border-transparent focus:border-[#C9A84C] transition-all w-full py-0.5" />
              </div>
              <button onClick={() => update(i, "visible", !s.visible)}
                className={`p-2 rounded-lg transition-colors ${s.visible ? "text-green-400 hover:bg-green-950/30" : "text-gray-600 hover:bg-white/5"}`}>
                {s.visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button onClick={() => remove(i)}
                className="p-2 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 ml-9">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Section Type</label>
                <select value={s.type} onChange={e => update(i, "type", e.target.value as CMSPageSection["type"])}
                  className={inputCls + " bg-[#111]"}>
                  {SECTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {s.type === "category" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Category ID</label>
                  <input value={s.categoryId} onChange={e => update(i, "categoryId", e.target.value)} className={inputCls} placeholder="e.g. almonds" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
