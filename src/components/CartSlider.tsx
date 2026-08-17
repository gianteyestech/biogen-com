"use client";
import React, { useState } from "react";
import { X, Truck, Minus, Plus, Trash2, ShoppingBag, ChevronLeft, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePaymentMethods } from "@/context/PaymentMethodsContext";
import { BRAND } from "@/config/brand";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const FREE_DELIVERY_THRESHOLD = 5000;
const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

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
    // Auto-select first enabled method
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#FAFAFA] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

        {/* ─── STEP 1: CART ─────────────────────────────────────────── */}
        {step === "cart" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-lg font-bold text-gray-900">My Cart</h2>
                {cartCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-extrabold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                <X size={22} />
              </button>
            </div>

            {/* Free delivery progress bar */}
            <div className="bg-white px-5 pt-3 pb-4 border-b border-gray-100">
              {remaining > 0 ? (
                <p className="text-xs text-gray-600 mb-2 text-center">
                  Sirf <span className="font-bold text-gray-900">Rs. {remaining.toLocaleString()}</span> aur Free Delivery ke liye!
                </p>
              ) : (
                <p className="text-xs font-bold text-center mb-2" style={{ background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  🎉 You&apos;ve unlocked FREE delivery!
                </p>
              )}
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: goldGrad }} />
              </div>
              <div className="relative h-0">
                <div className="absolute -top-7 -translate-x-1/2 text-lg transition-all duration-500" style={{ left: `${Math.max(progressPct, 4)}%` }}>
                  🚚
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                  <ShoppingBag size={56} strokeWidth={1} />
                  <p className="font-sans text-sm">Your cart is empty</p>
                  <button onClick={handleClose} className="px-6 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider text-[#0D0D0D]" style={{ background: goldGrad }}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const price = item.product.prices[item.selectedWeight];
                  const lineTotal = price * item.quantity;
                  return (
                    <div key={`${item.product.id}-${item.selectedWeight}`} className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <div className="w-[80px] h-[80px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="font-sans text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{item.product.name}</p>
                        <p className="text-xs text-gray-400">{item.selectedWeight}</p>
                        <p className="text-sm font-extrabold text-gray-900">Rs. {lineTotal.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-auto">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)} className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors">
                              <Minus size={12} />
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-gray-900 bg-white min-w-[28px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)} className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors">
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.selectedWeight)} className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-gray-200 px-5 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-semibold text-gray-700">Subtotal</span>
                  <span className="font-sans text-lg font-extrabold text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 rounded-xl font-sans text-sm font-extrabold uppercase tracking-widest text-[#0D0D0D] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  style={{ background: goldGrad }}
                >
                  Proceed to Checkout →
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <ShoppingBag size={13} />
                  <button onClick={handleClose} className="underline hover:text-gray-600 transition-colors">Continue Shopping</button>
                  {cartTotal < FREE_DELIVERY_THRESHOLD && (
                    <>
                      <span className="text-gray-200">|</span>
                      <span className="flex items-center gap-1"><Truck size={12} /> +Rs. 250 shipping</span>
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
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep("cart")} className="text-gray-400 hover:text-gray-700 transition-colors p-1 -ml-1">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="font-sans text-lg font-bold text-gray-900">Select Payment</h2>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                <X size={22} />
              </button>
            </div>

            {/* Order summary strip */}
            <div className="bg-[#111] px-5 py-3 flex justify-between items-center border-b border-white/5">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Order Total</p>
                <p className="text-white font-extrabold text-lg">
                  Rs. {(cartTotal >= FREE_DELIVERY_THRESHOLD ? cartTotal : cartTotal + 250).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Shipping</p>
                <p className={`text-sm font-bold ${cartTotal >= FREE_DELIVERY_THRESHOLD ? "text-green-400" : "text-gray-300"}`}>
                  {cartTotal >= FREE_DELIVERY_THRESHOLD ? "FREE 🎉" : "Rs. 250"}
                </p>
              </div>
            </div>

            {/* Payment method list */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-4">
                How would you like to pay?
              </p>

              {enabledMethods.length === 0 ? (
                <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-red-400 font-semibold">No payment methods configured.</p>
                  <p className="text-[10px] text-red-400/60 mt-1">Please contact the store admin.</p>
                </div>
              ) : (
                enabledMethods.map((method) => {
                  const isSelected = selectedMethodId === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`w-full text-left rounded-2xl border-2 transition-all p-4 ${
                        isSelected
                          ? "border-[#C9A84C] bg-[#FFF8E7]"
                          : "border-gray-200 bg-white hover:border-[#C9A84C]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{method.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                            {method.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>

                          {/* Show details when selected */}
                          {isSelected && method.details.length > 0 && (
                            <div className="mt-3 space-y-1.5 bg-[#111] rounded-xl p-3">
                              {method.details.map((d, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-400 font-semibold">{d.label}</span>
                                  <span className="text-white font-bold font-mono">{d.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          isSelected ? "border-[#C9A84C] bg-[#C9A84C]" : "border-gray-300"
                        }`}>
                          {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              {selectedMethodId === "bank_transfer" && (
                <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3">
                  <p className="text-xs text-blue-300 font-semibold">📌 After placing your order via WhatsApp, transfer the amount to the account above and send the payment screenshot.</p>
                </div>
              )}
              {(selectedMethodId === "jazzcash" || selectedMethodId === "easypaisa") && (
                <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                  <p className="text-xs text-purple-300 font-semibold">📌 After placing your order via WhatsApp, send the payment to the mobile number above and share the confirmation screenshot.</p>
                </div>
              )}
            </div>

            {/* Confirm footer */}
            <div className="bg-white border-t border-gray-200 px-5 py-4 space-y-3">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl font-sans text-sm font-extrabold uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ background: "#C9A84C" }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setStep("cart")}
                className="w-full py-2.5 rounded-xl font-sans text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
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
