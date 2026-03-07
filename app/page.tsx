import { getSiteSettings } from "@/db/queries";
import { markdownToHtml } from "@/lib/markdown";

async function getHomeContent() {
  try {
    const settings = await getSiteSettings();
    if (settings?.home_body_markdown) {
      const html = await markdownToHtml(settings.home_body_markdown);
      return { html, settings };
    }
    return { html: null, settings };
  } catch {
    return { html: null, settings: null };
  }
}

export default async function HomePage() {
  const { html, settings } = await getHomeContent();

  // If custom content exists, use it
  if (html) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // Default homepage content
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
            href={settings?.primary_ticket_link || "https://partiful.com"}
            className="inline-block bg-red-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-red-700 transition"
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
          <a href="/blogs/news" className="text-red-600 hover:underline font-semibold">
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
            className="text-red-600 hover:underline font-semibold"
          >
            Submission info →
          </a>
        </div>
      </div>

      <div className="mt-12 text-center">
        <a
          href={settings?.fundraising_link || "https://www.gofundme.com"}
          className="text-red-600 hover:underline text-lg font-semibold"
        >
          Support our Fringe show fundraiser →
        </a>
      </div>
    </div>
  );
}
