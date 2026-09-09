export function getFooterLinkHref(label: string): string {
  const norm = label.toLowerCase().trim();
  if (norm.includes("terms")) return "/business-page/terms-and-conditions";
  if (norm.includes("privacy")) return "/business-page/privacy-policy";
  if (norm.includes("refund")) return "/business-page/refund-policy";
  if (norm.includes("return")) return "/business-page/return-policy";
  if (norm.includes("cancellation") || norm.includes("cancel")) return "/business-page/cancellation-policy";
  if (norm.includes("shipping") || norm.includes("delivery")) return "/business-page/shipping-policy";
  if (norm.includes("about")) return "/business-page/about-us";
  if (norm.includes("faq")) return "/business-page/faqs";
  if (norm.includes("contact")) return "/business-page/contact-us";
  if (norm.includes("track")) return "/track-order";
  if (norm.includes("medicine")) return "/?category=medicines";
  if (norm.includes("surgical") && norm.includes("instrument")) return "/?category=surgical-instruments";
  if (norm.includes("furniture")) return "/?category=surgical-furniture";
  if (norm.includes("eye")) return "/?category=eye-vision";
  if (norm.includes("vitamin") || norm.includes("nutrition")) return "/?category=nutrition-supplements";
  if (norm.includes("all product") || norm.includes("catalog")) return "/?category=all";
  if (norm.includes("home")) return "/";
  return "/";
}
