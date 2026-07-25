import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/inter";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import { DisplaySettings, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { MotionProvider } from "../components/MotionProvider";

const siteUrl = "https://visoraai-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "VisoraAI | Printed text, made audible", template: "%s | VisoraAI" },
  description: "VisoraAI is a portable assistive vision system that detects printed pages, recognizes their text, and reads the result aloud.",
  alternates: { canonical: "/" },
  openGraph: { title: "VisoraAI | Printed text, made audible", description: "Independent assistive computer vision for reading printed text aloud.", url: siteUrl, siteName: "VisoraAI", type: "website" },
  twitter: { card: "summary_large_image", title: "VisoraAI", description: "Printed text, made audible." },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { themeColor: "#f1efe7", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><MotionProvider />{children}<SiteFooter /><DisplaySettings /></body></html>;
}
