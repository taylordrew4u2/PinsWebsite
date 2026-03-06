This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (Turso) with raw SQL
- **Styling**: Tailwind CSS 4
- **Storage**: Vercel Blob (for media uploads)
- **Authentication**: JWT sessions with hardcoded admin password

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section below).

### 3. Set Up Database

Run the database migration to create tables:

```bash
npm run db:migrate
```

### 4. Run Development Server

Start the development server:

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
| `TURSO_DATABASE_URL` | **Yes** | Turso database connection URL (libsql://) |
| `TURSO_AUTH_TOKEN` | **Yes** | Turso authentication token |
| `BLOB_READ_WRITE_TOKEN` | Yes (for media uploads) | Vercel Blob read/write token |

**Note:** Admin password is hardcoded to `weed123` in `lib/password.ts` and cannot be changed via environment variables.

Example `.env.local`:

```env
ADMIN_SESSION_SECRET=some-long-random-secret-here
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQS...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

## Database

This project uses **Turso** (SQLite edge database) with **raw SQL** queries.

### Schema

The database schema is defined in `db/schema.sql` and includes:
- **site_settings** — Site configuration (nav, social links, SEO defaults, HTML injection)
- **posts** — Blog posts (news and comic submissions)
- **pages** — Static content pages
- **contact_submissions** — Contact form submissions
- **redirects** — URL redirect rules

### Database Files

```
db/
├── schema.sql          # SQL schema definition
├── migrate.js          # Migration script
├── index.ts            # Turso client connection
├── types.ts            # TypeScript type definitions
└── queries.ts          # Query helper functions
```

### Running Migrations

```bash
# Apply schema to database
npm run db:migrate
```

### Setting Up Turso

1. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Sign up: `turso auth signup`
3. Create database: `turso db create pins-website`
4. Get URL: `turso db show pins-website --url`
5. Create token: `turso db tokens create pins-website`
6. Add credentials to `.env.local`

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

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes (auth)
│   ├── blogs/             # Public blog pages
│   └── pages/             # Public static pages
├── components/            # React components
├── db/                    # Database
│   ├── schema.sql        # SQL schema
│   ├── migrate.js        # Migration script
│   ├── index.ts          # Database client
│   ├── types.ts          # TypeScript types
│   └── queries.ts        # Query helpers
├── lib/                   # Utility functions
│   ├── auth.ts           # JWT authentication helpers
│   └── password.ts       # Password verification
└── public/               # Static assets
```

## Development Notes

- Admin password is currently hardcoded in `lib/password.ts` — see [TODO.md](TODO.md) for planned security improvements
- Database schema changes should be made in `db/schema.sql`, then run `npm run db:migrate`
- All admin routes are protected by JWT session authentication
- Media uploads are stored in Vercel Blob, not the local filesystem
- Database queries use raw SQL with type-safe helpers in `db/queries.ts`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
