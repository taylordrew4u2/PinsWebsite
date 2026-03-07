"use server";

import { upsertSiteSettings } from "@/db/queries";
import { revalidatePath } from "next/cache";

export type SaveHomePageState = { ok: boolean; error?: string };

export async function saveHomePage(
  _prev: SaveHomePageState,
  formData: FormData
): Promise<SaveHomePageState> {
  const homeBodyMarkdown = formData.get("homeBodyMarkdown")?.toString() || "";

  try {
    await upsertSiteSettings({
      home_body_markdown: homeBodyMarkdown || null,
    });
    
    revalidatePath("/admin/homepage");
    revalidatePath("/"); // Revalidate home page
    
    return { ok: true };
  } catch (e) {
    console.error("[admin] saveHomePage error", e);
    return { ok: false, error: "Database error. Check DATABASE_URL is configured." };
  }
}
