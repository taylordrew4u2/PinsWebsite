import { listFiles } from "./actions";
import MediaUploadForm from "./MediaUploadForm";

export default async function MediaPage() {
  const { blobs, error } = await listFiles();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Media</h1>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-3 mb-6 text-sm">⚠ {error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Upload File</h2>
        <MediaUploadForm />
      </div>

      {blobs.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Uploaded Files ({blobs.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {blobs.map((blob) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(blob.pathname);
              return (
                <div key={blob.url} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                  {isImage && (
                    // eslint-disable-next-line @next/next-image/no-img-element
                    <img src={blob.url} alt={blob.pathname} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-xs text-gray-700 font-medium truncate">{blob.pathname}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(blob.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(blob.url)}
                      className="mt-2 text-xs text-indigo-600 hover:underline w-full text-left"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {blobs.length === 0 && !error && (
        <p className="text-gray-500 text-sm">No files uploaded yet.</p>
      )}
    </div>
  );
}
