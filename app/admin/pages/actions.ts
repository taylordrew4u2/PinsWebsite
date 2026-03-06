"use server";

import { db } from "@/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  bodyMarkdown: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

export type PageFormState = { ok: boolean; error?: string };

export async function createPage(_prev: PageFormState, formData: FormData): Promise<PageFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = PageSchema.safeParse(raw);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  const d = parsed.data;
  try {
    const publishedAt = d.publishedAt ? Math.floor(new Date(d.publishedAt).getTime() / 1000) : null;

    await db.execute(
      `INSERT INTO pages (slug, title, body_markdown, seo_title, meta_description, status, published_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
      [
        d.slug,
        d.title,
        d.bodyMarkdown || null,
        d.seoTitle || null,
        d.metaDescription || null,
        d.status,
        publishedAt,
      ]
    );
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    console.error("[admin] createPage", e);
    return { ok: false, error: "Database error." };
  }
}

export async function updatePage(
  id: number,
  _prev: PageFormState,
  formData: FormData
): Promise<PageFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = PageSchema.safeParse(raw);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  const d = parsed.data;
  try {
    const publishedAt = d.publishedAt ? Math.floor(new Date(d.publishedAt).getTime() / 1000) : null;
    const updatedAt = Math.floor(Date.now() / 1000);

    await db.execute(
      `UPDATE pages SET slug = ?1, title = ?2, body_markdown = ?3, seo_title = ?4, meta_description = ?5, status = ?6, published_at = ?7, updated_at = ?8
       WHERE id = ?9`,
      [
        d.slug,
        d.title,
        d.bodyMarkdown || null,
        d.seoTitle || null,
        d.metaDescription || null,
        d.status,
        publishedAt,
        updatedAt,
        id,
      ]
    );
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    console.error("[admin] updatePage", e);
    return { ok: false, error: "Database error." };
  }
}

export async function deletePage(id: number) {
  await db.execute("DELETE FROM pages WHERE id = ?1", [id]);
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}
