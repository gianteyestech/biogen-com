"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import type { CMSPaymentMethod, CMSPaymentDetail } from "@/lib/cms-types";
import { ShoppingBag, Truck, ShieldCheck, AlertCircle, ArrowRight, Loader2, FileCheck2 } from "lucide-react";
import { CMSSiteConfig } from "@/lib/cms-types";
import Link from "next/link";

interface CheckoutClientProps {
  siteConfig?: CMSSiteConfig;
}

export default function CheckoutClient({ siteConfig }: CheckoutClientProps) {
  const { cart, cartTotal, clearCart, mounted } = useCart();
  const paymentMethods = usePaymentMethods();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    paymentMethod: "bank_transfer",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const enabledMethods = paymentMethods.filter((m: CMSPaymentMethod) => m.enabled);
  const freeDeliveryThreshold = siteConfig?.shipping?.freeThreshold || 500;
  const shippingFeeStandard = siteConfig?.shipping?.standardCost || 50;

  const isFreeShipping = cartTotal >= freeDeliveryThreshold;
  const shippingFee = isFreeShipping ? 0 : shippingFeeStandard;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress || !formData.city) {
      setError("Please fill in all required shipping and clinical contact details.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const itemsPayload = cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        weight: item.selectedWeight,
        quantity: item.quantity,
        price: item.product.prices[item.selectedWeight] || 0,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: itemsPayload,
          totalAmount: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit order. Please try again.");
      }

      clearCart();
      window.location.href = `/order-success/${data.orderNumber}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Loader2 className="w-8 h-8 text-[#0072CE] animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0072CE] flex items-center justify-center mb-4 border border-blue-100">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Your Requisition Cart is Empty</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Add medical products, diagnostic supplies, or surgical equipment to proceed with institutional procurement.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#0072CE] text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#005EA6] transition-colors shadow-sm"
        >
          Return to Medical Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="text-[11px] font-bold text-[#0072CE] uppercase tracking-wider">Biogen Pharma Procurement</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">Clinical Order &amp; Requisition Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">Provide facility dispatch details and verify settlement method</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Customer Details & Shipping */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0072CE] text-white text-xs flex items-center justify-center font-bold">1</span>
                Healthcare Institution &amp; Contact Person
              </h2>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John / Clinic Procurement Officer"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] outline-none text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (WhatsApp / Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+220 / +232 ..."
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] outline-none text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institutional Email (For Invoice)
                  </label>
                  <input
                    type="email"
                    placeholder="clinic@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] outline-none text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Facility / Delivery Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0072CE] text-white text-xs flex items-center justify-center font-bold">2</span>
                Facility Dispatch &amp; Delivery Address
              </h2>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City / Region *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banjul, Serekunda, Freetown, Kenema"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] outline-none text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Complete Hospital / Clinic Address *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Hospital name, Ward/Department, Street address, Landmark..."
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] outline-none text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0072CE] text-white text-xs flex items-center justify-center font-bold">3</span>
                Settlement &amp; Procurement Method
              </h2>

              <div className="space-y-3">
                {enabledMethods.map((m: CMSPaymentMethod) => (
                  <label
                    key={m.id}
                    className={`block border rounded-xl p-4 cursor-pointer transition-all ${
                      formData.paymentMethod === m.id
                        ? "border-[#0072CE] bg-blue-50/50 ring-1 ring-[#0072CE]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.id}
                          checked={formData.paymentMethod === m.id}
                          onChange={() => setFormData({ ...formData, paymentMethod: m.id })}
                          className="accent-[#0072CE]"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{m.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                        </div>
                      </div>
                      <span className="text-xl">{m.icon}</span>
                    </div>

                    {formData.paymentMethod === m.id && m.details && m.details.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-1.5 text-slate-700 bg-white p-3 rounded-lg">
                        {m.details.map((d: CMSPaymentDetail, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-semibold text-slate-500">{d.label}:</span>
                            <span className="font-mono font-bold text-slate-900">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6 space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Requisition Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const price = item.product.prices[item.selectedWeight] || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                      <div>
                        <p className="font-semibold text-slate-900">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.selectedWeight} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        ${(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Truck size={14} /> Logistics &amp; Shipping
                  </span>
                  <span className={isFreeShipping ? "text-emerald-600 font-bold" : "text-slate-900"}>
                    {isFreeShipping ? "FREE Priority 🎉" : `$${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="text-[#0072CE] text-base">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#0072CE] hover:bg-[#005EA6] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    Submitting Requisition...
                  </>
                ) : (
                  <>
                    Confirm &amp; Place Order <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-600 pt-2 font-medium">
                <ShieldCheck size={16} />
                <span>GMP &amp; ISO Standard Pharmaceutical Integrity Guaranteed</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
