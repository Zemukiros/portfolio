import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: {
    default: `${profile.shortName} — Software Engineer`,
    template: `%s — ${profile.shortName}`,
  },
  description:
    "Software engineer focused on backend, AI-enabled systems, and cloud architecture. Java, Spring Boot, Python, TypeScript, PostgreSQL, AWS.",
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
      "Backend, AI-enabled systems, and cloud architecture — with tested, benchmarked, documented projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
