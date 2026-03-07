"use client";

import { useActionState } from "react";
import { saveHomePage, SaveHomePageState } from "./actions";
import type { SiteSettings } from "@/db/types";
import MarkdownEditor from "@/components/MarkdownEditor";

const initialState: SaveHomePageState = { ok: false };

export default function HomePageEditor({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(saveHomePage, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-4 py-3 text-sm">
          ✓ Homepage saved successfully.
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          Error: {state.error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Homepage Content (Markdown)
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Write your homepage content in markdown. This will replace the default homepage layout.
            Leave blank to use the default template.
          </p>
        </div>

        <MarkdownEditor
          name="homeBodyMarkdown"
          defaultValue={settings?.home_body_markdown ?? ""}
          placeholder="# Welcome to Pins &amp; Needles

Your custom homepage content goes here...

## What We Do

Write about your comedy shows using **markdown** formatting.

- Create lists
- Add [links](https://example.com)
- Include images: ![alt text](url)"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <strong>💡 Tip:</strong> Use markdown syntax for formatting. The editor shows a live preview tab.
        You can include headings, bold text, lists, links, and images.
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition shadow-sm"
        >
          {pending ? "Saving…" : "Save Homepage"}
        </button>
        
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300"
        >
          Preview Live Site →
        </a>
      </div>
    </form>
  );
}
