import type { Metadata } from "next";
import { Black_Han_Sans, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangContext";
import CPPChat from "@/components/CPPChat";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-black-han",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-mono",
});

export const metadata: Metadata = {
  title: "Cell Phone Paradise — Wilmington's Phone Champion",
  description:
    "Wilmington's oldest and most complete phone store. Screen repair, battery replacement, water damage, and more. Owner-operated by Mr. Harry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${blackHanSans.variable} ${shareTechMono.variable}`}>
      <body>
        <LangProvider>
          {children}
          <CPPChat />
        </LangProvider>
      </body>
    </html>
  );
}
