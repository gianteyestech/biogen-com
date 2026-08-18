import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Requisition Cancellation Policy — Biogen Pharma",
  description: "Check the medical requisition and order cancellation guidelines for Biogen Pharma healthcare supplies.",
};

export default async function CancellationPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Requisition Cancellation Policy" siteConfig={siteConfig}>
      <p className="text-slate-400 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-base text-slate-800">
        “Seamless Clinical Procurement Management.”
      </p>

      <p>
        At <strong>{brand.name}</strong>, we recognize that clinical demand and hospital schedules may require adjustments. Our requisition cancellation protocols provide transparent guidelines for procurement officers.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Pre-Dispatch Requisition Amendments</h2>
      <p>
        A healthcare facility may cancel or modify an unfulfilled requisition <strong>without surcharge</strong> if the batch has not yet been packed into temperature-controlled cold-chain containers for courier dispatch.
      </p>
      <p className="mt-2 text-xs">
        To cancel an order before dispatch, contact our Clinical Desk with your <strong>Requisition ID (#BGP-XXXXXX)</strong>.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Post-Dispatch Protocols</h2>
      <p className="text-xs">
        Once a consignment is actively in transit with our cold-chain carrier, the shipment cannot be intercepted midway. The receiving medical officer can initiate a return upon facility delivery in accordance with our Quality Return Policy.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Refund &amp; Credit Reversal</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Cancelled pre-dispatch orders receive full refund or institutional credit within <strong>3–5 business days</strong>.</li>
        <li>Confirmation documentation is automatically dispatched to your accounts payable desk.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Clinical Procurement Desk</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 mt-2">
        <p><strong>Headquarters:</strong> {brand.address}</p>
        <p><strong>Hotline:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
