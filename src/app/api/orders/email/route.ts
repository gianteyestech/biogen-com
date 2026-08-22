import { NextResponse } from "next/server";
import { sendEmail, generateOrderConfirmationHTML } from "@/lib/email";
import { getCMSSiteConfig } from "@/lib/cms";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customerName, customerEmail, totalAmount, items } = body;

    if (!customerEmail || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const siteConfig = await getCMSSiteConfig();

    const htmlContent = generateOrderConfirmationHTML({
      id: orderId || `BG-${Date.now().toString().slice(-6)}`,
      customerName: customerName || "Valued Customer",
      totalAmount: Number(totalAmount),
      items: items || [],
    }, siteConfig?.brand?.email);

    // 1. Send confirmation email to customer
    const customerEmailResult = await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation #${orderId || "BG-STORE"} — Biogen`,
      html: htmlContent,
    });

    // 2. Send notification email to admin email
    const adminEmail = process.env.ADMIN_EMAIL || "admin.biogen@gianteyetech.com";
    const adminEmailResult = await sendEmail({
      to: adminEmail,
      subject: `🚨 New Order Alert #${orderId || "BG-STORE"} ($${totalAmount})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Order Received on Store!</h2>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Total Amount:</strong> $${totalAmount}</p>
          <p>Check the admin dashboard for complete order shipping details.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      customerEmailSent: customerEmailResult.success,
      adminEmailSent: adminEmailResult.success,
    });
  } catch (error: unknown) {
    console.error("Order Email API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process order emails" },
      { status: 500 }
    );
  }
}
