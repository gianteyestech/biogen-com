import { getCMSSiteConfig } from "@/lib/cms";
import FaqsClient from "./FaqsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) — Biogen Pharma",
  description: "Find answers to common questions regarding clinical requisitions, WHO-GMP certification, cold-chain delivery, bulk healthcare ordering, and return policies.",
};

export default async function FaqsPage() {
  const siteConfig = await getCMSSiteConfig();
  return <FaqsClient siteConfig={siteConfig} />;
}
