"use client";
import { useState, useTransition, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CMSHeroSlide } from "@/lib/cms-types";
import { actionUpdateHeroSlides, actionGetHeroSlides } from "../actions";
import { Plus, Trash2, Save, Check } from "lucide-react";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

const defaultSlide = (): CMSHeroSlide => ({
  id: `slide-${Date.now()}`,
  title: "New Slide\nTitle Here",
  subtitle: "Slide subtitle text",
  bg: "linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 50%, #1a1000 100%)",
  accent: "#C9A84C",
  img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
  promoText: "10%",
  promoLabel: "OFF",
  ctaText: "Shop Now",
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
      flash("Hero slides saved!");
    });
  };

  const inputCls = "w-full px-3 py-2 bg-[#111] border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-[#C9A84C] transition-all placeholder-gray-600";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Hero Slides</h1>
          <p className="text-gray-400 text-sm mt-0.5">{slides.length} slides in carousel</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#222] hover:bg-[#2a2a2a] transition-colors">
            <Plus size={15} /> Add Slide
          </button>
          <button onClick={save} disabled={pending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#0D0D0D] disabled:opacity-60"
            style={{ background: goldGrad }}>
            {pending ? <span className="w-4 h-4 border-2 border-[#0D0D0D]/40 border-t-[#0D0D0D] rounded-full animate-spin" /> : <Save size={15} />}
            Save All
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-green-950/50 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Check size={14} /> {msg}
        </div>
      )}

      <div className="space-y-5">
        {slides.map((slide, i) => (
          <div key={slide.id} className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl overflow-hidden">
            {/* Preview bar */}
            <div className="relative h-28 flex items-center px-8 overflow-hidden" style={{ background: slide.bg }}>
              <div className="z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: slide.accent }}>IDEAL DRY FRUIT</p>
                <p className="text-white font-black text-lg leading-tight whitespace-pre-line">{slide.title}</p>
                <p className="text-white/60 text-xs mt-0.5">{slide.subtitle}</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-2/5 overflow-hidden opacity-60">
                <img src={slide.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              </div>
              <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Slide {i + 1}
              </div>
            </div>

            {/* Fields */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title (use \n for line break)</label>
                <textarea value={slide.title} rows={2} onChange={e => update(slide.id, "title", e.target.value)}
                  className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className={labelCls}>Subtitle</label>
                <input value={slide.subtitle} onChange={e => update(slide.id, "subtitle", e.target.value)} className={inputCls} />
              </div>
              <div className="col-span-2">
                <ImageUploader
                  label="Slide Image (Auto WebP & Hostinger Storage)"
                  value={slide.img}
                  folder="banners"
                  onChange={(url) => update(slide.id, "img", url)}
                  placeholder="Upload slide banner image or enter URL..."
                />
              </div>
              <div>
                <label className={labelCls}>Background CSS Gradient</label>
                <input value={slide.bg} onChange={e => update(slide.id, "bg", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Accent Color</label>
                <div className="flex gap-2">
                  <input value={slide.accent} onChange={e => update(slide.id, "accent", e.target.value)} className={inputCls} />
                  <input type="color" value={slide.accent} onChange={e => update(slide.id, "accent", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-700 bg-[#111] cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelCls}>Promo Text</label>
                  <input value={slide.promoText} onChange={e => update(slide.id, "promoText", e.target.value)} className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className={labelCls}>Promo Label</label>
                  <input value={slide.promoLabel} onChange={e => update(slide.id, "promoLabel", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={() => remove(slide.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-950/30 hover:bg-red-950/50 transition-colors">
                  <Trash2 size={14} /> Remove Slide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="bg-[#181818] border border-[#C9A84C]/10 rounded-2xl p-16 text-center">
          <p className="text-gray-500 mb-3">No slides yet</p>
          <button onClick={add} className="text-[#C9A84C] hover:underline text-sm font-semibold">+ Add first slide</button>
        </div>
      )}
    </div>
  );
}
