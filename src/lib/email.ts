import "server-only";
import nodemailer from "nodemailer";

import pool from "./db";

const SMTP_HOST = process.env.SMTP_HOST || "business176.web-hosting.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;

// Fallback Defaults
const DEFAULT_ORDERS_USER = process.env.ORDERS_SMTP_USER || process.env.SMTP_USER || "orders.biogen@gianteyetech.com";
const DEFAULT_ORDERS_PASS = process.env.ORDERS_SMTP_PASS || process.env.SMTP_PASS || "GetEmail@026";

const DEFAULT_ADMIN_USER = process.env.ADMIN_SMTP_USER || "admin.biogen@gianteyetech.com";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_SMTP_PASS || "GetEmail@026";

/**
 * Fetch dynamic SMTP settings from Hostinger MySQL Database if configured
 */
async function getSmtpCredentials(channel: "orders" | "admin") {
  try {
    const key = channel === "orders" ? "smtp_orders_config" : "smtp_admin_config";
    const [rows] = await pool.query<any[]>("SELECT data FROM cms_store WHERE store_key = ?", [key]);
    if (rows && rows.length > 0) {
      const parsed = JSON.parse(rows[0].data);
      if (parsed.user && parsed.pass) {
        return { user: parsed.user, pass: parsed.pass };
      }
    }
  } catch {
    // Silent fallback to server defaults
  }

  return {
    user: channel === "orders" ? DEFAULT_ORDERS_USER : DEFAULT_ADMIN_USER,
    pass: channel === "orders" ? DEFAULT_ORDERS_PASS : DEFAULT_ADMIN_PASS,
  };
}

function getTransporter(user: string, pass: string) {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  channel?: "orders" | "admin";
}

/**
 * Utility to send transactional emails via Hostinger Webmail SMTP
 */
export async function sendEmail({ to, subject, html, text, channel = "admin" }: SendEmailOptions) {
  const creds = await getSmtpCredentials(channel);
  const targetTransporter = getTransporter(creds.user, creds.pass);
  const fromAddress = `"Biogen" <${creds.user}>`;

  try {
    const info = await targetTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || subject,
      html,
    });

    console.log(`[Email Utility - ${channel}] Message sent to ${to}: %s`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    console.error(`[Email Utility - ${channel}] Failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMTP error",
    };
  }
}

/**
 * Standard Order Confirmation Email Template
 */
export function generateOrderConfirmationHTML(order: {
  id: string;
  customerName: string;
  totalAmount: number;
  items: { name: string; weight: string; qty: number; price: number }[];
}) {
  const itemsRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price * item.qty}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0A0A0A; padding: 24px; text-align: center; color: #C9A84C;">
        <h1 style="margin: 0; font-size: 24px;">Biogen</h1>
        <p style="margin: 4px 0 0 0; color: #A1A1AA; font-size: 14px;">Order Confirmation #${order.id}</p>
      </div>
      
      <div style="padding: 24px; color: #333;">
        <h2 style="font-size: 18px; margin-top: 0;">Thank you for your order, ${order.customerName}!</h2>
        <p>We have received your order and are getting it ready for shipment.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f8f8f8; text-align: left;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #0A0A0A;">
          Grand Total: <span style="color: #C9A84C;">Rs. ${order.totalAmount}</span>
        </div>
      </div>
      
      <div style="background-color: #f4f4f5; padding: 16px; text-align: center; font-size: 12px; color: #71717A;">
        If you have any questions, contact us at info.biogen@gianteyetech.com or WhatsApp.
      </div>
    </div>
  `;
}
