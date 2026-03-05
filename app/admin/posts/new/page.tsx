import PostForm from "../PostForm";
import { createPost } from "../actions";

export default function NewNewsPostPage() {
  const action = createPost.bind(null, "news");
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New News Post</h1>
      <PostForm formAction={action} backHref="/admin/posts" blogLabel="News" />
    </div>
  );
}
