export default function ComicSubmissionIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Comic Submissions</h1>

      <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Want to Perform?</h2>
        <p className="text-gray-700">
          We&apos;re always looking for talented comedians to join our lineup. Check out our
          submission guidelines below.
        </p>
      </div>

      <div className="space-y-8">
        <article className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold mb-2">
            <a href="/blogs/comic-submission/how-to-submit" className="hover:text-red-600">
              How to Submit Your Comedy Set
            </a>
          </h2>
          <p className="text-gray-600 mb-4">
            Learn about our submission process, requirements, and what we&apos;re looking for in
            performers.
          </p>
          <a
            href="/blogs/comic-submission/how-to-submit"
            className="text-red-600 hover:underline"
          >
            Read more →
          </a>
        </article>

        <article className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold mb-2">
            <a href="/blogs/comic-submission/submission-faq" className="hover:text-red-600">
              Submission FAQ
            </a>
          </h2>
          <p className="text-gray-600 mb-4">
            Frequently asked questions about submitting to perform at Pins and Needles Comedy.
          </p>
          <a
            href="/blogs/comic-submission/submission-faq"
            className="text-red-600 hover:underline"
          >
            Read more →
          </a>
        </article>
      </div>
    </div>
  );
}
