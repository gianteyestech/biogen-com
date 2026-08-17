import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy - Ideal Dry Fruit",
  description: "Check the order cancellation guidelines and timelines for Ideal Dry Fruit purchases.",
};

export default async function CancellationPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Cancellation Policy" siteConfig={siteConfig}>
      <p className="text-gray-500 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-lg text-gray-800">
        “Change of Mind? We’ve Got You Covered.”
      </p>

      <p>
        At <strong>{brand.name}</strong>, we understand that sometimes plans change. Whether you placed an order by mistake or simply changed your mind, our cancellation policy is designed to be flexible and fair.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">When Can You Cancel?</h2>
      
      <h3 className="text-sm font-bold text-gray-800 mt-3 mb-1">Before Dispatch</h3>
      <p>
        You can cancel your order <strong>free of charge</strong> if the item has <strong>not yet been dispatched</strong> from our warehouse.
      </p>
      <p>
        Simply contact us via phone or email with your <strong>order ID</strong>, and we’ll process the cancellation immediately.
      </p>

      <h3 className="text-sm font-bold text-gray-800 mt-3 mb-1">After Dispatch</h3>
      <p>
        If your order has already been <strong>shipped or is in transit</strong>, it <strong>cannot be canceled</strong>. However, you may still:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Request a return once the product is delivered.</li>
        <li>Shipping or return courier costs may apply (unless the error is from our side).</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Refund for Cancelled Orders</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>If canceled <strong>before dispatch</strong>, your payment will be fully refunded within <strong>3–5 business days</strong>.</li>
        <li>Refunds are processed via bank transfer or your original payment method.</li>
        <li>You’ll receive a confirmation once the refund is initiated.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Important Notes</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Orders paid through Cash on Delivery (COD) can also be canceled before dispatch.</li>
        <li>Custom, perishable, or personalized gift boxes may not be eligible for cancellation after order confirmation.</li>
        <li>Frequent cancellations may result in account review or restrictions.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Need Help Cancelling?</h2>
      <p>Our support team is available to assist with your cancellation requests:</p>
      <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-1 mt-2">
        <p><strong>Address:</strong> {brand.address}</p>
        <p><strong>Phone:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
