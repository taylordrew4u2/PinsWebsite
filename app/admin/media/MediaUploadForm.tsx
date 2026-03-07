"use client";

import { useActionState } from "react";
import { uploadFile, UploadState } from "./actions";

const initialState: UploadState = { ok: false };

export default function MediaUploadForm() {
  const [state, action, pending] = useActionState(uploadFile, initialState);

  return (
    <form action={action} className="space-y-3">
      {state.ok && state.url && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-3 py-2 text-sm">
          ✓ Uploaded:{" "}
          <a href={state.url} className="underline break-all">
            {state.url}
          </a>
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm">
          Error: {state.error}
        </div>
      )}
      <div className="flex gap-3 items-center">
        <input
          type="file"
          name="file"
          accept="image/*,.pdf"
          className="text-sm text-gray-700"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
