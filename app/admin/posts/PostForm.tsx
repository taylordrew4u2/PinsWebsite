"use client";

import { useActionState } from "react";
import type { PostFormState } from "./actions";
import type { Post } from "@/db/types";

interface Props {
  post?: Post | null;
  formAction: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
  backHref: string;
  blogLabel: string;
}

const initialState: PostFormState = { ok: false };

export default function PostForm({ post, formAction, backHref, blogLabel }: Props) {
  const [state, action, pending] = useActionState(formAction, initialState);

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      {state.ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-4 py-3 text-sm">
          ✓ {post ? "Post updated." : "Post created."}{" "}
          <a href={backHref} className="underline">Back to list</a>
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
          <input name="title" required defaultValue={post?.title ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug * <span className="text-gray-400 font-normal">(lowercase, hyphens)</span></label>
          <input name="slug" required defaultValue={post?.slug ?? ""} pattern="[a-z0-9-]+" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className={inputCls} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body (Markdown)</label>
        <textarea name="bodyMarkdown" defaultValue={post?.body_markdown ?? ""} rows={14} className={`${inputCls} font-mono text-sm`} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
        <input name="featuredImageUrl" type="url" defaultValue={post?.featured_image_url ?? ""} className={inputCls} />
      </div>

      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-semibold text-gray-700">SEO</legend>
        <div className="space-y-3 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seoTitle" defaultValue={post?.seo_title ?? ""} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="metaDescription" defaultValue={post?.meta_description ?? ""} rows={2} className={inputCls} />
          </div>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" defaultValue={post?.status ?? "draft"} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Published At</label>
          <input
            name="publishedAt"
            type="datetime-local"
            defaultValue={post?.published_at ? new Date(post.published_at * 1000).toISOString().slice(0, 16) : ""}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-red-600 text-white px-5 py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50 transition"
        >
          {pending ? "Saving…" : post ? "Update Post" : `Create ${blogLabel} Post`}
        </button>
        <a href={backHref} className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none";
