/**
 * CMS Types — shared between client and server.
 * No Node.js imports here.
 */

export interface CMSProduct {
  id: string;
  name: string;
  urduName: string;
  category: string;
  description: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  prices: Record<string, number>;
  originalPrices: Record<string, number>;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  badge: string;
  brand?: string;
  genericName?: string;
  registrationNo?: string;
  status?: string;
  catalogueMode?: boolean;
  images?: string[];
  hasAuthenticPhoto?: boolean;
}

export interface CMSActivityLog {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "Product" | "Category" | "HeroSlide" | "PaymentMethod" | "SiteConfig" | "PagesConfig";
  entityId: string;
  details: string;
  timestamp: string;
  user?: string;
}


export interface CMSCategory {
  id: string;
  name: string;
  icon: string;
}

export interface CMSSubCategory {
  id: string;
  name: string;
}

export interface CMSMegaMenuEntry {
  id: string;
  name: string;
  icon: string;
  img?: string;
  subcategories: CMSSubCategory[];
}

export interface CMSCircleCat {
  id: string;
  name: string;
  img?: string;
  image?: string;
  icon?: string;
  tag?: string;
  shortName?: string;
  color?: string;
}

export interface CMSCategoriesFile {
  categories: CMSCategory[];
  megaMenu?: CMSMegaMenuEntry[];
  circleCats: CMSCircleCat[];
}

export interface CMSHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
  img: string;
  promoText: string;
  promoLabel: string;
  ctaText: string;
}

export interface CMSPaymentDetail {
  label: string; // e.g. "Bank Name", "Account Number"
  value: string; // e.g. "HBL", "1234567890"
}

export interface CMSPaymentMethod {
  id: string;          // "cod" | "bank_transfer" | "jazzcash" | "easypaisa"
  enabled: boolean;
  label: string;       // "Cash on Delivery (COD)"
  description: string; // "Pay cash when your order arrives"
  icon: string;        // emoji e.g. "💵"
  details: CMSPaymentDetail[];
}

export interface CMSPromoBanner {
  id: string;
  bg: string;
  color: string;
  label: string;
  sub: string;
  catId: string;
}

export interface CMSTrustFeature {
  id: string;
  icon: string;
  title: string;
  sub: string;
}

export interface CMSLocation {
  id: string;
  label: string;        // e.g. "Head Office — The Gambia"
  country: string;      // e.g. "The Gambia"
  flag: string;         // emoji flag, e.g. "🇬🇲"
  address: string;
  phone?: string;
  email?: string;
  mapUrl?: string;      // optional Google Maps link
  enabled: boolean;     // show/hide in footer
}

export interface CMSSiteConfig {
  siteMode?: "ecommerce" | "catalogue"; // "ecommerce" (default) or "catalogue" (B2B Showcase & Request Quote)
  hidePricesInCatalogue?: boolean;     // if true, hides price numbers in catalogue mode
  catalogueInquiryText?: string;       // custom CTA button label, e.g. "Request Official Quotation"
  catalogueAction?: "chat" | "whatsapp" | "contact"; // default action when requesting quote
  brand: {
    name: string;
    tagline: string;
    established: number;
    logoUrl: string;
    address?: string;    // legacy — kept for backward compat, use locations[] instead
    email: string;
    phone: string;
    whatsapp: string;
    showPhone?: boolean;
  };
  locations?: CMSLocation[];  // multi-location offices/hubs
  shipping: {
    freeThreshold: number;
    standardCost: number;
    freeThresholdDisplay: string;
  };
  promoBanners: CMSPromoBanner[];
  trustFeatures: CMSTrustFeature[];
  promoCode: {
    code: string;
    discountPercent: number;
    minOrderAmount: number;
    description: string;
  };
  footer: {
    quickLinks: string[];
    moreLinks: string[];
    social: { label: string; href: string }[];
    newsletterTitle: string;
    newsletterSub: string;
    copyrightText?: string;
  };
  seo: {
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
    keywords: string;
  };
  paymentMethods: CMSPaymentMethod[];
}

export interface CMSPageSection {
  id: string;
  title: string;
  type: "new" | "featured" | "category" | "circles" | "top-selling" | "deal" | "mini-lists" | "trust-features";
  categoryId: string;
  visible: boolean;
  order: number;
}

export interface CMSPagesConfig {
  sections: CMSPageSection[];
}

// ─── Pure utility helpers (no Node.js) ───────────────────────────────────────
export function filterProductsByCategory(products: CMSProduct[], categoryId: string): CMSProduct[] {
  if (categoryId === "all") return products;
  if (categoryId === "new") return products.filter((p) => p.isNew);
  if (categoryId === "featured") return products.filter((p) => p.featured);
  return products.filter((p) => p.category === categoryId);
}

export function getSavePercent(product: CMSProduct, weight: string): number | null {
  const orig = product.originalPrices?.[weight];
  if (!orig) return null;
  const curr = product.prices[weight];
  return Math.round(((orig - curr) / orig) * 100);
}
