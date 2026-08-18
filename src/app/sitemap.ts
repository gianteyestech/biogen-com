import { MetadataRoute } from "next";
import { getCMSProducts, getCMSCategories } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biogen.com";
  const products = await getCMSProducts();
  const categoriesData = await getCMSCategories();

  const staticRoutes = [
    "",
    "/track-order",
    "/checkout",
    "/business-page/faqs",
    "/business-page/terms-and-conditions",
    "/business-page/privacy-policy",
    "/business-page/shipping-policy",
    "/business-page/return-policy",
    "/business-page/refund-policy",
    "/business-page/cancellation-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryRoutes = categoriesData.categories
    .filter((cat) => cat.id !== "all")
    .map((cat) => ({
      url: `${baseUrl}/#cat-${cat.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
