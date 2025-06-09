import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import MobileBottomNavigation from "@/components/MobileBottomNavigation";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Teach Easy",
  description: "In construction",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Header />
        <Toaster richColors position="bottom-left" closeButton theme="system" />
        <main className="pb-20 md:pb-5">{children}</main>
        <Footer />
        <MobileBottomNavigation />
      </body>
    </html>
  );
}
