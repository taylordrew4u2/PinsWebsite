export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Pins and Needles Comedy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          Welcome to St. Louis&apos; premier comedy showcase, where we bring together the best
          local comedians for unforgettable nights of laughter.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          At Pins and Needles Comedy, our mission is to create a welcoming space for both
          performers and audiences. We believe in fostering a vibrant comedy community in the
          heart of St. Louis, providing a platform for emerging comedians and established acts
          alike.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Do</h2>
        <p className="text-gray-700 mb-4">
          We host regular comedy showcases featuring a diverse lineup of talented comedians. Each
          show is carefully curated to provide audiences with an evening of top-quality
          entertainment and laughs.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Get Involved</h2>
        <p className="text-gray-700 mb-4">
          Whether you&apos;re a comedian looking to perform or an audience member seeking great
          entertainment, we&apos;d love to have you join us.
        </p>

        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>
            <a href="/pages/contact" className="text-blue-600 hover:underline">
              Contact us
            </a>{" "}
            with questions or feedback
          </li>
          <li>
            <a href="/blogs/comic-submission" className="text-blue-600 hover:underline">
              Learn how to perform
            </a>{" "}
            at our shows
          </li>
          <li>
            Follow us on{" "}
            <a
              href="https://www.instagram.com/pinsandneedlescomedy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Instagram
            </a>{" "}
            for updates
          </li>
          <li>
            <a
              href="https://www.gofundme.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Support our Fringe show
            </a>
          </li>
        </ul>

        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <p className="text-gray-600 text-center">
            Note: This content also appears at{" "}
            <a
              href="/blogs/news/about-us-pins-needles-comedy"
              className="text-blue-600 hover:underline"
            >
              /blogs/news/about-us-pins-needles-comedy
            </a>{" "}
            as an alternate route.
          </p>
        </div>
      </div>
    </div>
  );
}
