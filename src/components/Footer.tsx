"use client";

import Link from "next/link";
import { Send, MapPin, Phone, Mail, ShieldCheck, ExternalLink } from "lucide-react";
import { CMSSiteConfig } from "@/lib/cms-types";
import { getFooterLinkHref } from "@/lib/link-utils";
import { BRAND } from "@/config/brand";
import BiogenLogo from "./BiogenLogo";

interface FooterProps {
  siteConfig: CMSSiteConfig;
}

export default function Footer({ siteConfig }: FooterProps) {
  const brand = siteConfig.brand || {
    name: BRAND.name,
    tagline: BRAND.tagline,
    logoUrl: "/ideal-logo.png",
    phone: BRAND.contact.formattedNumber,
    email: BRAND.contact.email,
  };

  const footer = siteConfig.footer || {
    quickLinks: ["Home", "Medicines", "Surgical Instruments", "Hospital Furniture", "All Products", "Track Order"],
    moreLinks: ["About Us", "Contact Us", "FAQs", "Terms & Conditions", "Privacy Policy", "Shipping Policy", "Refund & Return Policy"],
    social: [
      { label: "WA", href: BRAND.contact.whatsappBase },
      { label: "FB", href: "https://facebook.com/biogenpharma" },
      { label: "IG", href: "https://instagram.com/biogenpharma" },
    ],
    newsletterTitle: "JOIN THE BIOGEN HEALTH NETWORK",
    newsletterSub: "Subscribe for healthcare updates, clinical catalogs, and institutional offers",
    copyrightText: "All Rights Reserved. Biogen Pharma — Enhancing Lives Through Healthcare",
  };

  const enabledLocations = (siteConfig.locations ?? []).filter((l) => l.enabled);

  return (
    <footer className="bg-[#0F172A] text-white pt-12 pb-6 border-t border-gray-800">
      <div className="global-container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand + Locations */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center mb-4 select-none">
              <BiogenLogo variant="dark" size="lg" />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              Biogen Pharma is a trusted provider of high-grade pharmaceuticals, precision surgical instruments, eye care, and hospital equipment in West Africa and internationally.
            </p>

            {/* Multi-location display */}
            {enabledLocations.length > 0 ? (
              <div className="space-y-3">
                <div className="font-sans text-xs font-bold uppercase tracking-wider mb-2 text-white">
                  REGIONAL OFFICES
                </div>
                {enabledLocations.map((loc) => (
                  <div key={loc.id} className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <span>{loc.flag}</span>
                        {loc.label}
                      </span>
                      {loc.mapUrl && (
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:text-white transition-colors"
                          title="View on map"
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <p className="flex items-start gap-1.5 text-[11px] text-gray-400">
                      <MapPin size={11} className="text-[#38BDF8] flex-shrink-0 mt-0.5" />
                      {loc.address}
                    </p>
                    {loc.phone && (
                      <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Phone size={11} className="text-[#38BDF8] flex-shrink-0" />
                        {loc.phone}
                      </p>
                    )}
                    {loc.email && (
                      <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Mail size={11} className="text-[#38BDF8] flex-shrink-0" />
                        {loc.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Legacy fallback if no locations configured */
              <div className="space-y-2 text-xs text-gray-300">
                {brand.address && (
                  <p className="flex items-start gap-2">
                    <MapPin size={15} className="text-[#38BDF8] flex-shrink-0 mt-0.5" />
                    {brand.address}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-[#38BDF8] flex-shrink-0" />
                  {brand.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={15} className="text-[#38BDF8] flex-shrink-0" />
                  {brand.email}
                </p>
              </div>
            )}

            {/* Social Links */}
            {footer.social && footer.social.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {footer.social.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-8 px-3 rounded-full bg-[#1E293B] hover:bg-[#38BDF8] hover:text-slate-900 text-xs font-bold text-white transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-sans text-xs font-extrabold uppercase tracking-wider mb-4 text-white">SUPPLIES &amp; CATALOG</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {footer.quickLinks.map((l) => (
                <li key={l}>
                  <Link href={getFooterLinkHref(l)} className="hover:text-[#38BDF8] transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-extrabold uppercase tracking-wider mb-4 text-white">COMPANY &amp; POLICIES</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {footer.moreLinks.map((l) => (
                <li key={l}>
                  <Link href={getFooterLinkHref(l)} className="hover:text-[#38BDF8] transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h4 className="font-sans text-xs font-extrabold uppercase tracking-wider mb-3 text-white">{footer.newsletterTitle}</h4>
            <p className="text-xs text-gray-400 mb-3">{footer.newsletterSub}</p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="Institutional / Clinic Email"
                className="flex-1 h-10 w-full min-w-0 px-3 bg-[#1E293B] border border-gray-700 rounded-l-lg text-xs text-white placeholder-gray-400 outline-none focus:border-[#0284C7]"
              />
              <button className="h-10 px-4 rounded-r-lg bg-[#0284C7] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#0369A1] transition-colors">
                <Send size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[11px] text-emerald-400">
              <ShieldCheck size={16} />
              <span>GMP, ISO &amp; WHO Standard Compliant</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} {brand.name}. {footer.copyrightText}</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/business-page/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/business-page/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/business-page/shipping-policy" className="hover:text-white transition-colors">Shipping &amp; Logistics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
