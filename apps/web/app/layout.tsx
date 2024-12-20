import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Splitwisely - Easily Split Expenses with Friends",
  description:
    "Splitwisely helps you split bills, track expenses, and settle debts with friends and roommates. Simple, fast, and hassle-free expense sharing.",
  keywords:
    "expense splitting, bill sharing, roommate expenses, group expenses, money management, split bills",
  authors: [{ name: "Splitwisely" }],
  openGraph: {
    title: "Splitwisely - Easily Split Expenses with Friends",
    description: "Split bills and track expenses with friends effortlessly",
    type: "website",
    siteName: "Splitwisely",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splitwisely - Easily Split Expenses with Friends",
    description: "Split bills and track expenses with friends effortlessly",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
