import type { Metadata } from "next";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quản Lý Đội Xe",
  description: "Hệ thống quản lý đội xe và tài chính",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
