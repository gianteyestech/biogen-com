import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

// Memory store for temporary password reset tokens (Expires in 15 mins)
export const resetTokensStore = new Map<string, { email: string; expires: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "admin.biogen@gianteyetech.com";

    if (!email || email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      // Security practice: Return same generic response to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: "If that email matches the admin account, a password reset link has been sent.",
      });
    }

    // Generate random 32-byte hex token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    resetTokensStore.set(token, { email, expires });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://biogen.com";
    const resetUrl = `${origin}/admin/reset-password?token=${token}`;

    // Send email using Hostinger Webmail SMTP
    const emailResult = await sendEmail({
      to: adminEmail,
      subject: "🔒 Admin Password Reset — Biogen",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #0A0A0A; margin-top: 0;">Password Reset Request</h2>
          <p>We received a request to reset your CMS Admin password for <strong>Biogen</strong>.</p>
          <p>Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0072CE; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 8px; display: inline-block;">
              Reset Admin Password →
            </a>
          </div>
          
          <p style="font-size: 12px; color: #777;">If you did not request this password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: `Email Delivery Failed: ${emailResult.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link sent! Please check your inbox (and Spam folder).",
    });
  } catch (error: unknown) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    );
  }
}
