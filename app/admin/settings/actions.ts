"use server";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional(),
  targetBlank: z.boolean().optional(),
});

const SettingsSchema = z.object({
  siteName: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  defaultOgImageUrl: z.string().url().optional().or(z.literal("")),
  primaryTicketLink: z.string().url().optional().or(z.literal("")),
  fundraisingLink: z.string().url().optional().or(z.literal("")),
  headInjectHtml: z.string().optional(),
  bodyEndInjectHtml: z.string().optional(),
  homeBodyMarkdown: z.string().optional(),
  aboutCanonicalPath: z.enum(["/pages/about-us", "/blogs/news/about-us-pins-needles-comedy", ""]).optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  navItemsJson: z.string().optional(),
});

export type SaveSettingsState = { ok: boolean; error?: string };

export async function saveSettings(
  _prev: SaveSettingsState,
  formData: FormData
): Promise<SaveSettingsState> {
  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v.toString()])
  );

  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const d = parsed.data;

  let navItems = undefined;
  if (d.navItemsJson) {
    try {
      const arr = JSON.parse(d.navItemsJson);
      navItems = z.array(NavItemSchema).parse(arr);
    } catch {
      return { ok: false, error: "Invalid nav items JSON." };
    }
  }

  const values = {
    siteName: d.siteName,
    defaultMetaDescription: d.defaultMetaDescription,
    defaultOgImageUrl: d.defaultOgImageUrl || null,
    primaryTicketLink: d.primaryTicketLink || null,
    fundraisingLink: d.fundraisingLink || null,
    headInjectHtml: d.headInjectHtml,
    bodyEndInjectHtml: d.bodyEndInjectHtml,
    homeBodyMarkdown: d.homeBodyMarkdown,
    aboutCanonicalPath: d.aboutCanonicalPath || null,
    socialLinks: d.instagramUrl ? { instagram: d.instagramUrl } : {},
    ...(navItems !== undefined ? { navItems } : {}),
  };

  try {
    const existing = await db.select().from(siteSettings).limit(1);
    if (existing.length === 0) {
      await db.insert(siteSettings).values(values);
    } else {
      const { eq } = await import("drizzle-orm");
      await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing[0].id));
    }
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    console.error("[admin] saveSettings error", e);
    return { ok: false, error: "Database error. Check DATABASE_URL is configured." };
  }
}
