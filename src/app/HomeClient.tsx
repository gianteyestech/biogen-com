"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Phone, Mail, MapPin, Clock,
  Truck, RotateCcw, Headphones, Tag, Send, Star, Shield, Package, Menu, ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import CartSlider from "@/components/CartSlider";
import ProductSection from "@/components/ProductSection";
import ProductCard from "@/components/ProductCard";
import { MEGA_MENU } from "@/data/products";
import type {
  CMSProduct,
  CMSCategory,
  CMSCircleCat,
  CMSHeroSlide,
  CMSSiteConfig,
  CMSPageSection,
} from "@/lib/cms-types";
import { filterProductsByCategory } from "@/lib/cms-types";
import { getFooterLinkHref } from "@/lib/link-utils";

// ─── Icon map for trust features ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Truck, RotateCcw, Headphones, Tag, Shield, Package, Star, Phone, Mail, MapPin, Clock,
};

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";
const goldText: React.CSSProperties = {
  background: goldGrad,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface SectionWithProducts extends CMSPageSection {
  products: CMSProduct[];
}

interface HomeClientProps {
  allProducts: CMSProduct[];
  categories: CMSCategory[];
  circleCats: CMSCircleCat[];
  heroSlides: CMSHeroSlide[];
  siteConfig: CMSSiteConfig;
  sections: SectionWithProducts[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomeClient({
  allProducts, categories, circleCats, heroSlides, siteConfig, sections,
}: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [heroSlide, setHeroSlide] = useState(0);

  const filteredProducts = useMemo(() => {
    let list = filterProductsByCategory(allProducts, selectedCategory);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.urduName.includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchTerm, allProducts]);

  const isFiltered = selectedCategory !== "all" || searchTerm.trim();

  // Highlight products
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 5);
  const trendingProducts = allProducts.filter((p) => (p.reviewsCount || 0) > 100).slice(0, 5);
  const newArrivals = allProducts.filter((p) => p.isNew).slice(0, 3);
  const topRated = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const bestSellers = trendingProducts.slice(0, 3);
  
  // Big Deal product (pick first featured)
  const dealProduct = featuredProducts[0] || allProducts[0];
  const dealGridProducts = allProducts.filter(p => p.id !== dealProduct?.id).slice(0, 4);

  const { brand, promoCode, footer, trustFeatures } = siteConfig;

  // Mini List Item Component
  const MiniListItem = ({ product }: { product: CMSProduct }) => {
    const weight = Object.keys(product.prices || {})[0] || "";
    const price = product.prices?.[weight] ?? 0;
    const oldPrice = product.originalPrices?.[weight];
    return (
      <Link href={`/product/${product.id}`} className="flex items-center gap-3 py-3 border-b border-gray-100 group last:border-0">
        <div className="w-16 h-16 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
           <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1">
          <h4 className="text-[13px] font-semibold text-gray-800 line-clamp-2 group-hover:text-[#C9A84C] transition-colors">{product.name}</h4>
          <div className="flex items-center gap-1 my-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? "fill-[#C9A84C] text-[#C9A84C]" : "text-gray-200"} />
            ))}
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm font-extrabold text-[#C9A84C]">Rs. {price.toLocaleString()}</span>
             {oldPrice && <span className="text-xs text-gray-400 line-through">Rs. {oldPrice.toLocaleString()}</span>}
          </div>
        </div>
      </Link>
    );
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

      {/* ─── MAIN LAYOUT ───────────────────────────────────────────── */}
      <div className="global-container py-6">
        {isFiltered ? (
          /* ── FILTERED VIEW ──────────────────────────────────────── */
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="font-sans text-xl font-extrabold text-[#1a1a1a] uppercase tracking-wide">
                {searchTerm
                  ? `Results for "${searchTerm}"`
                  : categories.find((c) => c.id === selectedCategory)?.name || "Products"
                }
              </h2>
              <button
                onClick={() => { setSelectedCategory("all"); setSearchTerm(""); }}
                className="text-xs font-bold text-[#C9A84C] hover:underline uppercase"
              >
                ← Clear Filters
              </button>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-sans text-lg">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        ) : (
          /* ── HOMEPAGE LAYOUT (DENSE STRUCTURE) ───────────────────────── */
          <div className="flex flex-col gap-5 md:gap-6 lg:gap-7">

            {/* ── ROW 1 & 2: HERO AREA + MOBILE CATEGORIES + FEATURE PROMISES GROUP (Exactly 24px gap) ── */}
            <div className="flex flex-col gap-[20px] md:gap-[24px]">
              <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4 items-stretch">
                {/* Left Menu - Desktop Only (stretched to match hero slider height exactly) */}
                <div className="hidden xl:flex flex-col w-[260px] flex-shrink-0 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[450px]">
                  <div className="bg-[#1a1a1a] text-white px-5 py-4 font-bold text-sm flex items-center gap-3">
                    <Menu size={18} className="text-[#C9A84C]" />
                    <span className="uppercase tracking-widest text-xs">Categories</span>
                  </div>
                  <div className="py-2 bg-white flex-1 overflow-y-auto scrollbar-none">
                    {MEGA_MENU.map((cat) => (
                       <button 
                          key={cat.id} 
                          onClick={() => setSelectedCategory(cat.id)} 
                          className="w-full text-left px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F9F7F2] hover:text-[#B8922B] flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors group"
                       >
                          <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span> 
                          <span className="flex-1">{cat.name}</span> 
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#B8922B]" />
                       </button>
                    ))}
                  </div>
                </div>
                
                {/* Right Slider */}
                <div className="flex-1 min-w-0 relative rounded-xl overflow-hidden shadow-sm h-[320px] sm:h-[450px] bg-gray-100">
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
                    </div>
                  ))}
                  {/* Slider Controls */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {heroSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroSlide(i)}
                        className={`rounded-full transition-all duration-300 ${i === heroSlide ? "w-8 h-2.5 bg-[#C9A84C]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`}
                      />
                    ))}
                  </div>
                  <button
                     onClick={() => setHeroSlide((heroSlide - 1 + heroSlides.length) % heroSlides.length)}
                     className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                   >‹</button>
                   <button
                     onClick={() => setHeroSlide((heroSlide + 1) % heroSlides.length)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                   >›</button>
                </div>
              </div>

              {/* Mobile/Tablet categories scrollbar (Below banner, hidden on desktop 1200px+) */}
              <div className="xl:hidden w-full overflow-x-auto py-2 flex gap-2.5 scrollbar-none snap-x border-b border-gray-200/50">
                {MEGA_MENU.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 snap-start flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? "bg-[#C9A84C] text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-[#C9A84C]"
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* ── DYNAMIC CMS SECTIONS ── */}
              </div>

              {sections.filter(s => s.visible).map((section) => {
              // 1. Featured Products
              if (section.type === "featured" || section.id === "featured-products") {
                return (
                  featuredProducts.length > 0 && (
                    <div key={section.id} className="flex flex-col gap-[14px]">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl sm:text-2xl font-black text-[#C9A84C] tracking-tight border-b-2 border-[#C9A84C] pb-2 -mb-[9px]">{section.title || "Featured Products"}</h2>
                        </div>
                        <button onClick={() => setSelectedCategory("all")} className="text-[11px] font-bold text-[#C9A84C] flex items-center gap-1 hover:underline uppercase tracking-wider transition-colors">VIEW ALL <ArrowRight size={14}/></button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </div>
                  )
                );
              }

              // 2. Shop By Category Circles
              if (section.type === "circles" || section.id === "shop-by-category") {
                return (
                  circleCats.length > 0 && (
                    <div key={section.id} className="flex flex-col gap-[14px]">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl sm:text-2xl font-black text-[#C9A84C] tracking-tight border-b-2 border-[#C9A84C] pb-2 -mb-[9px]">{section.title || "Shop By Category"}</h2>
                        </div>
                      </div>
                      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                        {circleCats.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="flex flex-col items-center gap-3 flex-shrink-0 group w-24 snap-start"
                          >
                            <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#C9A84C] transition-all group-hover:shadow-lg relative">
                              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <span className="font-sans text-[11px] font-bold text-gray-700 text-center group-hover:text-[#C9A84C] transition-colors leading-tight">
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
                    <div key={section.id} className="flex flex-col gap-[14px]">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl sm:text-2xl font-black text-[#C9A84C] tracking-tight border-b-2 border-[#C9A84C] pb-2 -mb-[9px]">{section.title || "Top Selling Products"}</h2>
                        </div>
                        <button onClick={() => setSelectedCategory("all")} className="text-[11px] font-bold text-[#C9A84C] flex items-center gap-1 hover:underline uppercase tracking-wider transition-colors">VIEW ALL <ArrowRight size={14}/></button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {trendingProducts.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </div>
                  )
                );
              }

              // 4. Deal of the Day
              if (section.type === "deal" || section.id === "deal-of-the-day") {
                return (
                  dealProduct && (
                    <div key={section.id} className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      <div className="w-full lg:w-[40%] bg-[#C9A84C] rounded-xl p-6 shadow-sm border border-[#C9A84C]/20 flex flex-col relative overflow-hidden text-white">
                        <div className="flex items-center justify-between mb-4 mt-2">
                          <h2 className="text-xl font-black text-white tracking-tight">{section.title || "Deal of the Day"}</h2>
                          <span className="px-2.5 py-1 bg-white text-[#C9A84C] text-[10px] font-black tracking-widest rounded uppercase shadow-md animate-pulse">HOT</span>
                        </div>
                        <Link href={`/product/${dealProduct.id}`} className="flex-1 group bg-white rounded-lg p-4">
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-4">
                            <img src={dealProduct.imageUrl} alt={dealProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {dealProduct.prices && dealProduct.originalPrices && Object.keys(dealProduct.prices)[0] && (
                              <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-[#C9A84C] text-white flex flex-col items-center justify-center font-black leading-none shadow-lg transform rotate-12 border-2 border-white">
                                <span className="text-lg text-white">
                                  {Math.round(((dealProduct.originalPrices[Object.keys(dealProduct.prices)[0]] - dealProduct.prices[Object.keys(dealProduct.prices)[0]]) / dealProduct.originalPrices[Object.keys(dealProduct.prices)[0]]) * 100)}%
                                </span>
                                <span className="text-[9px] uppercase tracking-widest mt-0.5">OFF</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#C9A84C] transition-colors line-clamp-1">{dealProduct.name}</h3>
                          <div className="flex flex-wrap items-baseline gap-2 mt-2">
                            <span className="text-2xl font-black text-[#C9A84C]">
                              Rs. {(dealProduct.prices?.[Object.keys(dealProduct.prices || {})[0]] ?? 0).toLocaleString()}
                            </span>
                            {dealProduct.originalPrices && Object.keys(dealProduct.prices || {})[0] && (
                              <span className="text-sm text-gray-400 line-through font-medium">
                                Rs. {(dealProduct.originalPrices[Object.keys(dealProduct.prices)[0]] ?? 0).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 w-full py-3 bg-[#C9A84C] text-white text-center rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            View Deal
                          </div>
                        </Link>
                      </div>
                      <div className="w-full lg:w-[60%] grid grid-cols-2 gap-4 sm:gap-6">
                        {dealGridProducts.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </div>
                  )
                );
              }

              // 5. Mini Lists
              if (section.type === "mini-lists" || section.id === "mini-lists") {
                return (
                  <div key={section.id} className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="md:pr-8">
                      <h3 className="font-black text-lg text-gray-900 tracking-tight border-b-2 border-[#C9A84C] pb-2 mb-4 inline-block">New Arrivals</h3>
                      <div className="flex flex-col">
                        {newArrivals.map(p => <MiniListItem key={p.id} product={p} />)}
                      </div>
                    </div>
                    <div className="md:px-8 pt-6 md:pt-0">
                      <h3 className="font-black text-lg text-gray-900 tracking-tight border-b-2 border-[#C9A84C] pb-2 mb-4 inline-block">Top Rated</h3>
                      <div className="flex flex-col">
                        {topRated.map(p => <MiniListItem key={p.id} product={p} />)}
                      </div>
                    </div>
                    <div className="md:pl-8 pt-6 md:pt-0">
                      <h3 className="font-black text-lg text-gray-900 tracking-tight border-b-2 border-[#C9A84C] pb-2 mb-4 inline-block">Best Sellers</h3>
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
                  <div key={section.id} className="bg-white rounded-xl border border-gray-200 py-6 px-6 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                      {trustFeatures.map(({ icon, title, sub }) => {
                        const Icon = ICON_MAP[icon] || Truck;
                        return (
                          <div key={title} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "#C9A84C10", border: "1.5px solid #C9A84C40" }}>
                              <Icon size={18} className="text-[#C9A84C]" />
                            </div>
                            <div>
                               <p className="font-sans text-xs font-extrabold text-gray-800">{title}</p>
                               <p className="font-sans text-[10px] text-gray-400">{sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 7. Category / New Product Grid Sections
              if (!section.products.length) return null;
              return (
                <div key={section.id} className="flex flex-col gap-[14px]">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-black text-[#C9A84C] tracking-tight border-b-2 border-[#C9A84C] pb-2 -mb-[9px]">{section.title}</h2>
                    </div>
                    <button onClick={() => setSelectedCategory(section.categoryId || "all")} className="text-[11px] font-bold text-[#C9A84C] flex items-center gap-1 hover:underline uppercase tracking-wider transition-colors">VIEW ALL <ArrowRight size={14}/></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {section.products.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-[#1a1a1a] text-white pt-12 pb-6">
        <div className="global-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">

            {/* Col 1: Logo + about */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-3.5 mb-4 select-none">
                <div className="w-[78px] h-[78px] rounded-full overflow-hidden border-2 border-[#C9A227]/40 p-0.5 bg-[#F8F7F2] shadow-md flex items-center justify-center flex-shrink-0">
                  <Image src={brand.logoUrl} alt={brand.name} width={100} height={100} className="w-full h-full object-contain" />
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
                {brand.address && (
                  <p className="flex items-start gap-2"><MapPin size={13} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />{brand.address}</p>
                )}
                {brand.showPhone && brand.phone && (
                  <p className="flex items-center gap-2"><Phone size={13} className="text-[#C9A84C]" />{brand.phone}</p>
                )}
                {brand.email && (
                  <p className="flex items-center gap-2"><Mail size={13} className="text-[#C9A84C]" />{brand.email}</p>
                )}
              </div>
            </div>

            {/* Col 2: Quick links */}
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

            {/* Col 3: More links */}
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

            {/* Col 4: Newsletter + Social */}
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
            <p>© {new Date().getFullYear()} {brand.name}. {footer.copyrightText || "All Rights Reserved."}</p>
            <p>Delivering premium quality across Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
