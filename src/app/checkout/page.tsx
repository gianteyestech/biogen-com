import CheckoutClient from "./CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Procurement & Requisition Checkout — Biogen Pharma",
  description: "Complete your pharmaceutical and clinical requisition securely.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
