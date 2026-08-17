import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy - Ideal Dry Fruit",
  description: "Check the 15-day return and exchange guarantee conditions for Ideal Dry Fruit orders.",
};

export default async function ReturnPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Return Policy" siteConfig={siteConfig}>
      <p className="text-gray-500 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <p className="font-semibold text-lg text-gray-800">
        “Freshness Guaranteed. Your Satisfaction, Our Promise.”
      </p>

      <p>
        At <strong>{brand.name}</strong>, we are committed to delivering high-quality products with integrity, care, and customer satisfaction. To ensure a worry-free shopping experience, we proudly offer a <strong>15-Day Return & Exchange Guarantee</strong>.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">15-Day Return & Exchange Policy</h2>
      <p>You are eligible to request a return or exchange within <strong>15 days</strong> of receiving your order if:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>The item was <strong>delivered damaged or defective</strong>.</li>
        <li>The <strong>seal was broken</strong> or packaging was tampered with upon arrival.</li>
        <li>You received the <strong>wrong product</strong>, quantity, or item not as described.</li>
        <li>The product <strong>does not match the details</strong> shown on our website.</li>
      </ul>
      <blockquote>
        <strong>Note:</strong> We do not accept returns for products that are correctly delivered and match their description, but are returned due to a change of mind or personal taste.
      </blockquote>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">How to Return or Exchange an Item</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li><strong>Contact our support team within 24 hours</strong> of receiving your order.</li>
        <li>Share your <strong>Order ID</strong>, along with <strong>photos or videos</strong> clearly showing the issue.</li>
        <li>Our <strong>Quality Control Team</strong> will verify and respond within <strong>48 hours</strong>.</li>
      </ol>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Product Pickup & Return Process</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Once approved, we will <strong>attempt to collect the item from your location</strong> via our courier rider within <strong>3–4 working days</strong>.</li>
        <li>If we are <strong>unable to arrange pickup</strong> (in certain remote areas), we will notify you accordingly.</li>
        <li>In that case, you will be requested to <strong>drop the product</strong> at your <strong>nearest Leopards Courier or TCS Courier hub</strong>.</li>
        <li>Our support team will guide you through the drop-off process and provide full instructions.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Refunds</h2>
      <p>Refunds are issued if the product is <strong>damaged, incorrect, or cannot be replaced</strong> or if the order is <strong>undeliverable within the committed delivery time</strong>.</p>
      <p><strong>Refund Method:</strong> Bank transfer or the original mode of payment.</p>
      <p><strong>Processing Time:</strong> 5–7 business days after the returned product is inspected and approved.</p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Order Cancellation</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>You can cancel the order <strong>before dispatch</strong> at no charge.</li>
        <li>If the order has already been shipped, you must return the item first. Return shipping charges may apply unless the issue is from our side.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Return Conditions</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Items must be returned in their <strong>original, unused condition</strong>, with <strong>complete packaging</strong>.</li>
        <li>Orders <strong>without valid proof (Order ID or delivery confirmation)</strong> will not be eligible.</li>
        <li>Return shipping is <strong>free</strong> if the mistake was on our part.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Nationwide Return Support</h2>
      <p>
        We offer full return and exchange support <strong>all across Pakistan</strong>. Whether you're in Lahore, Karachi, Islamabad, or any other city, our customer support will guide you throughout the process—either for pickup or courier drop-off.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Why Choose {brand.name}?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Hygienically Packed Premium Dry Fruits</li>
        <li>15-Day Hassle-Free Return Policy</li>
        <li>Fast Shipping Across Pakistan</li>
        <li>Secure Payments & Verified Products</li>
        <li>Professional & Friendly Support Team</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">Need Help?</h2>
      <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-1 mt-2">
        <p><strong>Address:</strong> {brand.address}</p>
        <p><strong>Phone:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
