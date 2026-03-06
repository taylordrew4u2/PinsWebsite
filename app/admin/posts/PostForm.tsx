"use client";

import { useActionState } from "react";
import type { PostFormState } from "./actions";
import type { Post } from "@/db/types";
import MarkdownEditor from "@/components/MarkdownEditor";

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
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-4 py-3 text-sm flex items-center justify-between">
          <span>✓ {post ? "Post updated successfully!" : "Post created successfully!"}</span>
          <a href={backHref} className="underline font-medium ml-4">← Back to list</a>
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          ⚠ {state.error}
        </div>
      )}

      {/* Title & Slug */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required defaultValue={post?.title ?? ""} className={inputCls} placeholder="Enter post title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug *
            <span className="text-gray-400 font-normal ml-1">(lowercase letters, numbers, hyphens only)</span>
          </label>
          <input name="slug" required defaultValue={post?.slug ?? ""} pattern="[a-z0-9-]+" className={inputCls} placeholder="my-post-slug" />
        </div>
      </div>

      {/* Excerpt */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
          <span className="text-gray-400 font-normal ml-1">(short summary shown in lists)</span>
        </label>
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className={inputCls} placeholder="Brief description of this post..." />
      </div>

      {/* Body */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Body Content</label>
        <MarkdownEditor name="bodyMarkdown" defaultValue={post?.body_markdown ?? ""} rows={16} />
      </div>

      {/* Featured Image */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image URL
          <span className="text-gray-400 font-normal ml-1">(upload images in Media Library first)</span>
        </label>
        <input name="featuredImageUrl" type="url" defaultValue={post?.featured_image_url ?? ""} className={inputCls} placeholder="https://..." />
      </div>

      {/* SEO */}
      <details className="bg-white rounded-lg shadow-sm border border-gray-200">
        <summary className="px-5 py-3 cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition">
          🔍 SEO Settings <span className="text-gray-400 font-normal">(click to expand)</span>
        </summary>
        <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seoTitle" defaultValue={post?.seo_title ?? ""} className={inputCls} placeholder="Custom title for search engines" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="metaDescription" defaultValue={post?.meta_description ?? ""} rows={2} className={inputCls} placeholder="Description shown in search results (150-160 characters ideal)" />
          </div>
        </div>
      </details>

      {/* Status & Publishing */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Publishing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={post?.status ?? "draft"} className={inputCls}>
              <option value="draft">📝 Draft</option>
              <option value="published">✅ Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
            <input
              name="publishedAt"
              type="datetime-local"
              defaultValue={post?.published_at ? new Date(post.published_at * 1000).toISOString().slice(0, 16) : ""}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 items-center sticky bottom-0 bg-gray-100 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={pending}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition shadow-sm"
        >
          {pending ? "Saving…" : post ? "💾 Update Post" : `✨ Create ${blogLabel} Post`}
        </button>
        <a href={backHref} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition";
