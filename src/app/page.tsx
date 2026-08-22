import {
  getCMSProducts,
  getCMSCategories,
  getCMSHeroSlides,
  getCMSPagesConfig,
  filterProductsByCategory,
  getCMSBrandPartners,
  getCMSSiteConfig,
} from "@/lib/cms";
import type { CMSProduct } from "@/lib/cms-types";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const [products, categoriesData, heroSlides, siteConfig, pagesConfig, brandPartners] = await Promise.all([
    getCMSProducts(),
    getCMSCategories(),
    getCMSHeroSlides(),
    getCMSSiteConfig(),
    getCMSPagesConfig(),
    getCMSBrandPartners(),
  ]);

  const visibleSections = [...pagesConfig.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      let sectionProducts;
      if (section.type === "new") {
        sectionProducts = products.filter((p: CMSProduct) => p.isNew);
        if (!sectionProducts.length) sectionProducts = products.slice(0, 8);
      } else if (section.type === "featured") {
        sectionProducts = products.filter((p: CMSProduct) => p.featured);
      } else {
        sectionProducts = filterProductsByCategory(products, section.categoryId);
      }
      return { ...section, products: sectionProducts };
    });

  return (
    <HomeClient
      allProducts={products}
      categories={categoriesData.categories}
      megaMenu={categoriesData.megaMenu || []}
      circleCats={categoriesData.circleCats}
      heroSlides={heroSlides}
      siteConfig={siteConfig}
      sections={visibleSections}
      brandPartners={brandPartners}
    />
  );
}
