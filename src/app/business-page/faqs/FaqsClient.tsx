"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, HelpCircle, Phone, MessageSquare, Truck, ShieldCheck, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import type { CMSSiteConfig } from "@/lib/cms-types";
import { BRAND } from "@/config/brand";

interface FaqsClientProps {
  siteConfig: CMSSiteConfig;
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // Category: Clinical Orders & Procurement
  {
    id: "faq-1",
    category: "Orders & Procurement",
    question: "How do clinics, hospitals, and pharmacies place orders on Biogen Pharma?",
    answer: "Healthcare facilities and practitioners can browse our medical catalog, select required packaging/quantities, and submit an online order or requisition. You can also request official quotation invoices or place bulk orders directly via our WhatsApp Clinical Desk."
  },
  {
    id: "faq-2",
    category: "Orders & Procurement",
    question: "What payment and settlement methods do you support?",
    answer: "We support direct institutional bank transfers, online payment channels, and verified cash on delivery/settlement upon inspection for authorized clinics and healthcare distributors."
  },
  {
    id: "faq-3",
    category: "Orders & Procurement",
    question: "Can we order hospital furniture and specialized surgical equipment in bulk?",
    answer: "Yes! We specialize in institutional bulk supply of examination couches, hydraulic surgery chairs, LED surgical loupes, and precision surgical instruments with volume-based corporate discounts."
  },

  // Category: Quality & GMP Standards
  {
    id: "faq-4",
    category: "Quality & Certifications",
    question: "Are your medicines and medical devices certified?",
    answer: "Every pharmaceutical product and medical device supplied by Biogen Pharma is manufactured under strict WHO-GMP and ISO 9001:2015 quality management standards with complete batch traceability and Certificates of Analysis (COA)."
  },
  {
    id: "faq-5",
    category: "Quality & Certifications",
    question: "How are temperature-sensitive pharmaceuticals transported?",
    answer: "All temperature-sensitive medicines, vaccines, and biologics are transported using specialized cold-chain packaging and monitored logistics to preserve molecular efficacy throughout transit."
  },

  // Category: Shipping & Logistics
  {
    id: "faq-6",
    category: "Shipping & Logistics",
    question: "What are the shipping timelines across West Africa and internationally?",
    answer: "Regional orders in The Gambia and Sierra Leone typically arrive within 24 to 48 business hours. Regional and international freight dispatches are expedited with tracking IDs provided at dispatch."
  },
  {
    id: "faq-7",
    category: "Shipping & Logistics",
    question: "What is your policy regarding damaged or non-conforming items?",
    answer: "Any item found damaged in transit or non-conforming with your order specification will be immediately replaced or credited upon inspection by our quality compliance team."
  },
];

const CATEGORIES = ["All Questions", "Orders & Procurement", "Quality & Certifications", "Shipping & Logistics"];

export default function FaqsClient({ siteConfig }: FaqsClientProps) {
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = activeCategory === "All Questions" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

      {/* ── BREADCRUMBS ── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0072CE] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#0072CE] font-semibold">Help &amp; FAQs</span>
        </nav>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="global-container mb-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#0A0F1D] text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-[#00A3E0] rounded-full text-xs font-bold uppercase tracking-wider">
              <HelpCircle size={14} /> Knowledge Base &amp; Support
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Find instant answers regarding clinical orders, pharmaceutical certifications, cold-chain delivery, and institutional bulk supply.
            </p>

            {/* Live Search Input */}
            <div className="relative pt-2 max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., GMP certifications, cold-chain, delivery)..."
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm outline-none border border-transparent focus:border-[#0072CE] shadow-lg placeholder-slate-400"
              />
              <Search className="absolute left-4 top-5 text-slate-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT: CATEGORY TABS & ACCORDION ── */}
      <div className="global-container pb-16">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none snap-x">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all snap-start flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-[#0072CE] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#0072CE] hover:text-[#0072CE]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500 space-y-3">
                <Search size={36} className="mx-auto text-slate-300" />
                <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
                <p className="text-xs">Try searching with a different keyword or browse all categories.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All Questions"); }}
                  className="mt-2 px-4 py-2 bg-[#0072CE] text-white text-xs font-bold rounded-lg hover:bg-[#005EA6]"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                      isOpen ? "border-[#0072CE] shadow-sm" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900"
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOpen ? "bg-[#0072CE]" : "bg-slate-300"}`} />
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "transform rotate-180 text-[#0072CE]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Help Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-[#0072CE] uppercase tracking-wider">Need Custom Assistance?</span>
              <h3 className="text-base font-bold text-slate-900">Direct Clinical Helpdesk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have specific procurement requests, urgent medication orders, or tendering questions? Connect directly with our team.
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href={BRAND.contact.whatsappBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare size={16} /> WhatsApp Clinical Desk
                </a>
                <Link
                  href="/business-page/contact-us"
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText size={16} /> Institutional Inquiry Form
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-2 text-xs text-[#0072CE]">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} /> GMP Quality Guarantee
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                All pharmaceuticals and clinical equipment are certified with verifiable batch records and rigorous QC inspection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODULAR FOOTER ── */}
      <Footer siteConfig={siteConfig} />
    </div>
  );
}
