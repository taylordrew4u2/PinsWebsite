"use server";

import { db } from "@/db";
import { redirects } from "@/db/schema";
import { eq } from "drizzle-orm";
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
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  try {
    await db.insert(redirects).values(parsed.data);
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
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  try {
    await db.update(redirects).set(parsed.data).where(eq(redirects.id, id));
    revalidatePath("/admin/redirects");
    return { ok: true };
  } catch (e) {
    console.error("[admin] updateRedirect", e);
    return { ok: false, error: "Database error." };
  }
}

export async function deleteRedirect(id: number) {
  await db.delete(redirects).where(eq(redirects.id, id));
  revalidatePath("/admin/redirects");
}

export async function toggleRedirect(id: number, enabled: boolean) {
  await db.update(redirects).set({ enabled }).where(eq(redirects.id, id));
  revalidatePath("/admin/redirects");
}
