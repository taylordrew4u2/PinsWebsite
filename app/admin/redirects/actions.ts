"use server";

import { db } from "@/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const RedirectSchema = z.object({
  fromPath: z.string().min(1).startsWith("/", "From path must start with /"),
  toPath: z.string().min(1),
  statusCode: z.coerce.number().refine((v) => v === 301 || v === 302, "Must be 301 or 302"),
  enabled: z.coerce.boolean().optional().default(true),
});

export type RedirectFormState = { ok: boolean; error?: string };

export async function createRedirect(
  _prev: RedirectFormState,
  formData: FormData
): Promise<RedirectFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = RedirectSchema.safeParse(raw);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  try {
    const d = parsed.data;
    await db.execute(
      `INSERT INTO redirects (from_path, to_path, status_code, enabled) VALUES (?1, ?2, ?3, ?4)`,
      [d.fromPath, d.toPath, d.statusCode, d.enabled ? 1 : 0]
    );
    revalidatePath("/admin/redirects");
    return { ok: true };
  } catch (e) {
    console.error("[admin] createRedirect", e);
    return { ok: false, error: "Database error." };
  }
}

export async function updateRedirect(
  id: number,
  _prev: RedirectFormState,
  formData: FormData
): Promise<RedirectFormState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));
  const parsed = RedirectSchema.safeParse(raw);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  try {
    const d = parsed.data;
    await db.execute(
      `UPDATE redirects SET from_path = ?1, to_path = ?2, status_code = ?3, enabled = ?4 WHERE id = ?5`,
      [d.fromPath, d.toPath, d.statusCode, d.enabled ? 1 : 0, id]
    );
    revalidatePath("/admin/redirects");
    return { ok: true };
  } catch (e) {
    console.error("[admin] updateRedirect", e);
    return { ok: false, error: "Database error." };
  }
}

export async function deleteRedirect(id: number) {
  await db.execute("DELETE FROM redirects WHERE id = ?1", [id]);
  revalidatePath("/admin/redirects");
}

export async function toggleRedirect(id: number, enabled: boolean) {
  await db.execute("UPDATE redirects SET enabled = ?1 WHERE id = ?2", [enabled ? 1 : 0, id]);
  revalidatePath("/admin/redirects");
}
