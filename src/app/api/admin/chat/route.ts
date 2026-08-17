import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminChatThreads, getChatMessages, sendChatMessage } from "@/lib/cms";

const ADMIN_COOKIE = "admin_session";

async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || session?.value !== secret) {
    return false;
  }
  return true;
}

// GET: Admin Fetch All Active Threads or Messages for a Thread
export async function GET(req: Request) {
  try {
    const isAuthed = await requireAdminSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");

    if (threadId) {
      const messages = await getChatMessages(threadId);
      return NextResponse.json({ success: true, messages });
    }

    const threads = await getAdminChatThreads();
    return NextResponse.json({ success: true, threads });
  } catch (error: unknown) {
    console.error("Admin Chat API Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin chats" }, { status: 500 });
  }
}

// POST: Admin Send Reply to Customer
export async function POST(req: Request) {
  try {
    const isAuthed = await requireAdminSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { threadId, message } = body;

    if (!threadId || !message || !message.trim()) {
      return NextResponse.json({ error: "Thread ID and message are required" }, { status: 400 });
    }

    await sendChatMessage(threadId, "admin", message.trim());
    const messages = await getChatMessages(threadId);

    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    console.error("Admin Chat Reply Error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
