import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readdir, stat } from "fs/promises";
import path from "path";

const ADMIN_COOKIE = "admin_session";

export async function GET() {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server Configuration Error: Missing ADMIN_SESSION_SECRET" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE);

    if (!session?.value || session.value !== secret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const hostingerMediaUrl = process.env.HOSTINGER_MEDIA_URL || "https://media.idealdryfruit.com/upload.php";
    const uploadSecret = process.env.HOSTINGER_UPLOAD_SECRET || "";

    try {
      const remoteRes = await fetch(hostingerMediaUrl, {
        method: "GET",
        headers: {
          "X-Upload-Secret": uploadSecret,
        },
        cache: "no-store",
      });

      if (remoteRes.ok) {
        const remoteData = await remoteRes.json();
        if (remoteData.media) {
          remoteData.media.sort((a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt);
          return NextResponse.json({ media: remoteData.media });
        }
      }
    } catch (remoteErr) {
      console.warn("Failed to fetch media list from Hostinger, falling back to local:", remoteErr);
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      const files = await readdir(uploadDir);
      const mediaItems = await Promise.all(
        files
          .filter((file) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file))
          .map(async (file) => {
            const filePath = path.join(uploadDir, file);
            const fileStat = await stat(filePath);
            return {
              url: `/uploads/${file}`,
              filename: file,
              size: fileStat.size,
              createdAt: fileStat.birthtimeMs || fileStat.mtimeMs,
            };
          })
      );

      // Sort newest first
      mediaItems.sort((a, b) => b.createdAt - a.createdAt);

      return NextResponse.json({ media: mediaItems });
    } catch {
      // If uploads folder does not exist yet
      return NextResponse.json({ media: [] });
    }
  } catch (error: unknown) {
    console.error("Media API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch media items" },
      { status: 500 }
    );
  }
}
