import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

const ADMIN_COOKIE = "admin_session";

// GET: Public Track Order by ID or Phone
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    let query = `
      SELECT o.id, o.order_number, o.customer_name, o.city, o.status, o.total_amount, o.created_at,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'product_name', oi.product_name,
                 'weight', oi.weight,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE (o.id = ? OR o.order_number = ?)
    `;

    const queryParams: string[] = [id, id];

    if (phone) {
      query += ` AND o.customer_phone = ?`;
      queryParams.push(phone);
    }

    query += ` GROUP BY o.id`;

    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

    if (!rows.length) {
      return NextResponse.json({ error: "Order not found. Check Order Number or Phone Number." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: rows[0] });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to track order" },
      { status: 500 }
    );
  }
}

// PATCH: Admin Update Order Status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE);
    const secret = process.env.ADMIN_SESSION_SECRET || "idealdryfruit_cms_secret_2024_change_me";

    if (!session?.value || session.value !== secret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await pool.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);

    return NextResponse.json({ success: true, status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update order status" },
      { status: 500 }
    );
  }
}
