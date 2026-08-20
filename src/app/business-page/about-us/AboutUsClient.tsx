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
import { BRAND } from "@/config/brand";
import { CMSSiteConfig } from "@/lib/cms-types";

interface AboutUsClientProps {
  siteConfig: CMSSiteConfig;
}

const EXECUTIVE_TEAM = [
  {
    name: "Muhammad Rizwan",
    role: "Chief Executive Officer (CEO)",
    image: "/images/team/ceo_muhammad_rizwan.webp",
    badge: "Executive Leadership",
    bio: "Visionary healthcare leader steering Biogen Pharma’s global pharmaceutical and surgical distribution across international hospital networks, state ministries, and bulk wholesale tenders.",
  },
  {
    name: "Muhammad Shahid",
    role: "Managing Director",
    image: "/images/team/md_muhammad_shahid.webp",
    badge: "Strategic Operations",
    bio: "Directing strategic manufacturing partnerships, institutional tender compliance, global principal affiliations, and regulatory cGMP certifications across African and Asian markets.",
  },
  {
    name: "M. Bilal Shabir",
    role: "Operations & Supply Chain Manager",
    image: "/images/team/ops_bilal_shabir.webp",
    badge: "Logistics & Cold-Chain",
    bio: "Leading end-to-end cold-chain logistics, warehouse quality assurance, batch traceability, and rapid institutional dispatch for hospitals and clinics.",
  },
];

const CORPORATE_GALLERY = [
  {
    id: 1,
    title: "B2B Strategic Partnership & Institutional MOU Signing Ceremony",
    category: "MOUs & Partnerships",
    image: "/images/gallery/gallery_event_1.webp",
    tag: "Strategic Alliance",
    description: "Formal bilateral agreement signing with international healthcare procurement authorities and principal manufacturing laboratories.",
  },
  {
    id: 2,
    title: "National Healthcare Excellence & Distribution Honor Award",
    category: "Awards & Honors",
    image: "/images/gallery/gallery_event_2.webp",
    tag: "Excellence 2026",
    description: "Recognized for exemplary supply chain integrity, cold-chain consistency, and reliable delivery of MCA-approved formulations.",
  },
  {
    id: 3,
    title: "International Pharmaceutical Delegation & Global Trade Assembly",
    category: "Delegations",
    image: "/images/gallery/gallery_event_3.webp",
    tag: "Global Summit",
    description: "Executive leadership meeting with visiting international medical delegates and global health technology partners.",
  },
  {
    id: 4,
    title: "State-of-the-Art cGMP Manufacturing Cleanroom Facility Inspection",
    category: "Plant & Facilities",
    image: "/images/gallery/gallery_event_4.webp",
    tag: "cGMP Certified",
    description: "On-site quality assurance audit and sterile cleanroom inspection verifying stringent compliance with WHO-GMP guidelines.",
  },
  {
    id: 5,
    title: "Hospital Procurement & Institutional Supply Council Meeting",
    category: "MOUs & Partnerships",
    image: "/images/gallery/gallery_event_5.webp",
    tag: "Procurement",
    description: "Strategic planning sessions aligning pharmaceutical stocks with hospital emergency requirements and tender schedules.",
  },
  {
    id: 6,
    title: "Medical Devices & Precision Surgical Technology Convention",
    category: "Exhibitions",
    image: "/images/gallery/gallery_event_6.webp",
    tag: "Surgical Tech",
    description: "Showcasing Care Medical German-grade tungsten carbide surgical instrumentation, motorized ICU beds, and ophthalmic optics.",
  },
  {
    id: 7,
    title: "Quality Assurance & Batch Verification Laboratory Review",
    category: "Plant & Facilities",
    image: "/images/gallery/gallery_event_7.webp",
    tag: "QA Standards",
    description: "Rigorous analytical testing, raw material inspection, and Certificate of Analysis (CoA) verification protocols.",
  },
  {
    id: 8,
    title: "Executive Board Convention & Principal Laboratory Assembly",
    category: "Leadership",
    image: "/images/gallery/gallery_event_8.webp",
    tag: "Executive Summit",
    description: "Annual leadership convention strategizing regional supply expansion and expanding pharmaceutical principal partnerships.",
  },
  {
    id: 9,
    title: "Health Regulatory Authority & Inspection Team Reception",
    category: "Delegations",
    image: "/images/gallery/gallery_event_9.webp",
    tag: "Regulatory Audit",
    description: "Hosting senior health inspection delegations to review cold-chain storage and batch documentation.",
  },
];

export default function AboutUsClient({ siteConfig }: AboutUsClientProps) {
  const brand = siteConfig.brand || {
    name: BRAND.name,
    tagline: BRAND.tagline,
    established: BRAND.established,
    phone: BRAND.contact.formattedNumber,
    email: BRAND.contact.email,
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeGalleryTab, setActiveGalleryTab] = useState<string>("All");
  const [lightboxImage, setLightboxImage] = useState<typeof CORPORATE_GALLERY[0] | null>(null);

  const galleryTabs = ["All", "MOUs & Partnerships", "Awards & Honors", "Delegations", "Plant & Facilities", "Leadership"];

  const filteredGallery = activeGalleryTab === "All"
    ? CORPORATE_GALLERY
    : CORPORATE_GALLERY.filter((item) => item.category === activeGalleryTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

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
              Biogen Pharma is a premier institutional supplier of MCA-registered pharmaceuticals, German-grade surgical instrumentation, motorized hospital furniture, and rapid clinical diagnostics across West Africa and international healthcare corridors.
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
            {EXECUTIVE_TEAM.map((member, idx) => (
              <div 
                key={idx} 
                className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-[#0072CE]/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
              >
                {/* Real Executive Photo */}
                <div className="relative aspect-[4/5] bg-slate-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0072CE] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
                    {member.badge}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0072CE] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-[#0072CE] uppercase tracking-wider mt-0.5 mb-3">
                      {member.role}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Biogen Executive Council</span>
                    <ShieldCheck size={14} className="text-emerald-600" />
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
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-[#0072CE] cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/11] bg-slate-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs">
                    {item.tag}
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

                {/* Caption below */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-[11px] font-bold text-[#0072CE] flex items-center gap-1 mt-2.5 group-hover:underline">
                    View Verified Specimen <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── LIGHTBOX MODAL ────────────────────────────────────────── */}
        {lightboxImage && (
          <div 
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
              <div className="max-h-[70vh] bg-black flex items-center justify-center">
                <img
                  src={lightboxImage.image}
                  alt={lightboxImage.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
              <div className="p-6 bg-slate-900 border-t border-white/10 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0072CE] text-white text-[10px] font-bold uppercase">
                    {lightboxImage.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{lightboxImage.category}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lightboxImage.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── CORE PILLARS & REGIONAL HUBS ──────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 pb-3 border-b border-slate-100">
            Our Core Healthcare Divisions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-[#0072CE] text-white flex items-center justify-center mb-3">
                <HeartPulse size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">Essential Formulations</h4>
              <p className="text-xs text-slate-600 leading-relaxed">100+ MCA-registered tablets, oral syrups, and IV injections from certified international laboratories.</p>
            </div>

            <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center mb-3">
                <Microscope size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">German-Grade Surgical</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Care Medical Tungsten Carbide scissors, needle holders, and laparoscopic instrumentation.</p>
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1] text-white flex items-center justify-center mb-3">
                <Stethoscope size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">Ophthalmic &amp; Optics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Castroviejo micro-corneal scissors, wire speculums, and 3.5x binocular surgical loupes.</p>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center mb-3">
                <Building2 size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">Hospital Furniture</h4>
              <p className="text-xs text-slate-600 leading-relaxed">5-Function motorized ICU beds, hydraulic obstetric delivery tables, and examination couches.</p>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 pb-3 border-b border-slate-100">
            Regional Hubs &amp; Direct Warehouses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇬🇲</span>
                <h4 className="font-black text-slate-900 text-base">Head Office (The Gambia)</h4>
              </div>
              <p className="text-xs text-slate-600">C8WF+ CWC New Jeshwang, WestField, The Gambia</p>
              <p className="text-xs text-[#0072CE] font-bold mt-2">Email: contact@biogenpharma.site</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇸🇱</span>
                <h4 className="font-black text-slate-900 text-base">2nd Regional Branch (Sierra Leone)</h4>
              </div>
              <p className="text-xs text-slate-600">20 Garrison Street, Free Town, Sierra Leone</p>
              <p className="text-xs text-[#0072CE] font-bold mt-2">Phone: +232 75 011616</p>
            </div>
          </div>
        </div>

      </div>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
