import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 pb-28 pt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.shortName}
        </p>
        <p>{profile.location} · Built with Next.js, deployed on Vercel</p>
      </div>
    </footer>
  );
}
