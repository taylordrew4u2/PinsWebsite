import Link from "next/link";
import { db } from "@/db";
import type { Page } from "@/db/types";
import { deletePage } from "./actions";

async function getPages() {
  try {
    const result = await db.execute("SELECT * FROM pages ORDER BY created_at DESC");
    return { data: result.rows as unknown as Page[], error: null };
  } catch {
    return { data: [], error: "Database not connected." };
  }
}

export default async function PagesListPage() {
  const { data, error } = await getPages();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Static Pages</h1>
        <Link href="/admin/pages/new" className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 transition">
          + New Page
        </Link>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-4 text-sm">⚠ {error}</div>
      )}

      {data.length === 0 && !error && (
        <p className="text-gray-500 text-sm">No pages yet.</p>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{page.title ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{page.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    page.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                  }`}>{page.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/pages/${page.id}`} className="text-red-600 hover:underline">Edit</Link>
                    <form action={deletePage.bind(null, page.id)}
                      onSubmit={(e) => { if (!confirm("Delete this page?")) e.preventDefault(); }}>
                      <button type="submit" className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
