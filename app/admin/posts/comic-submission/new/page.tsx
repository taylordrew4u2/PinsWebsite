import PostForm from "../../PostForm";
import { createPost } from "../../actions";

export default function NewComicPostPage() {
  const action = createPost.bind(null, "comic-submission");
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Comic Submission Post</h1>
      <PostForm formAction={action} backHref="/admin/posts/comic-submission" blogLabel="Comic Submission" />
    </div>
  );
}
