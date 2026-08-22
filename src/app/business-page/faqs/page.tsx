import { getCMSSiteConfig, getCMSFaqs } from "@/lib/cms";
import FaqsClient from "./FaqsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs & Support - Biogen Pharma",
  description: "Find answers regarding clinical orders, pharmaceutical certifications, cold-chain delivery, and institutional bulk supply.",
};

export default async function FaqsPage() {
  const [siteConfig, faqsData] = await Promise.all([
    getCMSSiteConfig(),
    getCMSFaqs(),
  ]);
  
  return <FaqsClient siteConfig={siteConfig} faqsData={faqsData} />;
}
