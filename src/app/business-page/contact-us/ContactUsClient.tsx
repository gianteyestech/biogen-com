"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles, ChevronRight, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import CartSlider from "@/components/CartSlider";
import type { CMSSiteConfig } from "@/lib/cms-types";
import { getFooterLinkHref } from "@/lib/link-utils";

interface ContactUsClientProps {
  siteConfig: CMSSiteConfig;
}

export default function ContactUsClient({ siteConfig }: ContactUsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Order Inquiry",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const { brand, footer } = siteConfig;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;
    setSubmitted(true);
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

      {/* ── BREADCRUMBS ── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#C9A227] font-semibold">Contact Us</span>
        </nav>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="global-container mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#111111] p-8 md:p-12 text-white shadow-xl border border-[#C9A227]/30">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#C9A227] font-sans text-xs font-bold uppercase tracking-[0.25em] block mb-2">
              WE ARE HERE TO HELP YOU
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-wide mb-3">
              Get in Touch with Ideal Dry Fruit
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              Have questions about our premium dry fruit boxes, custom bulk orders, or your delivery? Reach out to our customer care team anytime.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const chatBtn = document.querySelector('button[aria-label="Live Customer Support"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
                className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#B8922B] text-black text-xs font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:scale-105 uppercase tracking-wider"
              >
                <MessageSquare size={16} />
                <span>Start Web Live Chat</span>
              </button>
              {brand.showPhone && brand.phone && (
                <a
                  href={`tel:${brand.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 bg-[#222222] hover:bg-black text-white text-xs font-bold px-5 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:scale-105 border border-gray-800"
                >
                  <Phone size={16} />
                  <span>Call {brand.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── DIRECT CONTACT CARDS ── */}
      <div className="global-container mb-10">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${brand.showPhone && brand.phone ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 sm:gap-6`}>
          
          {/* Card 1: Phone (if enabled) */}
          {brand.showPhone && brand.phone && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#C9A227]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] mb-4 group-hover:scale-110 transition-transform">
                <Phone size={22} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone Helpline</span>
              <h3 className="font-extrabold text-sm text-gray-900 mb-1">{brand.phone}</h3>
              <p className="text-xs text-gray-500">Available Mon – Sat (9:00 AM – 9:00 PM)</p>
            </div>
          )}

          {/* Card 2: Web Live Chat */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#C9A227]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Website Live Support</span>
            <h3 className="font-extrabold text-sm text-gray-900 mb-1">Instant Support</h3>
            <p className="text-xs text-gray-500">Click Live Chat icon bottom right anytime</p>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#C9A227]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] mb-4 group-hover:scale-110 transition-transform">
              <Mail size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email Inquiries</span>
            <h3 className="font-extrabold text-sm text-gray-900 mb-1">{brand.email}</h3>
            <p className="text-xs text-gray-500">We respond to email within 2 hours</p>
          </div>

          {/* Card 4: Store Location */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#C9A227]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Main Store Location</span>
            <h3 className="font-bold text-xs text-gray-900 mb-1 line-clamp-2">{brand.address}</h3>
            <p className="text-xs text-gray-500">Sargodha, Punjab, Pakistan</p>
          </div>

        </div>
      </div>

      {/* ── FORM & STORE INFO SECTION ── */}
      <div className="global-container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest block mb-1">Send a Message</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">We&apos;d Love to Hear From You</h2>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in duration-300">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Thank you for reaching out to {brand.name}. Our team has received your message and will get back to you shortly on your provided contact details.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", phone: "", email: "", subject: "Order Inquiry", message: "" });
                  }}
                  className="bg-[#111111] hover:bg-[#C9A227] text-white hover:text-black text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C9A227] bg-white"
                    >
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="Wholesale / Corporate Bulk Gifting">Wholesale / Corporate Bulk Gifting</option>
                      <option value="Delivery & Tracking">Delivery & Tracking</option>
                      <option value="Quality & Feedback">Quality & Feedback</option>
                      <option value="Other Query">Other Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 h-12 bg-[#111111] hover:bg-[#C9A227] text-white hover:text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                >
                  <Send size={15} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Info & Corporate Box */}
          <div className="space-y-6">
            
            {/* Corporate & Wholesale Box */}
            <div className="bg-[#111111] rounded-2xl p-6 border border-[#C9A227]/30 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#C9A227] mb-2">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bulk & Corporate Gifting</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Custom Luxury Gift Boxes</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Planning corporate events, wedding giveaways, or Eid bulk orders? We craft tailored dry fruit gift boxes with custom branding.
              </p>
              <a
                href={brand.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-white text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                <span>Inquire Corporate Rates</span>
                <ChevronRight size={14} />
              </a>
            </div>

            {/* Quick FAQs Banner */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Looking for Quick Answers?</h4>
                  <p className="text-xs text-gray-500">Check our frequently asked questions</p>
                </div>
              </div>
              <Link
                href="/business-page/faqs"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#F8F7F2] text-gray-800 text-xs font-bold py-3 px-4 rounded-xl border border-gray-200 transition-colors"
              >
                <span>Browse FAQs Page</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Store Operational Hours */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[#C9A227]" />
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Store Operating Hours</h4>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Monday – Saturday</span>
                  <span className="font-semibold text-gray-900">9:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Sunday</span>
                  <span className="font-semibold text-gray-900">11:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Online Orders</span>
                  <span className="font-semibold text-green-600">24/7 Active</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a1a] text-white pt-12 pb-6">
        <div className="global-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-3.5 mb-4 select-none">
                <div className="w-[78px] h-[78px] rounded-full overflow-hidden border-2 border-[#C9A227]/40 p-0.5 bg-[#F8F7F2] shadow-md flex items-center justify-center flex-shrink-0">
                  <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
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
                <p className="flex items-start gap-2">{brand.address}</p>
                <p className="flex items-center gap-2">{brand.phone}</p>
                <p className="flex items-center gap-2">{brand.email}</p>
              </div>
            </div>

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
            </div>
          </div>

          <div className="border-t border-[#C9A84C] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
            <p>© {new Date().getFullYear()} {brand.name}. All Rights Reserved.</p>
            <p>Delivering premium quality across Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
