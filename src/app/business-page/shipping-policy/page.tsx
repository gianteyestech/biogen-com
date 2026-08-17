import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy - Ideal Dry Fruit",
  description: "Check delivery times, shipping costs, and Lahore same-day options for Ideal Dry Fruit orders.",
};

export default async function ShippingPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand, shipping } = siteConfig;
  const city = brand.address.split(",")[1]?.trim() || "Sargodha";

  return (
    <PolicyPageLayout title="Shipping Policy" siteConfig={siteConfig}>
      <p className="text-gray-500 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-lg text-gray-800">
        “Fast, Safe & Free—Premium Dry Fruits Delivered Nationwide”
      </p>

      <p>
        At <strong>{brand.name}</strong>, we take pride in delivering the finest dry fruits and nuts across Pakistan with speed, care, and transparency. Our delivery options are flexible and designed to fit your needs.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Delivery Charges</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Free Standard Delivery</strong> on all orders <strong>above Rs. {shipping.freeThreshold.toLocaleString()}</strong>.</li>
        <li>Orders <strong>below Rs. {shipping.freeThreshold.toLocaleString()}</strong> will incur a minimal shipping fee of <strong>Rs. {shipping.standardCost}</strong>, based on location.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Same-Day Delivery—Available in {city}</h2>
      <p>
        Customers in <strong>{city}</strong> can enjoy <strong>premium same-day delivery</strong> with the following exclusive benefits:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Receive your order the same day</strong> (for orders placed before 3:00 PM).</li>
        <li><strong>Open Parcel Policy:</strong> Check product quality <strong>before making payment</strong>.</li>
        <li>Pay <strong>only after verifying</strong> the item at your doorstep.</li>
        <li>Express delivery surcharges may apply for this premium service.</li>
      </ul>
      <p>
        To opt-in, please request it via WhatsApp/Call when placing your order.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Standard Delivery Timeframe</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>📦 <strong>1–3 business days</strong> in major cities (Lahore, Karachi, Islamabad, Rawalpindi, Sargodha, Faisalabad, etc.).</li>
        <li>📦 <strong>3–7 business days</strong> in smaller towns or remote areas.</li>
        <li>All shipments are handled by trusted courier partners, including <strong>Leopards Courier</strong>, <strong>TCS</strong>, and others.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Order Tracking</h2>
      <p>
        Once your order is dispatched, you will receive a <strong>tracking number</strong> by SMS or WhatsApp. You can monitor your parcel’s status in real time until delivery.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Important Notes</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Please provide an <strong>accurate address and active phone number</strong> for smooth delivery.</li>
        <li>Deliveries are made between <strong>10 AM and 7 PM</strong>, Monday to Saturday.</li>
        <li>Same-day delivery is subject to <strong>availability</strong> and <strong>cutoff times</strong>.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Need Help?</h2>
      <p>If you have any questions regarding delivery, same-day service, or tracking, our team is here to assist:</p>
      <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-1 mt-2">
        <p><strong>Address:</strong> {brand.address}</p>
        <p><strong>Phone:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
