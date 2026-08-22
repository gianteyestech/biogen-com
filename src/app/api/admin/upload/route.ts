import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

// Route segment config — App Router style (Next.js 13+)
// maxDuration: extend function timeout to 60s for sharp processing + Hostinger upload
export const maxDuration = 60;
// dynamic: force dynamic so the route is never statically cached
export const dynamic = "force-dynamic";

const ADMIN_COOKIE = "admin_session";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server Configuration Error: Missing ADMIN_SESSION_SECRET" }, { status: 500 });
    }

    // 1. Authenticate Admin Session
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE);

    if (!session?.value || session.value !== secret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // 3. Validate Type & Size
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Allowed: JPG, PNG, WEBP, AVIF, GIF, SVG" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds limit (Max 5MB)" },
        { status: 400 }
      );
    }

    // 4. Process & Optimize Image with Sharp
    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const isSvg = file.type === "image/svg+xml" || file.name.endsWith(".svg");
    let finalBuffer: Buffer = inputBuffer;
    let finalExt = isSvg ? ".svg" : ".webp";
    let finalMime = isSvg ? "image/svg+xml" : "image/webp";

    if (!isSvg) {
      try {
        const sharp = (await import("sharp")).default;
        finalBuffer = await sharp(inputBuffer)
          .resize(1600, 1600, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toBuffer();
      } catch (sharpErr) {
        console.warn("Sharp optimization fallback to raw buffer:", sharpErr);
        finalExt = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
        finalMime = file.type;
      }
    }

    // 4. Generate Shein & Temu Enterprise Filename (Timestamp ID + Product Slug + Size Tag)
    let originalName = path.basename(file.name, path.extname(file.name)).toLowerCase();

    const isBlobHash = /^file-[0-9a-f]{8,}/i.test(originalName) || /^blob-[0-9a-f]{8,}/i.test(originalName);

    let cleanSlug = "";
    if (!isBlobHash) {
      cleanSlug = originalName
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (!cleanSlug || cleanSlug.length < 3 || cleanSlug.startsWith("whatsapp") || cleanSlug.startsWith("img-")) {
      cleanSlug = "biogen-pharma";
    }

    cleanSlug = cleanSlug.slice(0, 20).replace(/-+$/g, "");

    // Shein/Temu High-Scale Industrial Format: Unix Timestamp (10-digit) + Clean Keyword Slug + Resolution Tag
    const epochSec = Math.floor(Date.now() / 1000);
    const sizeTag = requestedFolder === "category" ? "500x" : requestedFolder === "banners" ? "1200x" : "800x";
    const filename = `${epochSec}_${cleanSlug}_${sizeTag}${finalExt}`;

    // 5. Upload to Hostinger Media Subdomain
    const hostingerMediaUrl = process.env.HOSTINGER_MEDIA_URL || "https://assets.idealdryfruit.com/bg_upload.php";
    const uploadSecret = process.env.HOSTINGER_UPLOAD_SECRET || "biogen_media_secret_2026_change_me";

    let publicUrl = "";

    try {
      const remoteFormData = new FormData();
      const uint8Array = new Uint8Array(finalBuffer);
      const blob = new Blob([uint8Array], { type: finalMime });
      remoteFormData.append("file", blob, filename);
      remoteFormData.append("filename", filename);
      remoteFormData.append("folder", requestedFolder);

      // AbortController gives us a hard timeout so Vercel doesn't silently kill the function
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25_000); // 25s

      let hostingerRes: Response;
      try {
        hostingerRes = await fetch(hostingerMediaUrl, {
          method: "POST",
          headers: { "X-Upload-Secret": uploadSecret },
          body: remoteFormData,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (hostingerRes.ok) {
        const hostingerData = await hostingerRes.json();
        if (hostingerData.url) {
          publicUrl = hostingerData.url;
        } else {
          console.error("Hostinger returned OK but no URL:", hostingerData);
          return NextResponse.json(
            { error: `Hostinger returned success but no URL. Response: ${JSON.stringify(hostingerData)}` },
            { status: 500 }
          );
        }
      } else {
        const errText = await hostingerRes.text().catch(() => "(unreadable response)");
        console.error("Hostinger upload failed:", hostingerRes.status, errText);
        return NextResponse.json(
          { error: `Hostinger upload failed (HTTP ${hostingerRes.status}): ${errText}` },
          { status: 500 }
        );
      }
    } catch (remoteErr: unknown) {
      const isTimeout = remoteErr instanceof Error && remoteErr.name === "AbortError";
      const msg = remoteErr instanceof Error ? remoteErr.message : String(remoteErr);
      console.error("Hostinger upload error:", remoteErr);
      return NextResponse.json(
        { error: isTimeout
            ? "Upload timed out (25s) — Hostinger media server did not respond in time. Try a smaller file."
            : `Hostinger unreachable: ${msg}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      originalSize: file.size,
      optimizedSize: finalBuffer.length,
      savedPercent: Math.max(0, Math.round(((file.size - finalBuffer.length) / file.size) * 100)),
      type: finalMime,
    });
  } catch (error: unknown) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save file on server" },
      { status: 500 }
    );
  }
}
