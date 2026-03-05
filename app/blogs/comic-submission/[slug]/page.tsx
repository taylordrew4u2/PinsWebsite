export default async function SubmissionArticlePage({
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
            {slug === "how-to-submit"
              ? "How to Submit Your Comedy Set"
              : "Submission Article"}
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <time dateTime="2026-03-05">March 5, 2026</time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {slug === "how-to-submit" ? (
            <>
              <h2>Submission Guidelines</h2>
              <p>
                Thank you for your interest in performing at Pins and Needles Comedy! We&apos;re
                excited to hear from you.
              </p>

              <h3>Requirements</h3>
              <ul>
                <li>Must have at least 5 minutes of original material</li>
                <li>Be prepared to perform at our showcase venue</li>
                <li>Submit a video sample of your comedy (if available)</li>
              </ul>

              <h3>How to Apply</h3>
              <p>
                To submit your comedy set, please reach out to us through our{" "}
                <a href="/pages/contact" className="text-blue-600 hover:underline">
                  contact page
                </a>{" "}
                with the following information:
              </p>
              <ul>
                <li>Your name and stage name (if different)</li>
                <li>Brief bio</li>
                <li>Link to video samples (YouTube, Instagram, etc.)</li>
                <li>Your availability</li>
              </ul>

              <p>
                Send your submission to{" "}
                <a
                  href="mailto:admin@pinsandneedlescomedy.com"
                  className="text-blue-600 hover:underline"
                >
                  admin@pinsandneedlescomedy.com
                </a>{" "}
                or use our{" "}
                <a href="/pages/contact" className="text-blue-600 hover:underline">
                  contact page
                </a>
                . We review all submissions and will get back to you as soon as possible!
              </p>
            </>
          ) : (
            <>
              <p>
                This is placeholder content for the submission article with slug:{" "}
                <strong>{slug}</strong>
              </p>
              <p>
                In the future, this content will be dynamically loaded from a database or CMS.
              </p>
            </>
          )}
        </div>
      </article>

      <div className="mt-12">
        <a href="/blogs/comic-submission" className="text-blue-600 hover:underline">
          ← Back to Submissions
        </a>
      </div>
    </div>
  );
}
