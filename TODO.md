# TODO List

> **Legend:** ✅ = done, 🟡 = partially done, ❌ = needs manual work
>
> Last updated: March 7, 2026

---

## 🔐 Security & Authentication

- [ ] **Replace hardcoded admin password** — `weed123` is hardcoded in `lib/password.ts:36`. Move to env var `ADMIN_PASSWORD` or store a bcrypt hash in `ADMIN_PASSWORD_HASH`.
- [ ] **Use bcrypt/argon2 for password hashing** — Currently uses SHA-256 + `timingSafeEqual`. Switch to `bcrypt` (cost ≥ 10) or `argon2id` for proper slow hashing.
- [ ] **Add auth middleware** — No `middleware.ts` exists. Admin routes are not protected by middleware; anyone can hit `/admin/*` without a session cookie being checked at the edge.
- [ ] Add CSRF protection for admin forms
- [ ] Add multi-factor authentication (optional)
- ✅ Rate limiting for login (5 attempts / 15 min, in-memory store)
- ✅ Session cookies (JWT, 7-day expiry, HttpOnly, Secure, SameSite=Lax)

## 🗄️ Database

- [ ] Add foreign key constraints in `schema.sql` (none exist currently)
- [ ] Implement soft delete for posts/pages instead of hard delete
- [ ] Add audit trail table for tracking admin changes
- [ ] Create database backup strategy (Turso point-in-time or scheduled dump)
- [ ] Add database seeding script for development/testing
- ✅ Database indexes on slugs, status, published_at, etc. (in `schema.sql`)

## 📝 Content Management

- [ ] Implement image upload directly in markdown editor (currently shows `![](url)` hint only)
- [ ] Add draft auto-save functionality
- [ ] Add post/page versioning/revision history
- [ ] Implement scheduled publishing for future dates
- [ ] Add categories/tags system for posts
- [ ] Add search functionality for posts/pages in admin
- [ ] Add bulk actions (delete, change status) for posts/pages
- [ ] **Wire up contact form to actually save submissions** — currently shows "Future: This will be connected to a backend API"
- ✅ Markdown editor with preview toggle (`components/MarkdownEditor.tsx`)

## 🎨 Frontend

- [ ] Implement error boundaries for better error handling
- [ ] Add custom 404 page design
- [ ] Add sitemap.xml generation
- [ ] Add RSS feed for blog posts
- [ ] Implement OpenGraph image generation for posts
- [ ] Add breadcrumbs for better navigation
- [ ] **Finish pagination** — pagination UI exists on `/blogs/news` but data is not database-driven yet
- [ ] Add related posts functionality
- [ ] Replace `<img>` tags with `next/image` for optimization
- 🟡 Loading states (Suspense used in login page, MarkdownEditor has loading state)
- ✅ Social sharing buttons (`components/ShareBar.tsx`, used on news posts)

## 📧 Contact Form

- [ ] Add email notifications for new submissions (e.g. Resend, SendGrid, or SES)
- [ ] Implement spam detection (hCaptcha, Turnstile, or honeypot field)
- [ ] Add auto-response email to submitters
- [ ] Add custom fields configuration in settings
- [ ] Implement webhooks for form submissions

## 📊 Analytics & SEO

- [ ] Add Google Analytics or Plausible/Umami
- [ ] Implement structured data (JSON-LD) for blog posts
- [ ] Add meta tag preview in post/page editor
- [ ] Add `robots.txt` (none in `/public`)
- [ ] Add canonical URL management
- [ ] Implement redirect chain detection and prevention

## 🚀 Performance

- [ ] Add Redis or edge caching for frequently accessed data
- [ ] Add image optimization with `next/image` (currently using raw `<img>` tags)
- [ ] Lazy load images and heavy components
- [ ] Implement service worker for offline support
- [ ] Add bundle size monitoring
- ✅ On-demand revalidation via `revalidatePath()` in admin actions

## 🧪 Testing

- [ ] Add unit tests for utility functions
- [ ] Add integration tests for API routes
- [ ] Add E2E tests for critical admin flows (login, post creation)
- [ ] Add component tests for React components
- [ ] Set up CI/CD pipeline with automated tests

## 📱 Mobile & Accessibility

- [ ] Test and improve mobile responsiveness
- [ ] Add accessibility testing (axe, WAVE)
- [ ] Implement keyboard navigation for admin panel
- [ ] Add ARIA labels where needed
- [ ] Test with screen readers

## 🛠️ Developer Experience

- [ ] Add ESLint enforcement in CI
- [ ] Add Prettier pre-commit hooks (husky + lint-staged)
- [ ] Add TypeScript strict mode
- [ ] Create component library/design system documentation
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Add development environment setup script
- ✅ ESLint configured and passing (0 errors)
- ✅ Dev container configured (`.devcontainer/`)

## 📦 Features

- [ ] Add user comments system for blog posts
- [ ] Implement newsletter subscription
- [ ] Add print stylesheet
- [ ] Implement dark mode
- [ ] Add multi-language support (i18n)
- [ ] Add admin activity log/audit trail viewer
- [ ] Implement admin user roles and permissions (if multi-user)
- ✅ Social sharing buttons (`ShareBar` component)

## 🐛 Bug Fixes

- [ ] Test all edge cases in redirect rules
- [ ] Validate all form inputs on server side
- [ ] Handle database connection errors gracefully
- [ ] Test media upload with large files
- [ ] Verify all timestamp handling (timezone consistency)

## 📚 Documentation

- [ ] Add inline code comments for complex logic
- [ ] Create API documentation
- [ ] Document component props with JSDoc
- [ ] Add architecture decision records (ADRs)
- [ ] Create video tutorials for admin panel
- [ ] Document deployment process

## 🔄 Maintenance

- [ ] Set up Dependabot for dependency updates
- [ ] Create update strategy for Next.js major versions
- [ ] Monitor and update deprecated dependencies
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Implement health check endpoint
- [ ] Add database migration rollback strategy

---

## Priority Legend

🔥 **High Priority** - Security, critical bugs, or blocking issues  
⭐ **Medium Priority** - Important features and improvements  
💡 **Low Priority** - Nice-to-have features and optimizations

## Notes

- Review and prioritize tasks based on current project needs
- Check completed items and move to a DONE.md file periodically
- Add new tasks as they are discovered during development
