import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealObserver } from "@/components/reveal";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cmaxfoundation.org",
  ),
  title: {
    default: "CMAX Foundation — Prepared before disaster strikes",
    template: "%s — CMAX Foundation",
  },
  description:
    "CMAX Foundation advances rapid habitat, emergency response capacity and preparedness for communities affected by disasters, displacement and complex emergencies.",
  openGraph: {
    type: "website",
    siteName: "CMAX Foundation",
    images: [
      {
        url: "/images/content/stories/cmax-ready-to-deploy.webp",
        width: 1100,
        height: 564,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
