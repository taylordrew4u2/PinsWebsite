"use server";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
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
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  const d = parsed.data;
  try {
    await db.insert(pages).values({
      slug: d.slug,
      title: d.title,
      bodyMarkdown: d.bodyMarkdown,
      seoTitle: d.seoTitle,
      metaDescription: d.metaDescription,
      status: d.status,
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
    });
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    console.error("[admin] createPage", e);
    return { ok: false, error: "Database error." };
  }
}

export async function updatePage(id: number, _prev: PageFormState, formData: FormData): Promise<PageFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = PageSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  const d = parsed.data;
  try {
    await db.update(pages).set({
      slug: d.slug,
      title: d.title,
      bodyMarkdown: d.bodyMarkdown,
      seoTitle: d.seoTitle,
      metaDescription: d.metaDescription,
      status: d.status,
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
      updatedAt: new Date(),
    }).where(eq(pages.id, id));
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    console.error("[admin] updatePage", e);
    return { ok: false, error: "Database error." };
  }
}

export async function deletePage(id: number) {
  await db.delete(pages).where(eq(pages.id, id));
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}
