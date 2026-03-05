export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Pins and Needles Comedy
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          St. Louis&apos; premier comedy showcase featuring the best local comedians
        </p>

        {/* Prominent tickets/RSVP link */}
        <div className="mb-8">
          <a
            href="https://partiful.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition"
          >
            Get Tickets / RSVP
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
          <p className="text-gray-600 mb-4">
            Stay up to date with our latest shows, announcements, and comedy scene updates.
          </p>
          <a href="/blogs/news" className="text-blue-600 hover:underline font-semibold">
            Read the blog →
          </a>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Want to Perform?</h2>
          <p className="text-gray-600 mb-4">
            Interested in performing at Pins and Needles Comedy? Learn how to submit.
          </p>
          <a
            href="/blogs/comic-submission"
            className="text-blue-600 hover:underline font-semibold"
          >
            Submission info →
          </a>
        </div>
      </div>

      <div className="mt-12 text-center">
        <a
          href="https://www.gofundme.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-lg font-semibold"
        >
          Support our Fringe show fundraiser →
        </a>
      </div>
    </div>
  );
}
