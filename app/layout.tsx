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
  metadataBase: new URL("https://harshit.page"),
  title: {
    default: "Harshit Singh | Portfolio & Website",
    template: "%s | Harshit Singh"
  },
  description: "Official website of Harshit Singh. I design and engineer interactive web, software, and AI projects with a focus on clarity, performance, and meaningful user experience.",
  keywords: ["Harshit", "Harshit Singh", "Harshit website", "Harshit portfolio", "LeonCyriac", "harshitkumar9030", "software engineer", "web developer", "AI developer"],
  authors: [{ name: "Harshit Singh" }],
  creator: "Harshit Singh",
  openGraph: {
    title: "Harshit Singh | Portfolio",
    description: "Official website of Harshit Singh. I design and engineer interactive web, software, and AI projects.",
    url: "https://harshit.page",
    siteName: "Harshit Singh",
    images: [{ url: "/ogimagep.png", width: 1200, height: 630, alt: "Harshit Singh" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshit Singh | Portfolio",
    description: "Official website of Harshit Singh. I design and engineer interactive web, software, and AI projects.",
    images: ["/ogimagep.png"],
  },
  alternates: {
    canonical: "https://harshit.page",
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
