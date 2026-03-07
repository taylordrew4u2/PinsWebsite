import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pins and Needles Comedy",
  description: "St. Louis comedy showcase featuring local comedians",
};

// Future: this will be populated from admin-configured settings
const bodyEndScripts = "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:underline"
        >
          Skip to content
        </a>

        {/* Global header with navigation */}
        <header className="border-b border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                  Pins and Needles Comedy
                </a>
              </div>
              <div className="flex items-center space-x-6">
                <a
                  href="https://www.instagram.com/pinsandneedlescomedy"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Instagram
                </a>
                <a href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </a>
                <a href="/blogs/news" className="text-gray-700 hover:text-gray-900">
                  News
                </a>
                <a href="/blogs/comic-submission" className="text-gray-700 hover:text-gray-900">
                  Submit
                </a>
                <a href="/pages/about-us" className="text-gray-700 hover:text-gray-900">
                  About Us
                </a>
                <a
                  href="https://www.gofundme.com"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  HELP FUND FRINGE
                </a>
              </div>
            </div>
          </nav>
          <div className="text-xs text-gray-500 text-center py-1 border-t border-gray-100">
            Choosing a selection results in a full page refresh.
          </div>
        </header>

        {/* Main content area */}
        <main id="main-content">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Pins and Needles Comedy. All rights reserved.</p>
          </div>
        </footer>

        {/* Future: admin-configured body end scripts */}
        <div dangerouslySetInnerHTML={{ __html: bodyEndScripts }} />
      </body>
    </html>
  );
}
