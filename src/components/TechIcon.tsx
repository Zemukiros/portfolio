import * as si from "simple-icons";

type SimpleIcon = { title: string; path: string; hex: string };

const icons = si as unknown as Record<string, SimpleIcon>;

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
  const fill = `#${icon.hex}`; // true brand color, never recolored
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
      className="inline-flex items-center justify-center rounded font-body font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        color: "#232F3E", // AWS "squid ink" — the brand's text color on light surfaces
        letterSpacing: "-0.02em",
      }}
    >
      AWS
    </span>
  );
}
