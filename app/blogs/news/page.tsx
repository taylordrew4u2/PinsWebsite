export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">News & Updates</h1>

      {/* Article list placeholder */}
      <div className="space-y-8">
        <article className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold mb-2">
            <a href="/blogs/news/welcome-to-pins-needles" className="hover:text-blue-600">
              Welcome to Pins and Needles Comedy
            </a>
          </h2>
          <p className="text-gray-600 mb-4">
            Exciting news! We&apos;re launching a new comedy showcase in St. Louis...
          </p>
          <a
            href="/blogs/news/welcome-to-pins-needles"
            className="text-blue-600 hover:underline"
          >
            Read more →
          </a>
        </article>

        <article className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold mb-2">
            <a
              href="/blogs/news/about-us-pins-needles-comedy"
              className="hover:text-blue-600"
            >
              About Us - Pins and Needles Comedy
            </a>
          </h2>
          <p className="text-gray-600 mb-4">
            Learn more about our mission and the team behind Pins and Needles Comedy...
          </p>
          <a
            href="/blogs/news/about-us-pins-needles-comedy"
            className="text-blue-600 hover:underline"
          >
            Read more →
          </a>
        </article>
      </div>

      {/* Pagination UI */}
      <div className="mt-12 flex justify-center items-center space-x-4">
        {currentPage > 1 && (
          <a
            href={`/blogs/news?page=${currentPage - 1}`}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            ← Previous
          </a>
        )}
        <span className="text-gray-600">Page {currentPage}</span>
        <a
          href={`/blogs/news?page=${currentPage + 1}`}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Next →
        </a>
      </div>
    </div>
  );
}
