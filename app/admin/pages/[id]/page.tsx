import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  let page = null;
  try {
    const rows = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
    page = rows[0] ?? null;
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
