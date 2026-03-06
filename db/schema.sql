-- Pins & Needles Website Database Schema
-- SQLite / Turso

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nav_items TEXT, -- JSON
  social_links TEXT, -- JSON
  primary_ticket_link TEXT,
  fundraising_link TEXT,
  head_inject_html TEXT,
  body_end_inject_html TEXT,
  home_body_markdown TEXT,
  site_name TEXT,
  default_og_image_url TEXT,
  default_meta_description TEXT,
  about_canonical_path TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blog_slug TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT,
  excerpt TEXT,
  body_markdown TEXT,
  featured_image_url TEXT,
  seo_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at INTEGER, -- Unix timestamp
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_posts_blog_slug ON posts(blog_slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  body_markdown TEXT,
  seo_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at INTEGER, -- Unix timestamp
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  comment TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  is_spam INTEGER DEFAULT 0, -- Boolean: 0 = false, 1 = true
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_spam ON contact_submissions(is_spam);

CREATE TABLE IF NOT EXISTS redirects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 302,
  enabled INTEGER NOT NULL DEFAULT 1, -- Boolean: 0 = false, 1 = true
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_redirects_from_path ON redirects(from_path);
CREATE INDEX IF NOT EXISTS idx_redirects_enabled ON redirects(enabled);
