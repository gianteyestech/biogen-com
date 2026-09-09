import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCMSBrandPartners, updateCMSBrandPartners } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCMSBrandPartners();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await updateCMSBrandPartners(data);
    revalidatePath("/");
    revalidatePath("/admin/brand-partners");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
