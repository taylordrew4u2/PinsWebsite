import { NextResponse } from "next/server";
import { db } from "@/db";
import type { ContactSubmission } from "@/db/types";

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM contact_submissions ORDER BY created_at DESC");
    const data = result.rows as unknown as ContactSubmission[];

    const headers = ["id", "name", "email", "phone", "comment", "ip_hash", "is_spam", "created_at"];

    const rows = data.map((s) =>
      [
        s.id,
        csvEscape(s.name),
        csvEscape(s.email),
        csvEscape(s.phone),
        csvEscape(s.comment),
        csvEscape(s.ip_hash), // only ip_hash, never raw IP
        s.is_spam === 1 ? "true" : "false",
        s.created_at ? new Date(s.created_at * 1000).toISOString() : "",
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="submissions-${Date.now()}.csv"`,
      },
    });
  } catch {
    return new NextResponse("Database error", { status: 500 });
  }
}

function csvEscape(val: string | null | undefined): string {
  if (val == null) return "";
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}
