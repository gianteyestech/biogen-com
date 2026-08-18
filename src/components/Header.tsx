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

// Emojis mapping for announcements
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

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (t: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (c: string) => void;
}

export default function Header({ 
  searchTerm = "", 
  setSearchTerm = () => {}, 
  selectedCategory = "all", 
  setSelectedCategory = () => {} 
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsCartOpen, cartCount, cartTotal } = useCart();

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
      }, 300); // fading duration
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

  // Active mega menu category data
  const activeCatData = useMemo(() => {
    return MEGA_MENU.find((c) => c.id === hoveredCat) ?? MEGA_MENU[0];
  }, [hoveredCat]);

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
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.urduName?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchTerm]);

  // Best sellers from product JSON for Mega Menu (featured products)
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
        {/* ── TOP ANNOUNCEMENT BAR (36px–40px, Matte Black, Warm White, Gold) ── */}
        <div className="bg-[#111111] h-9 flex items-center justify-center overflow-hidden border-b border-[#C9A227]/20 select-none">
          <div className="global-container w-full flex items-center justify-between text-xs text-[#F8F7F2] font-sans">
            {/* Left Track Order Link */}
            <div className="hidden md:flex items-center gap-1.5 hover:text-[#C9A227] transition-colors duration-300">
              <Link href="/track-order" className="flex items-center gap-1.5 hover:text-[#C9A227]">
                <Package size={13} className="text-[#C9A227]" />
                <span className="font-semibold">Track Order</span>
              </Link>
            </div>

            {/* Fading Announcement Slider */}
            <div className="flex-1 flex justify-center items-center text-center">
              <div className={`flex items-center gap-2 transition-all duration-300 transform ${fadeAnnounce ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
                <span className="text-[#C9A227] text-sm leading-none">
                  {ANNOUNCEMENTS[announcementIdx].icon}
                </span>
                <span className="font-sans font-medium tracking-wide">
                  {ANNOUNCEMENTS[announcementIdx].text}
                </span>
              </div>
            </div>

            {/* Right Contact Link */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/business-page/contact-us"
                className="inline-flex items-center gap-1 hover:text-[#C9A227] transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Customer Helpdesk</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky wrapper for both White Header and Sub Navigation Bar with soft depth shadow */}
        <div className="sticky top-0 z-40 w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-gray-100">
          {/* ── MAIN HEADER (White background) ── */}
          <div 
            className={`w-full bg-white border-b border-gray-100/80 transition-all duration-300 ${
              isScrolled 
                ? "h-[64px]" 
                : "h-[78px]"
            }`}
          >
          <div className="global-container h-full flex items-center justify-between gap-4 md:gap-8 lg:gap-10">
            
            {/* Logo area - Official Biogen Pharma Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer select-none py-1 mr-2 md:mr-6"
              onClick={handleLogoClick}
            >
              <div className="flex items-center group">
                <BiogenLogo variant="light" size={isScrolled ? "md" : "lg"} />
              </div>
            </div>

            {/* Desktop Search Bar (50px height, 14px rounded corners, max-width 650px, white background) */}
            <div 
              ref={searchContainerRef}
              className="hidden md:flex flex-1 max-w-[650px] relative"
            >
              <div className="w-full relative flex items-center">
                <input
                  type="text"
                  placeholder="Search premium dry fruits..."
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
                  className={`w-full border border-gray-200 rounded-[14px] text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 focus:shadow-[0_0_15px_rgba(201,162,39,0.08)] bg-white transition-all duration-300 ${
                    isScrolled ? "h-[42px] pl-11 pr-24" : "h-[50px] pl-12 pr-28"
                  }`}
                  aria-label="Search items"
                />
                <Search 
                  size={isScrolled ? 16 : 18} 
                  className={`absolute transition-all duration-300 ${
                    isSearchFocused ? "text-[#C9A227]" : "text-gray-400"
                  } ${
                    isScrolled ? "left-[16px]" : "left-[18px]"
                  }`} 
                />
                <button
                  onClick={() => handleSearchSubmit(searchTerm)}
                  className={`absolute right-[6px] top-1/2 -translate-y-1/2 bg-[#C9A227] hover:bg-[#B8922B] text-black font-sans text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                    isScrolled ? "h-[32px] px-3.5" : "h-[38px] px-5"
                  }`}
                >
                  <span>Search</span>
                </button>
              </div>

              {/* Instant Search Suggestions Box */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Empty search state (show Recents + Popular) */}
                  {!searchTerm.trim() ? (
                    <div className="grid grid-cols-2 divide-x divide-gray-100 px-4 py-2">
                      <div className="pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Searches</span>
                        </div>
                        {recentSearches.length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-2">No recent searches</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {recentSearches.map((s) => (
                              <div 
                                key={s} 
                                onClick={() => handleSearchSubmit(s)}
                                className="flex items-center justify-between text-xs text-gray-600 hover:text-[#C9A227] cursor-pointer py-1.5 px-2 hover:bg-[#F8F7F2] rounded-lg transition-colors group"
                              >
                                <span>{s}</span>
                                <button 
                                  onClick={(e) => removeRecentSearch(e, s)}
                                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
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
                          <Sparkles size={12} className="text-[#C9A227]" />
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Popular Right Now</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {POPULAR_SEARCHES.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                setSearchTerm(tag);
                                handleSearchSubmit(tag);
                              }}
                              className="text-xs font-semibold bg-[#F8F7F2] hover:bg-[#C9A227]/10 text-gray-700 hover:text-[#C9A227] px-3 py-1.5 rounded-full border border-gray-100 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Search Term match suggestions */
                    <div className="flex flex-col">
                      <div className="px-4 py-1.5 border-b border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Matching Products</span>
                        <span className="text-[9px] bg-[#C9A227]/10 text-[#C9A227] px-2 py-0.5 rounded font-black">SUGGESTIONS</span>
                      </div>

                      {matchedProducts.length === 0 ? (
                        <div className="py-8 px-4 text-center">
                          <p className="text-sm text-gray-500">No premium fruits found matching &quot;{searchTerm}&quot;</p>
                          <p className="text-xs text-gray-400 mt-1">Try searching for &quot;Almonds&quot;, &quot;Dates&quot;, or &quot;Gift Boxes&quot;</p>
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
                                  // Save to recent
                                  handleSearchSubmit(p.name);
                                  setIsSearchFocused(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2 hover:bg-[#F8F7F2] transition-colors border-b border-gray-50 last:border-0 ${
                                  idx === activeSuggestionIdx ? "bg-[#F8F7F2] border-l-4 border-l-[#C9A227]" : ""
                                }`}
                              >
                                <div className="w-12 h-12 rounded-md bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                  <img 
                                    src={p.imageUrl} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-gray-800 truncate">{p.name}</h4>
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold">{p.category}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-extrabold text-[#C9A227] block">Rs. {price.toLocaleString()}</span>
                                  {oldPrice && (
                                    <span className="text-[10px] text-gray-400 line-through">Rs. {oldPrice.toLocaleString()}</span>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                          <div 
                            onClick={() => handleSearchSubmit(searchTerm)}
                            className="bg-gray-50/50 hover:bg-[#F8F7F2] text-center py-2 text-xs font-bold text-[#C9A227] cursor-pointer flex items-center justify-center gap-2 mt-1 border-t border-gray-50"
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

            {/* Right Side Icons (Wishlist, Account, Cart in circular buttons) */}
            <div className="flex items-center gap-5 md:gap-6 lg:gap-7">
              
              {/* Account icon */}
              <button 
                className="group/btn w-10 h-10 rounded-full border border-gray-100 bg-[#F8F7F2]/50 flex items-center justify-center text-gray-700 hover:text-[#C9A227] hover:border-[#C9A227] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md" 
                aria-label="Account"
              >
                <User size={22} className="transition-transform duration-300 group-hover/btn:scale-110" />
              </button>

              {/* Wishlist Icon */}
              <button 
                className="group/btn relative w-10 h-10 rounded-full border border-gray-100 bg-[#F8F7F2]/50 flex items-center justify-center text-gray-700 hover:text-[#C9A227] hover:border-[#C9A227] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md" 
                aria-label="Wishlist"
              >
                <Heart size={22} className="transition-transform duration-300 group-hover/btn:scale-110" />
                <span className="absolute -top-1 -right-1 bg-[#C9A227] text-black text-[9px] font-black min-w-[17px] min-h-[17px] flex items-center justify-center rounded-full shadow-sm">
                  0
                </span>
              </button>

              {/* Cart Button with Details */}
              <div 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-4 lg:gap-5 cursor-pointer group"
              >
                <button
                  className="relative w-10 h-10 rounded-full border border-gray-100 bg-[#F8F7F2]/50 flex items-center justify-center text-gray-700 hover:text-[#C9A227] hover:border-[#C9A227] hover:bg-white hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md group-hover:scale-105"
                  aria-label="Cart"
                >
                  <ShoppingBag size={22} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 bg-[#C9A227] text-black text-[9px] font-black min-w-[17px] min-h-[17px] flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                </button>
                <div className="hidden lg:flex flex-col leading-none">
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wide">MY CART</span>
                  <span className="text-xs font-black text-gray-900 group-hover:text-[#C9A227] transition-colors mt-0.5">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Mobile hamburger menu (opens drawer) */}
              <button
                className="md:hidden p-2 text-gray-800 hover:text-[#C9A227] transition-colors duration-300"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open navigation drawer"
              >
                <Menu size={22} />
              </button>

            </div>
          </div>
        </div>

        {/* ── DESKTOP PRIMARY NAVIGATION (White background, Gold hover) ── */}
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
                  className={`h-full pr-4 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-gray-800 hover:text-[#C9A227] transition-colors duration-300 border-r border-gray-100 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C9A227] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                    megaMenuOpen ? "text-[#C9A227] after:scale-x-100" : ""
                  }`}
                >
                  <Menu size={15} className="text-[#C9A227]" />
                  <span>Shop categories</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* ── LUXURY MEGA MENU DROPDOWN ── */}
                {megaMenuOpen && (
                  <div
                    className="absolute top-full left-0 w-[960px] bg-white shadow-2xl rounded-b-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 z-50"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMegaDelayed}
                  >
                    <div className="grid grid-cols-4 p-8 gap-6">
                      
                      {/* Column 1: Shop by Category (Interactive index list) */}
                      <div>
                        <h4 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2.5 mb-4 border-b border-gray-100">
                          Shop by Category
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {MEGA_MENU.slice(0, 7).map((cat) => (
                            <button
                              key={cat.id}
                              onMouseEnter={() => setHoveredCat(cat.id)}
                              onClick={() => handleCategorySelect(cat.id)}
                              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-left text-xs transition-all duration-200 group ${
                                hoveredCat === cat.id
                                  ? "bg-[#F8F7F2] text-[#C9A227] font-bold"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

                      {/* Column 2: Best Sellers (Dynamic Product Thumbnails) */}
                      <div className="col-span-2">
                        <h4 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-2.5 mb-4 border-b border-gray-100">
                          Best Selling Products
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
                                className="group/item flex flex-col p-2 bg-gray-50 hover:bg-[#F8F7F2] rounded-xl transition-all duration-300 border border-gray-100 text-center"
                              >
                                <div className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-2 shadow-sm border border-gray-100 flex items-center justify-center">
                                  <img 
                                    src={p.imageUrl} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" 
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-gray-800 line-clamp-1 group-hover/item:text-[#C9A227] transition-colors px-1">
                                  {p.name}
                                </span>
                                <span className="text-[11px] font-black text-[#C9A227] mt-1">
                                  Rs.{price.toLocaleString()}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        
                        {/* Shop all link */}
                        <div className="mt-5 text-center">
                          <button
                            onClick={() => handleCategorySelect("all")}
                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-800 hover:text-[#C9A227] transition-colors"
                          >
                            <span>Shop All Categories</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Column 3: Featured Promo Banner (Medical styled) */}
                      <div>
                        <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] h-full flex flex-col justify-end p-5 border border-[#0284C7]/30 text-white min-h-[220px]">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent z-10" />
                          <img 
                            src="/images/banners/biogen_banner_1.webp" 
                            alt="Surgical Instruments" 
                            className="absolute inset-0 w-full h-full object-cover opacity-70 z-0" 
                          />
                          <div className="relative z-20">
                            <span className="text-[#38BDF8] font-sans text-[8px] font-black uppercase tracking-[0.25em] block mb-1">
                              CERTIFIED QUALITY
                            </span>
                            <h5 className="font-serif font-bold text-sm tracking-wide mb-1.5 leading-snug text-white">
                              Precision Surgical &amp; Clinical Gear
                            </h5>
                            <p className="text-[10px] text-gray-300 leading-relaxed mb-3">
                              Autoclavable German stainless steel instruments &amp; essential medicines.
                            </p>
                            <button
                              onClick={() => handleCategorySelect("surgical-instruments")}
                              className="text-[9px] font-bold uppercase tracking-wider bg-[#0284C7] hover:bg-white text-white hover:text-black py-1.5 px-3.5 rounded-lg transition-all duration-300"
                            >
                              Explore
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
                  className={`h-full px-3.5 flex items-center font-sans text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#C9A227] transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C9A227] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                    (selectedCategory === link.id && link.id !== "all") || (pathname === link.href && link.href !== "/")
                      ? "text-[#C9A227] after:scale-x-100"
                      : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Track Order & Help Link */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/track-order" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-full bg-[#C9A227]/10 flex items-center justify-center border border-[#C9A227]/30 text-[#C9A227] relative transition-transform duration-300 group-hover:scale-110">
                  <Package size={12} className="relative z-10 text-[#C9A227]" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Order Status</span>
                  <span className="text-[11px] font-bold text-gray-800 group-hover:text-[#C9A227] transition-colors">
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
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-3 shadow-xl z-50 animate-in slide-in-from-top duration-200"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search premium dry fruits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-16 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#C9A227]"
              />
              <Search size={14} className="absolute left-3 text-[#C9A227]" />
              <button
                onClick={() => handleSearchSubmit(searchTerm)}
                className="absolute right-1.5 h-7 px-3 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-black font-sans text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors"
              >
                Go
              </button>
            </div>

            {/* Mobile Instant Match Panel */}
            {searchTerm.trim() && (
              <div className="mt-2 max-h-56 overflow-y-auto border border-gray-50 rounded-lg">
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
                      className="flex items-center gap-3 p-2 bg-[#F8F7F2]/50 hover:bg-gray-100 border-b border-gray-50 last:border-0 text-left transition-colors"
                    >
                      <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded object-cover border border-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                        <p className="text-[10px] font-black text-[#C9A227]">Rs. {price.toLocaleString()}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── MOBILE STICKY BOTTOM NAVIGATION (Home, Categories, Search, Wishlist, Cart) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111111] border-t border-[#C9A227]/20 flex items-center justify-around z-40 px-3 shadow-2xl">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`flex flex-col items-center justify-center w-12 h-12 text-center transition-colors ${
            selectedCategory === "all" && !searchTerm.trim() ? "text-[#C9A227]" : "text-gray-400 hover:text-white"
          }`}
        >
          <User size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Account</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`flex flex-col items-center justify-center w-12 h-12 text-center transition-colors ${
            isSidebarOpen ? "text-[#C9A227]" : "text-gray-400 hover:text-white"
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
            isMobileSearchOpen ? "text-[#C9A227]" : "text-gray-400 hover:text-white"
          }`}
        >
          <Search size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Search</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-12 h-12 text-center text-gray-400 hover:text-white relative"
        >
          <ShoppingBag size={18} className="mx-auto" />
          <span className="text-[8px] font-black uppercase tracking-wider mt-1 block">Cart</span>
          <span className="absolute top-1 right-2 bg-[#C9A227] text-white text-[8px] font-bold min-w-[15px] min-h-[15px] flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        </button>
      </div>
    </>
  );
}
