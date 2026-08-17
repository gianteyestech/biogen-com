"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import type { CMSPaymentMethod, CMSPaymentDetail } from "@/lib/cms-types";
import { ShoppingBag, Truck, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const FREE_DELIVERY_THRESHOLD = 3000;

export default function CheckoutClient() {
  const { cart, cartTotal, clearCart } = useCart();
  const paymentMethods = usePaymentMethods();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    paymentMethod: "cod",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const enabledMethods = paymentMethods.filter((m: CMSPaymentMethod) => m.enabled);
  const isFreeShipping = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : 250;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress || !formData.city) {
      setError("Please fill in all required shipping and contact details.");
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

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mb-4">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          Add your favorite dry fruits, nuts, or dates to the cart to proceed with checkout.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#0A0A0A] text-[#C9A84C] font-semibold rounded-xl text-sm hover:bg-black transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your order details below</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Customer Details & Shipping */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-[#C9A84C] text-xs flex items-center justify-center font-bold">1</span>
                Contact Information
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none text-sm text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number (Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="ali@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none text-sm text-gray-900"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Order receipt will be emailed if provided</p>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-[#C9A84C] text-xs flex items-center justify-center font-bold">2</span>
                Shipping Address
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none text-sm text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Complete Address *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="House number, Street name, Area, Sector..."
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none text-sm text-gray-900"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-[#C9A84C] text-xs flex items-center justify-center font-bold">3</span>
                Payment Method
              </h2>

              <div className="space-y-3">
                {enabledMethods.map((m: CMSPaymentMethod) => (
                  <label
                    key={m.id}
                    className={`block border rounded-xl p-4 cursor-pointer transition-all ${
                      formData.paymentMethod === m.id
                        ? "border-[#C9A84C] bg-[#C9A84C]/5 ring-1 ring-[#C9A84C]"
                        : "border-gray-200 hover:border-gray-300"
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
                          className="accent-[#C9A84C]"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{m.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                        </div>
                      </div>
                      <span className="text-xl">{m.icon}</span>
                    </div>

                    {formData.paymentMethod === m.id && m.details && m.details.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200/60 text-xs space-y-1 text-gray-700 bg-white p-3 rounded-lg">
                        {m.details.map((d: CMSPaymentDetail, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-semibold text-gray-500">{d.label}:</span>
                            <span className="font-mono font-bold text-gray-900">{d.value}</span>
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const price = item.product.prices[item.selectedWeight] || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.selectedWeight} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">
                        Rs. {(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck size={14} /> Shipping
                  </span>
                  <span className={isFreeShipping ? "text-green-600 font-bold" : "text-gray-900"}>
                    {isFreeShipping ? "FREE 🎉" : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span className="text-[#C9A84C]">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0A0A0A] hover:bg-black text-[#C9A84C] font-extrabold uppercase tracking-wider text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#C9A84C]" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    Complete Order <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                <ShieldCheck size={16} className="text-green-500" />
                <span>100% Guaranteed Original Fresh Dry Fruits</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
