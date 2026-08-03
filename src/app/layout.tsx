import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
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
THESIS: A signal-violet studio-dark stage where one engineer's systems perform — the route graph computes on arrival. Refuses the resume-pasted-into-a-dark-template page and the terminal-costume page.
OWN-WORLD: Near-black violet ground (#07060c), one committed violet (#8b5cf6) carrying route, CTAs, and glow; Bricolage Grotesque display at heavy weights; brand-color tech marks as the only polychrome; soft radial atmospheres, 24px-radius panels.
STORY: Recruiter lands, sees a name and a working system, believes this person ships, clicks a project or writes an email.
FIRST VIEWPORT: Left: greeting, giant two-line name, role line, social row, two CTAs. Right: animated route-graph drawing itself, ranking chip landing last. Primary action = View my work.
FORM: User-pinned reference direction (dark/violet/bold); no seed roll — pinned brief beats the roll.
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
        <IntroLoader />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
