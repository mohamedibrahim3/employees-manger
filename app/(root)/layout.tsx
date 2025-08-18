import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Logo and Brand Section */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="relative">
                    <Image
                      src="/logo.png"
                      height={56}
                      width={56}
                      alt={APP_NAME}
                      className="rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {APP_NAME}
                    </h1>
                  </div>
                </Link>
              </div>

              {/* Header Component for Auth + Mobile Nav */}
              <div className="flex items-center space-x-3">
                <MobileNav />
                <Header />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-8">
          <div className="bg-white p-6">
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-600 text-sm">
              © 2025 {APP_NAME}. جميع الحقوق محفوظة.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
