import { db } from "@/db";
import { posts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

  let post = null;
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.blogSlug, "comic-submission")))
      .limit(1);
    post = rows[0] ?? null;
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
