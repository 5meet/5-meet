import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { AppToaster } from "@/components/ui/Sonner";
import GNB from "@/components/layout/GNB/GNB";

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
      <body className="min-h-full ">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <GNB />

            <div className="flex flex-1 flex-col">{children}</div>
          </div>

          <AppToaster />
        </Providers>
      </body>
    </html>
  );
}
