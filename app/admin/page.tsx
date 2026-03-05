import Link from "next/link";
import { db } from "@/db";
import { posts, pages, contactSubmissions, redirects } from "@/db/schema";
import { count } from "drizzle-orm";

async function getStats() {
  try {
    const [postsCount, pagesCount, submissionsCount, redirectsCount] = await Promise.all([
      db.select({ count: count() }).from(posts).then((r) => r[0]?.count ?? 0),
      db.select({ count: count() }).from(pages).then((r) => r[0]?.count ?? 0),
      db.select({ count: count() }).from(contactSubmissions).then((r) => r[0]?.count ?? 0),
      db.select({ count: count() }).from(redirects).then((r) => r[0]?.count ?? 0),
    ]);
    return { postsCount, pagesCount, submissionsCount, redirectsCount, error: null };
  } catch {
    return { postsCount: 0, pagesCount: 0, submissionsCount: 0, redirectsCount: 0, error: "Database not connected" };
  }
}

const sections = [
  { href: "/admin/settings", label: "Settings", description: "Site name, nav, social links, SEO" },
  { href: "/admin/posts", label: "News Posts", description: "Create and manage news articles" },
  { href: "/admin/posts/comic-submission", label: "Comic Submission Posts", description: "Manage comic submission posts" },
  { href: "/admin/pages", label: "Static Pages", description: "Manage static content pages" },
  { href: "/admin/redirects", label: "Redirects", description: "URL redirect rules" },
  { href: "/admin/submissions", label: "Contact Submissions", description: "View and manage contact form submissions" },
  { href: "/admin/media", label: "Media", description: "Upload and manage files" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome to the Pins &amp; Needles admin panel.</p>

      {stats.error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-6 text-sm">
          ⚠ {stats.error} — some stats unavailable.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Posts", value: stats.postsCount },
          { label: "Pages", value: stats.pagesCount },
          { label: "Submissions", value: stats.submissionsCount },
          { label: "Redirects", value: stats.redirectsCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition mb-1">
              {s.label}
            </div>
            <div className="text-sm text-gray-500">{s.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
