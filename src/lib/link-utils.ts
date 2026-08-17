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
  if (norm.includes("track") || norm.includes("order")) return "/";
  if (norm.includes("shop") || norm.includes("product") || norm.includes("collection") || norm.includes("new")) return "/";
  if (norm.includes("home")) return "/";
  return "/";
}
