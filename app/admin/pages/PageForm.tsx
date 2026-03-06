"use client";

import { useActionState } from "react";
import type { PageFormState } from "./actions";
import type { Page } from "@/db/types";

interface Props {
  page?: Page | null;
  formAction: (prev: PageFormState, formData: FormData) => Promise<PageFormState>;
}

const initialState: PageFormState = { ok: false };
const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none";

export default function PageForm({ page, formAction }: Props) {
  const [state, action, pending] = useActionState(formAction, initialState);

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      {state.ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-4 py-3 text-sm">
          ✓ {page ? "Page updated." : "Page created."}{" "}
          <a href="/admin/pages" className="underline">Back to list</a>
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          Error: {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required defaultValue={page?.title ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input name="slug" required defaultValue={page?.slug ?? ""} pattern="[a-z0-9-]+" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body (Markdown)</label>
        <textarea name="bodyMarkdown" defaultValue={page?.body_markdown ?? ""} rows={14} className={`${inputCls} font-mono text-sm`} />
      </div>

      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-gray-700">SEO</legend>
        <div className="space-y-3 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seoTitle" defaultValue={page?.seo_title ?? ""} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="metaDescription" defaultValue={page?.meta_description ?? ""} rows={2} className={inputCls} />
          </div>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" defaultValue={page?.status ?? "draft"} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Published At</label>
          <input
            name="publishedAt"
            type="datetime-local"
            defaultValue={page?.published_at ? new Date(page.published_at * 1000).toISOString().slice(0, 16) : ""}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={pending}
          className="bg-indigo-600 text-white px-5 py-2 rounded font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
          {pending ? "Saving…" : page ? "Update Page" : "Create Page"}
        </button>
        <a href="/admin/pages" className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </a>
      </div>
    </form>
  );
}
