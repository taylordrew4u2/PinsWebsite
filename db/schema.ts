import { boolean, integer, json, serial, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  navItems: json("nav_items").$type<
    { label: string; href: string; external?: boolean; targetBlank?: boolean }[]
  >(),
  socialLinks: json("social_links").$type<{ instagram?: string }>(),
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

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  blogSlug: text("blog_slug").notNull(),
  slug: text("slug").notNull(),
  title: text("title"),
  excerpt: text("excerpt"),
  bodyMarkdown: text("body_markdown"),
  featuredImageUrl: text("featured_image_url"),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title"),
  bodyMarkdown: text("body_markdown"),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  comment: text("comment"),
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
  isSpam: boolean("is_spam").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const redirects = pgTable("redirects", {
  id: serial("id").primaryKey(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(302),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
