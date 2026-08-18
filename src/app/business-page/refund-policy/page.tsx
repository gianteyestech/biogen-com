import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Refund & Credit Policy — Biogen Pharma",
  description: "Check the clinical credit and refund policy guidelines for Biogen Pharma institutional and healthcare orders.",
};

export default async function RefundPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Clinical Refund & Credit Policy" siteConfig={siteConfig}>
      <p className="text-slate-400 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-base text-slate-800">
        “Quality Assurance &amp; Institutional Reliability.”
      </p>
      
      <p>
        At <strong>{brand.name}</strong>, patient safety and institutional satisfaction are our highest priorities. While all batches are strictly certified under WHO-GMP standards prior to dispatch, we maintain transparent protocols for return credits, batch replacements, or institutional refunds where appropriate.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Requisition Refund &amp; Credit Eligibility</h2>
      <p>A healthcare facility or practitioner may be eligible for a credit adjustment or refund if:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>The shipment suffered verifiable <strong>cold-chain compromise, damaged seal, or transport defect</strong> at delivery.</li>
        <li>You received an <strong>incorrect formulation, dosage, or batch</strong>, and replacement supply is unavailable.</li>
        <li>Consignment failed to arrive within the agreed operational window due to logistics failure.</li>
        <li>The claim is reported within <strong>7 business days</strong> of delivery with batch photographic evidence.</li>
      </ul>
      <blockquote className="bg-blue-50 border-l-4 border-[#0072CE] p-3 rounded-r-lg my-4 text-xs text-slate-700">
        <strong>Note:</strong> Due to regulatory health requirements, opened medicines or unsealed sterile supplies cannot be refunded for change of requirement.
      </blockquote>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Verification &amp; Quality Audit</h2>
      <p>
        Refunds or account credits are processed after quality verification by our clinical compliance officers.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Settlement Method</h2>
      <p>Approved refunds are disbursed via:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Direct Institutional Wire Transfer</strong> to the registered hospital/clinic account, or</li>
        <li><strong>Facility Account Credit Note</strong> applicable towards subsequent medical supply orders.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Processing Window</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Refunds and credit notes are issued within <strong>3–5 business days</strong> following audit clearance.</li>
        <li>Written confirmation and revised commercial invoice will be emailed to your procurement desk.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">Clinical Support Desk</h2>
      <p>For urgent assistance regarding order reconciliation:</p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 mt-2">
        <p><strong>Facility Hub:</strong> {brand.address}</p>
        <p><strong>Hotline:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
