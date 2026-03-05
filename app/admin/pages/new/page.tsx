import PageForm from "../PageForm";
import { createPage } from "../actions";

export default function NewPagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Page</h1>
      <PageForm formAction={createPage} />
    </div>
  );
}
