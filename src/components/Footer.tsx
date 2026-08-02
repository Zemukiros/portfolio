import { profile, isLinkedInPlaceholder } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-ink-faint sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.shortName} · {profile.location}
        </p>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-ink"
          >
            Email
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          {isLinkedInPlaceholder() ? (
            <span title="LinkedIn link coming soon">LinkedIn (soon)</span>
          ) : (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
