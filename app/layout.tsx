import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interviewलो",
  description: "Prepare for you next interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: "#000000" }}>
      <body
        className={`${monaSans.className} antialiased pattern bg-black text-white min-h-screen`}
      >
        {children}

        <Toaster />
      </body>
    </html>
  );
}
