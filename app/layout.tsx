// app/layout.tsx
import "./globals.css";
import { Rubik } from "next/font/google";
import NextAuthProvider from "@/components/providers/session-provider";
import { APP_NAME_FULL as APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";

const rubik = Rubik({ subsets: ["arabic"] });

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${rubik.className} antialiased`}>
        <NextAuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black antialiased">
            {/* ✅ الهيدر */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
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
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <Header />
                    <MobileNav />
                  </div>
                </div>
              </div>
            </header>

            {/* ✅ الكونتنت */}
            <main className="flex-1 w-full container mx-auto py-8 sm:py-10 px-4">
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
                {children}
              </div>
            </main>

            {/* ✅ الفوتر */}
            <footer className="w-full mt-auto py-8">
              <div className="container mx-auto px-4">
                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                  © {new Date().getFullYear()} {APP_NAME}. جميع الحقوق محفوظة.
                  <br />
                  <span className="text-xs">تم التصميم والتطوير بحب ✨</span>
                </div>
              </div>
            </footer>
          </div>

          {/* ✅ التوستات */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "bg-white text-gray-900 shadow-lg",
              style: {
                fontSize: "16px",
                padding: "12px 16px",
              },
            }}
          />
        </NextAuthProvider>
      </body>
    </html>
  );
}
