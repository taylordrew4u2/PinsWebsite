"use client";

import { useState, useCallback } from "react";

interface Props {
  name: string;
  defaultValue: string;
  rows?: number;
  placeholder?: string;
}

export default function MarkdownEditor({ name, defaultValue, rows = 14, placeholder }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePreview = useCallback(async () => {
    if (!preview && value.trim()) {
      setLoading(true);
      try {
        // Use dynamic import to render markdown client-side
        const { remark } = await import("remark");
        const remarkGfm = (await import("remark-gfm")).default;
        const remarkHtml = (await import("remark-html")).default;
        const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: true }).process(value);
        setHtml(result.toString());
      } catch {
        setHtml("<p style='color:red'>Preview error</p>");
      }
      setLoading(false);
    }
    setPreview(!preview);
  }, [preview, value]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-3 py-1 text-xs rounded-t font-medium transition ${
              !preview ? "bg-white border border-b-0 border-gray-300 text-gray-900" : "bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            ✏️ Write
          </button>
          <button
            type="button"
            onClick={togglePreview}
            className={`px-3 py-1 text-xs rounded-t font-medium transition ${
              preview ? "bg-white border border-b-0 border-gray-300 text-gray-900" : "bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            👁️ Preview
          </button>
        </div>
        <span className="text-xs text-gray-400">Supports Markdown formatting</span>
      </div>

      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        placeholder={placeholder || "Write your content using Markdown...\n\n# Heading\n**Bold text**\n- List item\n[Link](https://example.com)"}
        className={`w-full border border-gray-300 rounded-b rounded-tr px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:outline-none ${
          preview ? "hidden" : ""
        }`}
      />

      {preview && (
        <div className="w-full border border-gray-300 rounded-b rounded-tr px-4 py-3 bg-white min-h-[200px] overflow-auto prose prose-sm max-w-none">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading preview...</p>
          ) : html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="text-gray-400 text-sm italic">Nothing to preview</p>
          )}
        </div>
      )}

      {!preview && (
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          <span><strong className="font-semibold text-gray-500">**bold**</strong></span>
          <span><em className="italic text-gray-500">*italic*</em></span>
          <span className="text-gray-500"># heading</span>
          <span className="text-gray-500">[link](url)</span>
          <span className="text-gray-500">![image](url)</span>
          <span className="text-gray-500">- list item</span>
        </div>
      )}
    </div>
  );
}
