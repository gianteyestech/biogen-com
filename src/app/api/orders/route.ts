import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { initOrdersDb } from "@/lib/orders-db";
import { getCMSProduct } from "@/lib/cms";
import { sendEmail, generateOrderConfirmationHTML } from "@/lib/email";
import { RowDataPacket } from "mysql2";

const ADMIN_COOKIE = "admin_session";

// In-Memory Rate Limiter (5 requests per IP per 10 minutes)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

// POST: Create a new customer order
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many order requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    await initOrdersDb();

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      paymentMethod,
      items,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !city || !items || !Array.isArray(items) || !items.length) {
      return NextResponse.json(
        { error: "Please fill in all required shipping and contact details." },
        { status: 400 }
      );
    }

    // ── Server-Side Price & Total Recalculation ───────────────────────────
    let serverTotalAmount = 0;
    const validatedItems: Array<{
      productId: string;
      name: string;
      weight: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items) {
      const pId = item.id || item.productId;
      if (!pId) {
        return NextResponse.json({ error: "Invalid product selection." }, { status: 400 });
      }

      const product = await getCMSProduct(pId);
      if (!product) {
        return NextResponse.json({ error: `Product "${pId}" is no longer available.` }, { status: 400 });
      }

      const weight = item.weight || Object.keys(product.prices)[0];
      const unitPrice = product.prices[weight];

      if (unitPrice === undefined || unitPrice === null) {
        return NextResponse.json({ error: `Invalid weight option "${weight}" for product "${product.name}".` }, { status: 400 });
      }

      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemSubtotal = unitPrice * quantity;
      serverTotalAmount += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        weight,
        quantity,
        price: unitPrice,
      });
    }

    const uniqueId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `BG-${Math.floor(100000 + Math.random() * 900000)}`;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insert into orders table using server-recalculated total
      await connection.query(
        `INSERT INTO orders (id, order_number, customer_name, customer_email, customer_phone, shipping_address, city, payment_method, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          uniqueId,
          orderNumber,
          customerName,
          customerEmail || "",
          customerPhone,
          shippingAddress,
          city,
          paymentMethod || "cod",
          serverTotalAmount,
        ]
      );

      // Insert validated items into order_items table using server unit price
      for (const item of validatedItems) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, product_name, weight, quantity, price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [uniqueId, item.productId, item.name, item.weight, item.quantity, item.price]
        );
      }

      await connection.commit();
    } catch (dbErr) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }

    // Async Email Notifications (If customer provided email)
    if (customerEmail) {
      const emailHtml = generateOrderConfirmationHTML({
        id: orderNumber,
        customerName,
        totalAmount: serverTotalAmount,
        items: validatedItems.map((i) => ({
          name: i.name,
          weight: i.weight,
          qty: i.quantity,
          price: i.price,
        })),
      });

      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation #${orderNumber} — Biogen`,
        html: emailHtml,
        channel: "orders",
      }).catch((e) => console.error("Customer Email Error:", e));
    }

    // Admin Alert Email
    const adminEmail = process.env.ADMIN_EMAIL || "admin.biogen@gianteyetech.com";
    await sendEmail({
      to: adminEmail,
      subject: `🚨 New Order ${orderNumber} (Rs. ${serverTotalAmount})`,
      channel: "admin",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Order Received!</h2>
          <p><strong>Order #:</strong> ${orderNumber}</p>
          <p><strong>Customer:</strong> ${customerName} (${customerPhone})</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Total:</strong> Rs. ${serverTotalAmount}</p>
        </div>
      `,
    }).catch((e) => console.error("Admin Email Alert Error:", e));

    return NextResponse.json({
      success: true,
      orderId: uniqueId,
      orderNumber,
    });
  } catch (error: unknown) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to place order" },
      { status: 500 }
    );
  }
}

// GET: Admin Fetch All Orders
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE);
    const secret = process.env.ADMIN_SESSION_SECRET || "idealdryfruit_cms_secret_2024_change_me";

    if (!session?.value || session.value !== secret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await initOrdersDb();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = `
      SELECT o.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', oi.id,
                 'product_name', oi.product_name,
                 'weight', oi.weight,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const params: string[] = [];
    if (status && status !== "all") {
      query += ` WHERE o.status = ?`;
      params.push(status);
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return NextResponse.json({ success: true, orders: rows });
  } catch (error: unknown) {
    console.error("Get Orders Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
