import CheckoutClient from "./CheckoutClient";
import { Metadata } from "next";
import { getCMSSiteConfig } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Clinical Procurement & Requisition Checkout — Biogen Pharma",
  description: "Complete your pharmaceutical and clinical requisition securely.",
};

export default async function CheckoutPage() {
  const siteConfig = await getCMSSiteConfig();
  return <CheckoutClient siteConfig={siteConfig} />;
}
