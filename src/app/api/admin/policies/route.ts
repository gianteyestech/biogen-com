import { NextResponse } from "next/server";
import { getCMSPolicies, updateCMSPolicies } from "@/lib/cms";
import type { CMSPolicyPage } from "@/lib/cms-types";

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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving policies:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
