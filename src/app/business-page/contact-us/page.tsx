import { getCMSSiteConfig } from "@/lib/cms";
import ContactUsClient from "./ContactUsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Ideal Dry Fruit",
  description: "Contact Ideal Dry Fruit for inquiries, bulk corporate gifting orders, customer support, and store locations across Pakistan.",
};

export default async function ContactUsPage() {
  const siteConfig = await getCMSSiteConfig();
  return <ContactUsClient siteConfig={siteConfig} />;
}
