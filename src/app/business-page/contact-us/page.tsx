import { getCMSSiteConfig } from "@/lib/cms";
import ContactUsClient from "./ContactUsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Biogen Pharma",
  description: "Contact Biogen Pharma for pharmaceutical inquiries, surgical supplies, institutional medical procurement, and distribution in The Gambia and Sierra Leone.",
};

export default async function ContactUsPage() {
  const siteConfig = await getCMSSiteConfig();
  return <ContactUsClient siteConfig={siteConfig} />;
}
