import { getCMSSiteConfig } from "@/lib/cms";
import FaqsClient from "./FaqsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) - Ideal Dry Fruit",
  description: "Find answers to common questions regarding dry fruit ordering, cash on delivery, shipping times across Pakistan, quality control, and return policies.",
};

export default async function FaqsPage() {
  const siteConfig = await getCMSSiteConfig();
  return <FaqsClient siteConfig={siteConfig} />;
}
