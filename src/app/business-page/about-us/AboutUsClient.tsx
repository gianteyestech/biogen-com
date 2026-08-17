"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone, Mail, MapPin, Clock, Truck, RotateCcw, Headphones, Tag, Send, Shield, Package, ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import CartSlider from "@/components/CartSlider";
import type { CMSSiteConfig } from "@/lib/cms-types";
import { getFooterLinkHref } from "@/lib/link-utils";

// Icon map for footer/features
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Truck, RotateCcw, Headphones, Tag, Shield, Package, Phone, Mail, MapPin, Clock,
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

interface AboutUsClientProps {
  siteConfig: CMSSiteConfig;
}

export default function AboutUsClient({ siteConfig }: AboutUsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { brand, footer, trustFeatures } = siteConfig;

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-sans antialiased">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

      {/* ─── BREADCRUMBS ───────────────────────────────────────────── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#C9A84C] font-semibold">About Us</span>
        </nav>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="global-container pb-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 pb-5 mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">About Us</h1>
            <p className="text-[#C9A84C] font-extrabold text-sm uppercase tracking-widest">{brand.tagline}</p>
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">
                Welcome to Ideal Dry Fruit – Pakistan’s Trusted Dry Fruit Marketplace
              </h2>
              <p>
                At <strong>Ideal Dry Fruit</strong>, we believe that healthy living begins with the finest natural ingredients. Our journey started in <strong>{brand.established}</strong> with a simple mission: to make premium-quality dry fruits, nuts, seeds, and natural products accessible to every household in Pakistan — fresh, pure, and just a click away.
              </p>
              <p>
                Today, we are not just a store; we are a <strong>complete dry fruit marketplace</strong>, connecting trusted growers and sellers from across the country to health-conscious customers who value quality and authenticity. With our cutting-edge website and delivery network, we’ve revolutionized the way people shop for dry fruits — offering <strong>convenience, trust, and freshness in every order</strong>.
              </p>
            </div>

            {/* ─── MESSAGE FROM THE CEO ───────────────────────────────────── */}
            <div className="bg-[#FFF8E7]/40 rounded-2xl p-6 sm:p-8 border border-[#C9A84C]/15 my-8 not-prose">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8 items-start">
                <div className="flex flex-col items-center text-center">
                  <div className="w-[180px] h-[240px] rounded-xl overflow-hidden border-2 border-[#C9A84C]/30 shadow-md relative bg-gray-100 flex-shrink-0">
                    <img 
                      src="/ceo.jpg" 
                      alt="Abubakar Faisal - CEO" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h4 className="font-sans text-sm font-extrabold text-gray-900 mt-3 mb-0.5">Abubakar Faisal</h4>
                  <p className="text-[10px] text-[#C9A84C] font-extrabold uppercase tracking-widest">CEO & Founder</p>
                </div>
                <div className="flex flex-col justify-center h-full">
                  <span className="text-3xl text-[#C9A84C] font-serif leading-none select-none">“</span>
                  <div className="text-gray-700 leading-relaxed italic -mt-2 space-y-3 text-sm">
                    <h3 className="text-lg font-black text-gray-900 not-italic mb-2">Message from the CEO</h3>
                    <p>
                      At <strong>Ideal Dry Fruit</strong>, our core philosophy is simple: we never compromise on quality. What began as a dedication to sharing the purest, natural ingredients of Pakistan has grown into a nationwide marketplace trusted by thousands of families.
                    </p>
                    <p>
                      Our platform is built on trust, transparency, and empowerment—supporting local farmers and verified sellers across regions while ensuring our customers receive hand-selected, hygienically packed, and premium-fresh dry fruits.
                    </p>
                    <p>
                      We thank you for choosing us as your wellness partner, and we pledge to continue delivering nature's finest, straight to your doorstep.
                    </p>
                  </div>
                  <span className="text-3xl text-[#C9A84C] font-serif leading-none select-none text-right -mt-2">”</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Vision</h3>
              <p>
                To become <strong>Pakistan’s #1 digital marketplace</strong> for dry fruits and natural products, where every seller can grow their business, and every customer can enjoy premium quality at the best value — anytime, anywhere.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>For Customers:</strong> Provide easy access to fresh, high-quality dry fruits through a seamless shopping experience.
                </li>
                <li>
                  <strong>For Sellers:</strong> Empower small and large-scale dry fruit sellers to reach a nationwide audience via our digital marketplace platform.
                </li>
                <li>
                  <strong>For Pakistan:</strong> Promote healthier eating habits and support local farmers, traders, and suppliers.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Why Choose Ideal Dry Fruit?</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Premium Quality Products:</strong> Every product listed on Ideal Dry Fruit is carefully selected from trusted sources. From <strong>crunchy almonds of Gilgit</strong> to <strong>juicy dates from Khairpur</strong>, we ensure top-notch freshness and taste.
                </li>
                <li>
                  <strong>Nationwide Seller Network:</strong> Our platform hosts multiple verified sellers — giving customers variety, price competition, and regional specialties, all in one place.
                </li>
                <li>
                  <strong>Online Ordering Convenience:</strong> With our user-friendly website, you can browse, compare, and order from anywhere — with just a few taps.
                </li>
                <li>
                  <strong>Secure Payments:</strong> We offer multiple secure payment options, including <strong>Cash on Delivery (COD)</strong>, credit/debit cards, and digital wallets.
                </li>
                <li>
                  <strong>Nationwide Delivery:</strong> Whether you live in a big city or a remote village, we deliver fresh dry fruits right to your doorstep.
                </li>
                <li>
                  <strong>Freshness Guaranteed:</strong> We follow strict quality control to ensure every product reaches you in <strong>perfect condition</strong>.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Product Range</h3>
              <p>We bring you <strong>everything dry fruit-related</strong> — and more:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Almonds, Cashews, Pistachios, Walnuts</li>
                <li>Dates (Ajwa, Medjool, Sukkari, and more)</li>
                <li>Raisins, Figs, Apricots, and other dried fruits</li>
                <li>Mixed Dry Fruit Gift Packs</li>
                <li>Seeds (Chia, Flax, Pumpkin, Sunflower)</li>
                <li>Herbal and Natural Products</li>
                <li>Honey and Organic Items</li>
                <li>Seasonal Products & Exclusive Offers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Empowering Sellers Through Technology</h3>
              <p>
                Our Seller Platform allows verified partners to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>List their products instantly through our digital catalog manager</li>
                <li>Manage inventory in real time</li>
                <li>Receive orders and track deliveries</li>
                <li>Access nationwide customers without heavy marketing costs</li>
                <li>Get payment settlements on time</li>
              </ul>
              <p>
                By <strong>digitizing the dry fruit trade</strong>, we’ve opened new doors for local businesses that once relied only on physical markets.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">The Ideal Dry Fruit Promise</h3>
              <p>
                When you shop with us, you’re not just buying a product — you’re investing in:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Freshness:</strong> Handpicked, carefully packed, and delivered fast</li>
                <li><strong>Authenticity:</strong> No low-grade or fake products allowed</li>
                <li><strong>Fair Pricing:</strong> Competitive rates through seller variety</li>
                <li><strong>Support for Local Economy:</strong> Every purchase supports farmers, traders, and small business owners across Pakistan</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainability & Social Impact</h3>
              <p>
                We believe in <strong>responsible sourcing</strong> — working closely with farmers who follow ethical practices. We also support:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Plastic Reduction:</strong> Encouraging eco-friendly packaging</li>
                <li><strong>Waste Reduction:</strong> Reducing food waste by optimized stock rotation</li>
                <li><strong>Community Growth:</strong> Training small sellers in digital business skills</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Satisfaction – Our Core Value</h3>
              <p>
                We know trust is earned, not given. That’s why we:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Offer <strong>easy returns & refunds</strong></li>
                <li>Maintain <strong>responsive customer care</strong></li>
                <li>Regularly check seller quality performance</li>
                <li>Run loyalty programs for our repeat customers</li>
              </ul>
            </div>

            <div className="bg-[#FFF8E7] rounded-xl p-5 border border-[#C9A84C]/20 mt-8">
              <h3 className="text-base font-extrabold text-gray-900 mb-3 uppercase tracking-wider">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                  <span><strong>Address:</strong> {brand.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <span><strong>Phone:</strong> {brand.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <span><strong>Email:</strong> {brand.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <WhatsAppIcon size={16} />
                  <span><strong>WhatsApp:</strong> <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">Chat Live</a></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST FEATURES BAR ──────────────────────────────────────── */}
      <div className="bg-white border-t border-b border-gray-200 py-6">
        <div className="global-container">
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
                <p className="flex items-start gap-2"><MapPin size={13} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />{brand.address}</p>
                <p className="flex items-center gap-2"><Phone size={13} className="text-[#C9A84C]" />{brand.phone}</p>
                <p className="flex items-center gap-2"><Mail size={13} className="text-[#C9A84C]" />{brand.email}</p>
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
            <p>© {new Date().getFullYear()} {brand.name}. All Rights Reserved.</p>
            <p>Delivering premium quality across Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={brand.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.4)" }}
        aria-label="Live Chat on WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
