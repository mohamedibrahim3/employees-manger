import { APP_NAME_FULL } from "@/lib/constants";
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-gray-500/15 backdrop-blur-xl border-b border-gray-300/30 transition-colors duration-300 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20 lg:h-24">
              <Link
                href="/"
                className="group flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-black rounded-lg p-1"
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src="/logo.png"
                    height={56}
                    width={56}
                    alt="شعار الوزارة"
                    className="rounded-lg shadow-md lg:h-16 lg:w-16 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl"
                  />
                </div>
                <div className="flex flex-col text-right space-y-1">
                  {/* اسم الوزارة بالكامل في الشاشات الكبيرة */}
                  <div className="hidden md:flex flex-col">
                    <h1 className="text-sm lg:text-base font-bold text-gray-800 tracking-tight">
                      وزارة الإسكان والمرافق والمجتمعات العمرانية
                    </h1>
                    <h2 className="text-xs lg:text-sm font-semibold text-gray-700">
                      الجهاز المركزي للتعمير
                    </h2>
                    <h3 className="text-xs lg:text-sm font-medium text-gray-600">
                      جهاز تعمير سيناء ومدن القناة
                    </h3>
                    <p className="text-[10px] lg:text-xs font-medium text-slate-600 mt-0.5">
                      إعداد نظم المعلومات والتحول الرقمي
                    </p>
                  </div>
                  {/* نسخة مختصرة للجوال */}
                  <div className="flex md:hidden flex-col">
                    <h1 className="text-sm font-bold text-gray-800 leading-tight">
                      جهاز تعمير سيناء
                    </h1>
                    <h2 className="text-xs font-semibold text-gray-700 leading-tight">
                      ومدن القناة
                    </h2>
                    <p className="text-[10px] font-medium text-slate-600 leading-tight mt-0.5">
                      إعداد نظم المعلومات والتحول الرقمي
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center space-x-2 md:space-x-4">
                <Header />
                <MobileNav />
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 w-full container mx-auto py-8 sm:py-10 px-4">
          <div className="bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl p-6 sm:p-8">
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full mt-auto py-8 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 backdrop-blur-lg border-t border-gray-300/30">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-gray-700">
              © {new Date().getFullYear()} {APP_NAME_FULL}. جميع الحقوق محفوظة.
              <br />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
