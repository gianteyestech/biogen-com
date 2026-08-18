import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Privacy & Data Governance Policy — Biogen Pharma",
  description: "Learn how Biogen Pharma secures healthcare practitioner and institutional procurement data.",
};

export default async function PrivacyPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Institutional Privacy & Data Policy" siteConfig={siteConfig}>
      <p className="text-slate-400 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      <p>
        At <strong>{brand.name}</strong>, confidentiality, patient privacy, and institutional data security are central to our operations. This policy governs how we safeguard clinical requisition data and institutional records.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">1. Information Governance</h2>
      <p>We process only authorized institutional and procurement details:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Facility Identifiers:</strong> Hospital/Clinic name, procurement officer contact, delivery address, license verification.</li>
        <li><strong>Requisition Data:</strong> Consigned batches, pharmaceutical quantities, delivery notes, and transaction invoices.</li>
        <li><strong>Clinical Communications:</strong> Inquiries submitted via our encrypted Clinical Helpdesk.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">2. Data Utilization &amp; Purpose</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Coordinate batch fulfillment and cold-chain route logistics.</li>
        <li>Transmit batch certificates, invoices, and regulatory compliance updates.</li>
        <li>Ensure pharmacovigilance and batch recall traceability.</li>
      </ul>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">3. Data Security &amp; Encryption</h2>
      <p>
        All communications and database records are safeguarded by enterprise 256-bit TLS/SSL encryption and restricted access controls. We strictly prohibit selling or sharing clinical data with unauthorized commercial entities.
      </p>

      <h2 className="text-base font-bold text-slate-900 mt-6 mb-2">4. Data Governance Officer</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 mt-2">
        <p><strong>Headquarters:</strong> {brand.address}</p>
        <p><strong>Hotline:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
