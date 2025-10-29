import { APP_NAME_FULL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 antialiased">
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-colors duration-300 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20 lg:h-24">
              <Link
                href="/"
                className="group flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 rounded-lg p-1"
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src="/logo.png"
                    height={56}
                    width={56}
                    alt="شعار الوزارة"
                    className="rounded-lg shadow-sm lg:h-16 lg:w-16 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-md"
                  />
                </div>
                <div className="flex flex-col text-right space-y-1">
                  <div className="hidden md:flex flex-col">
                    <h1 className="text-sm lg:text-base font-semibold text-slate-800 tracking-tight">
                      وزارة الإسكان والمرافق والمجتمعات العمرانية
                    </h1>
                    <h2 className="text-xs lg:text-sm font-medium text-slate-700">
                      الجهاز المركزي للتعمير
                    </h2>
                    <h3 className="text-xs lg:text-sm font-medium text-slate-600">
                      جهاز تعمير سيناء ومدن القناة
                    </h3>
                    <p className="text-[10px] lg:text-xs font-medium text-slate-500 mt-0.5">
                      إعداد نظم المعلومات والتحول الرقمي
                    </p>
                  </div>
                  <div className="flex md:hidden flex-col">
                    <h1 className="text-sm font-semibold text-slate-800 leading-tight">
                      جهاز تعمير سيناء
                    </h1>
                    <h2 className="text-xs font-medium text-slate-700 leading-tight">
                      ومدن القناة
                    </h2>
                    <p className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">
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

        <main className="flex-1 w-full container mx-auto py-8 sm:py-10 px-4">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-xl shadow-md p-6 sm:p-8">
            {children}
          </div>
        </main>

        <footer className="w-full mt-auto py-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 backdrop-blur-lg border-t border-slate-200/50">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-slate-600">
              © {new Date().getFullYear()} {APP_NAME_FULL}.
              <br />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
