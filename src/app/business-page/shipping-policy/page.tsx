import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cold-Chain Logistics & Shipping Policy — Biogen Pharma",
  description: "Certified cold-chain dispatch, delivery timelines, and institutional shipping protocols for Biogen Pharma.",
};

export default async function ShippingPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand, shipping } = siteConfig;

  return (
    <PolicyPageLayout title="Cold-Chain Logistics & Shipping Policy" siteConfig={siteConfig}>
      <p className="text-slate-400 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-base text-slate-800">
        “Certified Cold-Chain Distribution &amp; Expedited Healthcare Transit”
      </p>

      <p>
        At <strong>{brand.name}</strong>, pharmaceutical integrity is non-negotiable. We maintain end-to-end temperature-controlled distribution protocols across West Africa and international corridors to ensure clinical formulations reach hospitals, clinics, and pharmacies in optimal efficacy.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Freight &amp; Dispatch Tiers</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Free Priority Cold-Chain Logistics</strong> on all institutional requisitions <strong>above ${shipping.freeThreshold.toLocaleString()}</strong>.</li>
        <li>Orders <strong>below ${shipping.freeThreshold.toLocaleString()}</strong> incur a flat freight dispatch fee of <strong>${shipping.standardCost}</strong>.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Expedited Facility Delivery</h2>
      <p>
        Healthcare centers located within metropolitan zones benefit from direct expedited clinical courier transit:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Same-day or next-morning consignment dispatch</strong> for emergency medical requisitions placed before 2:00 PM.</li>
        <li><strong>Open-Consignment Audit:</strong> Receiving pharmacists inspect seal integrity and batch certificates before sign-off.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Standard Delivery Windows</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>📦 <strong>24–48 Hours</strong> for urban clinical hubs and district hospitals.</li>
        <li>📦 <strong>2–4 Business Days</strong> for regional clinics and community health centers.</li>
        <li>Insulated temperature-logged packaging protects biologics and sensitive tablets during transit.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Consignment Tracking</h2>
      <p>
        Upon dispatch from our central pharmaceutical warehouse, a unique <strong>BGP Requisition Tracking Number</strong> is generated with real-time route monitoring.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Logistics Desk Contact</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 mt-2">
        <p><strong>Central Warehouse:</strong> {brand.address}</p>
        <p><strong>Hotline:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
