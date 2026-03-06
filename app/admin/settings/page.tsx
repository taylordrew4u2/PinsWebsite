import { getSiteSettings } from "@/db/queries";
import SettingsForm from "./SettingsForm";

async function getSettings() {
  try {
    const data = await getSiteSettings();
    return { data, error: null };
  } catch {
    return { data: null, error: "Database not connected. Configure DATABASE_URL." };
  }
}

export default async function SettingsPage() {
  const { data, error } = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-6 text-sm">
          ⚠ {error}
        </div>
      )}
      <SettingsForm settings={data} />
    </div>
  );
}
