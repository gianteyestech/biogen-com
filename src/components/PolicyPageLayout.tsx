"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Truck, RotateCcw, Headphones, Tag, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import type { CMSSiteConfig } from "@/lib/cms-types";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Truck, RotateCcw, Headphones, Tag,
};

const POLICY_LINKS = [
  { label: "About Us", href: "/business-page/about-us" },
  { label: "Terms & Conditions", href: "/business-page/terms-and-conditions" },
  { label: "Privacy Policy", href: "/business-page/privacy-policy" },
  { label: "Refund Policy", href: "/business-page/refund-policy" },
  { label: "Return Policy", href: "/business-page/return-policy" },
  { label: "Cancellation Policy", href: "/business-page/cancellation-policy" },
  { label: "Shipping Policy", href: "/business-page/shipping-policy" },
];

interface PolicyPageLayoutProps {
  title: string;
  siteConfig: CMSSiteConfig;
  children: React.ReactNode;
}

export default function PolicyPageLayout({ title, siteConfig, children }: PolicyPageLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { brand, trustFeatures } = siteConfig;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

      {/* ── BREADCRUMBS ── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0072CE] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#0072CE] font-semibold">{title}</span>
        </nav>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="global-container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          
          {/* Policy Links Sidebar */}
          <aside className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Institutional Policies
            </h3>
            <nav className="flex flex-col gap-1">
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    title === link.label
                      ? "bg-blue-50 text-[#0072CE]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                  <ChevronRight size={13} className={title === link.label ? "text-[#0072CE]" : "text-slate-400"} />
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Policy Content Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-[10px] font-bold text-[#0072CE] uppercase tracking-wider">{brand.name} Compliance</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">{title}</h1>
            </div>
            <div className="prose max-w-none text-slate-700 leading-relaxed text-sm space-y-6">
              {children}
            </div>
          </div>

        </div>
      </div>

      {/* ── TRUST FEATURES BAR ── */}
      <div className="bg-white border-t border-b border-slate-200 py-6">
        <div className="global-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {trustFeatures.map(({ icon, title: fTitle, sub }) => {
              const Icon = ICON_MAP[icon] || Truck;
              return (
                <div key={fTitle} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 text-[#0072CE]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{fTitle}</p>
                    <p className="text-[10px] text-slate-500">{sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <Footer siteConfig={siteConfig} />
    </div>
  );
}
