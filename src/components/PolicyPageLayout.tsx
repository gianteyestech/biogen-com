"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Truck, RotateCcw, Headphones, Tag, Send } from "lucide-react";
import Header from "@/components/Header";
import CartSlider from "@/components/CartSlider";
import type { CMSSiteConfig } from "@/lib/cms-types";
import { getFooterLinkHref } from "@/lib/link-utils";

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

  const { brand, footer, trustFeatures } = siteConfig;

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-sans antialiased">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

      {/* ── BREADCRUMBS ── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#C9A84C] font-semibold">{title}</span>
        </nav>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="global-container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          
          {/* Policy Links Sidebar */}
          <aside className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2.5">
              Business Pages
            </h3>
            <nav className="flex flex-col gap-1">
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    title === link.label
                      ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  <ChevronRight size={12} className={title === link.label ? "text-[#C9A84C]" : "text-gray-400"} />
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Policy Content Card */}
          <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">{title}</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{brand.name} Policies</p>
            </div>
            <div className="prose max-w-none text-gray-700 leading-relaxed text-sm space-y-6">
              {children}
            </div>
          </div>

        </div>
      </div>

      {/* ── TRUST FEATURES BAR ── */}
      <div className="bg-white border-t border-b border-gray-200 py-6">
        <div className="global-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {trustFeatures.map(({ icon, title: fTitle, sub }) => {
              const Icon = ICON_MAP[icon] || Truck;
              return (
                <div key={fTitle} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#C9A84C10", border: "1.5px solid #C9A84C40" }}>
                    <Icon size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                     <p className="font-sans text-xs font-extrabold text-gray-800">{fTitle}</p>
                     <p className="font-sans text-[10px] text-gray-400">{sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a1a] text-white pt-12 pb-6">
        <div className="global-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-3.5 mb-4 select-none">
                <div className="w-[78px] h-[78px] rounded-full overflow-hidden border-2 border-[#C9A227]/40 p-0.5 bg-[#F8F7F2] shadow-md flex items-center justify-center flex-shrink-0">
                  <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <div className="leading-none flex flex-col justify-center">
                  <span className="font-serif font-black tracking-wide text-white text-xl sm:text-2xl">
                    IDEAL
                  </span>
                  <span className="font-sans tracking-[0.25em] text-[#C9A227] font-bold uppercase text-[10px] mt-1">
                    DRY FRUIT
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-4">
                {brand.name} delivers fresh, premium quality nuts and dry fruits all over Pakistan. Every product is handpicked and quality-checked by our QC team.
              </p>
              <div className="font-sans text-xs font-bold uppercase tracking-wider mb-3 text-white">LOCATION</div>
              <div className="space-y-2 text-sm text-white/80">
                <p className="flex items-start gap-2">{brand.address}</p>
                <p className="flex items-center gap-2">{brand.phone}</p>
                <p className="flex items-center gap-2">{brand.email}</p>
              </div>
            </div>

            <div>
              <h4 className="font-sans text-sm font-extrabold uppercase tracking-wider mb-4 text-white">QUICK LINKS</h4>
              <ul className="space-y-2 text-sm text-white/80">
                {footer.quickLinks.map((l) => (
                  <li key={l}>
                    <Link href={getFooterLinkHref(l)} className="hover:text-[#C9A84C] transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-sm font-extrabold uppercase tracking-wider mb-4 text-white">MORE LINKS</h4>
              <ul className="space-y-2 text-sm text-white/80">
                {footer.moreLinks.map((l) => (
                  <li key={l}>
                    <Link href={getFooterLinkHref(l)} className="hover:text-[#C9A84C] transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-sans text-sm font-extrabold uppercase tracking-wider mb-3 text-white">{footer.newsletterTitle}</h4>
              <p className="text-xs text-white/80 mb-3">{footer.newsletterSub}</p>
              <div className="flex gap-0">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 h-10 w-full min-w-0 px-3 bg-[#2a2a2a] border border-[#C9A84C] rounded-l-lg text-xs text-white placeholder-gray-400 outline-none focus:border-white"
                />
                <button className="h-10 px-3.5 rounded-r-lg bg-[#C9A84C] text-[#111] flex items-center justify-center flex-shrink-0 hover:bg-white transition-colors">
                  <Send size={14} />
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                {footer.social.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs bg-[#C9A84C] text-[#111] hover:bg-white transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#C9A84C] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
            <p>© {new Date().getFullYear()} {brand.name}. All Rights Reserved.</p>
            <p>Delivering premium quality across Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={brand.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.4)" }}
        aria-label="Live Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
