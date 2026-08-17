import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { PaymentMethodsProvider } from "@/context/PaymentMethodsContext";
import { getCMSSiteConfig } from "@/lib/cms";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Biogen Pharma | Pharmaceuticals, Surgical Instruments & Medical Supplies",
  description: "Biogen Pharma is a trusted provider of high-quality pharmaceuticals, precision surgical instruments, eye care, and hospital equipment in West Africa and globally.",
};

import LiveChatWidget from "@/components/LiveChatWidget";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getCMSSiteConfig();
  const paymentMethods = siteConfig.paymentMethods ?? [];

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F0F0F0] text-gray-900 font-sans" suppressHydrationWarning>
        <CartProvider>
          <PaymentMethodsProvider paymentMethods={paymentMethods}>
            {children}
            <LiveChatWidget />
          </PaymentMethodsProvider>
        </CartProvider>
      </body>
    </html>
  );
}

