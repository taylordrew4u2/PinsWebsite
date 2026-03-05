import Link from "next/link";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/posts", label: "News Posts" },
  { href: "/admin/posts/comic-submission", label: "Comic Submission" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/redirects", label: "Redirects" },
  { href: "/admin/submissions", label: "Contact Submissions" },
  { href: "/admin/media", label: "Media" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-100 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700">
          <span className="font-bold text-lg">P&amp;N Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-sm text-gray-400 hover:text-white transition"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
