"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  { href: "/admin/posts", label: "News Posts", icon: "📰", exact: true },
  { href: "/admin/posts/comic-submission", label: "Comic Submissions", icon: "🎤" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/redirects", label: "Redirects", icon: "🔀" },
  { href: "/admin/submissions", label: "Contact Inbox", icon: "📬" },
  { href: "/admin/media", label: "Media Library", icon: "🖼️" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-gray-900 text-gray-100 flex flex-col transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 py-5 border-b border-gray-700 flex items-center justify-between">
          <Link href="/admin" className="font-bold text-lg hover:text-white transition">
            P&amp;N Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white text-xl"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-red-600 text-white font-medium shadow-sm"
                    : "text-gray-300 hover:bg-gray-700/70 hover:text-white"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-700 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/70 transition"
          >
            <span className="text-base">🌐</span>
            View Site
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/70 transition text-left"
            >
              <span className="text-base">🚪</span>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900">P&amp;N Admin</span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
