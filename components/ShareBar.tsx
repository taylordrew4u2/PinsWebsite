"use client";

import { useState } from "react";

export default function ShareBar() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [canShare] = useState(
    () => typeof window !== "undefined" && "share" in navigator
  );

  const handleCopyLink = async () => {
    if (!navigator.clipboard) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: window.location.href });
      } catch {
        // User cancelled or share failed — no action needed
      }
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCopyLink}
          aria-label="Copy link to clipboard"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          {copied ? "Link copied!" : "Copy Link"}
        </button>
        {canShare && (
          <button
            onClick={handleShare}
            aria-label="Share this article"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Share
          </button>
        )}
        {copyError && (
          <span className="text-sm text-red-600" role="alert">
            Could not copy — please copy the URL from your browser&apos;s address bar.
          </span>
        )}
      </div>
    </div>
  );
}
