"use client";
import React from "react";
import { ArrowRight, Award } from "lucide-react";

export interface BrandPartner {
  id: string;
  name: string;
  shortName: string;
  country: string;
  specialty: string;
  logoUrl: string;
  tag: string;
}

export const BRAND_PARTNERS: BrandPartner[] = [
  {
    id: "Highnoon pharma",
    name: "Highnoon Laboratories",
    shortName: "Highnoon",
    country: "Global / cGMP",
    specialty: "Cardiology & Metabolic Health",
    logoUrl: "/images/brands/highnoon.svg",
    tag: "Atorvastatin / Aspirin",
  },
  {
    id: "Glitz Pharma",
    name: "Glitz Pharma",
    shortName: "Glitz",
    country: "cGMP Certified",
    specialty: "Neuropsychiatry & Pain Care",
    logoUrl: "/images/brands/glitz.svg",
    tag: "Gabapentin / Pregabalin",
  },
  {
    id: "Welmark",
    name: "Welmark Pharmaceuticals",
    shortName: "Welmark",
    country: "WHO Prequalified",
    specialty: "Antimalarials & Antibiotics",
    logoUrl: "/images/brands/welmark.svg",
    tag: "Artemether / Lumefantrine",
  },
  {
    id: "Caraway Pharmaceuticals",
    name: "Caraway Pharmaceuticals",
    shortName: "Caraway",
    country: "ISO 9001:2015",
    specialty: "Cardiovascular & Diabetes Care",
    logoUrl: "/images/brands/caraway.svg",
    tag: "Enalapril / Metformin",
  },
  {
    id: "Davis Pharmaceuticals",
    name: "Davis Pharmaceuticals",
    shortName: "Davis",
    country: "cGMP Certified",
    specialty: "Broad-Spectrum Antibiotics",
    logoUrl: "/images/brands/davis.svg",
    tag: "Azithromycin / Amlodipine",
  },
  {
    id: "The Schazoo",
    name: "The Schazoo Laboratories",
    shortName: "Schazoo",
    country: "Since 1951 / cGMP",
    specialty: "Ophthalmic & Sterile Drops",
    logoUrl: "/images/brands/schazoo.svg",
    tag: "Timolol / Tobramycin",
  },
  {
    id: "Genetic Pharma",
    name: "Genetic Pharma",
    shortName: "Genetic",
    country: "CE / ISO Certified",
    specialty: "Hospital Consumables & Diagnostics",
    logoUrl: "/images/brands/genetic.svg",
    tag: "IV Cannula / Rapid Tests",
  },
  {
    id: "Zafa Pahrmaceuticals",
    name: "Zafa Pharmaceuticals",
    shortName: "Zafa",
    country: "Established 1973",
    specialty: "Essential Hospital Formulations",
    logoUrl: "/images/brands/zafa.svg",
    tag: "Hydrochlorothiazide / Emkit",
  },
  {
    id: "Care Medical Instruments",
    name: "Care Medical Instruments",
    shortName: "Care Medical",
    country: "German Grade / ISO 13485",
    specialty: "Surgical Sets & Eye Loupes",
    logoUrl: "/images/brands/care_medical.svg",
    tag: "BR-TC Sets & ICU Beds",
  },
  {
    id: "Farhan Cotton Industry",
    name: "Farhan Cotton Industry",
    shortName: "Farhan",
    country: "Hospital Grade",
    specialty: "Absorbent Cotton & Bandages",
    logoUrl: "/images/brands/farhan.svg",
    tag: "Pure Cotton Wool / Gauze",
  },
  {
    id: "Sayyed pharma",
    name: "Sayyed Pharma",
    shortName: "Sayyed",
    country: "cGMP Certified",
    specialty: "Cephalosporins & Injections",
    logoUrl: "/images/brands/sayyed.svg",
    tag: "Cefotaxime / Metoclopramide",
  },
  {
    id: "Macter Pharma",
    name: "Macter Pharmaceuticals",
    shortName: "Macter",
    country: "cGMP Certified",
    specialty: "Respiratory & Inhalers",
    logoUrl: "/images/brands/macter.svg",
    tag: "Salbutamol Inhaler",
  },
];

interface BrandPartnersProps {
  selectedBrand: string;
  onSelectBrand: (brandId: string) => void;
}

export default function BrandPartners({ selectedBrand, onSelectBrand }: BrandPartnersProps) {
  return (
    <section className="py-8 bg-slate-900 text-white rounded-3xl overflow-hidden relative border border-slate-800 shadow-xl my-6">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0072CE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#00A3E0] uppercase tracking-widest mb-1.5">
              <Award size={15} />
              <span>Authorized Principals &amp; Verified Manufacturing Partners</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Our Pharmaceutical &amp; Surgical Brand Partners
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Official institutional distribution with leading cGMP and ISO-certified laboratories. Click any brand logo to filter its registered medicines and surgical supplies.
            </p>
          </div>

          {selectedBrand && selectedBrand !== "all" && (
            <button
              onClick={() => onSelectBrand("all")}
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 text-[#38BDF8] border border-blue-400/30 text-xs font-bold hover:bg-blue-500/30 transition-all flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Showing: <strong>{selectedBrand}</strong></span>
              <span className="text-white/60 hover:text-white font-extrabold ml-1">✕ Reset</span>
            </button>
          )}
        </div>

        {/* Brand Logos / Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {BRAND_PARTNERS.map((partner) => {
            const isSelected = selectedBrand === partner.id;
            return (
              <button
                key={partner.id}
                onClick={() => onSelectBrand(isSelected ? "all" : partner.id)}
                className={`group relative p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-800 border-[#0072CE] ring-2 ring-[#0072CE]/60 shadow-[0_0_25px_rgba(0,114,206,0.35)] scale-[1.02]"
                    : "bg-slate-950/70 border-slate-800/90 hover:border-slate-600 hover:bg-slate-800/70 hover:scale-[1.02]"
                }`}
              >
                {/* Logo Image */}
                <div className="w-full h-14 bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2.5 shadow-sm">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Country / Certification Badge */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#00A3E0] truncate">
                    {partner.country}
                  </span>
                </div>

                {/* Specialty */}
                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {partner.specialty}
                </p>

                {/* Bottom Tag & Arrow */}
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                  <span className="text-slate-500 font-medium truncate max-w-[100px]">
                    {partner.tag}
                  </span>
                  <ArrowRight
                    size={11}
                    className={`transition-all duration-300 ${
                      isSelected
                        ? "text-[#38BDF8] translate-x-0.5"
                        : "text-slate-500 group-hover:text-white group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
