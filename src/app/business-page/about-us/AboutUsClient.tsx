"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Award, Truck, HeartPulse, Building2, Stethoscope, Microscope } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import { BRAND } from "@/config/brand";
import { CMSSiteConfig } from "@/lib/cms-types";

interface AboutUsClientProps {
  siteConfig: CMSSiteConfig;
}

export default function AboutUsClient({ siteConfig }: AboutUsClientProps) {
  const brand = siteConfig.brand || {
    name: BRAND.name,
    tagline: BRAND.tagline,
    established: BRAND.established,
    phone: BRAND.contact.formattedNumber,
    email: BRAND.contact.email,
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* ─── HEADER & NAV ───────────────────────────────────────────── */}
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

      {/* ─── BREADCRUMBS ───────────────────────────────────────────── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#0284C7] font-semibold">About Us</span>
        </nav>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="global-container pb-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 pb-5 mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">About Biogen Pharma</h1>
            <p className="text-[#0284C7] font-extrabold text-sm uppercase tracking-widest">{brand.tagline}</p>
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Enhancing Lives Through Quality Healthcare & Medical Supplies
              </h2>
              <p>
                At <strong>Biogen Pharma</strong>, our mission is simple: enhancing lives through quality healthcare. As a trusted provider of pharmaceuticals, surgical products, and essential medical supplies, we understand that reliability and safety are the foundations of health.
              </p>
              <p>
                We are committed to ensuring that every product we offer meets the highest standards of excellence. Whether it is precision surgical instruments or life-saving medicines, your well-being is our top priority. We don&apos;t just see ourselves as a company, but as your dedicated health partner.
              </p>
            </div>

            {/* ─── EXECUTIVE LEADERSHIP MESSAGES ──────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 not-prose my-8">
              {/* CEO Message */}
              <div className="bg-[#F0F9FF] rounded-2xl p-6 sm:p-8 border border-[#0284C7]/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-bold">
                      MR
                    </div>
                    <div>
                      <h4 className="font-sans text-base font-extrabold text-gray-900">Muhammad Rizwan</h4>
                      <p className="text-xs text-[#0284C7] font-bold uppercase tracking-wider">Chief Executive Officer (CEO)</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-4">
                    &ldquo;At Biogen Pharma, we believe healthcare is a fundamental right that demands uncompromising integrity. Our goal is to bridge critical supply gaps with top-grade pharmaceuticals and surgical technology across West Africa and internationally.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0284C7]/15 flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <ShieldCheck size={16} className="text-[#0284C7]" />
                  <span>Executive Governance &amp; Global Compliance</span>
                </div>
              </div>

              {/* Operations Manager Message */}
              <div className="bg-[#ECFDF5] rounded-2xl p-6 sm:p-8 border border-[#10B981]/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold">
                      BS
                    </div>
                    <div>
                      <h4 className="font-sans text-base font-extrabold text-gray-900">M. Bilal Shabir</h4>
                      <p className="text-xs text-[#10B981] font-bold uppercase tracking-wider">Operations Manager</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-4">
                    &ldquo;Our priority is ensuring a seamless, temperature-controlled journey from our central warehouses to your clinical doorstep. We focus on rigorous quality standards, precision logistics, and rapid response to medical emergencies.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-[#10B981]/15 flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <Truck size={16} className="text-[#10B981]" />
                  <span>Cold-Chain &amp; Global Supply Chain Precision</span>
                </div>
              </div>
            </div>

            {/* ─── CORE PILLARS ─────────────────────────────────────────── */}
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-3">
                  <HeartPulse size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Essential Medicines</h4>
                <p className="text-xs text-gray-600">WHO-aligned essential pharmaceuticals, analgesics, antibiotics, and allergy treatments.</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-3">
                  <Microscope size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Surgical Instruments</h4>
                <p className="text-xs text-gray-600">German stainless steel forceps, scalpel handles, scissors, and autoclavable clamps.</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-3">
                  <Stethoscope size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Eye Care &amp; Loupes</h4>
                <p className="text-xs text-gray-600">High-resolution surgical loupes, protective eyewear, and optical magnification gear.</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-3">
                  <Building2 size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Hospital Furniture</h4>
                <p className="text-xs text-gray-600">Heavy-duty examination couches, patient beds, and clinic examination equipment.</p>
              </div>
            </div>

            {/* ─── REGIONAL HUBS ─────────────────────────────────────────── */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Regional Hubs &amp; Facilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">🇬🇲 Head Office (The Gambia)</h4>
                  <p className="text-xs text-gray-600">C8WF+ CWC New Jeshwang, WestField, The Gambia</p>
                  <p className="text-xs text-[#0284C7] font-semibold mt-2">Email: contact@biogenpharma.site</p>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">🇸🇱 2nd Regional Branch (Sierra Leone)</h4>
                  <p className="text-xs text-gray-600">20 Garrison Street, Free Town, Sierra Leone</p>
                  <p className="text-xs text-[#0284C7] font-semibold mt-2">Phone: +232 75 011616</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
