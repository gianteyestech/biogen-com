import { getCMSProducts, getCMSSiteConfig } from "@/lib/cms";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const products = await getCMSProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const products = await getCMSProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} - Biogen Pharma`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [allProducts, siteConfig] = await Promise.all([
    getCMSProducts(),
    getCMSSiteConfig(),
  ]);
  const product = allProducts.find((p) => p.id === id) || null;
  const related = product
    ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  return <ProductPageClient product={product} related={related} siteConfig={siteConfig} />;
}
