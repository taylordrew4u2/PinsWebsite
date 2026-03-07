"use server";

import { db } from "@/db";
import type { Post } from "@/db/types";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
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
    const publishedAt = d.publishedAt ? Math.floor(new Date(d.publishedAt).getTime() / 1000) : null;

    await db.execute(
      `INSERT INTO posts (blog_slug, slug, title, excerpt, body_markdown, featured_image_url, seo_title, meta_description, status, published_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`,
      [
        blogSlug,
        d.slug,
        d.title,
        d.excerpt || null,
        d.bodyMarkdown || null,
        d.featuredImageUrl || null,
        d.seoTitle || null,
        d.metaDescription || null,
        d.status,
        publishedAt,
      ]
    );

    revalidatePath(`/admin/posts${blogSlug === "news" ? "" : "/comic-submission"}`);
    return { ok: true };
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
    const publishedAt = d.publishedAt ? Math.floor(new Date(d.publishedAt).getTime() / 1000) : null;
    const updatedAt = Math.floor(Date.now() / 1000);

    await db.execute(
      `UPDATE posts SET 
        slug = ?1,
        title = ?2,
        excerpt = ?3,
        body_markdown = ?4,
        featured_image_url = ?5,
        seo_title = ?6,
        meta_description = ?7,
        status = ?8,
        published_at = ?9,
        updated_at = ?10
       WHERE id = ?11 AND blog_slug = ?12`,
      [
        d.slug,
        d.title,
        d.excerpt || null,
        d.bodyMarkdown || null,
        d.featuredImageUrl || null,
        d.seoTitle || null,
        d.metaDescription || null,
        d.status,
        publishedAt,
        updatedAt,
        id,
        blogSlug,
      ]
    );

    revalidatePath(`/admin/posts${blogSlug === "news" ? "" : "/comic-submission"}`);
    return { ok: true };
  } catch (e) {
    console.error("[admin] updatePost", e);
    return { ok: false, error: "Database error." };
  }
}

export async function deletePost(id: number, blogSlug: string) {
  await db.execute("DELETE FROM posts WHERE id = ?1 AND blog_slug = ?2", [id, blogSlug]);
  const path = blogSlug === "news" ? "/admin/posts" : "/admin/posts/comic-submission";
  revalidatePath(path);
  redirect(path);
}

export async function duplicatePost(id: number, blogSlug: string) {
  const result = await db.execute("SELECT * FROM posts WHERE id = ?1 AND blog_slug = ?2 LIMIT 1", [
    id,
    blogSlug,
  ]);

  if (!result.rows[0]) return;

  const original = result.rows[0] as unknown as Post;

  await db.execute(
    `INSERT INTO posts (blog_slug, slug, title, excerpt, body_markdown, featured_image_url, seo_title, meta_description, status, published_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`,
    [
      original.blog_slug,
      `${original.slug}-copy`,
      original.title,
      original.excerpt,
      original.body_markdown,
      original.featured_image_url,
      original.seo_title,
      original.meta_description,
      "draft",
      null,
    ]
  );

  const path = blogSlug === "news" ? "/admin/posts" : "/admin/posts/comic-submission";
  revalidatePath(path);
  redirect(path);
}
