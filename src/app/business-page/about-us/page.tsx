import { getCMSSiteConfig } from "@/lib/cms";
import AboutUsClient from "./AboutUsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Ideal Dry Fruit",
  description: "Learn more about Ideal Dry Fruit, Pakistan's premier selection of organic nuts, dry fruits, dates, and natural seeds since 1998.",
};

export default async function AboutUsPage() {
  const siteConfig = await getCMSSiteConfig();
  return <AboutUsClient siteConfig={siteConfig} />;
}
