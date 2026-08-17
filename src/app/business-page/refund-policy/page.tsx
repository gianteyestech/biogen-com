import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Ideal Dry Fruit",
  description: "Check the Refund Policy guidelines for Ideal Dry Fruit orders including processing timelines and method options.",
};

export default async function RefundPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Refund Policy" siteConfig={siteConfig}>
      <p className="text-gray-500 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-lg text-gray-800">
        “We Refund What We Can’t Fix.”
      </p>
      
      <p>
        At <strong>{brand.name}</strong>, your satisfaction is our top priority. While we always strive to resolve any issues through replacement or exchange, we also understand that refunds may be necessary in certain situations. That’s why we’ve designed a clear, transparent, and customer-friendly refund policy.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Refund Eligibility</h2>
      <p>You may be eligible for a <strong>full or partial refund</strong> if:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>The product was <strong>damaged, defective, or expired</strong> at the time of delivery.</li>
        <li>You received the <strong>wrong item or quantity</strong>, and a replacement is <strong>not available</strong>.</li>
        <li>We are <strong>unable to deliver your order</strong> within the promised delivery window (usually 3–5 working days).</li>
        <li>The return request is approved and the item is <strong>returned in original condition</strong>.</li>
      </ul>
      <blockquote>
        <strong>Note:</strong> Refunds are generally <strong>not issued</strong> for products that are correctly delivered and match their description, but are returned due to a change of mind or personal dislike.
      </blockquote>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Return Required for Refund</h2>
      <p>
        Refunds are typically processed <strong>after the returned item is received and inspected</strong> by our quality team. To return the item:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>You can return the product via our rider (where available).</li>
        <li>Or drop the item at your nearest Leopards or TCS courier hub (our support team will provide pre-paid dispatch codes).</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Refund Method</h2>
      <p>Approved refunds will be issued via:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Bank Transfer</strong> directly to your account, or</li>
        <li><strong>Original Payment Method</strong> (e.g., credit/debit card, Easypaisa, or JazzCash).</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Processing Time</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Refunds are processed within <strong>5–7 business days</strong> after item verification at our Lahore warehouse.</li>
        <li>You will be notified via SMS or email once your refund is initiated.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Important Conditions</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Products must be returned in <strong>unused, original condition</strong> with all outer tags and seals intact.</li>
        <li>No refunds without a valid <strong>Order ID</strong> and proof of issue (e.g., photos/videos).</li>
        <li>The refund amount may be adjusted in case of missing parts or damaged returns.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Need Help?</h2>
      <p>Our customer care team is always ready to assist you with any refund-related queries:</p>
      <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-1 mt-2">
        <p><strong>Address:</strong> {brand.address}</p>
        <p><strong>Phone:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
