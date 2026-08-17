import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetEmail = searchParams.get("to") || "admin.biogen@gianteyetech.com";

  try {
    const result = await sendEmail({
      to: targetEmail,
      subject: "Test Email from Biogen CMS",
      html: `<div style="padding:20px; font-family:Arial;">
        <h2>SMTP Connection Test</h2>
        <p>If you receive this email, your Hostinger Webmail SMTP is working 100%!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>`,
      channel: "admin",
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || err }, { status: 500 });
  }
}
