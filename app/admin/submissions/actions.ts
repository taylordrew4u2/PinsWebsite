"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function markSpam(id: number, isSpam: boolean) {
  await db.execute("UPDATE contact_submissions SET is_spam = ?1 WHERE id = ?2", [
    isSpam ? 1 : 0,
    id,
  ]);
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: number) {
  await db.execute("DELETE FROM contact_submissions WHERE id = ?1", [id]);
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions");
}
