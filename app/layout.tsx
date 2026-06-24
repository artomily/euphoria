import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
import { getConfig } from "@/lib/wagmi/config";
import { Providers } from "./providers";
import { InlineScript } from "@/components/layout/inline-script";

const THEME_INIT = "try{var t=localStorage.getItem('euphoria-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Euphoria — Trade Market Emotions, Not Charts",
    template: "%s | Euphoria",
  },
  description:
    "AI-powered market psychology platform for BNB Chain traders. Quantify crowd FOMO, identify narratives, and get AI debate verdicts before you trade.",
  keywords: ["BNB Chain", "DeFi", "market psychology", "FOMO", "AI trading", "crypto"],
  openGraph: {
    title: "Euphoria — Trade Market Emotions, Not Charts",
    description: "AI-powered market psychology for BNB Chain traders.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Apply the saved theme before paint to avoid a flash of the wrong theme. */}
        <InlineScript html={THEME_INIT} />
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
