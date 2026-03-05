export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {slug === "about-us-pins-needles-comedy"
              ? "About Us - Pins and Needles Comedy"
              : "News Article"}
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <time dateTime="2026-03-05">March 5, 2026</time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {slug === "about-us-pins-needles-comedy" ? (
            <>
              <p>
                Welcome to Pins and Needles Comedy! We are St. Louis&apos; newest comedy
                showcase, dedicated to bringing the best local comedians to the stage.
              </p>
              <p>
                Our mission is to create a welcoming space for both performers and audiences,
                fostering a vibrant comedy community in the heart of St. Louis.
              </p>
              <p>
                Join us for regular shows, special events, and more. Follow us on Instagram to
                stay updated on upcoming performances!
              </p>
            </>
          ) : (
            <>
              <p>
                This is placeholder content for the news article with slug: <strong>{slug}</strong>
              </p>
              <p>
                In the future, this content will be dynamically loaded from a database or CMS.
              </p>
            </>
          )}
        </div>

        {/* Share/Copy UI Placeholder */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Share this article</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Copy Link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      </article>

      <div className="mt-12">
        <a href="/blogs/news" className="text-blue-600 hover:underline">
          ← Back to News
        </a>
      </div>
    </div>
  );
}
