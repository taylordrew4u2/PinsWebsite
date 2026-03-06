import { db } from "@/db";
import type { Page } from "@/db/types";
import { notFound } from "next/navigation";
import PageForm from "../PageForm";
import { updatePage } from "../actions";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pageId = Number(id);
  if (isNaN(pageId)) notFound();

  let page: Page | null = null;
  try {
    const result = await db.execute({
      sql: "SELECT * FROM pages WHERE id = ? LIMIT 1",
      args: [pageId],
    });
    page = result.rows[0] ? (result.rows[0] as unknown as Page) : null;
  } catch {
    // DB not available
  }

  if (!page) notFound();

  const action = updatePage.bind(null, pageId);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Page</h1>
      <PageForm page={page} formAction={action} />
    </div>
  );
}
