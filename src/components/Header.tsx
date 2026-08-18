"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, ShoppingBag, Menu, ChevronDown, Phone, X, User, 
  ChevronRight, Heart, Sparkles, Shield, Gift, ArrowRight, CornerDownLeft, Clock, Package
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, MEGA_MENU } from "@/data/products";
import { BRAND } from "@/config/brand";
import productsData from "@/cms/products.json";
import Sidebar from "./Sidebar";
import BiogenLogo from "./BiogenLogo";

// Announcements
const ANNOUNCEMENTS = [
  { text: "WHO, GMP & ISO Certified Pharmaceutical Supplies", icon: "💊" },
  { text: "Precision German Stainless Steel Surgical Instruments", icon: "🔬" },
  { text: "Hospital Grade Examination Furniture & Clinical Equipment", icon: "🏥" },
  { text: "Cold-Chain Logistics Across West Africa & Internationally", icon: "🚚" },
  { text: "24/7 Clinical & Institutional Support (+232 75 011616)", icon: "💬" }
];

const POPULAR_SEARCHES = [
  "Allergy Relief",
  "Painkillers",
  "Examination Couch",
  "Foerster Forceps",
  "Surgical Loupes",
  "Antibiotics"
];

const NAV_LINKS = [
  { label: "Home", id: "all", href: "/" },
  { label: "Medicines", id: "medicines", href: "/" },
  { label: "Surgical Instruments", id: "surgical-instruments", href: "/" },
  { label: "Eye Care & Loupes", id: "eye-vision", href: "/" },
  { label: "Hospital Furniture", id: "surgical-furniture", href: "/" },
  { label: "Vitamins & Nutrition", id: "nutrition-supplements", href: "/" },
  { label: "About Us", id: "about", href: "/business-page/about-us" },
  { label: "FAQs", id: "faqs", href: "/business-page/faqs" },
  { label: "Contact Us", id: "contact", href: "/business-page/contact-us" }
];

import type { CMSSiteConfig } from "@/lib/cms-types";

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (t: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (c: string) => void;
  siteConfig?: CMSSiteConfig;
}

export default function Header({ 
  searchTerm = "", 
  setSearchTerm = () => {}, 
  selectedCategory = "all", 
  setSelectedCategory = () => {},
  siteConfig
}: HeaderProps) {
  const isCatalogue = siteConfig?.siteMode === "catalogue";
  const hidePrices = siteConfig?.hidePricesInCatalogue ?? false;
  const router = useRouter();
  const pathname = usePathname();
  const { setIsCartOpen, cartCount, cartTotal, mounted } = useCart();

  // Component States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [fadeAnnounce, setFadeAnnounce] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string>(MEGA_MENU[0]?.id ?? "");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);

  // Refs
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Handle Scroll for Sticky Header Shrinking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cycle Announcements with Smooth Fading
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeAnnounce(false);
      setTimeout(() => {
        setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setFadeAnnounce(true);
      }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target as Node)) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shop all items / category filter callback
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchTerm("");
    if (pathname !== "/") {
      router.push("/");
    }
    setMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (link: { label: string; id: string; href: string }) => {
    if (link.href.startsWith("/business-page")) {
      router.push(link.href);
      setMegaMenuOpen(false);
      setIsMobileMenuOpen(false);
    } else if (link.href.startsWith("#")) {
      setMegaMenuOpen(false);
      setIsMobileMenuOpen(false);
      if (pathname !== "/") {
        router.push("/#footer");
      } else {
        const el = document.querySelector("#footer") || document.querySelector("footer");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      handleCategorySelect(link.id);
    }
  };

  const handleLogoClick = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    if (pathname !== "/") {
      router.push("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchTerm(trimmed);
    
    // Save to recent searches
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
    
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== query);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  // Filter products for suggestions list in real-time
  const matchedProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return (productsData as any[]).filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchTerm]);

  // Best sellers from product JSON for Mega Menu
  const bestSellerProducts = useMemo(() => {
    return (productsData as any[])
      .filter((p) => p.featured)
      .slice(0, 3);
  }, []);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => 
        prev < matchedProducts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (activeSuggestionIdx > -1 && matchedProducts[activeSuggestionIdx]) {
        e.preventDefault();
        const p = matchedProducts[activeSuggestionIdx];
        router.push(`/product/${p.id}`);
        setIsSearchFocused(false);
      } else {
        handleSearchSubmit(searchTerm);
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setActiveSuggestionIdx(-1);
    }
  };

  function openMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaMenuOpen(true);
    if (!hoveredCat && MEGA_MENU[0]) setHoveredCat(MEGA_MENU[0].id);
  }

  function closeMegaDelayed() {
    closeTimer.current = setTimeout(() => setMegaMenuOpen(false), 300);
  }

  return (
    <>
      {/* Mobile Drawer Accordion Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <header className="w-full z-40 relative">
        {/* ── TOP ANNOUNCEMENT BAR (Matte Dark Slate, Healthcare Blue/Cyan Accents) ── */}
        <div className="bg-[#0A0F1D] h-9 flex items-center justify-center overflow-hidden border-b border-slate-800 select-none">
          <div className="global-container w-full flex items-center justify-between text-xs text-slate-300 font-sans">
            {/* Left Track Order Link */}
            <div className="hidden md:flex items-center gap-1.5 hover:text-[#00A3E0] transition-colors duration-300">
              <Link href="/track-order" className="flex items-center gap-1.5 hover:text-[#00A3E0]">
                <Package size={13} className="text-[#00A3E0]" />
                <span className="font-semibold text-slate-200 hover:text-[#00A3E0]">Track Order</span>
              </Link>
            </div>

            {/* Fading Announcement Slider */}
            <div className="flex-1 flex justify-center items-center text-center">
              <div className={`flex items-center gap-2 transition-all duration-300 transform ${fadeAnnounce ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
                <span className="text-sm leading-none">
                  {ANNOUNCEMENTS[announcementIdx].icon}
                </span>
                <span className="font-sans font-medium tracking-wide text-white">
                  {ANNOUNCEMENTS[announcementIdx].text}
                </span>
              </div>
            </div>

            {/* Right Contact Link */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/business-page/contact-us"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-[#00A3E0] transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Customer Helpdesk</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky wrapper for Main Header and Sub Navigation Bar */}
        <div className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200">
          {/* ── MAIN HEADER (White background) ── */}
          <div 
            className={`w-full bg-white border-b border-slate-100 transition-all duration-300 ${
              isScrolled 
                ? "h-[64px]" 
                : "h-[78px]"
            }`}
          >
            <div className="global-container h-full flex items-center justify-between gap-4 md:gap-8 lg:gap-10">
              
              {/* Logo area */}
              <div 
                className="flex-shrink-0 cursor-pointer select-none py-1 mr-2 md:mr-6"
                onClick={handleLogoClick}
              >
                <div className="flex items-center group">
                  <BiogenLogo variant="light" size={isScrolled ? "md" : "lg"} />
                </div>
              </div>

              {/* Desktop Search Bar (Medical Blue Action, Clean Rounded Borders) */}
              <div 
                ref={searchContainerRef}
                className="hidden md:flex flex-1 max-w-[650px] relative"
              >
                <div className="w-full relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search pharmaceuticals, surgical tools & supplies..."
                    value={searchTerm}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setActiveSuggestionIdx(-1);
                    }}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsSearchFocused(true);
                      setActiveSuggestionIdx(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    className={`w-full border border-slate-300 rounded-[14px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 bg-white transition-all duration-300 ${
                      isScrolled ? "h-[42px] pl-11 pr-26" : "h-[50px] pl-12 pr-28"
                    }`}
                    aria-label="Search items"
                  />
                  <Search 
                    size={isScrolled ? 16 : 18} 
                    className={`absolute transition-all duration-300 ${
                      isSearchFocused ? "text-[#0072CE]" : "text-slate-400"
                    } ${
                      isScrolled ? "left-[16px]" : "left-[18px]"
                    }`} 
                  />
                  <button
                    onClick={() => handleSearchSubmit(searchTerm)}
                    className={`absolute right-[6px] top-1/2 -translate-y-1/2 bg-[#0072CE] hover:bg-[#005EA6] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all duration-300 flex items-center gap-1.5 active:scale-95 shadow-sm ${
                      isScrolled ? "h-[32px] px-3.5" : "h-[38px] px-5"
                    }`}
                  >
                    <span>Search</span>
                  </button>
                </div>

                {/* Instant Search Suggestions Box */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {!searchTerm.trim() ? (
                      <div className="grid grid-cols-2 divide-x divide-slate-100 px-4 py-2">
                        <div className="pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent Searches</span>
                          </div>
                          {recentSearches.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2">No recent searches</p>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {recentSearches.map((s) => (
                                <div 
                                  key={s} 
                                  onClick={() => handleSearchSubmit(s)}
                                  className="flex items-center justify-between text-xs text-slate-700 hover:text-[#0072CE] cursor-pointer py-1.5 px-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                >
                                  <span>{s}</span>
                                  <button 
                                    onClick={(e) => removeRecentSearch(e, s)}
                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={12} className="text-[#0072CE]" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Popular Medical Supplies</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {POPULAR_SEARCHES.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  setSearchTerm(tag);
                                  handleSearchSubmit(tag);
                                }}
                                className="text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0072CE] px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {matchedProducts.length === 0 ? (
                          <div className="p-6 text-center">
                            <p className="text-sm text-slate-600">No medical supplies found matching &quot;{searchTerm}&quot;</p>
                            <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Antibiotics&quot;, &quot;Surgical Forceps&quot;, or &quot;Examination Couch&quot;</p>
                          </div>
                        ) : (
                          <div className="flex flex-col py-1">
                            {matchedProducts.map((p, idx) => {
                              const weight = Object.keys(p.prices)[0];
                              const price = p.prices[weight];
                              const oldPrice = p.originalPrices?.[weight];
                              
                              return (
                                <Link
                                  key={p.id}
                                  href={`/product/${p.id}`}
                                  onClick={() => {
                                    handleSearchSubmit(p.name);
                                    setIsSearchFocused(false);
                                  }}
                                  className={`flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                                    idx === activeSuggestionIdx ? "bg-blue-50/60 border-l-4 border-l-[#0072CE]" : ""
                                  }`}
                                >
                                  <div className="w-12 h-12 rounded-md bg-slate-50 overflow-hidden border border-slate-200 flex-shrink-0">
                                    <img 
                                      src={p.imageUrl} 
                                      alt={p.name} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-slate-800 truncate">{p.name}</h4>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{p.category}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-extrabold text-[#0072CE] block">${price.toFixed(2)}</span>
                                    {oldPrice && (
                                      <span className="text-[10px] text-slate-400 line-through">${oldPrice.toFixed(2)}</span>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                            <div 
                              onClick={() => handleSearchSubmit(searchTerm)}
                              className="bg-slate-50 hover:bg-blue-50 text-center py-2 text-xs font-bold text-[#0072CE] cursor-pointer flex items-center justify-center gap-2 mt-1 border-t border-slate-100"
                            >
                              <span>View all results for &quot;{searchTerm}&quot;</span>
                              <CornerDownLeft size={12} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side Icons (Account, Wishlist, Cart in Medical Blue) */}
              <div className="flex items-center gap-5 md:gap-6 lg:gap-7">
                
                {/* Account Icon */}
                <button 
                  className="group/btn w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0072CE] hover:border-[#0072CE] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md" 
                  aria-label="Account"
                >
                  <User size={20} className="transition-transform duration-300 group-hover/btn:scale-110" />
                </button>

                {/* Wishlist Icon */}
                <button 
                  className="group/btn relative w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0072CE] hover:border-[#0072CE] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md" 
                  aria-label="Wishlist"
                >
                  <Heart size={20} className="transition-transform duration-300 group-hover/btn:scale-110" />
                  <span className="absolute -top-1 -right-1 bg-[#0072CE] text-white text-[9px] font-black min-w-[17px] min-h-[17px] flex items-center justify-center rounded-full shadow-sm">
                    0
                  </span>
                </button>

                {/* Cart Button with USD Details */}
                <div 
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-4 lg:gap-5 cursor-pointer group"
                >
                  <button
                    className="relative w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0072CE] hover:border-[#0072CE] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md group-hover:scale-105"
                    aria-label="Cart"
                  >
                    <ShoppingBag size={20} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute -top-1 -right-1 bg-[#0072CE] text-white text-[9px] font-black min-w-[17px] min-h-[17px] flex items-center justify-center rounded-full shadow-sm">
                      {mounted ? cartCount : 0}
                    </span>
                  </button>
                  <div className="hidden lg:flex flex-col leading-none">
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                      {isCatalogue ? "REQUISITION" : "MY CART"}
                    </span>
                    <span className="text-xs font-black text-slate-900 group-hover:text-[#0072CE] transition-colors mt-0.5">
                      {mounted
                        ? (isCatalogue && hidePrices
                            ? `${cartCount} Items`
                            : `$${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                        : (isCatalogue && hidePrices ? "0 Items" : "$0.00")}
                    </span>
                  </div>
                </div>

                {/* Mobile hamburger menu */}
                <button
                  className="md:hidden p-2 text-slate-800 hover:text-[#0072CE] transition-colors duration-300"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open navigation drawer"
                >
                  <Menu size={22} />
                </button>

              </div>
            </div>
          </div>

          {/* ── DESKTOP PRIMARY NAVIGATION (Clean White background, Medical Blue Active/Hover) ── */}
          <div className="hidden md:block bg-white relative z-40">
            <div className="global-container h-11 flex items-center justify-between">
              <nav className="flex items-center gap-1 sm:gap-2 h-full">
                
                {/* Category dropdown toggle */}
                <div 
                  className="relative h-full"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMegaDelayed}
                  ref={megaMenuRef}
                >
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`h-full pr-4 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-slate-800 hover:text-[#0072CE] transition-colors duration-300 border-r border-slate-200 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0072CE] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                      megaMenuOpen ? "text-[#0072CE] after:scale-x-100" : ""
                    }`}
                  >
                    <Menu size={15} className="text-[#0072CE]" />
                    <span>Shop categories</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {megaMenuOpen && (
                    <div
                      className="absolute top-full left-0 w-[960px] bg-white shadow-2xl rounded-b-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 z-50"
                      onMouseEnter={openMega}
                      onMouseLeave={closeMegaDelayed}
                    >
                      <div className="grid grid-cols-4 p-8 gap-6">
                        
                        {/* Column 1: Shop by Category */}
                        <div>
                          <h4 className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest pb-2.5 mb-4 border-b border-slate-100">
                            Medical Departments
                          </h4>
                          <div className="flex flex-col gap-1.5">
                            {MEGA_MENU.slice(0, 7).map((cat) => (
                              <button
                                key={cat.id}
                                onMouseEnter={() => setHoveredCat(cat.id)}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-left text-xs transition-all duration-200 group ${
                                  hoveredCat === cat.id
                                    ? "bg-blue-50 text-[#0072CE] font-bold"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-sm">{cat.icon}</span>
                                  <span className="font-semibold">{cat.name}</span>
                                </span>
                                <ChevronRight size={12} className={`transition-transform duration-200 ${
                                  hoveredCat === cat.id ? "translate-x-1" : "opacity-30"
                                }`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Column 2: Featured Medical Supplies */}
                        <div className="col-span-2">
                          <h4 className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest pb-2.5 mb-4 border-b border-slate-100">
                            Featured Supplies
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {bestSellerProducts.map((p) => {
                              const weight = Object.keys(p.prices)[0];
                              const price = p.prices[weight];
                              return (
                                <Link
                                  key={p.id}
                                  href={`/product/${p.id}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="group/item flex flex-col p-2 bg-slate-50 hover:bg-blue-50/50 rounded-xl transition-all duration-300 border border-slate-200 text-center"
                                >
                                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-2 shadow-xs border border-slate-100 flex items-center justify-center">
                                    <img 
                                      src={p.imageUrl} 
                                      alt={p.name} 
                                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" 
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-800 line-clamp-1 group-hover/item:text-[#0072CE] transition-colors px-1">
                                    {p.name}
                                  </span>
                                  <span className="text-[11px] font-black text-[#0072CE] mt-1">
                                    ${price.toFixed(2)}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                          
                          {/* Shop all link */}
                          <div className="mt-5 text-center">
                            <button
                              onClick={() => handleCategorySelect("all")}
                              className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-800 hover:text-[#0072CE] transition-colors"
                            >
                              <span>Browse All Departments</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Column 3: Quality Guarantee Badge */}
                        <div>
                          <div className="relative rounded-2xl overflow-hidden bg-[#0A0F1D] h-full flex flex-col justify-end p-5 border border-blue-500/30 text-white min-h-[220px]">
                            <div className="relative z-20">
                              <span className="text-[#00A3E0] font-sans text-[8px] font-black uppercase tracking-[0.25em] block mb-1">
                                WHO-GMP COMPLIANT
                              </span>
                              <h5 className="font-sans font-bold text-sm tracking-wide mb-1.5 leading-snug text-white">
                                Precision Surgical &amp; Clinical Gear
                              </h5>
                              <p className="text-[10px] text-slate-300 leading-relaxed mb-3">
                                Autoclavable German stainless steel instruments &amp; essential medicines.
                              </p>
                              <button
                                onClick={() => handleCategorySelect("surgical-instruments")}
                                className="text-[9px] font-bold uppercase tracking-wider bg-[#0072CE] hover:bg-white text-white hover:text-slate-900 py-1.5 px-3.5 rounded-lg transition-all duration-300"
                              >
                                Explore Supplies
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* Standard Nav links */}
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className={`h-full px-3.5 flex items-center font-sans text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-[#0072CE] transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0072CE] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                      (selectedCategory === link.id && link.id !== "all") || (pathname === link.href && link.href !== "/")
                        ? "text-[#0072CE] after:scale-x-100"
                        : ""
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              {/* Right Track Order Link */}
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/track-order" className="flex items-center gap-2.5 group">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200 text-[#0072CE] relative transition-transform duration-300 group-hover:scale-110">
                    <Package size={12} className="relative z-10 text-[#0072CE]" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Order Status</span>
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#0072CE] transition-colors">
                      Track Order
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE OVERLAY SEARCH BOX ── */}
        {isMobileSearchOpen && (
          <div 
            ref={mobileSearchContainerRef}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-3 shadow-xl z-50 animate-in slide-in-from-top duration-200"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search pharmaceuticals & supplies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-16 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#0072CE]"
              />
              <Search size={14} className="absolute left-3 text-[#0072CE]" />
              <button
                onClick={() => handleSearchSubmit(searchTerm)}
                className="absolute right-1.5 h-7 px-3 bg-[#0072CE] hover:bg-[#005EA6] text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors"
              >
                Go
              </button>
            </div>

            {/* Mobile Instant Match Panel */}
            {searchTerm.trim() && (
              <div className="mt-2 max-h-56 overflow-y-auto border border-slate-100 rounded-lg">
                {matchedProducts.map((p) => {
                  const weight = Object.keys(p.prices)[0];
                  const price = p.prices[weight];
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      onClick={() => {
                        handleSearchSubmit(p.name);
                        setIsMobileSearchOpen(false);
                      }}
                      className="flex items-center gap-3 p-2 bg-slate-50 hover:bg-slate-100 border-b border-slate-100 last:border-0 text-left transition-colors"
                    >
                      <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded object-cover border border-slate-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                        <p className="text-[10px] font-black text-[#0072CE]">${price.toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── MOBILE STICKY BOTTOM NAVIGATION ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0A0F1D] border-t border-slate-800 flex items-center justify-around z-40 px-3 shadow-2xl">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`flex flex-col items-center justify-center w-12 h-12 text-center transition-colors ${
            selectedCategory === "all" && !searchTerm.trim() ? "text-[#00A3E0]" : "text-slate-400 hover:text-white"
          }`}
        >
          <User size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Account</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`flex flex-col items-center justify-center w-12 h-12 text-center transition-colors ${
            isSidebarOpen ? "text-[#00A3E0]" : "text-slate-400 hover:text-white"
          }`}
        >
          <Menu size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Category</span>
        </button>

        {/* Center Main Home Action */}
        <button
          onClick={handleLogoClick}
          className="flex flex-col items-center justify-center w-14 h-14 bg-[#0A0F1D] border-2 border-[#0072CE] rounded-full text-center text-[#0072CE] -translate-y-4 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          aria-label="Home"
        >
          <BiogenLogo variant="symbol" size="sm" />
        </button>

        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className={`flex flex-col items-center justify-center w-12 h-12 text-center transition-colors ${
            isMobileSearchOpen ? "text-[#00A3E0]" : "text-slate-400 hover:text-white"
          }`}
        >
          <Search size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Search</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-12 h-12 text-center text-slate-400 hover:text-white relative"
        >
          <ShoppingBag size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Cart</span>
          <span className="absolute top-1 right-2 bg-[#0072CE] text-white text-[8px] font-bold min-w-[15px] min-h-[15px] flex items-center justify-center rounded-full shadow-xs">
            {cartCount}
          </span>
        </button>
      </div>
    </>
  );
}
