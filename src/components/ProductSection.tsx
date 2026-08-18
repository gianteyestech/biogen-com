"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  onViewAll?: () => void;
}

export default function ProductSection({ title, products, onViewAll }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sans text-xl font-extrabold text-slate-900 uppercase tracking-wide">
            {title}
          </h2>
          <div className="mt-1.5 h-1 w-16 rounded-full bg-[#0072CE]" />
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0072CE] transition-colors hover:underline"
          >
            View All <ArrowRight size={14} className="text-[#0072CE]" />
          </button>
        )}
      </div>

      {/* 4-column product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
