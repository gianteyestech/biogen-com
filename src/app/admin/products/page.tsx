"use client";
import { useState, useTransition, useEffect } from "react";
import type { CMSProduct, CMSCategory } from "@/lib/cms-types";
import { actionCreateProduct, actionUpdateProduct, actionDeleteProduct, actionGetProducts, actionGetCategories } from "../actions";
import { Plus, Search, Pencil, Trash2, X, Check, Package, ShieldCheck } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type Mode = "list" | "add" | "edit";

function PriceEditor({
  label, value, onChange,
}: { label: string; value: Record<string, number>; onChange: (v: Record<string, number>) => void }) {
  const [pairs, setPairs] = useState<{ key: string; val: string }[]>(
    Object.entries(value).map(([k, v]) => ({ key: k, val: String(v) }))
  );

  const sync = (updated: { key: string; val: string }[]) => {
    setPairs(updated);
    const obj: Record<string, number> = {};
    updated.forEach(({ key, val }) => { if (key) obj[key] = parseFloat(val) || 0; });
    onChange(obj);
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</label>
      <div className="space-y-2">
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Dosage / Pack (e.g. 30 Tablets)"
              value={pair.key}
              onChange={(e) => { const u = [...pairs]; u[i] = { ...u[i], key: e.target.value }; sync(u); }}
              className="w-36 px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE]"
            />
            <input
              placeholder="Price ($)"
              value={pair.val}
              onChange={(e) => { const u = [...pairs]; u[i] = { ...u[i], val: e.target.value }; sync(u); }}
              className="flex-1 px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE]"
            />
            <button
              type="button"
              onClick={() => sync(pairs.filter((_, j) => j !== i))}
              className="px-2 py-2 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => sync([...pairs, { key: "", val: "" }])}
          className="text-xs text-[#00A3E0] hover:underline flex items-center gap-1 font-semibold"
        >
          <Plus size={11} /> Add packaging / dosage tier
        </button>
      </div>
    </div>
  );
}

function ProductForm({
  initial, categories, onSave, onCancel, isEdit,
}: {
  initial?: Partial<CMSProduct>;
  categories: CMSCategory[];
  onSave: (fd: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}) {
  const [prices, setPrices] = useState<Record<string, number>>(initial?.prices || {});
  const [origPrices, setOrigPrices] = useState<Record<string, number>>(initial?.originalPrices || {});
  const [pending, startT] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("prices", JSON.stringify(prices));
    fd.set("originalPrices", JSON.stringify(origPrices));
    fd.set("inStock", fd.get("inStock") === "on" ? "true" : "false");
    fd.set("featured", fd.get("featured") === "on" ? "true" : "false");
    fd.set("isNew", fd.get("isNew") === "on" ? "true" : "false");
    startT(async () => {
      try { await onSave(fd); } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  const inputCls = "w-full px-3 py-2.5 bg-[#070B14] border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-[#0072CE] transition-all placeholder-slate-500";
  const labelCls = "block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5";

  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Item Slug ID</label>
          <input name="id" defaultValue={initial?.id || ""} required readOnly={isEdit}
            placeholder="e.g. paracetamol-500mg" className={inputCls + (isEdit ? " opacity-50 cursor-not-allowed" : "")} />
        </div>
        <div>
          <label className={labelCls}>Department / Category</label>
          <select name="category" defaultValue={initial?.category || ""} required className={inputCls + " bg-[#070B14]"}>
            {categories.filter(c => c.id !== "all").map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Medical Product Name</label>
        <input name="name" defaultValue={initial?.name || ""} required placeholder="e.g. Allergy Relief Tablets (Antihistamine)" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Scientific / Generic Formula</label>
        <input name="urduName" defaultValue={initial?.urduName || ""} placeholder="e.g. Cetirizine HCl 10mg" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Clinical Specifications &amp; Description</label>
        <textarea name="description" defaultValue={initial?.description || ""} rows={3}
          placeholder="Dosage guidelines, indications, storage conditions..." className={inputCls + " resize-none"} />
      </div>

      <ImageUploader
        label="Medical Image / Schematic"
        value={imageUrl}
        folder="products"
        onChange={setImageUrl}
        placeholder="Upload high-res medical image or choose from gallery..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PriceEditor label="Standard Wholesale Prices ($)" value={prices} onChange={setPrices} />
        <PriceEditor label="Original / Hospital List Prices ($)" value={origPrices} onChange={setOrigPrices} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelCls}>Clinical Rating</label>
          <input name="rating" type="number" step="0.1" min="1" max="5" defaultValue={initial?.rating || 4.9} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Verified Reviews Count</label>
          <input name="reviewsCount" type="number" min="0" defaultValue={initial?.reviewsCount || 0} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Quality / Status Badge</label>
          <input name="badge" defaultValue={initial?.badge || ""} placeholder="e.g. Top Seller, Hospital Grade" className={inputCls} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { name: "inStock", label: "In Active Stock", checked: initial?.inStock ?? true },
          { name: "featured", label: "Spotlight Product", checked: initial?.featured ?? false },
          { name: "isNew", label: "New Formulation", checked: initial?.isNew ?? false },
        ].map(({ name, label, checked }) => (
          <label key={name} className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name={name} defaultChecked={checked}
              className="w-4 h-4 rounded accent-[#0072CE]" />
            <span className="text-sm font-semibold text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 flex items-center gap-2 shadow-md transition-colors">
          {pending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
          {isEdit ? "Save Changes" : "Publish to Catalog"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [mode, setMode] = useState<Mode>("list");
  const [editProduct, setEditProduct] = useState<CMSProduct | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [p, c] = await Promise.all([actionGetProducts(), actionGetCategories()]);
    setProducts(p);
    setCategories(c.categories);
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.genericName && p.genericName.toLowerCase().includes(q)) ||
      (p.registrationNo && p.registrationNo.toLowerCase().includes(q));
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleCreate = async (fd: FormData) => {
    await actionCreateProduct(fd);
    await load();
    setMode("list");
    flash("Medical product registered in catalog successfully!");
  };

  const handleUpdate = async (fd: FormData) => {
    if (!editProduct) return;
    await actionUpdateProduct(editProduct.id, fd);
    await load();
    setMode("list");
    setEditProduct(null);
    flash("Product updated successfully!");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    startT(async () => {
      await actionDeleteProduct(deleteId);
      await load();
      setDeleteId(null);
      flash("Product removed from catalog.");
    });
  };

  if (mode === "add") return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMode("list")} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        <h1 className="text-xl sm:text-2xl font-black text-white">Add New Medical Product</h1>
      </div>
      <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md">
        <ProductForm categories={categories} onSave={handleCreate} onCancel={() => setMode("list")} />
      </div>
    </div>
  );

  if (mode === "edit" && editProduct) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setMode("list"); setEditProduct(null); }} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        <h1 className="text-xl sm:text-2xl font-black text-white">Edit Medical Product</h1>
      </div>
      <div className="bg-[#0E1526] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md">
        <ProductForm initial={editProduct} categories={categories} onSave={handleUpdate} onCancel={() => { setMode("list"); setEditProduct(null); }} isEdit />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Catalog Management</span>
          <h1 className="text-xl sm:text-2xl font-black text-white">Pharmaceutical &amp; Medical Products</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{products.length} total products in database</p>
        </div>
        <button
          onClick={() => setMode("add")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] transition-colors shadow-sm w-full sm:w-auto uppercase tracking-wider"
        >
          <Plus size={16} /> Add Medical Product
        </button>
      </div>

      {msg && (
        <div className="mb-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medical products by name or category…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#0E1526] border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-[#0072CE] transition-all placeholder-slate-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-[#0E1526] border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-[#0072CE]"
        >
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Products table */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-2xl overflow-x-auto shadow-sm">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-3 border-b border-slate-800 bg-[#0A0F1D]">
            <span className="w-12">IMG</span>
            <span>NAME / DEPARTMENT</span>
            <span className="w-24 text-right">UNIT PRICE</span>
            <span className="w-20 text-center">STATUS</span>
            <span className="w-16 text-center">FLAGS</span>
            <span className="w-16 text-center">ACTIONS</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Package size={32} className="mx-auto text-slate-700 mb-3" />
                <p className="text-slate-500 text-xs">No medical products found matching search filter</p>
              </div>
            )}
            {filtered.map((p) => {
              const firstPrice = Object.values(p.prices)[0];
              return (
                <div key={p.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-0 px-4 py-3 hover:bg-slate-800/30 transition-colors">
                  <div className="w-12 pr-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-white p-0.5 border border-slate-200">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {p.category} {p.brand ? `· ${p.brand}` : ""} {p.registrationNo ? `· ${p.registrationNo}` : ""}
                    </p>
                  </div>
                  <div className="w-24 text-right pr-3">
                    <p className="text-xs font-bold text-[#00A3E0]">${firstPrice?.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-500">{Object.keys(p.prices).length} pack tiers</p>
                  </div>
                  <div className="w-20 text-center pr-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.inStock ? "bg-emerald-900/50 text-emerald-400" : "bg-red-900/50 text-red-400"}`}>
                      {p.inStock ? "IN STOCK" : "OUT"}
                    </span>
                  </div>
                  <div className="w-16 flex gap-1 justify-center pr-3">
                    {p.featured && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#00A3E0]">★</span>}
                    {p.isNew && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400">NEW</span>}
                  </div>
                  <div className="w-16 flex gap-1 justify-center">
                    <button
                      onClick={() => { setEditProduct(p); setMode("edit"); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#00A3E0] hover:bg-blue-500/10 transition-all"
                      title="Edit Product"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0E1526] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Medical Product?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This will permanently remove <span className="text-white font-semibold">"{products.find(p => p.id === deleteId)?.name}"</span> from the catalog. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={pending}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
