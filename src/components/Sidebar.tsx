"use client";
import React, { useState } from "react";
import { X, ChevronDown, ChevronRight, ShoppingBag, Leaf, Nut, Grape, TreePine, Gift, Apple } from "lucide-react";
import { MEGA_MENU } from "@/data/products";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategoryIcon = ({ id, icon }: { id: string, icon: string }) => {
  switch (id) {
    case "pistachios": return <Leaf size={18} className="text-[#C9A227]" />;
    case "almonds": return <Nut size={18} className="text-[#C9A227]" />;
    case "walnuts": return <Nut size={18} className="text-[#C9A227]" />;
    case "cashews": return <Nut size={18} className="text-[#C9A227]" />;
    case "dried-fruits": return <Grape size={18} className="text-[#C9A227]" />;
    case "dried-fig": return <Leaf size={18} className="text-[#C9A227]" />;
    case "dates": return <TreePine size={18} className="text-[#C9A227]" />;
    case "raisins": return <Grape size={18} className="text-[#C9A227]" />;
    case "apricots": return <Apple size={18} className="text-[#C9A227]" />;
    case "dry-prunes": return <Apple size={18} className="text-[#C9A227]" />;
    case "gift-box": return <Gift size={18} className="text-[#C9A227]" />;
    default: return <span className="text-base">{icon}</span>;
  }
};

export default function Sidebar({ isOpen, onClose, selectedCategory, onSelectCategory }: SidebarProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-80 max-w-[85vw] bg-[#111111] border-r border-[#C9A227]/20 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0072CE]/20 flex-shrink-0 bg-[#0F172A]">
          <div className="h-[38px] bg-white px-3 py-1.5 rounded-lg flex items-center justify-center">
            <img src="/biogen-logo.png" alt="Biogen Pharma" className="h-full w-auto object-contain" />
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#0072CE] transition-all duration-300"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Categories Content Container */}
        <div className="flex-1 py-6 px-4">
          
          {/* Section title */}
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-4 px-1">
            Shop Collections
          </span>

          {/* All Products shortcut card */}
          <button
            onClick={() => handleCategoryClick("all")}
            className={`w-full flex items-center gap-3.5 p-4 rounded-xl text-left transition-all duration-300 border mb-4 shadow-sm ${
              selectedCategory === "all"
                ? "bg-[#0072CE] border-[#0072CE] text-white font-extrabold"
                : "bg-[#F8F7F2] border-gray-200 text-gray-800 hover:border-[#0072CE]/40"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selectedCategory === "all" ? "bg-white/20" : "bg-white border border-gray-100"
            }`}>
              <ShoppingBag size={16} className={selectedCategory === "all" ? "text-white" : "text-[#0072CE]"} />
            </div>
            <div className="leading-tight">
              <span className="text-xs uppercase tracking-wider block font-bold">
                All Supplies
              </span>
              <span className="text-[9px] opacity-75">Browse entire range</span>
            </div>
          </button>

          {/* Categories list as Accordion Cards */}
          <div className="flex flex-col gap-2.5">
            {MEGA_MENU.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const isExpanded = expandedCat === cat.id;
              const hasSubs = cat.subcategories.length > 0;

              return (
                <div 
                  key={cat.id} 
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? "bg-[#181818] border-[#0072CE]/30 shadow-md" 
                      : "bg-[#F8F7F2] border-gray-200"
                  }`}
                >
                  {/* Parent Category Row (Min 48px target) */}
                  <div className="flex items-center justify-between min-h-[50px] pr-2">
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="flex-1 flex items-center gap-3.5 px-4 py-3 text-left group"
                    >
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CategoryIcon id={cat.id} icon={cat.icon} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wide transition-colors ${
                        isExpanded ? "text-white" : "text-gray-800 hover:text-[#0072CE]"
                      }`}>
                        {cat.name}
                      </span>
                    </button>

                    {/* Expand/Collapse Dropdown Arrow */}
                    {hasSubs && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCat(isExpanded ? null : cat.id);
                        }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isExpanded 
                            ? "text-[#0072CE] hover:bg-white/5" 
                            : "text-gray-400 hover:bg-black/5 hover:text-gray-700"
                        }`}
                        aria-label="Expand category options"
                      >
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                        />
                      </button>
                    )}
                  </div>

                  {/* Subcategories Panel */}
                  {hasSubs && isExpanded && (
                    <div className="bg-black/40 border-t border-[#0072CE]/10 py-1.5 px-3">
                      <div className="grid grid-cols-1 gap-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[11px] font-medium text-gray-400 hover:text-[#0072CE] hover:bg-white/5 rounded-lg transition-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0072CE]/40 flex-shrink-0" />
                            <span>{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-5 border-t border-[#0284C7]/10 flex-shrink-0 bg-[#0d0d0d] text-center">
          <p className="text-[9px] text-[#0284C7]/60 font-sans uppercase tracking-[0.2em]">
            Biogen Pharma • Healthcare Excellence
          </p>
        </div>

      </div>
    </div>
  );
}
