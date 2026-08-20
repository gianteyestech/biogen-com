"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight, Phone, Mail, MapPin, Clock,
  Truck, RotateCcw, Headphones, Tag, Send, Star, Shield, Package, Menu, ChevronRight, CheckCircle2, BookOpen, MessageSquare
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import ProductCard from "@/components/ProductCard";
import BrandPartners from "@/components/BrandPartners";
import { MEGA_MENU } from "@/data/products";
import type {
  CMSProduct,
  CMSCategory,
  CMSMegaMenuEntry,
  CMSCircleCat,
  CMSHeroSlide,
  CMSSiteConfig,
  CMSPageSection,
} from "@/lib/cms-types";
import { filterProductsByCategory } from "@/lib/cms-types";

// ─── Icon map for trust features ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Truck, RotateCcw, Headphones, Tag, Shield, Package, Star, Phone, Mail, MapPin, Clock,
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface SectionWithProducts extends CMSPageSection {
  products: CMSProduct[];
}

interface HomeClientProps {
  allProducts: CMSProduct[];
  categories: CMSCategory[];
  megaMenu?: CMSMegaMenuEntry[];
  circleCats: CMSCircleCat[];
  heroSlides: CMSHeroSlide[];
  siteConfig: CMSSiteConfig;
  sections: SectionWithProducts[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomeClient({
  allProducts, categories, megaMenu, circleCats, heroSlides, siteConfig, sections,
}: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [heroSlide, setHeroSlide] = useState(0);

  const displayCategories = useMemo(() => {
    if (megaMenu && megaMenu.length > 0) return megaMenu;
    return categories.filter((c) => c.id !== "all");
  }, [megaMenu, categories]);

  const isCatalogue = siteConfig?.siteMode === "catalogue";
  const hidePrices = siteConfig?.hidePricesInCatalogue ?? false;
  const catalogueInquiryText = siteConfig?.catalogueInquiryText;

  const filteredProducts = useMemo(() => {
    let list = filterProductsByCategory(allProducts, selectedCategory);
    
    if (selectedBrand && selectedBrand !== "all") {
      const bLower = selectedBrand.toLowerCase();
      list = list.filter((p) => {
        if (!p.brand) return false;
        const pBrand = p.brand.toLowerCase();
        return pBrand === bLower || pBrand.includes(bLower) || bLower.includes(pBrand);
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.urduName && p.urduName.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.genericName && p.genericName.toLowerCase().includes(q)) ||
          (p.registrationNo && p.registrationNo.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, selectedBrand, searchTerm, allProducts]);

  const isFiltered = selectedCategory !== "all" || selectedBrand !== "all" || searchTerm.trim() !== "";

  // Highlight products
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 5);
  const trendingProducts = allProducts.filter((p) => (p.reviewsCount || 0) > 20).slice(0, 5);
  const newArrivals = allProducts.filter((p) => p.isNew).slice(0, 3);
  const topRated = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const bestSellers = trendingProducts.length ? trendingProducts.slice(0, 3) : allProducts.slice(0, 3);

  // Big Deal / Highlight Product
  const dealProduct = featuredProducts[0] || allProducts[0];
  const dealGridProducts = allProducts.filter(p => p.id !== dealProduct?.id).slice(0, 4);

  const { trustFeatures } = siteConfig;

  // Mini List Item Component
  const MiniListItem = ({ product }: { product: CMSProduct }) => {
    const weight = Object.keys(product.prices || {})[0] || "";
    const price = product.prices?.[weight] ?? 0;
    const oldPrice = product.originalPrices?.[weight];
    return (
      <Link href={`/product/${product.id}`} className="flex items-center gap-3 py-3 border-b border-slate-100 group last:border-0">
        <div className="w-16 h-16 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200/70 p-1 flex-shrink-0">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-semibold text-slate-800 line-clamp-2 group-hover:text-[#0072CE] transition-colors leading-snug">{product.name}</h4>
          <div className="flex items-center gap-1 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
            ))}
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-2">
            {isCatalogue && hidePrices ? (
              <span className="text-xs font-bold text-[#0072CE]">Request Quote</span>
            ) : (
              <>
                <span className="text-sm font-extrabold text-[#0072CE]">${price.toLocaleString()}</span>
                {oldPrice && !isCatalogue && <span className="text-xs text-slate-400 line-through">${oldPrice.toLocaleString()}</span>}
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        siteConfig={siteConfig}
        categories={categories}
        megaMenu={megaMenu}
        allProducts={allProducts}
      />
      <CartSlider />

      {/* ─── MAIN CONTAINER ────────────────────────────────────────── */}
      <div className="global-container py-6">

        {/* Catalogue Mode Alert Notice (Visible when Catalogue Mode is enabled) */}
        {isCatalogue && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0072CE] text-white flex-shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wide">B2B Institutional Medical Catalogue</p>
                <p className="text-[11px] text-slate-300">Direct hospital procurement, clinic tender quotations, Batch COA documentation, and volume supply inquiries.</p>
              </div>
            </div>
            <Link
              href="/business-page/contact-us"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0072CE] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex-shrink-0"
            >
              <MessageSquare size={13} />
              <span>Submit Requisition</span>
            </Link>
          </div>
        )}

        {isFiltered ? (
          /* ── FILTERED CATALOG VIEW ──────────────────────────────── */
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedBrand !== "all"
                    ? `${selectedBrand} Formulations`
                    : searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : categories.find((c) => c.id === selectedCategory)?.name || "Medical Catalog"
                  }
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 font-medium">Active Filters:</span>
                  {selectedBrand !== "all" && (
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0072CE] border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <span>Brand: <strong>{selectedBrand}</strong></span>
                      <span className="text-blue-400 hover:text-blue-700">✕</span>
                    </button>
                  )}
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      <span>Category: <strong>{categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}</strong></span>
                      <span className="text-slate-400 hover:text-slate-700">✕</span>
                    </button>
                  )}
                  {searchTerm.trim() && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                      <span className="text-amber-500 hover:text-amber-800">✕</span>
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setSelectedCategory("all"); setSelectedBrand("all"); setSearchTerm(""); }}
                className="text-xs font-bold text-[#0072CE] bg-blue-50 px-3.5 py-2 rounded-xl hover:bg-[#0072CE] hover:text-white transition-all uppercase tracking-wider self-start sm:self-auto border border-blue-200/60"
              >
                ← View Complete Catalog
              </button>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-base text-slate-700">No medical supplies found matching your criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting the brand or department filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    siteMode={siteConfig?.siteMode || "ecommerce"} 
                    hidePrices={hidePrices} 
                    catalogueInquiryText={catalogueInquiryText}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── HOMEPAGE SECTIONS ──────────────────────────────────── */
          <div className="flex flex-col gap-6 md:gap-8">

            {/* ── HERO & NAVIGATION ROW ────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5 items-stretch">
              {/* Left Menu - Desktop Department Directory */}
              <div className="hidden xl:flex flex-col w-[280px] flex-shrink-0 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden h-[440px]">
                <div className="bg-[#0A0F1D] text-white px-5 py-4 font-bold text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Menu size={18} className="text-[#00A3E0]" />
                    <span className="uppercase tracking-wider text-xs font-extrabold">Medical Departments</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-[#00A3E0] px-2 py-0.5 rounded font-mono font-bold">GMP</span>
                </div>
                <div className="py-2 bg-white flex-1 overflow-y-auto divide-y divide-slate-50">
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center gap-3 transition-colors group ${
                        selectedCategory === cat.id ? "bg-blue-50/80 text-[#0072CE]" : "text-slate-700 hover:bg-slate-50 hover:text-[#0072CE]"
                      }`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <span className="flex-1 font-medium">{cat.name}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-[#0072CE]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Hero Slider */}
              <div className="flex-1 min-w-0 relative rounded-2xl overflow-hidden shadow-sm h-[320px] sm:h-[440px] bg-slate-900">
                {heroSlides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 flex ${i === heroSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full h-full object-cover block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8 sm:px-12 text-white">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-[#0072CE] text-white px-3 py-1 rounded-full w-fit mb-3">
                        <CheckCircle2 size={12} />
                        {slide.promoLabel || "GMP Certified"}
                      </span>
                      <h1 className="text-2xl sm:text-4xl font-extrabold max-w-xl leading-tight mb-2 drop-shadow-md">
                        {slide.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-200 max-w-lg mb-6 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="w-fit px-6 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-[#0072CE] hover:text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
                      >
                        {isCatalogue ? "Browse B2B Catalogue" : (slide.ctaText || "Explore Catalog")}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Slider Controls */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroSlide(i)}
                      className={`rounded-full transition-all duration-300 ${i === heroSlide ? "w-8 h-2 bg-[#00A3E0]" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setHeroSlide((heroSlide - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-[#0072CE] transition-colors"
                  aria-label="Previous slide"
                >‹</button>
                <button
                  onClick={() => setHeroSlide((heroSlide + 1) % heroSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-[#0072CE] transition-colors"
                  aria-label="Next slide"
                >›</button>
              </div>
            </div>

            {/* Mobile/Tablet Category Quick-Bar */}
            <div className="xl:hidden w-full overflow-x-auto py-1 flex gap-2 scrollbar-none snap-x">
              {displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 snap-start flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-[#0072CE] text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-[#0072CE]"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* ── AUTHORIZED PHARMACEUTICAL & SURGICAL PARTNERS ─────── */}
            <BrandPartners
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
            />

            {/* ── CMS SECTIONS ─────────────────────────────────────── */}
            {sections.filter(s => s.visible).map((section) => {
              // 1. Featured Products
              if (section.type === "featured" || section.id === "featured-products") {
                return (
                  featuredProducts.length > 0 && (
                    <div key={section.id} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {section.title || "Featured Medical Supplies"}
                          </h2>
                          <p className="text-xs text-slate-500">Certified pharmaceuticals &amp; institutional healthcare items</p>
                        </div>
                        <button onClick={() => setSelectedCategory("all")} className="text-xs font-bold text-[#0072CE] flex items-center gap-1 hover:underline uppercase tracking-wider">
                          VIEW ALL <ArrowRight size={14}/>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {featuredProducts.map(p => (
                          <ProductCard 
                            key={p.id} 
                            product={p} 
                            siteMode={siteConfig?.siteMode || "ecommerce"} 
                            hidePrices={hidePrices} 
                            catalogueInquiryText={catalogueInquiryText}
                          />
                        ))}
                      </div>
                    </div>
                  )
                );
              }

              // 2. Shop By Department / Category Circles
              if (section.type === "circles" || section.id === "shop-by-category") {
                return (
                  circleCats.length > 0 && (
                    <div key={section.id} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {section.title || "Explore By Department"}
                          </h2>
                          <p className="text-xs text-slate-500">Browse clinical categories, instruments, and equipment</p>
                        </div>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
                        {circleCats.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="flex flex-col items-center gap-2.5 flex-shrink-0 group w-24 snap-start"
                          >
                            <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-[#0072CE] transition-all group-hover:shadow-md bg-white p-1 relative">
                              <img src={cat.img} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 text-center group-hover:text-[#0072CE] transition-colors leading-tight">
                              {cat.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                );
              }

              // 3. Top Selling Products
              if (section.type === "top-selling" || section.id === "top-selling") {
                return (
                  trendingProducts.length > 0 && (
                    <div key={section.id} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {section.title || "Top Institutional Demand"}
                          </h2>
                          <p className="text-xs text-slate-500">High-volume hospital requisitions and essential medicines</p>
                        </div>
                        <button onClick={() => setSelectedCategory("all")} className="text-xs font-bold text-[#0072CE] flex items-center gap-1 hover:underline uppercase tracking-wider">
                          VIEW ALL <ArrowRight size={14}/>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {trendingProducts.map(p => (
                          <ProductCard 
                            key={p.id} 
                            product={p} 
                            siteMode={siteConfig?.siteMode || "ecommerce"} 
                            hidePrices={hidePrices} 
                            catalogueInquiryText={catalogueInquiryText}
                          />
                        ))}
                      </div>
                    </div>
                  )
                );
              }

              // 4. Clinical Highlight / Deal of the Day
              if (section.type === "deal" || section.id === "deal-of-the-day") {
                return (
                  dealProduct && (
                    <div key={section.id} className="flex flex-col lg:flex-row gap-5">
                      <div className="w-full lg:w-[40%] bg-gradient-to-br from-[#0A0F1D] to-[#1E293B] rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#00A3E0] font-mono font-bold">CLINICAL SPOTLIGHT</span>
                            <h2 className="text-xl font-black text-white tracking-tight">{section.title || "Featured Equipment"}</h2>
                          </div>
                          <span className="px-2.5 py-1 bg-[#70BA28] text-white text-[10px] font-black tracking-wider rounded-md uppercase shadow">GMP CERTIFIED</span>
                        </div>
                        <Link href={`/product/${dealProduct.id}`} className="flex-1 group bg-white rounded-xl p-4 text-slate-900 flex flex-col">
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-4 p-4 flex items-center justify-center">
                            <img src={dealProduct.imageUrl} alt={dealProduct.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <h3 className="text-base font-bold text-slate-800 group-hover:text-[#0072CE] transition-colors line-clamp-2">{dealProduct.name}</h3>
                          <div className="flex flex-wrap items-baseline gap-2 mt-2">
                            {isCatalogue && hidePrices ? (
                              <span className="text-lg font-bold text-[#0072CE]">Inquire for Pricing</span>
                            ) : (
                              <>
                                <span className="text-2xl font-black text-[#0072CE]">
                                  ${(dealProduct.prices?.[Object.keys(dealProduct.prices || {})[0]] ?? 0).toLocaleString()}
                                </span>
                                {dealProduct.originalPrices && Object.keys(dealProduct.prices || {})[0] && !isCatalogue && (
                                  <span className="text-sm text-slate-400 line-through font-medium">
                                    ${(dealProduct.originalPrices[Object.keys(dealProduct.prices)[0]] ?? 0).toLocaleString()}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="mt-4 w-full py-2.5 bg-[#0072CE] text-white text-center rounded-lg font-bold text-xs hover:bg-[#005EA6] transition-colors">
                            View Clinical Specifications &amp; Quote
                          </div>
                        </Link>
                      </div>
                      <div className="w-full lg:w-[60%] grid grid-cols-2 gap-4">
                        {dealGridProducts.map(p => (
                          <ProductCard 
                            key={p.id} 
                            product={p} 
                            siteMode={siteConfig?.siteMode || "ecommerce"} 
                            hidePrices={hidePrices} 
                            catalogueInquiryText={catalogueInquiryText}
                          />
                        ))}
                      </div>
                    </div>
                  )
                );
              }

              // 5. Mini Lists (New Arrivals, Top Rated, Best Sellers)
              if (section.type === "mini-lists" || section.id === "mini-lists") {
                return (
                  <div key={section.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="md:pr-6">
                      <h3 className="font-bold text-base text-slate-900 tracking-tight border-b-2 border-[#0072CE] pb-2 mb-3 inline-block">New Formulations</h3>
                      <div className="flex flex-col">
                        {newArrivals.map(p => <MiniListItem key={p.id} product={p} />)}
                      </div>
                    </div>
                    <div className="md:px-6 pt-6 md:pt-0">
                      <h3 className="font-bold text-base text-slate-900 tracking-tight border-b-2 border-[#70BA28] pb-2 mb-3 inline-block">Top Rated Supplies</h3>
                      <div className="flex flex-col">
                        {topRated.map(p => <MiniListItem key={p.id} product={p} />)}
                      </div>
                    </div>
                    <div className="md:pl-6 pt-6 md:pt-0">
                      <h3 className="font-bold text-base text-slate-900 tracking-tight border-b-2 border-[#00A3E0] pb-2 mb-3 inline-block">Institutional Best Sellers</h3>
                      <div className="flex flex-col">
                        {bestSellers.map(p => <MiniListItem key={p.id} product={p} />)}
                      </div>
                    </div>
                  </div>
                );
              }

              // 6. Trust Features Bar
              if (section.type === "trust-features" || section.id === "trust-features-bar") {
                return (
                  <div key={section.id} className="bg-white rounded-2xl border border-slate-200/80 py-6 px-6 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                      {trustFeatures.map(({ icon, title, sub }) => {
                        const Icon = ICON_MAP[icon] || Truck;
                        return (
                          <div key={title} className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100 text-[#0072CE]">
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{title}</p>
                              <p className="text-[10px] text-slate-500">{sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 7. General Dynamic Section
              if (!section.products.length) return null;
              return (
                <div key={section.id} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                    <button onClick={() => setSelectedCategory(section.categoryId || "all")} className="text-xs font-bold text-[#0072CE] flex items-center gap-1 hover:underline uppercase tracking-wider">
                      VIEW ALL <ArrowRight size={14}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {section.products.slice(0, 5).map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        siteMode={siteConfig?.siteMode || "ecommerce"} 
                        hidePrices={hidePrices} 
                        catalogueInquiryText={catalogueInquiryText}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {allProducts.length === 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center shadow-xs my-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0072CE] flex items-center justify-center mx-auto mb-3.5 border border-blue-100">
                  <Package size={26} />
                </div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Pharmaceutical &amp; Medical Catalogue</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                  Medical supplies and verified pharmaceutical formulations will appear here as they are published via the administrative portal.
                </p>
                <div className="mt-5">
                  <Link
                    href="/business-page/contact-us"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <BookOpen size={14} /> Submit Institutional Requisition
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── GLOBAL FOOTER COMPONENT ────────────────────────────────── */}
      <Footer siteConfig={siteConfig} />
    </div>
  );
}
