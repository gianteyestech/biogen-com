"use client";
import { useState, useTransition, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSHeroSlide } from "@/lib/cms-types";
import { actionUpdateHeroSlides, actionGetHeroSlides } from "../actions";
import { Plus, Trash2, Save, Check } from "lucide-react";

const defaultSlide = (): CMSHeroSlide => ({
  id: `slide-${Date.now()}`,
  title: "Precision Pharmaceuticals\n& Clinical Supplies",
  subtitle: "WHO-GMP & ISO 9001:2015 Certified Healthcare Solutions",
  bg: "#0A0F1D",
  accent: "#0072CE",
  img: "https://assets.idealdryfruit.com/uploads/products/2026/08/biogen_hero_banner1.webp",
  promoText: "GMP Certified",
  promoLabel: "Medical Grade",
  ctaText: "Explore Catalog",
});

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<CMSHeroSlide[]>([]);
  const [pending, startT] = useTransition();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    actionGetHeroSlides().then(setSlides);
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const update = (id: string, field: keyof CMSHeroSlide, value: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const remove = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  const add = () => {
    setSlides([...slides, defaultSlide()]);
  };

  const save = () => {
    startT(async () => {
      await actionUpdateHeroSlides(slides);
      flash("Hero carousel banners saved successfully!");
    });
  };

  const inputCls = "w-full px-3 py-2 bg-[#070B14] border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-[#0072CE] transition-all placeholder-slate-500";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Storefront Banners</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Hero Slides &amp; Spotlights</h1>
          <p className="text-slate-400 text-xs mt-0.5">{slides.length} active slides in primary carousel</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={add}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors uppercase tracking-wider"
          >
            <Plus size={14} /> Add Slide
          </button>
          <button
            onClick={save}
            disabled={pending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0072CE] hover:bg-[#005EA6] disabled:opacity-60 transition-colors shadow-sm uppercase tracking-wider"
          >
            {pending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            Save All
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      <div className="space-y-6">
        {slides.map((s, i) => (
          <div key={s.id} className="bg-[#0E1526] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Slide #{i + 1} — {s.id}</span>
              <button
                onClick={() => remove(s.id)}
                className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/30 rounded-lg transition-colors"
                title="Delete slide"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Headline (use \n for line breaks)</label>
                <textarea
                  rows={2}
                  value={s.title}
                  onChange={e => update(s.id, "title", e.target.value)}
                  className={inputCls + " resize-none"}
                />
              </div>
              <div>
                <label className={labelCls}>Subtitle / Key Specialty</label>
                <textarea
                  rows={2}
                  value={s.subtitle}
                  onChange={e => update(s.id, "subtitle", e.target.value)}
                  className={inputCls + " resize-none"}
                />
              </div>
            </div>

            <ImageUploader
              label="Banner Background / Product Image"
              value={s.img}
              folder="banners"
              onChange={(url) => update(s.id, "img", url)}
              placeholder="Upload wide 1200x500 hero banner..."
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelCls}>Promo Badge Text</label>
                <input value={s.promoText} onChange={e => update(s.id, "promoText", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Badge Label</label>
                <input value={s.promoLabel} onChange={e => update(s.id, "promoLabel", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CTA Button Text</label>
                <input value={s.ctaText} onChange={e => update(s.id, "ctaText", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Accent Color (Hex)</label>
                <input value={s.accent} onChange={e => update(s.id, "accent", e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
