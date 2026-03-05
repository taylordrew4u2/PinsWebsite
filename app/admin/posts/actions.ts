"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

export type PostFormState = { ok: boolean; error?: string; id?: number };

export async function createPost(
  blogSlug: string,
  _prev: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }
  const d = parsed.data;
  try {
    const result = await db
      .insert(posts)
      .values({
        blogSlug,
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt,
        bodyMarkdown: d.bodyMarkdown,
        featuredImageUrl: d.featuredImageUrl || null,
        seoTitle: d.seoTitle,
        metaDescription: d.metaDescription,
        status: d.status,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
      })
      .returning({ id: posts.id });
    revalidatePath(`/admin/posts${blogSlug === "news" ? "" : "/comic-submission"}`);
    return { ok: true, id: result[0]?.id };
  } catch (e) {
    console.error("[admin] createPost", e);
    return { ok: false, error: "Database error." };
  }
}

export async function updatePost(
  id: number,
  blogSlug: string,
  _prev: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }
  const d = parsed.data;
  try {
    await db
      .update(posts)
      .set({
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt,
        bodyMarkdown: d.bodyMarkdown,
        featuredImageUrl: d.featuredImageUrl || null,
        seoTitle: d.seoTitle,
        metaDescription: d.metaDescription,
        status: d.status,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, id), eq(posts.blogSlug, blogSlug)));
    revalidatePath(`/admin/posts${blogSlug === "news" ? "" : "/comic-submission"}`);
    return { ok: true };
  } catch (e) {
    console.error("[admin] updatePost", e);
    return { ok: false, error: "Database error." };
  }
}

export async function deletePost(id: number, blogSlug: string) {
  await db.delete(posts).where(and(eq(posts.id, id), eq(posts.blogSlug, blogSlug)));
  const path = blogSlug === "news" ? "/admin/posts" : "/admin/posts/comic-submission";
  revalidatePath(path);
  redirect(path);
}

export async function duplicatePost(id: number, blogSlug: string) {
  const original = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.blogSlug, blogSlug)))
    .limit(1);
  if (!original[0]) return;
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = original[0];
  await db.insert(posts).values({
    ...rest,
    slug: `${rest.slug}-copy`,
    status: "draft",
    publishedAt: null,
  });
  const path = blogSlug === "news" ? "/admin/posts" : "/admin/posts/comic-submission";
  revalidatePath(path);
  redirect(path);
}
