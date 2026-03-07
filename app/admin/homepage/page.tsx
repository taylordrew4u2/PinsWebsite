import { getSiteSettings } from "@/db/queries";
import HomePageEditor from "./HomePageEditor";

async function getSettings() {
  try {
    const data = await getSiteSettings();
    return { data, error: null };
  } catch {
    return { data: null, error: "Database not connected. Configure DATABASE_URL." };
  }
}

export default async function HomePageEditorPage() {
  const { data, error } = await getSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Homepage</h1>
        <p className="text-gray-600 text-sm">
          Customize the content displayed on your homepage. Leave blank to show the default template.
        </p>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-6 text-sm">
          ⚠ {error}
        </div>
      )}
      
      <HomePageEditor settings={data} />
    </div>
  );
}
