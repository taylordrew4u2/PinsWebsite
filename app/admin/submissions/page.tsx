import Link from "next/link";
import { db } from "@/db";
import type { ContactSubmission } from "@/db/types";
import { markSpam, deleteSubmission } from "./actions";

async function getSubmissions(spamFilter?: string) {
  try {
    const result = await db.execute("SELECT * FROM contact_submissions ORDER BY created_at DESC");
    const data = result.rows as unknown as ContactSubmission[];
    const filtered =
      spamFilter === "spam"
        ? data.filter((s) => s.is_spam === 1)
        : spamFilter === "ham"
        ? data.filter((s) => s.is_spam === 0)
        : data;
    return { data: filtered, total: data.length, error: null };
  } catch {
    return { data: [], total: 0, error: "Database not connected." };
  }
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ spam?: string }>;
}) {
  const sp = await searchParams;
  const { data, total, error } = await getSubmissions(sp.spam);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/submissions" className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">All ({total})</Link>
          <Link href="?spam=ham" className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">Not Spam</Link>
          <Link href="?spam=spam" className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">Spam</Link>
          <a href="/admin/submissions/export.csv" className="px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700">Export CSV</a>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-4 text-sm">⚠ {error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Spam</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((s) => (
              <tr key={s.id} className={`hover:bg-gray-50 ${s.is_spam ? "opacity-60" : ""}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{s.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{s.email ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {s.created_at ? new Date(s.created_at * 1000).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  {s.is_spam ? (
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Spam</span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">OK</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/submissions/${s.id}`} className="text-indigo-600 hover:underline">View</Link>
                    <form action={markSpam.bind(null, s.id, !s.is_spam)}>
                      <button type="submit" className="text-gray-600 hover:underline">
                        {s.is_spam ? "Not Spam" : "Mark Spam"}
                      </button>
                    </form>
                    <form action={deleteSubmission.bind(null, s.id)}
                      onSubmit={(e) => { if (!confirm("Delete this submission?")) e.preventDefault(); }}>
                      <button type="submit" className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && !error && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No submissions.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
