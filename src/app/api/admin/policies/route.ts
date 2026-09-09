import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCMSPolicies, updateCMSPolicies } from "@/lib/cms";
import type { CMSPolicyPage } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCMSPolicies();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading policies:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data: CMSPolicyPage[] = await req.json();
    await updateCMSPolicies(data);
    revalidatePath("/");
    revalidatePath("/business-page/privacy-policy");
    revalidatePath("/business-page/terms-and-conditions");
    revalidatePath("/business-page/shipping-policy");
    revalidatePath("/business-page/refund-policy");
    revalidatePath("/business-page/return-policy");
    revalidatePath("/business-page/cancellation-policy");
    revalidatePath("/admin/policies");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving policies:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
