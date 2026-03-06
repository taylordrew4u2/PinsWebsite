import Link from "next/link";
import { db } from "@/db";
import type { Post } from "@/db/types";
import { deletePost, duplicatePost } from "./actions";

async function getPosts(blogSlug: string) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM posts WHERE blog_slug = ? ORDER BY created_at DESC",
      args: [blogSlug],
    });
    return {
      data: result.rows as unknown as Post[],
      error: null,
    };
  } catch {
    return { data: [], error: "Database not connected." };
  }
}

interface Props {
  blogSlug: string;
  label: string;
  basePath: string;
}

export default async function PostsListPage({ blogSlug, label, basePath }: Props) {
  const { data, error } = await getPosts(blogSlug);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{label} Posts</h1>
        <Link
          href={`${basePath}/new`}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-700 transition"
        >
          + New Post
        </Link>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-4 text-sm">
          ⚠ {error}
        </div>
      )}

      {data.length === 0 && !error && (
        <p className="text-gray-500 text-sm">No posts yet. <Link href={`${basePath}/new`} className="text-indigo-600 underline">Create one.</Link></p>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{post.title ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{post.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    post.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {post.published_at ? new Date(post.published_at * 1000).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link href={`${basePath}/${post.id}`} className="text-indigo-600 hover:underline">Edit</Link>
                    <form action={duplicatePost.bind(null, post.id, blogSlug)}>
                      <button type="submit" className="text-gray-600 hover:underline">Duplicate</button>
                    </form>
                    <form action={deletePost.bind(null, post.id, blogSlug)}
                      onSubmit={(e) => { if (!confirm("Delete this post?")) e.preventDefault(); }}>
                      <button type="submit" className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
