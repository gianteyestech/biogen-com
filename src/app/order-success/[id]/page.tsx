"use client";

import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.id;

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 font-sans antialiased">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 size={44} />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0072CE] font-bold text-xs rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> Requisition Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-xs text-slate-500 mt-2">
            Medical Requisition Tracking ID: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">#{orderNumber}</span>
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-3 border border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <Package size={18} className="text-[#0072CE] flex-shrink-0" />
            <span>Our pharmaceutical dispatch team is preparing your certified inventory with cold-chain safeguards.</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-[#0072CE] flex-shrink-0" />
            <span>Our institutional logistics coordinator will confirm delivery scheduling with your clinic.</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={`/track-order?id=${orderNumber}`}
            className="w-full py-3.5 bg-[#0072CE] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#005EA6] transition-colors shadow-sm"
          >
            Track Dispatch Status <ArrowRight size={16} />
          </Link>

          <Link
            href="/"
            className="block text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Return to Medical Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
