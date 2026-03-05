"use server";

import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function markSpam(id: number, isSpam: boolean) {
  await db.update(contactSubmissions).set({ isSpam }).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: number) {
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions");
}
