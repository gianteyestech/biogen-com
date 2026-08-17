"use client";

import { CheckCircle2, Package, Truck, ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.id;

  return (
    <div className="min-h-[80vh] bg-[#FAF9F6] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={48} />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] font-extrabold text-xs rounded-full uppercase tracking-wider mb-2">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Thank You For Your Order!</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your Order ID is <span className="font-mono font-bold text-gray-900">#{orderNumber}</span>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl text-left space-y-3 border border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <Package size={18} className="text-[#C9A84C]" />
            <span>We are packing your fresh dry fruits with extreme care.</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-[#C9A84C]" />
            <span>Our delivery partner will contact you before dispatch.</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={`/track-order?id=${orderNumber}`}
            className="w-full py-3.5 bg-[#0A0A0A] text-[#C9A84C] font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
          >
            Track Order Status <ArrowRight size={16} />
          </Link>

          <Link
            href="/"
            className="block text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
