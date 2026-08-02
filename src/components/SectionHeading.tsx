import Reveal from "./Reveal";

/** Shared section heading: big display title, violet accent word, accent period. */
export default function SectionHeading({
  title,
  accent,
  lede,
}: {
  title: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        {title}
        {accent && <span className="text-accent-strong"> {accent}</span>}
        <span className="text-accent">.</span>
      </h2>
      {lede && <p className="mt-4 text-lg leading-relaxed text-ink-dim">{lede}</p>}
    </Reveal>
  );
}
