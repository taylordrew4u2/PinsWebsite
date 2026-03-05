---
description: "Admin requirement: /admin editable CMS with password login"
---

# Admin: editable-everything CMS via /admin with password "weed"

Copy/paste this entire prompt into GitHub Copilot Chat to implement a password-protected admin that can edit **everything** (content, settings, redirects, and submissions) via `/admin`.

---

You are GitHub Copilot working in the existing Next.js (App Router) + TypeScript + Tailwind + Drizzle + Vercel Postgres project for `pinsandneedlescomedy.com`.

GOAL:
- Add a complete admin system reachable at `/admin`.
- Access is protected by a **single password**: `weed`.
- After logging in, I can edit **everything** that controls the public site.

AUTH REQUIREMENTS (password-only admin):
- Create `/admin/login` (GET) showing a password field and a “Sign in” button.
- Password must be exactly: `weed`.
- Do NOT hardcode the password comparison in client code. Validate password on the server only.
- Implement protection for **all** `/admin/*` routes using `middleware.ts` and `matcher: ['/admin/:path*']`.
- If not authenticated and visiting `/admin/*` (except `/admin/login`), redirect to `/admin/login?next=<originalPath>`.
- Create a server route handler `app/admin/login/route.ts` (POST) that:
  - validates the submitted password server-side
  - on success: sets an HttpOnly cookie that authenticates future `/admin/*` requests
  - on failure: returns a safe error
- Cookie rules:
  - Name: `pn_admin_session`
  - HttpOnly: true
  - Secure: true in production
  - SameSite: Lax
  - Path: `/admin`
  - MaxAge: 7 days
- Session token rules:
  - Use a signed token (JWT via `jose` or HMAC-signed token) so it works in serverless.
  - Store signing secret in env: `ADMIN_SESSION_SECRET`.
- Add `/admin/logout` (POST or GET) to clear the cookie and redirect to `/admin/login`.

PASSWORD STORAGE / VERIFICATION:
- Password is `weed`, but do not store plaintext in DB.
- Use a safe verification approach:
  - simplest acceptable: compare server-side against env `ADMIN_PASSWORD` defaulting to `weed`
  - preferred: store a hash in env (e.g. `ADMIN_PASSWORD_HASH`) and verify using a slow hash function (argon2id/scrypt/bcrypt). If using bcrypt, use cost >= 10 and enforce max length.
- Implement constant-time comparison (`timingSafeEqual`) for derived keys / signatures.

ADMIN “EDIT EVERYTHING” SCOPE:
Build admin screens so I can edit *all* of these without code changes:

A) Site settings (`site_settings` table)
- Nav items editor (reorder + add/remove): label, href, external, targetBlank
- Social links (at least Instagram)
- Primary ticket link (Partiful)
- Fundraising link (GoFundMe)
- `head_inject_html` (site-wide head script injection)
- `body_end_inject_html` (site-wide end-of-body injection)
- `home_body_markdown` (add this column if missing) to edit homepage main copy
- Global SEO defaults (add fields if missing): site_name, default_og_image_url, default_meta_description
- About canonical path selector (add if missing): `about_canonical_path` with allowed values:
  - `/pages/about-us`
  - `/blogs/news/about-us-pins-needles-comedy`

B) Posts (`posts` table)
- Full CRUD for:
  - News (`blog_slug='news'`)
  - Comic submission (`blog_slug='comic-submission'`)
- Fields editable:
  - slug, title, excerpt
  - body_markdown + live preview
  - featured_image_url (upload/select via Vercel Blob; store URL)
  - seo_title, meta_description
  - status (draft/published), published_at
- Add a “Duplicate post” action.
- Add “Preview draft”:
  - Generate an admin-only preview token (signed) and allow viewing draft pages at the normal public URL with `?preview=<token>`.
  - Preview token is validated server-side and only allows reading drafts.

C) Pages (`pages` table)
- Full CRUD for static pages (About content must be editable here too).
- Same markdown editor + preview + SEO fields + publish controls.

D) Redirect management (new feature)
- Add `redirects` table:
  - from_path (unique), to_path, status_code (301/302), enabled boolean, created_at
- Admin UI at `/admin/redirects`:
  - CRUD + enable/disable
- Implement redirect execution in `middleware.ts` (before auth redirect logic where safe):
  - apply redirects for public routes
  - avoid redirect loops
  - do not redirect `_next/*`, `api/*`, `favicon.ico`, `robots.txt`, `sitemap.xml`

E) Contact submissions (`contact_submissions` table)
- Admin UI at `/admin/submissions`:
  - list view with filters (date range, is_spam)
  - view detail
  - mark as spam / not spam
  - delete
  - export CSV (server route) without exposing raw IP (only `ip_hash`)

ADMIN UX REQUIREMENTS:
- `/admin` dashboard with clear links to:
  - Settings
  - News Posts
  - Comic Submission Posts
  - Pages
  - Redirects
  - Contact Submissions
  - Media (Blob uploads browser)
- Use server actions for mutations where appropriate.
- Validate all inputs with Zod server-side.
- Ensure routes are protected by middleware + server-side checks (do not rely on client-only guards).

SECURITY BASELINES:
- Rate limit `/admin/login` attempts per IP hash (e.g. 5 per 15 minutes).
- Log failed login attempts to server logs (no plaintext password).
- Ensure cookies are set using Next.js response cookie APIs and are only set in route handlers/server actions.

DELIVERABLES:
- `middleware.ts` protecting `/admin/:path*` and applying redirect rules safely
- `/admin/login` page + POST handler
- `/admin/logout`
- Admin layouts and pages:
  - `/admin` (dashboard)
  - `/admin/settings`
  - `/admin/posts` (News)
  - `/admin/posts/comic-submission`
  - `/admin/pages`
  - `/admin/redirects`
  - `/admin/submissions`
  - `/admin/media` (Blob upload/list)
- DB migrations for any added columns/tables
- Update README with env vars:
  - ADMIN_SESSION_SECRET
  - ADMIN_PASSWORD (default weed) OR ADMIN_PASSWORD_HASH
  - BLOB_READ_WRITE_TOKEN (if needed)
  - DATABASE_URL / Vercel Postgres env vars

ACCEPTANCE CHECK:
- Visiting `/admin` prompts login.
- Logging in with password `weed` grants access.
- Logging out removes access.
- I can edit nav links, ticket link, fundraising link, home copy, SEO defaults, scripts injection, posts, pages, redirects, and view/export contact submissions — all from `/admin`.
