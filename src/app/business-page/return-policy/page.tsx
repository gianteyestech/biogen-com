import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quality Guarantee & Return Protocol — Biogen Pharma",
  description: "Check the clinical return and batch verification protocol for Biogen Pharma healthcare supplies.",
};

export default async function ReturnPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Quality Guarantee & Return Protocol" siteConfig={siteConfig}>
      <p className="text-slate-400 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-base text-slate-800">
        “WHO-GMP Certified Integrity. Clinical Safety First.”
      </p>

      <p>
        At <strong>{brand.name}</strong>, we are committed to delivering pharmaceuticals and hospital supplies that adhere to rigorous pharmacopeial standards. We provide clear quality audit and return protocols for healthcare institutions.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Quality Claim Protocol</h2>
      <p>A healthcare facility may request a return or batch exchange if:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>The item arrived with <strong>damaged outer seals or packaging</strong>.</li>
        <li>Consignment temperature indicators show a <strong>cold-chain temperature excursion</strong>.</li>
        <li>You received an <strong>incorrect dosage form, item code, or quantity</strong>.</li>
        <li>The delivered supply does not match the specifications on the clinical purchase order.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">How to File a Return Claim</h2>
      <ol className="list-decimal pl-5 space-y-2 text-xs">
        <li><strong>Notify our team via Biogen Chat or phone within 7 days</strong> of delivery.</li>
        <li>Provide the <strong>Requisition ID (#BGP-XXXXXX)</strong>, batch number, and high-resolution photo/log verification.</li>
        <li>Our <strong>Quality Assurance Unit</strong> reviews the claim within <strong>24–48 hours</strong>.</li>
      </ol>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Quarantine &amp; Collection</h2>
      <p className="text-xs">
        Upon return authorization, our logistics partner collects the segregated consignment for laboratory inspection and immediate batch replacement.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Why Procure from {brand.name}?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>WHO-GMP &amp; ISO 9001:2015 certified formulations</li>
        <li>Dedicated Cold-Chain Temperature Controlled Logistics</li>
        <li>Direct Batch Certificates of Analysis (CoA)</li>
        <li>Institutional Procurement Support &amp; Volume Discounts</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Biogen Support &amp; Contact</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 mt-2">
        <p><strong>Headquarters:</strong> {brand.address}</p>
        <p><strong>Hotline:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
