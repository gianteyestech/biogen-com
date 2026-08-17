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

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

export default function ProductSection({ title, products, onViewAll }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sans text-xl font-extrabold text-[#F5ECD7] uppercase tracking-wide">
            {title}
          </h2>
          <div className="mt-1.5 h-0.5 w-16 rounded-full" style={{ background: goldGrad }} />
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors hover:underline"
            style={{ background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            View All <ArrowRight size={13} className="text-[#C9A84C]" />
          </button>
        )}
      </div>

      {/* 4-column product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
