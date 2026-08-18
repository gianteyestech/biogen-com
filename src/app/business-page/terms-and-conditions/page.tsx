import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Terms & Conditions — Biogen Pharma",
  description: "Terms and conditions governing pharmaceutical supply, medical procurement, and ordering via Biogen Pharma.",
};

export default async function TermsPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Institutional Terms & Conditions" siteConfig={siteConfig}>
      <p className="text-slate-400 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      <p>
        Welcome to <strong>{brand.name}</strong>. By accessing our portal, ordering pharmaceutical supplies, or interacting with our clinical services, your facility agrees to comply with and be bound by the following Institutional Terms and Conditions.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">1. Regulatory Compliance &amp; Standards</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>All products supplied by {brand.name} adhere to WHO-GMP and ISO 9001:2015 quality manufacturing and storage protocols.</li>
        <li>Procuring parties must ensure valid healthcare practitioner licensing or institutional authority where required by local health authorities.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">2. Formulations &amp; Requisitions</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>All pharmaceutical items, medical devices, and surgical consumables are subject to active batch availability.</li>
        <li>Batch certificates of analysis (CoA) are available upon request for institutional clinical consignments.</li>
        <li>Upon order submission, a formal requisition confirmation is issued via email and Biogen Chat.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">3. Commercial Pricing &amp; Settlement</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Prices are denominated in USD ($) or approved regional settlement equivalents.</li>
        <li>Settlement is accepted through Official Bank Transfer, Institutional Net Invoicing, or Pay on Delivery where verified.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">4. Cold-Chain &amp; Logistics Dispatch</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Consignments requiring temperature-sensitive management are dispatched via certified cold-chain insulated transit.</li>
        <li>Transit timeframes are coordinated directly with facility receiving departments.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">5. Returns, Quality Claims &amp; Recall Procedures</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Any packaging anomaly, batch discrepancy, or damaged consignment must be filed within 7 business days.</li>
        <li>In the event of a manufacturer batch recall, {brand.name} provides immediate quarantine and credit replacement.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">6. Contact &amp; Governance</h2>
      <p>For inquiries regarding regulatory documentation or commercial terms:</p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 mt-2">
        <p><strong>Headquarters:</strong> {brand.address}</p>
        <p><strong>Hotline:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
