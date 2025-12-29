import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LoginButton from "@/app/components/ManageLoginButton";
import ClientInit from "@/app/components/ClientInit";
import CartPreview from "@/app/components/CartPreview";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop App",
  description: "A simple e-commerce application built with Next.js",
};

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex items-center gap-4 px-4 py-3 border-b">
          <div className="flex items-center gap-4">
            <Link href="/">Producs</Link> | <Link href="/cart">Cart</Link> |{" "}
            <Link href="/login">Login</Link> |{" "}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <CartPreview />
            <LoginButton />
          </div>
        </nav>
        <ClientInit />
        {children}
      </body>
    </html>
  );
}
