import { getCMSSiteConfig, getCMSPolicies } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const policies = await getCMSPolicies();
  const policy = policies.find(p => p.id === "terms-and-conditions");
  return {
    title: policy?.seoTitle || policy?.title || "Policy",
    description: policy?.seoDescription || "Policy",
  };
}

export default async function PolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const policies = await getCMSPolicies();
  const policy = policies.find(p => p.id === "terms-and-conditions");

  if (!policy) {
    return (
      <PolicyPageLayout title="Policy Not Found" siteConfig={siteConfig}>
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
