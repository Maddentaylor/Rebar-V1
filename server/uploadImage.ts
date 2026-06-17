import { put } from "@vercel/blob";

const DATA_URL_RE = /^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,(.+)$/i;

/** Upload a data-URL image to Vercel Blob. Returns the public URL, or the fallback on failure. */
export async function persistPartImage(
  id: string,
  image: string,
  fallback = "/parts/_missing.svg"
): Promise<string> {
  if (!image.startsWith("data:")) {
    return image || fallback;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    console.warn("BLOB_READ_WRITE_TOKEN not set — using placeholder image.");
    return fallback;
  }

  const match = image.match(DATA_URL_RE);
  if (!match) return fallback;

  const mime = match[1].toLowerCase();
  const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length > 4_500_000) {
    throw new Error("Image is too large after compression. Try a smaller file.");
  }

  const blob = await put(`custom-parts/${id}.${ext}`, buffer, {
    access: "public",
    token,
    contentType: mime,
  });

  return blob.url;
}
