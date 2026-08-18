"use client";
import React, { useState } from "react";
import { X, ChevronDown, ChevronRight, Pill, Stethoscope, Eye, Bed, Apple, Sparkles } from "lucide-react";
import { MEGA_MENU } from "@/data/products";
import BiogenLogo from "./BiogenLogo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategoryIcon = ({ id, icon }: { id: string; icon: string }) => {
  switch (id) {
    case "medicines": return <Pill size={18} className="text-[#0072CE]" />;
    case "surgical-instruments": return <Stethoscope size={18} className="text-[#00A3E0]" />;
    case "eye-vision": return <Eye size={18} className="text-[#0072CE]" />;
    case "surgical-furniture": return <Bed size={18} className="text-[#00A3E0]" />;
    case "nutrition-supplements": return <Sparkles size={18} className="text-[#70BA28]" />;
    case "diagnostics": return <Stethoscope size={18} className="text-[#0072CE]" />;
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
    <div className="fixed inset-0 z-50 flex font-sans">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-80 max-w-[85vw] bg-[#0A0F1D] border-r border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto text-white">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0 bg-[#070B14]">
          <BiogenLogo variant="dark" size="sm" />
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0072CE] transition-all duration-300"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Categories Content Container */}
        <div className="flex-1 py-4 overflow-y-auto px-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Medical Departments
          </p>

          {/* All Supplies option */}
          <button
            onClick={() => handleCategoryClick("all")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-[#0072CE] text-white shadow-md shadow-blue-500/20"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-base">📦</span>
              <span>All Medical Supplies</span>
            </span>
            <ChevronRight size={14} className="opacity-60" />
          </button>

          {MEGA_MENU.map((category) => {
            const isSelected = selectedCategory === category.slug;
            const isExpanded = expandedCat === category.id;
            const hasSub = category.subcategories && category.subcategories.length > 0;

            return (
              <div key={category.id} className="rounded-xl overflow-hidden">
                <div 
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#0072CE] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon id={category.id} icon={category.icon} />
                    <span className="truncate">{category.name}</span>
                  </div>

                  {hasSub && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCat(isExpanded ? null : category.id);
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      aria-label="Toggle subcategories"
                    >
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#00A3E0]" : ""}`} 
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories Accordion */}
                {hasSub && isExpanded && (
                  <div className="pl-9 pr-2 py-2 space-y-1 bg-[#0E1526]/50 rounded-b-xl my-1 border-l-2 border-[#0072CE]/40 ml-4 animate-in slide-in-from-top-1 duration-200">
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-[#00A3E0] hover:bg-slate-800/40 transition-colors flex items-center justify-between group"
                      >
                        <span className="truncate">{sub.name}</span>
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#00A3E0]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer info */}
        <div className="p-4 border-t border-slate-800 bg-[#070B14] flex-shrink-0 text-xs">
          <div className="bg-[#0E1526] p-3 rounded-xl border border-slate-800 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A3E0]">Institutional Helpdesk</p>
            <p className="text-xs text-white font-semibold">+232 75 011616</p>
            <p className="text-[10px] text-slate-400">info@biogenpharma.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
