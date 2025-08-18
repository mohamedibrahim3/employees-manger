import "./globals.css";
import { Rubik } from "next/font/google";
import NextAuthProvider from "@/components/providers/session-provider";
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { Toaster } from "sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
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
