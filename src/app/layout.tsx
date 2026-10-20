import type { Metadata, Viewport } from "next";
import { Archivo_Black, Caveat, Inter_Tight } from "next/font/google";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothAnchors } from "@/components/SmoothAnchors";
import { site } from "@/content";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
  // Only used for small notes, mostly below the fold.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [{ url: "/og.png", alt: site.ogAlt }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f10",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${archivoBlack.variable} ${interTight.variable} ${caveat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that JS is running so scroll reveals only hide content when they can show it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <RevealObserver />
        <SmoothAnchors />
      </body>
    </html>
  );
}
