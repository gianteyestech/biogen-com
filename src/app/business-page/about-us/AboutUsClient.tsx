"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, ShieldCheck, Award, Truck, HeartPulse, 
  Building2, Stethoscope, Microscope, Users, Sparkles, 
  FileCheck2, Globe2, X, ExternalLink 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import { CMSSiteConfig, CMSGalleryData, CMSAboutContent } from "@/lib/cms-types";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface AboutUsClientProps {
  siteConfig: CMSSiteConfig;
  galleryData: CMSGalleryData;
  aboutContent: CMSAboutContent;
}

export default function AboutUsClient({ siteConfig, galleryData, aboutContent }: AboutUsClientProps) {
  const brand = siteConfig.brand || ({} as any);

  const EXECUTIVE_TEAM = galleryData?.team || [];
  const CORPORATE_GALLERY = galleryData?.gallery || [];

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeGalleryTab, setActiveGalleryTab] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryTabs = ["All", "MOUs & Partnerships", "Awards & Honors", "Delegations", "Plant & Facilities", "Leadership"];

  const filteredGallery = activeGalleryTab === "All"
    ? CORPORATE_GALLERY
    : CORPORATE_GALLERY.filter((item) => item.category === activeGalleryTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        siteConfig={siteConfig}
      />
      <CartSlider siteConfig={siteConfig} />

      {/* ─── BREADCRUMBS ───────────────────────────────────────────── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#0072CE] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#0072CE] font-semibold">About Us &amp; Governance</span>
        </nav>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="global-container pb-16 space-y-10">
        
        {/* Header Hero Card */}
        <div className="bg-gradient-to-r from-[#061938] via-[#0B2545] to-[#061938] rounded-3xl p-8 sm:p-12 text-white shadow-lg border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0072CE]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={13} /> Institutional Healthcare Excellence
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-3">
              About Biogen Pharma
            </h1>
            <p className="text-[#38BDF8] font-bold text-sm sm:text-base uppercase tracking-widest mb-4">
              {brand.tagline || "Enhancing Lives Through Quality Healthcare & Supplies"}
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {aboutContent?.introText}
            </p>
          </div>
        </div>

        {/* ─── EXECUTIVE LEADERSHIP TEAM (REAL PHOTOS) ────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-slate-100 mb-8">
            <div>
              <span className="text-xs font-bold text-[#0072CE] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Users size={14} /> Corporate Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Executive Leadership
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Experienced pharmaceutical executives steering regulatory compliance, global manufacturing alliances, and cold-chain supply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {EXECUTIVE_TEAM.map((member, i) => (
                <div key={member.name || i} className="group relative bg-[#070B14] rounded-2xl border border-slate-800 overflow-hidden hover:border-[#0072CE]/50 transition-all duration-300 flex flex-col">
                  {/* Photo Area */}
                  <div className="w-full aspect-[4/5] bg-slate-900 overflow-hidden relative border-b border-slate-800">
                    <img 
                      src={member.imageUrl || "/images/brands/zafa.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 grayscale hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-80" />
                    {member.badge && (
                      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Award size={12} className="text-[#00A3E0]" />
                        {member.badge}
                      </div>
                    )}
                  </div>
                  {/* Info Area */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 leading-tight">{member.name}</h3>
                      <p className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-4">{member.role}</p>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ─── CORPORATE GALLERY: MOUS, AWARDS, PLANT AUDITS ──────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
            <div>
              <span className="text-xs font-bold text-[#0072CE] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Award size={14} /> Verified Track Record &amp; Facilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Corporate Media &amp; Facility Gallery
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Glimpses of international delegations, bilateral MOU signings, healthcare excellence awards, and cGMP plant audits.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start lg:self-auto">
              {galleryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGalleryTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeGalleryTab === tab
                      ? "bg-white text-[#0072CE] shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGallery.map((item, i) => (
                <div
                  key={item.id || i}
                  className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 aspect-video md:aspect-[4/3] shadow-lg hover:border-[#0072CE]/50 transition-all duration-300"
                  onClick={() => setSelectedImage(i)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs">
                    {item.badge}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-black text-white line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ─── LIGHTBOX MODAL ────────────────────────────────────────── */}
        {selectedImage !== null && (() => {
          const img = CORPORATE_GALLERY[selectedImage];
          if (!img) return null;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 hover:text-rose-400 transition-colors shadow-xl border border-slate-700 z-50"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>

              <div
                className="relative w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row bg-[#070B14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 bg-slate-900 relative flex items-center justify-center p-4">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="max-h-[70vh] max-w-full object-contain rounded-lg"
                  />
                </div>
                
                <div className="w-full md:w-80 lg:w-96 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800 bg-[#070B14]">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-wider text-[#00A3E0] uppercase">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0072CE]/20 border border-[#0072CE]/30 text-[#00A3E0]">
                      {img.badge || img.category}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">
                    {img.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {img.description || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── CORE PILLARS & REGIONAL HUBS ──────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 pb-3 border-b border-slate-100">
            Our Core Healthcare Divisions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {aboutContent?.features?.map((f, i) => {
              const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[f.icon] || LucideIcons.HeartPulse;
              const bgClass = {
                blue: "bg-blue-50/50 border-blue-100",
                sky: "bg-sky-50/50 border-sky-100",
                indigo: "bg-indigo-50/50 border-indigo-100",
                purple: "bg-purple-50/50 border-purple-100",
                emerald: "bg-emerald-50/50 border-emerald-100",
                rose: "bg-rose-50/50 border-rose-100",
                amber: "bg-amber-50/50 border-amber-100"
              }[f.color] || "bg-blue-50/50 border-blue-100";
              const iconBgClass = {
                blue: "bg-[#0072CE]",
                sky: "bg-[#0284C7]",
                indigo: "bg-[#6366F1]",
                purple: "bg-[#8B5CF6]",
                emerald: "bg-[#10B981]",
                rose: "bg-[#F43F5E]",
                amber: "bg-[#F59E0B]"
              }[f.color] || "bg-[#0072CE]";

              return (
                <div key={i} className={`p-5 rounded-2xl border ${bgClass}`}>
                  <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center mb-3 ${iconBgClass}`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 pb-3 border-b border-slate-100">
            Regional Hubs &amp; Direct Warehouses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {siteConfig.locations?.map((loc, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{loc.country === "Sierra Leone" ? "🇸🇱" : loc.country === "The Gambia" ? "🇬🇲" : "🌍"}</span>
                  <h4 className="font-black text-slate-900 text-base">{loc.label}</h4>
                </div>
                <p className="text-xs text-slate-600">{loc.address}</p>
                {loc.phone && <p className="text-xs text-[#0072CE] font-bold mt-2">Phone: {loc.phone}</p>}
                {loc.email && !loc.phone && <p className="text-xs text-[#0072CE] font-bold mt-2">Email: {loc.email}</p>}
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
