import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import Providers from "./provider";
=======
import { AppToaster } from "@/components/ui/Sonner";
>>>>>>> d6fb9085ba90067421eff430735fc8c91b05a361

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "5:MEET",
  description: "5:MEET",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
<<<<<<< HEAD
        <Providers>{children}</Providers>
=======
        {children}
        <AppToaster />
>>>>>>> d6fb9085ba90067421eff430735fc8c91b05a361
      </body>
    </html>
  );
}
