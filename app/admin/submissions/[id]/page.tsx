import { db } from "@/db";
import type { ContactSubmission } from "@/db/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { markSpam, deleteSubmission } from "../actions";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const subId = Number(id);
  if (isNaN(subId)) notFound();

  let submission: ContactSubmission | null = null;
  try {
    const result = await db.execute({
      sql: "SELECT * FROM contact_submissions WHERE id = ? LIMIT 1",
      args: [subId],
    });
    submission = result.rows[0] ? (result.rows[0] as unknown as ContactSubmission) : null;
  } catch {
    // DB not available
  }

  if (!submission) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/submissions" className="text-indigo-600 hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Submission #{submission.id}</h1>
        {submission.is_spam && (
          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Spam</span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <Row label="Name" value={submission.name} />
        <Row label="Email" value={submission.email} />
        <Row label="Phone" value={submission.phone} />
        <Row label="Date" value={submission.created_at ? new Date(submission.created_at * 1000).toLocaleString() : null} />
        <div>
          <dt className="text-sm font-medium text-gray-600 mb-1">Comment</dt>
          <dd className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded p-3 text-sm">{submission.comment ?? "—"}</dd>
        </div>
        <Row label="IP Hash" value={submission.ip_hash} />
        <Row label="User Agent" value={submission.user_agent} />
      </div>

      <div className="flex gap-3 mt-6">
        <form action={markSpam.bind(null, submission.id, !submission.is_spam)}>
          <button type="submit" className="px-4 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50">
            {submission.is_spam ? "Mark Not Spam" : "Mark as Spam"}
          </button>
        </form>
        <form action={deleteSubmission.bind(null, submission.id)}
          onSubmit={(e) => { if (!confirm("Delete this submission?")) e.preventDefault(); }}>
          <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="text-gray-900 mt-0.5">{value ?? "—"}</dd>
    </div>
  );
}
