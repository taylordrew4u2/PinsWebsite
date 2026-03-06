import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  navItems: text("nav_items", { mode: "json" }).$type<
    { label: string; href: string; external?: boolean; targetBlank?: boolean }[]
  >(),
  socialLinks: text("social_links", { mode: "json" }).$type<{ instagram?: string }>(),
  primaryTicketLink: text("primary_ticket_link"),
  fundraisingLink: text("fundraising_link"),
  headInjectHtml: text("head_inject_html"),
  bodyEndInjectHtml: text("body_end_inject_html"),
  homeBodyMarkdown: text("home_body_markdown"),
  siteName: text("site_name"),
  defaultOgImageUrl: text("default_og_image_url"),
  defaultMetaDescription: text("default_meta_description"),
  aboutCanonicalPath: text("about_canonical_path"),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  blogSlug: text("blog_slug").notNull(),
  slug: text("slug").notNull(),
  title: text("title"),
  excerpt: text("excerpt"),
  bodyMarkdown: text("body_markdown"),
  featuredImageUrl: text("featured_image_url"),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title"),
  bodyMarkdown: text("body_markdown"),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const contactSubmissions = sqliteTable("contact_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  comment: text("comment"),
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
  isSpam: integer("is_spam", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const redirects = sqliteTable("redirects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(302),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
