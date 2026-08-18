"use client";
import React, { useState } from "react";
import { X, Truck, Minus, Plus, Trash2, ShoppingBag, ChevronLeft, Check, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import { BRAND } from "@/config/brand";

const FREE_DELIVERY_THRESHOLD = BRAND.shipping.freeThreshold || 500;
const SHIPPING_COST = BRAND.shipping.standardCost || 50;

export default function CartSlider() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const paymentMethods = usePaymentMethods();
  const enabledMethods = paymentMethods.filter((m) => m.enabled);

  const [step, setStep] = useState<"cart" | "payment">("cart");
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const progressPct = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);

  // Reset to cart step when panel closes
  const handleClose = () => {
    setIsCartOpen(false);
    setStep("cart");
    setSelectedMethodId("");
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    if (enabledMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(enabledMethods[0].id);
    }
    setStep("payment");
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    window.location.href = "/checkout";
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-slate-50 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

        {/* ─── STEP 1: CART ─────────────────────────────────────────── */}
        {step === "cart" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0072CE] flex items-center justify-center font-bold">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-none">Medical Requisition</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Biogen Pharma Order Desk</p>
                </div>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#0072CE] text-white text-[10px] font-extrabold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {/* Free Logistics Progress Bar */}
            <div className="bg-white px-6 pt-3 pb-4 border-b border-slate-100 shadow-xs">
              {remaining > 0 ? (
                <p className="text-xs text-slate-600 mb-2 text-center">
                  Add <span className="font-bold text-[#0072CE]">${remaining.toLocaleString()}</span> more for <span className="font-bold text-emerald-600">Free Priority Logistics</span>!
                </p>
              ) : (
                <p className="text-xs font-bold text-center mb-2 text-emerald-600 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} /> You have unlocked FREE Priority Shipping!
                </p>
              )}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#00A3E0] to-[#0072CE]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 py-16">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag size={32} strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-700 text-sm">Your medical cart is empty</p>
                    <p className="text-xs text-slate-400 mt-1">Browse pharmaceutical products & equipment.</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6] transition-colors shadow-sm"
                  >
                    Explore Supplies
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const price = item.product.prices[item.selectedWeight] || 0;
                  const lineTotal = price * item.quantity;
                  return (
                    <div key={`${item.product.id}-${item.selectedWeight}`} className="flex gap-3.5 bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
                      <div className="w-[72px] h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 p-1 border border-slate-100">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-xs text-slate-800 line-clamp-2 leading-snug">{item.product.name}</p>
                          <span className="inline-block mt-0.5 text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.selectedWeight}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                          <p className="text-sm font-extrabold text-[#0072CE]">${lineTotal.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 bg-white min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-slate-200 px-6 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Requisition Subtotal</span>
                    <p className="text-xs text-slate-400">Taxes calculated at checkout</p>
                  </div>
                  <span className="text-xl font-extrabold text-slate-900">${cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 rounded-xl font-sans text-sm font-bold tracking-wide text-white bg-[#0072CE] hover:bg-[#005EA6] shadow-lg shadow-blue-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout →
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <button onClick={handleClose} className="underline hover:text-slate-600 transition-colors">Continue Browsing</button>
                  {cartTotal < FREE_DELIVERY_THRESHOLD && (
                    <>
                      <span className="text-slate-200">•</span>
                      <span className="flex items-center gap-1 text-slate-500"><Truck size={12} /> +${SHIPPING_COST} standard shipping</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── STEP 2: PAYMENT SELECTION ────────────────────────────── */}
        {step === "payment" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep("cart")} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-base font-bold text-slate-900">Select Settlement Method</h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {/* Order summary strip */}
            <div className="bg-[#0A0F1D] px-6 py-3.5 flex justify-between items-center text-white">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Payable</p>
                <p className="text-white font-extrabold text-lg">
                  ${(cartTotal >= FREE_DELIVERY_THRESHOLD ? cartTotal : cartTotal + SHIPPING_COST).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Logistics</p>
                <p className={`text-xs font-bold ${cartTotal >= FREE_DELIVERY_THRESHOLD ? "text-emerald-400" : "text-slate-300"}`}>
                  {cartTotal >= FREE_DELIVERY_THRESHOLD ? "FREE Priority" : `+$${SHIPPING_COST}`}
                </p>
              </div>
            </div>

            {/* Payment method list */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                Approved Payment &amp; Procurement Methods
              </p>

              {enabledMethods.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-800 font-semibold">Standard checkout enabled.</p>
                  <p className="text-[10px] text-amber-600 mt-1">Direct invoice &amp; transfer available.</p>
                </div>
              ) : (
                enabledMethods.map((method) => {
                  const isSelected = selectedMethodId === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`w-full text-left rounded-xl border-2 transition-all p-4 ${
                        isSelected
                          ? "border-[#0072CE] bg-blue-50/50"
                          : "border-slate-200 bg-white hover:border-[#0072CE]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{method.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-xs sm:text-sm ${isSelected ? "text-[#0072CE]" : "text-slate-900"}`}>
                            {method.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>

                          {/* Show details when selected */}
                          {isSelected && method.details.length > 0 && (
                            <div className="mt-3 space-y-1.5 bg-slate-900 rounded-lg p-3 text-white">
                              {method.details.map((d, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                  <span className="text-slate-400 font-medium">{d.label}</span>
                                  <span className="text-white font-bold font-mono">{d.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          isSelected ? "border-[#0072CE] bg-[#0072CE]" : "border-slate-300"
                        }`}>
                          {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Confirm footer */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 space-y-3">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl font-sans text-sm font-bold tracking-wide text-white bg-[#0072CE] hover:bg-[#005EA6] shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                Complete Requisition Checkout
              </button>
              <button
                onClick={() => setStep("cart")}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
              >
                <ChevronLeft size={13} /> Back to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
