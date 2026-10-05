import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import FloatingNav from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: {
    default: `${profile.shortName} — Software Engineer`,
    template: `%s — ${profile.shortName}`,
  },
  description:
    "Software engineer building backend and AI-enabled systems. Java, Spring Boot, Python, TypeScript, PostgreSQL, AWS — with tested, benchmarked, shipped projects.",
  keywords: [
    "software engineer",
    "backend engineer",
    "Java",
    "Spring Boot",
    "Python",
    "AWS",
    "portfolio",
  ],
  openGraph: {
    title: `${profile.shortName} — Software Engineer`,
    description:
      "Backend, AI-enabled systems, and cloud architecture — tested, benchmarked, shipped.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div
          hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: `<!-- impeccable:direction-contract
THESIS: Paper & Field — a light editorial engineering notebook where shipped systems read clearly. Refuses the dark-gradient-card portfolio and the template collage.
OWN-WORLD: Warm paper ground (#f4f2ea), ink type (#18211a), one forest-green accent (#2f6a3b); Instrument Serif headlines at regular weight, Inter body, JetBrains Mono for data; hairlines over shadows; one product-true 3D object (Mini-S3 hash ring).
STORY: Recruiter lands, reads a calm name and a one-line thesis, opens a project row, sees real evidence, writes an email.
FIRST VIEWPORT: Framed full-bleed hero with centered serif greeting, one-line tagline, three pill links; frame insets on scroll as the paper page rises.
FORM: User-pinned light editorial reference (structure and genre only; code, copy, imagery original). DESIGN.md is the contract.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <Footer />
        <FloatingNav />
      </body>
    </html>
  );
}
