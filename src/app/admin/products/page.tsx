"use client";
import { useState, useTransition, useEffect } from "react";
import type { CMSProduct, CMSCategory } from "@/lib/cms-types";
import { actionCreateProduct, actionUpdateProduct, actionDeleteProduct, actionGetProducts, actionGetCategories } from "../actions";
import { Plus, Search, Pencil, Trash2, X, Check, Package } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";
const goldText: React.CSSProperties = {
  background: goldGrad, WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent", backgroundClip: "text",
};

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
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</label>
      <div className="space-y-2">
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Weight (e.g. 250g)"
              value={pair.key}
              onChange={(e) => { const u = [...pairs]; u[i] = { ...u[i], key: e.target.value }; sync(u); }}
              className="w-28 px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-[#C9A84C]"
            />
            <input
              placeholder="Price (Rs)"
              value={pair.val}
              onChange={(e) => { const u = [...pairs]; u[i] = { ...u[i], val: e.target.value }; sync(u); }}
              className="flex-1 px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-[#C9A84C]"
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
          className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1"
        >
          <Plus size={11} /> Add price tier
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

  const inputCls = "w-full px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#C9A84C] transition-all placeholder-gray-600";
  const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5";

  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Product ID (slug)</label>
          <input name="id" defaultValue={initial?.id || ""} required readOnly={isEdit}
            placeholder="e.g. almond-raw" className={inputCls + (isEdit ? " opacity-50 cursor-not-allowed" : "")} />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select name="category" defaultValue={initial?.category || ""} required className={inputCls + " bg-[#111]"}>
            {categories.filter(c => c.id !== "all").map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Product Name</label>
        <input name="name" defaultValue={initial?.name || ""} required placeholder="English name" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Urdu Name</label>
        <input name="urduName" defaultValue={initial?.urduName || ""} placeholder="اردو نام" className={inputCls} dir="rtl" />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" defaultValue={initial?.description || ""} rows={3}
          placeholder="Product description..." className={inputCls + " resize-none"} />
      </div>

      <ImageUploader
        label="Product Image"
        value={imageUrl}
        folder="products"
        onChange={setImageUrl}
        placeholder="Upload product image or choose from gallery..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PriceEditor label="Prices" value={prices} onChange={setPrices} />
        <PriceEditor label="Original Prices (for discount badge)" value={origPrices} onChange={setOrigPrices} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelCls}>Rating</label>
          <input name="rating" type="number" step="0.1" min="1" max="5" defaultValue={initial?.rating || 4.5} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Reviews Count</label>
          <input name="reviewsCount" type="number" min="0" defaultValue={initial?.reviewsCount || 0} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Badge Text</label>
          <input name="badge" defaultValue={initial?.badge || ""} placeholder="e.g. HOT" className={inputCls} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { name: "inStock", label: "In Stock", checked: initial?.inStock ?? true },
          { name: "featured", label: "Featured", checked: initial?.featured ?? false },
          { name: "isNew", label: "New Arrival", checked: initial?.isNew ?? false },
        ].map(({ name, label, checked }) => (
          <label key={name} className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name={name} defaultChecked={checked}
              className="w-4 h-4 rounded accent-[#C9A84C]" />
            <span className="text-sm font-semibold text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#0D0D0D] disabled:opacity-60 flex items-center gap-2"
          style={{ background: goldGrad }}>
          {pending ? <span className="w-4 h-4 border-2 border-[#0D0D0D]/40 border-t-[#0D0D0D] rounded-full animate-spin" /> : <Check size={15} />}
          {isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 bg-[#222] hover:bg-[#2a2a2a] transition-colors">
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
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.includes(q);
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleCreate = async (fd: FormData) => {
    await actionCreateProduct(fd);
    await load();
    setMode("list");
    flash("Product created successfully!");
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
      flash("Product deleted.");
    });
  };

  if (mode === "add") return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMode("list")} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        <h1 className="text-xl sm:text-2xl font-black text-white">Add New Product</h1>
      </div>
      <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-6">
        <ProductForm categories={categories} onSave={handleCreate} onCancel={() => setMode("list")} />
      </div>
    </div>
  );

  if (mode === "edit" && editProduct) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setMode("list"); setEditProduct(null); }} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        <h1 className="text-xl sm:text-2xl font-black text-white">Edit Product</h1>
      </div>
      <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-4 sm:p-6">
        <ProductForm initial={editProduct} categories={categories} onSave={handleUpdate} onCancel={() => { setMode("list"); setEditProduct(null); }} isEdit />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Products</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={() => setMode("add")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#0D0D0D] w-full sm:w-auto"
          style={{ background: goldGrad }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {msg && (
        <div className="mb-4 bg-green-950/50 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#181818] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#C9A84C] transition-all" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-[#181818] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#C9A84C]">
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Products table */}
      <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-0 text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 border-b border-[#C9A84C]/10">
            <span className="w-12">IMG</span>
            <span>NAME / CATEGORY</span>
            <span className="w-20 text-right">PRICE</span>
            <span className="w-16 text-center">STATUS</span>
            <span className="w-16 text-center">FLAGS</span>
            <span className="w-16 text-center">ACTIONS</span>
          </div>
          <div className="divide-y divide-[#C9A84C]/5">
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Package size={32} className="mx-auto text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">No products found</p>
              </div>
            )}
            {filtered.map((p) => {
              const firstPrice = Object.values(p.prices)[0];
              return (
                <div key={p.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-0 px-4 py-3 hover:bg-white/2 transition-colors">
                  <div className="w-12 pr-3">
                    <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-800" />
                  </div>
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{p.category} · {p.id}</p>
                  </div>
                  <div className="w-20 text-right pr-3">
                    <p className="text-sm font-bold text-[#C9A84C]">Rs.{firstPrice?.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-600">{Object.keys(p.prices).length} sizes</p>
                  </div>
                  <div className="w-16 text-center pr-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                      {p.inStock ? "IN STOCK" : "OUT"}
                    </span>
                  </div>
                  <div className="w-16 flex gap-1 justify-center pr-3">
                    {p.featured && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#C9A84C]/20 text-[#C9A84C]">★</span>}
                    {p.isNew && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-400">NEW</span>}
                  </div>
                  <div className="w-16 flex gap-1 justify-center">
                    <button onClick={() => { setEditProduct(p); setMode("edit"); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteId(p.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all">
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
          <div className="bg-[#181818] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-white mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-400 mb-6">
              This will permanently delete <span className="text-white font-semibold">"{products.find(p => p.id === deleteId)?.name}"</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={pending}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-[#222] text-gray-400 text-sm font-bold rounded-xl hover:bg-[#2a2a2a] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
