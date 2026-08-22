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
}, supportEmail: string = "contact@biogenpharma.site") {
  const itemsRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.qty).toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0A0F1D; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; color: #00A3E0;">Biogen Pharma</h1>
        <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 13px;">Medical Requisition Confirmation #${order.id}</p>
      </div>
      
      <div style="padding: 24px; color: #1E293B;">
        <h2 style="font-size: 16px; margin-top: 0; color: #0F172A;">Thank you for your order, ${order.customerName}!</h2>
        <p style="font-size: 13px; color: #475569;">We have received your pharmaceutical / medical supply requisition and our logistics team is preparing cold-chain dispatch.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
          <thead>
            <tr style="background-color: #F1F5F9; text-align: left;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; color: #0F172A;">
          Total Payable: <span style="color: #0072CE;">$${order.totalAmount?.toLocaleString()}</span>
        </div>
      </div>
      
      <div style="background-color: #F8FAFC; padding: 16px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0;">
        For clinical inquiries or logistics tracking, contact us at ${supportEmail} or WhatsApp.
      </div>
    </div>
  `;
}
