import { APP_NAME_FULL } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import Providers from "@/app/providers"; 

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black antialiased">
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20 lg:h-24">
                  <Link href="/" className="group flex items-center space-x-3">
                    <Image
                      src="/logo.png"
                      height={56}
                      width={56}
                      alt="شعار الوزارة"
                      className="rounded-lg shadow-md lg:h-16 lg:w-16"
                    />
                    <div className="flex flex-col text-right space-y-1">
                      <h1 className="text-sm lg:text-base font-bold text-slate-800 dark:text-slate-100">
                        وزارة الإسكان والمرافق والمجتمعات العمرانية
                      </h1>
                      <h2 className="text-xs lg:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        الجهاز المركزي للتعمير
                      </h2>
                      <h3 className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">
                        جهاز تعمير سيناء ومدن القناة
                      </h3>
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
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
                {children}
              </div>
            </main>
            <footer className="w-full mt-auto py-8">
              <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} {APP_NAME_FULL}. جميع الحقوق محفوظة.
                <br />
                <span className="text-xs">تم التصميم والتطوير بحب ✨</span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
