import { NextResponse } from "next/server";
import { getCMSGallery, updateCMSGallery } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCMSGallery();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await updateCMSGallery(data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
