"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getCMSProducts,
  createCMSProduct,
  updateCMSProduct,
  deleteCMSProduct,
  updateCMSCategories,
  updateCMSHeroSlides,
  updateCMSSiteConfig,
  updateCMSPagesConfig,
  getCMSCategories,
  getCMSHeroSlides,
  getCMSSiteConfig,
  getCMSPagesConfig,
  getCMSActivityLogs,
  verifyAdminCredentials,
  updateAdminPassword,
  type CMSProduct,
  type CMSCategoriesFile,
  type CMSHeroSlide,
  type CMSSiteConfig,
  type CMSPagesConfig,
  type CMSActivityLog,
} from "@/lib/cms";

const ADMIN_COOKIE = "admin_session";

// ─── Auth check helper ────────────────────────────────────────────────────────
function getAdminSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("SECURITY FATAL: ADMIN_SESSION_SECRET environment variable is missing.");
  }
  return secret;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  const secret = getAdminSecret();
  if (!session?.value || session.value !== secret) {
    redirect("/admin/login");
  }
}

// ─── Login / Logout ───────────────────────────────────────────────────────────
export async function adminLogin(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const password = formData.get("password") as string;
  const isValid = await verifyAdminCredentials(password);
  if (!isValid) {
    return { error: "Invalid password. Please try again." };
  }
  const secret = getAdminSecret();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function actionChangeAdminPassword(
  _prevState: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string } | null> {
  await requireAdmin();
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const result = await updateAdminPassword(currentPassword, newPassword);
  if (!result.success) {
    return { error: result.message };
  }

  return { success: result.message };
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function actionCreateProduct(formData: FormData) {
  await requireAdmin();
  const product = parseProductFormData(formData);
  await createCMSProduct(product);
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function actionUpdateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const product = parseProductFormData(formData);
  await updateCMSProduct(id, product);
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function actionDeleteProduct(id: string) {
  await requireAdmin();
  await deleteCMSProduct(id);
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function actionGetProducts() {
  await requireAdmin();
  return getCMSProducts();
}

function parseProductFormData(formData: FormData): CMSProduct {
  const pricesRaw = formData.get("prices") as string;
  const originalPricesRaw = formData.get("originalPrices") as string;

  const parsePrices = (raw: string): Record<string, number> => {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  return {
    id: (formData.get("id") as string).trim().toLowerCase().replace(/\s+/g, "-"),
    name: formData.get("name") as string,
    urduName: formData.get("urduName") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    rating: parseFloat(formData.get("rating") as string) || 4.5,
    reviewsCount: parseInt(formData.get("reviewsCount") as string) || 0,
    imageUrl: formData.get("imageUrl") as string,
    prices: parsePrices(pricesRaw),
    originalPrices: parsePrices(originalPricesRaw),
    inStock: formData.get("inStock") === "true",
    featured: formData.get("featured") === "true",
    isNew: formData.get("isNew") === "true",
    badge: (formData.get("badge") as string) || "",
  };
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function actionUpdateCategories(data: CMSCategoriesFile) {
  await requireAdmin();
  await updateCMSCategories(data);
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function actionGetCategories() {
  await requireAdmin();
  return getCMSCategories();
}

// ─── Hero Slides ──────────────────────────────────────────────────────────────
export async function actionUpdateHeroSlides(slides: CMSHeroSlide[]) {
  await requireAdmin();
  await updateCMSHeroSlides(slides);
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}

export async function actionGetHeroSlides() {
  await requireAdmin();
  return getCMSHeroSlides();
}

// ─── Site Config ──────────────────────────────────────────────────────────────
export async function actionUpdateSiteConfig(config: CMSSiteConfig) {
  await requireAdmin();
  await updateCMSSiteConfig(config);
  revalidatePath("/");
  revalidatePath("/admin/site");
  revalidatePath("/admin/payment");
  return { success: true };
}

export async function actionGetSiteConfig() {
  await requireAdmin();
  return getCMSSiteConfig();
}

// ─── Pages Config ─────────────────────────────────────────────────────────────
export async function actionUpdatePagesConfig(config: CMSPagesConfig) {
  await requireAdmin();
  await updateCMSPagesConfig(config);
  revalidatePath("/");
  revalidatePath("/admin/sections");
  return { success: true };
}

export async function actionGetPagesConfig() {
  await requireAdmin();
  return getCMSPagesConfig();
}

export async function actionGetActivityLogs(limit: number = 100): Promise<CMSActivityLog[]> {
  await requireAdmin();
  return getCMSActivityLogs(limit);
}

