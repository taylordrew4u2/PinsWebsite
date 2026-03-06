"use client";

import { useActionState } from "react";
import type { RedirectFormState } from "./actions";

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none";

export default function RedirectForm({
  formAction,
}: {
  formAction: (prev: RedirectFormState, formData: FormData) => Promise<RedirectFormState>;
}) {
  const [state, action, pending] = useActionState(formAction, { ok: false });

  return (
    <form action={action} className="space-y-3">
      {state.ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-3 py-2 text-sm">✓ Saved.</div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm">Error: {state.error}</div>
      )}
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From Path *</label>
          <input name="fromPath" required placeholder="/old-path" className={`${inputCls} w-48`} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To Path *</label>
          <input name="toPath" required placeholder="/new-path" className={`${inputCls} w-48`} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status Code</label>
          <select name="statusCode" defaultValue="302" className={inputCls}>
            <option value="301">301 Permanent</option>
            <option value="302">302 Temporary</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" name="enabled" defaultChecked value="true" />
            Enabled
          </label>
        </div>
        <button type="submit" disabled={pending}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition">
          {pending ? "Adding…" : "Add Redirect"}
        </button>
      </div>
    </form>
  );
}
