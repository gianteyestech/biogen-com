/**
 * products.ts — Type re-exports for backward compatibility.
 * Runtime product data comes from src/lib/cms.ts (server) or
 * is passed as props from server components.
 *
 * Components that need types should import from here.
 * Components that need runtime data should use @/lib/cms (server-only) or
 * receive data as props from server components.
 */

// Re-export types from cms-types (safe for client and server)
export type { CMSProduct as Product } from "@/lib/cms-types";
export { filterProductsByCategory as getProductsByCategory, getSavePercent } from "@/lib/cms-types";

import categoriesData from "@/cms/categories.json";

// Dynamic exports from categories.json
export const CATEGORIES = categoriesData.categories;
export const MEGA_MENU = categoriesData.megaMenu;

// Empty array — runtime data comes from getCMSProducts() in server components
export const PRODUCTS: import("@/lib/cms-types").CMSProduct[] = [];

