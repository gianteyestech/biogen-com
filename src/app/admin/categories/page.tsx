"use client";
import { useState, useTransition, useEffect, useMemo } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSCategoriesFile, CMSCategory, CMSCircleCat, CMSMegaMenuEntry, CMSSubCategory } from "@/lib/cms-types";
import { actionUpdateCategories, actionGetCategories } from "../actions";
import { 
  Plus, Trash2, Save, Check, Tag, ChevronUp, ChevronDown, 
  Search, Layers, ListTree, FolderPlus, X, AlertCircle, Sparkles, ChevronRight
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [data, setData] = useState<CMSCategoriesFile>({ categories: [], circleCats: [], megaMenu: [] });
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"categories" | "megamenu" | "circles">("categories");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("💊");
  
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [activeMegaDept, setActiveMegaDept] = useState<string | null>(null);

  useEffect(() => {
    actionGetCategories().then((res) => {
      setData({
        categories: res.categories || [],
        circleCats: res.circleCats || [],
        megaMenu: res.megaMenu || [],
      });
    });
  }, []);

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3500);
  };

  const save = () => {
    startT(async () => {
      await actionUpdateCategories(data);
      flash("Medical categories, navigation taxonomy & circular badges saved successfully!");
    });
  };

  // ── Category Handlers ──
  const updateCat = (i: number, field: keyof CMSCategory, val: string) => {
    const cats = [...data.categories];
    const oldId = cats[i].id;
    cats[i] = { ...cats[i], [field]: val };
    
    // If slug changed, also sync megaMenu and circleCats
    let mega = data.megaMenu || [];
    let circles = data.circleCats || [];
    if (field === "id" && oldId !== val) {
      mega = mega.map(m => m.id === oldId ? { ...m, id: val, slug: val } : m);
      circles = circles.map(c => c.id === oldId ? { ...c, id: val } : c);
    }
    if (field === "name") {
      mega = mega.map(m => m.id === oldId ? { ...m, name: val } : m);
    }
    if (field === "icon") {
      mega = mega.map(m => m.id === oldId ? { ...m, icon: val } : m);
    }

    setData({ ...data, categories: cats, megaMenu: mega, circleCats: circles });
  };

  const moveCat = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= data.categories.length) return;
    const cats = [...data.categories];
    const [moved] = cats.splice(index, 1);
    cats.splice(targetIndex, 0, moved);
    setData({ ...data, categories: cats });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = (newCatSlug || newCatName).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug || !newCatName) return;

    if (data.categories.some(c => c.id === slug)) {
      alert(`Category with slug "${slug}" already exists!`);
      return;
    }

    const newCat: CMSCategory = {
      id: slug,
      name: newCatName.trim(),
      icon: newCatIcon || "💊"
    };

    const newMegaEntry: CMSMegaMenuEntry = {
      id: slug,
      name: newCatName.trim(),
      icon: newCatIcon || "💊",
      subcategories: []
    };

    setData({
      ...data,
      categories: [...data.categories, newCat],
      megaMenu: [...(data.megaMenu || []), newMegaEntry]
    });

    setNewCatName("");
    setNewCatSlug("");
    setNewCatIcon("💊");
    setAddCatOpen(false);
    flash(`Added department "${newCat.name}"! Click 'Save Changes' to publish.`);
  };

  const confirmDeleteCategory = () => {
    if (!deleteCatId || deleteCatId === "all") return;
    const cats = data.categories.filter(c => c.id !== deleteCatId);
    const mega = (data.megaMenu || []).filter(m => m.id !== deleteCatId);
    const circles = (data.circleCats || []).filter(c => c.id !== deleteCatId);
    setData({ ...data, categories: cats, megaMenu: mega, circleCats: circles });
    setDeleteCatId(null);
    flash("Department removed. Click 'Save Changes' to apply.");
  };

  // ── Circle Badge Handlers ──
  const updateCircle = (i: number, field: keyof CMSCircleCat, val: string) => {
    const circles = [...data.circleCats];
    circles[i] = { ...circles[i], [field]: val };
    setData({ ...data, circleCats: circles });
  };

  const moveCircle = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= data.circleCats.length) return;
    const circles = [...data.circleCats];
    const [moved] = circles.splice(index, 1);
    circles.splice(targetIndex, 0, moved);
    setData({ ...data, circleCats: circles });
  };

  const removeCircle = (index: number) => {
    const circles = data.circleCats.filter((_, i) => i !== index);
    setData({ ...data, circleCats: circles });
  };

  const addCircle = () => {
    const firstCat = data.categories.find(c => c.id !== "all") || data.categories[0];
    const newBadge: CMSCircleCat = {
      id: firstCat?.id || "new-badge",
      name: firstCat?.name || "New Badge",
      img: ""
    };
    setData({ ...data, circleCats: [...data.circleCats, newBadge] });
  };

  // ── MegaMenu / Subcategories Handlers ──
  const addSubcategory = (deptId: string) => {
    const name = prompt("Enter new subcategory name:");
    if (!name || !name.trim()) return;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    const mega = [...(data.megaMenu || [])];
    let entry = mega.find(m => m.id === deptId);
    if (!entry) {
      const cat = data.categories.find(c => c.id === deptId);
      entry = { id: deptId, name: cat?.name || deptId, icon: cat?.icon || "💊", subcategories: [] };
      mega.push(entry);
    }
    entry.subcategories = [...(entry.subcategories || []), { id: slug, name: name.trim() }];
    setData({ ...data, megaMenu: mega });
  };

  const updateSubcategory = (deptId: string, subIdx: number, field: keyof CMSSubCategory, val: string) => {
    const mega = [...(data.megaMenu || [])];
    const entry = mega.find(m => m.id === deptId);
    if (!entry || !entry.subcategories[subIdx]) return;
    entry.subcategories[subIdx] = { ...entry.subcategories[subIdx], [field]: val };
    setData({ ...data, megaMenu: mega });
  };

  const removeSubcategory = (deptId: string, subIdx: number) => {
    const mega = [...(data.megaMenu || [])];
    const entry = mega.find(m => m.id === deptId);
    if (!entry) return;
    entry.subcategories = entry.subcategories.filter((_, i) => i !== subIdx);
    setData({ ...data, megaMenu: mega });
  };

  const moveSubcategory = (deptId: string, subIdx: number, dir: -1 | 1) => {
    const mega = [...(data.megaMenu || [])];
    const entry = mega.find(m => m.id === deptId);
    if (!entry) return;
    const targetIdx = subIdx + dir;
    if (targetIdx < 0 || targetIdx >= entry.subcategories.length) return;
    const [moved] = entry.subcategories.splice(subIdx, 1);
    entry.subcategories.splice(targetIdx, 0, moved);
    setData({ ...data, megaMenu: mega });
  };

  // Filtered categories
  const filteredCats = useMemo(() => {
    if (!searchTerm.trim()) return data.categories.map((c, originalIdx) => ({ ...c, originalIdx }));
    const q = searchTerm.toLowerCase();
    return data.categories
      .map((c, originalIdx) => ({ ...c, originalIdx }))
      .filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [data.categories, searchTerm]);

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-[#0072CE] transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto font-sans antialiased text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Classification Engine</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-500/20 text-[#00A3E0] rounded-full">
              {data.categories.length - 1} Departments
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Medical Departments &amp; Taxonomy</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage clinical catalog departments, reorder navigation hierarchies, and customize circular badges
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAddCatOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors uppercase tracking-wider border border-slate-700"
          >
            <Plus size={15} className="text-[#00A3E0]" /> Add Department
          </button>
          <button
            onClick={save}
            disabled={pending}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
          >
            {pending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-5 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs">
          <Check size={15} /> {msg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0E1526] border border-slate-800 rounded-xl p-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setTab("categories")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            tab === "categories" ? "bg-[#0072CE] text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Tag size={14} /> Catalog Departments ({data.categories.length})
        </button>
        <button
          onClick={() => setTab("megamenu")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            tab === "megamenu" ? "bg-[#0072CE] text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <ListTree size={14} /> Subcategories / Mega Menu ({(data.megaMenu || []).length})
        </button>
        <button
          onClick={() => setTab("circles")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            tab === "circles" ? "bg-[#0072CE] text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles size={14} /> Circular Badges ({data.circleCats.length})
        </button>
      </div>

      {/* ── TAB 1: CATEGORIES & DEPARTMENTS ── */}
      {tab === "categories" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter departments by name or slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0E1526] border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-[#0072CE] placeholder-slate-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredCats.map((cat) => {
              const origIdx = cat.originalIdx;
              const isAll = cat.id === "all";
              return (
                <div
                  key={cat.id + origIdx}
                  className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-xs hover:border-slate-700 transition-colors"
                >
                  {/* Reorder buttons */}
                  <div className="flex sm:flex-col gap-1 items-center justify-center">
                    <button
                      type="button"
                      disabled={origIdx === 0 || isAll}
                      onClick={() => moveCat(origIdx, -1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={origIdx === data.categories.length - 1 || isAll}
                      onClick={() => moveCat(origIdx, 1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="w-14">
                    <label className={labelCls}>Emoji</label>
                    <input
                      value={cat.icon}
                      onChange={e => updateCat(origIdx, "icon", e.target.value)}
                      className="w-full px-2 py-2 bg-[#070B14] border border-slate-700 rounded-xl text-white text-base text-center outline-none focus:border-[#0072CE]"
                    />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <label className={labelCls}>Department Name</label>
                    <input
                      value={cat.name}
                      onChange={e => updateCat(origIdx, "name", e.target.value)}
                      className={inputCls}
                      placeholder="Department Title"
                    />
                  </div>

                  {/* Slug */}
                  <div className="w-full sm:w-48">
                    <label className={labelCls}>Slug ID</label>
                    <input
                      value={cat.id}
                      readOnly={isAll}
                      onChange={e => updateCat(origIdx, "id", e.target.value)}
                      className={inputCls + (isAll ? " opacity-40 cursor-not-allowed" : "")}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center sm:pt-4">
                    {!isAll && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMegaDept(cat.id);
                          setTab("megamenu");
                        }}
                        className="px-2.5 py-2 rounded-xl text-[11px] font-bold text-[#00A3E0] hover:bg-blue-500/10 border border-blue-500/30 transition-colors flex items-center gap-1"
                        title="Edit subcategories"
                      >
                        Subcategories <ChevronRight size={12} />
                      </button>
                    )}
                    {!isAll && (
                      <button
                        type="button"
                        onClick={() => setDeleteCatId(cat.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete Department"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setAddCatOpen(true)}
            className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-[#0072CE] rounded-2xl text-xs font-bold text-[#00A3E0] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus size={16} /> Add Medical Department
          </button>
        </div>
      )}

      {/* ── TAB 2: MEGA MENU & SUBCATEGORIES ── */}
      {tab === "megamenu" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Expand any department to view and manage specific pharmaceutical or surgical subcategories.
          </p>

          <div className="space-y-3">
            {(data.megaMenu || []).map((dept) => {
              const isExpanded = activeMegaDept === dept.id;
              const subCount = dept.subcategories?.length || 0;

              return (
                <div key={dept.id} className="bg-[#0E1526] border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                  {/* Department Accordion Header */}
                  <div
                    onClick={() => setActiveMegaDept(isExpanded ? null : dept.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{dept.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{dept.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono">{dept.id} · {subCount} subcategories</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold px-2 py-1 bg-slate-800 rounded-lg">
                        {isExpanded ? "Collapse ▲" : "Manage Subcategories ▼"}
                      </span>
                    </div>
                  </div>

                  {/* Subcategories List */}
                  {isExpanded && (
                    <div className="p-4 bg-[#070B14] border-t border-slate-800 space-y-3">
                      {subCount === 0 && (
                        <p className="text-xs text-slate-500 py-3 text-center italic">
                          No subcategories added for this department yet.
                        </p>
                      )}

                      <div className="space-y-2">
                        {(dept.subcategories || []).map((sub, sIdx) => (
                          <div
                            key={sub.id + sIdx}
                            className="bg-[#0E1526] border border-slate-800 rounded-xl p-3 flex items-center gap-2"
                          >
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={sIdx === 0}
                                onClick={() => moveSubcategory(dept.id, sIdx, -1)}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={sIdx === (dept.subcategories?.length || 0) - 1}
                                onClick={() => moveSubcategory(dept.id, sIdx, 1)}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>

                            <div className="flex-1">
                              <input
                                value={sub.name}
                                onChange={e => updateSubcategory(dept.id, sIdx, "name", e.target.value)}
                                className={inputCls}
                                placeholder="Subcategory Name (e.g. Antibiotics)"
                              />
                            </div>

                            <div className="w-44">
                              <input
                                value={sub.id}
                                onChange={e => updateSubcategory(dept.id, sIdx, "id", e.target.value)}
                                className={inputCls}
                                placeholder="slug-id"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeSubcategory(dept.id, sIdx)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                              title="Delete subcategory"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addSubcategory(dept.id)}
                        className="w-full py-2.5 border border-dashed border-slate-700 hover:border-[#0072CE] rounded-xl text-xs font-bold text-[#00A3E0] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus size={13} /> Add Subcategory to {dept.name}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: CIRCULAR BADGES ── */}
      {tab === "circles" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Circular badges appear in the "Explore By Department" quick-carousel on the homepage.
          </p>

          <div className="space-y-4">
            {data.circleCats.map((cat, i) => (
              <div
                key={cat.id + i}
                className="bg-[#0E1526] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Badge #{i + 1}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({cat.id})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveCircle(i, -1)}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                      title="Move Left/Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={i === data.circleCats.length - 1}
                      onClick={() => moveCircle(i, 1)}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                      title="Move Right/Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCircle(i)}
                      className="p-1.5 rounded text-red-400 hover:bg-red-950/30 transition-colors ml-1"
                      title="Remove Badge"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Target Department Link</label>
                    <select
                      value={cat.id}
                      onChange={e => {
                        const sel = data.categories.find(c => c.id === e.target.value);
                        updateCircle(i, "id", e.target.value);
                        if (sel) updateCircle(i, "name", sel.name);
                      }}
                      className={inputCls}
                    >
                      {data.categories.filter(c => c.id !== "all").map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Display Title</label>
                    <input
                      value={cat.name}
                      onChange={e => updateCircle(i, "name", e.target.value)}
                      className={inputCls}
                      placeholder="Title on Homepage"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <ImageUploader
                    label="Department Schematic / Graphic"
                    value={cat.img || cat.image || ""}
                    folder="category"
                    onChange={(url) => updateCircle(i, "img", url)}
                    placeholder="Upload transparent WebP or SVG graphic..."
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addCircle}
            className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-[#0072CE] rounded-2xl text-xs font-bold text-[#00A3E0] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Plus size={16} /> Add Circular Department Badge
          </button>
        </div>
      )}

      {/* ── ADD DEPARTMENT MODAL ── */}
      {addCatOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus size={18} className="text-[#00A3E0]" />
                Add New Medical Department
              </h3>
              <button
                onClick={() => setAddCatOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className={labelCls}>Department Title</label>
                <input
                  required
                  autoFocus
                  placeholder="e.g. Oncology &amp; Chemotherapy"
                  value={newCatName}
                  onChange={e => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <label className={labelCls}>Slug ID</label>
                  <input
                    required
                    placeholder="e.g. oncology-chemotherapy"
                    value={newCatSlug}
                    onChange={e => setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                    className={inputCls}
                  />
                </div>
                <div className="w-20">
                  <label className={labelCls}>Emoji</label>
                  <input
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    className={inputCls + " text-center text-lg"}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddCatOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005EA6] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteCatId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-red-500/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Department?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold">"{data.categories.find(c => c.id === deleteCatId)?.name}"</span>?
                This will remove its navigation menu and taxonomy.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCatId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
