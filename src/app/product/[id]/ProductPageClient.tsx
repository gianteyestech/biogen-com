"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, ShoppingBag, ChevronRight, Minus, Plus, CheckCircle2, 
  Package, Truck, ShieldCheck, FileText, Send, MessageSquare, BookOpen 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BRAND } from "@/config/brand";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import ProductCard from "@/components/ProductCard";
import { getSavePercent } from "@/lib/cms-types";
import type { CMSProduct, CMSSiteConfig, CMSCategory, CMSMegaMenuEntry } from "@/lib/cms-types";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface ProductPageClientProps {
  product: CMSProduct | null;
  related: CMSProduct[];
  siteConfig?: CMSSiteConfig;
  categories?: CMSCategory[];
  megaMenu?: CMSMegaMenuEntry[];
}

export default function ProductPageClient({ product, related, siteConfig, categories, megaMenu }: ProductPageClientProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addedNotice, setAddedNotice] = useState(false);

  const isCatalogue = siteConfig?.siteMode === "catalogue";
  const hidePrices = siteConfig?.hidePricesInCatalogue ?? false;
  const quoteCtaText = siteConfig?.catalogueInquiryText || "Request Official Quotation & CoA";

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          siteConfig={siteConfig}
        />
        <CartSlider />
        <div className="global-container py-24 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Medical Product Not Found</h1>
          <p className="text-xs text-slate-500 mb-6">The requested pharmaceutical item or surgical equipment does not exist.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6]">
            ← Return to Medical Catalog
          </Link>
        </div>
      </div>
    );
  }

  const weights = Object.keys(product.prices);
  const activeWeight = selectedWeight || weights[0] || "";
  const currentPrice = product.prices[activeWeight] || 0;
  const originalPrice = product.originalPrices?.[activeWeight];
  const savePercent = getSavePercent(product, activeWeight);

  const handleWhatsAppInquiry = () => {
    const total = currentPrice * quantity;
    const msg = [
      `🏥 *Institutional Quotation Request — Biogen Pharma*`,
      ``,
      `• *Product:* ${product.name}`,
      product.genericName ? `• *Formulation / Generic:* ${product.genericName}` : ``,
      product.brand ? `• *Manufacturer / Principal:* ${product.brand}` : ``,
      product.registrationNo ? `• *Registration No:* ${product.registrationNo}` : ``,
      activeWeight ? `• *Packaging / Presentation:* ${activeWeight}` : ``,
      `• *Requisition Quantity:* ${quantity} Units`,
      !hidePrices && currentPrice > 0 ? `• *Unit Estimated Price:* $${currentPrice.toLocaleString()}` : ``,
      !hidePrices && currentPrice > 0 ? `• *Estimated Consignment:* $${total.toLocaleString()}` : ``,
      ``,
      `Please provide formal institutional quotation invoice, Certificate of Analysis (CoA), and cold-chain transit schedule for our healthcare facility.`,
    ].filter(Boolean).join("\n");
    window.open(`${BRAND.contact.whatsappBase}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleLiveChatInquiry = () => {
    const chatBtn = document.querySelector('button[aria-label="Live Customer Support"]') as HTMLButtonElement | null;
    if (chatBtn) {
      chatBtn.click();
    } else {
      handleWhatsAppInquiry();
    }
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
      />
      <CartSlider />

      <div className="global-container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0072CE] transition-colors">Catalog</Link>
          <ChevronRight size={13} />
          <span className="text-[#0072CE] font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Catalogue Mode Banner */}
        {isCatalogue && (
          <div className="mb-6 p-4 rounded-xl bg-blue-950/60 border border-blue-500/30 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0072CE] text-white">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">B2B Institutional Medical Catalogue Mode</p>
                <p className="text-[11px] text-slate-300">Submit requests for formal quotations, tenders, Batch Certificates of Analysis (CoA), and hospital volume pricing.</p>
              </div>
            </div>
            <button
              onClick={handleWhatsAppInquiry}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0072CE] hover:bg-[#005EA6] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <MessageSquare size={13} /> Quick Tender Quote
            </button>
          </div>
        )}

        {/* Product Card Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Product Image Area */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 aspect-square max-h-[480px] p-6 flex items-center justify-center">
                {!isCatalogue && savePercent && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-white text-xs font-bold bg-[#70BA28] shadow-sm">
                    Save {savePercent}%
                  </div>
                )}
                {isCatalogue && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-[#00A3E0] bg-blue-950/90 border border-blue-500/30 text-[10px] font-extrabold uppercase shadow-sm">
                    B2B CATALOGUE ITEM
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-xs border border-white/20 text-white px-2.5 py-1 rounded-md flex items-center gap-1.5 text-[10px] font-bold tracking-wider">
                  <ShieldCheck size={13} className="text-[#00A3E0]" />
                  <span>GMP CERTIFIED</span>
                </div>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Product Details & Actions */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-[#0072CE] uppercase tracking-wider">Medical Grade &amp; Certified</span>
                  <h1 className="font-sans text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1">{product.name}</h1>
                </div>
                {product.inStock && (
                  <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
                    <CheckCircle2 size={12} /> IN STOCK
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">({product.reviewsCount} verified hospital &amp; clinical reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                {isCatalogue && hidePrices ? (
                  <div>
                    <span className="text-2xl font-black text-[#0072CE]">Inquire for Institutional Pricing</span>
                    <p className="text-xs text-slate-400 mt-0.5">Custom bulk pricing &amp; tenders tailored to healthcare facility requirements</p>
                  </div>
                ) : (
                  <>
                    <span className="text-3xl font-black text-[#0072CE]">${(currentPrice ?? 0).toLocaleString()}</span>
                    {originalPrice && !isCatalogue && (
                      <span className="text-base text-slate-400 line-through font-medium">${originalPrice.toLocaleString()}</span>
                    )}
                    {isCatalogue && (
                      <span className="text-xs font-semibold text-slate-400">/ estimated unit price</span>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {product.description}
                </p>
              )}

              {/* Clinical & Regulatory Specifications Table */}
              <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-100 flex flex-col gap-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 pb-2 border-b border-blue-100">
                  <ShieldCheck size={14} className="text-[#0072CE]" />
                  Clinical &amp; Regulatory Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.genericName && (
                    <div className="flex justify-between sm:justify-start gap-2 py-1 border-b border-blue-50">
                      <span className="text-slate-500 font-medium">Active Formulation:</span>
                      <span className="text-slate-900 font-bold">{product.genericName}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between sm:justify-start gap-2 py-1 border-b border-blue-50">
                      <span className="text-slate-500 font-medium">Principal Manufacturer:</span>
                      <span className="text-slate-900 font-bold">{product.brand}</span>
                    </div>
                  )}
                  {product.registrationNo && (
                    <div className="flex justify-between sm:justify-start gap-2 py-1 border-b border-blue-50">
                      <span className="text-slate-500 font-medium">Regulatory Approval:</span>
                      <span className="text-[#0072CE] font-bold">{product.registrationNo}</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:justify-start gap-2 py-1 border-b border-blue-50">
                    <span className="text-slate-500 font-medium">Quality Compliance:</span>
                    <span className="text-emerald-700 font-bold">cGMP / ISO Certified</span>
                  </div>
                  {product.status && (
                    <div className="flex justify-between sm:justify-start gap-2 py-1">
                      <span className="text-slate-500 font-medium">Market Status:</span>
                      <span className="text-slate-900 font-semibold">{product.status}</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:justify-start gap-2 py-1">
                    <span className="text-slate-500 font-medium">Supply Scope:</span>
                    <span className="text-slate-900 font-semibold">Institutional &amp; Wholesale</span>
                  </div>
                </div>
              </div>

              {/* Packaging / Variant Selection */}
              {weights.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                    Select Packaging / Presentation Size:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {weights.map((w) => {
                      const sp = getSavePercent(product, w);
                      const isActive = activeWeight === w;
                      const priceForWeight = product.prices[w] ?? 0;
                      return (
                        <button
                          key={w}
                          onClick={() => setSelectedWeight(w)}
                          className={`relative flex flex-col items-start px-4 py-2.5 rounded-xl border-2 transition-all text-xs font-semibold ${
                            isActive
                              ? "border-[#0072CE] bg-blue-50/50 text-[#0072CE]"
                              : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                          }`}
                        >
                          {!isCatalogue && sp && (
                            <span className="absolute -top-2 -right-1.5 text-[8px] font-extrabold px-1.5 py-0.5 rounded text-white bg-[#70BA28]">
                              -{sp}%
                            </span>
                          )}
                          <span>{w}</span>
                          {!hidePrices && (
                            <span className="text-[11px] font-bold mt-0.5">${priceForWeight.toLocaleString()}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">Requisition Quantity:</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="px-4 py-2 font-bold text-xs text-slate-900 bg-white min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Ready for Fast Institutional Dispatch
                  </span>
                </div>
              </div>

              {/* Notice */}
              {addedNotice && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={16} /> Added {quantity}x {product.name} ({activeWeight}) to your medical requisition!
                </div>
              )}

              {/* Action Buttons: E-Commerce vs Catalogue Mode */}
              {isCatalogue ? (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6] transition-all active:scale-98 shadow-md flex items-center justify-center gap-2"
                  >
                    <FileText size={16} /> {quoteCtaText}
                  </button>
                  <button
                    onClick={handleLiveChatInquiry}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} className="text-[#0072CE]" /> Biogen Live Chat Consultation
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToCart(product, activeWeight, quantity);
                      setIsCartOpen(true);
                      setAddedNotice(true);
                      setTimeout(() => setAddedNotice(false), 3000);
                    }}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 text-white hover:bg-black transition-all active:scale-98 shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} /> Add to Requisition
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-98 shadow-md flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon size={16} /> WhatsApp Bulk Quote
                  </button>
                </div>
              )}

              {/* Institutional Assurance */}
              <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-3 gap-3 border border-slate-200 text-center">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={18} className="text-[#0072CE]" />
                  <span className="text-[10px] font-bold text-slate-700">GMP &amp; ISO Certified</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck size={18} className="text-[#0072CE]" />
                  <span className="text-[10px] font-bold text-slate-700">Cold-Chain Logistics</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FileText size={18} className="text-[#0072CE]" />
                  <span className="text-[10px] font-bold text-slate-700">COA &amp; Batch Traceability</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Related Medical Supplies</h2>
              <Link href="/" className="text-xs font-bold uppercase tracking-wider text-[#0072CE] hover:underline flex items-center gap-1">
                View Catalog <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  siteMode={siteConfig?.siteMode || "ecommerce"} 
                  hidePrices={siteConfig?.hidePricesInCatalogue}
                  catalogueInquiryText={siteConfig?.catalogueInquiryText}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer siteConfig={siteConfig || ({
        brand: {
          name: BRAND.name,
          tagline: BRAND.tagline,
          logoUrl: "/logo.png",
          address: BRAND.contact.addressHead,
          phone: BRAND.contact.formattedNumber,
          email: BRAND.contact.email,
        }
      } as any)} />
    </div>
  );
}
