import { getCMSSiteConfig } from "@/lib/cms";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Ideal Dry Fruit",
  description: "Learn how Ideal Dry Fruit collects, protects, uses, and handles customer personal data and privacy settings.",
};

export default async function PrivacyPolicyPage() {
  const siteConfig = await getCMSSiteConfig();
  const { brand } = siteConfig;

  return (
    <PolicyPageLayout title="Privacy Policy" siteConfig={siteConfig}>
      <p className="text-gray-500 text-xs">Effective Date: {new Date().toLocaleDateString()}</p>
      <p>
        At <strong>{brand.name}</strong>, your privacy matters to us. This Privacy Policy explains how we collect, use, share, and protect your personal information when you interact with our services, including our website, mobile interface, or offline support.
      </p>
      <p>
        By using our services, you agree to the practices described in this policy. We are committed to protecting your information and complying with all applicable privacy laws.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">1. What Information We Collect</h2>
      <p>We collect only what’s necessary to deliver, improve, and personalize our services.</p>
      <h3 className="text-sm font-bold text-gray-800 mt-3 mb-1">1.1 Personal Information</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Contact Details:</strong> Name, email, phone number, billing and shipping address.</li>
        <li><strong>Payment Information:</strong> Transaction identifiers and payment methods (processed securely through trusted gateway providers).</li>
        <li><strong>Account Information:</strong> Username, encrypted password, and preferences.</li>
        <li><strong>Support Details:</strong> Records of communications and tickets sent during support requests.</li>
      </ul>
      <h3 className="text-sm font-bold text-gray-800 mt-3 mb-1">1.2 Non-Personal & Technical Information</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Device Data:</strong> IP address, device type, browser model, operating system, and usage behaviors.</li>
        <li><strong>Analytics:</strong> Aggregated anonymous stats to measure user patterns.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">2. How We Collect Information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Directly from you:</strong> When you register, sign up, buy products, or contact our support team.</li>
        <li><strong>Automatically:</strong> Through analytics tools, session caching, and cookies.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Process and ship your orders and manage returns or refunds.</li>
        <li>Send tracking updates, verification messages, and newsletter alerts (if opted in).</li>
        <li>Improve our shop navigation, response speeds, and overall UI quality.</li>
        <li>Maintain security, block fraud, and meet legal auditing requirements.</li>
      </ul>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">4. Cookies & Tracking Technologies</h2>
      <p>
        We use cookies to analyze web traffic, remember items added to your cart, and save configuration settings for your convenience. You can disable cookies in your browser settings, though doing so might affect cart functionality.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">5. When We Share Your Information</h2>
      <p>
        We do not sell customer data. We share only necessary details with trusted partners who process deliveries (TCS, Leopards Courier) or handle payments securely.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">6. How We Keep Your Data Safe</h2>
      <p>
        We employ advanced secure sockets layer (SSL) encryption, secure databases, and regular security checks to keep customer data safe. You are responsible for keeping your login credentials confidential.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">7. Account & Data Deletion</h2>
      <p>
        We respect your right to delete your personal profile and account. You can request account deletion at any time by contacting our support team at <strong>{brand.email}</strong>. Once verified, your account and associated delivery addresses will be scrubbed, excluding billing files needed for tax/audit compliance.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">8. Children's Privacy</h2>
      <p>
        Our services are not target-oriented for minors below 16 years of age. We do not intentionally acquire information from children.
      </p>

      <h2 className="text-base font-extrabold text-gray-900 mt-6 mb-2">9. Contact Us</h2>
      <p>For privacy queries, contact our Data Protection Coordinator:</p>
      <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-1 mt-2">
        <p><strong>Address:</strong> {brand.address}</p>
        <p><strong>Phone:</strong> {brand.phone}</p>
        <p><strong>Email:</strong> {brand.email}</p>
      </div>
    </PolicyPageLayout>
  );
}
