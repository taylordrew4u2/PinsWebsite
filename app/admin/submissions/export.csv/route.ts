import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));

    const headers = ["id", "name", "email", "phone", "comment", "ip_hash", "is_spam", "created_at"];

    const rows = data.map((s) =>
      [
        s.id,
        csvEscape(s.name),
        csvEscape(s.email),
        csvEscape(s.phone),
        csvEscape(s.comment),
        csvEscape(s.ipHash), // only ip_hash, never raw IP
        s.isSpam ? "true" : "false",
        s.createdAt?.toISOString() ?? "",
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
