import { NextResponse } from "next/server";
import { getCMSAboutContent, updateCMSAboutContent } from "@/lib/cms";
import type { CMSAboutContent } from "@/lib/cms-types";

export async function GET() {
  try {
    const data = await getCMSAboutContent();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading about content:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data: CMSAboutContent = await req.json();
    await updateCMSAboutContent(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving about content:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
