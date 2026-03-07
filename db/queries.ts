// Database Query Helpers
import { db } from "./index";
import type { SiteSettings, Post, Page, ContactSubmission, Redirect } from "./types";

// Helper to convert rows to typed objects
function parseRow<T>(row: Record<string, unknown>): T {
  return row as T;
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const result = await db.execute("SELECT * FROM site_settings LIMIT 1");
  return result.rows[0] ? parseRow<SiteSettings>(result.rows[0]) : null;
}

export async function upsertSiteSettings(data: Partial<Omit<SiteSettings, "id">>): Promise<void> {
  const existing = await getSiteSettings();

  if (existing) {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?${paramIndex++}`);
      values.push(value);
    });

    if (updates.length > 0) {
      values.push(existing.id);
      await db.execute(
        `UPDATE site_settings SET ${updates.join(", ")} WHERE id = ?${paramIndex}`,
        values
      );
    }
  } else {
    const keys = Object.keys(data);
    const placeholders = keys.map((_, i) => `?${i + 1}`).join(", ");
    const values = Object.values(data);

    await db.execute(
      `INSERT INTO site_settings (${keys.join(", ")}) VALUES (${placeholders})`,
      values
    );
  }
}

// Posts
export async function getAllPosts(blogSlug?: string): Promise<Post[]> {
  let query = "SELECT * FROM posts";
  const params: unknown[] = [];

  if (blogSlug) {
    query += " WHERE blog_slug = ?1";
    params.push(blogSlug);
  }

  query += " ORDER BY created_at DESC";

  const result = await db.execute(query, params);
  return result.rows.map((row) => parseRow<Post>(row));
}

export async function getPostById(id: number, blogSlug?: string): Promise<Post | null> {
  let query = "SELECT * FROM posts WHERE id = ?1";
  const params: unknown[] = [id];

  if (blogSlug) {
    query += " AND blog_slug = ?2";
    params.push(blogSlug);
  }

  const result = await db.execute(query, params);
  return result.rows[0] ? parseRow<Post>(result.rows[0]) : null;
}

export async function createPost(
  data: Omit<Post, "id" | "created_at" | "updated_at">
): Promise<void> {
  const keys = Object.keys(data);
  const placeholders = keys.map((_, i) => `?${i + 1}`).join(", ");
  const values = Object.values(data);

  await db.execute(`INSERT INTO posts (${keys.join(", ")}) VALUES (${placeholders})`, values);
}

export async function updatePost(
  id: number,
  data: Partial<Omit<Post, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    updates.push(`${key} = ?${paramIndex++}`);
    values.push(value);
  });

  updates.push(`updated_at = ?${paramIndex++}`);
  values.push(Math.floor(Date.now() / 1000));

  values.push(id);

  await db.execute(`UPDATE posts SET ${updates.join(", ")} WHERE id = ?${paramIndex}`, values);
}

export async function deletePost(id: number): Promise<void> {
  await db.execute("DELETE FROM posts WHERE id = ?1", [id]);
}

export async function getPostsCount(blogSlug?: string): Promise<number> {
  let query = "SELECT COUNT(*) as count FROM posts";
  const params: unknown[] = [];

  if (blogSlug) {
    query += " WHERE blog_slug = ?1";
    params.push(blogSlug);
  }

  const result = await db.execute(query, params);
  return Number(result.rows[0]?.count ?? 0);
}

// Pages
export async function getAllPages(): Promise<Page[]> {
  const result = await db.execute("SELECT * FROM pages ORDER BY created_at DESC");
  return result.rows.map((row) => parseRow<Page>(row));
}

export async function getPageById(id: number): Promise<Page | null> {
  const result = await db.execute("SELECT * FROM pages WHERE id = ?1", [id]);
  return result.rows[0] ? parseRow<Page>(result.rows[0]) : null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const result = await db.execute("SELECT * FROM pages WHERE slug = ?1", [slug]);
  return result.rows[0] ? parseRow<Page>(result.rows[0]) : null;
}

export async function createPage(
  data: Omit<Page, "id" | "created_at" | "updated_at">
): Promise<void> {
  const keys = Object.keys(data);
  const placeholders = keys.map((_, i) => `?${i + 1}`).join(", ");
  const values = Object.values(data);

  await db.execute(`INSERT INTO pages (${keys.join(", ")}) VALUES (${placeholders})`, values);
}

export async function updatePage(
  id: number,
  data: Partial<Omit<Page, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    updates.push(`${key} = ?${paramIndex++}`);
    values.push(value);
  });

  updates.push(`updated_at = ?${paramIndex++}`);
  values.push(Math.floor(Date.now() / 1000));

  values.push(id);

  await db.execute(`UPDATE pages SET ${updates.join(", ")} WHERE id = ?${paramIndex}`, values);
}

export async function deletePage(id: number): Promise<void> {
  await db.execute("DELETE FROM pages WHERE id = ?1", [id]);
}

// Contact Submissions
export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const result = await db.execute("SELECT * FROM contact_submissions ORDER BY created_at DESC");
  return result.rows.map((row) => parseRow<ContactSubmission>(row));
}

export async function getContactSubmissionById(id: number): Promise<ContactSubmission | null> {
  const result = await db.execute("SELECT * FROM contact_submissions WHERE id = ?1", [id]);
  return result.rows[0] ? parseRow<ContactSubmission>(result.rows[0]) : null;
}

export async function createContactSubmission(
  data: Omit<ContactSubmission, "id" | "created_at">
): Promise<void> {
  const keys = Object.keys(data);
  const placeholders = keys.map((_, i) => `?${i + 1}`).join(", ");
  const values = Object.values(data);

  await db.execute(
    `INSERT INTO contact_submissions (${keys.join(", ")}) VALUES (${placeholders})`,
    values
  );
}

export async function updateContactSubmission(
  id: number,
  data: Partial<Omit<ContactSubmission, "id" | "created_at">>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    updates.push(`${key} = ?${paramIndex++}`);
    values.push(value);
  });

  values.push(id);

  await db.execute(
    `UPDATE contact_submissions SET ${updates.join(", ")} WHERE id = ?${paramIndex}`,
    values
  );
}

export async function deleteContactSubmission(id: number): Promise<void> {
  await db.execute("DELETE FROM contact_submissions WHERE id = ?1", [id]);
}

export async function getContactSubmissionsCount(): Promise<number> {
  const result = await db.execute("SELECT COUNT(*) as count FROM contact_submissions");
  return Number(result.rows[0]?.count ?? 0);
}

// Redirects
export async function getAllRedirects(): Promise<Redirect[]> {
  const result = await db.execute("SELECT * FROM redirects ORDER BY created_at DESC");
  return result.rows.map((row) => parseRow<Redirect>(row));
}

export async function getRedirectById(id: number): Promise<Redirect | null> {
  const result = await db.execute("SELECT * FROM redirects WHERE id = ?1", [id]);
  return result.rows[0] ? parseRow<Redirect>(result.rows[0]) : null;
}

export async function createRedirect(data: Omit<Redirect, "id" | "created_at">): Promise<void> {
  const keys = Object.keys(data);
  const placeholders = keys.map((_, i) => `?${i + 1}`).join(", ");
  const values = Object.values(data);

  await db.execute(`INSERT INTO redirects (${keys.join(", ")}) VALUES (${placeholders})`, values);
}

export async function updateRedirect(
  id: number,
  data: Partial<Omit<Redirect, "id" | "created_at">>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    updates.push(`${key} = ?${paramIndex++}`);
    values.push(value);
  });

  values.push(id);

  await db.execute(`UPDATE redirects SET ${updates.join(", ")} WHERE id = ?${paramIndex}`, values);
}

export async function deleteRedirect(id: number): Promise<void> {
  await db.execute("DELETE FROM redirects WHERE id = ?1", [id]);
}
