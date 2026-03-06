This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_SESSION_SECRET` | **Yes** | Secret key for signing JWT admin session tokens (use a long random string) |
| `DATABASE_URL` or `POSTGRES_URL` | Yes (for DB features) | Vercel Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Yes (for media uploads) | Vercel Blob read/write token |

**Note:** Admin password is hardcoded to `weed123` in `lib/password.ts` and cannot be changed via environment variables.

Example `.env.local`:

```env
ADMIN_SESSION_SECRET=some-long-random-secret-here
POSTGRES_URL=postgres://...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

## Admin Panel

Access the admin panel at `/admin`. You will be redirected to `/admin/login` if not authenticated.

The admin includes:
- **Settings** — Site name, nav items, social links, SEO defaults, HTML injection
- **News Posts** — Create, edit, delete, duplicate news articles
- **Comic Submission Posts** — Manage comic submission content
- **Pages** — Static page management
- **Redirects** — URL redirect rules with enable/disable
- **Contact Submissions** — View, filter, mark spam, export CSV
- **Media** — Upload files to Vercel Blob

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
