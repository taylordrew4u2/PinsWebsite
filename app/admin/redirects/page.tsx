import { db } from "@/db";
import type { Redirect } from "@/db/types";
import { createRedirect, deleteRedirect, toggleRedirect } from "./actions";
import RedirectForm from "./RedirectForm";

async function getRedirects() {
  try {
    const result = await db.execute("SELECT * FROM redirects ORDER BY created_at DESC");
    return { data: result.rows as unknown as Redirect[], error: null };
  } catch {
    return { data: [], error: "Database not connected." };
  }
}

export default async function RedirectsPage() {
  const { data, error } = await getRedirects();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Redirects</h1>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-4 text-sm">⚠ {error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Add Redirect</h2>
        <RedirectForm formAction={createRedirect} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">From</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">To</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Code</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-900">{r.from_path}</td>
                <td className="px-4 py-3 font-mono text-gray-600">{r.to_path}</td>
                <td className="px-4 py-3 text-gray-600">{r.status_code}</td>
                <td className="px-4 py-3">
                  <form action={toggleRedirect.bind(null, r.id, !r.enabled)}>
                    <button type="submit" className={`inline-flex px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                      r.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {r.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={deleteRedirect.bind(null, r.id)}
                    onSubmit={(e) => { if (!confirm("Delete this redirect?")) e.preventDefault(); }}>
                    <button type="submit" className="text-red-600 hover:underline text-sm">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {data.length === 0 && !error && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No redirects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
