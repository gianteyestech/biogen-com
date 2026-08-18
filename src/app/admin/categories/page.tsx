"use client";
import { useState, useTransition, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSCategoriesFile, CMSCategory, CMSCircleCat } from "@/lib/cms-types";
import { actionUpdateCategories, actionGetCategories } from "../actions";
import { Plus, Trash2, Save, Check, Tag, ShieldCheck } from "lucide-react";

export default function AdminCategoriesPage() {
  const [data, setData] = useState<CMSCategoriesFile>({ categories: [], circleCats: [] });
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"categories" | "circles">("categories");

  useEffect(() => { actionGetCategories().then(setData); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = () => {
    startT(async () => {
      await actionUpdateCategories(data);
      flash("Medical categories and departments updated successfully!");
    });
  };

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  const updateCat = (i: number, field: keyof CMSCategory, val: string) => {
    const cats = [...data.categories];
    cats[i] = { ...cats[i], [field]: val };
    setData({ ...data, categories: cats });
  };

  const updateCircle = (i: number, field: keyof CMSCircleCat, val: string) => {
    const circles = [...data.circleCats];
    circles[i] = { ...circles[i], [field]: val };
    setData({ ...data, circleCats: circles });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Classification Engine</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Medical Departments &amp; Categories</h1>
          <p className="text-slate-400 text-xs mt-0.5">Configure clinical navigation hierarchies and homepage department circles</p>
        </div>
        <button
          onClick={save}
          disabled={pending}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
        >
          {pending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>

      {msg && (
        <div className="mb-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-0">
        {(["categories", "circles"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              tab === t
                ? "text-[#00A3E0] border-b-2 border-[#0072CE] bg-slate-800/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t === "categories" ? "Catalog Departments" : "Homepage Circular Badges"}
          </button>
        ))}
      </div>

      {tab === "categories" && (
        <div className="space-y-3">
          {data.categories.map((cat, i) => (
            <div key={i} className="bg-[#0E1526] border border-slate-800 rounded-xl p-4 grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center shadow-xs">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <label className={labelCls}>Category Slug ID</label>
                <input
                  value={cat.id}
                  readOnly={cat.id === "all"}
                  onChange={e => updateCat(i, "id", e.target.value)}
                  className={inputCls + (cat.id === "all" ? " opacity-50 cursor-not-allowed" : "")}
                />
              </div>
              <div>
                <label className={labelCls}>Department Title</label>
                <input
                  value={cat.name}
                  onChange={e => updateCat(i, "name", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Icon Emoji</label>
                <input
                  value={cat.icon}
                  onChange={e => updateCat(i, "icon", e.target.value)}
                  className="w-16 px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] text-center"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, categories: [...data.categories, { id: "new-department", name: "New Department", icon: "💊" }] })}
            className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-[#0072CE] rounded-xl text-xs font-bold text-[#00A3E0] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus size={14} /> Add Medical Department
          </button>
        </div>
      )}

      {tab === "circles" && (
        <div className="space-y-3">
          {data.circleCats.map((cat, i) => (
            <div key={i} className="bg-[#0E1526] border border-slate-800 rounded-xl p-4 grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center shadow-xs">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-1 border border-slate-200 flex-shrink-0">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <label className={labelCls}>Department Slug ID</label>
                <input value={cat.id} onChange={e => updateCircle(i, "id", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Display Title</label>
                <input value={cat.name} onChange={e => updateCircle(i, "name", e.target.value)} className={inputCls} />
              </div>
              <div className="col-span-4 pt-2">
                <ImageUploader
                  label="Department Schematic / Graphic"
                  value={cat.img}
                  folder="category"
                  onChange={(url) => updateCircle(i, "img", url)}
                  placeholder="Upload category graphic..."
                />
              </div>
              <button
                onClick={() => setData({ ...data, circleCats: data.circleCats.filter((_, j) => j !== i) })}
                className="col-start-4 p-2 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors self-start"
                title="Remove circle badge"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, circleCats: [...data.circleCats, { id: "new", name: "New Department", img: "" }] })}
            className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-[#0072CE] rounded-xl text-xs font-bold text-[#00A3E0] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus size={14} /> Add Circular Department Badge
          </button>
        </div>
      )}
    </div>
  );
}
