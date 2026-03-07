"use server";

import { upsertSiteSettings } from "@/db/queries";
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
  aboutCanonicalPath: z
    .enum(["/pages/about-us", "/blogs/news/about-us-pins-needles-comedy", ""])
    .optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  navItemsJson: z.string().optional(),
});

export type SaveSettingsState = { ok: boolean; error?: string };

export async function saveSettings(
  _prev: SaveSettingsState,
  formData: FormData
): Promise<SaveSettingsState> {
  const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.toString()]));

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

  try {
    await upsertSiteSettings({
      site_name: d.siteName || null,
      default_meta_description: d.defaultMetaDescription || null,
      default_og_image_url: d.defaultOgImageUrl || null,
      primary_ticket_link: d.primaryTicketLink || null,
      fundraising_link: d.fundraisingLink || null,
      head_inject_html: d.headInjectHtml || null,
      body_end_inject_html: d.bodyEndInjectHtml || null,
      home_body_markdown: d.homeBodyMarkdown || null,
      about_canonical_path: d.aboutCanonicalPath || null,
      social_links: d.instagramUrl ? JSON.stringify({ instagram: d.instagramUrl }) : null,
      ...(navItems !== undefined ? { nav_items: JSON.stringify(navItems) } : {}),
    });
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Revalidate home page to show updated content
    return { ok: true };
  } catch (e) {
    console.error("[admin] saveSettings error", e);
    return { ok: false, error: "Database error. Check DATABASE_URL is configured." };
  }
}
