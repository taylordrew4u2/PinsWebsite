"use server";

import { put, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export type UploadState = { ok: boolean; error?: string; url?: string };

export async function uploadFile(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file selected." };

  if (file.size > 10 * 1024 * 1024) return { ok: false, error: "File must be under 10MB." };

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return { ok: false, error: "File type not allowed. Use JPEG, PNG, GIF, WebP, SVG, or PDF." };
  }

  try {
    const blob = await put(file.name, file, { access: "public" });
    revalidatePath("/admin/media");
    return { ok: true, url: blob.url };
  } catch (e) {
    console.error("[admin] uploadFile", e);
    return { ok: false, error: "Upload failed. Check BLOB_READ_WRITE_TOKEN is configured." };
  }
}

export async function listFiles() {
  try {
    const { blobs } = await list();
    return { blobs, error: null };
  } catch {
    return { blobs: [], error: "Blob storage not connected. Configure BLOB_READ_WRITE_TOKEN." };
  }
}
