import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Private Lead Marketplace",
  description: "Exclusive marketplace for car leads",
};

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import CopyProtection from "@/components/CopyProtection";
import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CopyProtection />
        <AuthGuard>
          <Sidebar />
          <div className="lg:pl-64 min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
