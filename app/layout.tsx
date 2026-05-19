import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "@/components/provider/smooth-scroller";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harshit",
  description: "I design and engineer interactive web, software, and AI projects with a focus on clarity, performance, and meaningful user experience.",
  openGraph: {
    title: "Harshit",
    description: "I design and engineer interactive web, software, and AI projects with a focus on clarity, performance, and meaningful user experience.",
    images: [{ url: "/ogimagep.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshit",
    description: "I design and engineer interactive web, software, and AI projects with a focus on clarity, performance, and meaningful user experience.",
    images: ["/ogimagep.png"],
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
