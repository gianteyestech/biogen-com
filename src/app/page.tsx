import {
  getCMSProducts,
  getCMSCategories,
  getCMSHeroSlides,
  getCMSSiteConfig,
  getCMSPagesConfig,
  filterProductsByCategory,
} from "@/lib/cms";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const [products, categoriesData, heroSlides, siteConfig, pagesConfig] = await Promise.all([
    getCMSProducts(),
    getCMSCategories(),
    getCMSHeroSlides(),
    getCMSSiteConfig(),
    getCMSPagesConfig(),
  ]);

  const visibleSections = [...pagesConfig.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      let sectionProducts;
      if (section.type === "new") {
        sectionProducts = products.filter((p) => p.isNew);
        if (!sectionProducts.length) sectionProducts = products.slice(0, 8);
      } else if (section.type === "featured") {
        sectionProducts = products.filter((p) => p.featured);
      } else {
        sectionProducts = filterProductsByCategory(products, section.categoryId);
        // For gift-box sections also include mix
        if (section.categoryId === "gift-box") {
          const mix = filterProductsByCategory(products, "mix");
          sectionProducts = [...sectionProducts, ...mix];
        }
      }
      return { ...section, products: sectionProducts };
    });

  return (
    <HomeClient
      allProducts={products}
      categories={categoriesData.categories}
      circleCats={categoriesData.circleCats}
      heroSlides={heroSlides}
      siteConfig={siteConfig}
      sections={visibleSections}
    />
  );
}
