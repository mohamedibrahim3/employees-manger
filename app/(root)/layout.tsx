import { APP_NAME_FULL } from "@/lib/constants"; // Assuming these are still needed
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
      {/* ✨ [IMPROVEMENT] Added a subtle gradient background & dark mode support */}
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black antialiased">
        {/* ✨ [IMPROVEMENT] Glassmorphism Header: semi-transparent with a blur effect */}
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20 lg:h-24">
              {/* Logo and Brand Section */}
              {/* ✨ [IMPROVEMENT] Added 'group' for cool hover effects on children */}
              <Link
                href="/"
                className="group flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-black rounded-lg p-1"
              >
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  {/* ✨ [IMPROVEMENT] Added playful hover animation to the logo */}
                  <Image
                    src="/logo.png"
                    height={56}
                    width={56}
                    alt="شعار الوزارة"
                    className="rounded-lg shadow-md lg:h-16 lg:w-16 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl"
                  />
                </div>

                {/* Texts */}
                {/* ✨ [IMPROVEMENT] Enhanced typography and colors */}
                <div className="flex flex-col text-right space-y-1">
                  {/* Desktop Text */}
                  <div className="hidden md:flex flex-col">
                    <h1 className="text-sm lg:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                      وزارة الإسكان والمرافق والمجتمعات العمرانية
                    </h1>
                    <h2 className="text-xs lg:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      الجهاز المركزي للتعمير
                    </h2>
                    <h3 className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">
                      جهاز تعمير سيناء ومدن القناة
                    </h3>
                  </div>

                  {/* Mobile Text */}
                  <div className="flex md:hidden flex-col">
                    <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                      جهاز تعمير سيناء
                    </h1>
                    <h2 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 leading-tight">
                      ومدن القناة
                    </h2>
                  </div>
                </div>
              </Link>

              {/* Header Component for Auth + Mobile Nav */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <Header />
                {/* MobileNav should be inside the div but only visible on mobile, handled by its own logic */}
                <MobileNav />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full container mx-auto py-8 sm:py-10 px-4">
          {/* ✨ [IMPROVEMENT] Modern "card" style for the main content */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </div>
        </main>

        {/* Footer */}
        {/* ✨ [IMPROVEMENT] Cleaner, more integrated footer design */}
        <footer className="w-full mt-auto py-8">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} {APP_NAME_FULL}. جميع الحقوق محفوظة.
              <br />
              <span className="text-xs">
                تم التصميم والتطوير بحب ✨
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}