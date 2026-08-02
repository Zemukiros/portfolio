import Reveal from "./Reveal";

export default function Section({
  id,
  kicker,
  title,
  children,
  className = "",
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20 ${className}`}>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          {kicker}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <div className="mt-3 h-px w-16 bg-accent/50" aria-hidden="true" />
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}
