// Database Types
// Manually defined types for SQL tables

export interface SiteSettings {
  id: number;
  nav_items: string | null; // JSON string
  social_links: string | null; // JSON string
  primary_ticket_link: string | null;
  fundraising_link: string | null;
  head_inject_html: string | null;
  body_end_inject_html: string | null;
  home_body_markdown: string | null;
  site_name: string | null;
  default_og_image_url: string | null;
  default_meta_description: string | null;
  about_canonical_path: string | null;
}

export interface Post {
  id: number;
  blog_slug: string;
  slug: string;
  title: string | null;
  excerpt: string | null;
  body_markdown: string | null;
  featured_image_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  status: string;
  published_at: number | null; // Unix timestamp
  created_at: number;
  updated_at: number;
}

export interface Page {
  id: number;
  slug: string;
  title: string | null;
  body_markdown: string | null;
  seo_title: string | null;
  meta_description: string | null;
  status: string;
  published_at: number | null; // Unix timestamp
  created_at: number;
  updated_at: number;
}

export interface ContactSubmission {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  comment: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  is_spam: number; // 0 or 1
  created_at: number;
}

export interface Redirect {
  id: number;
  from_path: string;
  to_path: string;
  status_code: number;
  enabled: number; // 0 or 1
  created_at: number;
}
