import { db } from "@/db";
import type { Post } from "@/db/types";
import { notFound } from "next/navigation";
import PostForm from "../../PostForm";
import { updatePost } from "../../actions";

export default async function EditComicPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) notFound();

  let post: Post | null = null;
  try {
    const result = await db.execute({
      sql: "SELECT * FROM posts WHERE id = ? AND blog_slug = ? LIMIT 1",
      args: [postId, "comic-submission"],
    });
    post = result.rows[0] ? (result.rows[0] as unknown as Post) : null;
  } catch {
    // DB not available
  }

  if (!post) notFound();

  const action = updatePost.bind(null, postId, "comic-submission");
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Comic Submission Post</h1>
      <PostForm
        post={post}
        formAction={action}
        backHref="/admin/posts/comic-submission"
        blogLabel="Comic Submission"
      />
    </div>
  );
}
