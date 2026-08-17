import { NextResponse } from "next/server";
import { getOrCreateChatThread, sendChatMessage, getChatMessages } from "@/lib/cms";

// POST: Customer Send Message or Register Chat Session
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, customerName, customerEmail, message } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const thread = await getOrCreateChatThread(sessionId, customerName, customerEmail);

    if (message && message.trim()) {
      await sendChatMessage(thread.id, "customer", message.trim());
    }

    const messages = await getChatMessages(thread.id);
    return NextResponse.json({ success: true, threadId: thread.id, messages });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat service unavailable" },
      { status: 500 }
    );
  }
}

// GET: Customer Poll Messages
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const thread = await getOrCreateChatThread(sessionId);
    const messages = await getChatMessages(thread.id);

    return NextResponse.json({ success: true, threadId: thread.id, messages });
  } catch (error: unknown) {
    console.error("Chat Poll Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat poll error" },
      { status: 500 }
    );
  }
}
