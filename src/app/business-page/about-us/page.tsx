import { getCMSSiteConfig } from "@/lib/cms";
import AboutUsClient from "./AboutUsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Biogen Pharma",
  description: "Learn more about Biogen Pharma, a trusted provider of high-quality pharmaceuticals, surgical instruments, and medical supplies in West Africa and globally.",
};

export default async function AboutUsPage() {
  const siteConfig = await getCMSSiteConfig();
  return <AboutUsClient siteConfig={siteConfig} />;
}
