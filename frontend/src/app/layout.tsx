import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JustCodeWorks",
  description: "Website builder and content management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-200 font-medium">
        {children}
      </body>
    </html>
  );
}