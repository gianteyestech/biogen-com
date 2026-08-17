import { NextResponse } from "next/server";
import { resetTokensStore } from "../forgot-password/route";
import { resetAdminPasswordDirect } from "@/lib/cms";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    const tokenData = resetTokensStore.get(token);

    if (!tokenData || Date.now() > tokenData.expires) {
      return NextResponse.json({ error: "Password reset token is invalid or has expired." }, { status: 400 });
    }

    const result = await resetAdminPasswordDirect(newPassword);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Invalidate token after single use
    resetTokensStore.delete(token);

    return NextResponse.json({
      success: true,
      message: "Admin password reset successfully! You can now log in.",
    });
  } catch (error: unknown) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reset password" },
      { status: 500 }
    );
  }
}
