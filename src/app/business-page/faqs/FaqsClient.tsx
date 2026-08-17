"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, HelpCircle, Phone, MessageSquare, Truck, RotateCcw, PackageCheck, ShieldCheck, Sparkles, Send } from "lucide-react";
import Header from "@/components/Header";
import CartSlider from "@/components/CartSlider";
import type { CMSSiteConfig } from "@/lib/cms-types";
import { getFooterLinkHref } from "@/lib/link-utils";

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
  // Category: Orders & Payments
  {
    id: "faq-1",
    category: "Orders & Payments",
    question: "How do I place an order on Ideal Dry Fruit?",
    answer: "Placing an order is simple! Browse our products, select your preferred pack weight (e.g. 250g, 500g, 1kg), click 'Add to Cart', and proceed to checkout. Enter your delivery details and choose Cash on Delivery (COD) or Online Bank Transfer."
  },
  {
    id: "faq-2",
    category: "Orders & Payments",
    question: "Do you offer Cash on Delivery (COD) across Pakistan?",
    answer: "Yes! We offer reliable Cash on Delivery (COD) services to all cities and towns across Pakistan through top courier partners (TCS, Leopards, and M&P)."
  },
  {
    id: "faq-3",
    category: "Orders & Payments",
    question: "Can I place a wholesale or corporate bulk gift order?",
    answer: "Absolutely. Contact our team directly via email at info.biogen@gianteyetech.com or through our Contact Helpdesk for discounted bulk rates."
  },
  {
    id: "faq-4",
    category: "Orders & Payments",
    question: "Can I modify or cancel my order after placing it?",
    answer: "You can modify or cancel your order within 2 hours of placing it by reaching out via email or through our Contact Helpdesk page. Once an order is dispatched with the courier, cancellations are subject to our cancellation policy."
  },

  // Category: Shipping & Delivery
  {
    id: "faq-5",
    category: "Shipping & Delivery",
    question: "How long does delivery take?",
    answer: "Delivery typically takes 1 to 3 working days depending on your destination city. Major metropolitan areas (Lahore, Islamabad, Rawalpindi, Karachi, Faisalabad) usually receive orders within 24 to 48 hours."
  },
  {
    id: "faq-6",
    category: "Shipping & Delivery",
    question: "What are the shipping charges?",
    answer: "We offer FREE delivery on all orders above Rs. 3,000 across Pakistan! For orders under Rs. 3,000, a flat shipping fee of Rs. 200 applies."
  },
  {
    id: "faq-7",
    category: "Shipping & Delivery",
    question: "How can I track my parcel?",
    answer: "Once your order is dispatched, you will receive an SMS and WhatsApp message containing your courier tracking number and a direct tracking link."
  },

  // Category: Quality & Packaging
  {
    id: "faq-8",
    category: "Quality, Freshness & Storage",
    question: "Are your dry fruits 100% natural and fresh?",
    answer: "Yes, 100%! All our products are handpicked, Grade-A premium quality nuts, dates, and dried fruits. We undergo strict quality control (QC) testing to ensure crispness, natural oil content, and authentic taste."
  },
  {
    id: "faq-[#]",
    category: "Quality, Freshness & Storage",
    question: "How should I store dry fruits to keep them fresh?",
    answer: "Store your dry fruits in airtight containers in a cool, dry place away from direct sunlight. For extended freshness (especially during warm summer months), we recommend keeping nuts like walnuts and pistachios in the refrigerator."
  },
  {
    id: "faq-9",
    category: "Quality, Freshness & Storage",
    question: "Are your products nitrogen-vacuum sealed?",
    answer: "Yes, our luxury gift boxes and premium pouch packs are nitrogen sealed or double-sealed with food-grade food safety barrier pouches to prevent moisture and preserve crispness."
  },

  // Category: Returns & Refunds
  {
    id: "faq-10",
    category: "Returns & Refund Policy",
    question: "What if I receive a damaged or incorrect package?",
    answer: "If your package arrives damaged or contains the wrong item, please notify us within 24 hours of delivery with photos/videos via email or through our Contact Helpdesk. We will dispatch an immediate free replacement."
  },
  {
    id: "faq-11",
    category: "Returns & Refund Policy",
    question: "How long do refunds take to process?",
    answer: "Once an eligible return or refund request is approved, refunds are credited back via JazzCash, EasyPaisa, or Bank Transfer within 3 to 5 business days."
  }
];

const CATEGORIES = [
  "All Categories",
  "Orders & Payments",
  "Shipping & Delivery",
  "Quality, Freshness & Storage",
  "Returns & Refund Policy"
];

export default function FaqsClient({ siteConfig }: FaqsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("All Categories");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const { brand, footer } = siteConfig;

  // Filter FAQs based on tab and search
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchTab = activeTab === "All Categories" || faq.category === activeTab;
      const matchSearch =
        !searchTerm.trim() ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchTerm]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

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
          <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#C9A227] font-semibold">FAQs</span>
        </nav>
      </div>

      {/* ── HERO BANNER WITH SEARCH ── */}
      <div className="global-container mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#111111] p-8 md:p-12 text-white shadow-xl border border-[#C9A227]/30 text-center flex flex-col items-center justify-center">
          <span className="text-[#C9A227] font-sans text-xs font-bold uppercase tracking-[0.25em] block mb-2">
            HELP & KNOWLEDGE CENTER
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-wide mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed mb-6">
            Find quick answers to common questions regarding ordering, delivery timelines, quality guarantee, and return policies.
          </p>

          {/* FAQ Search Bar */}
          <div className="w-full max-w-lg relative">
            <input
              type="text"
              placeholder="Search FAQs (e.g. delivery time, payment, returns)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#C9A227]/40 bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 shadow-md"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A227]" />
          </div>
        </div>
      </div>

      {/* ── CATEGORY FILTER TABS ── */}
      <div className="global-container mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-3 rounded-xl text-xs font-bold tracking-wide flex-shrink-0 transition-all ${
                activeTab === cat
                  ? "bg-[#C9A227] text-black shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── ACCORDION LIST ── */}
      <div className="global-container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* FAQs Accordion Column */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <HelpCircle size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800 mb-1">No matching questions found</h3>
                <p className="text-xs text-gray-500 mb-4">Try searching with a different keyword like &quot;delivery&quot;, &quot;COD&quot;, or &quot;quality&quot;.</p>
                <button
                  onClick={() => { setSearchTerm(""); setActiveTab("All Categories"); }}
                  className="bg-[#111111] hover:bg-[#C9A227] text-white hover:text-black text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen ? "border-[#C9A227]/50 shadow-md" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#C9A227] flex-shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#C9A227] flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-200">
                        <p className="bg-[#F8F7F2] p-4 rounded-xl border border-gray-100">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar CTA Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] mx-auto mb-4">
                <HelpCircle size={24} />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Still Have Questions?</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Can&apos;t find the answer you are looking for? Please contact our friendly customer service team.
              </p>
              <div className="space-y-2.5">
                <a
                  href={brand.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all"
                >
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
                <Link
                  href="/business-page/contact-us"
                  className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-black text-xs font-bold py-3 px-4 rounded-xl transition-all"
                >
                  <span>Contact Support Page</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="bg-[#111111] rounded-2xl p-6 border border-[#C9A227]/30 text-white space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#C9A227]" />
                <div>
                  <h4 className="font-bold text-xs">100% Quality Guaranteed</h4>
                  <p className="text-[10px] text-gray-400">QC inspected premium products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-[#C9A227]" />
                <div>
                  <h4 className="font-bold text-xs">Free Delivery Above Rs.3,000</h4>
                  <p className="text-[10px] text-gray-400">Fast shipping all over Pakistan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-[#C9A227]" />
                <div>
                  <h4 className="font-bold text-xs">Easy Returns</h4>
                  <p className="text-[10px] text-gray-400">Hassle-free replacement policy</p>
                </div>
              </div>
            </div>
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
            </div>
          </div>

          <div className="border-t border-[#C9A84C] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
            <p>© {new Date().getFullYear()} {brand.name}. All Rights Reserved.</p>
            <p>Delivering premium quality across Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
