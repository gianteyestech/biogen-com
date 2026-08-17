import CheckoutClient from "./CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Ideal Dry Fruit",
  description: "Complete your dry fruit purchase securely.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
