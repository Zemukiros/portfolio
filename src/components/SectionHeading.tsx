import Reveal from "./Reveal";

/**
 * Editorial section opening: mono eyebrow (`01 — About`), two-line serif headline whose
 * last phrase is Field Green with a green period, and an optional lede on the right.
 */
export default function SectionHeading({
  title,
  accent,
  lede,
  index,
  label,
}: {
  title: string;
  accent?: string;
  lede?: string;
  index?: string;
  label?: string;
}) {
  return (
    <Reveal>
      {label && (
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          {index && <span className="text-accent-strong">{index}</span>}
          {index && " — "}
          {label}
        </p>
      )}
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
        <h2 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-none tracking-[-0.02em] text-ink">
          {title}
          {accent && (
            <>
              <br />
              <span className="text-accent">
                {accent}.
              </span>
            </>
          )}
          {!accent && <span className="text-accent">.</span>}
        </h2>
        {lede && <p className="max-w-md text-[15px] leading-relaxed text-ink-dim lg:justify-self-end">{lede}</p>}
      </div>
    </Reveal>
  );
}
