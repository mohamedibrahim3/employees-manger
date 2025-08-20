import { APP_NAME_SHORT, APP_NAME_FULL, APP_DEPARTMENT } from "@/lib/constants";
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
            <div className="flex items-center justify-between min-h-20 lg:min-h-24 py-2">
              
              {/* Logo and Brand Section */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  {/* Logo */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src="/logo.png"
                      height={56}
                      width={56}
                      alt="شعار الوزارة"
                      className="rounded-lg shadow-sm lg:h-16 lg:w-16"
                    />
                  </div>
                  
                  {/* Texts */}
                  <div className="flex flex-col text-right space-y-1">
                    {/* Desktop Text */}
                    <div className="hidden md:flex flex-col space-y-1">
                      <h1 className="text-sm lg:text-base font-bold text-gray-900 leading-tight">
                        وزارة الإسكان و المرافق والمجتمعات العمرانية
                      </h1>
                      <h2 className="text-xs lg:text-sm font-semibold text-blue-600 leading-tight">
                        الجهاز المركزي للتعمير
                      </h2>
                      <h3 className="text-xs lg:text-sm font-medium text-gray-700 leading-tight">
                        جهاز تعمير سيناء و مدن القناة
                      </h3>
                    </div>

                    {/* Mobile Text */}
                    <div className="flex md:hidden flex-col space-y-0.5">
                      <h1 className="text-sm font-bold text-gray-900 leading-tight">
                        جهاز تعمير سيناء
                      </h1>
                      <h2 className="text-xs font-semibold text-blue-600 leading-tight">
                        ومدن القناة
                      </h2>
                    </div>
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
              © 2025 {APP_NAME_FULL}. جميع الحقوق محفوظة.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
