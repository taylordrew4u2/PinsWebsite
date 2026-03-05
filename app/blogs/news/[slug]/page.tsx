import ShareBar from "@/components/ShareBar";

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

        <ShareBar />
      </article>

      <div className="mt-12">
        <a href="/blogs/news" className="text-blue-600 hover:underline">
          ← Back to News
        </a>
      </div>
    </div>
  );
}
