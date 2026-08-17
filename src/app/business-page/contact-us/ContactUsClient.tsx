"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  Stethoscope
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";
import { BRAND } from "@/config/brand";
import { CMSSiteConfig } from "@/lib/cms-types";

interface ContactUsClientProps {
  siteConfig: CMSSiteConfig;
}

export default function ContactUsClient({ siteConfig }: ContactUsClientProps) {
  const brand = siteConfig.brand || {
    name: BRAND.name,
    tagline: BRAND.tagline,
    phone: BRAND.contact.formattedNumber,
    email: BRAND.contact.email,
    address: BRAND.contact.addressHead,
    whatsapp: BRAND.contact.whatsappBase,
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Pharmaceutical Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* ── HEADER & NAVIGATION ── */}
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CartSlider />

      {/* ── BREADCRUMBS ── */}
      <div className="global-container pt-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#0284C7] font-semibold">Contact Us</span>
        </nav>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="global-container mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] p-8 md:p-12 text-white shadow-xl border border-[#0284C7]/30">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#38BDF8] font-sans text-xs font-bold uppercase tracking-[0.25em] block mb-2">
              DEDICATED CLINICAL &amp; INSTITUTIONAL SUPPORT
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-wide mb-3">
              Get in Touch with Biogen Pharma
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              Have questions regarding our pharmaceutical inventory, precision surgical instruments, bulk hospital supplies, or international logistics? Our medical team is here to assist.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const chatBtn = document.querySelector('button[aria-label="Live Customer Support"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
                className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:scale-105 uppercase tracking-wider"
              >
                <MessageSquare size={16} />
                <span>Start Medical Live Chat</span>
              </button>
              <a
                href={`tel:${BRAND.contact.rawNumber}`}
                className="inline-flex items-center gap-2 bg-[#1E293B] hover:bg-black text-white text-xs font-bold px-5 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:scale-105 border border-gray-700"
              >
                <Phone size={16} />
                <span>Call {BRAND.contact.formattedNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── DIRECT CONTACT CARDS ── */}
      <div className="global-container mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Phone */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#0284C7]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-4 group-hover:scale-110 transition-transform">
              <Phone size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Direct Phone / WhatsApp</span>
            <h3 className="font-extrabold text-sm text-gray-900 mb-1">{BRAND.contact.formattedNumber}</h3>
            <p className="text-xs text-gray-500">Mon – Sat (10:00 AM – 4:00 PM)</p>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#0284C7]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-4 group-hover:scale-110 transition-transform">
              <Mail size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Official Email</span>
            <h3 className="font-extrabold text-sm text-gray-900 mb-1">{BRAND.contact.email}</h3>
            <p className="text-xs text-gray-500">Institutional &amp; Patient Inquiries</p>
          </div>

          {/* Card 3: Head Office The Gambia */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#0284C7]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Head Office (The Gambia)</span>
            <h3 className="font-bold text-xs text-gray-900 mb-1">{BRAND.contact.addressHead}</h3>
            <p className="text-xs text-[#0284C7] font-semibold mt-1">WestField Hub</p>
          </div>

          {/* Card 4: 2nd Branch Sierra Leone */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start hover:border-[#0284C7]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] mb-4 group-hover:scale-110 transition-transform">
              <Building2 size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">2nd Branch (Sierra Leone)</span>
            <h3 className="font-bold text-xs text-gray-900 mb-1">{BRAND.contact.addressBranch}</h3>
            <p className="text-xs text-[#0284C7] font-semibold mt-1">Free Town Center</p>
          </div>

        </div>
      </div>

      {/* ── FORM & MEDICAL ADVISORY SECTION ── */}
      <div className="global-container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-widest block mb-1">Medical &amp; Wholesale Inquiry</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">Send Us a Message</h2>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-in fade-in duration-300">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Thank you for contacting Biogen Pharma. Our medical procurement desk has received your request and will get back to you promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", phone: "", email: "", subject: "Pharmaceutical Inquiry", message: "" });
                  }}
                  className="bg-[#0F172A] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name / Doctor / Clinic <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Robert / Grace Hospital"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+232..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
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
                      placeholder="clinic@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0284C7] bg-white"
                    >
                      <option value="Pharmaceutical Inquiry">Pharmaceuticals &amp; Medicines</option>
                      <option value="Surgical Instruments">Surgical Instruments &amp; Tools</option>
                      <option value="Hospital Furniture">Hospital Beds &amp; Furniture</option>
                      <option value="Eye Care & Loupes">Surgical Loupes &amp; Eye Protection</option>
                      <option value="Institutional Wholesale Procurement">Institutional / Wholesale Procurement</option>
                      <option value="General Query">General Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Message / Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Specify product requirements, quantities, or clinical specifications..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 h-12 bg-[#0284C7] hover:bg-[#0369A1] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                >
                  <Send size={15} />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Institutional Box */}
          <div className="space-y-6">
            {/* Institutional Box */}
            <div className="bg-[#0F172A] rounded-2xl p-6 border border-[#0284C7]/30 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#38BDF8] mb-2">
                <Stethoscope size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional &amp; Clinic Supply</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Bulk Hospital Procurement</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Supplying hospitals, clinics, diagnostic centers, and pharmacies across West Africa with guaranteed genuine stock and cold-chain integrity.
              </p>
              <a
                href={BRAND.contact.whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#38BDF8] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                <span>Institutional WhatsApp Desk</span>
                <ChevronRight size={14} />
              </a>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[#0284C7]" />
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Branch Operating Hours</h4>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Monday – Tuesday</span>
                  <span className="font-semibold text-gray-900">10:00 AM – 4:00 PM (By Appt.)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Wednesday – Saturday</span>
                  <span className="font-semibold text-gray-900">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Sunday</span>
                  <span className="font-semibold text-red-500">Closed</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Emergency Orders</span>
                  <span className="font-semibold text-emerald-600">24/7 Dispatch</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
