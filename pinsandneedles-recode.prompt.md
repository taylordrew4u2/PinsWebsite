---
description: "Recode pinsandneedlescomedy.com on Vercel (no merch) — 4-pass Copilot build plan"
---

# Pins & Needles Comedy — Recode on Vercel (4 passes, no merch)

Use this file as a reusable Copilot prompt. Run **one pass at a time** by copying the corresponding **PASS** section into Copilot Chat, so it doesn’t get overwhelmed.

---

## PASS 1 — Repo + framework setup + routing skeleton (no database yet)

You are GitHub Copilot working inside an empty repo. Build a production-ready re-code of `pinsandneedlescomedy.com` on Vercel with NO ecommerce/merch/cart/checkout features. Preserve the current “content-first, multi-page, blog-driven” behavior and Shopify-like URL structure listed below.

STACK (must use all):
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- ESLint + Prettier
- Vercel deployment target (no custom server)

ROUTING (must create these routes exactly; content can be placeholder in this pass):
- `/` (Home)
- `/blogs/news` (News index, accepts `?page=2` style pagination)
- `/blogs/news/[slug]` (News article)
- `/blogs/comic-submission` (Submit landing, index-style)
- `/blogs/comic-submission/[slug]` (Submission article; include slug `how-to-submit` in seed content later)
- `/pages/contact` (Contact page with form UI)
- `/pages/about-us` (About page route)
- ALSO support `/blogs/news/about-us-pins-needles-comedy` as an “alternate About content location” route (treat as canonical content source later, but route must work)

SITE BEHAVIOR REQUIREMENTS (implement now):
- Multi-page / full-page navigation behavior (MPA feel). Use plain `<a>` anchors in nav instead of client router links.
- Accessibility baseline: “Skip to content” link at top, semantic headings, labeled inputs.
- Global chrome: persistent header/nav across pages.
- Header nav items (NO Merch item):
  - Instagram (external)
  - Home
  - News
  - Submit
  - About Us
  - HELP FUND FRINGE (external)
- Home page must contain a prominent “tickets/RSVP” outbound link (to Partiful; URL will be configurable later).
- Outbound integrations are simple links (no embeds required): Instagram, Partiful tickets/RSVP, GoFundMe fundraising.
- Add a tiny note somewhere in the header or footer matching the existing accessibility signal: “Choosing a selection results in a full page refresh.”

FUTURE-PROOFING HOOKS (stub now; real implementation in later passes):
- Create a site-wide “script injection layer” in the layout that can later insert admin-configured HTML into `<head>` and end of `<body>` (initially empty placeholders).

DELIVERABLES:
1) Initialize Next.js App Router TypeScript project.
2) Install/config Tailwind, ESLint, Prettier.
3) Implement:
   - `app/layout.tsx` (global header/nav + skip link + injection placeholders)
   - `app/page.tsx` (Home)
   - `app/blogs/news/page.tsx` (News index placeholder with pagination UI reading `searchParams.page`)
   - `app/blogs/news/[slug]/page.tsx` (News article placeholder + Share/Copy UI placeholder)
   - `app/blogs/comic-submission/page.tsx` (Submit landing placeholder)
   - `app/blogs/comic-submission/[slug]/page.tsx` (Submit article placeholder)
   - `app/pages/contact/page.tsx` (Contact form UI: Name, Email, Phone number, Comment + Send button)
   - `app/pages/about-us/page.tsx` (About placeholder)
4) Styling: clean, simple, white background, readable typography, responsive.
5) No ecommerce UI: no cart icon, no checkout, no product pages, no Shopify remnants.

ACCEPTANCE CHECK:
- All routes above render without errors.
- Nav persists across pages.
- Contact page shows all required fields with labels.
- Home shows tickets link and HELP FUND FRINGE link.
- Navigation uses full page loads (anchors).

---

## PASS 2 — Vercel Postgres CMS + admin + content schema + forms backend

You are GitHub Copilot. Add a database-backed CMS using Vercel Postgres so News posts + static pages can be drafted/published without code changes. Keep the same routes and MPA feel. Use Next.js server components + server actions or route handlers (no separate backend server).

STACK ADDITIONS (must use all):
- Vercel Postgres
- Drizzle ORM (Postgres)
- Zod (validation)
- react-hook-form (admin forms)
- Markdown rendering pipeline (remark + remark-gfm + rehype-sanitize + rehype-stringify)
- Vercel Blob (optional but implement) for featured images/uploads
- Auth for `/admin` (simple + robust): Auth.js / NextAuth with GitHub OAuth; allowlist admin emails via env

CONTENT MODEL (must replicate Shopify primitives: Blogs/Articles + Pages + Navigation):
Create these tables (Drizzle schema + migrations):
1) `site_settings`
   - id (single row)
   - nav_items JSON (array of { label, href, external, targetBlank })
   - social_links JSON (include Instagram)
   - primary_ticket_link TEXT (Partiful)
   - fundraising_link TEXT (GoFundMe)
   - head_inject_html TEXT (for analytics/scripts later)
   - body_end_inject_html TEXT
2) `posts`
   - id, blog_slug (e.g. `news`, `comic-submission`)
   - slug (unique per blog_slug)
   - title
   - excerpt
   - body_markdown
   - body_html (optional cache)
   - featured_image_url
   - seo_title
   - meta_description
   - status ENUM: `draft` | `published`
   - published_at TIMESTAMP
   - created_at, updated_at
3) `pages`
   - id
   - slug (e.g. `about-us`, `contact` if needed)
   - title
   - body_markdown
   - seo_title
   - meta_description
   - status ENUM
   - published_at TIMESTAMP
4) `contact_submissions`
   - id
   - name, email, phone, comment
   - user_agent, ip_hash (do not store raw IP), created_at
   - spam_score / is_spam boolean

ADMIN UI (must implement):
- `/admin` dashboard
- `/admin/settings` to edit site_settings (nav links, ticket link, fundraising link, script injection HTML)
- `/admin/posts` list + create/edit for:
  - News blog (`blog_slug=news`)
  - Comic submission blog (`blog_slug=comic-submission`)
- `/admin/pages` list + create/edit for static pages (at minimum About content)
- Editor: textarea Markdown + live preview rendered HTML.
- Publish/unpublish controls. Publishing sets `published_at`.
- Add “preview draft” capability via a query token only for admins (simple implementation ok).

FORMS BACKEND (must implement now):
- Implement Contact form submission endpoint:
  - Keep public UI at `/pages/contact`
  - Create a POST handler or server action to store submission in `contact_submissions`
  - Anti-spam: honeypot field + basic rate limit (per ip_hash) + minimum time-to-submit check
  - Optional: Cloudflare Turnstile support via env flags (implement hooks even if disabled by default)
- Destination behavior: store in DB and (also) send an email notification via Resend (implement; controlled by env vars). No third-party form SaaS.

DATA SEEDING (must implement):
- Seed `site_settings` with placeholders for:
  - Instagram URL
  - GoFundMe URL
  - Partiful URL
  - Nav items exactly: Instagram, Home, News, Submit, About Us, HELP FUND FRINGE
- Seed minimal content:
  - One published News post example
  - One published Comic Submission post with slug `how-to-submit` and body containing `admin@pinsandneedlescomedy.com`
  - One About content stored as a News post with slug `about-us-pins-needles-comedy` (this is the alternate/canonical-about content)

DELIVERABLES:
- Drizzle schema in `db/schema.ts` + migration scripts
- Vercel Postgres connection via env vars
- Admin auth + allowlist
- Admin CRUD screens + server actions
- Contact submission backend + spam controls + email notification

ACCEPTANCE CHECK:
- Admin can create/edit/publish posts and pages.
- News posts + submission instructions exist in DB and are retrievable.
- Contact form submits, stores record, respects honeypot/rate limit, and can email if configured.
- Script injection fields exist in settings (and are wired into layout).

---

## PASS 3 — Public rendering parity: templates, pagination, share UI, SEO metadata

You are GitHub Copilot. Replace placeholder public pages with database-driven rendering that preserves current behavior and SEO characteristics (SSR/SSG-friendly HTML, stable paths, headings, metadata). Keep MPA feel (anchors).

PUBLIC PAGE REQUIREMENTS (must implement all):
1) Home `/`
- Pull from `site_settings`:
  - Primary ticket link (Partiful) prominent CTA
  - Fundraising link (GoFundMe) accessible from nav and optionally home
- Include primary brand description area (editable later; simplest: add `home_body_markdown` to `site_settings` and render it).
- No merch/cart/checkout.

2) News index `/blogs/news`
- Query `posts` where `blog_slug='news'` and `status='published'`, ordered by `published_at desc`
- Render post cards with title, excerpt, published date, featured image (optional)
- Pagination driven by query param `?page=N` (server-driven). Use page size 10.
- Generate pagination links that are crawlable.

3) News article `/blogs/news/[slug]`
- Render rich content from Markdown → sanitized HTML.
- Preserve structured headings from Markdown (h2/h3 etc).
- Include Share UI:
  - “Copy link” button (client component using Clipboard API)
  - Optional “Share” using Web Share API if available
- Include canonical URL meta and OG tags.

4) Submit landing `/blogs/comic-submission`
- Implement as blog index template filtered to `blog_slug='comic-submission'`.
- In practice, it will show the single article `how-to-submit` (but support more posts anyway).

5) Submit article `/blogs/comic-submission/[slug]`
- Same template behavior as News article.
- Ensure `admin@pinsandneedlescomedy.com` appears in the `how-to-submit` content.

6) Contact `/pages/contact`
- Use the same UI fields:
  - Name, Email, Phone number, Comment, Send
- Post to the backend implemented in PASS 2.
- Add confirmation UX (success state) and accessible error messages.

7) About dual-location support (migration-risk handling)
- `/pages/about-us` must render substantive About content.
- `/blogs/news/about-us-pins-needles-comedy` must also render the About content (it may be the canonical source).
- Implement canonical strategy:
  - Choose ONE canonical URL for About (set `<link rel="canonical">` accordingly).
  - The non-canonical route should 301 redirect OR render but point canonical to the chosen one. Implement 301 if safe.

SEO / INDEXING REQUIREMENTS (must implement):
- Stable URL paths: keep exactly the Shopify-like paths already used.
- Per-page metadata parity fields: use `seo_title` and `meta_description` if present; fall back to `title` and excerpt.
- Generate `robots.txt` and `sitemap.xml` (use `next-sitemap`).
- Ensure News pagination pages are indexable.
- Add JSON-LD for BlogPosting on article pages (title, datePublished, headline, image if present).

ACCESSIBILITY REQUIREMENTS (must implement):
- Keep “Skip to content.”
- Visible focus styles.
- Labeled inputs and semantic form errors.
- Maintain the “Choosing a selection results in a full page refresh” statement.

PERFORMANCE REQUIREMENTS (must implement):
- Use `next/image` where possible.
- Use ISR or cached fetching:
  - Public pages should be statically cacheable with revalidation (e.g. `revalidate = 60` or tag-based revalidation triggered by admin publish).
- Ensure asset cache busting via Next build output (hashed assets).

DELIVERABLES:
- Replace placeholder pages with DB-driven rendering.
- Add `lib/content.ts` with fetch functions (cached).
- Add `components/ShareBar.tsx` client component for copy/share.
- Add metadata generation via `generateMetadata` in routes.

ACCEPTANCE CHECK:
- News index paginates via `?page=2` etc.
- Article pages render sanitized HTML from Markdown with headings.
- About works at both routes with canonical handling.
- sitemap + robots exist.

---

## PASS 4 — Security headers, redirects, migration helpers, DNS cutover checklist

You are GitHub Copilot. Harden the site for launch: security headers, redirect strategy, monitoring, and migration utilities. Preserve behavior while moving off Shopify.

SECURITY HEADERS (must implement a modern baseline on Vercel):
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: set conservative defaults (disable sensitive APIs unless needed)
- Strict-Transport-Security (HSTS): enable AFTER confirming HTTPS works on the new host
- Frame protections: use CSP `frame-ancestors 'none'` (unless intentional embeds are required)
- Content-Security-Policy:
  - Implement CSP in REPORT-ONLY first (Content-Security-Policy-Report-Only) to avoid breaking Next inline scripts.
  - Include a path to later enforce CSP with nonces/hashes if desired.
  - Ensure your script injection layer is compatible with CSP planning.
Implement via `next.config.ts` `headers()` or `vercel.json`.

REDIRECTS / URL STRATEGY (must implement):
- Primary goal: keep existing paths to minimize SEO loss.
- Implement 301 redirects only where necessary (e.g., About canonicalization if chosen).
- Add a `redirects` table (optional) or a config map for future 301s.
- Add a post-launch 404 logging strategy:
  - Log unknown routes to Vercel logs with request path + referrer (no PII).

MIGRATION HELPERS (must implement):
- Create `scripts/import-shopify-blog.ts` to import exported Shopify blog/articles CSV into `posts`:
  - Map: handle -> slug, title, body_html/body_markdown, published_at, excerpt, meta fields.
  - Support importing News and comic-submission blogs.
- Create `scripts/generate-redirects.ts` that can output a CSV of old->new if routes ever change.
- Add `README_MIGRATION.md` containing:
  - URL inventory list (all required routes)
  - Redirect policy
  - SEO checklist
  - Form deliverability checklist
  - Post-launch crawl steps

FORMS / EMAIL DELIVERABILITY HARDENING (must implement):
- Add SPF/DKIM/DMARC notes in docs (do not configure automatically).
- Ensure contact submissions store + email notifications handle retries/failures.
- Add basic abuse protection: rate limit + honeypot already exists; add server-side length limits and Zod validation.

DNS CUTOVER NOTES (must document clearly):
- Current Shopify DNS patterns for reference (do not apply after migration):
  - A record often points to `23.227.38.65`
  - CNAME often points to `shops.myshopify.com.`
- New host is Vercel:
  - Switch apex and www to Vercel’s recommended records in Vercel dashboard.
  - Verify TLS issuance and enforce HTTPS before enabling HSTS.
  - Verify apex and www behavior (redirect one to the other).

SEO PRESERVATION (must implement):
- Ensure canonical tags on all pages.
- Ensure sitemap contains:
  - `/`
  - `/blogs/news` + pagination pages if you choose to include them
  - every published article
  - `/blogs/comic-submission`
  - `/pages/contact`
  - `/pages/about-us` (or canonical target)
- Add Open Graph defaults in settings (site name, default image optional).

FINAL QA CHECKLIST (must add as `QA_CHECKLIST.md`):
- Crawl for 404s
- Verify redirects
- Validate metadata and canonical
- Verify News pagination indexability
- Validate contact form submission flow and spam controls
- Cross-device accessibility checks (keyboard nav, skip link, labels)
