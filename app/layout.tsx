import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "@/components/provider/smooth-scroller";
import { SITE_URL } from "@/lib/seo";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Harshit Singh · Software Engineer for Web and AI",
    template: "%s · Harshit Singh",
  },
  description: "Harshit Singh is a software engineer and creative developer building interactive web, AI, and product experiences.",
  applicationName: "Harshit Singh",
  keywords: ["Harshit Singh", "Harshit portfolio", "software engineer", "creative developer", "web developer", "AI developer", "harshitkumar9030"],
  authors: [{ name: "Harshit Singh" }],
  creator: "Harshit Singh",
  publisher: "Harshit Singh",
  category: "Technology",
  robots: {
    googleBot: {
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${space.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FDFBF7] text-[#2C2C2C] selection:bg-[#B5D8EB] selection:text-[#2C2C2C]">
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}
