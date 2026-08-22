import { getCMSSiteConfig, getCMSPolicies } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const policies = await getCMSPolicies();
  const policy = policies.find(p => p.id === "privacy-policy");
  return {
    title: policy?.seoTitle || policy?.title || "Privacy Policy",
    description: policy?.seoDescription || "Privacy Policy",
  };
}

export default async function PrivacyPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const policies = await getCMSPolicies();
  const policy = policies.find(p => p.id === "privacy-policy");

  if (!policy) {
    return (
      <PolicyPageLayout title="Privacy Policy" siteConfig={siteConfig}>
        <p>Policy not found.</p>
      </PolicyPageLayout>
    );
  }

  return (
    <PolicyPageLayout title={policy.title} siteConfig={siteConfig}>
      <div 
        className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#0072CE] prose-p:text-slate-600 prose-li:text-slate-600"
        dangerouslySetInnerHTML={{ __html: policy.contentHtml }}
      />
    </PolicyPageLayout>
  );
}
