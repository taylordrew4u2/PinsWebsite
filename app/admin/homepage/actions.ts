"use server";

import { upsertSiteSettings } from "@/db/queries";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type SaveHomePageState = { ok: boolean; error?: string };

const SaveHomePageSchema = z.object({
  homeBodyMarkdown: z.string().max(50000).optional(),
  primaryTicketLink: z
    .string()
    .url("Primary ticket link must be a valid URL.")
    .optional()
    .or(z.literal("")),
  fundraisingLink: z
    .string()
    .url("Fundraising link must be a valid URL.")
    .optional()
    .or(z.literal("")),
  useDefaultTemplate: z.boolean().optional(),
});

export async function saveHomePage(
  _prev: SaveHomePageState,
  formData: FormData
): Promise<SaveHomePageState> {
  const raw = {
    homeBodyMarkdown: formData.get("homeBodyMarkdown")?.toString() ?? "",
    primaryTicketLink: formData.get("primaryTicketLink")?.toString() ?? "",
    fundraisingLink: formData.get("fundraisingLink")?.toString() ?? "",
    useDefaultTemplate: formData.get("useDefaultTemplate") === "on",
  };

  const parsed = SaveHomePageSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(", ") };
  }

  const d = parsed.data;
  const markdownValue = d.useDefaultTemplate ? null : d.homeBodyMarkdown?.trim() || null;

  try {
    await upsertSiteSettings({
      home_body_markdown: markdownValue,
      primary_ticket_link: d.primaryTicketLink || null,
      fundraising_link: d.fundraisingLink || null,
    });

    revalidatePath("/admin/homepage");
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Revalidate home page

    return { ok: true };
  } catch (e) {
    console.error("[admin] saveHomePage error", e);
    return { ok: false, error: "Database error. Check DATABASE_URL is configured." };
  }
}
