import { NextResponse } from "next/server";
import { getCMSFaqs, updateCMSFaqs } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCMSFaqs();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await updateCMSFaqs(data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
