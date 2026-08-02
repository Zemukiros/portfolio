import * as si from "simple-icons";

type SimpleIcon = { title: string; path: string; hex: string };

const icons = si as unknown as Record<string, SimpleIcon>;

/** Brand marks that are too dark for the dark background get lifted. */
const LIFT: Record<string, string> = {
  siOpenjdk: "#e8e6f0",
  siNextdotjs: "#f1eef9",
  siVercel: "#f1eef9",
  siGithub: "#e8e6f0",
  siDjango: "#2ba977",
  siNumpy: "#4d77cf",
  siPandas: "#8b5cf6",
};

export function TechIcon({
  slug,
  size = 34,
  className = "",
  title,
}: {
  slug: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const icon = icons[slug];
  if (!icon) return null;
  const fill = LIFT[slug] ?? `#${icon.hex}`;
  return (
    <svg
      role="img"
      aria-label={title ?? icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <title>{title ?? icon.title}</title>
      <path d={icon.path} fill={fill} />
    </svg>
  );
}

/** AWS wordmark chip — simple-icons no longer ships the AWS brand mark. */
export function AwsMark({ size = 34 }: { size?: number }) {
  return (
    <span
      aria-label="Amazon Web Services"
      title="AWS — Certified Solutions Architect Associate"
      className="inline-flex items-center justify-center rounded font-display font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        color: "#FF9900",
        letterSpacing: "-0.02em",
      }}
    >
      AWS
    </span>
  );
}
