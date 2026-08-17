import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Ideal Dry Fruit",
  description: "Terms and conditions governing the use of the Ideal Dry Fruit marketplace, website, and ordering system.",
};

export default async function TermsPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;
  const city = brand.address.split(",")[1]?.trim() || "Sargodha";

  return (
    <PolicyPageLayout title="Terms & Conditions" siteConfig={siteConfig}>
      <p className="text-gray-500 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      <p>
        Welcome to <strong>{brand.name}</strong>. By accessing or using our website, purchasing our products, or interacting with our services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before proceeding.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">1. General</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>These Terms & Conditions govern your use of our website, services, and products.</li>
        <li>{brand.name} reserves the right to update, modify, or change these terms at any time without prior notice. Continued use of our services constitutes your acceptance of the revised terms.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">2. Products & Orders</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>All products listed on our website are subject to availability.</li>
        <li>We strive to provide accurate product descriptions and images, but slight variations (such as packaging or seasonal availability) may occur.</li>
        <li>Once an order is placed, you will receive a confirmation via email, SMS, or WhatsApp.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">3. Pricing & Payment</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Prices are listed in Pakistani Rupees (PKR).</li>
        <li>We reserve the right to change prices at any time without prior notice.</li>
        <li>Payments can be made via Cash on Delivery (COD), Direct Bank Transfer, or Online Payment Gateways.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">4. Shipping & Delivery</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>We deliver across Pakistan.</li>
        <li>Delivery times may vary depending on your location and courier service.</li>
        <li>{brand.name} is not responsible for delays caused by courier services, weather conditions, or unforeseen circumstances.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">5. Returns & Refunds</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Due to the nature of our products (food/dry fruits), returns are generally not accepted unless the product delivered is defective, damaged, or incorrect.</li>
        <li>Any complaints must be reported within 24 hours of delivery with proof (images/videos).</li>
        <li>Approved refunds will be processed within 5 to 7 working days via the original payment method.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">6. Customer Responsibilities</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Customers must provide accurate delivery information. {brand.name} will not be liable for failed deliveries due to incorrect or incomplete addresses.</li>
        <li>Customers are responsible for checking product quality upon delivery and reporting any issues promptly.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">7. Intellectual Property</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>All content on our website, including logos, images, product descriptions, and branding, is the property of <strong>{brand.name}</strong> and may not be copied, reproduced, or used without prior permission.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">8. Limitation of Liability</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>{brand.name} shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of our products or services.</li>
        <li>All products should be stored properly as per guidelines. We are not responsible for spoilage due to improper storage by the customer.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">9. Privacy & Data Protection</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>We respect your privacy. All personal information collected will be used only for order processing, delivery, and customer service.</li>
        <li>We do not sell or share customer data with third parties, except as required by law.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">10. Governing Law</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>These Terms & Conditions are governed by the laws of Pakistan.</li>
        <li>Any disputes shall be subject to the exclusive jurisdiction of the courts in {city}.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">11. Contact Us</h2>
      <p>If you have any questions or concerns regarding these Terms & Conditions, please contact us:</p>
      <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-1 mt-2">
        <p><strong>Address:</strong> {brand.address}</p>
        <p><strong>Phone:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
