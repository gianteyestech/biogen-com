"use client";
import { useState, useTransition, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSCategoriesFile, CMSCategory, CMSCircleCat } from "@/lib/cms-types";
import { actionUpdateCategories, actionGetCategories } from "../actions";
import { Plus, Trash2, Save, Check } from "lucide-react";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

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
      flash("Categories saved!");
    });
  };

  const inputCls = "w-full px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-[#C9A84C] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1";

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage navigation & circle categories</p>
        </div>
        <button onClick={save} disabled={pending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#0D0D0D] disabled:opacity-60"
          style={{ background: goldGrad }}>
          {pending ? <span className="w-4 h-4 border-2 border-[#0D0D0D]/40 border-t-[#0D0D0D] rounded-full animate-spin" /> : <Save size={15} />}
          Save All
        </button>
      </div>

      {msg && (
        <div className="mb-4 bg-green-950/50 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#C9A84C]/10 pb-0">
        {(["categories", "circles"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all ${tab === t ? "text-[#C9A84C] border-b-2 border-[#C9A84C]" : "text-gray-500 hover:text-gray-300"}`}>
            {t === "categories" ? "Navigation Categories" : "Homepage Circle Cats"}
          </button>
        ))}
      </div>

      {tab === "categories" && (
        <div className="space-y-3">
          {data.categories.map((cat, i) => (
            <div key={i} className="bg-[#181818] border border-[#C9A84C]/10 rounded-xl p-4 grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <label className={labelCls}>Category ID</label>
                <input value={cat.id} readOnly={cat.id === "all"}
                  onChange={e => updateCat(i, "id", e.target.value)}
                  className={inputCls + (cat.id === "all" ? " opacity-50 cursor-not-allowed" : "")} />
              </div>
              <div>
                <label className={labelCls}>Display Name</label>
                <input value={cat.name} onChange={e => updateCat(i, "name", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Icon</label>
                <input value={cat.icon} onChange={e => updateCat(i, "icon", e.target.value)}
                  className="w-16 px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-[#C9A84C] text-center" />
              </div>
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, categories: [...data.categories, { id: "new-cat", name: "New Category", icon: "🛍️" }] })}
            className="w-full py-3 border-2 border-dashed border-[#C9A84C]/20 rounded-xl text-sm text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Add Category
          </button>
        </div>
      )}

      {tab === "circles" && (
        <div className="space-y-3">
          {data.circleCats.map((cat, i) => (
            <div key={i} className="bg-[#181818] border border-[#C9A84C]/10 rounded-xl p-4 grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center">
              <img src={cat.img} alt={cat.name} className="w-12 h-12 rounded-full object-cover bg-gray-800 flex-shrink-0" />
              <div>
                <label className={labelCls}>Category ID</label>
                <input value={cat.id} onChange={e => updateCircle(i, "id", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Display Name</label>
                <input value={cat.name} onChange={e => updateCircle(i, "name", e.target.value)} className={inputCls} />
              </div>
              <div className="col-span-4">
                <ImageUploader
                  label="Category Icon/Image"
                  value={cat.img}
                  folder="category"
                  onChange={(url) => updateCircle(i, "img", url)}
                  placeholder="Upload category icon image..."
                />
              </div>
              <button onClick={() => setData({ ...data, circleCats: data.circleCats.filter((_, j) => j !== i) })}
                className="col-start-4 p-2 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors self-start mt-6">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, circleCats: [...data.circleCats, { id: "new", name: "New", img: "" }] })}
            className="w-full py-3 border-2 border-dashed border-[#C9A84C]/20 rounded-xl text-sm text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Add Circle Category
          </button>
        </div>
      )}
    </div>
  );
}
